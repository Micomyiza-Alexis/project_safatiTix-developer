import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, RefreshCw, Search, Settings, X } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { CommuterDataProvider, useCommuterData } from "./CommuterDataContext";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";

function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="flex flex-shrink-0 select-none items-center justify-center rounded-full bg-[#0077B6] font-bold text-white"
    >
      {initials}
    </div>
  );
}

function AlertBanners() {
  const { alerts, dismissAlert } = useCommuterData();
  if (alerts.length === 0) return null;
  const styles = {
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    info: "bg-sky-50 border-sky-200 text-sky-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  } as const;
  return (
    <div className="space-y-2 px-4 pt-4 md:px-6">
      {alerts.map((a) => (
        <div key={a.id} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${styles[a.type]}`}>
          <span className="flex-1">{a.message}</span>
          <button onClick={() => dismissAlert(a.id)} className="hover:opacity-70" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function ShellInner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { refreshAll, refreshing } = useCommuterData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userName = user?.name || "Commuter";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-inter text-gray-900">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 flex-shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white lg:flex xl:w-64">
        <Sidebar />
      </aside>

      {/* mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 h-full w-64 bg-white shadow-xl">
            <Sidebar />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            onClick={() => navigate("/commuter/search")}
            className="hidden h-9 max-w-xs flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 text-left text-sm text-gray-400 transition-colors hover:border-[#0077B6]/40 sm:flex"
          >
            <Search className="h-4 w-4 flex-shrink-0" />
            Search trips, tickets…
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={refreshAll}
              disabled={refreshing}
              aria-label="Refresh"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <NotificationBell />
            <button
              onClick={() => navigate("/commuter/settings")}
              aria-label="Settings"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100"
            >
              <Settings className="h-4 w-4" />
            </button>
            <div className="ml-1">
              <Avatar name={userName} />
            </div>
          </div>
        </header>

        <AlertBanners />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CommuterShell() {
  return (
    <CommuterDataProvider>
      <ShellInner />
    </CommuterDataProvider>
  );
}
