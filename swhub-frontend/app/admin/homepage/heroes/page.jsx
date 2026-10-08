"use client";

import { useEffect, useState } from "react";
import HeroForm from "./HeroForm";
import {
  getHeroes,
  deleteHero,
} from "../../services/api/homepageHeroes";

export default function HeroesPage() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);

  const loadHeroes = async () => {
    try {
      setLoading(true);
      const data = await getHeroes();
      setHeroes(data || []);
    } catch (error) {
      console.error("Failed to load hero slides:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeroes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this hero slide?")) return;
    try {
      await deleteHero(id);
      loadHeroes();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete hero");
    }
  };

  const handleEdit = (hero) => {
    setSelectedHero(hero);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedHero(null);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Homepage Hero Slider</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage main rotating banners displayed at the top of the homepage
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
        >
          + Add Hero Slide
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          Loading hero slides...
        </div>
      ) : heroes.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          No hero slides configured yet. Click "+ Add Hero Slide" to create the first slide.
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs uppercase tracking-wider text-gray-600">
                <th className="p-4">Slide Preview</th>
                <th className="p-4">Title & Subtitle</th>
                <th className="p-4">Button Action</th>
                <th className="p-4">Order</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y text-sm">
              {heroes.map((hero) => (
                <tr key={hero.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <img
                      src={hero.desktopImage}
                      alt={hero.title || ""}
                      className="w-28 h-14 object-cover rounded-lg border shadow-xs"
                    />
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-gray-800">{hero.title}</p>
                    {hero.subtitle && (
                      <p className="text-xs text-gray-400 mt-0.5">{hero.subtitle}</p>
                    )}
                  </td>

                  <td className="p-4">
                    {hero.buttonText ? (
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {hero.buttonText} &rarr; {hero.buttonUrl || "#"}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </td>

                  <td className="p-4 text-gray-700 font-semibold">{hero.displayOrder}</td>

                  <td className="p-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        hero.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {hero.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleEdit(hero)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hero.id)}
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
        <HeroForm
          hero={selectedHero}
          onClose={() => setShowForm(false)}
          onSuccess={loadHeroes}
        />
      )}
    </div>
  );
}