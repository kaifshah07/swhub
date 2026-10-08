"use client";

import { useEffect, useState, useMemo, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/homepage/Products/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import GridSkeleton from "@/components/ui/GridSkeleton";
import {
  Filter,
  X,
  SlidersHorizontal,
  Star,
  Heart,
  Search,
  ArrowUpDown,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { API_URL, productImageUrl } from "@/lib/api";
import toast from "react-hot-toast";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Product = {
  id: number;
  name: string;
  thumbnail?: string | null;
  price: number | string;
  discountPrice?: number | string | null;
  stock: number;
  brand?: string | null;
  ageGroup?: string | null;
  categoryId?: number | null;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
};

const SHOPPING_NEEDS = [
  "Daily Groceries",
  "Cooking Oils & Ghee",
  "Tea, Coffee & Drinks",
  "Crockery & Utensils",
  "Cleaning & Detergent",
  "Personal Care",
  "Snacks & Packaged Food",
  "Stationery & Paper",
];

const SECTIONS = [
  { key: "all", label: "All Items" },
  { key: "trending", label: "🔥 Trending" },
  { key: "featured", label: "✨ Featured" },
  { key: "new-arrivals", label: "🆕 New Arrivals" },
  { key: "best-sellers", label: "🏆 Best Sellers" },
  { key: "flash-sale", label: "⚡ Flash Sale" },
];

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL state
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("categoryId") || "";
  const initialAge = searchParams.get("ageGroup") || "";
  const initialType = searchParams.get("type") || (searchParams.get("flashSale") === "true" ? "flash-sale" : "all");
  const initialSort = searchParams.get("sort") || "newest";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedAge, setSelectedAge] = useState(initialAge);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedSort, setSelectedSort] = useState(initialSort);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  // Sync wishlist from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistIds(stored.map((item: any) => item.id));
    } catch {
      setWishlistIds([]);
    }
  }, []);

  // Load categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products based on filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = `${API_URL}/products`;

      if (selectedType && selectedType !== "all") {
        endpoint = `${API_URL}/homepage/products/${selectedType}`;
      }

      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory) params.set("categoryId", selectedCategory);
      if (selectedAge) params.set("ageGroup", selectedAge);
      if (selectedSort) params.set("sort", selectedSort);

      const queryString = params.toString();
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;

      const res = await fetch(url);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedAge, selectedType, selectedSort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleAddToCart(product: Product, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const price = Number(product.discountPrice || product.price);
    const origPrice = Number(product.price);

    const cart = JSON.parse(localStorage.getItem("swhub_cart") || "[]");
    const existingIndex = cart.findIndex((item: any) => item.productId === product.id);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: price,
        originalPrice: origPrice,
        quantity: 1,
        thumbnail: product.thumbnail,
        stock: product.stock || 10,
      });
    }

    localStorage.setItem("swhub_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.name} added to cart! 🛒`);
  }

  function handleToggleWishlist(product: Product, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = wishlist.some((item: any) => item.id === product.id);

    let updated;
    if (exists) {
      updated = wishlist.filter((item: any) => item.id !== product.id);
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      toast("Removed from wishlist");
    } else {
      const price = Number(product.discountPrice || product.price);
      const origPrice = Number(product.price);
      updated = [
        ...wishlist,
        {
          id: product.id,
          name: product.name,
          image: productImageUrl(product.thumbnail),
          price: price,
          originalPrice: origPrice,
          discount:
            product.discountPrice && origPrice > 0
              ? Math.round(((origPrice - price) / origPrice) * 100)
              : 0,
        },
      ];
      setWishlistIds((prev) => [...prev, product.id]);
      toast.success("Added to wishlist ❤️");
    }

    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  }

  function clearAllFilters() {
    setSearch("");
    setSelectedCategory("");
    setSelectedAge("");
    setSelectedType("all");
    setSelectedSort("newest");
    router.push("/products");
  }

  const activeFiltersCount =
    (search ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (selectedAge ? 1 : 0) +
    (selectedType !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Products Catalog</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedType && selectedType !== "all"
                  ? SECTIONS.find((s) => s.key === selectedType)?.label
                  : search
                  ? `Search: "${search}"`
                  : "All Daily Needs & Household Products"}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {loading ? "Loading items..." : `Showing ${products.length} products available`}
              </p>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex lg:hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="relative flex items-center">
                <ArrowUpDown size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-7 text-xs font-semibold text-slate-700 shadow-xs outline-none transition focus:border-primary"
                >
                  <option value="newest">Featured & Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block space-y-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <Filter size={16} className="text-primary" />
                  Filter Catalog
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Search Inside Catalog */}
              <div className="py-3.5 border-b border-slate-100">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                  Search Within
                </label>
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search titles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary focus:bg-white"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Featured Sections */}
              <div className="py-3.5 border-b border-slate-100">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                  Curated Deals
                </label>
                <div className="space-y-1">
                  {SECTIONS.map((sec) => (
                    <button
                      key={sec.key}
                      onClick={() => setSelectedType(sec.key)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        selectedType === sec.key
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Filter */}
              <div className="py-3.5 border-b border-slate-100">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                  Departments
                </label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedCategory === ""
                        ? "font-bold text-primary bg-slate-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    All Departments
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(String(cat.id))}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedCategory === String(cat.id)
                          ? "font-bold text-primary bg-slate-50"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shopping Need */}
              <div className="pt-3.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Daily Need / Pack
                </label>
                <div className="flex flex-wrap gap-1">
                  {SHOPPING_NEEDS.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedAge(selectedAge === item ? "" : item)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                        selectedAge === item
                          ? "border-primary bg-primary text-white shadow-xs"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-primary"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* MOBILE FILTERS MODAL */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 flex bg-black/50 lg:hidden">
              <div className="ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-2xl overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h3 className="font-bold text-base text-slate-900">Filters</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="py-4 space-y-5 flex-1">
                  {/* Search */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Search</label>
                    <input
                      type="text"
                      placeholder="Search title..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                    />
                  </div>

                  {/* Deals */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Curated Deals</label>
                    <div className="space-y-1">
                      {SECTIONS.map((sec) => (
                        <button
                          key={sec.key}
                          onClick={() => {
                            setSelectedType(sec.key);
                            setMobileFiltersOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            selectedType === sec.key ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {sec.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Departments */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Departments</label>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCategory("");
                          setMobileFiltersOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          selectedCategory === "" ? "bg-slate-50 text-primary font-bold" : "text-slate-700"
                        }`}
                      >
                        All Departments
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(String(cat.id));
                            setMobileFiltersOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            selectedCategory === String(cat.id) ? "bg-slate-50 text-primary font-bold" : "text-slate-700"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex gap-2">
                  <button
                    onClick={clearAllFilters}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-xs"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAIN PRODUCT GRID */}
          <main>
            {loading ? (
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-white p-4 shadow-xs border border-slate-100">
                    <div className="aspect-square bg-slate-200 rounded-xl mb-3" />
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                    <div className="h-8 bg-slate-200 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState icon={Search} title="No matching products found" description="Try clearing active filters or searching for everyday items like flour, oil, cookware, or cleaners." ctaText="Clear All Filters" onCtaClick={clearAllFilters} />
            ) : (
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => {
                  const price = Number(product.discountPrice || product.price);
                  const origPrice = Number(product.price);
                  const discountPct = product.discountPrice && origPrice > 0
                      ? Math.round(((origPrice - price) / origPrice) * 100)
                      : 0;

                  return (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.name,
                        image: product.thumbnail ? productImageUrl(product.thumbnail) : "/placeholder.png",
                        price: price,
                        originalPrice: origPrice,
                        discount: discountPct,
                        brand: product.brand || undefined,
                  stock: product.stock ?? 0,
                  isFeatured: product.isFeatured,
                  isTrending: product.isTrending,
                  isNewArrival: product.isNewArrival,
                  isBestSeller: product.isBestSeller,
                  isFlashSale: product.isFlashSale,
                        }}
                    />
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center py-20 text-slate-500 font-medium">
          Loading marketplace catalog...
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
