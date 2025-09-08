import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const { products, loading: productsLoading } = useProducts(selectedCategory);
  const { categories, loading: categoriesLoading } = useCategories();

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

        {/* Categories */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
          <div className="flex gap-4 mb-6">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              onClick={() => setSelectedCategory(undefined)}
            >
              All Products
            </Button>
            {categoriesLoading ? (
              <>
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </>
            ) : (
              categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory 
              ? categories.find(c => c.id === selectedCategory)?.name || 'Products'
              : 'All Products'
            }
          </h2>
          
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
