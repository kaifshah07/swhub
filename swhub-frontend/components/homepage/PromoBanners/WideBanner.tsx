"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, Sparkles, ShoppingBag } from "lucide-react";

type Ad = {
  id: number;
  title?: string | null;
  desktopImage: string;
  mobileImage?: string | null;
  redirectUrl?: string | null;
  position: string;
  isActive: boolean;
};

export default function WideBanner() {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWideBanner() {
      try {
        const res = await fetch(`${API_URL}/homepage/advertisements`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const wideAds = data.data.filter(
            (item: Ad) => item.position === "wide_banner" && item.isActive !== false
          );
          if (wideAds.length > 0) {
            setAd(wideAds[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load wide banner:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWideBanner();
  }, []);

  if (loading) {
    return (
      <section className="py-6 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-[180px] md:h-[220px] w-full animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </section>
    );
  }

  // If ad exists from CMS, show it
  if (ad) {
    return (
      <section className="py-6 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          {ad.redirectUrl ? (
            <Link href={ad.redirectUrl}>
              <div className="relative overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition">
                <img
                  src={ad.desktopImage}
                  alt={ad.title || "Special Promo Banner"}
                  className="rounded-3xl h-[200px] md:h-[240px] w-full object-cover cursor-pointer hover:opacity-95 transition"
                />
                {ad.title && (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent flex items-center p-8">
                    <h3 className="text-xl sm:text-3xl font-black text-white max-w-md">
                      {ad.title}
                    </h3>
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <div className="relative overflow-hidden rounded-3xl shadow-sm">
              <img
                src={ad.desktopImage}
                alt={ad.title || "Special Promo Banner"}
                className="rounded-3xl h-[200px] md:h-[240px] w-full object-cover"
              />
              {ad.title && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent flex items-center p-8">
                  <h3 className="text-xl sm:text-3xl font-black text-white max-w-md">
                    {ad.title}
                  </h3>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Default Retail Promo Banner for SW Hub
  return (
    <section className="py-6 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-secondary via-slate-800 to-primary p-6 sm:p-10 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-primary bg-primary/60 border border-primary/30 px-2.5 py-0.5 rounded-full">
              <Sparkles size={12} />
              MONTHLY PANTRY SAVINGS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Stock Up Your Kitchen with Fresh Staples & Save More
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Get combo discounts on 5kg/10kg Atta, Basmati Rice, Ghee, Cold-Pressed Oils, and Spices delivered right to your kitchen.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4">
            <Link
              href="/products?search=staples"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary hover:bg-primary px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-950/30 transition hover:scale-105 active:scale-95"
            >
              <ShoppingBag size={16} />
              <span>Explore Pantry Combos</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}