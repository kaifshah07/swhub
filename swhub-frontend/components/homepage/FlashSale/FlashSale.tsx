"use client";

import { useEffect, useState } from "react";
import { API_URL, productImageUrl, fetchWithTimeout } from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { Flame, ArrowRight, ShoppingCart } from "lucide-react";

type FlashProduct = {
  id: number;
  name: string;
  thumbnail?: string | null;
  price: number | string;
  discountPrice?: number | string | null;
  stock?: number;
  brand?: string | null;
};

const RETAIL_FALLBACK_FLASH: FlashProduct[] = [
  {
    id: 1,
    name: "Fortune Sunlite Refined Sunflower Oil 1L",
    price: 175,
    discountPrice: 145,
    stock: 50,
    brand: "Fortune",
    thumbnail: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    name: "Tata Tea Premium Desh Ki Chai 500g",
    price: 310,
    discountPrice: 260,
    stock: 80,
    brand: "Tata",
    thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 5,
    name: "Daawat Rozana Super Basmati Rice 5kg",
    price: 490,
    discountPrice: 389,
    stock: 44,
    brand: "Daawat",
    thumbnail: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 13,
    name: "Vim Dishwash Gel Lemon 750ml Bottle",
    price: 199,
    discountPrice: 155,
    stock: 109,
    brand: "Vim",
    thumbnail: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 14,
    name: "Haldirams Nagpur Aloo Bhujia 400g",
    price: 140,
    discountPrice: 115,
    stock: 94,
    brand: "Haldiram's",
    thumbnail: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 15,
    name: "Classmate Pulse Spiral Notebook Pack of 3",
    price: 360,
    discountPrice: 290,
    stock: 70,
    brand: "Classmate",
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
  },
];

export default function FlashSale() {
  const [products, setProducts] = useState<FlashProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFlashSaleProducts() {
      try {
        const res = await fetchWithTimeout(`${API_URL}/homepage/products/flash-sale`, {}, 15000);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          if (data.data.length < 6) {
            // Supplement with top daily essentials so that 6 cards fill the grid elegantly
            const existingIds = new Set(data.data.map((p: any) => p.id));
            const extra = RETAIL_FALLBACK_FLASH.filter((f) => !existingIds.has(f.id));
            setProducts([...data.data, ...extra.slice(0, 6 - data.data.length)]);
          } else {
            setProducts(data.data);
          }
        } else {
          setProducts(RETAIL_FALLBACK_FLASH);
        }
      } catch {
        setProducts(RETAIL_FALLBACK_FLASH);
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

  const rawProducts = products.length > 0 ? products : RETAIL_FALLBACK_FLASH;

  const displayProducts = rawProducts.map((p) => {
    const price = Number(p.discountPrice ?? p.price);
    const origPrice = Number(p.price);
    const discount =
      p.discountPrice && origPrice > 0
        ? Math.round(((origPrice - price) / origPrice) * 100)
        : 0;

    return {
      id: p.id,
      name: p.name,
      price,
      originalPrice: origPrice,
      discount,
      image: productImageUrl(p.thumbnail),
      brand: p.brand || "SW Hub",
    };
  });

  if (loading) {
    return (
      <section className="w-full bg-gradient-to-r from-[#ff7373] via-[#ffa86b] to-[#f6cb65] py-8 sm:py-10">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-60 bg-white/40 rounded-full mb-6 animate-pulse" />
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white/90 p-4 shadow-sm">
                <div className="aspect-square bg-slate-100 rounded-xl mb-3" />
                <div className="h-3 bg-slate-100 rounded w-1/3 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
                <div className="h-9 bg-slate-100 rounded-xl w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-r from-[#ff7373] via-[#ffa86b] to-[#f6cb65] py-8 sm:py-10">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Header Strip */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e60012] text-white shadow-sm shrink-0">
              <Flame size={22} className="fill-white" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Daily Flash Steals
                </h2>
                <span className="text-[10px] uppercase font-black tracking-wider text-red-600 bg-red-100/90 px-2.5 py-0.5 rounded-full border border-red-200">
                  Limited Hours
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700/85 font-medium mt-0.5">
                Unbeatable prices on high-demand essentials
              </p>
            </div>
          </div>

          <Link
            href="/products?type=flash-sale"
            className="flex items-center gap-1.5 rounded-full bg-[#e60012] px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-red-700 transition shadow-sm shrink-0"
          >
            <span>View All</span>
            <ArrowRight size={14} className="stroke-[2.5]" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-2xl bg-white p-3 sm:p-3.5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full border border-white/70"
            >
              <div className="flex flex-col">
                <Link href={`/products/${product.id}`} className="block">
                  {/* Top Discount Badge */}
                  <div className="flex items-center justify-between mb-2">
                    {product.discount > 0 ? (
                      <span className="rounded-md bg-[#e60012] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-white shadow-xs">
                        {product.discount}% OFF
                      </span>
                    ) : (
                      <span />
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center p-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover rounded-lg transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                      {product.brand}
                    </p>
                    <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-slate-800 leading-snug group-hover:text-red-600 transition min-h-[34px] sm:min-h-[38px] mt-1">
                      {product.name}
                    </h3>
                  </div>
                </Link>

                <div className="mt-2 flex items-baseline gap-1.5">
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

              {/* Cyan Quick Add Button */}
              <button
                type="button"
                onClick={(e) => handleAddToCart(product, e)}
                aria-label={`Add ${product.name} to cart`}
                className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#0099ff] hover:bg-[#0088ee] py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition-all shadow-xs active:scale-[0.98]"
              >
                <ShoppingCart size={14} />
                <span>Quick Add</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
