"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

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

export default function CategoryDropdown({ onClose }: { onClose?: () => void }) {
  const [categories, setCategories] = useState<Category[]>(
    DEFAULT_DEPARTMENTS.map((d, i) => ({ id: i + 1, ...d }))
  );

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
        }
      } catch (err) {
        // Fallback is already active, silently fail
      }
    }
    loadCategories();
  }, []);

  return (
    <div className="absolute top-full left-0 mt-4 w-64 rounded-xl border border-neutral-200 bg-white shadow-lg z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Invisible bridge to prevent mouse leave gap */}
      <div className="absolute -top-4 left-0 h-4 w-full bg-transparent" />
      
      <div className="flex flex-col py-2">
        {categories.slice(0, 10).map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 hover:text-primary transition-colors"
          >
            {cat.name}
          </Link>
        ))}
        
        <div className="mx-4 my-1 border-t border-neutral-100" />
        
        <Link
          href="/categories"
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-bold text-primary hover:bg-neutral-50 transition-colors"
        >
          View All Categories
        </Link>
      </div>
    </div>
  );
}
