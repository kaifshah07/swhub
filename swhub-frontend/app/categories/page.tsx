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
    name: "Groceries & Staples",
    slug: "groceries-staples",
    description: "Premium flours, basmati rice, organic pulses, cooking oils, and pure ghee.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    name: "Beverages & Juices",
    slug: "beverages-juices",
    description: "Tea, freshly ground coffee, health drinks, energy boosters, and packaged fruit juices.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    name: "Crockery & Kitchenware",
    slug: "crockery-kitchenware",
    description: "Stainless steel cookware, non-stick pans, ceramic plates, and airtight glass jars.",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    name: "Personal Care & Hygiene",
    slug: "personal-care",
    description: "Gentle body soaps, nourishing shampoos, hair oils, skin creams, and dental care.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 5,
    name: "Cleaning & Household",
    slug: "cleaning-household",
    description: "High-performance detergent powders, surface sprays, dishwash gels, and floor cleaners.",
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 6,
    name: "Packaged & Snack Foods",
    slug: "packaged-foods",
    description: "Crispy namkeens, digestive biscuits, instant noodles, dry snacks, and spreads.",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 7,
    name: "Stationery & Home Office",
    slug: "stationery-office",
    description: "Quality ruled notebooks, ballpoint pens, sticky notepads, and desk organizers.",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 8,
    name: "Dairy & Breakfast Essentials",
    slug: "dairy-breakfast",
    description: "Pure butter, organic honey, oat cereals, fruit jams, and morning breakfast picks.",
    image: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&q=80&w=600",
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