"use client";

import { useEffect, useState } from "react";
import api from "../services/api/axios";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    websiteName: "SW Hub",
    email: "contact@swhub.com",
    phone: "+91 9876543210",
    address: "Mumbai, Maharashtra, India",
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    footerText: "SW Hub - Daily Needs & Household Marketplace. All rights reserved.",
    seoTitle: "SW Hub | Daily Needs, Groceries & Household Marketplace",
    seoDescription: "Shop daily groceries, beverages, kitchenware, cleaning supplies, and personal care essentials at SW Hub.",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const res = await api.get("/settings");
      if (res.data.data) {
        setForm((prev) => ({ ...prev, ...res.data.data }));
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put("/settings", form);
      alert("Settings updated successfully!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Website Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Store contact information, SEO metadata, and social profiles
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          Loading settings...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-8 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">General Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Store / Website Name *</label>
                <input
                  type="text"
                  required
                  value={form.websiteName}
                  onChange={(e) => setForm({ ...form, websiteName: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Support Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Contact Phone *</label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Physical Address *</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={form.instagram || ""}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="https://instagram.com/swhub"
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={form.facebook || ""}
                  onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                  placeholder="https://facebook.com/swhub"
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">YouTube URL</label>
                <input
                  type="url"
                  value={form.youtube || ""}
                  onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                  placeholder="https://youtube.com/@swhub"
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={form.linkedin || ""}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/swhub"
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">SEO & Footer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Default SEO Meta Title</label>
                <input
                  type="text"
                  value={form.seoTitle || ""}
                  onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Default SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={form.seoDescription || ""}
                  onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Footer Copyright Text</label>
                <input
                  type="text"
                  value={form.footerText || ""}
                  onChange={(e) => setForm({ ...form, footerText: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl shadow transition disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Settings"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
