"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { getRenterBookings } from "@/lib/bookingStore";
import { formatPrice } from "@/lib/utils";
import type { Booking } from "@/types";

export default function InvoicePage({ params }: { params: { bookingId: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const b = getRenterBookings().find((b) => b.id === params.bookingId) ?? null;
    setBooking(b);
    if (b) setTimeout(() => window.print(), 600);
  }, [params.bookingId]);

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading invoice…</p>
      </div>
    );
  }

  const days = Math.max(
    1,
    Math.round(
      (parseISO(booking.end_date).getTime() - parseISO(booking.start_date).getTime()) / 86_400_000
    )
  );
  const rentalAmount = booking.total_amount - booking.deposit_amount;

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .invoice-card { box-shadow: none !important; border: 1px solid #ddd !important; }
        }
        @page { margin: 20mm; }
      `}</style>

      {/* Back button — hidden on print */}
      <div className="no-print p-4 flex items-center gap-3">
        <button onClick={() => window.history.back()} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </button>
        <button
          onClick={() => window.print()}
          className="ml-auto text-sm bg-brand text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
        >
          Print / Save PDF
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="invoice-card bg-white text-gray-900 rounded-2xl p-8 space-y-6" style={{ fontFamily: "system-ui, sans-serif" }}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#E85D24", marginBottom: 2 }}>
                RentNRide<span style={{ color: "#333" }}>_PH</span>
              </h1>
              <p style={{ fontSize: 12, color: "#666" }}>Motorcycle Rental Marketplace</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Invoice</p>
              <p style={{ fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>#{booking.id}</p>
              <p style={{ fontSize: 12, color: "#666" }}>{format(parseISO(booking.created_at), "MMMM d, yyyy")}</p>
            </div>
          </div>

          <hr style={{ borderColor: "#eee" }} />

          {/* Agency + renter */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <p style={{ fontSize: 10, textTransform: "uppercase", color: "#999", marginBottom: 4 }}>From (Agency)</p>
              <p style={{ fontWeight: 700 }}>{booking.agency?.name ?? "—"}</p>
              <p style={{ fontSize: 12, color: "#666" }}>{booking.agency?.address}</p>
              <p style={{ fontSize: 12, color: "#666" }}>{booking.agency?.city}</p>
              <p style={{ fontSize: 12, color: "#666" }}>{booking.agency?.contact_number}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, textTransform: "uppercase", color: "#999", marginBottom: 4 }}>To (Renter)</p>
              <p style={{ fontWeight: 700 }}>{booking.renter?.full_name ?? "Guest Renter"}</p>
              <p style={{ fontSize: 12, color: "#666" }}>License: {booking.renter?.license_number ?? "—"}</p>
            </div>
          </div>

          <hr style={{ borderColor: "#eee" }} />

          {/* Bike */}
          <div>
            <p style={{ fontSize: 10, textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Rental Details</p>
            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 16 }}>
              <p style={{ fontWeight: 700, fontSize: 16 }}>
                {booking.bike?.year} {booking.bike?.brand} {booking.bike?.model}
              </p>
              <p style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                Plate: {booking.bike?.plate_number} · {booking.bike?.color}
              </p>
              <div style={{ marginTop: 12, display: "flex", gap: 32 }}>
                <div>
                  <p style={{ fontSize: 10, color: "#999" }}>Start Date</p>
                  <p style={{ fontWeight: 600 }}>{format(parseISO(booking.start_date), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#999" }}>End Date</p>
                  <p style={{ fontWeight: 600 }}>{format(parseISO(booking.end_date), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#999" }}>Duration</p>
                  <p style={{ fontWeight: 600 }}>{days} day{days !== 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div>
            <p style={{ fontSize: 10, textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Charges</p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  {["Description", "Days", "Rate", "Amount"].map((h) => (
                    <th key={h} style={{ textAlign: h === "Description" ? "left" : "right", padding: "6px 0", fontSize: 11, color: "#999", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "8px 0", fontSize: 13 }}>Rental fee</td>
                  <td style={{ textAlign: "right", fontSize: 13 }}>{days}</td>
                  <td style={{ textAlign: "right", fontSize: 13 }}>
                    {formatPrice(Math.round(rentalAmount / days))}/day
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600, fontSize: 13 }}>{formatPrice(rentalAmount)}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", fontSize: 13 }} colSpan={3}>Refundable security deposit</td>
                  <td style={{ textAlign: "right", fontWeight: 600, fontSize: 13 }}>{formatPrice(booking.deposit_amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr style={{ borderColor: "#eee" }} />

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ minWidth: 200 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#666", fontSize: 13 }}>Rental subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(rentalAmount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#666", fontSize: 13 }}>Security deposit</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(booking.deposit_amount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #333", paddingTop: 8 }}>
                <span style={{ fontWeight: 900, fontSize: 15 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 18, color: "#E85D24" }}>{formatPrice(booking.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#666" }}>Payment method</span>
              <span style={{ fontWeight: 600 }}>{booking.payment_method}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
              <span style={{ color: "#666" }}>Booking status</span>
              <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{booking.status}</span>
            </div>
          </div>

          <p style={{ fontSize: 11, color: "#999", textAlign: "center" }}>
            This invoice was generated by RentNRide_PH · rentnride.ph · Thank you for riding with us!
          </p>
        </div>
      </div>
    </>
  );
}
