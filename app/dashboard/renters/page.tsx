"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RenterTable } from "@/components/dashboard/RenterCard";
import { useRenters } from "@/lib/hooks/useBookings";
import { createClient } from "@/lib/supabase/client";

export default function RentersPage() {
  const [search, setSearch] = useState("");
  const [agencyId, setAgencyId] = useState<string | undefined>();

  useEffect(() => {
    createClient()
      .from("moto_agencies")
      .select("id")
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setAgencyId((data as { id: string }).id); });
  }, []);

  const { renters, loading } = useRenters(agencyId);

  const filtered = renters.filter((r) =>
    r.full_name.toLowerCase().includes(search.toLowerCase()) ||
    r.license_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black">Renters</h1>
        <p className="text-muted-foreground mt-1">Manage renter verification and blacklist status</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total renters",  value: renters.length,                                   color: "text-foreground" },
          { label: "Verified",       value: renters.filter((r) => r.is_verified).length,      color: "text-emerald-400" },
          { label: "Blacklisted",    value: renters.filter((r) => r.is_blacklisted).length,   color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or license..."
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-surface-2 animate-pulse" />
          ))}
        </div>
      ) : (
        <RenterTable renters={filtered} />
      )}
    </div>
  );
}
