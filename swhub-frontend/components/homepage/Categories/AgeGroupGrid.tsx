import Link from "next/link";
import { ArrowRight } from "lucide-react";

const retailAisles = [
  { label: "Rice, Atta & Dal", icon: "🌾", query: "staples", desc: "Farm-fresh pulses & flours" },
  { label: "Tea, Coffee & Drinks", icon: "☕", query: "beverages", desc: "Morning brews & coolers" },
  { label: "Cookware & Crockery", icon: "🍽️", query: "kitchenware", desc: "Non-stick, steel & glass" },
  { label: "Bath & Personal Care", icon: "🧼", query: "personal-care", desc: "Soaps, shampoos & oral" },
  { label: "Cleaning & Hygiene", icon: "🧹", query: "cleaning", desc: "Detergents & surface spray" },
  { label: "Snacks & Packaged Food", icon: "🍪", query: "snacks", desc: "Biscuits, noodles & treats" },
  { label: "Stationery & Home Office", icon: "✏️", query: "stationery", desc: "Notebooks, pens & folders" },
  { label: "Dairy, Butter & Spreads", icon: "🧈", query: "dairy", desc: "Fresh butter, jams & oats" },
];

export default function AgeGroupGrid() {
  return (
    <section className="py-10 bg-slate-50">
      <div className="mx-auto max-w-[1600px] px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Shop by Household Need
            </h2>
            <p className="text-xs text-slate-500 font-medium">Quick access to essential pantry and home aisles</p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-primary font-bold text-xs sm:text-sm hover:underline"
          >
            <span>All Aisles</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {retailAisles.map((aisle) => (
            <Link
              key={aisle.label}
              href={`/products?search=${encodeURIComponent(aisle.query)}`}
              className="group rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-50/70 border border-primary flex items-center justify-center text-2xl mb-2.5 transition-transform duration-300 group-hover:scale-110">
                {aisle.icon}
              </div>
              <p className="font-bold text-xs text-slate-800 group-hover:text-primary transition leading-snug line-clamp-1">
                {aisle.label}
              </p>
              <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {aisle.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}