import Link from "next/link";
import { CheckCircle2, MapPin, Star, Clock } from "lucide-react";
import type { Agency } from "@/types";
import { getInitials } from "@/lib/utils";

interface AgencyCardProps {
  agency: Agency;
  variant?: "default" | "compact";
}

export function AgencyCard({ agency, variant = "default" }: AgencyCardProps) {
  if (variant === "compact") {
    return (
      <Link href={`/agencies/${agency.slug}`} className="block group">
        <div className="rounded-xl border border-border bg-surface p-4 card-hover flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-surface-3 border border-border flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-black text-muted-foreground">{getInitials(agency.name)}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-sm truncate group-hover:text-brand transition-colors">{agency.name}</h3>
              {agency.is_verified && <CheckCircle2 className="h-3.5 w-3.5 text-brand flex-shrink-0" />}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {agency.city}
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-400">
                <Star className="h-3 w-3 fill-amber-400" /> {agency.rating}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/agencies/${agency.slug}`} className="block group">
      <article className="rounded-xl border border-border bg-surface overflow-hidden card-hover">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-br from-surface-3 to-surface asphalt-texture relative">
          {agency.is_verified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-brand/20 border border-brand/30 px-2 py-0.5">
              <CheckCircle2 className="h-3 w-3 text-brand" />
              <span className="text-xs font-semibold text-brand">Verified</span>
            </div>
          )}
        </div>

        <div className="p-4 -mt-6">
          {/* Avatar */}
          <div className="h-12 w-12 rounded-xl bg-surface-3 border-2 border-surface flex items-center justify-center mb-3">
            <span className="text-lg font-black text-muted-foreground">{getInitials(agency.name)}</span>
          </div>

          <h3 className="font-bold text-base group-hover:text-brand transition-colors">{agency.name}</h3>

          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {agency.city}</span>
            <span className="flex items-center gap-1 text-amber-400"><Star className="h-3 w-3 fill-amber-400" /> {agency.rating} ({agency.total_reviews})</span>
          </div>

          {agency.response_time && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Responds in {agency.response_time}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
