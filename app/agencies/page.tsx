import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AgencyCard } from "@/components/marketplace/AgencyCard";
import type { Agency } from "@/types";
import type { Database } from "@/lib/supabase/types";

export default async function AgenciesPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const [{ data: agenciesData }, { count: bikeCount }] = await Promise.all([
    supabase
      .from("moto_agencies")
      .select("*")
      .order("rating", { ascending: false }),
    supabase
      .from("moto_bikes")
      .select("*", { count: "exact", head: true }),
  ]);

  const agencies = (agenciesData as unknown as Agency[]) ?? [];
  const cities = Array.from(new Set(agencies.map((a) => a.city))).length;

  return (
    <div className="container py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black">Rental Agencies</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Verified operators across Metro Manila, Cebu, and Baguio
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { label: "Verified agencies", value: agencies.filter((a) => a.is_verified).length },
          { label: "Cities covered", value: cities || 3 },
          { label: "Total bikes", value: bikeCount ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface p-5 text-center">
            <p className="text-3xl font-black text-brand">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {agencies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-4xl mb-4">🏢</span>
          <p className="text-muted-foreground">No agencies yet — run the seed to populate data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map((agency) => (
            <AgencyCard key={agency.id} agency={agency} />
          ))}
        </div>
      )}
    </div>
  );
}
