import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { AppAlert, BookingRecord, NotificationRecord } from "./dashboard/types";
import {
  authHeaders,
  dedupeBookings,
  isActiveBooking,
  isCanceledBooking,
  normalizeBooking,
  normalizeNotification,
  parseMaybeJson,
} from "./dashboard/utils";

// Preserved verbatim from the original commuterDashboard.tsx business logic.
export function isCancelable(booking: BookingRecord) {
  if (booking.status === "CANCELLED" || booking.status === "COMPLETED") return false;
  if (!booking.scheduleDate || !booking.departureTime) return true;
  const dt = new Date(`${booking.scheduleDate}T${booking.departureTime}`);
  if (Number.isNaN(dt.getTime())) return true;
  return (dt.getTime() - Date.now()) / (1000 * 60) >= 15;
}

type CommuterDataValue = {
  bookings: BookingRecord[];
  notifications: NotificationRecord[];
  alerts: AppAlert[];
  loadingBookings: boolean;
  loadingNotifications: boolean;
  refreshing: boolean;
  cancelingId: string | null;
  unreadCount: number;
  upcomingTrips: BookingRecord[];
  metrics: { total: number; upcoming: number; canceled: number; completed: number };
  pushAlert: (type: AppAlert["type"], message: string) => void;
  dismissAlert: (id: string) => void;
  refreshAll: () => Promise<void>;
  cancelBooking: (booking: BookingRecord) => Promise<void>;
  isCancelable: (booking: BookingRecord) => boolean;
  markAllNotificationsRead: () => void;
};

const CommuterDataContext = createContext<CommuterDataValue | null>(null);

export function CommuterDataProvider({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [alerts, setAlerts] = useState<AppAlert[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const pushAlert = (type: AppAlert["type"], message: string) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setAlerts((c) => [...c, { id, type, message }]);
    window.setTimeout(() => setAlerts((c) => c.filter((a) => a.id !== id)), 5000);
  };
  const dismissAlert = (id: string) => setAlerts((c) => c.filter((a) => a.id !== id));

  // Same two-endpoint merge/dedupe strategy as the original dashboard.
  const loadBookings = async () => {
    if (!accessToken) {
      setBookings([]);
      return;
    }
    setLoadingBookings(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/my-tickets", { headers: authHeaders(accessToken) }),
        fetch("/api/tickets", { headers: authHeaders(accessToken) }),
      ]);
      const [p1, p2] = await Promise.all([parseMaybeJson(r1), parseMaybeJson(r2)]);
      const list1 = Array.isArray(p1?.tickets) ? p1.tickets : [];
      const list2 = Array.isArray(p2?.tickets) ? p2.tickets : [];
      const merged = dedupeBookings([...list1, ...list2].map(normalizeBooking));
      setBookings(merged.filter((b) => Boolean(b.id)));
    } catch {
      pushAlert("error", "Failed to load your bookings. Please try again.");
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadNotifications = async () => {
    if (!accessToken) {
      setNotifications([]);
      setLoadingNotifications(false);
      return;
    }
    setLoadingNotifications(true);
    try {
      // limit bumped from 8 -> 20 since notifications now live in a scrollable
      // dropdown instead of a fixed dashboard section.
      const r = await fetch("/api/notifications?limit=20", { headers: authHeaders(accessToken) });
      const p = await parseMaybeJson(r);
      if (r.ok) setNotifications(Array.isArray(p?.data) ? p.data.map(normalizeNotification) : []);
    } catch {
      // silent — notifications are non-critical, matches original behavior
    } finally {
      setLoadingNotifications(false);
    }
  };

  const refreshAll = async () => {
    setRefreshing(true);
    await Promise.all([loadBookings(), loadNotifications()]);
    setRefreshing(false);
  };

  useEffect(() => {
    void refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const cancelBooking = async (booking: BookingRecord) => {
    if (!accessToken) {
      pushAlert("error", "You are not authenticated.");
      return;
    }
    if (!isCancelable(booking)) {
      pushAlert("error", "This booking can no longer be cancelled (less than 15 min to departure).");
      return;
    }
    if (!window.confirm("Cancel this booking?")) return;
    setCancelingId(booking.id);
    try {
      const r = await fetch(`/api/tickets/${booking.id}/cancel`, {
        method: "PATCH",
        headers: authHeaders(accessToken, true),
      });
      const p = await parseMaybeJson(r);
      if (!r.ok) throw new Error(p?.message || p?.error || "Failed to cancel booking.");
      setBookings((c) =>
        c.map((b) =>
          b.id === booking.id || b.id === p?.ticket?.id || b.bookingRef === booking.bookingRef
            ? { ...b, status: p?.ticket?.status || "CANCELLED" }
            : b,
        ),
      );
      await loadBookings();
      pushAlert("success", "Booking cancelled successfully.");
    } catch (err: any) {
      pushAlert("error", err?.message || "Failed to cancel booking.");
    } finally {
      setCancelingId(null);
    }
  };

  // NOTE: this only flips local state. There's no "/api/notifications/read-all"
  // call in the code you gave me — wire this to a real endpoint once one
  // exists, or tell me the route and I'll wire it now.
  const markAllNotificationsRead = () => {
    setNotifications((list) => list.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);
  const upcomingTrips = useMemo(
    () => bookings.filter((b) => !isCanceledBooking(b) && isActiveBooking(b)),
    [bookings],
  );
  const metrics = useMemo(
    () => ({
      total: bookings.length,
      upcoming: bookings.filter((b) => !isCanceledBooking(b) && isActiveBooking(b)).length,
      canceled: bookings.filter(isCanceledBooking).length,
      completed: bookings.filter((b) => b.status === "COMPLETED").length,
    }),
    [bookings],
  );

  const value: CommuterDataValue = {
    bookings,
    notifications,
    alerts,
    loadingBookings,
    loadingNotifications,
    refreshing,
    cancelingId,
    unreadCount,
    upcomingTrips,
    metrics,
    pushAlert,
    dismissAlert,
    refreshAll,
    cancelBooking,
    isCancelable,
    markAllNotificationsRead,
  };

  return <CommuterDataContext.Provider value={value}>{children}</CommuterDataContext.Provider>;
}

export function useCommuterData() {
  const ctx = useContext(CommuterDataContext);
  if (!ctx) throw new Error("useCommuterData must be used within CommuterDataProvider");
  return ctx;
}
