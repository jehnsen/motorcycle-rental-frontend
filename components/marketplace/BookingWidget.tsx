"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, MessageSquare, Heart } from "lucide-react";
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { formatPrice, calculateRentalDays } from "@/lib/utils";
import type { Bike } from "@/types";
import type { DateRange } from "react-day-picker";

interface BookingWidgetProps {
  bike: Bike;
}

export function BookingWidget({ bike }: BookingWidgetProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 4),
  });

  const days =
    dateRange?.from && dateRange?.to
      ? Math.max(1, calculateRentalDays(dateRange.from.toISOString(), dateRange.to.toISOString()))
      : 1;

  const subtotal = bike.daily_rate * days;
  const total = subtotal + bike.deposit_amount;

  function handleBookNow() {
    if (!dateRange?.from || !dateRange?.to || !bike.is_available) return;
    const params = new URLSearchParams({
      bikeId: bike.id,
      from: format(dateRange.from, "yyyy-MM-dd"),
      to: format(dateRange.to, "yyyy-MM-dd"),
    });
    router.push(`/booking/confirm?${params.toString()}`);
  }

  return (
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
              disabled={{ before: addDays(new Date(), 1) }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Price breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{formatPrice(bike.daily_rate)} × {days} day{days !== 1 ? "s" : ""}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Refundable deposit</span>
          <span>{formatPrice(bike.deposit_amount)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total due at pickup</span>
          <span className="text-brand">{formatPrice(total)}</span>
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
        <Button variant="outline" size="sm" className="flex-1 gap-2">
          <MessageSquare className="h-4 w-4" />
          Message Agency
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        You won&apos;t be charged until pickup confirmation
      </p>
    </div>
  );
}
