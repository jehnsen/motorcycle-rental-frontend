import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChevronLeft, Clock, MapPin, Shield, Zap, Fuel, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BikeTypeBadge } from "@/components/shared/BikeTypeBadge";
import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { AgencyCard } from "@/components/marketplace/AgencyCard";
import { BookingWidget } from "@/components/marketplace/BookingWidget";
import { BikeCard } from "@/components/marketplace/BikeCard";
import { BikeReviewsSection } from "@/components/marketplace/BikeReviewsSection";
import { createBuildClient } from "@/lib/supabase/build-client";
import { formatPrice, getInitials } from "@/lib/utils";
import type { Bike } from "@/types";
import type { Database } from "@/lib/supabase/types";

interface Props {
  params: { bikeId: string };
}

export async function generateStaticParams() {
  const supabase = createBuildClient();
  const { data } = await supabase.from("moto_bikes").select("id");
  return ((data ?? []) as { id: string }[]).map((row) => ({ bikeId: row.id }));
}

export default async function BikeDetailPage({ params }: Props) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const [{ data: bikeData }, ] = await Promise.all([
    supabase
      .from("moto_bikes")
      .select("*, agency:moto_agencies(*)")
      .eq("id", params.bikeId)
      .single(),
  ]);

  if (!bikeData) notFound();
  const bike = bikeData as unknown as Bike;

  const { data: similarData } = await supabase
    .from("moto_bikes")
    .select("*, agency:moto_agencies(*)")
    .eq("type", bike.type)
    .neq("id", bike.id)
    .limit(3);

  const similarBikes = (similarData as unknown as Bike[]) ?? [];

  const typeColors: Record<string, string> = {
    big_bike: "from-orange-900/60 to-surface-3",
    naked: "from-blue-900/60 to-surface-3",
    scooter: "from-emerald-900/60 to-surface-3",
    adventure: "from-amber-900/60 to-surface-3",
  };

  const specs = [
    { icon: Zap,    label: "Engine",       value: bike.specs.engine },
    { icon: Shield, label: "Transmission", value: bike.specs.transmission },
    { icon: Fuel,   label: "Fuel Type",    value: bike.specs.fuel_type },
    { icon: Weight, label: "Weight",       value: bike.specs.weight },
  ];

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/browse" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Browse
        </Link>
        <span>/</span>
        <span className="text-foreground">{bike.brand} {bike.model}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Image gallery */}
          <div className={`rounded-2xl bg-gradient-to-br ${typeColors[bike.type] ?? "from-surface-3 to-surface"} aspect-video flex items-center justify-center relative overflow-hidden border border-border`}>
            <div className="absolute inset-0 asphalt-texture opacity-40" />
            <div className="relative text-center">
              <span className="text-[120px] font-black text-foreground/5 select-none leading-none">{bike.brand[0]}</span>
              <p className="text-muted-foreground font-medium mt-2">{bike.brand} {bike.model}</p>
            </div>
            <div className="absolute bottom-4 left-4 flex gap-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className={`h-14 w-20 rounded-lg border ${i === 1 ? "border-brand" : "border-border"} bg-surface/60 backdrop-blur-sm`} />
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <BikeTypeBadge type={bike.type} />
              <AvailabilityBadge isAvailable={bike.is_available} />
            </div>
            <h1 className="text-4xl font-black">{bike.year} {bike.brand} {bike.model}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{bike.color}</span>
              <span className="font-mono bg-surface-3 px-2 py-0.5 rounded text-xs">{bike.plate_number}</span>
              {bike.rating && <RatingStars rating={bike.rating} totalReviews={bike.total_reviews} />}
            </div>
          </div>

          <Separator />

          {/* Specs */}
          <div>
            <h2 className="text-xl font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {specs.map((spec) => {
                const Icon = spec.icon;
                return spec.value ? (
                  <div key={spec.label} className="rounded-xl border border-border bg-surface p-4 text-center space-y-2">
                    <Icon className="h-5 w-5 text-brand mx-auto" />
                    <p className="text-xs text-muted-foreground">{spec.label}</p>
                    <p className="text-sm font-semibold">{spec.value as string}</p>
                  </div>
                ) : null;
              })}
            </div>
            {bike.specs.mileage && (
              <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Mileage</span>
                <span className="font-semibold">{bike.specs.mileage as string}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Pricing */}
          <div>
            <h2 className="text-xl font-bold mb-4">Pricing</h2>
            <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily rate</span>
                <span className="font-bold text-lg">{formatPrice(bike.daily_rate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Security deposit (refundable)</span>
                <span className="font-semibold">{formatPrice(bike.deposit_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Min. license experience</span>
                <span className="font-semibold">{bike.min_license_years === 0 ? "Any license" : `${bike.min_license_years}+ years`}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Agency */}
          {bike.agency && (
            <div>
              <h2 className="text-xl font-bold mb-4">Offered by</h2>
              <AgencyCard agency={bike.agency} />
              {bike.agency.description && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{bike.agency.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                {bike.agency.operating_hours && (
                  <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-brand" />{bike.agency.operating_hours}</div>
                )}
                {bike.agency.address && (
                  <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand" />{bike.agency.address}</div>
                )}
              </div>
            </div>
          )}

          {/* Reviews */}
          <Separator />
          <div>
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <BikeReviewsSection
              bikeId={bike.id}
              staticRating={bike.rating ?? 0}
              staticTotal={bike.total_reviews ?? 0}
            />
          </div>

          {/* Similar bikes */}
          {similarBikes.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-bold mb-4">Similar Bikes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {similarBikes.map((b) => <BikeCard key={b.id} bike={b} />)}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <BookingWidget bike={bike} />
        </div>
      </div>
    </div>
  );
}
