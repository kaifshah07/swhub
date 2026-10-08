"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { API_URL } from "@/lib/api";
import ProductCard from "@/components/homepage/Products/ProductCard";
import { 
  Truck, ShieldCheck, RotateCcw, CheckCircle, 
  Minus, Plus, ShoppingCart, ArrowRight 
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    if (params?.id) {
      loadProduct();
    }
  }, [params]);

  async function loadProduct() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products/${params.id}`);
      const result = await res.json();
      if (result.success && result.data) {
        setProduct(result.data);
        setActiveImage(result.data.thumbnail || result.data.images?.[0]?.url || "/placeholder.png");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Cart Sync
  useEffect(() => {
    if (!product) return;
    function syncCart() {
      try {
        const cart = JSON.parse(localStorage.getItem("swhub_cart") || "[]");
        const item = cart.find((i: any) => i.productId === product.id);
        setCartQuantity(item ? item.quantity : 0);
      } catch {
        setCartQuantity(0);
      }
    }
    syncCart();
    window.addEventListener("cartUpdated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("cartUpdated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, [product]);

  const handleUpdateCart = (delta: number, forceSetValue?: number) => {
    if (!product) return;
    const stock = product.stock ?? 0;
    if (stock === 0) return;

    try {
      const cart = JSON.parse(localStorage.getItem("swhub_cart") || "[]");
      const existingIndex = cart.findIndex((item: any) => item.productId === product.id);
      
      let newQuantity = forceSetValue !== undefined ? forceSetValue : delta;
      
      if (existingIndex >= 0) {
        if (forceSetValue === undefined) {
          newQuantity = cart[existingIndex].quantity + delta;
        }
        
        if (newQuantity <= 0) {
          cart.splice(existingIndex, 1);
        } else if (newQuantity > stock) {
          cart[existingIndex].quantity = stock;
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
            price: Number(product.discountPrice || product.price),
            originalPrice: Number(product.price),
            quantity: newQuantity,
            thumbnail: product.thumbnail || product.images?.[0]?.url || "/placeholder.png",
            stock: stock,
          });
          toast.success("Added to cart");
        }
      }
      
      localStorage.setItem("swhub_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Cart update failed", error);
    }
  };

  const handleBuyNow = () => {
    if (cartQuantity === 0) {
      handleUpdateCart(1);
    }
    const token = localStorage.getItem("customer_token");
    if (!token) {
      window.dispatchEvent(new CustomEvent("openCustomerAuthModal"));
    } else {
      router.push("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 lg:py-16 animate-pulse">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery Skeleton */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square w-full rounded-3xl bg-neutral-100" />
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1,2,3,4].map(i => <div key={i} className="h-20 w-20 shrink-0 rounded-xl bg-neutral-100" />)}
            </div>
          </div>
          {/* Info Skeleton */}
          <div className="flex flex-col gap-6 pt-4">
            <div className="h-4 w-24 rounded bg-neutral-100" />
            <div className="h-10 w-3/4 rounded-lg bg-neutral-100" />
            <div className="h-14 w-48 rounded-xl bg-neutral-100" />
            <div className="h-32 w-full rounded-2xl bg-neutral-100" />
            <div className="h-14 w-full rounded-xl bg-neutral-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center py-20 text-center px-4">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-50 text-neutral-400">
          <ShoppingCart size={40} />
        </div>
        <h1 className="mb-3 text-2xl font-black text-slate-900">Product Not Found</h1>
        <p className="mb-8 text-neutral-500 max-w-md">The item you're looking for doesn't exist or has been removed from our catalog.</p>
        <button 
          onClick={() => router.push('/products')}
          className="rounded-full bg-primary px-8 py-3 font-bold text-white transition hover:bg-blue-600"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const price = Number(product.discountPrice || product.price);
  const originalPrice = Number(product.price);
  const discount = product.discountPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const stock = product.stock ?? 0;
  const isOutOfStock = stock === 0;

  // Compile images
  const images = [];
  if (product.thumbnail) images.push(product.thumbnail);
  if (product.images?.length > 0) {
    product.images.forEach((img: any) => {
      if (img.url !== product.thumbnail) images.push(img.url);
    });
  }
  if (images.length === 0) images.push("/placeholder.png");

  // Format Description
  const highlights = product.description 
    ? product.description.split('\n').filter((line: string) => line.trim().length > 0)
    : [];

  // Demo Related Products
  const relatedProducts = [
    { id: 101, name: "Premium Filter Coffee", image: "/placeholder.png", price: 299, originalPrice: 399, discount: 25, stock: 50 },
    { id: 102, name: "Organic Honey 500g", image: "/placeholder.png", price: 450, originalPrice: 550, discount: 18, stock: 20 },
    { id: 103, name: "Assorted Tea Box", image: "/placeholder.png", price: 699, originalPrice: 899, discount: 22, stock: 15 },
    { id: 104, name: "Ceramic Coffee Mug", image: "/placeholder.png", price: 199, originalPrice: 299, discount: 33, stock: 100 },
  ];

  return (
    <main className="bg-white pb-32 lg:pb-10 pt-4 lg:pt-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          
          {/* SECTION 1: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-neutral-100 bg-neutral-50">
              <Image 
                src={activeImage} 
                alt={product.name} 
                fill 
                className="object-cover" 
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      activeImage === img ? "border-primary" : "border-neutral-100 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-neutral-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                {product.category?.name || "Grocery"}
              </span>
              {product.isBestSeller && (
                <span className="rounded bg-orange-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-700">
                  Best Seller
                </span>
              )}
            </div>

            <h1 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
              {product.name}
            </h1>

            <div className="mb-6 flex flex-wrap items-end gap-3 border-b border-neutral-100 pb-6">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-slate-900">₹{price}</span>
                {discount > 0 && (
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-emerald-600">{discount}% OFF</span>
                    <span className="text-sm text-neutral-400 line-through">₹{originalPrice}</span>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3 & 4: Actions (Desktop version) */}
            <div className="hidden lg:flex flex-col gap-6 mb-8 border-b border-neutral-100 pb-8">
              {isOutOfStock ? (
                <div className="rounded-2xl bg-neutral-100 py-4 text-center font-bold text-neutral-500">
                  Currently Out of Stock
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {cartQuantity === 0 ? (
                    <button
                      onClick={() => handleUpdateCart(1)}
                      className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-neutral-100 font-bold text-slate-900 transition hover:bg-neutral-200"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex h-14 flex-1 items-center justify-between rounded-2xl border-2 border-primary bg-blue-50/50 px-2">
                      <button
                        onClick={() => handleUpdateCart(-1)}
                        className="flex h-10 w-12 items-center justify-center rounded-xl bg-white text-primary shadow-sm hover:bg-blue-50"
                      >
                        <Minus size={20} />
                      </button>
                      <div className="flex flex-col items-center leading-none">
                        <span className="text-sm font-bold text-primary">{cartQuantity}</span>
                        <span className="text-[10px] font-bold uppercase text-primary/70">in cart</span>
                      </div>
                      <button
                        onClick={() => handleUpdateCart(1)}
                        className="flex h-10 w-12 items-center justify-center rounded-xl bg-white text-primary shadow-sm hover:bg-blue-50 disabled:opacity-50"
                        disabled={cartQuantity >= stock}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleBuyNow}
                    className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary font-bold text-white transition hover:bg-blue-600 shadow-xl shadow-primary/25"
                  >
                    Buy Now
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 5: Delivery Information */}
            <div className="mb-8 rounded-3xl border border-neutral-100 bg-neutral-50 p-5">
              <h3 className="mb-4 text-sm font-bold text-slate-900 uppercase tracking-wide">Delivery & Services</h3>
              <div className="grid gap-y-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-xs">
                    <Truck size={18} />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900">Fast Delivery</p>
                    <p className="text-xs text-neutral-500">Free above ₹499</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-xs">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900">Secure Payments</p>
                    <p className="text-xs text-neutral-500">100% Protected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-xs">
                    <RotateCcw size={18} />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900">Easy Returns</p>
                    <p className="text-xs text-neutral-500">7-Day policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-xs">
                    <CheckCircle size={18} />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900">Verified Seller</p>
                    <p className="text-xs text-neutral-500">Quality assured</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6: Product Highlights */}
            <div className="mb-8">
              <h3 className="mb-4 text-sm font-bold text-slate-900 uppercase tracking-wide">Product Highlights</h3>
              {highlights.length > 0 ? (
                <ul className="space-y-3">
                  {highlights.map((highlight: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-sm text-neutral-600">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-neutral-600">
                  Premium quality grocery item sourced directly from trusted vendors. Delivered fresh and safely to your doorstep.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 8: Related Products */}
        <div className="mt-16 border-t border-neutral-100 pt-16">
          <h2 className="mb-8 text-2xl font-black text-slate-900">Similar Products</h2>
          <div className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
            {relatedProducts.map(rp => (
              <div key={rp.id} className="min-w-[280px] snap-center sm:min-w-0">
                <ProductCard product={rp as any} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 7: Sticky Mobile Purchase Bar */}
      {!isOutOfStock && (
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+4rem)] left-0 right-0 z-40 bg-white border-t border-neutral-200 px-4 py-3 shadow-[0_-8px_16px_rgba(0,0,0,0.05)] lg:hidden transition-transform">
          <div className="flex gap-3 max-w-lg mx-auto">
            {cartQuantity === 0 ? (
              <button
                onClick={() => handleUpdateCart(1)}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-100 font-bold text-slate-900"
              >
                <ShoppingCart size={18} />
                Add
              </button>
            ) : (
              <div className="flex h-12 flex-1 items-center justify-between rounded-xl border-2 border-primary bg-blue-50/50 px-1">
                <button
                  onClick={() => handleUpdateCart(-1)}
                  className="flex h-9 w-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm"
                >
                  <Minus size={18} />
                </button>
                <span className="text-sm font-bold text-primary">{cartQuantity}</span>
                <button
                  onClick={() => handleUpdateCart(1)}
                  className="flex h-9 w-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm disabled:opacity-50"
                  disabled={cartQuantity >= stock}
                >
                  <Plus size={18} />
                </button>
              </div>
            )}
            <button
              onClick={handleBuyNow}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white shadow-lg shadow-primary/25"
            >
              Buy Now
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}