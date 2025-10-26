import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import ReviewSummary from '@/components/ReviewSummary';
import ReviewsList from '@/components/ReviewsList';
import ReviewForm from '@/components/ReviewForm';
import { useAuth } from '@/contexts/AuthContext';
import { useUserReview } from '@/hooks/useReviews';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id!);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const { userReview, refetch: refetchUserReview } = useUserReview(id!);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      await addToCart(product.id);
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    refetchUserReview();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <p>No Image Available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {product.category && (
                <Badge variant="secondary">
                  {product.category.name}
                </Badge>
              )}
              
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              <div className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </div>
              
              {product.description && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <span className="font-medium">Stock:</span>
                {product.stock_quantity > 0 ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {product.stock_quantity} available
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {product.stock_quantity > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="w-12 text-center font-semibold">
                        {quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        disabled={quantity >= product.stock_quantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddToCart}
                    size="lg" 
                    className="w-full"
                  >
                    Add to Cart ({quantity})
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <Separator className="mb-8" />
            
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
                {user && !userReview && !showReviewForm && (
                  <Button onClick={() => setShowReviewForm(true)}>
                    Write a Review
                  </Button>
                )}
              </div>

              <ReviewSummary productId={id!} />

              {showReviewForm && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
                  <ReviewForm
                    productId={id!}
                    onSuccess={handleReviewSuccess}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              <ReviewsList productId={id!} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
//Comment