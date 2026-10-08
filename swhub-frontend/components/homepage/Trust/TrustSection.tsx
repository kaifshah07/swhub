"use client";

const items = [
  "⚡ Superfast Express Delivery",
  "🌾 100% Fresh & Authentic Staples",
  "🍽️ Premium Crockery & Kitchenware",
  "🔒 Bank-Grade Secure Payments",
  "🔄 Hassle-Free 7-Day Easy Returns",
  "💰 Everyday Wholesale Price Guarantee",
  "🤝 Verified Local Sellers & Brands",
  "🧼 Hygienically Handled & Packed",
];

export default function TrustSection() {
  return (
    <section className="py-3.5 bg-slate-100/70 border-y border-slate-200/80 overflow-hidden">
      <div className="relative">
        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {[...items, ...items].map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 rounded-full bg-white border border-slate-200/80 px-4 py-1.5 text-xs font-bold text-slate-800 shadow-xs"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}