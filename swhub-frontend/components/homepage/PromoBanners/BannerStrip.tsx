"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, Sparkles, Tag } from "lucide-react";

type Ad = {
  id: number;
  title?: string | null;
  desktopImage: string;
  mobileImage?: string | null;
  redirectUrl?: string | null;
  position: string;
  isActive: boolean;
};

interface BannerStripProps {
  position?: string;
  title?: string;
}

export default function BannerStrip({
  position = "banner_strip_1",
  title = "Special Household Offers",
}: BannerStripProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBannerStripAds() {
      try {
        const res = await fetch(`${API_URL}/homepage/advertisements`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          let filtered = data.data.filter(
            (item: Ad) => item.position === position && item.isActive !== false
          );

          if (filtered.length === 0) {
            filtered = data.data.filter(
              (item: Ad) =>
                item.isActive !== false &&
                (item.position === "banner_strip" || item.position.startsWith("banner_strip"))
            );
          }

          setAds(filtered);
        }
      } catch (err) {
        console.error("Failed to load banner strip ads:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBannerStripAds();
  }, [position]);

  if (loading) {
    return (
      <section className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-[280px] md:h-[320px] w-full animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </section>
    );
  }

  // If CMS ads exist, render them with upgraded SW Hub styling
  if (ads.length > 0) {
    const mainAd = ads[0];
    const secondaryAd1 = ads[1] || mainAd;
    const secondaryAd2 = ads[2] || secondaryAd1;

    return (
      <section className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
            <Link href="/products" className="text-primary font-bold text-xs sm:text-sm hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Large Banner */}
            <Link href={mainAd.redirectUrl || "/products"} className="lg:col-span-2">
              <div className="relative overflow-hidden rounded-3xl group cursor-pointer h-[300px] sm:h-[340px] shadow-sm hover:shadow-md transition">
                <img
                  src={mainAd.desktopImage}
                  alt={mainAd.title || "Special Offer"}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white max-w-md">
                  <p className="uppercase tracking-widest text-[10px] font-bold text-primary">
                    SW Hub Featured Deals
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black mt-2 leading-tight">
                    {mainAd.title || "Super Saver Combos"}
                  </h3>
                  <span className="mt-5 inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-primary transition shadow">
                    <span>Shop Now</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>

            {/* Right Side Cards */}
            <div className="flex flex-col gap-4">
              <Link href={secondaryAd1.redirectUrl || "/products"}>
                <div className="relative overflow-hidden rounded-3xl group cursor-pointer h-[142px] sm:h-[158px] shadow-sm hover:shadow-md transition">
                  <img
                    src={secondaryAd1.desktopImage}
                    alt={secondaryAd1.title || "Banner"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute left-5 bottom-4 text-white">
                    <h4 className="text-lg font-bold leading-tight">{secondaryAd1.title || "New Arrivals"}</h4>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">Explore Category →</p>
                  </div>
                </div>
              </Link>

              <Link href={secondaryAd2.redirectUrl || "/products"}>
                <div className="relative overflow-hidden rounded-3xl group cursor-pointer h-[142px] sm:h-[158px] shadow-sm hover:shadow-md transition">
                  <img
                    src={secondaryAd2.desktopImage}
                    alt={secondaryAd2.title || "Banner"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute left-5 bottom-4 text-white">
                    <h4 className="text-lg font-bold leading-tight">{secondaryAd2.title || "Household Specials"}</h4>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">Discover More →</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback curated retail cards if no CMS ads exist
  const isSecondStrip = position === "banner_strip_2";

  return (
    <section className="py-8 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
          <Link href="/products" className="text-primary font-bold text-xs sm:text-sm hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main Card */}
          <Link
            href="/products?search=crockery"
            className="lg:col-span-2 group relative overflow-hidden rounded-3xl h-[280px] sm:h-[320px] shadow-sm hover:shadow-md transition block"
          >
            <img
              src={
                isSecondStrip
                  ? "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=800"
                  : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
              }
              alt={title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/85 via-secondary/40 to-transparent" />
            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white max-w-md">
              <span className="inline-flex items-center gap-1 uppercase tracking-widest text-[10px] font-bold text-primary bg-primary/60 border border-primary/30 px-2.5 py-0.5 rounded-full mb-3">
                <Sparkles size={12} />
                {isSecondStrip ? "KITCHEN & DINING" : "EVERYDAY PANTRY"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                {isSecondStrip ? "Premium Crockery & Cookware Essentials" : "Farm Fresh Staples & Cold-Pressed Oils"}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300">
                {isSecondStrip
                  ? "Non-stick frying pans, heat-resistant glassware, and airtight container sets."
                  : "Certified pure flours, organic dals, basmati rice, and ghee with zero adulteration."}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-primary transition shadow">
                <span>Shop Deals</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          {/* Side Cards */}
          <div className="flex flex-col gap-4">
            <Link
              href="/products?search=beverages"
              className="group relative overflow-hidden rounded-3xl h-[132px] sm:h-[148px] shadow-sm hover:shadow-md transition block"
            >
              <img
                src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=500"
                alt="Beverages"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent" />
              <div className="absolute left-5 bottom-4 text-white">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Up to 35% Off</span>
                <h4 className="text-base font-bold leading-tight">Morning Tea, Coffee & Juices</h4>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">Explore Brews →</p>
              </div>
            </Link>

            <Link
              href="/products?search=cleaning"
              className="group relative overflow-hidden rounded-3xl h-[132px] sm:h-[148px] shadow-sm hover:shadow-md transition block"
            >
              <img
                src="https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&q=80&w=500"
                alt="Cleaning"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent" />
              <div className="absolute left-5 bottom-4 text-white">
                <span className="text-[10px] font-bold text-primary uppercase">Hygiene Week</span>
                <h4 className="text-base font-bold leading-tight">Cleaning & Household Value Packs</h4>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">Shop Cleaners →</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}