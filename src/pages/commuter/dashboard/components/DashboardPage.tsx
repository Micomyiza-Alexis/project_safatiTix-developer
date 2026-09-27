import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bus,
  Calendar,
  ChevronRight,
  Loader2,
  MapPin,
  Navigation,
  QrCode,
  Route,
  Search,
  Ticket,
  X,
} from "lucide-react";
import { useAuth } from "../../../../components/AuthContext";
import { useCommuterData } from "../../CommuterDataContext";
import { formatCurrency, formatDate, formatTime } from "../utils";
import type { BookingRecord } from "../types";
import StatusBadge from "../../../../components/StatusBadge";
import TripCard from "../../../../components/TripCard";
import TicketPreviewModal from "../../../../components/TicketPreviewModal";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const today = new Date().toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function StatCard({
  icon,
  label,
  value,
  barPct,
  barColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  barPct: number;
  barColor: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">{icon}</div>
      <p className="font-montserrat text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${barPct}%`, background: barColor }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bookings, upcomingTrips, metrics, loadingBookings, cancelBooking, cancelingId, isCancelable } =
    useCommuterData();
  const [ticketPreview, setTicketPreview] = useState<BookingRecord | null>(null);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState(new Date().toISOString().slice(0, 10));

  const userName = user?.name || "Commuter";

  const recentTrips = useMemo(
    () => [...bookings].sort((a, b) => (b.scheduleDate || "").localeCompare(a.scheduleDate || "")).slice(0, 4),
    [bookings],
  );

  const goToSearch = () => {
    const p = new URLSearchParams();
    if (searchFrom.trim()) p.set("from", searchFrom.trim());
    if (searchTo.trim()) p.set("to", searchTo.trim());
    if (searchDate) p.set("date", searchDate);
    navigate(`/commuter/search${p.toString() ? `?${p}` : ""}`);
  };

  const handleTrackBus = (booking: BookingRecord) => navigate(`/track-bus/${booking.id}`, { state: { booking } });

  const nextTrip = upcomingTrips[0];

  return (
    <div className="space-y-6">
      {/* hero */}
      <section
        className="relative overflow-hidden rounded-3xl p-7 text-white md:p-9"
        style={{ background: "linear-gradient(135deg, #0077B6 0%, #005F8E 55%, #00436A 100%)" }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-14 right-20 h-40 w-40 rounded-full bg-amber-400/10" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sky-200">{today}</p>
            <h1 className="font-montserrat text-2xl font-bold leading-tight md:text-3xl">
              {greeting()}, {userName.split(" ")[0]}
            </h1>
            <p className="mt-2 max-w-md text-sm text-sky-200">
              {metrics.upcoming > 0
                ? `You have ${metrics.upcoming} upcoming trip${metrics.upcoming > 1 ? "s" : ""}. Stay on track.`
                : "No upcoming trips yet — book one to get started."}
            </p>
          </div>
          <button
            onClick={goToSearch}
            className="flex flex-shrink-0 items-center gap-2 self-start rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-400/30 transition-colors hover:bg-amber-500"
          >
            <Ticket className="h-4 w-4" />
            Book ticket
          </button>
        </div>
      </section>

      {/* quick search */}
      <section className="relative overflow-hidden rounded-3xl bg-[#005F8E] p-5 shadow-sm md:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-200">Plan your next trip</p>
          <h2 className="mt-1 font-montserrat text-xl font-bold text-white md:text-2xl">Where are you going?</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToSearch();
            }}
            className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_180px_auto] md:items-end"
          >
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-sky-100">From</span>
              <div className="flex h-12 items-center rounded-xl border border-white/15 bg-white px-3 shadow-sm">
                <MapPin className="mr-2 h-4 w-4 shrink-0 text-[#0077B6]" />
                <input
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  placeholder="Departure"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-sky-100">To</span>
              <div className="flex h-12 items-center rounded-xl border border-white/15 bg-white px-3 shadow-sm">
                <Navigation className="mr-2 h-4 w-4 shrink-0 text-[#0077B6]" />
                <input
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  placeholder="Destination"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-sky-100">Travel date</span>
              <div className="flex h-12 items-center rounded-xl border border-white/15 bg-white px-3 shadow-sm">
                <Calendar className="mr-2 h-4 w-4 shrink-0 text-[#0077B6]" />
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                />
              </div>
            </label>
            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F4A261] px-5 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-[#e89555] active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              Search buses
            </button>
          </form>
        </div>
      </section>

      {/* overview stats */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={<Calendar className="h-5 w-5 text-sky-600" />}
          label="Upcoming trips"
          value={loadingBookings ? "…" : metrics.upcoming}
          barPct={Math.min((metrics.upcoming / Math.max(metrics.total, 1)) * 100, 100)}
          barColor="#0077B6"
        />
        <StatCard
          icon={<Ticket className="h-5 w-5 text-amber-500" />}
          label="Active tickets"
          value={loadingBookings ? "…" : metrics.upcoming}
          barPct={60}
          barColor="#F4A261"
        />
        <StatCard
          icon={<Route className="h-5 w-5 text-emerald-600" />}
          label="Total trips"
          value={loadingBookings ? "…" : metrics.total}
          barPct={Math.min((metrics.total / 50) * 100, 100)}
          barColor="#27AE60"
        />
      </section>

      {/* next trip */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-600">Your journey</p>
            <h2 className="mt-1 font-montserrat text-lg font-bold text-gray-900">Your next trip</h2>
          </div>
          <button onClick={() => navigate("/commuter/tickets")} className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700">
            View all
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {loadingBookings ? (
          <div className="flex items-center justify-center rounded-3xl border border-gray-200 bg-white py-16">
            <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
          </div>
        ) : !nextTrip ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center md:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50">
              <Bus className="h-7 w-7 text-sky-500" />
            </div>
            <h3 className="mt-4 text-base font-bold text-gray-900">No upcoming trips yet</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
              Your next journey will appear here after you book a ticket.
            </p>
            <button
              onClick={goToSearch}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0077B6] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#005F8E]"
            >
              <Search className="h-4 w-4" />
              Find a bus
            </button>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl bg-[#005F8E] shadow-sm">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/5" />
            <div className="relative p-5 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-100">
                  <Ticket className="h-3 w-3" />
                  Next trip
                </div>
                <StatusBadge status={nextTrip.status} />
              </div>

              <div className="mt-6 flex items-center gap-3 md:gap-5">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-200">From</p>
                  <p className="mt-1 truncate text-xl font-bold text-white md:text-2xl">{nextTrip.fromStop}</p>
                </div>
                <div className="flex shrink-0 flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1 text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-200">To</p>
                  <p className="mt-1 truncate text-xl font-bold text-white md:text-2xl">{nextTrip.toStop}</p>
                </div>
              </div>

              <p className="mt-3 text-sm text-sky-100">
                {formatDate(nextTrip.scheduleDate)} · {formatTime(nextTrip.departureTime)}
                {nextTrip.seatNumber ? ` · Seat ${nextTrip.seatNumber}` : ""}
                {nextTrip.fare ? ` · ${formatCurrency(nextTrip.fare)}` : ""}
              </p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => handleTrackBus(nextTrip)}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#F4A261] text-sm font-bold text-white transition-colors hover:bg-[#e89555]"
                >
                  <Navigation className="h-4 w-4" />
                  Track bus
                </button>
                <button
                  onClick={() => setTicketPreview(nextTrip)}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-[#005F8E] transition-colors hover:bg-sky-50"
                >
                  <QrCode className="h-4 w-4" />
                  View ticket
                </button>
                {isCancelable(nextTrip) && (
                  <button
                    onClick={() => cancelBooking(nextTrip)}
                    disabled={cancelingId === nextTrip.id}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 text-white transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    title="Cancel trip"
                  >
                    {cancelingId === nextTrip.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* recent trips */}
      {recentTrips.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-montserrat text-lg font-bold text-gray-900">Recent trips</h2>
            <button onClick={() => navigate("/commuter/tickets")} className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700">
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {recentTrips.map((b) => (
              <TripCard
                key={b.id}
                booking={b}
                onViewTicket={setTicketPreview}
                onTrackBus={handleTrackBus}
                onCancel={cancelBooking}
                canceling={cancelingId === b.id}
                cancelable={isCancelable(b)}
              />
            ))}
          </div>
        </section>
      )}

      {ticketPreview && <TicketPreviewModal booking={ticketPreview} onClose={() => setTicketPreview(null)} />}
    </div>
  );
}
