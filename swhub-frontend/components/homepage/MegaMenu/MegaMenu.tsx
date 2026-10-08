"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { Flame, Sparkles, Tag, ShoppingCart, ChevronDown } from "lucide-react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

const DEFAULT_DEPARTMENTS = [
  { name: "Groceries & Staples", slug: "groceries-staples" },
  { name: "Beverages & Juices", slug: "beverages-juices" },
  { name: "Crockery & Kitchenware", slug: "crockery-kitchenware" },
  { name: "Personal Care", slug: "personal-care" },
  { name: "Cleaning & Household", slug: "cleaning-household" },
  { name: "Packaged Foods", slug: "packaged-foods" },
  { name: "Stationery & Office", slug: "stationery-office" },
];

export default function MegaMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
        } else {
          setCategories(DEFAULT_DEPARTMENTS.map((d, i) => ({ id: i + 1, ...d })));
        }
      } catch (err) {
        setCategories(DEFAULT_DEPARTMENTS.map((d, i) => ({ id: i + 1, ...d })));
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  const displayCategories = categories.length > 0 ? categories : DEFAULT_DEPARTMENTS.map((d, i) => ({ id: i + 1, ...d }));

  return (
    <div className="border-b border-slate-200/80 bg-white sticky top-20 z-40 shadow-xs">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex gap-6 overflow-x-auto px-4 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap scrollbar-none items-center">
          {/* All Departments Button */}
          <Link
            href="/categories"
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-3 py-1.5 text-xs font-bold transition hover:bg-slate-800 shrink-0"
          >
            <ShoppingCart size={13} className="text-primary" />
            <span>All Departments</span>
            <ChevronDown size={13} className="text-slate-400" />
          </Link>

          <span className="text-slate-200">|</span>

          {/* Dynamic Categories */}
          {displayCategories.slice(0, 8).map((item) => (
            <Link
              key={item.id || item.slug}
              href={`/categories/${item.slug}`}
              className="text-slate-700 transition hover:text-primary py-1"
            >
              {item.name}
            </Link>
          ))}

          <span className="text-slate-200">|</span>

          {/* Quick Deals Links */}
          <Link
            href="/products?type=flash-sale"
            className="flex items-center gap-1 text-red-600 font-bold hover:text-red-600 transition py-1"
          >
            <Flame size={14} className="fill-error text-red-600" />
            <span>Flash Deals</span>
          </Link>

          <Link
            href="/products?type=trending"
            className="flex items-center gap-1 text-primary font-semibold hover:text-primary transition py-1"
          >
            <Tag size={13} />
            <span>Weekly Best Buys</span>
          </Link>

          <div className="ml-auto hidden xl:flex items-center gap-4 text-xs font-bold pl-4">
            <Link
              href="/become-a-vendor"
              className="text-slate-600 hover:text-primary transition"
            >
              Sell On SW Hub
            </Link>
            <Link
              href="/franchise"
              className="rounded-full bg-slate-50 text-primary px-3 py-1 border border-primary/60 hover:-blue- transition"
            >
              Franchise Inquiries
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}