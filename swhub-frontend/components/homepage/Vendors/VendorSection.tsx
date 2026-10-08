import Link from "next/link";
import { Building2, TrendingUp, Truck, Users } from "lucide-react";

export default function VendorSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="overflow-hidden rounded-[36px] bg-gradient-to-r from-slate-900 via-slate-800 to-primary p-8 md:p-14 text-white shadow-xl border border-slate-700/50">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-primary/20 text-slate-600 border border-primary/30 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
                SUPPLIER & VENDOR NETWORK
              </span>
              <h2 className="mt-4 text-3xl md:text-5xl font-black leading-tight">
                Supply Groceries & Daily Essentials to SW Hub
              </h2>
              <p className="mt-4 text-slate-300 text-base leading-relaxed">
                Connect your FMCG, packaged goods, kitchenware, or daily-needs brands directly to high-frequency shoppers and regional franchise partner outlets.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/become-a-vendor"
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:bg-primary shadow-lg shadow-emerald-500/25"
                >
                  Become a Supplier →
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  Contact Procurement
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
                <TrendingUp className="text-primary mb-2" size={24} />
                <h4 className="text-2xl font-black">Fast Payouts</h4>
                <p className="text-xs text-slate-300 mt-1">Direct bank transfers with transparent commission rates.</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
                <Users className="text-primary mb-2" size={24} />
                <h4 className="text-2xl font-black">50K+ Shoppers</h4>
                <p className="text-xs text-slate-300 mt-1">Reach families buying daily staples on a weekly cycle.</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
                <Truck className="text-primary mb-2" size={24} />
                <h4 className="text-2xl font-black">Doorstep Hubs</h4>
                <p className="text-xs text-slate-300 mt-1">Centralized fulfillment and dark store distribution.</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
                <Building2 className="text-primary mb-2" size={24} />
                <h4 className="text-2xl font-black">Retail Outlets</h4>
                <p className="text-xs text-slate-300 mt-1">Dual-channel reach: online orders and physical franchise racks.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}