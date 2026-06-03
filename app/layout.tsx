import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PublicShell } from "@/components/layout/PublicShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RentNRide_PH — Motorcycle Rental Marketplace Philippines",
  description:
    "Rent big bikes, nakeds, and scooters across the Philippines. Verified agencies in Manila, Cebu, and Baguio. Book online with GCash or Maya.",
  keywords: "motorcycle rental Philippines, rent motorbike Manila, Cebu motorcycle rental, Baguio bike rental",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-road text-foreground antialiased`}>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
