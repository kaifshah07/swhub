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
  Printer,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  AlertCircle,
  ArrowRight,
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
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Shiprocket shipping state
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingActionMsg, setShippingActionMsg] = useState("");
  const [dimensions, setDimensions] = useState({
    weight: 0.5,
    length: 15,
    breadth: 12,
    height: 8,
  });
  const [availableCouriers, setAvailableCouriers] = useState([]);
  const [selectedCourierId, setSelectedCourierId] = useState(null);
  const [serviceabilityChecked, setServiceabilityChecked] = useState(false);
  const [copiedAwb, setCopiedAwb] = useState(false);

  // Reset shipping state when selecting a different order
  useEffect(() => {
    if (selectedOrder) {
      setAvailableCouriers([]);
      setSelectedCourierId(null);
      setServiceabilityChecked(false);
      setShippingActionMsg("");
      if (selectedOrder.shipment) {
        setDimensions({
          weight: Number(selectedOrder.shipment.weight) || 0.5,
          length: Number(selectedOrder.shipment.length) || 15,
          breadth: Number(selectedOrder.shipment.breadth) || 12,
          height: Number(selectedOrder.shipment.height) || 8,
        });
      }
    }
  }, [selectedOrder?.id]);

  async function handleCheckServiceability(orderId) {
    try {
      setShippingLoading(true);
      setShippingActionMsg("Checking courier serviceability & freight rates...");
      const res = await api.post(`/shipping/orders/${orderId}/serviceability`, dimensions);
      const data = res.data?.data;
      if (data?.availableCouriers) {
        setAvailableCouriers(data.availableCouriers);
        setServiceabilityChecked(true);
        if (data.recommendedCourierId) {
          setSelectedCourierId(data.recommendedCourierId);
        } else if (data.availableCouriers.length > 0) {
          setSelectedCourierId(data.availableCouriers[0].courier_company_id);
        }
        toast.success(`Found ${data.availableCouriers.length} available courier partners`);
      } else {
        toast.error("No serviceability data returned");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to check serviceability");
    } finally {
      setShippingLoading(false);
      setShippingActionMsg("");
    }
  }

  async function handleCreateShipment(orderId) {
    if (!selectedOrder) return;
    if (selectedOrder.paymentMethod === "ONLINE" && selectedOrder.paymentStatus !== "PAID") {
      toast.error("Online payment must be marked as PAID before dispatching");
      return;
    }

    try {
      setShippingLoading(true);
      setShippingActionMsg("Creating Shiprocket order and assigning courier...");
      const res = await api.post(`/shipping/orders/${orderId}/create`, {
        ...dimensions,
        courierId: selectedCourierId,
        autoAssignAwb: true,
      });

      toast.success(res.data?.message || "Shipment created successfully!");
      if (res.data?.shipment) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, shipment: res.data.shipment, orderStatus: "SHIPPED" } : null
        );
      }
      loadOrders();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to create shipment");
    } finally {
      setShippingLoading(false);
      setShippingActionMsg("");
    }
  }

  async function handleGenerateLabel(shipmentId) {
    try {
      setShippingLoading(true);
      setShippingActionMsg("Generating shipping label PDF...");
      const res = await api.post(`/shipping/shipments/${shipmentId}/label`);
      const labelUrl = res.data?.labelUrl;
      if (labelUrl) {
        toast.success("Shipping label generated!");
        window.open(labelUrl, "_blank");
        setSelectedOrder((prev) =>
          prev && prev.shipment ? { ...prev, shipment: { ...prev.shipment, labelUrl } } : prev
        );
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to generate label");
    } finally {
      setShippingLoading(false);
      setShippingActionMsg("");
    }
  }

  async function handleSchedulePickup(shipmentId) {
    try {
      setShippingLoading(true);
      setShippingActionMsg("Scheduling courier pickup with warehouse...");
      const res = await api.post(`/shipping/shipments/${shipmentId}/pickup`);
      toast.success(res.data?.message || "Pickup scheduled successfully!");
      if (res.data?.shipment) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, shipment: res.data.shipment } : null
        );
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to schedule pickup");
    } finally {
      setShippingLoading(false);
      setShippingActionMsg("");
    }
  }

  async function handleRefreshTracking(awbCode) {
    try {
      setShippingLoading(true);
      setShippingActionMsg("Fetching real-time tracking scans from Shiprocket...");
      const res = await api.get(`/shipping/track/${awbCode}`);
      toast.success("Tracking information updated");
      if (res.data?.shipment) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, shipment: res.data.shipment } : null
        );
      }
      loadOrders();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to refresh tracking");
    } finally {
      setShippingLoading(false);
      setShippingActionMsg("");
    }
  }

  function handleCopyAwb(code) {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedAwb(true);
    toast.success("AWB copied to clipboard");
    setTimeout(() => setCopiedAwb(false), 2000);
  }

  useEffect(() => {
    loadOrders();
  }, [statusFilter, paymentFilter]);

  async function loadOrders() {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "ALL") params.orderStatus = statusFilter;
      if (paymentFilter !== "ALL") params.paymentStatus = paymentFilter;
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

      {/* PAYMENT FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Payment:
        </span>
        {["ALL", ...paymentStatuses].map((pst) => (
          <button
            key={pst}
            onClick={() => setPaymentFilter(pst)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-bold transition ${
              paymentFilter === pst
                ? "bg-[#0000FF] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {pst === "ALL" ? "All Payments" : pst}
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
            placeholder="Search by order number (#ORD-...) or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadOrders()}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs outline-none transition focus:border-[#0000FF] focus:ring-2 focus:ring-[#0000FF]/20"
          />
        </div>
        <button
          onClick={loadOrders}
          className="rounded-2xl bg-gradient-to-r from-[#0000FF] to-[#0059FF] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
        >
          Search
        </button>
      </div>

      {/* ORDERS LIST / TABLE */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#0000FF] border-t-transparent mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0000FF] mb-3">
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
                            <option
                              key={st}
                              value={st}
                              disabled={
                                o.paymentMethod === "ONLINE" &&
                                o.paymentStatus !== "PAID" &&
                                (st === "SHIPPED" || st === "DELIVERED")
                              }
                              className="bg-white text-slate-800"
                            >
                              {st}
                              {o.paymentMethod === "ONLINE" &&
                              o.paymentStatus !== "PAID" &&
                              (st === "SHIPPED" || st === "DELIVERED")
                                ? " (Unpaid)"
                                : ""}
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
                        <option
                          key={st}
                          value={st}
                          disabled={
                            selectedOrder.paymentMethod === "ONLINE" &&
                            selectedOrder.paymentStatus !== "PAID" &&
                            (st === "SHIPPED" || st === "DELIVERED")
                          }
                        >
                          {st}
                          {selectedOrder.paymentMethod === "ONLINE" &&
                          selectedOrder.paymentStatus !== "PAID" &&
                          (st === "SHIPPED" || st === "DELIVERED")
                            ? " (Payment Required)"
                            : ""}
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
                      <option
                        key={pst}
                        value={pst}
                        disabled={
                          selectedOrder.paymentMethod === "ONLINE" &&
                          pst === "PAID" &&
                          selectedOrder.paymentStatus !== "PAID"
                        }
                      >
                        {pst}
                        {selectedOrder.paymentMethod === "ONLINE" &&
                        pst === "PAID" &&
                        selectedOrder.paymentStatus !== "PAID"
                          ? " (Gateway Required)"
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SHIPROCKET SHIPPING & COURIER DISPATCH */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Truck size={17} className="text-orange-600" />
                    <h3 className="font-bold text-slate-900 text-xs">
                      Shiprocket Courier & Delivery Management
                    </h3>
                  </div>

                  {selectedOrder.shipment?.status && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                      {selectedOrder.shipment.status.replace(/_/g, " ")}
                    </span>
                  )}
                </div>

                {selectedOrder.shipment ? (
                  /* ALREADY DISPATCHED / SHIPMENT CREATED */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Courier</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5">
                          {selectedOrder.shipment.courierName || "Shiprocket Partner"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">AWB Tracking Number</span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {selectedOrder.shipment.awbCode || "Pending"}
                          </span>
                          {selectedOrder.shipment.awbCode && (
                            <button
                              onClick={() => handleCopyAwb(selectedOrder.shipment.awbCode)}
                              className="text-orange-600 hover:text-orange-700 text-[11px] font-bold flex items-center gap-0.5"
                            >
                              {copiedAwb ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Delivery</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5">
                          {selectedOrder.shipment.etd || "3-5 Business Days"}
                        </p>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {selectedOrder.shipment.labelUrl ? (
                        <a
                          href={selectedOrder.shipment.labelUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                        >
                          <Printer size={13} />
                          <span>Print Label</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => handleGenerateLabel(selectedOrder.shipment.id)}
                          disabled={shippingLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition disabled:opacity-50"
                        >
                          <Printer size={13} />
                          <span>Generate Label</span>
                        </button>
                      )}

                      {!selectedOrder.shipment.pickupScheduledDate ? (
                        <button
                          onClick={() => handleSchedulePickup(selectedOrder.shipment.id)}
                          disabled={shippingLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition disabled:opacity-50"
                        >
                          <Calendar size={13} />
                          <span>Schedule Pickup</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                          <CheckCircle2 size={12} />
                          <span>Pickup Scheduled ({selectedOrder.shipment.pickupTokenNumber || "Confirmed"})</span>
                        </span>
                      )}

                      {selectedOrder.shipment.awbCode && (
                        <button
                          onClick={() => handleRefreshTracking(selectedOrder.shipment.awbCode)}
                          disabled={shippingLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition disabled:opacity-50"
                        >
                          <RefreshCw size={12} className={shippingLoading ? "animate-spin" : ""} />
                          <span>Sync Status</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* NO SHIPMENT YET - DISPATCH FORM */
                  <div className="space-y-3">
                    {selectedOrder.paymentMethod === "ONLINE" && selectedOrder.paymentStatus !== "PAID" && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                        <AlertCircle size={14} className="shrink-0 text-amber-600" />
                        <span>This is a prepaid order. Confirm payment (Status: PAID) before dispatching courier.</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={dimensions.weight}
                          onChange={(e) => setDimensions({ ...dimensions, weight: Number(e.target.value) })}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Length (cm)</label>
                        <input
                          type="number"
                          value={dimensions.length}
                          onChange={(e) => setDimensions({ ...dimensions, length: Number(e.target.value) })}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Width (cm)</label>
                        <input
                          type="number"
                          value={dimensions.breadth}
                          onChange={(e) => setDimensions({ ...dimensions, breadth: Number(e.target.value) })}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Height (cm)</label>
                        <input
                          type="number"
                          value={dimensions.height}
                          onChange={(e) => setDimensions({ ...dimensions, height: Number(e.target.value) })}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleCheckServiceability(selectedOrder.id)}
                        disabled={shippingLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition disabled:opacity-50"
                      >
                        <Truck size={13} />
                        <span>Check Courier Rates</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCreateShipment(selectedOrder.id)}
                        disabled={shippingLoading || (selectedOrder.paymentMethod === "ONLINE" && selectedOrder.paymentStatus !== "PAID")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition shadow-sm disabled:opacity-50"
                      >
                        <ArrowRight size={13} />
                        <span>Dispatch via Shiprocket</span>
                      </button>
                    </div>

                    {shippingLoading && shippingActionMsg && (
                      <p className="text-[11px] font-semibold text-orange-600 animate-pulse">
                        {shippingActionMsg}
                      </p>
                    )}

                    {/* AVAILABLE COURIERS LIST */}
                    {serviceabilityChecked && availableCouriers.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        <span className="block text-[11px] font-bold text-slate-700">
                          Select Preferred Courier Partner:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                          {availableCouriers.map((c) => (
                            <label
                              key={c.courier_company_id}
                              className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition text-xs ${
                                selectedCourierId === c.courier_company_id
                                  ? "border-orange-500 bg-orange-50/60 font-bold"
                                  : "border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="selectedCourier"
                                  checked={selectedCourierId === c.courier_company_id}
                                  onChange={() => setSelectedCourierId(c.courier_company_id)}
                                  className="text-orange-600"
                                />
                                <div>
                                  <p className="font-bold text-slate-800 text-[11px]">{c.courier_name}</p>
                                  <p className="text-[10px] text-slate-400">ETD: {c.etd || "2-4 days"}</p>
                                </div>
                              </div>
                              <span className="font-black text-slate-900 text-xs">
                                ₹{Number(c.rate).toFixed(0)}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CUSTOMER & SHIPPING CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200/80 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                    <User size={15} className="text-[#0000FF]" />
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
                  <span className="text-[#0000FF] text-lg font-black">
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
