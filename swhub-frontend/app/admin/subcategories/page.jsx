"use client";

import { useEffect, useState } from "react";
import api from "../services/api/axios";

export default function AdminSubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [subRes, catRes] = await Promise.all([
        api.get("/subcategories"),
        api.get("/categories"),
      ]);
      setSubcategories(subRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (err) {
      console.error("Failed to load subcategories:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(item = null) {
    if (item) {
      setEditingSubcategory(item);
      setForm({
        name: item.name || "",
        categoryId: String(item.categoryId || ""),
        displayOrder: item.displayOrder || 0,
        isActive: item.isActive ?? true,
      });
    } else {
      setEditingSubcategory(null);
      setForm({
        name: "",
        categoryId: categories[0]?.id ? String(categories[0].id) : "",
        displayOrder: 0,
        isActive: true,
      });
    }
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingSubcategory) {
        await api.put(`/subcategories/${editingSubcategory.id}`, form);
      } else {
        await api.post("/subcategories", form);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error("Failed to save subcategory:", err);
      alert(err?.response?.data?.message || "Failed to save subcategory");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      await api.delete(`/subcategories/${id}`);
      loadData();
    } catch (err) {
      console.error("Failed to delete subcategory:", err);
      alert(err?.response?.data?.message || "Failed to delete subcategory");
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Subcategories Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Map subcategories under main categories
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
        >
          + Add Subcategory
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          Loading subcategories...
        </div>
      ) : subcategories.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          No subcategories found. Click "+ Add Subcategory" to create one.
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs uppercase tracking-wider text-gray-600">
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Parent Category</th>
                <th className="p-4">Display Order</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {subcategories.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-gray-800">{sub.name}</td>
                  <td className="p-4 text-gray-500">{sub.slug}</td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      {sub.category?.name || "Unknown"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{sub.displayOrder ?? 0}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
                        sub.isActive ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    <span className="text-xs text-gray-600">
                      {sub.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenModal(sub)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="text-red-600 hover:text-red-800 font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {editingSubcategory ? "Edit Subcategory" : "Add Subcategory"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="e.g. Wooden Toys"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Parent Category *</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveSub"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="accent-orange-500 w-4 h-4"
                />
                <label htmlFor="isActiveSub" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
