"use client";

import { useEffect, useState, useRef } from "react";
import api from "../services/api/axios";
import {
  FolderTree,
  Plus,
  Search,
  Edit3,
  Trash2,
  Image as ImageIcon,
  X,
  ExternalLink,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const fileInputRef = useRef(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(category = null) {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || "",
        description: category.description || "",
      });
      setThumbnailPreview(category.image || "");
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
      setThumbnailPreview("");
    }
    setThumbnailFile(null);
    setShowModal(true);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("description", formData.description.trim());
      
      if (thumbnailFile) {
        submitData.append("image", thumbnailFile);
      }

      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category updated successfully!");
      } else {
        await api.post("/admin/categories", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category created successfully!");
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      console.error("Failed to save category:", err);
      toast.error(err?.response?.data?.message || "Failed to save category");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success("Category deleted");
      loadCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
      toast.error(err?.response?.data?.message || "Failed to delete category");
    }
  }

  const filteredCategories = categories.filter((c) => {
    return (
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.slug?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Categories</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Manage your store&apos;s product categories and departments.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30 transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
          />
        </div>
      </div>

      {/* CATEGORIES TABLE */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />
            <p className="text-xs font-bold text-slate-500">Loading categories...</p>
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-3">
            <FolderTree size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No categories found</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            {search ? "Try adjusting your search terms." : "Get started by creating your first product category."}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4 pl-6">Department</th>
                  <th className="p-4">Slug Code</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/60 transition group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3.5">
                        <div className="h-12 w-12 rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <FolderTree size={20} className="text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition">
                            {cat.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        /{cat.slug}
                      </span>
                    </td>

                    <td className="p-4 text-slate-500 max-w-sm truncate">
                      {cat.description || "-"}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/categories/${cat.slug}`}
                          target="_blank"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                          title="View on Store"
                        >
                          <ExternalLink size={15} />
                        </Link>

                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition"
                          title="Edit Category"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete Category"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORY ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70 shrink-0">
              <h2 className="text-base font-black text-slate-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
              <div className="p-6 space-y-5 text-xs">
                {/* IMAGE UPLOAD */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Category Image (Upload)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {thumbnailPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={thumbnailPreview}
                        alt="Preview"
                        className="h-24 w-24 rounded-2xl object-cover border border-slate-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailFile(null);
                          setThumbnailPreview("");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm hover:bg-red-200"
                      >
                        <X size={12} />
                      </button>
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
                        Click to upload category image
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Supports high-resolution PNG, JPG, or WebP up to 5MB
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Toys & Games, Baby Care, Clothing"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none transition focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of this category..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none transition focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-orange-700 shadow-md shadow-orange-600/20"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
