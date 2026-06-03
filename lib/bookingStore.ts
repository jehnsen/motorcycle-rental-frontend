import type { Booking } from "@/types";
import { addNotification } from "@/lib/notificationStore";

const BOOKINGS_KEY = "rnr_bookings";
const PROFILE_KEY = "rnr_renter_profile";

export interface StoredRenterProfile {
  full_name: string;
  license_number: string;
  license_expiry: string;
  id_type: string;
  id_number: string;
  license_filename: string | null;
  id_filename: string | null;
  selfie_filename: string | null;
  submitted_at: string;
  is_verified: boolean;
}

export function getRenterBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

export function createRenterBooking(
  data: Omit<Booking, "id" | "created_at">
): Booking {
  const booking: Booking = {
    ...data,
    id: `booking-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const existing = getRenterBookings();
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify([booking, ...existing]));

  const bikeName = data.bike ? `${data.bike.brand} ${data.bike.model}` : "your bike";
  addNotification({
    type: "booking_submitted",
    title: "Booking submitted",
    message: `Your booking for ${bikeName} is pending agency confirmation.`,
    booking_id: booking.id,
  });

  return booking;
}

export function cancelRenterBooking(id: string): void {
  const updated = getRenterBookings().map((b) =>
    b.id === id ? { ...b, status: "cancelled" as const } : b
  );
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
}

export function getRenterProfile(): StoredRenterProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as StoredRenterProfile) : null;
  } catch {
    return null;
  }
}

export function saveRenterProfile(data: StoredRenterProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
}
