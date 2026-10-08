"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL, productImageUrl } from "@/lib/api";
import { ArrowUpRight, Plus, Layers, Sparkles } from "lucide-react";

export default function BrandsAdminPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Featured Categories & Brands
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            The homepage brand carousel dynamically displays your top product categories and brand collections.
          </p>
        </div>

        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-sm text-white shadow hover:bg-emerald-700 transition"
        >
          <Layers size={16} />
          <span>Manage Categories & Brands</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Currently Live in Brand Slider ({categories.length})
        </h3>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No categories created yet. Click above to add your first category!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-center flex flex-col items-center justify-between"
              >
                <div className="aspect-square w-16 overflow-hidden rounded-full bg-white shadow-xs mb-3 border">
                  <img
                    src={productImageUrl(cat.image)}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-xs font-bold text-gray-800 line-clamp-1">{cat.name}</p>
                <span className="mt-1 text-[10px] text-emerald-600 font-semibold uppercase">
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}