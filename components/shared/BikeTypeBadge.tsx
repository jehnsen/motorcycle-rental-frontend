import { cn, getBikeTypeLabel, getBikeTypeColor } from "@/lib/utils";
import type { BikeType } from "@/types";

interface BikeTypeBadgeProps {
  type: BikeType;
  className?: string;
}

export function BikeTypeBadge({ type, className }: BikeTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        getBikeTypeColor(type),
        className
      )}
    >
      {getBikeTypeLabel(type)}
    </span>
  );
}
