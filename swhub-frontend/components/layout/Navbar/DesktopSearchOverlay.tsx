"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp, Grid } from "lucide-react";
import Link from "next/link";

interface DesktopSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = ["Rice", "Milk", "Cooking Oil", "Biscuits", "Detergent"];
const QUICK_CATEGORIES = [
  { name: "Groceries", slug: "groceries-staples" },
  { name: "Beverages", slug: "beverages-juices" },
  { name: "Personal Care", slug: "personal-care" },
  { name: "Cleaning", slug: "cleaning-household" },
];

export default function DesktopSearchOverlay({ isOpen, onClose }: DesktopSearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = JSON.parse(localStorage.getItem("swhub_recent_searches") || "[]");
        setRecentSearches(stored);
      } catch {
        setRecentSearches([]);
      }
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const saveSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const stored = JSON.parse(localStorage.getItem("swhub_recent_searches") || "[]");
      const updated = [trimmed, ...stored.filter((s: string) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      localStorage.setItem("swhub_recent_searches", JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {
      // ignore
    }
  };

  const removeSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter(s => s !== term);
      localStorage.setItem("swhub_recent_searches", JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {
      // ignore
    }
  };

  function executeSearch(term: string) {
    if (!term.trim()) return;
    saveSearch(term);
    setQuery("");
    onClose();
    router.push(`/products?search=${encodeURIComponent(term.trim())}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    executeSearch(query);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 backdrop-blur-sm">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header / Search Input */}
        <form onSubmit={handleSubmit} className="relative flex items-center border-b border-neutral-100 p-4 sm:p-6 bg-white">
          <Search size={24} className="text-slate-400 ml-2" strokeWidth={2.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for groceries, household essentials, or brands..."
            className="flex-1 bg-transparent px-6 py-2 text-xl font-medium text-slate-900 placeholder:text-slate-400 outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-neutral-100 p-2.5 text-slate-500 transition-colors hover:bg-neutral-200 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </form>

        {/* Suggestions Body */}
        <div className="p-6 sm:p-8 bg-slate-50/50">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Recent Searches */}
            <div className="lg:col-span-1 border-r border-neutral-100 pr-6">
              <h3 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                <Clock size={16} className="text-primary" />
                Recent Searches
              </h3>
              
              {recentSearches.length > 0 ? (
                <ul className="space-y-2">
                  {recentSearches.map((term, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => executeSearch(term)}
                        className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white hover:text-primary hover:shadow-sm border border-transparent hover:border-slate-200"
                      >
                        <span className="truncate">{term}</span>
                        <div 
                          onClick={(e) => removeSearch(e, term)}
                          className="rounded-full p-1.5 text-neutral-300 opacity-0 transition-all hover:bg-neutral-100 hover:text-slate-900 group-hover:opacity-100"
                        >
                          <X size={16} />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm font-medium text-slate-400 px-4 py-2">No recent searches</p>
              )}
            </div>

            {/* Right Side container */}
            <div className="lg:col-span-2 flex flex-col gap-10 pl-2 lg:pl-6">
              {/* Trending Searches */}
              <div>
                <h3 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  <TrendingUp size={16} className="text-primary" />
                  Popular Right Now
                </h3>
                <div className="flex flex-wrap gap-3">
                  {TRENDING_SEARCHES.map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => executeSearch(term)}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories */}
              <div>
                <h3 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  <Grid size={16} className="text-primary" />
                  Shop by Category
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {QUICK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      onClick={onClose}
                      className="flex flex-col items-center justify-center rounded-xl bg-white p-4 text-center border border-slate-200 shadow-sm transition hover:border-primary hover:shadow-md"
                    >
                      <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
