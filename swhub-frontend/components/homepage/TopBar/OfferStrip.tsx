"use client";

export default function TopOfferBar() {
  return (
    <div className="h-9 overflow-hidden bg-slate-900 border-b border-slate-800 text-slate-200 flex items-center">
      <div className="animate-marquee whitespace-nowrap font-medium text-xs tracking-wide">
        <span className="text-primary font-bold">⚡ SUPERFAST DELIVERY</span> ACROSS YOUR CITY •{" "}
        <span className="text-primary font-bold">🎉 EVERYDAY WHOLESALE PRICES</span> ON GROCERIES & HOUSEHOLD •{" "}
        <span className="font-semibold text-white">🌾 FRESH ATTA, RICE, DALS & OILS</span> •{" "}
        <span className="font-semibold text-white">🍽️ PREMIUM CROCKERY & KITCHEN ESSENTIALS</span> •{" "}
        <span className="font-semibold text-white">🧼 TOP BRAND CLEANING SUPPLIES</span> •{" "}
        <span className="bg-primary text-white px-2 py-0.5 rounded-full font-bold text-[10px]">
          CODE: SWHUB100
        </span>{" "}
        FOR ₹100 OFF • ⭐ 100% AUTHENTIC QUALITY GUARANTEE • 🚀 FREE DELIVERY ABOVE ₹499 •
      </div>
    </div>
  );
}