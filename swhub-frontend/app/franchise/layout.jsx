"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, Package, ShoppingBag, 
  FileText, LogOut, Store 
} from "lucide-react";
import toast from "react-hot-toast";

export default function FranchiseLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  const isLoginPage = pathname === "/franchise/login";
  const isPublicPage = pathname === "/franchise";

  useEffect(() => {
    if (isLoginPage || isPublicPage) return;
    const token = localStorage.getItem("franchiseToken");
    const u = localStorage.getItem("franchiseUser");
    if (!token || !u) {
      router.push("/franchise/login");
    } else {
      setUser(JSON.parse(u));
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("franchiseToken");
    localStorage.removeItem("franchiseUser");
    toast.success("Logged out successfully");
    router.push("/franchise/login");
  };

  if (isLoginPage || isPublicPage) {
    return <>{children}</>;
  }

  if (!user) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#0F172A] text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Store className="text-emerald-500" />
            SW Hub Partner
          </h1>
        </div>
        <div className="p-4 border-b border-gray-800">
          <p className="text-sm font-semibold">{user.shopName}</p>
          <p className="text-xs text-gray-400">{user.franchiseId}</p>
        </div>
        
        <nav className="flex-1 py-4 space-y-2 px-2">
          <Link href="/franchise/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium ${pathname === '/franchise/dashboard' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/franchise/order" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium ${pathname === '/franchise/order' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <ShoppingBag size={20} /> Order Products
          </Link>
          <Link href="/franchise/inventory" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium ${pathname === '/franchise/inventory' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <Package size={20} /> Local Inventory
          </Link>
          <Link href="/franchise/billing" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium ${pathname === '/franchise/billing' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <FileText size={20} /> POS Billing
          </Link>
          <Link href="/franchise/profile" className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium ${pathname === '/franchise/profile' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <Store size={20} /> Shop Profile
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-400 hover:bg-gray-800">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
