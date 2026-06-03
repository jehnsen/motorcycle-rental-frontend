"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { getDamageReports, type DamageReport } from "@/lib/agencyDashboardStore";
import { mockBookings } from "@/lib/mock/bookings";
import { getRenterBookings } from "@/lib/bookingStore";
import { formatPrice, formatDate } from "@/lib/utils";

const SEVERITY_COLOR: Record<string, string> = {
  minor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  major: "bg-brand/10 text-brand border-brand/30",
  total_loss: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function DisputesPage() {
  const [reports, setReports] = useState<DamageReport[]>([]);

  useEffect(() => {
    setReports(getDamageReports());
  }, []);

  const allBookings = [...mockBookings, ...getRenterBookings()];

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black">Disputes & Damage Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">
          All filed damage/incident reports across the platform.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface py-12 text-center text-muted-foreground space-y-2">
          <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground/20" />
          <p className="text-sm">No damage reports filed yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const booking = allBookings.find((b) => b.id === report.booking_id);
            return (
              <div key={report.id} className="rounded-xl border border-border bg-surface p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${SEVERITY_COLOR[report.severity]}`}>
                        {report.severity.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="text-sm font-bold">
                        {booking?.bike?.brand} {booking?.bike?.model}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Renter: {report.renter_name}</p>
                    <p className="text-sm mt-2">{report.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {report.estimated_cost > 0 && (
                      <p className="font-black text-brand text-lg">{formatPrice(report.estimated_cost)}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{formatDate(report.created_at)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
