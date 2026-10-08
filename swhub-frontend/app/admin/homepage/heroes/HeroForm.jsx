"use client";

import { useState, useEffect } from "react";
import {
  createHero,
  updateHero,
} from "../../services/api/homepageHeroes";

export default function HeroForm({
  hero = null,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonUrl: "",
    displayOrder: 0,
    isActive: true,
    desktopImage: null,
    mobileImage: null,
  });

  useEffect(() => {
    if (hero) {
      setForm({
        title: hero.title || "",
        subtitle: hero.subtitle || "",
        buttonText: hero.buttonText || "",
        buttonUrl: hero.buttonUrl || "",
        displayOrder: hero.displayOrder || 0,
        isActive: hero.isActive ?? true,
        desktopImage: null,
        mobileImage: null,
      });
    } else {
      setForm({
        title: "",
        subtitle: "",
        buttonText: "Shop Now",
        buttonUrl: "/products",
        displayOrder: 0,
        isActive: true,
        desktopImage: null,
        mobileImage: null,
      });
    }
  }, [hero]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", form.title);
      if (form.subtitle) data.append("subtitle", form.subtitle);
      if (form.buttonText) data.append("buttonText", form.buttonText);
      if (form.buttonUrl) data.append("buttonUrl", form.buttonUrl);
      data.append("displayOrder", String(form.displayOrder));
      data.append("isActive", String(form.isActive));

      if (form.desktopImage) {
        data.append("desktopImage", form.desktopImage);
      }
      if (form.mobileImage) {
        data.append("mobileImage", form.mobileImage);
      }

      if (hero) {
        await updateHero(hero.id, data);
      } else {
        if (!form.desktopImage) {
          alert("Please upload a hero desktop banner image");
          setLoading(false);
          return;
        }
        await createHero(data);
      }

      onSuccess();
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save hero slide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">
            {hero ? "Edit Hero Slide" : "Add Hero Slide"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Slide Title *</label>
          <input
            placeholder="e.g. Trendy Kids Clothing & Fashion"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Subtitle / Tagline</label>
          <input
            placeholder="e.g. Up to 60% off on baby essentials"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="border p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Button Text</label>
            <input
              placeholder="e.g. Shop Now"
              value={form.buttonText}
              onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
              className="border p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Button URL</label>
            <input
              placeholder="e.g. /products?type=featured"
              value={form.buttonUrl}
              onChange={(e) => setForm({ ...form, buttonUrl: e.target.value })}
              className="border p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Display Order (Sorting)</label>
          <input
            type="number"
            placeholder="0"
            value={form.displayOrder}
            onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
            className="border p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Desktop Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, desktopImage: e.target.files[0] })}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
          />
          {hero?.desktopImage && !form.desktopImage && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Current:</span>
              <img
                src={hero.desktopImage}
                alt=""
                className="h-10 w-20 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Mobile Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, mobileImage: e.target.files[0] })}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="heroActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="accent-orange-500 w-4 h-4"
          />
          <label htmlFor="heroActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
            Active in Slider
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg text-sm shadow transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Hero Slide"}
          </button>
        </div>
      </form>
    </div>
  );
}