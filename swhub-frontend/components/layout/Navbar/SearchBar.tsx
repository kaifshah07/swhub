"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import DesktopSearchOverlay from "./DesktopSearchOverlay";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative hidden lg:block flex-1 max-w-2xl mx-2 xl:mx-6 shrink">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search size={18} />
        </div>

        <input
          type="text"
          readOnly
          onClick={() => setIsOpen(true)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for products, categories, or brands..."
          className="w-full cursor-text rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-slate-300"
        />
      </div>

      <DesktopSearchOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}