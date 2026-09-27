import React from "react";
import { LogOut, Shield, SlidersHorizontal, User } from "lucide-react";
import { useAuth } from "../../components/AuthContext";

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50">
          <Icon className="h-4 w-4 text-sky-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-montserrat text-xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your profile and account.</p>
      </div>

      <SettingsSection icon={User} title="Profile" description="Your personal information">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Name</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-800">{user?.name || "—"}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Email</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-800">{user?.email || "—"}</p>
          </div>
        </div>
      </SettingsSection>

      {/*
        Deliberately not building out toggles/forms here — I have no backend
        endpoints for notification prefs, password change, or language in the
        code you gave me. Fill these in once those routes exist; a fake
        toggle that doesn't persist is worse than no toggle.
      */}
      <SettingsSection icon={SlidersHorizontal} title="Preferences" description="Notification and language preferences">
        <p className="text-sm text-gray-400">
          Not wired to the backend yet — tell me the endpoint and I'll build this out.
        </p>
      </SettingsSection>

      <SettingsSection icon={Shield} title="Security" description="Password and account security">
        <p className="text-sm text-gray-400">Not available in this build yet.</p>
      </SettingsSection>

      <section className="rounded-2xl border border-red-100 bg-red-50/50 p-5">
        <h2 className="mb-1 font-semibold text-gray-900">Account</h2>
        <p className="mb-4 text-xs text-gray-500">Sign out of SafariTix on this device.</p>
        <button
          onClick={signOut}
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </section>
    </div>
  );
}
