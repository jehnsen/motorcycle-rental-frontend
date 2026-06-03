"use client";

import { CheckCircle2, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

interface BookingTableProps {
  bookings: Booking[];
  status?: BookingStatus;
}

export function BookingTable({ bookings }: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm rounded-xl border border-border bg-surface">
        No bookings found
      </div>
    );
  }

  return (
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
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div>
                  <p className="font-semibold text-sm">{booking.renter?.full_name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{booking.payment_method}</p>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm font-medium">{booking.bike?.brand} {booking.bike?.model}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm">{formatDate(booking.start_date)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(booking.end_date)}</p>
              </TableCell>
              <TableCell className="font-semibold">{formatPrice(booking.total_amount)}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {booking.status === "pending" && (
                    <>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-emerald-400 hover:text-emerald-400 hover:bg-emerald-400/10">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-400 hover:bg-red-400/10">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
