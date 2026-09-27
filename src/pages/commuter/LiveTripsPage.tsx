import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Navigation } from "lucide-react";
import PassengerTracking from "../../components/PassengerTracking";
import { useCommuterData } from "./CommuterDataContext";
import { formatDate, formatTime } from "./dashboard/utils";
import type { BookingRecord } from "./dashboard/types";

export default function LiveTripsPage() {
  const navigate = useNavigate();
  const { upcomingTrips } = useCommuterData();
  const [selected, setSelected] = useState<BookingRecord | null>(null);

  useEffect(() => {
    if (!selected && upcomingTrips.length > 0) {
      setSelected(upcomingTrips[0]);
      return;
    }
    if (selected && !upcomingTrips.some((b) => b.id === selected.id)) {
      setSelected(upcomingTrips[0] || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcomingTrips]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-montserrat text-xl font-bold text-gray-900">Live trips</h1>
        <p className="mt-1 text-sm text-gray-500">Follow your bus in real time from departure to arrival.</p>
      </div>

      {upcomingTrips.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white px-6 py-14 text-center">
          <Navigation className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <h3 className="text-base font-bold text-gray-900">No active trips</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            Your live trips will appear here when you have an active journey.
          </p>
          <button
            onClick={() => navigate("/commuter/search")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0077B6] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#005F8E]"
          >
            Find a bus
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="space-y-2">
            {upcomingTrips.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelected(b)}
                className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                  selected?.id === b.id ? "border-sky-500 bg-sky-50" : "border-gray-200 bg-white hover:border-sky-300"
                }`}
              >
                <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                  <span className="truncate">{b.fromStop}</span>
                  <ArrowRight className="h-3 w-3 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{b.toStop}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(b.scheduleDate)} · {formatTime(b.departureTime)}
                </p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                    {selected.fromStop} → {selected.toStop}
                  </span>
                  <button
                    onClick={() => navigate(`/track-bus/${selected.id}`, { state: { booking: selected } })}
                    className="text-xs font-semibold text-sky-600 hover:underline"
                  >
                    Open full view
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Departure", value: `${formatDate(selected.scheduleDate)} · ${formatTime(selected.departureTime)}` },
                    { label: "Seat", value: selected.seatNumber || "—" },
                    { label: "Reference", value: selected.bookingRef || selected.id },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl bg-gray-50 px-3 py-2.5">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
                <PassengerTracking
                  scheduleId={selected.scheduleId}
                  ticketId={selected.id}
                  routeFrom={selected.fromStop}
                  routeTo={selected.toStop}
                  departureTime={selected.departureTime || undefined}
                  autoStart
                />
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-gray-400">
                <MapPin className="mx-auto mb-2 h-6 w-6 text-gray-300" />
                Select a trip to see live tracking.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
