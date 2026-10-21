"use client";

import { ShoppingBag, ExternalLink } from "lucide-react";
import Link from "next/link";

const retailAisles = [
  { label: "Rice, Atta & Dal", icon: "🌾", query: "staples", desc: "Farm-fresh pulses, flours & grains" },
  { label: "Tea, Coffee & Drinks", icon: "☕", query: "beverages", desc: "Morning brews, syrups & coolers" },
  { label: "Cookware & Crockery", icon: "🍽️", query: "kitchenware", desc: "Non-stick pans, steel & glassware" },
  { label: "Bath & Personal Care", icon: "🧼", query: "personal-care", desc: "Soaps, shampoos & oral essentials" },
  { label: "Cleaning & Hygiene", icon: "🧹", query: "cleaning", desc: "Detergents, floor & surface cleaners" },
  { label: "Snacks & Packaged Food", icon: "🍪", query: "snacks", desc: "Biscuits, noodles, sauces & treats" },
  { label: "Stationery & Home Office", icon: "✏️", query: "stationery", desc: "Notebooks, pens, glue & folders" },
  { label: "Dairy, Butter & Spreads", icon: "🧈", query: "dairy", desc: "Fresh butter, jams, cheese & oats" },
];

export default function HouseholdAislesAdmin() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Household Aisles Configuration
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Curated everyday department aisles displayed on the SW Hub storefront for fast pantry and household navigation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {retailAisles.map((aisle) => (
          <div
            key={aisle.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-[#0000FF] transition group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl border border-blue-100">
                  {aisle.icon}
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                  Storefront Live
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0000FF] transition">
                {aisle.label}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{aisle.desc}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                q={aisle.query}
              </span>
              <Link
                href={`/products?search=${encodeURIComponent(aisle.query)}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0000FF] hover:underline"
              >
                <span>Browse</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
