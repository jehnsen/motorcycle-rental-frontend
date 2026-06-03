"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/browse", label: "Browse Bikes" },
  { href: "/agencies", label: "Agencies" },
  { href: "/how-it-works", label: "How It Works" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-road/80 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-brand/10 border border-brand/20 group-hover:bg-brand/20 transition-colors">
            <Bike className="h-4 w-4 text-brand" />
          </div>
          <span className="text-lg font-black tracking-tight">
            RentNRide
            <span className="text-brand">_PH</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/register">Sign up</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-road">
          <div className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-surface-2 text-foreground"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>Log in</Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}>Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
