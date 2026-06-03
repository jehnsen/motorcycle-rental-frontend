"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Calendar, MapPin, Bike as BikeIcon, X, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRenterBookings, cancelRenterBooking } from "@/lib/bookingStore";
import { hasReviewed } from "@/lib/reviewStore";
import { ReviewModal } from "@/components/booking/ReviewModal";
import { formatPrice, getStatusColor } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

const STATUS_TABS: { label: string; value: BookingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all");
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);

  function loadBookings() {
    setBookings(getRenterBookings());
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function handleCancel(id: string) {
    cancelRenterBooking(id);
    loadBookings();
  }

  const filtered =
    activeTab === "all" ? bookings : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black">My Bookings</h1>
        <p className="text-muted-foreground text-sm mt-1">Track and manage your rental requests.</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 flex-wrap mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab.value
                ? "bg-brand text-white"
                : "bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-3"
            }`}
          >
            {tab.label}
            {tab.value !== "all" && (
              <span className="ml-1.5 opacity-60">
                {bookings.filter((b) => b.status === tab.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center space-y-4">
          <BikeIcon className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground">
            {activeTab === "all"
              ? "No bookings yet. Start by browsing available bikes."
              : `No ${activeTab} bookings.`}
          </p>
          {activeTab === "all" && (
            <Button asChild size="sm">
              <Link href="/browse">Browse Bikes <ArrowRight className="h-3.5 w-3.5 ml-1.5" /></Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const days = Math.max(
              1,
              Math.round(
                (parseISO(booking.end_date).getTime() - parseISO(booking.start_date).getTime()) /
                  86_400_000
              )
            );
            const canCancel = booking.status === "pending" || booking.status === "confirmed";

            return (
              <div
                key={booking.id}
                className="rounded-xl border border-border bg-surface p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">#{booking.id}</span>
                    </div>
                    {booking.bike ? (
                      <p className="font-bold">
                        {booking.bike.year} {booking.bike.brand} {booking.bike.model}
                      </p>
                    ) : (
                      <p className="font-bold text-muted-foreground">Bike details unavailable</p>
                    )}
                  </div>
                  <p className="text-xl font-black text-brand flex-shrink-0">
                    {formatPrice(booking.total_amount)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-brand" />
                    {format(parseISO(booking.start_date), "MMM d")} →{" "}
                    {format(parseISO(booking.end_date), "MMM d, yyyy")}
                    <span className="text-xs">({days}d)</span>
                  </div>
                  {booking.agency && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-brand" />
                      {booking.agency.name} · {booking.agency.city}
                    </div>
                  )}
                </div>

                {(canCancel || booking.status === "completed") && (
                  <div className="flex justify-end gap-2 pt-1">
                    {booking.status === "completed" && !hasReviewed(booking.id) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-amber-400 border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-300"
                        onClick={() => setReviewTarget(booking)}
                      >
                        <Star className="h-3.5 w-3.5" />
                        Write Review
                      </Button>
                    )}
                    {booking.status === "completed" && hasReviewed(booking.id) && (
                      <span className="text-xs text-muted-foreground self-center">Reviewed ✓</span>
                    )}
                    {canCancel && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300 gap-1.5"
                        onClick={() => handleCancel(booking.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {reviewTarget && (
        <ReviewModal
          open={!!reviewTarget}
          onClose={() => setReviewTarget(null)}
          booking={{
            id: reviewTarget.id,
            bike_id: reviewTarget.bike_id,
            agency_id: reviewTarget.agency_id,
            bike_name: reviewTarget.bike
              ? `${reviewTarget.bike.year} ${reviewTarget.bike.brand} ${reviewTarget.bike.model}`
              : "Bike",
          }}
          onSubmitted={loadBookings}
        />
      )}
    </div>
  );
}
