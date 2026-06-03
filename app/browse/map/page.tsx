"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { List, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockBikes } from "@/lib/mock/bikes";
import { mockAgencies } from "@/lib/mock/agencies";
import type { MapPin as MapPinType } from "@/components/shared/LeafletMap";

const LeafletMap = dynamic(
  () => import("@/components/shared/LeafletMap").then((m) => m.LeafletMap),
  { ssr: false, loading: () => <div className="h-full w-full bg-surface-2 animate-pulse rounded-xl" /> }
);

// Approximate lat/lng for mock agencies (Philippine cities)
const AGENCY_COORDS: Record<string, [number, number]> = {
  "agency-1": [14.5547, 121.0244], // Makati
  "agency-2": [10.3157, 123.8854], // Cebu City
  "agency-3": [16.4023, 120.5960], // Baguio City
};

export default function MapViewPage() {
  const pins: MapPinType[] = mockAgencies.map((agency) => ({
    agency,
    bikes: mockBikes.filter((b) => b.agency_id === agency.id && b.is_available),
    lat: AGENCY_COORDS[agency.id]?.[0] ?? 14.5995,
    lng: AGENCY_COORDS[agency.id]?.[1] ?? 120.9842,
  }));

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-road/80 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand" />
          <h1 className="font-bold">Agency Map</h1>
          <span className="text-xs text-muted-foreground ml-1">{pins.length} agencies · Philippines</span>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/browse">
            <List className="h-4 w-4" /> List View
          </Link>
        </Button>
      </div>

      {/* Map */}
      <div className="flex-1 p-4">
        <LeafletMap pins={pins} center={[12.8797, 121.774]} zoom={6} />
      </div>

      {/* Agency legend */}
      <div className="flex-shrink-0 px-6 py-3 border-t border-border bg-road/80 backdrop-blur-md">
        <div className="flex gap-6 overflow-x-auto">
          {pins.map((pin) => (
            <div key={pin.agency.id} className="flex items-center gap-2 flex-shrink-0">
              <span className="h-3 w-3 rounded-full bg-brand" />
              <span className="text-xs text-muted-foreground">
                {pin.agency.name} — {pin.bikes.length} available
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
