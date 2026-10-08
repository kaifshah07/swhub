"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Ticket,
  CreditCard,
  Banknote,
  CheckCircle2,
  X,
  Lock,
} from "lucide-react";
import { API_URL } from "@/lib/api";
import toast from "react-hot-toast";
import { openCustomerAuthModal } from "@/lib/authModal";

type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  stock?: number;
  product?: any;
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Coupon states
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    setMounted(true);
    // 1. Load cart first
    const storedCart = localStorage.getItem("swhub_cart");
    if (!storedCart) {
      router.push("/cart");
      return;
    }

    try {
      const parsedCart: CartItem[] = JSON.parse(storedCart);
      if (!parsedCart.length) {
        router.push("/cart");
        return;
      }
      setCart(parsedCart);
    } catch {
      router.push("/cart");
      return;
    }

    // 2. Check Auth
    checkAuthAndLoad();

    window.addEventListener("userLoggedIn", checkAuthAndLoad);
    return () => window.removeEventListener("userLoggedIn", checkAuthAndLoad);
  }, [router]);

  function checkAuthAndLoad() {
    const token = localStorage.getItem("customer_token");
    if (!token) {
      setIsAuthenticated(false);
      openCustomerAuthModal({
        defaultTab: "login",
        message: "Sign in or create an account to place your order.",
        onSuccess: () => {
          checkAuthAndLoad();
        },
      });
      return;
    }
    setIsAuthenticated(true);
    loadCustomer(token);
  }

  async function loadCustomer(token: string) {
    try {
      const response = await fetch(`${API_URL}/auth/customer/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      const customer = result.data?.customer || result.data;

      if (customer) {
        setForm((prev) => ({
          ...prev,
          name: customer.name || prev.name,
          email: customer.email || prev.email,
          phone: customer.phone || prev.phone,
        }));
      }
    } catch (error) {
      console.error("Failed to load customer profile:", error);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Calculate subtotals cleanly
  const subtotal = cart.reduce((total, item) => {
    const itemPrice = Number(item.price || item.product?.discountPrice || item.product?.price || 0);
    return total + itemPrice * item.quantity;
  }, 0);

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = discountedSubtotal >= 499 || discountedSubtotal === 0 ? 0 : 40;
  const total = discountedSubtotal + shipping;

  async function handleApplyCoupon() {
    if (!couponInput.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      setCouponLoading(true);
      const res = await fetch(`${API_URL}/coupons/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponInput.trim(),
          orderAmount: subtotal,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid coupon code");
      }

      setAppliedCoupon({
        code: data.data.code,
        discount: data.data.discount,
      });
      toast.success(`Coupon "${data.data.code}" applied! Saved ₹${data.data.discount}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    toast("Coupon removed");
  }

  async function placeOrder() {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please fill in your contact details");
      return;
    }

    if (
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      toast.error("Please complete your delivery address");
      return;
    }

    const token = localStorage.getItem("customer_token");
    if (!token) {
      openCustomerAuthModal({
        defaultTab: "login",
        message: "Please sign in or register to place your order.",
        onSuccess: () => {
          checkAuthAndLoad();
        },
      });
      return;
    }

    try {
      setLoading(true);

      const itemsPayload = cart.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      }));

      const fullAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

      // 1. Create the order
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: itemsPayload,
          address: fullAddress,
          paymentMethod,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to place order");
      }

      const orderData = result.data?.order || result.data;
      const orderId = orderData.id;

      // Handle CASH ON DELIVERY
      if (paymentMethod === "COD") {
        localStorage.removeItem("swhub_cart");
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Order placed successfully! 🎉");
        router.push(`/order-success?orderId=${orderId}`);
        return;
      }

      // Handle ONLINE PAYMENT (RAZORPAY)
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      const paymentRes = await fetch(`${API_URL}/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const paymentJson = await paymentRes.json();
      if (!paymentRes.ok || !paymentJson.success) {
        throw new Error(paymentJson.message || "Failed to initialize online payment");
      }

      const { paymentId, razorpayOrderId, amount, currency, key } = paymentJson.data;

      const options = {
        key,
        amount,
        currency: currency || "INR",
        name: "SW Hub",
        description: `Order #${orderData.orderNumber || orderId}`,
        order_id: razorpayOrderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#0EA5E9",
        },
        handler: async function (response: any) {
          try {
            toast.loading("Verifying payment...", { id: "verify-toast" });

            const verifyRes = await fetch(`${API_URL}/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                paymentId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyJson = await verifyRes.json();
            toast.dismiss("verify-toast");

            if (verifyJson.success) {
              localStorage.removeItem("swhub_cart");
              window.dispatchEvent(new Event("cartUpdated"));
              toast.success("Payment verified! Order confirmed! 🎉");
              router.push(`/order-success?orderId=${orderId}`);
            } else {
              toast.error(verifyJson.message || "Payment verification failed");
              router.push(`/orders/${orderId}`);
            }
          } catch (verifyErr: any) {
            toast.dismiss("verify-toast");
            toast.error(verifyErr.message || "Verification error");
          }
        },
        modal: {
          ondismiss: function () {
            toast("Payment cancelled. You can complete payment later from your orders.", {
              icon: "ℹ️",
            });
            router.push(`/orders/${orderId}`);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (error: any) {
      console.error(error);
      if (error.message && error.message.includes("not found")) {
        toast.error("A product in your cart is no longer available. Please clear your cart and add items again.", { duration: 5000 });
      } else {
        toast.error(error.message || "Order placement failed");
      }
    } finally {
      setLoading(false);
    }
  }

  ﻿  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-50 pb-32 lg:pb-16 pt-6 lg:pt-10 font-sans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="mb-8">
            <div className="h-4 w-40 rounded bg-neutral-200 mb-2" />
            <div className="h-10 w-48 rounded-lg bg-neutral-200" />
          </div>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            <div className="flex-1 space-y-8">
              <div className="h-[400px] rounded-3xl bg-neutral-200" />
              <div className="h-[200px] rounded-3xl bg-neutral-200" />
            </div>
            <div className="w-full lg:w-[420px] shrink-0">
              <div className="h-[500px] rounded-3xl bg-neutral-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!cart.length) {

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-50 py-20 px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm text-neutral-400">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="mb-3 text-2xl font-black text-slate-900">Your Basket is Empty</h1>
        <p className="mb-8 max-w-md text-sm text-neutral-500">
          You haven't added anything to your cart yet. Discover fresh products and exclusive deals in our catalog.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="rounded-xl bg-primary px-8 py-3.5 font-bold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-blue-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const isFreeShipping = discountedSubtotal >= 499;
  const progressToFree = Math.min((discountedSubtotal / 499) * 100, 100);

  return (
    <main className="min-h-screen bg-slate-50 pb-32 lg:pb-16 pt-6 lg:pt-10 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-primary uppercase tracking-wider">
            <Lock size={14} />
            <span>Secure Encrypted Checkout</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Checkout</h1>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          
          {/* Left Column (Forms) */}
          <div className="flex-1 space-y-8">
            
            {/* Delivery Section */}
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-black text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">1</span>
                Delivery Details
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h3 className="mb-3 text-sm font-bold text-slate-700 uppercase tracking-wide">Contact Information</h3>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Order updates will be sent here"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="sm:col-span-2 mt-2">
                  <h3 className="mb-3 text-sm font-bold text-slate-700 uppercase tracking-wide">Delivery Address</h3>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Street Address</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="House no, Building, Street, Area"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City / District"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN code"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-black text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">2</span>
                Payment Method
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* ONLINE */}
                <label 
                  className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                    paymentMethod === "ONLINE" 
                      ? "border-primary bg-blue-50/30" 
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={() => setPaymentMethod("ONLINE")}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${paymentMethod === "ONLINE" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-500"}`}>
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Pay Online</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">UPI, Cards, Net</p>
                    </div>
                  </div>
                  {paymentMethod === "ONLINE" && (
                    <div className="absolute right-4 top-4 text-primary">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </label>

                {/* COD */}
                <label 
                  className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                    paymentMethod === "COD" 
                      ? "border-primary bg-blue-50/30" 
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${paymentMethod === "COD" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-500"}`}>
                      <Banknote size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">COD</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">Pay at door</p>
                    </div>
                  </div>
                  {paymentMethod === "COD" && (
                    <div className="absolute right-4 top-4 text-primary">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </label>
              </div>

              {/* Trust Layer */}
              <div className="mt-8 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <ShieldCheck size={20} className="text-primary" />
                    <span className="text-[11px] font-bold text-slate-700">Secure<br/>Payments</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Truck size={20} className="text-primary" />
                    <span className="text-[11px] font-bold text-slate-700">Fast<br/>Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <RotateCcw size={20} className="text-primary" />
                    <span className="text-[11px] font-bold text-slate-700">Easy<br/>Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <CheckCircle2 size={20} className="text-primary" />
                    <span className="text-[11px] font-bold text-slate-700">Verified<br/>Sellers</span>
                  </div>
                </div>
              </div>

            </section>
          </div>

          {/* Right Column (Summary) */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="sticky top-24 rounded-3xl border border-neutral-200 bg-white shadow-xs">
              
              <div className="border-b border-neutral-100 p-6">
                <h2 className="text-lg font-black text-slate-900">Order Summary</h2>
                <p className="text-sm text-neutral-500">{cart.length} {cart.length === 1 ? "Item" : "Items"} in cart</p>
              </div>

              {/* Free Shipping Progress */}
              <div className="bg-neutral-50 p-6 border-b border-neutral-100">
                {isFreeShipping ? (
                  <p className="text-xs font-bold text-emerald-600 mb-2">
                    🎉 Free delivery unlocked!
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    Add <span className="font-bold text-primary">₹{499 - discountedSubtotal}</span> more for FREE delivery
                  </p>
                )}
                <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isFreeShipping ? "bg-emerald-500" : "bg-primary"
                    }`}
                    style={{ width: `${progressToFree}%` }}
                  />
                </div>
              </div>

              {/* Coupons */}
              <div className="border-b border-neutral-100 p-6">
                <h3 className="mb-3 text-sm font-bold text-slate-700 uppercase tracking-wide">Apply Coupon</h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Ticket size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-700">{appliedCoupon.code}</p>
                        <p className="text-xs text-emerald-600">₹{appliedCoupon.discount} savings applied</p>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-neutral-400 hover:text-red-500 p-1">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Promo code"
                      className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm uppercase outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="rounded-xl bg-slate-900 px-5 font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>

              {/* Math */}
              <div className="p-6">
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-slate-900">
                      {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between border-t border-neutral-100 pt-4 text-xl font-black text-slate-900">
                  <span>Grand Total</span>
                  <span>₹{total}</span>
                </div>

                <div className="hidden lg:block mt-6">
                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-xl shadow-primary/25 transition-all hover:bg-blue-600 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                  >
                    {loading ? "Processing..." : "Place Order Securely"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+4rem)] lg:bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white p-4 shadow-[0_-8px_16px_rgba(0,0,0,0.05)] lg:hidden">
        <div className="mx-auto max-w-7xl flex gap-4 items-center justify-between">
          <div className="flex flex-col shrink-0">
            <span className="text-xs text-neutral-500 font-medium">Total Amount</span>
            <span className="text-xl font-black text-slate-900">₹{total}</span>
          </div>
          <button
            onClick={placeOrder}
            disabled={loading}
            className="flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-blue-600 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>

    </main>
  );
}
