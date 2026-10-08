"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Image as ImageIcon,
  Package,
  FolderTree,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Briefcase,
  Store,
  Settings,
  X,
  Store as StoreIcon,
} from "lucide-react";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const menuSections = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        name: "Homepage Manager",
        href: "/admin/homepage",
        icon: Sparkles,
      },
    ],
  },
  {
    title: "Catalog Management",
    items: [
      {
        name: "Products",
        href: "/admin/products",
        icon: Package,
      },
      {
        name: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
      },
      {
        name: "Subcategories",
        href: "/admin/subcategories",
        icon: Layers,
      },
    ],
  },
  {
    title: "Commerce & Users",
    items: [
      {
        name: "Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
      },
      {
        name: "Customers",
        href: "/admin/customers",
        icon: Users,
      },
      {
        name: "Coupons & Offers",
        href: "/admin/coupons",
        icon: Tag,
      },
    ],
  },
  {
    title: "Inquiries & Operations",
    items: [
      {
        name: "Franchise Leads",
        href: "/admin/franchise-leads",
        icon: Store,
      },
      {
        name: "Franchise Users",
        href: "/admin/franchise-users",
        icon: Users,
      },
      {
        name: "Franchise Orders",
        href: "/admin/franchise-orders",
        icon: ShoppingBag,
      },
      {
        name: "Vendor Leads",
        href: "/admin/vendor-leads",
        icon: Briefcase,
      },
      {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar({
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  function isActive(item: { href: string; exact?: boolean }) {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-900 text-slate-200">
      {/* BRAND HEADER */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-6">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0EA5E9] to-[#0EA5E9] text-white shadow-lg shadow-emerald-950/25">
            <span className="text-base font-black">SW</span>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              <span>SW Hub</span>
              <span className="text-[10px] font-bold text-[#0EA5E9] bg-[#0EA5E9]/60 border border-[#0EA5E9]/30 px-1.5 py-0.2 rounded-full">
                ADMIN
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Daily Needs Marketplace v2.0</p>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* NAVIGATION ITEMS */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6 sidebar-scroll">
        {menuSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </p>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                      active
                        ? "bg-gradient-to-r from-accent to-accent text-white font-bold shadow-md shadow-orange-500/20"
                        : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                    }`}
                  >
                    <Icon
                      size={17}
                      className={`shrink-0 transition ${
                        active
                          ? "text-white"
                          : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* FOOTER QUICK BRAND INFO */}
      <div className="border-t border-slate-800/80 p-4">
        <div className="rounded-xl bg-slate-800/40 p-3 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Sparkles size={14} className="text-slate-600" />
            <span>Storefront Active</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            All 5 dynamic shelves synced in real-time.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP STATIC SIDEBAR */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-40 border-r border-slate-800 shadow-xl">
        {sidebarContent}
      </aside>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}