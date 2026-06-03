import { cn } from "@/lib/utils";

interface AvailabilityBadgeProps {
  isAvailable: boolean;
  className?: string;
}

export function AvailabilityBadge({ isAvailable, className }: AvailabilityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        isAvailable
          ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
          : "border-red-500/30 bg-red-500/20 text-red-400",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isAvailable ? "bg-emerald-400" : "bg-red-400"
        )}
      />
      {isAvailable ? "Available" : "Unavailable"}
    </span>
  );
}
