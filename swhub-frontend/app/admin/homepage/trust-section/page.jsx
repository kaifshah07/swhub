"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Truck, RotateCcw, Award, Lock, Sparkles, HeartHandshake, Plus, Edit3, Trash2, X } from "lucide-react";
import api from "../../services/api/axios";
import toast from "react-hot-toast";

// Icon mapping to allow admin to select icons by string name
const iconMap = {
  Truck,
  Lock,
  RotateCcw,
  Award,
  HeartHandshake,
  ShieldCheck,
  Sparkles
};

export default function TrustSectionAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", icon: "ShieldCheck", displayOrder: 0, isActive: true });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setLoading(true);
      const res = await api.get("/admin/homepage/trust-features");
      setItems(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load trust features");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(item = null) {
    if (item) {
      setEditingItem(item);
      setForm({ title: item.title, description: item.description, icon: item.icon, displayOrder: item.displayOrder, isActive: item.isActive });
    } else {
      setEditingItem(null);
      setForm({ title: "", description: "", icon: "ShieldCheck", displayOrder: 0, isActive: true });
    }
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/admin/homepage/trust-features/${editingItem.id}`, form);
        toast.success("Updated successfully");
      } else {
        await api.post("/admin/homepage/trust-features", form);
        toast.success("Created successfully");
      }
      setShowModal(false);
      loadItems();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this trust feature?")) return;
    try {
      await api.delete(`/admin/homepage/trust-features/${id}`);
      toast.success("Deleted");
      loadItems();
    } catch (err) {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Trust & Credibility Section</h1>
          <p className="mt-1 text-sm text-gray-500">
            Parent reassurance badges displayed across the homepage to drive buyer confidence.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-orange-700"
        >
          <Plus size={16} /> Add Feature
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-dashed">
          <p className="text-gray-500">No trust features configured. Add one!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const Icon = iconMap[item.icon] || Sparkles;
            return (
              <div key={item.id} className="relative rounded-3xl border border-gray-200 bg-white p-6 shadow-sm flex items-start gap-4 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  <span className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {item.isActive ? "Displayed" : "Hidden"}
                  </span>
                </div>
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
                  <button onClick={() => handleOpenModal(item)} className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="font-bold">{editingItem ? "Edit Feature" : "Add Feature"}</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block font-bold mb-1 text-xs">Title</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs" />
              </div>
              <div>
                <label className="block font-bold mb-1 text-xs">Description</label>
                <input required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs" />
              </div>
              <div>
                <label className="block font-bold mb-1 text-xs">Select Icon</label>
                <select value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full border rounded-xl p-2.5 text-xs">
                  {Object.keys(iconMap).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} id="active" />
                <label htmlFor="active" className="text-xs font-bold">Is Active</label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-orange-600 text-white rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}