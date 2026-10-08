"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, LayoutGrid, ShoppingCart, User } from "lucide-react";
import MobileSearchOverlay from "./MobileSearchOverlay";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    function loadCartCount() {
      try {
        const cart = JSON.parse(localStorage.getItem("swhub_cart") || "[]");
        const count = cart.reduce((total: number, item: any) => total + item.quantity, 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    }

    function loadAuth() {
      const token = localStorage.getItem("customer_token");
      setIsLoggedIn(!!token);
    }

    loadCartCount();
    loadAuth();

    window.addEventListener("cartUpdated", loadCartCount);
    window.addEventListener("userLoggedIn", loadAuth);
    window.addEventListener("storage", loadCartCount);
    window.addEventListener("storage", loadAuth);

    return () => {
      window.removeEventListener("cartUpdated", loadCartCount);
      window.removeEventListener("userLoggedIn", loadAuth);
      window.removeEventListener("storage", loadCartCount);
      window.removeEventListener("storage", loadAuth);
    };
  }, []);

  function handleSearchClick(e: React.MouseEvent) {
    e.preventDefault();
    setIsSearchOpen(true);
  }

  function handleProfileClick(e: React.MouseEvent) {
    if (!isLoggedIn) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("openCustomerAuthModal"));
    }
  }

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center justify-around px-2">
        
        {/* Home */}
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
            isActive("/") ? "text-primary" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Home size={22} strokeWidth={isActive("/") ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">Home</span>
        </Link>

        {/* Categories */}
        <Link 
          href="/categories" 
          className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
            isActive("/categories") ? "text-primary" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <LayoutGrid size={22} strokeWidth={isActive("/categories") ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">Categories</span>
        </Link>

        {/* Search Placeholder */}
        <button 
          type="button"
          onClick={handleSearchClick} 
          className="flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors text-slate-500 hover:text-slate-900"
        >
          <Search size={22} strokeWidth={2} />
          <span className="text-[10px] font-semibold">Search</span>
        </button>

        {/* Cart */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent("openCartDrawer"))} 
          className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
            isActive("/cart") ? "text-primary" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <div className="relative">
            <ShoppingCart size={22} strokeWidth={isActive("/cart") ? 2.5 : 2} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white shadow-xs">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">Cart</span>
        </button>

        {/* Profile */}
        <Link 
          href="/profile" 
          onClick={handleProfileClick} 
          className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
            isActive("/profile") ? "text-primary" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <User size={22} strokeWidth={isActive("/profile") ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">Profile</span>
        </Link>
        
      </div>
    </nav>
      <MobileSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
