import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Edit, Trash2, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import StarRating from '@/components/StarRating';
import ReviewForm from '@/components/ReviewForm';
import { useReviews, useReviewActions } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewsListProps {
  productId: string;
}

const ReviewsList = ({ productId }: ReviewsListProps) => {
  const { user } = useAuth();
  const { reviews, loading, refetch } = useReviews(productId);
  const { deleteReview } = useReviewActions();
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const handleDelete = async (reviewId: string) => {
    const result = await deleteReview(reviewId);
    if (!result.error) {
      refetch();
    }
  };

  const handleEditSuccess = () => {
    setEditingReviewId(null);
    refetch();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          {editingReviewId === review.id ? (
            <ReviewForm
              productId={productId}
              existingReview={review}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingReviewId(null)}
            />
          ) : (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(review.profiles?.first_name, review.profiles?.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">
                          {review.profiles?.first_name && review.profiles?.last_name
                            ? `${review.profiles.first_name} ${review.profiles.last_name}`
                            : 'Anonymous User'
                          }
                        </h4>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                        {review.updated_at !== review.created_at && (
                          <span className="ml-1">(edited)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {user?.id === review.user_id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingReviewId(review.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(review.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              
              {review.comment && (
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{review.comment}</p>
                  
                  <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful_count})
                    </Button>
                  </div>
                </CardContent>
              )}
            </>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ReviewsList;