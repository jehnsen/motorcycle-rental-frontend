"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, CalendarCheck, Clock, AlertTriangle, RefreshCw, X as XIcon } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  getNotifications,
  markRead,
  markAllRead,
  getUnreadCount,
  type AppNotification,
  type NotificationType,
} from "@/lib/notificationStore";

const TYPE_META: Record<NotificationType, { icon: React.ElementType; color: string }> = {
  booking_submitted: { icon: CalendarCheck, color: "text-brand" },
  booking_confirmed: { icon: CheckCheck, color: "text-emerald-400" },
  booking_cancelled: { icon: XIcon, color: "text-red-400" },
  reminder: { icon: Clock, color: "text-yellow-400" },
  overdue: { icon: AlertTriangle, color: "text-red-400" },
  deposit_returned: { icon: RefreshCw, color: "text-emerald-400" },
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  function refresh() {
    setNotifications(getNotifications());
    setUnread(getUnreadCount());
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleMarkAll() {
    markAllRead();
    refresh();
  }

  function handleRead(id: string) {
    markRead(id);
    refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 rounded-xl border border-border bg-surface shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-2">
            <p className="text-sm font-semibold">Notifications</p>
            {unread > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-xs text-brand hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const meta = TYPE_META[n.type];
                const Icon = meta.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleRead(n.id)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-surface-2 transition-colors ${
                      n.read ? "opacity-60" : ""
                    }`}
                  >
                    <div className={`mt-0.5 flex-shrink-0 ${meta.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold truncate">{n.title}</p>
                        {!n.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {formatDistanceToNow(parseISO(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
