import { Flag, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { Renter } from "@/types";

interface RenterTableProps {
  renters: Renter[];
}

export function RenterTable({ renters }: RenterTableProps) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Renter</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renters.map((renter) => (
            <TableRow key={renter.id}>
              <TableCell>
                <div>
                  <p className="font-semibold text-sm">{renter.full_name}</p>
                  <p className="text-xs text-muted-foreground">{renter.id_type}</p>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-mono text-xs text-muted-foreground">{renter.license_number}</p>
                <p className="text-xs text-muted-foreground">Exp: {formatDate(renter.license_expiry)}</p>
              </TableCell>
              <TableCell>
                {renter.is_verified ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                    <AlertTriangle className="h-3.5 w-3.5" /> Pending
                  </span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{renter.booking_count ?? 0}</span>
              </TableCell>
              <TableCell>
                {renter.is_blacklisted ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400">
                    <XCircle className="h-3 w-3" /> Blacklisted
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    Good standing
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className={renter.is_blacklisted ? "text-emerald-400 hover:text-emerald-400 hover:bg-emerald-400/10 text-xs" : "text-red-400 hover:text-red-400 hover:bg-red-400/10 text-xs"}
                >
                  <Flag className="h-3.5 w-3.5 mr-1" />
                  {renter.is_blacklisted ? "Unflag" : "Flag"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
