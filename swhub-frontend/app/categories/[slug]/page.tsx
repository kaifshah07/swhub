"use client";

import { useEffect, useState, use } from "react";
import CategoryHero from "@/components/categories/CategoryHero";
import CategoryFilters from "@/components/categories/CategoryFilters";
import CategoryProducts from "@/components/categories/CategoryProducts";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;

  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");

  // Fetch category info
  useEffect(() => {
    if (!slug) return;
    async function loadCategory() {
      try {
        setLoadingCategory(true);
        const res = await fetch(`${API_URL}/categories/${slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setCategory(json.data);
        } else {
          setCategory(null);
        }
      } catch (err) {
        console.error("Failed to fetch category:", err);
        setCategory(null);
      } finally {
        setLoadingCategory(false);
      }
    }
    loadCategory();
  }, [slug]);

  // Fetch products whenever category, subcategory, age, or sort changes
  useEffect(() => {
    if (!category?.id) {
      if (!loadingCategory) setLoadingProducts(false);
      return;
    }

    async function loadProducts() {
      try {
        setLoadingProducts(true);
        const query = new URLSearchParams();
        query.append("categoryId", String(category.id));
        if (selectedSubcategory) query.append("subcategoryId", selectedSubcategory);
        if (selectedAge) query.append("ageGroup", selectedAge);
        if (selectedSort) query.append("sort", selectedSort);

        const res = await fetch(`${API_URL}/products?${query.toString()}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to load category products:", err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, [category?.id, selectedSubcategory, selectedAge, selectedSort, loadingCategory]);

  if (loadingCategory) {
    return (
      <div className="min-h-screen py-24 text-center text-slate-500 font-medium">
        Loading Category...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen py-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Category Not Found</h2>
        <p className="mt-2 text-slate-500">The requested category does not exist or has been moved.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-white shadow-md transition hover:bg-primary"
        >
          <Sparkles size={16} />
          Explore All Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <CategoryHero
        title={category.name}
        description={category.description}
        productCount={products.length}
      />

      <section className="py-10 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <CategoryFilters
              subcategories={category.subcategories || []}
              selectedSubcategory={selectedSubcategory}
              onSelectSubcategory={setSelectedSubcategory}
              selectedAge={selectedAge}
              onSelectAge={setSelectedAge}
              onClear={() => {
                setSelectedSubcategory("");
                setSelectedAge("");
              }}
            />

            <CategoryProducts
              products={products}
              loading={loadingProducts}
              totalCount={products.length}
              sort={selectedSort}
              onSortChange={setSelectedSort}
            />
          </div>
        </div>
      </section>
    </>
  );
}