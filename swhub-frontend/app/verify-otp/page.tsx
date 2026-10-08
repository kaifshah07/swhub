"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, RotateCcw } from "lucide-react";
import { verifyCustomerOtp, resendCustomerOtp } from "../admin/services/api/customerAuth";
import toast from "react-hot-toast";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const customerId = searchParams.get("customerId");
  const email = searchParams.get("email") || "your email address";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!customerId) {
      toast.error("Invalid verification session. Please register first.");
      router.push("/register");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [customerId, router]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();

    if (!customerId || otp.length !== 6) {
      setError("Please enter the complete 6-digit verification code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await verifyCustomerOtp(Number(customerId), otp);

      if (!result.success || !result.data?.token) {
        throw new Error(result.message || "OTP verification failed");
      }

      const token = result.data.token;
      localStorage.setItem("customer_token", token);

      if (result.data.customer) {
        localStorage.setItem(
          "customer",
          JSON.stringify(result.data.customer)
        );
      }

      window.dispatchEvent(new Event("userLoggedIn"));
      window.dispatchEvent(new Event("storage"));
      toast.success("Email verified successfully! Welcome to SW Hub 🎉");

      const cart = JSON.parse(localStorage.getItem("swhub_cart") || "[]");
      if (cart.length > 0) {
        router.push("/checkout");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!customerId || countdown > 0) return;

    try {
      setResending(true);
      setError("");

      const result = await resendCustomerOtp(Number(customerId));

      if (!result.success) {
        throw new Error(result.message || "Failed to resend code");
      }

      setCountdown(60);
      toast.success("A new verification code has been sent!");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to resend OTP right now."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* BRAND BADGE */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl -blue- text-primary mb-3 shadow-sm border border-primary">
            <Mail size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Verify Your Email
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            We sent a 6-digit code to <strong className="text-slate-800">{email}</strong>
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5">
          {error && (
            <div className="mb-5 rounded-2xl bg-red-600/10 p-3.5 text-xs font-semibold text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 text-center">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                required
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/50 py-3.5 text-center text-3xl font-black tracking-[0.5em] outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20 text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md shadow-slate-900/10 transition hover:bg-slate-800 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  <span>Verify Email & Continue</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Didn't receive the code? </span>
            {countdown > 0 ? (
              <span className="font-bold text-slate-400">
                Resend in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-1 font-bold text-primary hover:underline disabled:opacity-50"
              >
                <RotateCcw size={12} />
                {resending ? "Sending..." : "Resend OTP Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}