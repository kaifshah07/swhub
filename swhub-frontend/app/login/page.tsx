"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Percent,
} from "lucide-react";
import { loginCustomer } from "../admin/services/api/customerAuth";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const result = await loginCustomer({
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });

      if (!result.success || !result.data?.token) {
        throw new Error(result.message || "Login failed");
      }

      const token = result.data.token;
      localStorage.setItem("customer_token", token);

      const customer = result.data.customer;
      if (customer) {
        localStorage.setItem("customer", JSON.stringify(customer));
      }

      window.dispatchEvent(new Event("userLoggedIn"));
      window.dispatchEvent(new Event("storage"));
      toast.success(`Welcome back, ${customer?.name || "Shopper"}! 🎉`);

      // Check if cart has items to redirect to cart, else go to home
      const cart = JSON.parse(localStorage.getItem("swhub_cart") || "[]");
      if (cart.length > 0) {
        router.push("/cart");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const code = err?.response?.data?.code;
      const backendMessage = err?.response?.data?.message;

      if (code === "ACCOUNT_NOT_FOUND" || status === 404) {
        setError("No account found for this email. Please create an account to continue.");
      } else if (code === "UNVERIFIED_ACCOUNT" || status === 403) {
        const customerId = err?.response?.data?.customerId;
        const email = err?.response?.data?.email || form.email.trim();
        setError("Please verify your email before logging in.");
        toast("Please verify your email address to continue.", { icon: "ℹ️" });
        if (customerId || email) {
          router.push(
            `/verify-otp?${customerId ? `customerId=${customerId}&` : ""}email=${encodeURIComponent(
              email
            )}`
          );
        }
      } else if (code === "ACCOUNT_BLOCKED") {
        setError("Your account has been blocked. Please contact customer support.");
      } else if (status === 401 || code === "INVALID_CREDENTIALS") {
        setError("Invalid email or password. Please try again.");
      } else if (!err?.response) {
        setError("Unable to connect to the server. Please check your internet connection and try again.");
      } else {
        setError(backendMessage || "Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* BRAND BADGE */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 text-primary mb-3 shadow-sm border border-primary/20">
            <ShoppingBag size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to access your basket, past orders & exclusive deals.
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5">
          {error && (
            <div className="mb-5 rounded-2xl bg-red-600/10 p-3.5 text-xs font-semibold text-red-600 border border-red-200">
              <p>{error}</p>
              {error.includes("create an account") && (
                <Link
                  href="/register"
                  className="mt-1.5 inline-block font-bold text-primary underline"
                >
                  Create an Account Now →
                </Link>
              )}
            </div>
          )}

          {/* GOOGLE SIGN IN */}
          <div className="mb-5">
            <GoogleAuthButton
              text="Continue with Google"
              onSuccess={(token, customer) => {
                localStorage.setItem("customer_token", token);
                if (customer) {
                  localStorage.setItem("customer", JSON.stringify(customer));
                }
                window.dispatchEvent(new Event("userLoggedIn"));
                window.dispatchEvent(new Event("storage"));
                toast.success(`Welcome back, ${customer?.name || "Shopper"}! 🎉`);
                const cart = JSON.parse(localStorage.getItem("swhub_cart") || "[]");
                if (cart.length > 0) {
                  router.push("/cart");
                } else {
                  router.push("/");
                }
              }}
              onError={(err) => setError(err)}
            />
          </div>

          <div className="relative mb-5 flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              or sign in with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-3.5 text-slate-400"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-3.5 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md shadow-slate-900/10 transition hover:bg-slate-800 active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  <span>Sign In & Continue</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* PERKS STRIP */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50/70 p-2.5 text-[11px] font-bold text-primary border border-primary/20">
                <Truck size={14} className="mx-auto mb-1 text-primary" />
                Fast Delivery
              </div>
              <div className="rounded-xl bg-amber-50/70 p-2.5 text-[11px] font-bold text-slate-600 border border-amber-200/50">
                <Percent size={14} className="mx-auto mb-1 text-slate-600" />
                Best Deals
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 text-[11px] font-bold text-slate-700 border border-slate-200/50">
                <ShieldCheck size={14} className="mx-auto mb-1 text-primary" />
                Verified Quality
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs font-medium text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-primary hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
