"use client";

import { Heart, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type ProductInfoProps = {
  product: any;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const price = Number(product.discountPrice || product.price);
  const originalPrice = Number(product.price);
  const discount =
    product.discountPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;
  const savings = originalPrice - price;

  function addToCart(redirectCheckout = false) {
    const cart = JSON.parse(
      localStorage.getItem("swhub_cart") || "[]"
    );

    const existingIndex = cart.findIndex(
      (item: any) => item.productId === product.id
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price,
        originalPrice,
        quantity,
        thumbnail: product.thumbnail || product.images?.[0]?.url,
        stock: product.stock || 10,
        product,
      });
    }

    localStorage.setItem("swhub_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    if (redirectCheckout) {
      router.push("/checkout");
    } else {
      toast.success(`${product.name} added to cart! 🛒`);
    }
  }

  function addToWishlist() {
    const wishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );

    const exists = wishlist.some(
      (item: any) => item.id === product.id
    );

    if (exists) {
      toast("Already in wishlist");
      return;
    }

    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast.success("Added to wishlist ❤️");
  }

  return (
    <div className="flex flex-col">
      {/* Brand & Category */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-slate-50 px-2.5 py-1 rounded-md">
          {product.brand || "SW Hub Essentials"}
        </span>
        {product.sku && (
          <span className="text-xs text-slate-400">SKU: {product.sku}</span>
        )}
      </div>

      {/* Product Title */}
      <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
        {product.name}
      </h1>

      {/* Rating & In-Stock */}
      <div className="mt-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-primary/60">
          <Star size={16} className="fill-[#F59E0B] text-slate-600" />
          <span className="text-xs font-bold text-slate-800">4.8</span>
          <span className="text-xs text-slate-400 font-medium">(256 reviews)</span>
        </div>

        <p className={`text-xs font-bold ${product.stock > 0 ? "text-primary" : "text-red-600"}`}>
          {product.stock > 0 ? `✔ In Stock (${product.stock} units available)` : "Out of Stock"}
        </p>
      </div>

      {/* Pricing */}
      <div className="mt-5 flex items-baseline gap-3 border-y border-slate-100 py-4">
        <span className="text-3xl font-black text-slate-900">
          ₹{price.toFixed(2)}
        </span>

        {originalPrice > price && (
          <>
            <span className="text-lg text-slate-400 line-through">
              ₹{originalPrice.toFixed(2)}
            </span>
            <span className="rounded-full -blue- px-3 py-0.5 text-xs font-extrabold text-primary">
              {discount}% OFF
            </span>
            {savings > 0 && (
              <span className="text-xs font-semibold text-primary ml-auto hidden sm:inline">
                You save ₹{savings.toFixed(2)}!
              </span>
            )}
          </>
        )}
      </div>

      {/* Product Description */}
      <div className="mt-5">
        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
          About This Item
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {product.description ||
            product.shortDescription ||
            "Everyday essential product quality checked for household reliability, freshness, and value."}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="mt-6 flex items-center gap-4">
        <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
          Quantity:
        </span>

        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-xs hover:bg-slate-100 transition"
          >
            -
          </button>
          <span className="min-w-[40px] text-center text-sm font-extrabold text-slate-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-xs hover:bg-slate-100 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => addToCart(false)}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 px-6 font-bold text-sm text-white shadow-md shadow-emerald-900/10 hover:bg-primary transition active:scale-95"
        >
          <ShoppingCart size={18} />
          <span>Add To Cart</span>
        </button>

        <button
          type="button"
          onClick={addToWishlist}
          aria-label="Save to Wishlist"
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-red-600 hover:border-red-200 transition"
        >
          <Heart size={20} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => addToCart(true)}
        className="mt-3 w-full rounded-2xl bg-slate-900 py-3.5 font-bold text-sm text-white hover:bg-slate-800 transition active:scale-95 shadow-sm"
      >
        Buy Now with Express Checkout
      </button>

      {/* Trust Badges */}
      <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-primary shrink-0" />
          <span>Fast Doorstep Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary shrink-0" />
          <span>100% Genuine Quality</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw size={16} className="text-primary shrink-0" />
          <span>7-Day Easy Returns</span>
        </div>
        <div className="flex items-center gap-2">
          <Award size={16} className="text-primary shrink-0" />
          <span>Everyday Low Prices</span>
        </div>
      </div>
    </div>
  );
}