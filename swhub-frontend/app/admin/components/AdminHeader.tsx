"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  ExternalLink,
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react";

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
}

export default function AdminHeader({
  onToggleMobileSidebar,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<string>("Kaif (Admin)");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("adminUser");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.name || parsed.username) {
          setAdminUser(parsed.name || parsed.username);
        }
      } catch {
        // use default
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.replace("/admin/login");
  }

  // Derive human-friendly title from pathname
  const pathParts = pathname.replace("/admin", "").split("/").filter(Boolean);
  const currentTitle =
    pathParts.length === 0
      ? "Dashboard Overview"
      : pathParts[0]
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur transition-all">
      {/* LEFT: MOBILE TOGGLE & BREADCRUMBS */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link
            href="/admin"
            className="text-slate-400 hover:text-slate-600 transition"
          >
            Admin
          </Link>
          {pathParts.length > 0 && (
            <>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-slate-800 font-bold capitalize">
                {currentTitle}
              </span>
            </>
          )}
        </div>
      </div>

      {/* RIGHT: QUICK ACTIONS, STORE LINK & PROFILE */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* VIEW STOREFRONT BUTTON */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#0EA5E9] bg-amber-50/70 px-3.5 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-amber-50 hover:border-[#0EA5E9] shadow-sm"
        >
          <ExternalLink size={13} />
          <span>View Storefront</span>
        </Link>

        {/* STATUS PILL */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-[#0EA5E9] border border-[#0EA5E9]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
          <span>Live API</span>
        </div>

        {/* ADMIN PROFILE CHIP */}
        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3 sm:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-accent to-accent text-xs font-black text-white shadow-sm">
            {adminUser[0]?.toUpperCase() || "A"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {adminUser}
            </p>
            <span className="inline-block text-[10px] font-semibold text-slate-600 bg-amber-50 px-1.5 py-0.2 rounded">
              Super Admin
            </span>
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-600/10 hover:text-red-600 transition"
            title="Log out of Admin"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/20 text-red-600 mb-3">
              <LogOut size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Sign out of Admin?
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              You will need to sign back in with your administrator credentials.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-600 shadow-md shadow-red-600/20 transition"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
