import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-brand/30 bg-brand/20 text-brand",
        secondary: "border-border bg-surface-2 text-muted-foreground",
        destructive: "border-red-500/30 bg-red-500/20 text-red-400",
        outline: "border-border text-foreground",
        success: "border-emerald-500/30 bg-emerald-500/20 text-emerald-400",
        warning: "border-yellow-500/30 bg-yellow-500/20 text-yellow-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
