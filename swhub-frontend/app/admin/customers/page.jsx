"use client";

import { useEffect, useState } from "react";
import api from "../services/api/axios";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);
      const res = await api.get("/customers", {
        params: search ? { search } : {},
      });
      setCustomers(res.data.customers || res.data.data || []);
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleBlock(customer) {
    const action = customer.isBlocked ? "unblock" : "block";
    if (!confirm(`Are you sure you want to ${action} ${customer.name}?`)) return;

    try {
      if (customer.isBlocked) {
        await api.patch(`/customers/${customer.id}/unblock`);
      } else {
        await api.patch(`/customers/${customer.id}/block`);
      }
      loadCustomers();
    } catch (err) {
      alert(err?.response?.data?.message || `Failed to ${action} customer`);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this customer account?")) return;
    try {
      await api.delete(`/customers/${id}`);
      loadCustomers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete customer");
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customers Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Registered customer accounts and account statuses
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by customer name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadCustomers()}
          className="bg-white border rounded-lg px-4 py-2 text-sm flex-1 focus:ring-2 focus:ring-orange-500 outline-none"
        />
        <button
          onClick={loadCustomers}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          Loading customers...
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          No customer accounts found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs uppercase tracking-wider text-gray-600">
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email Verification</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </td>
                  <td className="p-4 text-gray-700">{c.phone || "-"}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        c.isVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {c.isVerified ? "Verified" : "Pending OTP"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        c.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {c.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleBlock(c)}
                      className={`font-medium mr-4 transition ${
                        c.isBlocked
                          ? "text-green-600 hover:text-green-800"
                          : "text-amber-600 hover:text-amber-800"
                      }`}
                    >
                      {c.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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
    </div>
  );
}
