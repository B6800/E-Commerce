import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import StarRating from '@/components/StarRating';
import { useReviewStats } from '@/hooks/useReviews';

interface ReviewSummaryProps {
  productId: string;
}

const ReviewSummary = ({ productId }: ReviewSummaryProps) => {
  const { stats, loading } = useReviewStats(productId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-2 flex-1" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (stats.totalReviews === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No reviews yet. Be the first to review this product!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</span>
            <div>
              <StarRating rating={stats.averageRating} size="md" />
              <p className="text-sm text-muted-foreground">
                Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating];
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm">{rating}</span>
                  <StarRating rating={1} size="sm" />
                </div>
                <Progress 
                  value={percentage} 
                  className="flex-1 h-2" 
                />
                <span className="text-sm text-muted-foreground w-8">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSummary;