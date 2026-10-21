"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { API_URL, productImageUrl, fetchWithTimeout } from "@/lib/api";
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

const RETAIL_FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Fortune Sunlite Refined Sunflower Oil 1L",
    price: 175,
    discountPrice: 145,
    stock: 50,
    brand: "Fortune",
    thumbnail: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600",
    isTrending: true,
  },
  {
    id: 2,
    name: "Tata Tea Premium Desh Ki Chai 500g",
    price: 310,
    discountPrice: 260,
    stock: 80,
    brand: "Tata",
    thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
  },
  {
    id: 3,
    name: "Aashirvaad Superior MP Whole Wheat Atta 10kg",
    price: 520,
    discountPrice: 460,
    stock: 40,
    brand: "Aashirvaad",
    thumbnail: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
    isTrending: true,
  },
  {
    id: 5,
    name: "Daawat Rozana Super Basmati Rice 5kg",
    price: 490,
    discountPrice: 389,
    stock: 44,
    brand: "Daawat",
    thumbnail: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    isTrending: true,
  },
  {
    id: 12,
    name: "Dettol Original Liquid Handwash Refill 1500ml",
    price: 235,
    discountPrice: 189,
    stock: 65,
    brand: "Dettol",
    thumbnail: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&q=80&w=600",
    isBestSeller: true,
  },
  {
    id: 13,
    name: "Vim Dishwash Gel Lemon 750ml Bottle",
    price: 199,
    discountPrice: 155,
    stock: 109,
    brand: "Vim",
    thumbnail: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&q=80&w=600",
    isBestSeller: true,
  },
];

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

      const response = await fetchWithTimeout(endpoint, {}, 6000);
      const result = await response.json();

      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        setProducts(result.data);
      } else {
        setProducts(RETAIL_FALLBACK_PRODUCTS);
      }
    } catch (error) {
      console.warn(`Fallback to default items for ${type} products:`, error);
      setProducts(RETAIL_FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }

  const displayProducts = products.length > 0 ? products : RETAIL_FALLBACK_PRODUCTS;

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
          {displayProducts.map((product) => {
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
