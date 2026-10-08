"use client";

import { useEffect, useState } from "react";
import {
  getAdvertisements,
  deleteAdvertisement,
} from "@/app/admin/services/api/homepageAdvertisements";
import AdvertisementForm from "./AdvertisementForm";

export default function AdvertisementsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  const loadAds = async () => {
    try {
      setLoading(true);
      const data = await getAdvertisements();
      setAds(data || []);
    } catch (err) {
      console.error("Failed to load advertisements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return;
    try {
      await deleteAdvertisement(id);
      loadAds();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete advertisement");
    }
  };

  const handleEdit = (ad) => {
    setSelectedAd(ad);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedAd(null);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Homepage Advertisements</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage Wide Banners, Promo Strips, and marketing advertisements
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
        >
          + Add Advertisement
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          Loading advertisements...
        </div>
      ) : ads.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          No advertisements configured yet. Click "+ Add Advertisement" to create one.
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs uppercase tracking-wider text-gray-600">
                <th className="p-4">Banner Preview</th>
                <th className="p-4">Title</th>
                <th className="p-4">Placement Position</th>
                <th className="p-4">Redirect URL</th>
                <th className="p-4">Order</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y text-sm">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <img
                      src={ad.desktopImage}
                      alt={ad.title || ""}
                      className="h-14 w-28 object-cover rounded-lg border shadow-xs"
                    />
                  </td>

                  <td className="p-4 font-bold text-gray-800">
                    {ad.title || <span className="text-gray-400 italic">No Title</span>}
                  </td>

                  <td className="p-4">
                    <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold uppercase">
                      {ad.position}
                    </span>
                  </td>

                  <td className="p-4 text-xs text-gray-500 max-w-[180px] truncate">
                    {ad.redirectUrl || "-"}
                  </td>

                  <td className="p-4 text-gray-700 font-semibold">{ad.displayOrder}</td>

                  <td className="p-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        ad.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ad.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleEdit(ad)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
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

      {showForm && (
        <AdvertisementForm
          advertisement={selectedAd}
          onClose={() => setShowForm(false)}
          onSuccess={loadAds}
        />
      )}
    </div>
  );
}