"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingTable } from "@/components/dashboard/BookingTable";
import { useBookings } from "@/lib/hooks/useBookings";
import { createClient } from "@/lib/supabase/client";
import type { BookingStatus } from "@/types";

const tabs: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all",       label: "All" },
  { value: "pending",   label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "active",    label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [agencyId, setAgencyId] = useState<string | undefined>();

  useEffect(() => {
    createClient()
      .from("moto_agencies")
      .select("id")
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setAgencyId((data as { id: string }).id); });
  }, []);

  const status = activeTab === "all" ? undefined : activeTab as BookingStatus;
  const { bookings, loading } = useBookings(agencyId, status);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black">Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage all incoming and active rental bookings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-surface-2 animate-pulse" />
              ))}
            </div>
          ) : (
            <BookingTable bookings={bookings} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
