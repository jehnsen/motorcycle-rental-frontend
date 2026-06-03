import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Bike, CalendarCheck, DollarSign, Star, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BookingTable } from "@/components/dashboard/BookingTable";
import { formatPrice } from "@/lib/utils";
import type { Agency, Booking, Bike as BikeType } from "@/types";
import type { Database } from "@/lib/supabase/types";

export default async function DashboardOverviewPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // Get first agency for demo (in production: query by auth.uid())
  const { data: agencyData } = await supabase
    .from("moto_agencies")
    .select("*")
    .limit(1)
    .single();

  if (!agencyData) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="text-4xl mb-4">🏢</span>
        <h2 className="text-xl font-bold mb-2">No agency found</h2>
        <p className="text-muted-foreground text-sm">Run the seed SQL to populate demo data.</p>
      </div>
    );
  }

  const agency = agencyData as unknown as Agency;

  const [{ data: bookingsData }, { data: bikesData }] = await Promise.all([
    supabase
      .from("moto_bookings")
      .select("*, bike:moto_bikes(*), renter:moto_renters(*), agency:moto_agencies(*)")
      .eq("agency_id", agency.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("moto_bikes")
      .select("*")
      .eq("agency_id", agency.id),
  ]);

  const recentBookings = (bookingsData as unknown as Booking[]) ?? [];
  const bikes = (bikesData as unknown as BikeType[]) ?? [];
  const activeBookings = recentBookings.filter((b) => b.status === "active").length;
  const monthlyRevenue = recentBookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.total_amount, 0);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {agency.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Bikes"      value={bikes.length}             icon={Bike}          trend="+2 this month"       trendUp />
        <StatsCard title="Active Bookings"  value={activeBookings}           icon={CalendarCheck} trend="1 ending today" />
        <StatsCard title="Monthly Revenue"  value={formatPrice(monthlyRevenue)} icon={DollarSign}    trend="+18% vs last month"  trendUp />
        <StatsCard title="Avg Rating"       value={agency.rating.toFixed(1)} icon={Star}          trend="+0.1 this month"     trendUp />
      </div>

      <div>
        <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" asChild><Link href="/dashboard/fleet">Manage Fleet</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href="/dashboard/bookings">View Bookings</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href="/dashboard/renters">Check Renters</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href="/dashboard/settings">Edit Profile</Link></Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Bookings</h2>
          <Button variant="ghost" size="sm" asChild className="gap-1 text-brand hover:text-brand">
            <Link href="/dashboard/bookings">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </div>
        <BookingTable bookings={recentBookings} />
      </div>

      {recentBookings.filter((b) => b.status === "pending").length > 0 && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <p className="font-semibold text-yellow-400">
              {recentBookings.filter((b) => b.status === "pending").length} booking(s) awaiting confirmation
            </p>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Respond within 24 hours to maintain your response rate.</p>
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/bookings">Review pending bookings</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
