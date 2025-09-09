import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const StarRating = ({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  showNumber = false,
  interactive = false,
  onRatingChange,
  className
}: StarRatingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, i) => {
          const starNumber = i + 1;
          const isFilled = starNumber <= rating;
          const isPartiallyFilled = starNumber - 0.5 <= rating && starNumber > rating;

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleStarClick(starNumber)}
              disabled={!interactive}
              className={cn(
                "relative",
                interactive && "cursor-pointer hover:scale-110 transition-transform",
                !interactive && "cursor-default"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  isFilled || isPartiallyFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-transparent text-muted-foreground"
                )}
              />
              {isPartiallyFilled && (
                <Star
                  className={cn(
                    sizeClasses[size],
                    "absolute inset-0 fill-yellow-400 text-yellow-400",
                    "clip-path-[inset(0_50%_0_0)]"
                  )}
                  style={{ clipPath: 'inset(0 50% 0 0)' }}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {showNumber && (
        <span className={cn("font-medium text-muted-foreground ml-1", textSizeClasses[size])}>
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;