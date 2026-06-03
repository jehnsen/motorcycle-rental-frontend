import Link from "next/link";
import { Bike } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand/10 border border-brand/20">
                <Bike className="h-4 w-4 text-brand" />
              </div>
              <span className="text-lg font-black">RentNRide<span className="text-brand">_PH</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Philippines&apos; premier motorcycle rental marketplace. Connect with verified agencies across Metro Manila, Cebu, and Baguio.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">For Renters</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/browse", label: "Browse Bikes" },
                { href: "/agencies", label: "Find Agencies" },
                { href: "/how-it-works", label: "How It Works" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">For Agencies</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/auth/register", label: "List Your Fleet" },
                { href: "/dashboard", label: "Agency Dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Payment</h4>
            <div className="flex flex-wrap gap-2">
              {["GCash", "Maya", "Cash"].map((method) => (
                <span key={method} className="rounded-md border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {method}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Secure transactions with GCash, Maya, and cash on pickup.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RentNRide_PH. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
