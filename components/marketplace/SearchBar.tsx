"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const cities = ["Metro Manila", "Cebu City", "Baguio City"];
const bikeTypes = [
  { value: "all", label: "All Types" },
  { value: "big_bike", label: "Big Bikes" },
  { value: "naked", label: "Naked" },
  { value: "adventure", label: "Adventure" },
  { value: "scooter", label: "Scooter" },
];

interface SearchBarProps {
  variant?: "hero" | "inline";
}

export function SearchBar({ variant = "hero" }: SearchBarProps) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [bikeType, setBikeType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (bikeType !== "all") params.set("type", bikeType);
    if (startDate) params.set("from", startDate);
    if (endDate) params.set("to", endDate);
    router.push(`/browse?${params.toString()}`);
  };

  if (variant === "hero") {
    return (
      <div className="w-full rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-2 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-surface-3 px-4 py-3">
            <MapPin className="h-4 w-4 text-brand flex-shrink-0" />
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="border-0 bg-transparent p-0 h-auto text-sm focus:ring-0 shadow-none">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-surface-3 px-4 py-3">
            <Calendar className="h-4 w-4 text-brand flex-shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
              placeholder="From"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-surface-3 px-4 py-3">
            <Calendar className="h-4 w-4 text-brand flex-shrink-0" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
              placeholder="To"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-surface-3 px-4 py-3">
            <Bike className="h-4 w-4 text-brand flex-shrink-0" />
            <Select value={bikeType} onValueChange={setBikeType}>
              <SelectTrigger className="border-0 bg-transparent p-0 h-auto text-sm focus:ring-0 shadow-none">
                <SelectValue placeholder="Bike type" />
              </SelectTrigger>
              <SelectContent>
                {bikeTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-2">
          <Button onClick={handleSearch} size="lg" className="w-full gap-2 text-base font-bold">
            <Search className="h-5 w-5" />
            Find Bikes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search bikes, brands..." className="pl-10" />
      </div>
      <Select value={bikeType} onValueChange={setBikeType}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          {bikeTypes.map((t) => (
            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
