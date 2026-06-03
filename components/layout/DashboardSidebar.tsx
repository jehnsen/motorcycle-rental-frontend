"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Bike, CalendarCheck, Users, BarChart2,
  Settings, ChevronLeft, ChevronRight, LogOut, Bike as BikeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/fleet", label: "Fleet", icon: Bike },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/dashboard/renters", label: "Renters", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-surface transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-16 items-center border-b border-border px-4", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <BikeIcon className="h-5 w-5 text-brand flex-shrink-0" />
            <span className="text-sm font-bold">Dashboard</span>
          </Link>
        )}
        {collapsed && <BikeIcon className="h-5 w-5 text-brand" />}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={cn("text-muted-foreground hover:text-foreground transition-colors", collapsed && "ml-0")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-l-2 border-brand bg-brand/10 text-foreground pl-[10px]"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground border-l-2 border-transparent",
                collapsed && "justify-center px-2 border-l-0 border-b-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-border p-2">
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
