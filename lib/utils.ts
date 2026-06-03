import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateRentalDays(startDate: string, endDate: string): number {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const days = differenceInDays(end, start);
  return Math.max(1, days);
}

export function calculateTotalPrice(
  dailyRate: number,
  startDate: string,
  endDate: string
): number {
  const days = calculateRentalDays(startDate, endDate);
  return dailyRate * days;
}

export function getBikeTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    big_bike: "Big Bike",
    naked: "Naked",
    scooter: "Scooter",
    adventure: "Adventure",
  };
  return labels[type] ?? type;
}

export function getBikeTypeColor(type: string): string {
  const colors: Record<string, string> = {
    big_bike: "bg-brand/20 text-brand border-brand/30",
    naked: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    scooter: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    adventure: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };
  return colors[type] ?? "bg-surface-3 text-muted-foreground border-border";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    completed: "bg-surface-3 text-muted-foreground border-border",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return colors[status] ?? "bg-surface-3 text-muted-foreground border-border";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
