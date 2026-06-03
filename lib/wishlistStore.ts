import type { Bike } from "@/types";

export interface WishlistItem {
  bike_id: string;
  bike: Bike;
  saved_at: string;
}

const KEY = "rnr_wishlist";

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function isWishlisted(bikeId: string): boolean {
  return getWishlist().some((item) => item.bike_id === bikeId);
}

export function toggleWishlist(bike: Bike): boolean {
  const current = getWishlist();
  const exists = current.find((item) => item.bike_id === bike.id);
  if (exists) {
    localStorage.setItem(KEY, JSON.stringify(current.filter((item) => item.bike_id !== bike.id)));
    return false;
  } else {
    const item: WishlistItem = { bike_id: bike.id, bike, saved_at: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify([item, ...current]));
    return true;
  }
}

export function removeFromWishlist(bikeId: string): void {
  const updated = getWishlist().filter((item) => item.bike_id !== bikeId);
  localStorage.setItem(KEY, JSON.stringify(updated));
}
