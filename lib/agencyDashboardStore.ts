export interface DamageReport {
  id: string;
  booking_id: string;
  bike_id: string;
  renter_name: string;
  description: string;
  severity: "minor" | "major" | "total_loss";
  estimated_cost: number;
  created_at: string;
}

export interface DepositRefund {
  booking_id: string;
  returned_at: string;
}

export interface BookingOverride {
  booking_id: string;
  status: "confirmed" | "cancelled" | "active" | "completed";
  updated_at: string;
}

const DAMAGE_KEY = "rnr_damage_reports";
const DEPOSIT_KEY = "rnr_deposit_refunds";
const OVERRIDE_KEY = "rnr_booking_overrides";

// --- Damage reports ---

export function getDamageReports(): DamageReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DAMAGE_KEY);
    return raw ? (JSON.parse(raw) as DamageReport[]) : [];
  } catch {
    return [];
  }
}

export function addDamageReport(
  data: Omit<DamageReport, "id" | "created_at">
): DamageReport {
  const report: DamageReport = {
    ...data,
    id: `damage-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const existing = getDamageReports();
  localStorage.setItem(DAMAGE_KEY, JSON.stringify([report, ...existing]));
  return report;
}

export function hasDamageReport(bookingId: string): boolean {
  return getDamageReports().some((r) => r.booking_id === bookingId);
}

// --- Deposit refunds ---

export function getDepositRefunds(): DepositRefund[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DEPOSIT_KEY);
    return raw ? (JSON.parse(raw) as DepositRefund[]) : [];
  } catch {
    return [];
  }
}

export function markDepositReturned(bookingId: string): void {
  const existing = getDepositRefunds().filter((r) => r.booking_id !== bookingId);
  localStorage.setItem(
    DEPOSIT_KEY,
    JSON.stringify([{ booking_id: bookingId, returned_at: new Date().toISOString() }, ...existing])
  );
}

export function isDepositReturned(bookingId: string): boolean {
  return getDepositRefunds().some((r) => r.booking_id === bookingId);
}

// --- Booking status overrides (approve / reject) ---

export function getBookingOverrides(): BookingOverride[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(OVERRIDE_KEY);
    return raw ? (JSON.parse(raw) as BookingOverride[]) : [];
  } catch {
    return [];
  }
}

export function setBookingStatus(
  bookingId: string,
  status: BookingOverride["status"]
): void {
  const existing = getBookingOverrides().filter((o) => o.booking_id !== bookingId);
  localStorage.setItem(
    OVERRIDE_KEY,
    JSON.stringify([{ booking_id: bookingId, status, updated_at: new Date().toISOString() }, ...existing])
  );
}

export function getEffectiveStatus(
  bookingId: string,
  originalStatus: string
): string {
  const override = getBookingOverrides().find((o) => o.booking_id === bookingId);
  return override?.status ?? originalStatus;
}
