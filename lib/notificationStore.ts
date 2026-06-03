export type NotificationType =
  | "booking_submitted"
  | "booking_confirmed"
  | "booking_cancelled"
  | "reminder"
  | "overdue"
  | "deposit_returned";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  booking_id?: string;
  read: boolean;
  created_at: string;
}

const KEY = "rnr_notifications";

export function getNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AppNotification[]) : [];
  } catch {
    return [];
  }
}

export function addNotification(
  data: Omit<AppNotification, "id" | "created_at" | "read">
): AppNotification {
  const n: AppNotification = {
    ...data,
    id: `notif-${Date.now()}`,
    read: false,
    created_at: new Date().toISOString(),
  };
  const existing = getNotifications();
  localStorage.setItem(KEY, JSON.stringify([n, ...existing]));
  return n;
}

export function markRead(id: string): void {
  const updated = getNotifications().map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function markAllRead(): void {
  const updated = getNotifications().map((n) => ({ ...n, read: true }));
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}
