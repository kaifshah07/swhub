"use client";

import Link from "next/link";
import {
  ShoppingCart,
  User,
  Heart,
  ChevronDown,
  LogOut,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import { openCustomerAuthModal } from "@/lib/authModal";

type CartItem = {
  productId: number;
  quantity: number;
};

type Customer = {
  name?: string;
  email?: string;
};

export default function UserActions() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    function loadWishlistCount() {
      const wishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      setWishlistCount(wishlist.length);
    }

    function loadCartCount() {
      const cart: CartItem[] = JSON.parse(
        localStorage.getItem("swhub_cart") || "[]"
      );
      const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartCount(count);
    }

    function loadCustomer() {
      const token = localStorage.getItem("customer_token");
      if (!token) {
        setCustomer(null);
        setIsLoggedIn(false);
        return;
      }

      try {
        const storedCustomer = localStorage.getItem("customer");
        if (storedCustomer) {
          setCustomer(JSON.parse(storedCustomer));
        }
        setIsLoggedIn(true);
      } catch {
        setCustomer(null);
        setIsLoggedIn(false);
      }
    }

    loadCartCount();
    loadWishlistCount();
    loadCustomer();

    window.addEventListener("cartUpdated", loadCartCount);
    window.addEventListener("wishlistUpdated", loadWishlistCount);
    window.addEventListener("userLoggedIn", loadCustomer);
    window.addEventListener("storage", loadCartCount);
    window.addEventListener("storage", loadWishlistCount);
    window.addEventListener("storage", loadCustomer);

    return () => {
      window.removeEventListener("cartUpdated", loadCartCount);
      window.removeEventListener("wishlistUpdated", loadWishlistCount);
      window.removeEventListener("userLoggedIn", loadCustomer);
      window.removeEventListener("storage", loadCartCount);
      window.removeEventListener("storage", loadWishlistCount);
      window.removeEventListener("storage", loadCustomer);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("customer");
    localStorage.removeItem("customer_token");
    setCustomer(null);
    setIsLoggedIn(false);
    setMenuOpen(false);
    window.location.href = "/";
  }

  return (
    <div className="flex items-center gap-4 sm:gap-5 shrink-0">
      {/* WISHLIST */}
      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="relative flex items-center justify-center p-1.5 text-slate-700 hover:text-primary transition"
      >
        <Heart size={21} />
        {wishlistCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white shadow-xs">
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* CART */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("openCartDrawer"))}
        aria-label="Shopping Cart"
        className="relative flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-slate-900 border border-slate-200 hover:border-primary hover:text-primary group transition"
      >
        <ShoppingCart size={19} className="text-slate-700 group-hover:text-primary transition-colors" />
        <span className="text-xs font-bold hidden md:inline-block">Cart</span>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[11px] font-extrabold text-white">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      </button>

      {/* LOGGED IN USER */}
      {customer ? (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 transition hover:bg-slate-50"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white">
              {(customer.name || "U")[0].toUpperCase()}
            </div>
            <span className="hidden sm:inline-block max-w-[100px] truncate">
              {customer.name?.split(" ")[0]}
            </span>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {customer.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {customer.email}
                </p>
              </div>

              <Link
                href="/orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition"
              >
                <Package size={15} />
                My Orders
              </Link>

              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition"
              >
                <User size={15} />
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-600/10 transition mt-1 border-t border-slate-100"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => openCustomerAuthModal({ defaultTab: "login" })}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white transition shadow-sm"
        >
          <User size={14} />
          <span>Sign In</span>
        </button>
      )}
    </div>
  );
}