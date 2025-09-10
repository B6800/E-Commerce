import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment?: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export const useReviews = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!fk_reviews_profiles (
            first_name,
            last_name
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { reviews, loading, error, refetch: fetchReviews };
};

export const useReviewStats = (productId: string) => {
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchStats();
    }
  }, [productId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);

      if (error) throw error;

      const ratings = data || [];
      const totalReviews = ratings.length;
      
      if (totalReviews === 0) {
        setStats({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
        return;
      }

      const averageRating = ratings.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
      
      const ratingDistribution = ratings.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {} as { [key: number]: number });

      // Ensure all rating levels are present
      for (let i = 1; i <= 5; i++) {
        if (!ratingDistribution[i]) {
          ratingDistribution[i] = 0;
        }
      }

      setStats({
        averageRating,
        totalReviews,
        ratingDistribution
      });
    } catch (err) {
      console.error('Error fetching review stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
};

export const useReviewActions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const addReview = async (productId: string, rating: number, comment?: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to write a review",
        variant: "destructive"
      });
      return { error: 'Not authenticated' };
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          product_id: productId,
          rating,
          comment
        });

      if (error) throw error;

      toast({
        title: "Review added",
        description: "Your review has been added successfully"
      });

      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId: string, rating: number, comment?: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      setLoading(true);
      const { error } = await supabase
        .from('reviews')
        .update({
          rating,
          comment,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Review updated",
        description: "Your review has been updated successfully"
      });

      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      setLoading(true);
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Review deleted",
        description: "Your review has been deleted successfully"
      });

      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { addReview, updateReview, deleteReview, loading };
};

export const useUserReview = (productId: string) => {
  const { user } = useAuth();
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && productId) {
      fetchUserReview();
    } else {
      setUserReview(null);
    }
  }, [user, productId]);

  const fetchUserReview = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setUserReview(data);
    } catch (err) {
      console.error('Error fetching user review:', err);
    } finally {
      setLoading(false);
    }
  };

  return { userReview, loading, refetch: fetchUserReview };
};