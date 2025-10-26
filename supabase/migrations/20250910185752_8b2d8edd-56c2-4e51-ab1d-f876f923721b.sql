-- Fix the relationship between reviews and profiles tables
-- The reviews.user_id should reference profiles.id, not auth.users.id directly

-- First, let's check if there are any existing foreign key constraints on reviews.user_id
-- and remove them if they exist
DO $$ 
BEGIN
    -- Drop the foreign key constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'fk_reviews_profiles' 
               AND table_name = 'reviews') THEN
        ALTER TABLE public.reviews DROP CONSTRAINT fk_reviews_profiles;
    END IF;
END $$;

-- Now add the correct foreign key constraint
ALTER TABLE public.reviews 
ADD CONSTRAINT fk_reviews_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
-- Insert sample products