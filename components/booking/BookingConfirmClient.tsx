"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Calendar, MapPin, Shield, ChevronLeft, Loader2, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, calculateRentalDays, getBikeTypeLabel } from "@/lib/utils";
import { createRenterBooking } from "@/lib/bookingStore";
import { validatePromo, applyDiscount, type PromoCode } from "@/lib/promoStore";
import type { Bike } from "@/types";

interface Props {
  bike: Bike;
  from: string;
  to: string;
}

export function BookingConfirmClient({ bike, from, to }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const days = calculateRentalDays(`${from}T00:00:00`, `${to}T00:00:00`);
  const subtotal = bike.daily_rate * days;
  const discount = appliedPromo ? applyDiscount(subtotal, appliedPromo) : 0;
  const discountedSubtotal = subtotal - discount;
  const total = discountedSubtotal + bike.deposit_amount;

  const fromDate = parseISO(from);
  const toDate = parseISO(to);

  function handleApplyPromo() {
    setPromoError(null);
    const result = validatePromo(promoInput, days, subtotal);
    if (result.valid && result.promo) {
      setAppliedPromo(result.promo);
    } else {
      setPromoError(result.error ?? "Invalid code.");
      setAppliedPromo(null);
    }
  }

  function handleConfirm() {
    setConfirming(true);
    const booking = createRenterBooking({
      bike_id: bike.id,
      renter_id: "renter-local",
      agency_id: bike.agency_id,
      start_date: from,
      end_date: to,
      total_amount: total,
      deposit_amount: bike.deposit_amount,
      status: "pending",
      payment_method: "Cash",
      bike,
      agency: bike.agency,
    });
    router.push(`/booking/${booking.id}`);
  }

  return (
    <div className="container max-w-2xl py-10">
      <Link
        href={`/browse/${bike.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ChevronLeft className="h-4 w-4" /> Back to listing
      </Link>

      <h1 className="text-3xl font-black mb-1">Confirm your booking</h1>
      <p className="text-muted-foreground mb-8">Review the details below before confirming.</p>

      {/* Bike summary */}
      <div className="rounded-xl border border-border bg-surface p-5 space-y-4 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {getBikeTypeLabel(bike.type)}
            </p>
            <h2 className="text-xl font-bold">
              {bike.year} {bike.brand} {bike.model}
            </h2>
            {bike.agency && (
              <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-brand" />
                {bike.agency.name} · {bike.agency.city}
              </div>
            )}
          </div>
          <div className="h-16 w-24 rounded-lg border border-border bg-surface-3 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-black text-foreground/10">{bike.brand[0]}</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-brand flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold">{format(fromDate, "MMM d, yyyy")}</span>
            <span className="text-muted-foreground"> → </span>
            <span className="font-semibold">{format(toDate, "MMM d, yyyy")}</span>
            <span className="text-muted-foreground ml-2">({days} day{days !== 1 ? "s" : ""})</span>
          </div>
        </div>
      </div>

      {/* Promo code */}
      <div className="rounded-xl border border-border bg-surface p-4 mb-4 space-y-3">
        <p className="text-sm font-medium flex items-center gap-2">
          <Tag className="h-4 w-4 text-brand" /> Promo Code
        </p>
        {appliedPromo ? (
          <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5">
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-mono font-bold">{appliedPromo.code}</span>
              <span>
                — {appliedPromo.discount_type === "percent"
                  ? `${appliedPromo.discount_value}% off`
                  : `${formatPrice(appliedPromo.discount_value)} off`}
              </span>
            </div>
            <button
              onClick={() => { setAppliedPromo(null); setPromoInput(""); }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={promoInput}
              onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(null); }}
              placeholder="Enter code"
              className="flex-1 rounded-lg border border-border bg-surface-3 px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand font-mono"
            />
            <Button variant="outline" size="sm" onClick={handleApplyPromo} disabled={!promoInput.trim()}>
              Apply
            </Button>
          </div>
        )}
        {promoError && (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" /> {promoError}
          </div>
        )}
      </div>

      {/* Price breakdown */}
      <div className="rounded-xl border border-border bg-surface p-5 space-y-3 mb-4">
        <h3 className="font-semibold text-sm">Price breakdown</h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {formatPrice(bike.daily_rate)} × {days} day{days !== 1 ? "s" : ""}
          </span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {appliedPromo && (
          <div className="flex justify-between text-sm text-emerald-400">
            <span>Promo discount ({appliedPromo.code})</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Refundable security deposit</span>
          <span>{formatPrice(bike.deposit_amount)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-base">
          <span>Total due at pickup</span>
          <span className="text-brand">{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-muted-foreground">Payment method: Cash at pickup</p>
      </div>

      {/* Terms notice */}
      <div className="flex gap-3 rounded-xl border border-border bg-surface-2 p-4 mb-6">
        <Shield className="h-4 w-4 text-brand flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          By confirming, you agree that your booking request will be sent to the agency for
          approval. You won&apos;t be charged until pickup. Cancellations before pickup are free.
        </p>
      </div>

      <Button
        size="lg"
        className="w-full text-base font-bold"
        onClick={handleConfirm}
        disabled={confirming}
      >
        {confirming ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Confirming…</>
        ) : (
          "Confirm Booking Request"
        )}
      </Button>
    </div>
  );
}
