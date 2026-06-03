import type { Metadata } from "next";
import { AccountSidebar } from "@/components/layout/AccountSidebar";

export const metadata: Metadata = {
  title: "My Account — RentNRide_PH",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-road">
      <AccountSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
