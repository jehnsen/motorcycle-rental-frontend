import type { Metadata } from "next";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin — RentNRide_PH",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-road">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
