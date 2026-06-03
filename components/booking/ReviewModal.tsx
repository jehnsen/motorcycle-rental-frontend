"use client";

import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addReview } from "@/lib/reviewStore";

interface Props {
  open: boolean;
  onClose: () => void;
  booking: {
    id: string;
    bike_id: string;
    agency_id: string;
    bike_name: string;
  };
  onSubmitted?: () => void;
}

export function ReviewModal({ open, onClose, booking, onSubmitted }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    addReview({
      booking_id: booking.id,
      bike_id: booking.bike_id,
      agency_id: booking.agency_id,
      renter_name: "You",
      rating,
      comment: comment.trim(),
    });
    setSubmitting(false);
    setDone(true);
    setTimeout(() => {
      onSubmitted?.();
      onClose();
      setDone(false);
      setRating(0);
      setComment("");
    }, 1200);
  }

  const displayRating = hovered || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-black">Leave a review</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{booking.bike_name}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-6 space-y-2">
            <Star className="h-10 w-10 text-amber-400 mx-auto fill-amber-400" />
            <p className="font-bold">Thanks for your review!</p>
            <p className="text-sm text-muted-foreground">Your feedback helps other renters.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star picker */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Your rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= displayRating
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {displayRating > 0 && (
                <p className="text-xs text-muted-foreground">
                  {["", "Poor", "Fair", "Good", "Very good", "Excellent"][displayRating]}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Comment (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your experience? Condition of the bike, pickup process, agency service…"
                rows={4}
                className="w-full rounded-lg border border-border bg-surface-3 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-bold"
              disabled={rating === 0 || submitting}
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting…</>
              ) : (
                "Submit Review"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
