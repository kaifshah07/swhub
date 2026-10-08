"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, ShoppingBag, ShieldCheck, Zap } from "lucide-react";

type Hero = {
  id: number;
  title: string;
  subtitle?: string | null;
  desktopImage?: string;
  mobileImage?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  isActive: boolean;
};

const DEFAULT_SLIDES = [
  {
    id: 1,
    badge: "⚡ EXPRESS DELIVERY TO YOUR DOORSTEP",
    title: "Daily Groceries & Essentials At Wholesale Prices",
    subtitle: "From farm-fresh staples, pulses, and cold-pressed oils to morning tea & snacks — save more on every cart.",
    buttonText: "Shop Groceries Now",
    buttonUrl: "/products?search=staples",
    bgGradient: "from-secondary via-slate-800 to-primary",
    tag: "Flat ₹100 Off with Code: SWHUB100",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=900",
  },
  {
    id: 2,
    badge: "🍽️ KITCHEN & HOME UPGRADE FEST",
    title: "Premium Crockery, Cookware & Storage Jars",
    subtitle: "Upgrade your dining table with heat-resistant glassware, stainless steel cookware, and air-tight kitchen storage.",
    buttonText: "Explore Kitchenware",
    buttonUrl: "/products?search=kitchenware",
    bgGradient: "from-slate-900 via-primary to-secondary",
    tag: "Up to 50% Off on Top Kitchen Brands",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=900",
  },
  {
    id: 3,
    badge: "🧼 SPOTLESS HOME & HYGIENE WEEK",
    title: "Complete Cleaning & Personal Care Must-Haves",
    subtitle: "Surface sprays, washing powders, handwashes, and personal hygiene supplies from trusted national brands.",
    buttonText: "View Cleaning Deals",
    buttonUrl: "/products?search=cleaning",
    bgGradient: "from-secondary via-slate-800 to-accent",
    tag: "Everyday Value Packs & Combos",
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&q=80&w=900",
  },
];

export default function HeroSlider() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHeroes() {
      try {
        const response = await fetch(`${API_URL}/homepage/heroes`);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const activeHeroes = result.data.filter((h: Hero) => h.isActive !== false);
          if (activeHeroes.length > 0) {
            setHeroes(activeHeroes);
          }
        }
      } catch (error) {
        console.error("Failed to load hero slides:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHeroes();
  }, []);

  const totalSlides = heroes.length > 0 ? heroes.length : DEFAULT_SLIDES.length;

  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="mx-auto max-w-[1600px] px-4 py-4">
          <div className="h-[340px] sm:h-[400px] md:h-[440px] w-full animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </div>
    );
  }

  // If custom heroes uploaded in CMS, render them
  if (heroes.length > 0) {
    const currentHero = heroes[current] || heroes[0];
    return (
      <div className="w-full">
        <div className="mx-auto max-w-[1600px] px-4 py-4">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-lg">
            {currentHero.buttonUrl ? (
              <Link href={currentHero.buttonUrl}>
                <img
                  src={currentHero.desktopImage}
                  alt={currentHero.title || "SW Hub Hero"}
                  className="w-full object-cover cursor-pointer max-h-[460px]"
                />
              </Link>
            ) : (
              <img
                src={currentHero.desktopImage}
                alt={currentHero.title || "SW Hub Hero"}
                className="w-full object-cover max-h-[460px]"
              />
            )}

            {currentHero.title && (
              <div className="absolute bottom-6 left-8 bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl text-white max-w-lg hidden sm:block border border-slate-700/60 shadow-xl">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary bg-primary/60 border border-primary/30 px-2.5 py-1 rounded-full">
                  SW HUB SPECIAL
                </span>
                <h2 className="text-2xl md:text-3xl font-black mt-2 leading-tight">{currentHero.title}</h2>
                {currentHero.subtitle && <p className="text-xs md:text-sm text-slate-300 mt-2">{currentHero.subtitle}</p>}
                {currentHero.buttonText && currentHero.buttonUrl && (
                  <Link
                    href={currentHero.buttonUrl}
                    className="mt-4 inline-flex items-center gap-2 bg-primary hover:bg-primary text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm"
                  >
                    <span>{currentHero.buttonText}</span>
                    <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            )}
          </div>

          {heroes.length > 1 && (
            <div className="mt-3 flex justify-center gap-2">
              {heroes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full transition-all ${
                    current === index ? "bg-primary w-8" : "bg-slate-300 w-2"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render high-impact default daily-needs retail banners
  const slide = DEFAULT_SLIDES[current];

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1600px] px-4 py-4">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${slide.bgGradient} text-white shadow-xl min-h-[360px] sm:min-h-[420px] flex items-center`}>
          {/* Subtle geometric retail backdrop */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#0EA5E9_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6 sm:p-12 w-full">
            {/* Copy & CTA */}
            <div className="md:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wide uppercase text-slate-600 backdrop-blur-md border border-white/10">
                <Zap size={13} className="text-primary" />
                {slide.badge}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                {slide.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed">
                {slide.subtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={slide.buttonUrl}
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary hover:bg-primary px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-950/40 transition hover:scale-105 active:scale-95"
                >
                  <ShoppingBag size={17} />
                  <span>{slide.buttonText}</span>
                  <ArrowRight size={16} />
                </Link>

                <span className="rounded-2xl bg-white/10 px-4 py-3 text-xs font-bold text-primary backdrop-blur-md border border-primary/30">
                  {slide.tag}
                </span>
              </div>
            </div>

            {/* Visual Hero Showcase */}
            <div className="hidden md:flex md:col-span-5 justify-center items-center">
              <div className="relative w-full max-w-sm aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-1 hover:rotate-0 transition duration-500">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-bold flex items-center gap-1">
                    <ShieldCheck size={14} className="text-primary" /> Verified Fresh
                  </span>
                  <span className="text-[11px] bg-primary px-2 py-0.5 rounded font-extrabold">
                    SW Hub Best Buy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel indicator pills */}
        <div className="mt-3 flex justify-center gap-2">
          {DEFAULT_SLIDES.map((_, index) => (
            <button
              key={index}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index ? "bg-primary w-8" : "bg-slate-300 w-2 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}