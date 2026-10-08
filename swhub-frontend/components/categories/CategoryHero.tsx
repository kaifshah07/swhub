"use client";

import Link from "next/link";
import { ShieldCheck, Truck, Sparkles } from "lucide-react";

interface CategoryHeroProps {
  title?: string;
  description?: string | null;
  productCount?: number;
}

export default function CategoryHero({
  title = "Household & Daily Essentials",
  description = "Explore fresh groceries, beverages, kitchenware, personal care, and household supplies.",
  productCount = 0,
}: CategoryHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-secondary via-slate-800 to-primary text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-20 top-10 h-32 w-32 rounded-full bg-white" />
        <div className="absolute right-20 bottom-10 h-40 w-40 rounded-full bg-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-14 relative z-10">
        <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-white">Departments</Link>
          <span>/</span>
          <span className="text-slate-600 font-bold">{title}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-200 leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-6 flex gap-3 flex-wrap text-xs sm:text-sm">
          <div className="rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 font-semibold text-white shadow-xs border border-white/10">
            {productCount} Items In Department
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 font-semibold text-slate-600 shadow-xs border border-white/10">
            <ShieldCheck size={14} />
            <span>100% Genuine Brands</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 font-semibold text-primary shadow-xs border border-white/10">
            <Truck size={14} />
            <span>Superfast Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}