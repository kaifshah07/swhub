"use client";

import ProductCard from "@/components/homepage/Products/ProductCard";
import CategoryBanner from "./CategoryBanner";
import { productImageUrl } from "@/lib/api";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface CategoryProductsProps {
  products: any[];
  loading?: boolean;
  totalCount?: number;
  sort?: string;
  onSortChange?: (newSort: string) => void;
}

export default function CategoryProducts({
  products = [],
  loading = false,
  totalCount,
  sort = "newest",
  onSortChange,
}: CategoryProductsProps) {
  const count = totalCount !== undefined ? totalCount : products.length;

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {loading ? "Loading Items..." : `${count} Products Found`}
        </h2>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs outline-none transition focus:border-primary"
          >
            <option value="newest">Featured & Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="mb-8">
        <CategoryBanner />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="aspect-square bg-slate-200 rounded-xl mb-3" />
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
              <div className="h-8 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-primary mb-3">
            <ShoppingBag size={28} />
          </div>
          <p className="text-lg font-bold text-slate-800">No items currently found in this aisle</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Check back soon for fresh arrivals or browse other household departments!
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-xs font-bold text-white transition hover:bg-primary shadow-sm"
          >
            <span>Browse All Marketplace Items</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const price = Number(product.discountPrice || product.price);
            const originalPrice = Number(product.price);
            const discount =
              product.discountPrice && originalPrice > 0
                ? Math.round(((originalPrice - price) / originalPrice) * 100)
                : 0;

            return (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  image: productImageUrl(product.thumbnail),
                  price,
                  originalPrice,
                  discount,
                  brand: product.brand || undefined,
                  stock: product.stock ?? 0,
                  isFeatured: product.isFeatured,
                  isTrending: product.isTrending,
                  isNewArrival: product.isNewArrival,
                  isBestSeller: product.isBestSeller,
                  isFlashSale: product.isFlashSale,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}