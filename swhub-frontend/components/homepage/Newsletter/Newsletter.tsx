"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, Tag } from "lucide-react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSubscribed(true);
    toast.success("Thank you for subscribing to SW Hub Savings Club! 🛒");
    setEmail("");
  }

  return (
    <section className="py-12 bg-gradient-to-r from-secondary via-slate-800 to-primary text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md mb-4 shadow border border-white/10">
          <Tag size={26} className="text-primary" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
          Join The SW Hub Savings Club
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Get weekly grocery discount coupons, weekend flash-deal alerts, and exclusive bulk discount offers right in your inbox.
        </p>

        {subscribed ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-md px-6 py-3 font-semibold text-xs sm:text-sm border border-primary/40">
            <CheckCircle2 size={18} className="text-primary" />
            <span>You're all set! Check your email for special welcome coupons.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex max-w-md mx-auto gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for ₹100 coupon"
              className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 outline-none backdrop-blur-md focus:bg-white focus:text-slate-900 focus:placeholder-slate-400"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary hover:bg-primary text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md transition"
            >
              <span>Subscribe</span>
              <Send size={14} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
