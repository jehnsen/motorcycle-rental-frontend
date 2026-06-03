"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import type { SearchFilters, BikeType } from "@/types";
import { getBikeTypeLabel } from "@/lib/utils";

const bikeTypes: BikeType[] = ["big_bike", "naked", "adventure", "scooter"];
const brands = ["Yamaha", "Honda", "Kawasaki", "Royal Enfield", "Suzuki", "BMW", "Ducati"];

interface FilterPanelProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

export function FilterPanel({ onFiltersChange }: FilterPanelProps) {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedTypes, setSelectedTypes] = useState<BikeType[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleType = (type: BikeType) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updated);
    applyFilters(updated, selectedBrands, priceRange);
  };

  const toggleBrand = (brand: string) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updated);
    applyFilters(selectedTypes, updated, priceRange);
  };

  const applyFilters = (types: BikeType[], brands: string[], price: number[]) => {
    onFiltersChange({
      bike_type: types.length === 1 ? types[0] : "all",
      min_price: price[0],
      max_price: price[1],
      brands: brands.length > 0 ? brands : undefined,
    });
  };

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedTypes([]);
    setSelectedBrands([]);
    onFiltersChange({});
  };

  const hasFilters = selectedTypes.length > 0 || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000;

  return (
    <aside className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-brand" />
          <span className="font-semibold text-sm">Filters</span>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-brand transition-colors">
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      <Separator />

      {/* Price range */}
      <div className="space-y-4">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price per day
        </Label>
        <Slider
          min={0}
          max={5000}
          step={100}
          value={priceRange}
          onValueChange={(v) => {
            setPriceRange(v);
            applyFilters(selectedTypes, selectedBrands, v);
          }}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₱{priceRange[0].toLocaleString()}</span>
          <span>₱{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Separator />

      {/* Bike type */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Bike Type
        </Label>
        <div className="space-y-2">
          {bikeTypes.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => toggleType(type)}
              />
              <label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                {getBikeTypeLabel(type)}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brand */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Brand
        </Label>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
