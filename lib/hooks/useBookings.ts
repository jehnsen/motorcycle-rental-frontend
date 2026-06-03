"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Booking, BookingStatus, Renter } from "@/types";

export function useBookings(agencyId?: string, status?: BookingStatus) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        let query = supabase
          .from("moto_bookings")
          .select("*, bike:moto_bikes(*), renter:moto_renters(*), agency:moto_agencies(*)")
          .order("created_at", { ascending: false });

        if (agencyId) query = query.eq("agency_id", agencyId);
        if (status) query = query.eq("status", status);

        const { data, error } = await query;
        if (error) throw error;
        setBookings((data as unknown as Booking[]) ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [agencyId, status]);

  return { bookings, loading, error };
}

export function useRenters(agencyId?: string) {
  const [renters, setRenters] = useState<Renter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRenters() {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();

        if (agencyId) {
          // renters who have booked with this agency
          const { data, error } = await supabase
            .from("moto_bookings")
            .select("renter:moto_renters(*)")
            .eq("agency_id", agencyId);
          if (error) throw error;
          const unique = new Map<string, Renter>();
          for (const row of (data ?? []) as unknown as { renter: Renter }[]) {
            if (row.renter) unique.set(row.renter.id, row.renter);
          }
          setRenters(Array.from(unique.values()));
        } else {
          const { data, error } = await supabase.from("moto_renters").select("*");
          if (error) throw error;
          setRenters((data as unknown as Renter[]) ?? []);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load renters");
      } finally {
        setLoading(false);
      }
    }
    fetchRenters();
  }, [agencyId]);

  return { renters, loading, error };
}
