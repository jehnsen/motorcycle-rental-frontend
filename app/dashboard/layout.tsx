import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export const metadata: Metadata = {
  title: "Agency Dashboard — RentNRide_PH",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-road">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
