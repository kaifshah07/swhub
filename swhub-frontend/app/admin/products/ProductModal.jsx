"use client";

import { useEffect, useState, useRef } from "react";
import api from "../services/api/axios";
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  Package,
  IndianRupee,
  Layers,
  CheckCircle2,
  Trash2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { productImageUrl } from "@/lib/api";
import toast from "react-hot-toast";

export default function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  product = null,
  categories = [],
}) {
  const [loading, setLoading] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    franchisePrice: "",
    stock: "10",
    categoryId: "",
    subcategoryId: "",
    brand: "",
    ageGroup: "",
    shortDescription: "",
    description: "",
    isFeatured: false,
    isTrending: false,
    isNewArrival: false,
    isFlashSale: false,
    isBestSeller: false,
    isActive: true,
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price ? String(product.price) : "",
        discountPrice:
          product.discountPrice !== null && product.discountPrice !== undefined
            ? String(product.discountPrice)
            : "",
        franchisePrice:
          product.franchisePrice !== null && product.franchisePrice !== undefined
            ? String(product.franchisePrice)
            : "",
        stock: String(product.stock ?? 10),
        categoryId: String(product.categoryId || ""),
        subcategoryId: String(product.subcategoryId || ""),
        brand: product.brand || "",
        ageGroup: product.ageGroup || "",
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        isFeatured: Boolean(product.isFeatured),
        isTrending: Boolean(product.isTrending),
        isNewArrival: Boolean(product.isNewArrival),
        isFlashSale: Boolean(product.isFlashSale),
        isBestSeller: Boolean(product.isBestSeller),
        isActive: product.isActive ?? true,
      });

      if (product.thumbnail) {
        setThumbnailPreview(productImageUrl(product.thumbnail));
      } else {
        setThumbnailPreview(null);
      }

      if (product.categoryId) {
        loadSubcategories(product.categoryId);
      }
    } else {
      const defaultCat = categories[0]?.id ? String(categories[0].id) : "";
      setForm({
        name: "",
        price: "",
        discountPrice: "",
        franchisePrice: "",
        stock: "10",
        categoryId: defaultCat,
        subcategoryId: "",
        brand: "",
        ageGroup: "",
        shortDescription: "",
        description: "",
        isFeatured: false,
        isTrending: false,
        isNewArrival: false,
        isFlashSale: false,
        isBestSeller: false,
        isActive: true,
      });
      setThumbnailPreview(null);
      if (defaultCat) {
        loadSubcategories(defaultCat);
      }
    }
    setThumbnailFile(null);
  }, [product, categories, isOpen]);

  async function loadSubcategories(catId) {
    if (!catId) {
      setSubcategories([]);
      return;
    }
    try {
      const res = await api.get(`/subcategories/category/${catId}`);
      setSubcategories(res.data.data || []);
    } catch {
      setSubcategories([]);
    }
  }

  function handleCategoryChange(e) {
    const catId = e.target.value;
    setForm((prev) => ({ ...prev, categoryId: catId, subcategoryId: "" }));
    loadSubcategories(catId);
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  }

  function handleRemoveImage() {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // Live discount calculations
  const numPrice = parseFloat(form.price) || 0;
  const numDiscountPrice = parseFloat(form.discountPrice) || 0;
  const hasDiscount =
    numDiscountPrice > 0 && numPrice > 0 && numDiscountPrice < numPrice;
  const savingsAmount = hasDiscount ? numPrice - numDiscountPrice : 0;
  const savingsPercent = hasDiscount
    ? Math.round((savingsAmount / numPrice) * 100)
    : 0;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    if (!form.price || numPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!form.categoryId) {
      toast.error("Please choose a category");
      return;
    }

    if (!product && !thumbnailFile) {
      toast.error("Please upload a product thumbnail image");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("price", String(numPrice));
      if (form.discountPrice && numDiscountPrice > 0) {
        data.append("discountPrice", String(numDiscountPrice));
      }
      data.append("stock", String(parseInt(form.stock) || 0));
      data.append("categoryId", form.categoryId);
      if (form.subcategoryId) data.append("subcategoryId", form.subcategoryId);
      if (form.brand) data.append("brand", form.brand.trim());
      if (form.ageGroup) data.append("ageGroup", form.ageGroup);
      if (form.shortDescription)
        data.append("shortDescription", form.shortDescription.trim());
      if (form.description)
        data.append("description", form.description.trim());

      data.append("isFeatured", String(form.isFeatured));
      data.append("isTrending", String(form.isTrending));
      data.append("isNewArrival", String(form.isNewArrival));
      data.append("isFlashSale", String(form.isFlashSale));
      data.append("isBestSeller", String(form.isBestSeller));
      data.append("isActive", String(form.isActive));

      if (thumbnailFile) {
        data.append("thumbnail", thumbnailFile);
      }

      if (product) {
        await api.put(`/admin/products/${product.id}`, data);
        toast.success("Product updated successfully! 🎉");
      } else {
        await api.post("/admin/products", data);
        toast.success("Product created successfully! 🎉");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Save product error:", err);
      toast.error(err?.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl my-8">
        {/* HEADER BAR */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {product ? "Edit Product Details" : "Add New Product"}
              </h2>
              <p className="text-[11px] text-slate-400">
                Fill in the product specifications, pricing, and shelf placement.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>1. Basic Information</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Wooden Educational Activity Cube Toy"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) =>
                    setForm({ ...form, brand: e.target.value })
                  }
                  placeholder="e.g. SW Hub, Fortune, Tata, Milton, Dettol"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none transition focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Age Group
                </label>
                <select
                  value={form.ageGroup}
                  onChange={(e) =>
                    setForm({ ...form, ageGroup: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-orange-500 focus:bg-white"
                >
                  <option value="">Select Age Range</option>
                  <option value="0-6 Months">0-6 Months (Infant)</option>
                  <option value="6-12 Months">6-12 Months (Crawler)</option>
                  <option value="1-3 Years">1-3 Years (Toddler)</option>
                  <option value="3-5 Years">3-5 Years (Preschool)</option>
                  <option value="5-8 Years">5-8 Years (Early School)</option>
                  <option value="8-12 Years">8-12 Years (Kids & Tweens)</option>
                  <option value="All Ages">All Ages</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Hook Description
                </label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm({ ...form, shortDescription: e.target.value })
                  }
                  placeholder="Brief catchy phrase displayed on hover cards..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none transition focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Product features, safe materials, dimensions, and usage guide..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none transition focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PRICING & INVENTORY */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>2. Pricing & Inventory</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Original Price (MRP ₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  placeholder="999"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selling / Discount Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.discountPrice}
                  onChange={(e) =>
                    setForm({ ...form, discountPrice: e.target.value })
                  }
                  placeholder="799"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-700 mb-1">
                  Franchise B2B Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.franchisePrice}
                  onChange={(e) =>
                    setForm({ ...form, franchisePrice: e.target.value })
                  }
                  placeholder="699"
                  className="w-full rounded-xl border border-emerald-200 bg-emerald-50/50 px-3.5 py-2.5 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stock Units *
                </label>
                <input
                  type="number"
                  required
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                  placeholder="25"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* LIVE DISCOUNT CALCULATOR PREVIEW */}
            {hasDiscount && (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3.5 py-2 border border-emerald-200 text-xs text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>
                  Live Discount: Customer saves{" "}
                  <strong>₹{savingsAmount.toFixed(0)}</strong> (
                  <strong>{savingsPercent}% OFF</strong>)
                </span>
              </div>
            )}
          </div>

          {/* SECTION 3: CATEGORY & SUBCATEGORY */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>3. Classification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Category *
                </label>
                <select
                  required
                  value={form.categoryId}
                  onChange={handleCategoryChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-orange-500 focus:bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subcategory
                </label>
                <select
                  value={form.subcategoryId}
                  onChange={(e) =>
                    setForm({ ...form, subcategoryId: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-orange-500 focus:bg-white"
                >
                  <option value="">None / General</option>
                  {subcategories.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: PRODUCT IMAGE DROPZONE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>4. Product Media</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Recommended: 800x800px (JPG, PNG, WebP)
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {thumbnailPreview ? (
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="h-20 w-20 rounded-xl object-contain border border-slate-200 bg-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {thumbnailFile ? thumbnailFile.name : "Current Image"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {thumbnailFile
                      ? `${(thumbnailFile.size / 1024).toFixed(0)} KB`
                      : "Saved on server"}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-300 transition"
                    >
                      Replace Image
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded-lg text-red-600 hover:bg-red-50 px-2.5 py-1 text-[11px] font-bold transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-orange-400 hover:bg-orange-50/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-2">
                  <UploadCloud size={20} />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  Click to upload product image
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Supports high-resolution PNG, JPG, or WebP up to 5MB
                </p>
              </div>
            )}
          </div>

          {/* SECTION 5: HOMEPAGE SHELF FLAGS & STATUS */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                5. Homepage Shelf Assignment & Visibility
              </span>
              <span className="text-[10px] text-slate-400">
                Mutual exclusivity auto-managed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* FEATURED */}
              <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 cursor-pointer hover:border-emerald-300 transition">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm({ ...form, isFeatured: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-emerald-600"
                />
                <span className="text-xs font-bold text-emerald-700">Featured</span>
              </label>

              {/* TRENDING */}
              <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 cursor-pointer hover:border-orange-300 transition">
                <input
                  type="checkbox"
                  checked={form.isTrending}
                  onChange={(e) =>
                    setForm({ ...form, isTrending: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-orange-600"
                />
                <span className="text-xs font-bold text-orange-700">Trending</span>
              </label>

              {/* NEW ARRIVAL */}
              <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 cursor-pointer hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={form.isNewArrival}
                  onChange={(e) =>
                    setForm({ ...form, isNewArrival: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-purple-600"
                />
                <span className="text-xs font-bold text-purple-700">New Arrival</span>
              </label>

              {/* FLASH SALE */}
              <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 cursor-pointer hover:border-red-300 transition">
                <input
                  type="checkbox"
                  checked={form.isFlashSale}
                  onChange={(e) =>
                    setForm({ ...form, isFlashSale: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-red-600"
                />
                <span className="text-xs font-bold text-red-700">Flash Sale</span>
              </label>

              {/* BEST SELLER */}
              <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 cursor-pointer hover:border-amber-300 transition">
                <input
                  type="checkbox"
                  checked={form.isBestSeller}
                  onChange={(e) =>
                    setForm({ ...form, isBestSeller: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-amber-600"
                />
                <span className="text-xs font-bold text-amber-700">Best Seller</span>
              </label>

              {/* ACTIVE STATUS */}
              <label className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 cursor-pointer hover:bg-emerald-100/50 transition">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-emerald-600"
                />
                <span className="text-xs font-bold text-emerald-800">
                  Active in Store
                </span>
              </label>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              {loading ? "Saving Product..." : product ? "Update Product" : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
