import { Sparkles, ShoppingBag } from "lucide-react";

export default function CategoryBanner() {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-secondary via-slate-800 to-primary p-6 sm:p-8 text-white shadow-md border border-slate-800">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-primary bg-primary/60 border border-primary/30 px-2.5 py-0.5 rounded-full mb-2">
            <Sparkles size={12} />
            <span>SW Hub Value Offer</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Up to 40% OFF on Household Staples
          </h2>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-300">
            Stock up on pure cooking oils, organic dals, kitchen crockery, and bulk cleaners.
          </p>
        </div>

        <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-3xl shrink-0">
          🛒
        </div>
      </div>
    </div>
  );
}