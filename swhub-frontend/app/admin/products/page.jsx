"use client";

import { useEffect, useState } from "react";
import api from "../services/api/axios";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import {
  Plus,
  Search,
  Filter,
  Package,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedShelf, setSelectedShelf] = useState("");
  const [stockFilter, setStockFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get("/admin/products"),
        api.get("/categories"),
      ]);

      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (err) {
      console.error("Failed to load products/categories:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenAdd() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function handleOpenEdit(product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success("Product deleted successfully");
      loadData();
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error(err?.response?.data?.message || "Failed to delete product");
    }
  }

  // Quick stats
  const totalCount = products.length;
  const activeCount = products.filter((p) => p.isActive).length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const shelfAssignedCount = products.filter(
    (p) =>
      p.isFeatured ||
      p.isTrending ||
      p.isNewArrival ||
      p.isFlashSale ||
      p.isBestSeller
  ).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      !selectedCategory || String(p.categoryId) === String(selectedCategory);

    const matchesShelf =
      !selectedShelf ||
      (selectedShelf === "featured" && p.isFeatured) ||
      (selectedShelf === "trending" && p.isTrending) ||
      (selectedShelf === "newArrival" && p.isNewArrival) ||
      (selectedShelf === "flashSale" && p.isFlashSale) ||
      (selectedShelf === "bestSeller" && p.isBestSeller);

    const matchesStock =
      stockFilter === "ALL" ||
      (stockFilter === "IN_STOCK" && p.stock > 5) ||
      (stockFilter === "LOW_STOCK" && p.stock > 0 && p.stock <= 5) ||
      (stockFilter === "OUT_OF_STOCK" && p.stock === 0);

    return matchesSearch && matchesCategory && matchesShelf && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* HEADER & ADD BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Products Catalog
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Create, edit, organize categories, and assign products to homepage shelves.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] active:scale-95"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* METRIC BADGE COUNTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Products
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalCount}</span>
            <span className="text-xs text-slate-400">in store</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
            Active in Store
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{activeCount}</span>
            <span className="text-xs text-emerald-600">visible</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider block">
            Low / Out of Stock
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-600">{lowStockCount}</span>
            <span className="text-xs text-red-400">needs restock</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
            Shelf-Assigned
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{shelfAssignedCount}</span>
            <span className="text-xs text-emerald-500">homepage</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-3.5 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by product name, brand, SKU code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-xs outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* CATEGORY DROPDOWN */}
          <div className="w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-orange-500 focus:bg-white"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* SHELF FILTER DROPDOWN */}
          <div className="w-full md:w-48">
            <select
              value={selectedShelf}
              onChange={(e) => setSelectedShelf(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-orange-500 focus:bg-white"
            >
              <option value="">All Shelves</option>
              <option value="featured">Featured Collection</option>
              <option value="trending">Trending Products</option>
              <option value="newArrival">New Arrivals</option>
              <option value="flashSale">Flash Sale</option>
              <option value="bestSeller">Best Sellers</option>
            </select>
          </div>

          {/* INVENTORY STATUS FILTER */}
          <div className="w-full md:w-40">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-orange-500 focus:bg-white"
            >
              <option value="ALL">All Stock</option>
              <option value="IN_STOCK">In Stock (&gt;5)</option>
              <option value="LOW_STOCK">Low Stock (1-5)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* ACTIVE FILTER PILLS */}
        {(search || selectedCategory || selectedShelf || stockFilter !== "ALL") && (
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
            <span>Showing {filteredProducts.length} of {products.length} products</span>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
                setSelectedShelf("");
                setStockFilter("ALL");
              }}
              className="font-bold text-orange-600 hover:underline ml-2"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* PRODUCTS TABLE */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading catalog items...</p>
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {modalOpen && (
        <ProductModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={loadData}
          product={editingProduct}
          categories={categories}
        />
      )}
    </div>
  );
}
