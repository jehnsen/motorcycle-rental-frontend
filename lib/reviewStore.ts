export interface StoredReview {
  id: string;
  booking_id: string;
  bike_id: string;
  agency_id: string;
  renter_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const KEY = "rnr_reviews";

export function getReviews(bikeId?: string): StoredReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const all = raw ? (JSON.parse(raw) as StoredReview[]) : [];
    return bikeId ? all.filter((r) => r.bike_id === bikeId) : all;
  } catch {
    return [];
  }
}

export function addReview(
  data: Omit<StoredReview, "id" | "created_at">
): StoredReview {
  const review: StoredReview = {
    ...data,
    id: `review-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const existing = getReviews();
  localStorage.setItem(KEY, JSON.stringify([review, ...existing]));
  return review;
}

export function hasReviewed(bookingId: string): boolean {
  return getReviews().some((r) => r.booking_id === bookingId);
}
