"use client";

import { useState, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import {
  loginCustomer,
  registerCustomer,
  verifyCustomerOtp,
  resendCustomerOtp,
} from "@/app/admin/services/api/customerAuth";
import toast from "react-hot-toast";

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"auth" | "otp">("auth");
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // OTP state
  const [otpCustomerId, setOtpCustomerId] = useState<number | null>(null);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(60);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleOpen(e: any) {
      const detail = e.detail || {};
      setTab(detail.defaultTab || "login");
      setStep("auth");
      setError("");
      setModalMessage(detail.message || null);
      if (typeof detail.onSuccess === "function") {
        setOnSuccessCallback(() => detail.onSuccess);
      } else {
        setOnSuccessCallback(null);
      }
      setIsOpen(true);
    }

    window.addEventListener("openCustomerAuthModal", handleOpen);
    return () => window.removeEventListener("openCustomerAuthModal", handleOpen);
  }, []);

  // OTP countdown timer
  useEffect(() => {
    if (step !== "otp" || countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  function closeModal() {
    setIsOpen(false);
    setError("");
    setLoading(false);
    setStep("auth");
  }

  function handleAuthSuccess(token: string, customer: any) {
    localStorage.setItem("customer_token", token);
    if (customer) {
      localStorage.setItem("customer", JSON.stringify(customer));
    }
    window.dispatchEvent(new Event("userLoggedIn"));
    window.dispatchEvent(new Event("storage"));
    toast.success(`Welcome to SW Hub, ${customer?.name || "Shopper"}! 🎉`);
    closeModal();
    if (onSuccessCallback) {
      onSuccessCallback();
    }
  }

  // Handle Login Submission
  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginCustomer(loginForm);
      if (res.success && res.data) {
        handleAuthSuccess(res.data.token, res.data.customer);
      } else {
        setError(res.message || "Invalid email or password");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Handle Register Submission
  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (registerForm.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }

    try {
      const res = await registerCustomer(registerForm);
      if (res.success && res.data) {
        setOtpCustomerId(res.data.customerId);
        setOtpEmail(res.data.email || registerForm.email);
        setStep("otp");
        setCountdown(60);
        toast.success("Verification code sent to your email!");
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Handle OTP Verification
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await verifyCustomerOtp({
        email: otpEmail,
        otp: otpCode,
      });

      if (res.success && res.data) {
        handleAuthSuccess(res.data.token, res.data.customer);
      } else {
        setError(res.message || "Invalid or expired OTP");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
  async function handleResendOtp() {
    if (countdown > 0) return;
    setError("");
    setLoading(true);

    try {
      const res = await resendCustomerOtp(otpEmail);
      if (res.success) {
        setCountdown(60);
        toast.success("A fresh OTP has been sent to your email!");
      } else {
        setError(res.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all animate-in zoom-in-95 border border-slate-100">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
        >
          <X size={18} />
        </button>

        {/* MODAL HEADER */}
        <div className="px-8 pt-6 pb-2 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-50 text-primary mb-3 shadow-inner">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {step === "otp"
              ? "Verify Your Email"
              : tab === "login"
              ? "Welcome to SW Hub"
              : "Join SW Hub Daily Deals"}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {modalMessage ||
              (step === "otp"
                ? `Enter the 6-digit code sent to ${otpEmail}`
                : tab === "login"
                ? "Sign in to access your cart, orders, and exclusive member discounts."
                : "Create an account in seconds for fast checkout and repeat savings.")}
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mx-8 mt-3 flex items-center gap-2 rounded-xl bg-red-600/10 p-3 text-xs font-medium text-red-600 border border-red-200">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* MAIN BODY: TABS & FORMS */}
        {step === "auth" ? (
          <div className="p-8 pt-4">
            {/* TAB SELECTOR */}
            <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setError("");
                }}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                  tab === "login"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setError("");
                }}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                  tab === "register"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* TAB 1: LOGIN */}
            {tab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />
                    <input
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      placeholder="shopper@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
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
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-secondary to-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition hover:opacity-95 active:scale-95 disabled:opacity-60"
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
            )}

            {/* TAB 2: REGISTER */}
            {tab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />
                    <input
                      type="text"
                      required
                      value={registerForm.name}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, name: e.target.value })
                      }
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (10 digits)
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={registerForm.phone}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                      placeholder="9876543210"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />
                    <input
                      type="email"
                      required
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="shopper@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Create Password (min 6 characters)
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
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
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-secondary to-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition hover:opacity-95 active:scale-95 disabled:opacity-60"
                >
                  {loading ? (
                    "Sending OTP..."
                  ) : (
                    <>
                      <span>Continue with OTP</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TRUST BADGE FOOTER */}
            <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-primary" />
                100% Safe & Secure
              </span>
              <span>•</span>
              <span>Instant Checkout</span>
            </div>
          </div>
        ) : (
          /* STEP 2: OTP VERIFICATION */
          <div className="p-8 pt-4">
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 text-center mb-2">
                  Enter 6-digit Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  required
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  className="w-full rounded-2xl border-2 border-primary bg-slate-50/40 py-3 text-center text-2xl font-black tracking-[0.5em] text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-secondary to-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition hover:opacity-95 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Complete"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              <span>Didn't receive the code? </span>
              {countdown > 0 ? (
                <span className="font-semibold text-slate-400">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                >
                  <RotateCcw size={12} />
                  Resend OTP Now
                </button>
              )}
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setStep("auth")}
                className="text-xs text-slate-400 hover:text-slate-600 hover:underline"
              >
                ← Back to registration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
