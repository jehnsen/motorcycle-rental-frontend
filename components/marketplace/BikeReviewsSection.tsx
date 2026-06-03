"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { getReviews, type StoredReview } from "@/lib/reviewStore";

interface Props {
  bikeId: string;
  staticRating: number;
  staticTotal: number;
}

function StarRow({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-2 text-muted-foreground">{stars}</span>
      <div className="flex-1 h-1.5 rounded-full bg-surface-3 overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs w-5 text-right text-muted-foreground">{count}</span>
    </div>
  );
}

export function BikeReviewsSection({ bikeId, staticRating, staticTotal }: Props) {
  const [reviews, setReviews] = useState<StoredReview[]>([]);

  useEffect(() => {
    setReviews(getReviews(bikeId));
  }, [bikeId]);

  const allRating = staticRating;
  const allTotal = staticTotal + reviews.length;

  const distrib = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  // Blend static distribution with user reviews
  const staticDist: Record<number, number> = {
    5: Math.round(staticTotal * 0.65),
    4: Math.round(staticTotal * 0.2),
    3: Math.round(staticTotal * 0.1),
    2: Math.round(staticTotal * 0.04),
    1: Math.round(staticTotal * 0.01),
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-5xl font-black">{allRating.toFixed(1)}</p>
          <div className="flex gap-0.5 mt-1 justify-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-4 w-4 ${s <= Math.round(allRating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{allTotal} review{allTotal !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {distrib.map(({ stars, count }) => (
            <StarRow
              key={stars}
              stars={stars}
              count={(staticDist[stars] ?? 0) + count}
              total={allTotal}
            />
          ))}
        </div>
      </div>

      {/* User-submitted reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-surface-2 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-xs font-bold text-brand">
                    {review.renter_name[0]}
                  </div>
                  <span className="text-sm font-semibold">{review.renter_name}</span>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3 w-3 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              )}
              <p className="text-xs text-muted-foreground/60">
                {formatDistanceToNow(parseISO(review.created_at), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Reviews from verified renters will appear here. Book a ride and leave the first review!
        </p>
      )}
    </div>
  );
}
