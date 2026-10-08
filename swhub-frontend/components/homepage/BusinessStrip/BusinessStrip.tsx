import Link from "next/link";
import { ArrowRight, Store, Building2, TrendingUp, ShieldCheck } from "lucide-react";

export default function BusinessSection() {
  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Vendor */}
          <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-secondary via-slate-800 to-slate-900 p-8 text-white shadow-lg border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Store size={18} className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full text-slate-600">
                  Seller Program
                </span>
              </div>

              <h3 className="mt-5 text-2xl sm:text-3xl font-black tracking-tight">
                Sell On SW Hub
              </h3>

              <p className="mt-3 text-slate-300 text-sm leading-relaxed max-w-md">
                List your FMCG, grocery, crockery, or household products on SW Hub and reach high-intent daily shoppers across top cities.
              </p>

              <div className="mt-6 flex gap-6">
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white">100,000+</h4>
                  <p className="text-xs text-slate-400">Monthly Shoppers</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white">48 Hours</h4>
                  <p className="text-xs text-slate-400">Quick Onboarding</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-primary">Lowest</h4>
                  <p className="text-xs text-slate-400">Commission Rates</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/become-a-vendor">
                <button className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-6 py-3 font-bold text-sm shadow hover:bg-primary transition">
                  <span>Register as Vendor</span>
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>

          {/* Franchise */}
          <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-secondary via-primary to-slate-900 p-8 text-white shadow-lg border border-primary/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full text-primary">
                  Franchise Model
                </span>
              </div>

              <h3 className="mt-5 text-2xl sm:text-3xl font-black tracking-tight">
                Open an SW Hub Store
              </h3>

              <p className="mt-3 text-slate-300 text-sm leading-relaxed max-w-md">
                Launch a high-turnover daily needs and grocery convenience store with full POS billing, central inventory replenishment, and tech support.
              </p>

              <div className="mt-6 flex gap-6">
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white">Pan India</h4>
                  <p className="text-xs text-slate-400">High Growth Areas</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white">100%</h4>
                  <p className="text-xs text-slate-400">Supply Chain Support</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-primary">Fast ROI</h4>
                  <p className="text-xs text-slate-400">High Daily Footfalls</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/franchise">
                <button className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-6 py-3 font-bold text-sm shadow hover:bg-slate-100 transition">
                  <span>Apply for Franchise</span>
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}