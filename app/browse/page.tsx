"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, ArrowUpDown, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { BikeGrid } from "@/components/marketplace/BikeGrid";
import { useBikes } from "@/lib/hooks/useBikes";
import type { SearchFilters } from "@/types";

export default function BrowsePage() {
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState<SearchFilters>({});
  const { bikes: rawBikes, loading } = useBikes(filters);

  const bikes = [...rawBikes].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":  return a.daily_rate - b.daily_rate;
      case "price_desc": return b.daily_rate - a.daily_rate;
      case "rating":     return (b.rating ?? 0) - (a.rating ?? 0);
      case "newest":     return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:           return 0;
    }
  });

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2">Browse Bikes</h1>
          <p className="text-muted-foreground">Find the perfect motorcycle for your next ride</p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-2 flex-shrink-0">
          <Link href="/browse/map">
            <Map className="h-4 w-4" /> Map View
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterPanel onFiltersChange={setFilters} />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <div className="mt-6">
                    <FilterPanel onFiltersChange={setFilters} />
                  </div>
                </SheetContent>
              </Sheet>

              <span className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{bikes.length}</span> bikes found
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <BikeGrid bikes={bikes} loading={loading} />
        </div>
      </div>
    </div>
  );
}
