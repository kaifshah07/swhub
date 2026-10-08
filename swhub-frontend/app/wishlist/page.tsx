"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/homepage/Products/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import GridSkeleton from "@/components/ui/GridSkeleton";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("customer_token");

    if (!token) {
      setLoading(false);
      window.dispatchEvent(new CustomEvent("openCustomerAuthModal"));
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setProducts(stored);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 h-8 w-48 rounded-lg bg-neutral-200 animate-pulse" />
          <GridSkeleton count={8} columns="4" />
        </div>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 pt-10 pb-20">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save items you love and find them all in one place later. Start exploring our catalog to build your collection."
          ctaText="Explore Products"
          ctaLink="/products"
        />
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] bg-slate-50 py-10 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Wishlist
        </h1>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} wishlistMode={true} />
          ))}
        </div>
      </div>
    </main>
  );
}