import React, { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useCommuterData } from "./CommuterDataContext";

export default function NotificationBell() {
  const { notifications, unreadCount, loadingNotifications, markAllNotificationsRead } = useCommuterData();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="font-montserrat text-sm font-bold text-gray-900">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={markAllNotificationsRead} className="text-xs font-semibold text-[#0077B6] hover:underline">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {loadingNotifications ? (
              <div className="py-8 text-center text-sm text-gray-400">Loading…</div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="mx-auto mb-2 h-6 w-6 text-gray-300" />
                <p className="text-sm font-semibold text-gray-500">You're all caught up</p>
                <p className="mt-0.5 text-xs text-gray-400">No new notifications.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50 ${
                    !n.isRead ? "bg-sky-50/50" : ""
                  }`}
                >
                  {!n.isRead && <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0077B6]" />}
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm leading-snug text-gray-800 ${!n.isRead ? "font-semibold" : ""}`}>
                      {n.message || n.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
