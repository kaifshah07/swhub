"use client";
import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export interface ProductCardProps {
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
    discount: number;
    brand?: string;
    stock?: number;
    isFeatured?: boolean;
    isTrending?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    isFlashSale?: boolean;
  };
  wishlistMode?: boolean;
  onRemoveFromWishlist?: (id: number) => void;
}

export default function ProductCard({ product, wishlistMode = false, onRemoveFromWishlist }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  
  const stock = product.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  useEffect(() => {
    if (wishlistMode) {
      setLiked(true);
    } else {
      try {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setLiked(wishlist.some((item: any) => item.id === product.id));
      } catch {
        setLiked(false);
      }
    }
  }, [product.id, wishlistMode]);

  useEffect(() => {
    function loadCartQuantity() {
      try {
        const cart = JSON.parse(localStorage.getItem("swhub_cart") || "[]");
        const item = cart.find((i: any) => i.productId === product.id);
        setCartQuantity(item ? item.quantity : 0);
      } catch {
        setCartQuantity(0);
      }
    }

    loadCartQuantity();
    window.addEventListener("cartUpdated", loadCartQuantity);
    window.addEventListener("storage", loadCartQuantity);
    return () => {
      window.removeEventListener("cartUpdated", loadCartQuantity);
      window.removeEventListener("storage", loadCartQuantity);
    };
  }, [product.id]);

  function handleUpdateCart(e: React.MouseEvent, delta: number) {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    try {
      const cart = JSON.parse(localStorage.getItem("swhub_cart") || "[]");
      const existingIndex = cart.findIndex((item: any) => item.productId === product.id);

      let newQuantity = delta;

      if (existingIndex >= 0) {
        newQuantity = cart[existingIndex].quantity + delta;
        if (newQuantity <= 0) {
          cart.splice(existingIndex, 1);
          newQuantity = 0;
        } else if (newQuantity > stock) {
          newQuantity = stock;
          cart[existingIndex].quantity = newQuantity;
          toast.error(`Only ${stock} units available`);
        } else {
          cart[existingIndex].quantity = newQuantity;
        }
      } else {
        if (newQuantity > stock) newQuantity = stock;
        if (newQuantity > 0) {
          cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            quantity: newQuantity,
            thumbnail: product.image,
            stock: product.stock,
          });
          toast.success(`${product.name} added to cart!`);
        }
      }

      localStorage.setItem("swhub_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      setCartQuantity(newQuantity);

    } catch (err) {
      console.error(err);
      toast.error("Could not update cart");
    }
  }

  function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (wishlistMode && onRemoveFromWishlist) {
      onRemoveFromWishlist(product.id);
      return;
    }

    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const exists = wishlist.some((item: any) => item.id === product.id);

      let updated;
      if (exists) {
        updated = wishlist.filter((item: any) => item.id !== product.id);
        setLiked(false);
        toast("Removed from Wishlist");
      } else {
        updated = [...wishlist, product];
        setLiked(true);
        toast.success("Added to Wishlist");
      }

      localStorage.setItem("wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error(err);
    }
  }

  function getMarketingBadge() {
    if (product.isFlashSale) {
      return <span className="bg-error text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-tight shadow-sm">Flash Sale</span>;
    }
    if (product.isBestSeller) {
      return <span className="bg-primary text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-tight shadow-sm">Best Seller</span>;
    }
    if (product.isTrending) {
      return <span className="bg-secondary text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-tight shadow-sm">Trending</span>;
    }
    if (product.isNewArrival) {
      return <span className="bg-accent text-dark px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-tight shadow-sm">New</span>;
    }
    if (product.isFeatured) {
      return <span className="bg-blue-50 text-primary px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-tight shadow-sm">Featured</span>;
    }
    return null;
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors duration-200 hover:border-primary">
      {/* DISCOUNT BADGE */}
      {product.discount > 0 && (
        <div className="absolute top-2 right-2 z-20 pointer-events-none">
          <span className="bg-dark text-white px-1.5 py-0.5 rounded-sm text-[10px] font-bold tracking-tight shadow-sm">
            -{product.discount}%
          </span>
        </div>
      )}

      {/* Wishlist / Remove Action */}
      <button
        type="button"
        aria-label={wishlistMode ? "Remove from wishlist" : "Toggle wishlist"}
        onClick={handleWishlistToggle}
        className={`absolute right-2 z-30 rounded-full bg-white/90 p-1.5 border border-gray-100 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-110 ${product.discount > 0 ? 'top-8' : 'top-2'}`}
      >
        <Heart
          size={16}
          className={`transition-colors duration-200 ${
            liked
              ? "fill-primary text-primary"
              : "text-gray-400 hover:text-primary"
          }`}
        />
      </button>

      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-white flex items-center justify-center p-3 relative">
          
          {/* MARKETING BADGE */}
          <div className="absolute top-2 left-2 z-20 pointer-events-none">
            {getMarketingBadge()}
          </div>

          <img
            src={product.image}
            alt={product.name}
            className={`h-full w-full object-contain transition duration-300 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          />
          
          {/* SOLD OUT OVERLAY */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none">
              <span className="bg-dark text-white px-3 py-1 rounded-sm text-xs font-black tracking-widest uppercase shadow-md">Sold Out</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 pt-2">
        {/* Brand Tag */}
        {product.brand && (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 truncate">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.id}`} className="mt-0.5">
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold text-dark hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Stock Status */}
        <div className="mt-1 h-4">
          {isOutOfStock ? (
            <span className="text-[11px] font-bold text-error">Out of Stock</span>
          ) : isLowStock ? (
            <span className="text-[11px] font-bold text-warning">Only {stock} Left</span>
          ) : null}
        </div>

        {/* Pricing */}
        <div className="mt-1.5 flex items-end gap-2">
          <span className="text-lg font-bold text-dark leading-none">
            ₹{product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through leading-none mb-0.5">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Action Block */}
        <div className="mt-3">
          {cartQuantity > 0 && !isOutOfStock ? (
            <div className="flex h-[40px] w-full items-center justify-between rounded-md border border-primary bg-white text-dark overflow-hidden transition-colors">
              <button 
                onClick={(e) => handleUpdateCart(e, -1)}
                className="flex h-full w-10 items-center justify-center bg-white text-primary hover:bg-blue-50 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={16} strokeWidth={3} />
              </button>
              <span className="flex-1 text-center text-sm font-bold select-none">{cartQuantity}</span>
              <button 
                onClick={(e) => handleUpdateCart(e, 1)}
                disabled={cartQuantity >= stock}
                className={`flex h-full w-10 items-center justify-center transition-colors ${
                  cartQuantity >= stock 
                  ? 'text-gray-300 bg-gray-50 cursor-not-allowed' 
                  : 'bg-white text-primary hover:bg-blue-50'
                }`}
                aria-label="Increase quantity"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => handleUpdateCart(e, 1)}
              disabled={isOutOfStock}
              className={`w-full flex h-[40px] items-center justify-center gap-1.5 rounded-md px-3 text-sm font-bold transition-colors ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-primary text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {isOutOfStock ? (
                <span>Unavailable</span>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  <span>Add To Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
