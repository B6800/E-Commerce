import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StarRating from '@/components/StarRating';
import { useReviewActions } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewFormProps {
  productId: string;
  existingReview?: {
    id: string;
    rating: number;
    comment?: string;
  } | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ReviewForm = ({ productId, existingReview, onSuccess, onCancel }: ReviewFormProps) => {
  const { user } = useAuth();
  const { addReview, updateReview, loading } = useReviewActions();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    if (rating === 0) return;

    let result;
    if (existingReview) {
      result = await updateReview(existingReview.id, rating, comment);
    } else {
      result = await addReview(productId, rating, comment);
    }

    if (!result.error) {
      setRating(0);
      setComment('');
      onSuccess?.();
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to write a review</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingReview ? 'Update Your Review' : 'Write a Review'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating *</Label>
            <StarRating
              rating={rating}
              interactive={true}
              onRatingChange={setRating}
              size="lg"
            />
            {rating === 0 && (
              <p className="text-sm text-muted-foreground">Please select a rating</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Review (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={loading || rating === 0}
            >
              {loading 
                ? (existingReview ? 'Updating...' : 'Submitting...') 
                : (existingReview ? 'Update Review' : 'Submit Review')
              }
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
//Comment