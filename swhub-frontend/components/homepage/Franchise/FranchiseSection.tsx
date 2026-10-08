import Link from "next/link";

export default function FranchiseSection() {
  return (
    <section className="pb-20">

      <div className="max-w-7xl mx-auto px-4">

        <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-slate-900 via-primary to-slate-950 border border-primary/20 shadow-xl">

          <div className="grid lg:grid-cols-2 gap-10 items-center p-8 md:p-14">

            <div className="text-white">

              <span className="bg-primary/20 text-slate-600 border border-primary/30 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase">
                RETAIL FRANCHISE OPPORTUNITY
              </span>

              <h2 className="mt-6 text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Open Your Own SW Hub Supermart
              </h2>

              <p className="mt-5 text-slate-300 text-base md:text-lg leading-relaxed">
                Join India's fastest-growing daily needs & grocery retail network.
                Benefit from direct FMCG distribution, integrated POS billing, and 
                high-margin household inventory.
              </p>

              <Link 
                href="/franchise" 
                className="mt-8 inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-primary transition shadow-lg shadow-emerald-500/25"
              >
                Apply For Franchise →
              </Link>

            </div>

            <div className="grid grid-cols-3 gap-4">

              <div className="bg-white rounded-3xl p-6 text-center">
                <h3 className="text-3xl font-black">
                  ₹5L+
                </h3>
                <p className="text-sm text-slate-500">
                  Investment
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 text-center">
                <h3 className="text-3xl font-black">
                  100%
                </h3>
                <p className="text-sm text-slate-500">
                  Support
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 text-center">
                <h3 className="text-3xl font-black">
                  PAN India
                </h3>
                <p className="text-sm text-slate-500">
                  Expansion
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}