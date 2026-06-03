"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Users, CalendarCheck, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPendingAgencies } from "@/lib/adminStore";
import { mockBookings } from "@/lib/mock/bookings";
import { mockAgencies } from "@/lib/mock/agencies";
import { mockBikes } from "@/lib/mock/bikes";
import { getRenterBookings } from "@/lib/bookingStore";
import { formatPrice } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const pending = getPendingAgencies().filter((a) => a.status === "pending").length;
    setPendingCount(pending);
  }, []);

  const allBookings = [...mockBookings, ...getRenterBookings()];
  const totalRevenue = allBookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.total_amount, 0);
  const activeBookings = allBookings.filter((b) => b.status === "active" || b.status === "confirmed").length;

  const stats = [
    { label: "Total Agencies", value: mockAgencies.length, icon: Building2, color: "text-brand" },
    { label: "Total Bikes", value: mockBikes.length, icon: CalendarCheck, color: "text-blue-400" },
    { label: "Active Bookings", value: activeBookings, icon: Users, color: "text-emerald-400" },
    { label: "Platform Revenue", value: formatPrice(totalRevenue), icon: TrendingUp, color: "text-amber-400" },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black">Platform Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Super-admin control panel for RentNRide_PH.</p>
      </div>

      {/* Pending approvals alert */}
      {pendingCount > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-400">
                {pendingCount} agency registration{pendingCount !== 1 ? "s" : ""} pending review
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">New agencies are live only after approval.</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="gap-1.5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 flex-shrink-0">
            <Link href="/admin/agencies">Review <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-surface p-5 space-y-3">
              <Icon className={`h-5 w-5 ${stat.color}`} />
              <div>
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agency table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Active Agencies</h2>
          <Link href="/admin/agencies" className="text-xs text-brand hover:underline">Manage all →</Link>
        </div>
        <div className="divide-y divide-border">
          {mockAgencies.map((agency) => (
            <div key={agency.id} className="flex items-center gap-4 px-5 py-3">
              <div className="flex-1">
                <p className="text-sm font-semibold">{agency.name}</p>
                <p className="text-xs text-muted-foreground">{agency.city} · {agency.subscription_tier}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  ★ {agency.rating} · {agency.total_reviews} reviews
                </p>
                <span className={`text-xs font-semibold ${agency.is_verified ? "text-emerald-400" : "text-yellow-400"}`}>
                  {agency.is_verified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent bookings */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">Recent Bookings (all agencies)</h2>
        </div>
        <div className="divide-y divide-border">
          {allBookings.slice(0, 6).map((b) => (
            <div key={b.id} className="flex items-center gap-4 px-5 py-3 text-sm">
              <div className="flex-1">
                <p className="font-medium">{b.bike?.brand} {b.bike?.model}</p>
                <p className="text-xs text-muted-foreground">{b.agency?.name} · {b.renter?.full_name ?? "Guest"}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(b.total_amount)}</p>
                <span className={`text-xs capitalize ${
                  b.status === "completed" ? "text-muted-foreground"
                  : b.status === "active" ? "text-emerald-400"
                  : b.status === "cancelled" ? "text-red-400"
                  : "text-blue-400"
                }`}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
