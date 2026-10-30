"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL, productImageUrl } from "@/lib/api";
import { Layers, ArrowRight } from "lucide-react";

type Category = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
};

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Security & Digital Safes",
    slug: "security-digital-safes",
    description: "Home, office, and hotel digital, biometric, and electronic safe lockers.",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    name: "Kitchen Appliances",
    slug: "kitchen-appliances",
    description: "Ovens, OTG, air fryers, mixer grinders, toasters, and electric kettles.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    name: "Cookware & Kitchenware",
    slug: "cookware-kitchenware",
    description: "Non-stick kadhais, fry pans, vacuum flasks, water bottles, and lunch carriers.",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    name: "Dining & Tableware",
    slug: "dining-tableware",
    description: "Eco-friendly bamboo cups, mugs, coasters, canisters, trays, and jug sets.",
    image: "https://images.unsplash.com/photo-1615865417491-9941019fbc00?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 5,
    name: "Home & Living Appliances",
    slug: "home-living-appliances",
    description: "Heavy duty vacuum cleaners, garment steamers, and floor care appliances.",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 6,
    name: "Electronics & Audio",
    slug: "electronics-audio",
    description: "Wireless Bluetooth soundbars, subwoofers, and home entertainment audio.",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=600",
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCategories(json.data);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (err) {
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  const displayList = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-primary/70 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Layers size={14} />
            <span>Departments & Aisles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Browse All Household Departments
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            From fresh daily kitchen groceries and pantry refills to premium cookware, cleaning must-haves, and personal care essentials.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="aspect-square bg-slate-200 rounded-2xl mb-4" />
                <div className="h-5 bg-slate-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {displayList.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                href={`/categories/${cat.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary"
              >
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-50 mb-4 border border-slate-100">
                  <img
                    src={productImageUrl(cat.image)}
                    alt={cat.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary transition leading-snug">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-primary">
                    <span>Explore Products</span>
                    <ArrowRight size={14} className="transition transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}