"use client";

import { useState, useEffect } from "react";
import { API_URL, productImageUrl } from "@/lib/api";
import toast from "react-hot-toast";
import { Package } from "lucide-react";

export default function FranchiseInventory() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const token = localStorage.getItem("franchiseToken");
      const res = await fetch(`${API_URL}/franchise-inventory/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStock(data.data);
      }
    } catch (error) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Package /> Local Inventory</h1>
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Product</th>
                <th className="p-4 text-sm font-semibold text-gray-600">SKU</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Stock Quantity</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {stock.map(s => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                        {s.product.thumbnail && <img src={productImageUrl(s.product.thumbnail)} className="w-full h-full object-cover" />}
                      </div>
                      <span className="font-medium text-sm">{s.product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{s.product.sku}</td>
                  <td className="p-4 text-sm font-bold">{s.quantity}</td>
                  <td className="p-4">
                    {s.quantity === 0 ? <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Out of Stock</span> : 
                     s.quantity < 10 ? <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Low Stock</span> :
                     <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">In Stock</span>}
                  </td>
                </tr>
              ))}
              {stock.length === 0 && (
                <tr><td colSpan="4" className="p-6 text-center text-gray-500">No inventory found. Place a B2B order to restock.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
