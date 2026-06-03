"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, AlertTriangle, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/agencies", label: "Agency Approvals", icon: Building2 },
  { href: "/admin/disputes", label: "Disputes", icon: AlertTriangle },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-60 border-r border-border bg-surface flex-shrink-0">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
        <ShieldCheck className="h-5 w-5 text-brand flex-shrink-0" />
        <div>
          <p className="text-sm font-bold leading-none">Super Admin</p>
          <p className="text-xs text-muted-foreground mt-0.5">Platform management</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-l-2 border-brand bg-brand/10 text-foreground pl-[10px]"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground border-l-2 border-transparent"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto text-brand" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <Link href="/" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
