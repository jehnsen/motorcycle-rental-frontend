import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Bike } from "@/types";
import { BikeTypeBadge } from "@/components/shared/BikeTypeBadge";
import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { formatPrice, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BikeCardProps {
  bike: Bike;
}

const typeGradients: Record<string, string> = {
  big_bike: "from-orange-900/40 to-surface-3",
  naked: "from-blue-900/40 to-surface-3",
  scooter: "from-emerald-900/40 to-surface-3",
  adventure: "from-amber-900/40 to-surface-3",
};

export function BikeCard({ bike }: BikeCardProps) {
  return (
    <Link href={`/browse/${bike.id}`} className="block group">
      <article className="rounded-xl border border-border bg-surface overflow-hidden card-hover h-full flex flex-col">
        {/* Image placeholder */}
        <div className={`relative aspect-video bg-gradient-to-br ${typeGradients[bike.type] ?? "from-surface-3 to-surface"} flex items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 asphalt-texture opacity-30" />
          <div className="relative text-center">
            <span className="text-5xl font-black text-foreground/10 select-none">
              {bike.brand[0]}
            </span>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{bike.brand} {bike.model}</p>
          </div>
          <div className="absolute top-3 left-3">
            <BikeTypeBadge type={bike.type} />
          </div>
          <div className="absolute top-3 right-3">
            <AvailabilityBadge isAvailable={bike.is_available} />
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4 flex-1">
          {/* Title row */}
          <div>
            <h3 className="font-bold text-foreground leading-tight group-hover:text-brand transition-colors">
              {bike.year} {bike.brand} {bike.model}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{bike.color}</p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <PriceDisplay amount={bike.daily_rate} period="/day" size="sm" />
            <span className="text-xs text-muted-foreground bg-surface-2 border border-border rounded-full px-2 py-0.5">
              {formatPrice(bike.deposit_amount)} deposit
            </span>
          </div>

          {/* Rating */}
          {bike.rating && (
            <RatingStars rating={bike.rating} totalReviews={bike.total_reviews} />
          )}

          {/* Agency */}
          {bike.agency && (
            <div className="flex items-center gap-2 pt-1 border-t border-border">
              <div className="h-6 w-6 rounded-full bg-surface-3 border border-border flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {getInitials(bike.agency.name)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground truncate">{bike.agency.name}</span>
              {bike.agency.is_verified && (
                <CheckCircle2 className="h-3.5 w-3.5 text-brand flex-shrink-0 ml-auto" />
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
