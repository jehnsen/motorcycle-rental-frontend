import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { BookingConfirmClient } from "@/components/booking/BookingConfirmClient";
import type { Database } from "@/lib/supabase/types";
import type { Bike } from "@/types";

interface Props {
  searchParams: { bikeId?: string; from?: string; to?: string };
}

async function getBike(bikeId: string): Promise<Bike | null> {
  try {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data } = await supabase
      .from("moto_bikes")
      .select("*, agency:moto_agencies(*)")
      .eq("id", bikeId)
      .single();
    if (data) return data as unknown as Bike;
  } catch {
    // Supabase not configured — fall through to mock
  }

  const { mockBikes } = await import("@/lib/mock/bikes");
  return mockBikes.find((b) => b.id === bikeId) ?? null;
}

export default async function BookingConfirmPage({ searchParams }: Props) {
  const { bikeId, from, to } = searchParams;

  if (!bikeId || !from || !to) notFound();

  const bike = await getBike(bikeId);
  if (!bike) notFound();

  return <BookingConfirmClient bike={bike} from={from} to={to} />;
}
