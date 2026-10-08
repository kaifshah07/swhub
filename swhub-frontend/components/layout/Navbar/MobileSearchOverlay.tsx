"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X, Clock, TrendingUp } from "lucide-react";

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = ["Rice", "Milk", "Cooking Oil", "Biscuits", "Detergent"];

export default function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
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
    }
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem("swhub_recent_searches") || "[]");
      const filtered = stored.filter((item: string) => item.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, 5);
      localStorage.setItem("swhub_recent_searches", JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {
      // ignore
    }
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) {
      router.push("/products");
    } else {
      saveRecentSearch(term.trim());
      router.push(`/products?search=${encodeURIComponent(term.trim())}`);
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white animate-in slide-in-from-bottom-2 fade-in duration-200 md:hidden">
      {/* Header Area */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-white p-3 shadow-sm pt-[max(env(safe-area-inset-top),12px)]">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-50 transition-colors"
          aria-label="Close search"
        >
          <ArrowLeft size={22} />
        </button>

        <form onSubmit={handleSubmit} className="relative flex-1 flex items-center h-10 bg-gray-100 rounded-lg px-3 focus-within:ring-2 focus-within:ring-[primary]/30 transition-shadow">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search groceries..."
            className="flex-1 bg-transparent px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none w-full"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-600 hover:bg-gray-400 transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-white p-4">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Recent Searches
            </h3>
            <div className="flex flex-col gap-1">
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSearch(term)}
                  className="flex items-center gap-3 rounded-lg py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 px-2"
                >
                  <Clock size={16} className="text-gray-400" />
                  <span className="flex-1 truncate">{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Trending
          </h3>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((term, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSearch(term)}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-[primary] hover:text-[primary]"
              >
                <TrendingUp size={14} className="text-[primary]" />
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
