import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({ rating, totalReviews, size = "sm", className }: RatingStarsProps) {
  const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i < Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : i < rating
                ? "fill-amber-400/50 text-amber-400"
                : "fill-transparent text-muted-foreground"
            )}
          />
        ))}
      </div>
      <span className={cn("font-medium text-foreground", textSize)}>{rating.toFixed(1)}</span>
      {totalReviews !== undefined && (
        <span className={cn("text-muted-foreground", textSize)}>({totalReviews})</span>
      )}
    </div>
  );
}
