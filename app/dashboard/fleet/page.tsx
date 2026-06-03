import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { FleetTable } from "@/components/dashboard/FleetTable";
import type { Bike, Agency } from "@/types";
import type { Database } from "@/lib/supabase/types";

export default async function FleetPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: agencyData } = await supabase
    .from("moto_agencies")
    .select("*")
    .limit(1)
    .single();

  const agency = agencyData as unknown as Agency | null;

  const { data: bikesData } = agency
    ? await supabase
        .from("moto_bikes")
        .select("*, agency:moto_agencies(*)")
        .eq("agency_id", agency.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const bikes = (bikesData as unknown as Bike[]) ?? [];

  return (
    <div className="p-6 lg:p-8">
      <FleetTable bikes={bikes} />
    </div>
  );
}
