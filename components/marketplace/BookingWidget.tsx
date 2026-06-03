"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, MessageSquare, Heart } from "lucide-react";
import { addDays, format, parseISO, eachDayOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { formatPrice, calculateRentalDays } from "@/lib/utils";
import { getRenterBookings } from "@/lib/bookingStore";
import { mockBookings } from "@/lib/mock/bookings";
import { getMultiplierForDate } from "@/lib/pricingStore";
import { isWishlisted, toggleWishlist } from "@/lib/wishlistStore";
import { MessageModal } from "@/components/booking/MessageModal";
import type { Bike } from "@/types";
import type { DateRange } from "react-day-picker";

interface BookingWidgetProps {
  bike: Bike;
}

function getBlockedDates(bikeId: string): Date[] {
  const all = [...mockBookings, ...getRenterBookings()];
  const active = all.filter(
    (b) => b.bike_id === bikeId && b.status !== "cancelled" && b.status !== "completed"
  );
  return active.flatMap((b) => {
    try {
      return eachDayOfInterval({ start: parseISO(b.start_date), end: parseISO(b.end_date) });
    } catch {
      return [];
    }
  });
}

function calcPricedTotal(dailyRate: number, depositAmount: number, from: Date, to: Date, bikeId: string) {
  const days = eachDayOfInterval({ start: from, end: to });
  const subtotal = days.reduce(
    (sum, d) => sum + Math.round(dailyRate * getMultiplierForDate(d, bikeId)),
    0
  );
  return { subtotal, total: subtotal + depositAmount, days: days.length };
}

export function BookingWidget({ bike }: BookingWidgetProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 4),
  });
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);

  useEffect(() => {
    setBlockedDates(getBlockedDates(bike.id));
    setWishlisted(isWishlisted(bike.id));
  }, [bike.id]);

  const pricing =
    dateRange?.from && dateRange?.to
      ? calcPricedTotal(bike.daily_rate, bike.deposit_amount, dateRange.from, dateRange.to, bike.id)
      : { subtotal: bike.daily_rate, total: bike.daily_rate + bike.deposit_amount, days: 1 };

  const hasRateVariation =
    dateRange?.from && dateRange?.to
      ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to }).some(
          (d) => getMultiplierForDate(d, bike.id) > 1
        )
      : false;

  function handleBookNow() {
    if (!dateRange?.from || !dateRange?.to || !bike.is_available) return;
    const params = new URLSearchParams({
      bikeId: bike.id,
      from: format(dateRange.from, "yyyy-MM-dd"),
      to: format(dateRange.to, "yyyy-MM-dd"),
    });
    router.push(`/booking/confirm?${params.toString()}`);
  }

  function handleWishlist() {
    const saved = toggleWishlist(bike);
    setWishlisted(saved);
  }

  return (
    <>
      <div className="sticky top-20 rounded-xl border border-border bg-surface p-6 space-y-5">
        {/* Price */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-foreground">{formatPrice(bike.daily_rate)}</span>
            <span className="text-muted-foreground text-sm">/day</span>
          </div>
          {bike.rating && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-amber-400 text-sm">★ {bike.rating}</span>
              <span className="text-muted-foreground text-xs">({bike.total_reviews} reviews)</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Date picker */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Rental Period
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center gap-3 rounded-lg border border-border bg-surface-3 px-4 py-3 text-sm text-left hover:border-brand/50 transition-colors">
                <CalendarIcon className="h-4 w-4 text-brand flex-shrink-0" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <span>
                      {format(dateRange.from, "MMM d")} – {format(dateRange.to, "MMM d, yyyy")}
                    </span>
                  ) : (
                    <span>{format(dateRange.from, "MMM d, yyyy")}</span>
                  )
                ) : (
                  <span className="text-muted-foreground">Select dates</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                disabled={[{ before: addDays(new Date(), 1) }, ...blockedDates]}
              />
              {blockedDates.length > 0 && (
                <p className="px-3 pb-3 text-xs text-muted-foreground">
                  Greyed dates are already booked.
                </p>
              )}
            </PopoverContent>
          </Popover>
          {hasRateVariation && (
            <p className="text-xs text-amber-400">
              ⚡ Peak/weekend pricing applies to some days in this range.
            </p>
          )}
        </div>

        {/* Price breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {pricing.days} day{pricing.days !== 1 ? "s" : ""}
              {hasRateVariation ? " (varied rates)" : ` × ${formatPrice(bike.daily_rate)}`}
            </span>
            <span>{formatPrice(pricing.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Refundable deposit</span>
            <span>{formatPrice(bike.deposit_amount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total due at pickup</span>
            <span className="text-brand">{formatPrice(pricing.total)}</span>
          </div>
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="w-full text-base font-bold"
          disabled={!bike.is_available || !dateRange?.from || !dateRange?.to}
          onClick={handleBookNow}
        >
          {bike.is_available ? "Book Now" : "Currently Unavailable"}
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => setMessageOpen(true)}
          >
            <MessageSquare className="h-4 w-4" />
            Message Agency
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`gap-2 transition-colors ${wishlisted ? "border-red-500/40 text-red-400 hover:bg-red-500/10" : ""}`}
            onClick={handleWishlist}
            title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-400 text-red-400" : ""}`} />
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          You won&apos;t be charged until pickup confirmation
        </p>
      </div>

      {bike.agency && (
        <MessageModal
          open={messageOpen}
          onClose={() => setMessageOpen(false)}
          agency={{ id: bike.agency_id, name: bike.agency.name, response_time: bike.agency.response_time }}
          bike={{ id: bike.id, name: `${bike.year} ${bike.brand} ${bike.model}` }}
        />
      )}
    </>
  );
}
