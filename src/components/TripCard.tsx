import React from "react";
import { ArrowRight, Bus, Calendar, Loader2, Navigation, QrCode, Ticket, X } from "lucide-react";
import type { BookingRecord } from "../pages/commuter/dashboard/types";
import { formatCurrency, formatDate, formatTime, isActiveBooking } from "../pages/commuter/dashboard/utils";
import StatusBadge from "./StatusBadge";

export default function TripCard({
  booking,
  onViewTicket,
  onTrackBus,
  onCancel,
  canceling,
  cancelable,
}: {
  booking: BookingRecord;
  onViewTicket: (b: BookingRecord) => void;
  onTrackBus: (b: BookingRecord) => void;
  onCancel: (b: BookingRecord) => void;
  canceling: boolean;
  cancelable: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-sky-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50">
          <Bus className="h-5 w-5 text-sky-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2 text-sm font-bold text-gray-900">
            <span className="truncate">{booking.fromStop}</span>
            <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            <span className="truncate">{booking.toStop}</span>
          </div>
          <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(booking.scheduleDate)}
            </span>
            <span className="flex items-center gap-1">
              <ArrowRight className="h-3 w-3" />
              {formatTime(booking.departureTime)}
            </span>
            {booking.seatNumber && (
              <span className="flex items-center gap-1">
                <Ticket className="h-3 w-3" />
                Seat {booking.seatNumber}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={booking.status} />
            {booking.fare && <span className="text-xs font-semibold text-sky-600">{formatCurrency(booking.fare)}</span>}
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
        <button
          onClick={() => onViewTicket(booking)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
        >
          <QrCode className="h-3.5 w-3.5" />
          QR Ticket
        </button>
        {isActiveBooking(booking) && (
          <button
            onClick={() => onTrackBus(booking)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-sky-600 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-700"
          >
            <Navigation className="h-3.5 w-3.5" />
            Track bus
          </button>
        )}
        {cancelable && (
          <button
            onClick={() => onCancel(booking)}
            disabled={canceling}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {canceling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
