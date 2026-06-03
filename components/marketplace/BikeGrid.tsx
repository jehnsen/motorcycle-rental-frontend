import type { Bike } from "@/types";
import { BikeCard } from "./BikeCard";

interface BikeGridProps {
  bikes: Bike[];
  loading?: boolean;
}

export function BikeGrid({ bikes, loading }: BikeGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface overflow-hidden animate-pulse">
            <div className="aspect-video bg-surface-3" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-surface-3 rounded w-3/4" />
              <div className="h-3 bg-surface-3 rounded w-1/2" />
              <div className="h-6 bg-surface-3 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bikes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
          <span className="text-3xl">🏍️</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">No bikes found</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Try adjusting your filters or search in a different location.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bikes.map((bike) => (
        <BikeCard key={bike.id} bike={bike} />
      ))}
    </div>
  );
}
