import React from "react";
import { X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { BookingRecord } from "../pages/commuter/dashboard/types";
import { formatCurrency, formatDate, formatTime } from "../pages/commuter/dashboard/utils";

export default function TicketPreviewModal({ booking, onClose }: { booking: BookingRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-200">Boarding pass</p>
              <h4 className="mt-1.5 font-montserrat text-lg font-bold">
                {booking.fromStop} → {booking.toStop}
              </h4>
              <p className="mt-0.5 text-sm text-sky-200">
                {formatDate(booking.scheduleDate)} · {formatTime(booking.departureTime)}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { label: "Seat", value: booking.seatNumber },
              { label: "Fare", value: formatCurrency(booking.fare) },
              { label: "Bus plate", value: booking.busPlate },
              { label: "Reference", value: booking.bookingRef || booking.id },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-gray-50 px-3 py-2.5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
                <p className="mt-0.5 truncate font-semibold text-gray-800">{value || "—"}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
            <div className="inline-flex rounded-2xl bg-white p-4 shadow-sm">
              <QRCodeSVG value={booking.bookingRef || booking.id} size={160} level="H" includeMargin />
            </div>
            <p className="mt-3 text-xs text-gray-400">Show this QR code to the driver when boarding.</p>
          </div>

          <button onClick={onClose} className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
