import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import ProductFiltersComponent from '@/components/ProductFilters';
import { useProducts, useCategories, type ProductFilters } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [filters, setFilters] = useState<ProductFilters>({});
  const { products, loading: productsLoading } = useProducts(filters);
  const { categories, loading: categoriesLoading } = useCategories();

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to TechStore</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover the latest tech gadgets and trendy clothing
          </p>
        </section>

        {/* Search & Filters */}
        <section className="mb-8">
          <ProductFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={categories}
          />
        </section>

        {/* Products Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {filters.categoryId 
                ? categories.find(c => c.id === filters.categoryId)?.name || 'Products'
                : filters.search
                ? `Search results for "${filters.search}"`
                : 'All Products'
              }
            </h2>
            <div className="text-sm text-muted-foreground">
              {productsLoading ? 'Loading...' : `${products.length} products found`}
            </div>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
