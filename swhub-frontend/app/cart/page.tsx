"use client";

import Image from "next/image";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CartItem = {
  productId: number;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  thumbnail: string;
  stock: number;
  product?: any;
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("swhub_cart") || "[]");
    setCart(savedCart);
    setMounted(true);

    const handleStorage = () => {
      setCart(JSON.parse(localStorage.getItem("swhub_cart") || "[]"));
    };
    window.addEventListener("cartUpdated", handleStorage);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("cartUpdated", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("swhub_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQuantity = (id: number) => {
    const newCart = cart.map(item => {
      if (item.productId === id && item.quantity < item.stock) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    saveCart(newCart);
  };

  const decreaseQuantity = (id: number) => {
    const newCart = cart.map(item => {
      if (item.productId === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    saveCart(newCart);
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter(item => item.productId !== id);
    saveCart(newCart);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;
  const isFreeShipping = total >= 499;
  const shipping = isFreeShipping ? 0 : 40;
  const grandTotal = total + shipping;
  const progressToFree = Math.min((total / 499) * 100, 100);

  function handleProceedToCheckout() {
    const token = localStorage.getItem("customer_token");
    if (!token) {
      window.dispatchEvent(new CustomEvent("openCustomerAuthModal"));
    } else {
      router.push("/checkout");
    }
  }

  if (!mounted) return null;

  return (
    <main className="min-h-[80vh] bg-slate-50 px-4 py-10 font-sans">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Shopping Basket ({cart.reduce((s, i) => s + i.quantity, 0)} {cart.length === 1 ? "item" : "items"})
        </h1>

        {cart.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Your Basket is Empty" description="Looks like you have not added any items to your cart yet. Discover fresh products and exclusive deals." ctaText="Continue Shopping" ctaLink="/products" />
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* LEFT COLUMN: ITEMS */}
            <div className="lg:col-span-2 space-y-5">
              {/* FREE SHIPPING PROGRESS */}
              <div className="rounded-3xl border border-primary/80 bg-slate-50/60 p-5 shadow-xs relative overflow-hidden">
                <div className="relative z-10">
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="font-bold text-xs sm:text-sm text-slate-900">
                      {isFreeShipping ? (
                        <span className="flex items-center gap-1.5 text-primary">
                          <CheckCircle2 size={18} /> You've unlocked FREE Home Delivery!
                        </span>
                      ) : (
                        <span>
                          Add <span className="text-primary font-extrabold">₹{(499 - total).toFixed(2)}</span> more to unlock FREE Delivery
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full -blue-/70">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary transition-all duration-500 ease-out"
                      style={{ width: `${progressToFree}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* CART ITEMS */}
              {cart.map((item) => {
                const itemPrice = item.price;
                const originalPrice = item.originalPrice || itemPrice;
                const imageUrl = item.thumbnail || "";

                return (
                  <div
                    key={item.productId}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md"
                  >
                    {/* THUMBNAIL */}
                    <Link
                      href={`/products/${item.productId}`}
                      className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden p-1.5"
                    >
                      {imageUrl ? (
                        <Image src={imageUrl} alt={item.name} width={96} height={96} unoptimized className="h-full w-full object-contain" />
                      ) : (
                        <ShoppingBag className="text-slate-300" size={28} />
                      )}
                    </Link>

                    {/* DETAILS */}
                    <div className="flex-1 min-w-0 w-full">
                      <Link
                        href={`/products/${item.productId}`}
                        className="font-bold text-slate-900 hover:text-primary transition line-clamp-1 text-base"
                      >
                        {item.name}
                      </Link>

                      {/* PRICE */}
                      <div className="mt-1.5 flex items-baseline gap-2.5">
                        <span className="text-lg font-black text-slate-900">₹{itemPrice.toFixed(2)}</span>
                        {originalPrice > itemPrice && (
                          <span className="text-xs font-semibold text-slate-400 line-through">₹{originalPrice.toFixed(2)}</span>
                        )}
                        {item.stock <= 5 && item.stock > 0 && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wide text-red-600 bg-red-600/10 border border-red-200 px-2 py-0.5 rounded-full">
                            Only {item.stock} left
                          </span>
                        )}
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-4">
                        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.productId)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-primary transition shadow-xs bg-white"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="min-w-[36px] text-center text-xs font-black text-slate-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.productId)}
                            disabled={item.quantity >= item.stock}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-primary transition shadow-xs bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-600 transition px-2.5 py-1 rounded-lg hover:bg-red-600/10"
                        >
                          <Trash2 size={14} /> <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* TRUST STRIP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white p-4 border border-slate-200/80 text-center shadow-xs">
                  <ShieldCheck size={22} className="text-primary" />
                  <span className="text-[11px] font-bold text-slate-700">100% Genuine Brands</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white p-4 border border-slate-200/80 text-center shadow-xs">
                  <Truck size={22} className="text-primary" />
                  <span className="text-[11px] font-bold text-slate-700">Fast Doorstep Delivery</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white p-4 border border-slate-200/80 text-center shadow-xs">
                  <RotateCcw size={22} className="text-primary" />
                  <span className="text-[11px] font-bold text-slate-700">7-Day Easy Returns</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY */}
            <div className="h-fit space-y-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
                <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3.5 text-xs sm:text-sm font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Delivery Charges</span>
                    <span className={shipping === 0 ? "font-bold text-primary" : "font-bold text-slate-900"}>
                      {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-4 mt-2 flex justify-between items-center text-base font-black text-slate-900">
                    <span>Total Payable</span>
                    <span className="text-primary text-2xl font-black">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary shadow-md shadow-emerald-950/20 active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>

                <p className="mt-4 text-center text-[11px] font-medium text-slate-400">
                  Safe & encrypted checkout • 100% purchase protection
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
