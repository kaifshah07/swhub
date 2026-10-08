"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const popularBrands = [
  {
    name: "Fortune",
    category: "Oils & Staples",
    offer: "Up to 25% Off",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300",
    slug: "/products?brand=Fortune",
  },
  {
    name: "Tata Tea",
    category: "Beverages",
    offer: "Special Blends",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=300",
    slug: "/products?brand=Tata",
  },
  {
    name: "Milton",
    category: "Crockery & Jars",
    offer: "Up to 40% Off",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=300",
    slug: "/products?brand=Milton",
  },
  {
    name: "Dettol",
    category: "Personal Hygiene",
    offer: "Family Value Packs",
    image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&q=80&w=300",
    slug: "/products?brand=Dettol",
  },
  {
    name: "Surf Excel",
    category: "Laundry & Detergents",
    offer: "Mega Savings Pack",
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&q=80&w=300",
    slug: "/products?brand=SurfExcel",
  },
  {
    name: "Britannia",
    category: "Biscuits & Bakery",
    offer: "Fresh Batches",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=300",
    slug: "/products?brand=Britannia",
  },
];

export default function BrandSlider() {
  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Trusted FMCG & Household Brands
            </h2>
            <p className="text-xs text-slate-500 font-medium">100% authentic genuine products directly sourced</p>
          </div>
          <Link
            href="/brands"
            className="flex items-center gap-1 font-bold text-xs sm:text-sm text-primary hover:underline"
          >
            <span>All Brands</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularBrands.map((brand) => (
            <Link key={brand.name} href={brand.slug}>
              <div className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white hover:shadow-lg hover:border-primary transition duration-300 cursor-pointer h-full flex flex-col items-center p-4">
                <div className="h-20 w-20 overflow-hidden rounded-2xl border border-slate-100 p-1 mb-3 bg-slate-50 flex items-center justify-center">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="h-full w-full object-cover rounded-xl group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="text-center mt-auto w-full">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">{brand.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{brand.category}</p>
                  <p className="mt-1.5 text-[10px] font-bold text-primary bg-slate-50 px-2 py-0.5 rounded-full inline-block">
                    {brand.offer}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}