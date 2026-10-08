"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "./navLinks";
import CategoryDropdown from "./CategoryDropdown";
import { ChevronDown } from "lucide-react";

export default function Navigation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="hidden xl:flex items-center gap-6 shrink-0">
      {navLinks.map((link) => {
        if (link.name === "Shop Categories") {
          return (
            <div 
              key={link.name} 
              className="relative flex items-center"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Link
                href={link.href}
                className={`flex items-center gap-1 text-sm font-medium whitespace-nowrap transition duration-200 py-2 ${
                  isDropdownOpen ? "text-primary" : "text-neutral-700 hover:text-primary"
                }`}
              >
                {link.name}
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180 text-primary" : "text-neutral-400"
                  }`} 
                />
              </Link>
              
              {isDropdownOpen && <CategoryDropdown onClose={() => setIsDropdownOpen(false)} />}
            </div>
          );
        }

        return (
          <Link
            key={link.name}
            href={link.href}
            className="text-sm font-medium whitespace-nowrap text-neutral-700 transition duration-200 hover:text-primary py-2"
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}