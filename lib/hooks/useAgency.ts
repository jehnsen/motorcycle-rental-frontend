"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Agency } from "@/types";

export function useAgencies() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgencies() {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("moto_agencies")
          .select("*")
          .order("rating", { ascending: false });
        if (error) throw error;
        setAgencies((data as unknown as Agency[]) ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load agencies");
      } finally {
        setLoading(false);
      }
    }
    fetchAgencies();
  }, []);

  return { agencies, loading, error };
}

export function useAgency(idOrSlug: string) {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgency() {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const isUuid = /^[0-9a-f-]{36}$/.test(idOrSlug);
        const { data, error } = await supabase
          .from("moto_agencies")
          .select("*")
          .eq(isUuid ? "id" : "slug", idOrSlug)
          .single();
        if (error) throw error;
        setAgency(data as unknown as Agency);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load agency");
      } finally {
        setLoading(false);
      }
    }
    fetchAgency();
  }, [idOrSlug]);

  return { agency, loading, error };
}
