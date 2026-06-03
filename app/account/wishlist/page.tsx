"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight, Bike as BikeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWishlist, removeFromWishlist, type WishlistItem } from "@/lib/wishlistStore";
import { formatPrice } from "@/lib/utils";
import { BikeTypeBadge } from "@/components/shared/BikeTypeBadge";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  function load() { setItems(getWishlist()); }
  useEffect(() => { load(); }, []);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-5 w-5 text-red-400 fill-red-400" />
        <div>
          <h1 className="text-2xl font-black">Saved Bikes</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Bikes you&apos;ve added to your wishlist.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center space-y-4">
          <Heart className="h-10 w-10 text-muted-foreground/20 mx-auto" />
          <p className="text-muted-foreground">No saved bikes yet.</p>
          <Button asChild size="sm">
            <Link href="/browse">Browse Bikes <ArrowRight className="h-3.5 w-3.5 ml-1.5" /></Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.bike_id} className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="h-14 w-18 rounded-lg border border-border bg-surface-3 flex items-center justify-center flex-shrink-0 px-4">
                  <BikeIcon className="h-6 w-6 text-brand" />
                </div>
                <button
                  onClick={() => { removeFromWishlist(item.bike_id); load(); }}
                  className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div>
                <BikeTypeBadge type={item.bike.type} />
                <h3 className="font-bold mt-1.5">
                  {item.bike.year} {item.bike.brand} {item.bike.model}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.bike.agency?.name ?? ""} · {item.bike.agency?.city ?? ""}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-black text-brand">{formatPrice(item.bike.daily_rate)}<span className="text-xs font-normal text-muted-foreground">/day</span></span>
                <Button asChild size="sm" variant="outline" className="gap-1.5">
                  <Link href={`/browse/${item.bike_id}`}>
                    View <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
