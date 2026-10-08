"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  ShoppingBag,
  Package,
  Truck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Success Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-200/80">
          {/* Top Banner */}
          <div className="relative bg-gradient-to-r from-secondary via-slate-800 to-primary px-8 py-12 text-center text-white">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
              <CheckCircle size={60} className="text-primary" />
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight">
              Order Confirmed 🎉
            </h1>

            <p className="mt-2 text-sm sm:text-base text-slate-200">
              Thank you for shopping with SW Hub Daily Needs
            </p>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-10">
            {orderId && (
              <div className="mb-8 rounded-2xl border border-primary/80 bg-slate-50/70 p-5 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Your Order Reference Number
                </p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-black text-primary">
                  #{orderId}
                </h2>
                <p className="text-xs text-slate-500 mt-1">A confirmation has been recorded in your account.</p>
              </div>
            )}

            {/* Status Steps */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 text-center shadow-xs">
                <Package size={34} className="mx-auto text-primary" />
                <h3 className="mt-3 font-bold text-slate-900 text-sm">
                  Order Received
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Your order items are queued for warehouse packing.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 text-center shadow-xs">
                <Truck size={34} className="mx-auto text-slate-600" />
                <h3 className="mt-3 font-bold text-slate-900 text-sm">
                  Dispatch & Delivery
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Assigned to express local delivery partner.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 text-center shadow-xs">
                <CheckCircle size={34} className="mx-auto text-primary" />
                <h3 className="mt-3 font-bold text-slate-900 text-sm">
                  Doorstep Arrival
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Sit back and relax while your household essentials are on the way.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary px-8 py-3.5 font-bold text-xs sm:text-sm text-white transition shadow-md shadow-emerald-950/20 active:scale-95"
              >
                <ShoppingBag size={16} />
                <span>Continue Shopping</span>
              </Link>

              {orderId && (
                <Link
                  href={`/orders/${orderId}`}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-3.5 font-bold text-xs sm:text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <span>Track Order Status</span>
                  <ArrowRight size={15} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading order details...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}