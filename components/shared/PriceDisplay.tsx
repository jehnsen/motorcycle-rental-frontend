import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  amount: number;
  period?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceDisplay({ amount, period = "/day", size = "md", className }: PriceDisplayProps) {
  const priceSize = {
    sm: "text-lg font-bold",
    md: "text-2xl font-bold",
    lg: "text-3xl font-bold",
  }[size];

  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className={cn(priceSize, "text-foreground")}>{formatPrice(amount)}</span>
      {period && <span className="text-sm text-muted-foreground">{period}</span>}
    </div>
  );
}
