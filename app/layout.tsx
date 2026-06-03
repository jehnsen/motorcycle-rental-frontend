import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
