"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BikeTypeBadge } from "@/components/shared/BikeTypeBadge";
import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { formatPrice, getInitials } from "@/lib/utils";
import type { Bike } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface FleetTableProps {
  bikes: Bike[];
}

export function FleetTable({ bikes }: FleetTableProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Fleet Management</h2>
          <p className="text-sm text-muted-foreground">{bikes.length} bikes in your fleet</p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Bike
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Add New Bike</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Input placeholder="e.g. Yamaha" />
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input placeholder="e.g. MT-07" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="big_bike">Big Bike</SelectItem>
                      <SelectItem value="naked">Naked</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="scooter">Scooter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input type="number" placeholder="2023" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Daily Rate (₱)</Label>
                  <Input type="number" placeholder="1500" />
                </div>
                <div className="space-y-2">
                  <Label>Deposit (₱)</Label>
                  <Input type="number" placeholder="3000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Plate Number</Label>
                <Input placeholder="AAA 0000" />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input placeholder="e.g. Midnight Black" />
              </div>
              <Button className="w-full" onClick={() => setOpen(false)}>Save Bike</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bike</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Plate</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bikes.map((bike) => (
              <TableRow key={bike.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-surface-3 border border-border flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-muted-foreground">{bike.brand[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{bike.brand} {bike.model}</p>
                      <p className="text-xs text-muted-foreground">{bike.year} · {bike.color}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><BikeTypeBadge type={bike.type} /></TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{bike.plate_number}</TableCell>
                <TableCell className="font-semibold">{formatPrice(bike.daily_rate)}/day</TableCell>
                <TableCell><AvailabilityBadge isAvailable={bike.is_available} /></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2"><Edit className="h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-400 focus:text-red-400"><Trash2 className="h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
