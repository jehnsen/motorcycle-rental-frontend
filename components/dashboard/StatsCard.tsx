import { LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, className }: StatsCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-6", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-black mt-1">{value}</p>
          {trend && (
            <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", trendUp ? "text-emerald-400" : "text-red-400")}>
              <TrendingUp className={cn("h-3 w-3", !trendUp && "rotate-180")} />
              {trend}
            </div>
          )}
        </div>
        <div className="h-11 w-11 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
          <Icon className="h-5 w-5 text-brand" />
        </div>
      </div>
    </div>
  );
}
