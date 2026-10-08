"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { API_URL, productImageUrl } from "@/lib/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Product = {
  stock?: number;
  id: number;
  name: string;
  thumbnail?: string | null;
  price: number;
  discountPrice?: number | null;
  brand?: string | null;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
};

type ProductGridProps = {
  title?: string;
  type?: "featured" | "trending" | "new-arrivals" | "best-sellers" | "all";
};

export default function ProductGrid({
  title = "🔥 Trending Essentials",
  type = "trending",
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [type]);

  async function loadProducts() {
    try {
      setLoading(true);
      let endpoint = `${API_URL}/products`;

      if (type && type !== "all") {
        endpoint = `${API_URL}/homepage/products/${type}`;
      }

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setProducts(result.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(`Failed to load ${type} products:`, error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-5 flex items-center justify-between">
            <div className="h-7 w-52 bg-slate-200 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                <div className="aspect-square bg-slate-200 rounded-xl mb-3" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>

          <Link
            href={`/products?type=${type}`}
            className="flex items-center gap-1 text-primary font-bold text-xs sm:text-sm hover:underline"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
          {products.map((product) => {
            const price = Number(product.discountPrice ?? product.price);
            const origPrice = Number(product.price);
            const discountPct =
              product.discountPrice && origPrice > 0
                ? Math.round(((origPrice - price) / origPrice) * 100)
                : 0;

            return (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  image: productImageUrl(product.thumbnail),
                  price,
                  originalPrice: origPrice,
                  discount: discountPct,
                  stock: product.stock ?? 0,
                  brand: product.brand || undefined,
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
      </div>
    </section>
  );
}