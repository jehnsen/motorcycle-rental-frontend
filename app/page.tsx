import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { ArrowRight, Shield, CreditCard, Star, MapPin, Mountain, Waves, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { BikeCard } from "@/components/marketplace/BikeCard";
import { AgencyCard } from "@/components/marketplace/AgencyCard";
import type { Bike, Agency, BikeType } from "@/types";
import type { Database } from "@/lib/supabase/types";

const bikeTypeFilters: { type: BikeType | "all"; label: string; emoji: string }[] = [
  { type: "all", label: "All Bikes", emoji: "🏍️" },
  { type: "big_bike", label: "Big Bikes", emoji: "🔥" },
  { type: "naked", label: "Naked", emoji: "⚡" },
  { type: "adventure", label: "Adventure", emoji: "🌄" },
  { type: "scooter", label: "Scooters", emoji: "🛵" },
];

const routes = [
  {
    title: "Sagada Loop",
    location: "Mountain Province",
    distance: "~280 km",
    difficulty: "Challenging",
    bestBike: "Adventure",
    description: "Wind through pine forests and limestone cliffs. The iconic death road descent is not for the faint-hearted.",
    icon: Mountain,
    gradient: "from-amber-900/50 to-surface-3",
  },
  {
    title: "Batangas Coastal",
    location: "Batangas",
    distance: "~180 km",
    difficulty: "Easy",
    bestBike: "Big Bike / Naked",
    description: "Serpentine roads with sweeping views of Batangas Bay. Perfect for a weekend escape from Manila.",
    icon: Waves,
    gradient: "from-blue-900/50 to-surface-3",
  },
  {
    title: "Mt. Banahaw Trail",
    location: "Quezon Province",
    distance: "~120 km",
    difficulty: "Moderate",
    bestBike: "Adventure / Naked",
    description: "Mystical mountain roads flanked by tropical forest. Stop at sacred springs and local shrines.",
    icon: Trees,
    gradient: "from-emerald-900/50 to-surface-3",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Find Your Ride",
    description: "Browse verified fleets across Metro Manila, Cebu, and Baguio. Filter by type, price, and availability.",
  },
  {
    step: "02",
    title: "Book & Pay Online",
    description: "Reserve in minutes. Pay via GCash, Maya, or cash on pickup. Secure deposits protect both parties.",
  },
  {
    step: "03",
    title: "Pick Up & Ride",
    description: "Present your license and ID. Get a quick safety rundown from the agency, then hit the open road.",
  },
];

export default async function HomePage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const [{ data: bikesData }, { data: agenciesData }] = await Promise.all([
    supabase
      .from("moto_bikes")
      .select("*, agency:moto_agencies(*)")
      .eq("is_available", true)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("moto_agencies")
      .select("*")
      .eq("is_verified", true)
      .order("rating", { ascending: false })
      .limit(3),
  ]);

  const featuredBikes = (bikesData as unknown as Bike[]) ?? [];
  const featuredAgencies = (agenciesData as unknown as Agency[]) ?? [];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-road asphalt-texture">
        <div className="absolute inset-0 bg-orange-glow" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-road to-transparent" />

        <div className="relative container py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              Now in Metro Manila · Cebu · Baguio
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tighter">
              Ride the bike you&apos;ve{" "}
              <span className="text-gradient-orange">always wanted.</span>
              <br />
              No commitment.
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Rent big bikes, nakeds, and scooters across the Philippines. Weekend rides, out-of-town trips, test before you buy.
            </p>

            <div className="w-full max-w-2xl mx-auto">
              <SearchBar variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-border bg-surface">
        <div className="container py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-brand font-bold text-base">500+</span>
              bikes across 3 cities
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand" />
              Verified agencies only
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-brand" />
              GCash &amp; Maya accepted
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>4.7 avg rating from renters</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bike type quick-select */}
      <section className="container py-12">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          {bikeTypeFilters.map((filter) => (
            <Link
              key={filter.type}
              href={filter.type === "all" ? "/browse" : `/browse?type=${filter.type}`}
              className="flex-shrink-0 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted-foreground hover:border-brand/50 hover:text-foreground hover:bg-surface-2 transition-all"
            >
              <span>{filter.emoji}</span>
              <span>{filter.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured bikes */}
      <section className="container pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black">Featured Bikes</h2>
            <p className="text-muted-foreground mt-1">Hand-picked rentals from verified agencies</p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex gap-2">
            <Link href="/browse">
              See all bikes <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {featuredBikes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBikes.map((bike) => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-4">🏍️</span>
            <p className="text-muted-foreground">No bikes yet — seed the database to see listings here.</p>
          </div>
        )}

        <div className="mt-8 flex justify-center sm:hidden">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/browse">See all bikes <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-surface py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black">How It Works</h2>
            <p className="text-muted-foreground mt-2">From browse to road in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative text-center space-y-4">
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+3rem)] right-[-3rem] h-px bg-gradient-to-r from-brand/50 to-transparent" />
                )}
                <div className="mx-auto h-12 w-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <span className="text-brand font-black text-lg">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured agencies */}
      <section className="container py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black">Verified Agencies</h2>
            <p className="text-muted-foreground mt-1">Trusted partners with proven track records</p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex gap-2">
            <Link href="/agencies">All agencies <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
          {featuredAgencies.map((agency) => (
            <div key={agency.id} className="flex-shrink-0 w-72">
              <AgencyCard agency={agency} />
            </div>
          ))}
        </div>
      </section>

      {/* Ride routes */}
      <section className="border-t border-border bg-surface py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black">Popular Ride Routes</h2>
            <p className="text-muted-foreground mt-2">Curated journeys across the archipelago</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <div key={route.title} className={`rounded-xl border border-border bg-gradient-to-br ${route.gradient} p-6 space-y-4 group hover:border-brand/40 transition-colors`}>
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-lg bg-surface/50 border border-border flex items-center justify-center">
                      <Icon className="h-5 w-5 text-brand" />
                    </div>
                    <span className={`text-xs font-semibold rounded-full px-2 py-0.5 border ${
                      route.difficulty === "Easy"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : route.difficulty === "Moderate"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}>
                      {route.difficulty}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-brand transition-colors">{route.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" /> {route.location}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{route.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-4">
                    <span><span className="text-foreground font-semibold">{route.distance}</span> round trip</span>
                    <span>Best on <span className="text-foreground font-semibold">{route.bestBike}</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Agency CTA */}
      <section className="container py-20">
        <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/10 via-surface to-surface-2 p-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            For fleet owners
          </div>
          <h2 className="text-4xl font-black">Own a fleet?<br />List with RentNRide_PH</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            Reach thousands of riders across the Philippines. Manage your fleet, bookings, and renters from one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild className="gap-2 text-base font-bold px-8">
              <Link href="/auth/register">
                Start for free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/how-it-works">Learn how it works</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
