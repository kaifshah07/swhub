"use client";

import { useEffect, useState } from "react";
import api from "../services/api/axios";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Trash2,
  CreditCard,
  Banknote,
  X,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  Ticket,
} from "lucide-react";
import { productImageUrl } from "@/lib/api";
import toast from "react-hot-toast";

const orderStatuses = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  async function loadOrders() {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "ALL") params.orderStatus = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get("/orders", { params });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(orderId, newStatus) {
    try {
      await api.patch(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order #${orderId} marked as ${newStatus}`);
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update order status");
    }
  }

  async function handleUpdatePayment(orderId, newPaymentStatus) {
    try {
      await api.patch(`/orders/${orderId}/payment`, {
        paymentStatus: newPaymentStatus,
      });
      toast.success(`Payment updated to ${newPaymentStatus}`);
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, paymentStatus: newPaymentStatus } : null
        );
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update payment");
    }
  }

  async function handleDelete(orderId) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await api.delete(`/orders/${orderId}`);
      toast.success("Order deleted");
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete order");
    }
  }

  function getStatusBadge(status) {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PACKED":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "SHIPPED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Orders Management
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Monitor incoming sales, update fulfillment stages, and verify customer payments.
          </p>
        </div>
      </div>

      {/* STATUS FILTER TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {orderStatuses.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition ${
              statusFilter === st
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            {st === "ALL" ? "All Orders" : st}
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-3.5 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by order number (#BAL-...) or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadOrders()}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
        <button
          onClick={loadOrders}
          className="rounded-2xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-700 transition"
        >
          Search
        </button>
      </div>

      {/* ORDERS LIST / TABLE */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 mb-3">
            <ShoppingBag size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No orders found</h3>
          <p className="mt-1 text-xs text-slate-400">
            {statusFilter !== "ALL"
              ? `No orders matching status "${statusFilter}"`
              : "No customer orders placed yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4 pl-6">Order ID & Date</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60 transition group">
                    {/* ORDER NUMBER & DATE */}
                    <td className="p-4 pl-6">
                      <p className="font-mono font-black text-slate-900 text-xs">
                        #{o.orderNumber || o.id}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    {/* CUSTOMER INFO */}
                    <td className="p-4">
                      <p className="font-bold text-slate-900">
                        {o.customer?.name || "Guest Customer"}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {o.customer?.email || o.customer?.phone || "-"}
                      </p>
                    </td>

                    {/* TOTAL */}
                    <td className="p-4">
                      <span className="font-black text-slate-900 text-sm">
                        ₹{Number(o.totalAmount).toFixed(0)}
                      </span>
                      {o.couponCode && (
                        <span className="block text-[10px] text-emerald-600 font-bold">
                          Code: {o.couponCode}
                        </span>
                      )}
                    </td>

                    {/* PAYMENT METHOD & STATUS */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          {o.paymentMethod === "ONLINE" ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                              <CreditCard size={11} />
                              Online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                              <Banknote size={11} />
                              COD
                            </span>
                          )}

                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              o.paymentStatus === "PAID"
                                ? "bg-emerald-50 text-emerald-700"
                                : o.paymentStatus === "FAILED"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {o.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ORDER STATUS DROPDOWN */}
                    <td className="p-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-bold outline-none transition cursor-pointer ${getStatusBadge(
                          o.orderStatus
                        )}`}
                      >
                        {orderStatuses
                          .filter((s) => s !== "ALL")
                          .map((st) => (
                            <option key={st} value={st} className="bg-white text-slate-800">
                              {st}
                            </option>
                          ))}
                      </select>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition"
                        >
                          <Eye size={14} />
                          <span>Details</span>
                        </button>

                        <button
                          onClick={() => handleDelete(o.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Delete Order"
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

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl my-8">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Order Details #{selectedOrder.orderNumber || selectedOrder.id}
                </h2>
                <p className="text-[11px] text-slate-400">
                  Placed on{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
              {/* STATUS MANAGERS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Update Fulfillment Status:
                  </label>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder.id, e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800 outline-none"
                  >
                    {orderStatuses
                      .filter((s) => s !== "ALL")
                      .map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Update Payment Status:
                  </label>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) =>
                      handleUpdatePayment(selectedOrder.id, e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800 outline-none"
                  >
                    {paymentStatuses.map((pst) => (
                      <option key={pst} value={pst}>
                        {pst}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CUSTOMER & SHIPPING CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200/80 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                    <User size={15} className="text-orange-500" />
                    <span>Customer Information</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedOrder.customer?.name || "Guest"}
                  </p>
                  <p className="text-slate-500 flex items-center gap-1.5">
                    <Mail size={12} />
                    {selectedOrder.customer?.email || "-"}
                  </p>
                  <p className="text-slate-500 flex items-center gap-1.5">
                    <Phone size={12} />
                    {selectedOrder.customer?.phone || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                    <MapPin size={15} className="text-emerald-600" />
                    <span>Delivery Address</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {selectedOrder.address}
                  </p>
                </div>
              </div>

              {/* ORDER ITEMS LIST */}
              <div>
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Package size={15} className="text-slate-500" />
                  <span>Purchased Items ({(selectedOrder.items || []).length})</span>
                </h3>

                <div className="rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
                  {(selectedOrder.items || []).map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.product?.thumbnail ? (
                            <img
                              src={productImageUrl(item.product.thumbnail)}
                              alt=""
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <Package size={18} className="text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {item.product?.name || `Product #${item.productId}`}
                          </p>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            Qty: <strong className="text-slate-700">{item.quantity}</strong> × ₹{Number(item.price).toFixed(0)}
                          </p>
                        </div>
                      </div>

                      <span className="font-black text-slate-900 text-sm">
                        ₹{(Number(item.price) * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTALS BREAKDOWN */}
              <div className="rounded-2xl bg-slate-50 p-4 space-y-2 border border-slate-100">
                {selectedOrder.couponCode && (
                  <div className="flex justify-between items-center text-emerald-700 font-bold">
                    <span className="flex items-center gap-1">
                      <Ticket size={13} />
                      Coupon Applied: {selectedOrder.couponCode}
                    </span>
                    <span>Discount Applied</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-600">
                  <span>Payment Method</span>
                  <span className="font-bold text-slate-900">
                    {selectedOrder.paymentMethod}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-orange-600 text-lg">
                    ₹{Number(selectedOrder.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end p-4 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
