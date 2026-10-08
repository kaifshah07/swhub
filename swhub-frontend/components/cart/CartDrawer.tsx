"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

type CartItem = {
  productId: number;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  thumbnail: string;
  stock: number;
};

export default function CartDrawer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    function loadCart() {
      try {
        const storedCart = JSON.parse(localStorage.getItem("swhub_cart") || "[]");
        setCart(storedCart);
      } catch (err) {
        setCart([]);
      }
    }
    
    function openDrawer() {
      setIsOpen(true);
    }
    
    function closeDrawer() {
      setIsOpen(false);
    }
    
    loadCart();
    
    window.addEventListener("cartUpdated", loadCart);
    window.addEventListener("storage", loadCart);
    window.addEventListener("openCartDrawer", openDrawer);
    window.addEventListener("closeCartDrawer", closeDrawer);
    
    return () => {
      window.removeEventListener("cartUpdated", loadCart);
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("openCartDrawer", openDrawer);
      window.removeEventListener("closeCartDrawer", closeDrawer);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("swhub_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQuantity = (id: number) => {
    const newCart = cart.map((item) => {
      if (item.productId === id) {
        if (item.quantity < item.stock) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          toast.error(`Only ${item.stock} units available`);
        }
      }
      return item;
    });
    saveCart(newCart);
  };

  const decreaseQuantity = (id: number) => {
    const newCart = cart.map((item) => {
      if (item.productId === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    saveCart(newCart);
  };
  
  const removeItem = (id: number) => {
    const newCart = cart.filter((item) => item.productId !== id);
    saveCart(newCart);
  };

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("customer_token");
    setIsOpen(false);
    if (!token) {
      window.dispatchEvent(new CustomEvent("openCustomerAuthModal"));
    } else {
      router.push("/checkout");
    }
  };

  if (!mounted) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 499;
  const shipping = isFreeShipping ? 0 : 40;
  const grandTotal = subtotal + shipping;
  const progressToFree = Math.min((subtotal / 499) * 100, 100);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[70] flex w-full flex-col bg-white shadow-2xl transition-transform duration-300 sm:w-[420px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-5 py-4 pt-[max(env(safe-area-inset-top),16px)]">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            My Cart
            <span className="text-sm font-semibold text-neutral-500">
              ({totalItems} {totalItems === 1 ? "Item" : "Items"})
            </span>
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {cart.length > 0 && (
          <div className="shrink-0 bg-neutral-50 px-5 py-3 border-b border-neutral-100">
            {isFreeShipping ? (
              <p className="text-xs font-bold text-emerald-600 mb-2">
                🎉 Congratulations! FREE delivery unlocked.
              </p>
            ) : (
              <p className="text-xs font-semibold text-slate-700 mb-2">
                Add <span className="font-bold text-primary">₹{499 - subtotal}</span> more for FREE delivery
              </p>
            )}
            <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isFreeShipping ? "bg-emerald-500" : "bg-primary"
                }`}
                style={{ width: `${progressToFree}%` }}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-white p-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-50 text-neutral-400">
                <ShoppingBag size={32} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">Your cart is empty</h3>
              <p className="mb-6 text-sm text-neutral-500">
                Add products to start shopping
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex gap-4 border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
                    <Image
                      src={item.thumbnail || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">
                          {item.name}
                        </h4>
                        <button 
                          onClick={() => removeItem(item.productId)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1 -mr-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          ₹{item.price}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-8 items-center rounded-lg border border-neutral-200 bg-white">
                        <button
                          onClick={() => decreaseQuantity(item.productId)}
                          className="flex h-full w-8 items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="flex h-full w-8 items-center justify-center text-sm font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.productId)}
                          className="flex h-full w-8 items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="shrink-0 border-t border-neutral-100 bg-white p-5 pb-[max(env(safe-area-inset-bottom),20px)]">
            <div className="mb-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-neutral-100">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleProceedToCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-600 shadow-lg shadow-primary/25"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/cart");
                }}
                className="flex w-full items-center justify-center rounded-xl bg-neutral-100 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-neutral-200"
              >
                View Full Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
