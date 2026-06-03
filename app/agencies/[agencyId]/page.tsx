import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChevronLeft, MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BikeGrid } from "@/components/marketplace/BikeGrid";
import { RatingStars } from "@/components/shared/RatingStars";
import { createBuildClient } from "@/lib/supabase/build-client";
import { getInitials } from "@/lib/utils";
import type { Agency, Bike } from "@/types";
import type { Database } from "@/lib/supabase/types";

interface Props {
  params: { agencyId: string };
}

export async function generateStaticParams() {
  const supabase = createBuildClient();
  const { data } = await supabase.from("moto_agencies").select("slug");
  return ((data ?? []) as { slug: string }[]).map((row) => ({ agencyId: row.slug }));
}

export default async function AgencyProfilePage({ params }: Props) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const isUuid = /^[0-9a-f-]{36}$/.test(params.agencyId);
  const { data: agencyData } = await supabase
    .from("moto_agencies")
    .select("*")
    .eq(isUuid ? "id" : "slug", params.agencyId)
    .single();

  if (!agencyData) notFound();
  const agency = agencyData as unknown as Agency;

  const { data: bikesData } = await supabase
    .from("moto_bikes")
    .select("*, agency:moto_agencies(*)")
    .eq("agency_id", agency.id)
    .order("is_available", { ascending: false });

  const bikes = (bikesData as unknown as Bike[]) ?? [];

  return (
    <div>
      {/* Cover */}
      <div className="h-48 sm:h-64 bg-surface border-b border-border asphalt-texture relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-road/80" />
        <div className="absolute bottom-4 left-4 sm:left-8 flex items-end gap-4">
          <div className="h-16 w-16 rounded-2xl bg-surface-3 border-2 border-border flex items-center justify-center shadow-xl">
            <span className="text-2xl font-black text-muted-foreground">{getInitials(agency.name)}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-foreground">{agency.name}</h1>
              {agency.is_verified && <CheckCircle2 className="h-5 w-5 text-brand" />}
            </div>
            <RatingStars rating={agency.rating} totalReviews={agency.total_reviews} />
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Link href="/agencies" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ChevronLeft className="h-4 w-4" /> Back to agencies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Available Fleet</h2>
              <p className="text-muted-foreground text-sm">{bikes.length} motorcycles in this fleet</p>
            </div>
            <BikeGrid bikes={bikes} />
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
              <h3 className="font-bold">Agency Info</h3>
              <Separator />
              {agency.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{agency.description}</p>
              )}
              <div className="space-y-3 text-sm">
                {agency.address && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-brand mt-0.5 flex-shrink-0" />
                    <span>{agency.address}</span>
                  </div>
                )}
                {agency.contact_number && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 text-brand flex-shrink-0" />
                    <span>{agency.contact_number}</span>
                  </div>
                )}
                {agency.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-brand flex-shrink-0" />
                    <span>{agency.email}</span>
                  </div>
                )}
                {agency.operating_hours && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-brand flex-shrink-0" />
                    <span>{agency.operating_hours}</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-surface-2 p-3">
                  <p className="text-2xl font-black text-brand">{agency.total_reviews}</p>
                  <p className="text-xs text-muted-foreground">Total reviews</p>
                </div>
                <div className="rounded-lg bg-surface-2 p-3">
                  <p className="text-2xl font-black text-amber-400">{agency.rating}</p>
                  <p className="text-xs text-muted-foreground">Avg rating</p>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/browse?agency=${agency.id}`}>View all bikes</Link>
              </Button>
            </div>

            {agency.subscription_tier === "premium" && (
              <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 text-center">
                <p className="text-brand font-bold text-sm">⭐ Premium Agency</p>
                <p className="text-xs text-muted-foreground mt-1">Priority support &amp; verified status</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
