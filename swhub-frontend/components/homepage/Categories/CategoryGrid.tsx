"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL, productImageUrl } from "@/lib/api";
import { ArrowRight } from "lucide-react";

type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 101,
    name: "Groceries & Staples",
    slug: "groceries-staples",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 102,
    name: "Beverages & Juices",
    slug: "beverages-juices",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 103,
    name: "Crockery & Kitchen",
    slug: "crockery-kitchenware",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 104,
    name: "Personal Care",
    slug: "personal-care",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 105,
    name: "Cleaning & Supplies",
    slug: "cleaning-household",
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 106,
    name: "Packaged & Snacks",
    slug: "packaged-foods",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 107,
    name: "Stationery & Office",
    slug: "stationery-office",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 108,
    name: "Dairy & Breakfast",
    slug: "dairy-breakfast",
    image: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&q=80&w=400",
  },
];

export default function CategoryGrid() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
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

  if (loading) {
    return (
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-7 w-48 bg-slate-100 rounded-md mb-6 animate-pulse" />
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col items-center">
                <div className="aspect-square w-full rounded-2xl bg-slate-100 mb-2" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore Popular Departments
            </h2>
            <p className="text-xs text-slate-500 font-medium">Curated daily essentials for home & kitchen</p>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-primary font-bold text-xs sm:text-sm hover:underline"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-5">
          {displayList.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              href={`/categories/${cat.slug}`}
              className="group text-center flex flex-col items-center"
            >
              <div className="aspect-square w-full overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:shadow-md">
                <img
                  src={productImageUrl(cat.image)}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <p className="mt-2 text-xs sm:text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}