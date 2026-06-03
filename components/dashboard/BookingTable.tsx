"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import {
  isDepositReturned,
  markDepositReturned,
  hasDamageReport,
  setBookingStatus,
  getEffectiveStatus,
} from "@/lib/agencyDashboardStore";
import { addNotification } from "@/lib/notificationStore";
import { DamageReportModal } from "@/components/dashboard/DamageReportModal";
import type { Booking, BookingStatus } from "@/types";

interface BookingTableProps {
  bookings: Booking[];
  status?: BookingStatus;
}

export function BookingTable({ bookings }: BookingTableProps) {
  const [, forceUpdate] = useState(0);
  const [damageTarget, setDamageTarget] = useState<Booking | null>(null);

  // Re-read overrides after hydration
  useEffect(() => {
    forceUpdate((n) => n + 1);
  }, []);

  if (bookings.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm rounded-xl border border-border bg-surface">
        No bookings found
      </div>
    );
  }

  function handleApprove(booking: Booking) {
    setBookingStatus(booking.id, "confirmed");
    addNotification({
      type: "booking_confirmed",
      title: "Booking confirmed",
      message: `Your booking for ${booking.bike?.brand ?? ""} ${booking.bike?.model ?? ""} has been confirmed by the agency.`,
      booking_id: booking.id,
    });
    forceUpdate((n) => n + 1);
  }

  function handleReject(booking: Booking) {
    setBookingStatus(booking.id, "cancelled");
    addNotification({
      type: "booking_cancelled",
      title: "Booking declined",
      message: `Your booking request was declined by the agency.`,
      booking_id: booking.id,
    });
    forceUpdate((n) => n + 1);
  }

  function handleDepositReturn(bookingId: string) {
    markDepositReturned(bookingId);
    addNotification({
      type: "deposit_returned",
      title: "Deposit returned",
      message: "Your security deposit has been marked as returned by the agency.",
      booking_id: bookingId,
    });
    forceUpdate((n) => n + 1);
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Renter</TableHead>
              <TableHead>Bike</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => {
              const effectiveStatus = getEffectiveStatus(booking.id, booking.status);
              const depositDone = isDepositReturned(booking.id);
              const damaged = hasDamageReport(booking.id);

              return (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm">{booking.renter?.full_name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{booking.payment_method}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">
                      {booking.bike?.brand} {booking.bike?.model}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{formatDate(booking.start_date)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(booking.end_date)}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{formatPrice(booking.total_amount)}</p>
                    {effectiveStatus === "completed" && (
                      <p className={`text-xs mt-0.5 ${depositDone ? "text-emerald-400" : "text-yellow-400"}`}>
                        Deposit: {depositDone ? "returned ✓" : "pending"}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusColor(effectiveStatus)}`}
                      >
                        {effectiveStatus}
                      </span>
                      {damaged && (
                        <span className="inline-flex items-center gap-1 text-xs text-red-400">
                          <AlertTriangle className="h-3 w-3" /> Damage filed
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      {effectiveStatus === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Approve"
                            className="h-7 w-7 p-0 text-emerald-400 hover:text-emerald-400 hover:bg-emerald-400/10"
                            onClick={() => handleApprove(booking)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Reject"
                            className="h-7 w-7 p-0 text-red-400 hover:text-red-400 hover:bg-red-400/10"
                            onClick={() => handleReject(booking)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {(effectiveStatus === "active" || effectiveStatus === "completed") && !damaged && (
                        <Button
                          size="sm"
                          variant="ghost"
                          title="File damage report"
                          className="h-7 w-7 p-0 text-red-400 hover:text-red-400 hover:bg-red-400/10"
                          onClick={() => setDamageTarget(booking)}
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      )}
                      {effectiveStatus === "completed" && !depositDone && (
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Mark deposit returned"
                          className="h-7 w-7 p-0 text-emerald-400 hover:text-emerald-400 hover:bg-emerald-400/10"
                          onClick={() => handleDepositReturn(booking.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                      {effectiveStatus === "completed" && depositDone && (
                        <span title="Deposit returned" className="h-7 w-7 flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-emerald-400/40" />
                        </span>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {damageTarget && (
        <DamageReportModal
          open={!!damageTarget}
          onClose={() => setDamageTarget(null)}
          booking={damageTarget}
          onSubmitted={() => {
            setDamageTarget(null);
            forceUpdate((n) => n + 1);
          }}
        />
      )}
    </>
  );
}
