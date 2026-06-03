"use client";

import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDamageReport } from "@/lib/agencyDashboardStore";
import type { Booking } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onSubmitted?: () => void;
}

const SEVERITY_OPTIONS = [
  { value: "minor", label: "Minor", desc: "Scratches, dents, broken mirrors" },
  { value: "major", label: "Major", desc: "Engine damage, bent frame, non-functional" },
  { value: "total_loss", label: "Total Loss", desc: "Destroyed, stolen, or unrecoverable" },
] as const;

export function DamageReportModal({ open, onClose, booking, onSubmitted }: Props) {
  const [severity, setSeverity] = useState<"minor" | "major" | "total_loss">("minor");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);
    addDamageReport({
      booking_id: booking.id,
      bike_id: booking.bike_id,
      renter_name: booking.renter?.full_name ?? "Unknown renter",
      description: description.trim(),
      severity,
      estimated_cost: parseFloat(cost) || 0,
    });
    setSubmitting(false);
    setDone(true);
    setTimeout(() => {
      onSubmitted?.();
      onClose();
      setDone(false);
      setDescription("");
      setCost("");
      setSeverity("minor");
    }, 1000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-black">Damage / Incident Report</h2>
              <p className="text-xs text-muted-foreground">
                {booking.bike?.brand} {booking.bike?.model} · {booking.renter?.full_name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-6 space-y-2">
            <p className="font-bold text-red-400">Report filed</p>
            <p className="text-sm text-muted-foreground">The incident has been logged.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Severity */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Damage severity</p>
              <div className="space-y-2">
                {SEVERITY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      severity === opt.value
                        ? "border-brand bg-brand/10"
                        : "border-border hover:border-border/80 bg-surface-3"
                    }`}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={opt.value}
                      checked={severity === opt.value}
                      onChange={() => setSeverity(opt.value)}
                      className="mt-0.5 accent-brand"
                    />
                    <div>
                      <p className="text-sm font-semibold">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the damage or incident in detail…"
                rows={3}
                className="w-full rounded-lg border border-border bg-surface-3 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand resize-none"
              />
            </div>

            {/* Estimated cost */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Estimated repair cost (₱)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-border bg-surface-3 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-bold bg-red-500 hover:bg-red-600 text-white"
              disabled={submitting || !description.trim()}
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Filing…</>
              ) : (
                "File Damage Report"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
