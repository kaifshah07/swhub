"use client";

import { useEffect, useState } from "react";
import api from "../../services/api/axios";

export default function ProductSectionManager({
  sectionKey,
  title,
}) {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [sectionKey]);

  async function loadData() {
    try {
      setLoading(true);
      const [allProductsRes, sectionProductsRes] = await Promise.all([
        api.get("/admin/products"),
        api.get(`/homepage/products/${sectionKey}`),
      ]);

      const allProds = allProductsRes.data.data || [];
      const sectionProds = sectionProductsRes.data.data || [];

      setProducts(allProds);
      setSelected(sectionProds.map((p) => p.id));
    } catch (err) {
      console.error("Failed to load section products:", err);
    } finally {
      setLoading(false);
    }
  }

  async function saveSection() {
    try {
      setSaving(true);
      await api.put(`/homepage/products/${sectionKey}`, {
        type: sectionKey,
        productIds: selected,
      });
      alert(`${title} updated successfully!`);
    } catch (err) {
      console.error("Failed to save section:", err);
      alert("Error saving section products.");
    } finally {
      setSaving(false);
    }
  }

  const toggleProduct = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Selected: {selected.length} products
          </p>
        </div>

        <button
          onClick={saveSection}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Selection"}
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border text-center text-gray-500">
          No products available. Please create products in the Products menu first.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const isChecked = selected.includes(product.id);
            return (
              <label
                key={product.id}
                className={`border p-4 rounded-xl flex items-center gap-4 cursor-pointer transition ${
                  isChecked
                    ? "border-orange-500 bg-orange-50/50 shadow-sm"
                    : "bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleProduct(product.id)}
                  className="w-5 h-5 accent-orange-500 rounded"
                />

                {product.thumbnail && (
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg border"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ₹{product.discountPrice ?? product.price} | Stock: {product.stock}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}