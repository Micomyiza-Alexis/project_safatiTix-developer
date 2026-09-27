import React from "react";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

export default function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase();
  if (s === "CONFIRMED" || s === "ACTIVE")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        <CheckCircle className="h-3 w-3" />
        Confirmed
      </span>
    );
  if (s === "CANCELLED")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
        <XCircle className="h-3 w-3" />
        Cancelled
      </span>
    );
  if (s === "COMPLETED")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
        <CheckCircle className="h-3 w-3" />
        Completed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
      <Calendar className="h-3 w-3" />
      {status || "Pending"}
    </span>
  );
}
