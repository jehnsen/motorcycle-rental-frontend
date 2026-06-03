"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bike, SearchFilters } from "@/types";

export function useBikes(filters?: SearchFilters) {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBikes() {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        let query = supabase
          .from("moto_bikes")
          .select("*, agency:moto_agencies(*)");

        if (filters?.bike_type && filters.bike_type !== "all") {
          query = query.eq("type", filters.bike_type);
        }
        if (filters?.min_price !== undefined) {
          query = query.gte("daily_rate", filters.min_price);
        }
        if (filters?.max_price !== undefined) {
          query = query.lte("daily_rate", filters.max_price);
        }
        if (filters?.brands && filters.brands.length > 0) {
          query = query.in("brand", filters.brands);
        }
        if (filters?.min_year !== undefined) {
          query = query.gte("year", filters.min_year);
        }
        if (filters?.max_year !== undefined) {
          query = query.lte("year", filters.max_year);
        }

        const { data, error } = await query;
        if (error) throw error;
        setBikes((data as unknown as Bike[]) ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load bikes");
      } finally {
        setLoading(false);
      }
    }
    fetchBikes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { bikes, loading, error };
}

export function useBike(id: string) {
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBike() {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("moto_bikes")
          .select("*, agency:moto_agencies(*)")
          .eq("id", id)
          .single();
        if (error) throw error;
        setBike(data as unknown as Bike);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load bike");
      } finally {
        setLoading(false);
      }
    }
    fetchBike();
  }, [id]);

  return { bike, loading, error };
}
