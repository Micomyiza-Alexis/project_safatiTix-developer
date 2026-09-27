import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { useCommuterData } from "./CommuterDataContext";
import BookingList from "./dashboard/components/BookingList";
import TicketPreviewModal from "../../components/TicketPreviewModal";
import { isActiveBooking, isCanceledBooking, isPastBooking } from "./dashboard/utils";
import type { BookingFilter, BookingRecord } from "./dashboard/types";

const TABS: { key: BookingFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Completed" },
  { key: "canceled", label: "Cancelled" },
];

export default function MyTicketsPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { bookings, loadingBookings, cancelingId, cancelBooking } = useCommuterData();
  const [activeFilter, setActiveFilter] = useState<BookingFilter>("all");
  const [ticketPreview, setTicketPreview] = useState<BookingRecord | null>(null);

  // Same filter semantics as the original commuterDashboard.tsx.
  const filteredBookings = useMemo(() => {
    if (activeFilter === "all") return bookings;
    if (activeFilter === "canceled") return bookings.filter(isCanceledBooking);
    if (activeFilter === "past") return bookings.filter((b) => !isCanceledBooking(b) && isPastBooking(b));
    return bookings.filter((b) => !isCanceledBooking(b) && isActiveBooking(b));
  }, [bookings, activeFilter]);

  const handleTrackBus = (booking: BookingRecord) => navigate(`/track-bus/${booking.id}`, { state: { booking } });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-montserrat text-xl font-bold text-gray-900">My tickets</h1>
        <p className="mt-1 text-sm text-gray-500">View, track, and manage every trip you've booked.</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveFilter(t.key)}
            className={`whitespace-nowrap rounded-xl px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeFilter === t.key
                ? "bg-sky-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-sky-300 hover:text-sky-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <BookingList
        bookings={filteredBookings}
        loading={loadingBookings}
        activeFilter={activeFilter}
        cancelingId={cancelingId}
        accessToken={accessToken}
        onFilterChange={setActiveFilter}
        onViewTicket={setTicketPreview}
        onCancelBooking={cancelBooking}
        onTrackBus={handleTrackBus}
      />

      {ticketPreview && <TicketPreviewModal booking={ticketPreview} onClose={() => setTicketPreview(null)} />}
    </div>
  );
}
