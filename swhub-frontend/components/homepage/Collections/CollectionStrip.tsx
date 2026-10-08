"use client";

import Link from "next/link";
import Container from "@/components/ui/container";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    title: "Pantry Restock & Staples",
    desc: "Flours, rice, dals, ghee & cold-pressed oils",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
    slug: "/products?search=staples",
    color: "from-primary to-slate-900",
  },
  {
    title: "Morning Breakfast Corner",
    desc: "Premium tea, coffee, muesli, oats & honey",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400",
    slug: "/products?search=beverages",
    color: "from-accent to-slate-900",
  },
  {
    title: "Chef's Crockery & Cookware",
    desc: "Non-stick pans, dinnerware & airtight jars",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=400",
    slug: "/products?search=kitchenware",
    color: "from-slate-900 -sky-",
  },
  {
    title: "Spotless Cleaning & Laundry",
    desc: "Detergent powders, floor cleaners & sprays",
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&q=80&w=400",
    slug: "/products?search=cleaning",
    color: "from-primary to-slate-900",
  },
  {
    title: "Personal Care & Hygiene",
    desc: "Shampoos, body soaps, oral care & lotions",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400",
    slug: "/products?search=personal-care",
    color: "from-indigo-950 to-slate-900",
  },
  {
    title: "Snacks, Munchies & Bites",
    desc: "Crunchy namkeen, cookies, noodles & chips",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&q=80&w=400",
    slug: "/products?search=snacks",
    color: "from-error to-slate-900",
  },
  {
    title: "Stationery & Home Desk",
    desc: "Notebooks, gel pens, organizers & paper",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=400",
    slug: "/products?search=stationery",
    color: "from-slate-900 to-accent",
  },
  {
    title: "Dry Fruits & Healthy Nuts",
    desc: "California almonds, cashews, raisins & seeds",
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=400",
    slug: "/products?search=dry-fruits",
    color: "from-primary to-slate-950",
  },
];

export default function CollectionStrip() {
  return (
    <section className="py-12 bg-white">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Curated Household Collections
            </h2>
            <p className="text-xs text-slate-500 font-medium">Specially assembled packs for your home and pantry</p>
          </div>

          <Link
            href="/categories"
            className="flex items-center gap-1 text-primary font-bold text-xs sm:text-sm hover:underline"
          >
            <span>All Collections</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {collections.map((item) => (
            <Link
              key={item.title}
              href={item.slug}
              className="group relative overflow-hidden rounded-3xl shadow-xs hover:shadow-xl transition-all duration-300 aspect-[4/5] block border border-slate-100"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-75 transition-opacity duration-300 group-hover:opacity-85`}
              />

              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider mb-1">
                  SW Hub Curation
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                  {item.desc}
                </p>
                <span className="inline-flex items-center gap-1.5 bg-white text-slate-900 text-xs font-bold px-3.5 py-1.5 rounded-full w-max shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <span>Explore Now</span>
                  <ArrowRight size={13} className="text-primary" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}