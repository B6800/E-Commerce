import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  getCatalogProductImage,
  type CatalogProduct,
} from '@/data/mockCatalog';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  stock_quantity: number;
  created_at?: string;
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

const sortProducts = <T extends Product>(products: T[], sortBy: ProductFilters['sortBy']): T[] =>
  [...products].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
      default:
        return Date.parse(b.created_at ?? '1970-01-01') - Date.parse(a.created_at ?? '1970-01-01');
    }
  });

const filterMockProducts = (
  filters: ProductFilters,
  selectedCategoryName?: string,
): CatalogProduct[] => {
  const search = filters.search?.trim().toLowerCase();

  const products = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = !search
      || product.name.toLowerCase().includes(search)
      || product.description?.toLowerCase().includes(search);
    const matchesCategory = !filters.categoryId
      || product.category.id === filters.categoryId
      || product.category.name === selectedCategoryName;
    const matchesMin = filters.minPrice === undefined || product.price >= filters.minPrice;
    const matchesMax = filters.maxPrice === undefined || product.price <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesMin && matchesMax;
  });

  return sortProducts(products, filters.sortBy);
};

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price-low' | 'price-high' | 'newest';
}

export const useProducts = (filters: ProductFilters = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [filters.search, filters.categoryId, filters.minPrice, filters.maxPrice, filters.sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          image_url,
          stock_quantity,
          created_at,
          category:categories (
            id,
            name
          )
        `)
        .eq('is_active', true);

      // Apply filters
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) throw error;

      let selectedCategoryName = MOCK_CATEGORIES.find(
        (category) => category.id === filters.categoryId,
      )?.name;

      if (filters.categoryId && !selectedCategoryName) {
        const { data: category } = await supabase
          .from('categories')
          .select('name')
          .eq('id', filters.categoryId)
          .maybeSingle();
        selectedCategoryName = category?.name;
      }

      const remoteProducts: Product[] = (data ?? []).map((product) => ({
        ...product,
        image_url: getCatalogProductImage(product.name, product.image_url),
      }));
      const localProducts = filterMockProducts(filters, selectedCategoryName);

      // Local products keep the storefront populated while database products
      // take precedence when the same product has been seeded in Supabase.
      const mergedProducts = new Map<string, Product>();
      localProducts.forEach((product) => mergedProducts.set(product.name.toLowerCase(), product));
      remoteProducts.forEach((product) => mergedProducts.set(product.name.toLowerCase(), product));

      setProducts(sortProducts([...mergedProducts.values()], filters.sortBy));
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts(filterMockProducts(filters));
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      const mergedCategories = new Map<string, Category>();
      MOCK_CATEGORIES.forEach((category) => mergedCategories.set(category.name.toLowerCase(), category));
      (data ?? []).forEach((category) => mergedCategories.set(category.name.toLowerCase(), category));
      setCategories([...mergedCategories.values()].sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories(MOCK_CATEGORIES);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchCategories };
};

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    const mockProduct = MOCK_PRODUCTS.find((item) => item.id === productId);
    if (mockProduct) {
      setProduct(mockProduct);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          image_url,
          stock_quantity,
          category:categories (
            id,
            name
          )
        `)
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProduct({
        ...data,
        image_url: getCatalogProductImage(data.name, data.image_url),
      });
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { product, loading, error, refetch: fetchProduct };
};
//Comment
