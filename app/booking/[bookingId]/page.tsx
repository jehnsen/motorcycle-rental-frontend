"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Calendar, MapPin, Clock, ArrowRight, Bike as BikeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getRenterBookings } from "@/lib/bookingStore";
import { formatPrice, getStatusColor } from "@/lib/utils";
import type { Booking } from "@/types";

export default function BookingReceiptPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const [booking, setBooking] = useState<Booking | null | "loading">("loading");

  useEffect(() => {
    const bookings = getRenterBookings();
    const found = bookings.find((b) => b.id === params.bookingId) ?? null;
    setBooking(found);
  }, [params.bookingId]);

  if (booking === "loading") {
    return (
      <div className="container max-w-lg py-20 text-center">
        <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container max-w-lg py-20 text-center space-y-4">
        <p className="text-muted-foreground">Booking not found.</p>
        <Button asChild variant="outline">
          <Link href="/browse">Browse Bikes</Link>
        </Button>
      </div>
    );
  }

  const days = Math.max(
    1,
    Math.round(
      (parseISO(booking.end_date).getTime() - parseISO(booking.start_date).getTime()) /
        86_400_000
    )
  );

  return (
    <div className="container max-w-lg py-16">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-brand/10 border border-brand/30 mb-5">
          <CheckCircle2 className="h-10 w-10 text-brand" />
        </div>
        <h1 className="text-4xl font-black mb-2">Booking Submitted!</h1>
        <p className="text-muted-foreground">
          Your request is pending agency confirmation. We&apos;ll notify you once approved.
        </p>
      </div>

      {/* Receipt card */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden mb-6">
        {/* Booking ref + status */}
        <div className="px-5 py-4 bg-surface-2 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Booking Ref</p>
            <p className="font-mono text-sm font-semibold mt-0.5">#{booking.id}</p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>

        <div className="p-5 space-y-4">
          {/* Bike */}
          {booking.bike && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-12 rounded-lg border border-border bg-surface-3 flex items-center justify-center flex-shrink-0">
                <BikeIcon className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {booking.bike.year} {booking.bike.brand} {booking.bike.model}
                </p>
                <p className="text-xs text-muted-foreground">{booking.bike.color}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Agency */}
          {booking.agency && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-brand flex-shrink-0" />
              <span className="text-muted-foreground">
                {booking.agency.name} · {booking.agency.city}
              </span>
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-brand flex-shrink-0" />
            <span>
              {format(parseISO(booking.start_date), "MMM d")}
              {" → "}
              {format(parseISO(booking.end_date), "MMM d, yyyy")}
              <span className="text-muted-foreground ml-1.5">({days} day{days !== 1 ? "s" : ""})</span>
            </span>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-brand flex-shrink-0" />
            <span className="text-muted-foreground">Payment at pickup · {booking.payment_method}</span>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total due at pickup</span>
            <span className="text-lg font-black text-brand">{formatPrice(booking.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="rounded-xl border border-border bg-surface-2 p-4 mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          What happens next
        </p>
        {[
          "Agency reviews your request (usually within a few hours)",
          "You receive a confirmation once approved",
          "Bring your license and deposit amount on pickup day",
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-brand/20 text-brand text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-muted-foreground">{step}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button asChild size="lg" className="w-full font-bold gap-2">
          <Link href="/account/bookings">
            View My Bookings <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/browse">Browse More Bikes</Link>
        </Button>
      </div>
    </div>
  );
}
