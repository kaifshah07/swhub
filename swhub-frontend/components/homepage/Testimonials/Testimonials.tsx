"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Pooja Sharma",
    city: "Mumbai",
    text: "SW Hub has made our monthly pantry refills seamless. Atta, cooking oils, and dal quality is top-notch, and delivery arrived on time without any crushed packets!",
    rating: 5,
  },
  {
    name: "Vikram Mehta",
    city: "Bangalore",
    text: "Ordered a non-stick cookware set and airtight glass jars for the kitchen. Superb build quality, heavy bottom cookware, and priced at least 30% below retail stores.",
    rating: 5,
  },
  {
    name: "Ananya Deshmukh",
    city: "Pune",
    text: "The customer care team is very responsive. Needed to adjust delivery timings for my cleaning supplies order and it was sorted in minutes. Our go-to marketplace now.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-slate-50 border border-primary/60 px-3.5 py-1 rounded-full">
            Customer Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
            What Regular Shoppers Say About SW Hub
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Real feedback from homes and kitchens across India</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6 shadow-xs relative flex flex-col justify-between"
            >
              <div>
                <Quote size={28} className="text-slate-600 mb-3" />
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={15} className="fill-[#F59E0B] text-slate-600" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <p className="font-bold text-xs sm:text-sm text-slate-900">{item.name}</p>
                <p className="text-[11px] text-slate-500">{item.city}, India</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
