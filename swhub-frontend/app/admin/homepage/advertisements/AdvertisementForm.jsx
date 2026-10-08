"use client";

import { useEffect, useState } from "react";
import {
  createAdvertisement,
  updateAdvertisement,
} from "@/app/admin/services/api/homepageAdvertisements";

export default function AdvertisementForm({
  advertisement = null,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    position: "wide_banner",
    redirectUrl: "",
    displayOrder: 0,
    isActive: true,
    desktopImage: null,
    mobileImage: null,
  });

  useEffect(() => {
    if (advertisement) {
      setForm({
        title: advertisement.title || "",
        position: advertisement.position || "wide_banner",
        redirectUrl: advertisement.redirectUrl || "",
        displayOrder: advertisement.displayOrder || 0,
        isActive: advertisement.isActive ?? true,
        desktopImage: null,
        mobileImage: null,
      });
    } else {
      setForm({
        title: "",
        position: "wide_banner",
        redirectUrl: "",
        displayOrder: 0,
        isActive: true,
        desktopImage: null,
        mobileImage: null,
      });
    }
  }, [advertisement]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = new FormData();
      if (form.title) data.append("title", form.title);
      data.append("position", form.position);
      if (form.redirectUrl) data.append("redirectUrl", form.redirectUrl);
      data.append("displayOrder", String(form.displayOrder));
      data.append("isActive", String(form.isActive));

      if (form.desktopImage) {
        data.append("desktopImage", form.desktopImage);
      }
      if (form.mobileImage) {
        data.append("mobileImage", form.mobileImage);
      }

      if (advertisement) {
        await updateAdvertisement(advertisement.id, data);
      } else {
        if (!form.desktopImage) {
          alert("Please upload a desktop banner image");
          setLoading(false);
          return;
        }
        await createAdvertisement(data);
      }

      onSuccess();
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save advertisement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl w-full max-w-lg space-y-4 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">
            {advertisement ? "Edit Advertisement" : "Add Advertisement"}
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
          <label className="block text-xs font-semibold mb-1">Banner Title</label>
          <input
            placeholder="e.g. Mega Kids Weekend Sale"
            value={form.title}
            className="border p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Position / Placement *</label>
          <select
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="border p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="wide_banner">Wide Banner (Full Width)</option>
            <option value="banner_strip_1">Banner Strip 1 (Upper Strip)</option>
            <option value="banner_strip_2">Banner Strip 2 (Lower Strip)</option>
            <option value="banner_strip">General Banner Strip</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Redirect URL</label>
          <input
            placeholder="e.g. /products?type=flash-sale or /categories/toys"
            value={form.redirectUrl}
            className="border p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Display Order (Sorting)</label>
          <input
            type="number"
            value={form.displayOrder}
            placeholder="0"
            className="border p-2.5 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Desktop Image *</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
            onChange={(e) => setForm({ ...form, desktopImage: e.target.files[0] })}
          />
          {advertisement?.desktopImage && !form.desktopImage && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Current:</span>
              <img
                src={advertisement.desktopImage}
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
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
            onChange={(e) => setForm({ ...form, mobileImage: e.target.files[0] })}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="adActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="accent-orange-500 w-4 h-4"
          />
          <label htmlFor="adActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
            Active on Homepage
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
            {loading ? "Saving..." : "Save Advertisement"}
          </button>
        </div>
      </form>
    </div>
  );
}