"use client";

import Link from "next/link";

const sections = [
  {
    title: "Hero Slides",
    href: "/admin/homepage/heroes",
  },
  {
    title: "Advertisements",
    href: "/admin/homepage/advertisements",
  },
  {
    title: "Flash Sale",
    href: "/admin/homepage/flash-sale",
  },
  {
    title: "Featured Products",
    href: "/admin/homepage/featured-products",
  },
  {
    title: "Trending Products",
    href: "/admin/homepage/trending-products",
  },
  {
    title: "New Arrivals",
    href: "/admin/homepage/new-arrivals",
  },
  {
    title: "Best Sellers",
    href: "/admin/homepage/best-sellers",
  },
  {
    title: "Brands",
    href: "/admin/homepage/brands",
  },
  {
    title: "Character Zone",
    href: "/admin/homepage/character-zone",
  },
  {
    title: "Trust Section",
    href: "/admin/homepage/trust-section",
  },
  {
    title: "Business Strip",
    href: "/admin/homepage/business-strip",
  },
];

export default function HomepageManager() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Homepage Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition flex flex-col justify-center"
          >
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="text-gray-500 mt-2">Manage {section.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
