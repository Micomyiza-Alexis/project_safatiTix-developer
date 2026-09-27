import React from "react";
import { NavLink } from "react-router-dom";
import { Bus, HelpCircle, LayoutDashboard, LogOut, Navigation, Search, Settings, Ticket } from "lucide-react";
import { useAuth } from "../../components/AuthContext";

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

type Item = { to: string; label: string; icon: React.ElementType; end?: boolean };

const MAIN_ITEMS: Item[] = [
  { to: "/commuter", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/commuter/search", label: "Search trips", icon: Search },
  { to: "/commuter/tickets", label: "My tickets", icon: Ticket },
  { to: "/commuter/live", label: "Live trips", icon: Navigation },
];

const SUPPORT_ITEMS: Item[] = [
  { to: "/commuter/help", label: "Help center", icon: HelpCircle },
  { to: "/commuter/settings", label: "Settings", icon: Settings },
];

function NavGroup({ title, items }: { title: string; items: Item[] }) {
  return (
    <div className="space-y-0.5">
      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">{title}</p>
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#0077B6] text-white shadow-[0_4px_14px_rgba(0,119,182,0.3)]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );
}

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const userName = user?.name || "Commuter";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0077B6]">
          <Bus className="h-4 w-4 text-white" />
        </div>
        <span className="font-montserrat font-bold text-gray-900">
          Safari<span className="text-[#0077B6]">Tix</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <NavGroup title="Main" items={MAIN_ITEMS} />
        <NavGroup title="Support / Account" items={SUPPORT_ITEMS} />
      </nav>

      <div className="border-t border-gray-100 px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-gray-50">
          <Avatar name={userName} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-400">Commuter</p>
          </div>
          <button
            onClick={signOut}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
