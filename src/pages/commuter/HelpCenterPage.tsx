import React, { useState } from "react";
import { CreditCard, HelpCircle, MapPin, QrCode, Search, Ticket, XCircle } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { useCommuterData } from "./CommuterDataContext";
import ComplaintSection from "./dashboard/components/ComplaintSection";

const TOPICS = [
  { icon: Ticket, label: "Booking a trip" },
  { icon: Search, label: "Managing tickets" },
  { icon: CreditCard, label: "Payments" },
  { icon: XCircle, label: "Cancellation" },
  { icon: MapPin, label: "Tracking a bus" },
  { icon: QrCode, label: "QR tickets" },
];

export default function HelpCenterPage() {
  const { accessToken } = useAuth();
  const { bookings } = useCommuterData();
  const [query, setQuery] = useState("");

  const filteredTopics = TOPICS.filter((t) => t.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-montserrat text-xl font-bold text-gray-900">Help center</h1>
        <p className="mt-1 text-sm text-gray-500">How can we help?</p>
      </div>

      <div className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help topics…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-400">Popular topics</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {filteredTopics.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-sky-300 hover:shadow-md"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50">
                <Icon className="h-4 w-4 text-sky-600" />
              </div>
              <span className="text-sm font-semibold text-gray-800">{label}</span>
            </div>
          ))}
          {filteredTopics.length === 0 && (
            <p className="col-span-full py-6 text-center text-sm text-gray-400">No topics match "{query}".</p>
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-sky-600" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Contact support</h2>
        </div>
        <ComplaintSection
          accessToken={accessToken}
          bookings={bookings.map((b) => ({
            id: b.id,
            scheduleId: b.scheduleId,
            fromStop: b.fromStop,
            toStop: b.toStop,
            scheduleDate: b.scheduleDate,
          }))}
        />
      </section>
    </div>
  );
}
