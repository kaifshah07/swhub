"use client";

import { useEffect, useState } from "react";
import api from "../services/api/axios";
import {
  Tag,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  Calendar,
  Ticket,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "",
    expiresAt: "",
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    try {
      setLoading(true);
      const res = await api.get("/coupons");
      setCoupons(res.data.coupons || res.data.data || []);
    } catch (err) {
      console.error("Failed to load coupons:", err);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(coupon) {
    try {
      if (coupon.isActive) {
        await api.patch(`/coupons/${coupon.id}/deactivate`);
        toast.success(`Coupon ${coupon.code} deactivated`);
      } else {
        await api.patch(`/coupons/${coupon.id}/activate`);
        toast.success(`Coupon ${coupon.code} activated`);
      }
      loadCoupons();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to toggle status");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Coupon deleted");
      loadCoupons();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete coupon");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    if (!form.discountValue || Number(form.discountValue) <= 0) {
      toast.error("Please enter a valid discount amount");
      return;
    }

    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        description: form.description || null,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiresAt: form.expiresAt || null,
      };

      await api.post("/coupons", payload);
      toast.success("Coupon created successfully! 🎉");
      setShowModal(false);
      setForm({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minOrderAmount: "",
        maxDiscount: "",
        usageLimit: "",
        expiresAt: "",
      });
      loadCoupons();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create coupon");
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Promotional Coupons
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Create percentage or fixed discount coupon codes for checkout campaigns.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] active:scale-95"
        >
          <Plus size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* COUPONS TABLE */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading coupons...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 mb-3">
            <Ticket size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No active coupons</h3>
          <p className="mt-1 text-xs text-slate-400">
            Click "+ Create Coupon" to launch your first promotional discount.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4 pl-6">Coupon Code</th>
                  <th className="p-4">Discount Value</th>
                  <th className="p-4">Min Spend</th>
                  <th className="p-4">Redemptions</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition group">
                    <td className="p-4 pl-6">
                      <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                        {c.code}
                      </span>
                      {c.description && (
                        <p className="text-[11px] text-slate-400 mt-1 max-w-xs truncate">
                          {c.description}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-orange-600 text-sm">
                        {c.discountType === "PERCENTAGE"
                          ? `${c.discountValue}% OFF`
                          : `₹${c.discountValue} OFF`}
                      </span>
                      {c.maxDiscount && (
                        <span className="block text-[10px] text-slate-400">
                          Max Cap: ₹{c.maxDiscount}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-slate-700 font-semibold">
                      {c.minOrderAmount ? `₹${c.minOrderAmount}` : "No minimum"}
                    </td>

                    <td className="p-4 text-slate-600">
                      <strong>{c.usedCount ?? 0}</strong> / {c.usageLimit ?? "∞"}
                    </td>

                    <td className="p-4 text-slate-500">
                      {c.expiresAt ? (
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <Calendar size={12} className="text-slate-400" />
                          {new Date(c.expiresAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">No Expiry</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          c.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            c.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        <span>{c.isActive ? "Active" : "Disabled"}</span>
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          className="rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition"
                        >
                          {c.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Delete Coupon"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
              <h2 className="text-base font-black text-slate-900">
                Create Promotional Coupon
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g. SWHUB50"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-mono font-bold uppercase outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) =>
                      setForm({ ...form, discountType: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-orange-500 focus:bg-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.discountValue}
                    onChange={(e) =>
                      setForm({ ...form, discountValue: e.target.value })
                    }
                    placeholder="e.g. 20 (for 20% or ₹20)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) =>
                      setForm({ ...form, maxDiscount: e.target.value })
                    }
                    placeholder="Optional max cap"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Min Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) =>
                      setForm({ ...form, minOrderAmount: e.target.value })
                    }
                    placeholder="e.g. 499"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Usage Limit (Max Uses)
                  </label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) =>
                      setForm({ ...form, usageLimit: e.target.value })
                    }
                    placeholder="e.g. 100"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) =>
                    setForm({ ...form, expiresAt: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campaign Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="e.g. Festive discount on all kids toys"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none transition focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-orange-700 shadow-md shadow-orange-600/20"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
