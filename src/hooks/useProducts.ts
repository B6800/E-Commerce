import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  type CatalogProduct,
} from '@/data/mockCatalog';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  stock_quantity: number;
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

const filterMockProducts = (filters: ProductFilters): CatalogProduct[] => {
  const search = filters.search?.trim().toLowerCase();

  const products = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = !search
      || product.name.toLowerCase().includes(search)
      || product.description?.toLowerCase().includes(search);
    const matchesCategory = !filters.categoryId || product.category.id === filters.categoryId;
    const matchesMin = filters.minPrice === undefined || product.price >= filters.minPrice;
    const matchesMax = filters.maxPrice === undefined || product.price <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesMin && matchesMax;
  });

  return [...products].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
      default:
        return Date.parse(b.created_at) - Date.parse(a.created_at);
    }
  });
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
      setProducts(data && data.length > 0 ? data : filterMockProducts(filters));
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
      setCategories(data && data.length > 0 ? data : MOCK_CATEGORIES);
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
      setProduct(data);
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
