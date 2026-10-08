"use client";

import { useEffect, useState } from "react";
import { API_URL, productImageUrl } from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { Flame, ArrowRight, ShoppingCart } from "lucide-react";

type FlashProduct = {
  id: number;
  name: string;
  thumbnail?: string | null;
  price: number;
  discountPrice?: number | null;
  stock?: number;
  brand?: string | null;
};

export default function FlashSale() {
  const [products, setProducts] = useState<FlashProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFlashSaleProducts() {
      try {
        const res = await fetch(`${API_URL}/homepage/products/flash-sale`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error("Failed to load flash sale products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFlashSaleProducts();
  }, []);

  function handleAddToCart(product: any, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const cart = JSON.parse(localStorage.getItem("swhub_cart") || "[]");
      const existingIndex = cart.findIndex((item: any) => item.productId === product.id);

      if (existingIndex >= 0) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: 1,
          thumbnail: product.image,
          stock: 99,
        });
      }

      localStorage.setItem("swhub_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.name} added to cart! 🛒`);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <section className="py-8 bg-amber-50/40 border-y border-primary">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="h-8 w-48 bg-amber-50 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white p-4 shadow-sm">
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

  const displayProducts = products.map((p) => {
    const sellingPrice = Number(p.discountPrice ?? p.price);
    const origPrice = Number(p.price);
    const discountPct =
      p.discountPrice && origPrice > 0
        ? Math.round(((origPrice - sellingPrice) / origPrice) * 100)
        : 0;
    return {
      id: p.id,
      name: p.name,
      image: productImageUrl(p.thumbnail),
      price: sellingPrice,
      originalPrice: origPrice,
      discount: discountPct,
      brand: p.brand || "SW Hub Special",
    };
  });

  return (
    <section className="py-8 bg-gradient-to-r from-error/60 via-accent/50 to-accent/60 border-y border-primary/60">
      <div className="mx-auto max-w-[1600px] px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md shadow-red-600/30">
              <Flame size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Daily Flash Steals</span>
                <span className="text-[10px] uppercase font-bold text-red-600 bg-red-600/20 px-2 py-0.5 rounded-full border border-red-200">
                  Limited Hours
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">Unbeatable prices on high-demand essentials</p>
            </div>
          </div>

          <Link href="/products?type=flash-sale">
            <button className="flex items-center gap-1 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 transition shadow-xs">
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {displayProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="group overflow-hidden rounded-2xl border border-red-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200 cursor-pointer flex flex-col h-full">
                <div className="relative">
                  {product.discount > 0 && (
                    <div className="absolute left-2.5 top-2.5 z-10 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-black text-white shadow-xs">
                      {product.discount}% OFF
                    </div>
                  )}

                  <div className="overflow-hidden aspect-square bg-slate-50 flex items-center justify-center p-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                      {product.brand}
                    </p>
                    <h3 className="line-clamp-2 text-xs font-semibold text-slate-800 leading-snug group-hover:text-red-600 transition">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-red-600">
                        ₹{product.price}
                      </span>

                      {product.originalPrice > product.price && (
                        <span className="text-[11px] text-slate-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(product, e)}
                    className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary py-1.5 text-xs font-bold text-white hover:bg-primary transition shadow-xs"
                  >
                    <ShoppingCart size={13} />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}