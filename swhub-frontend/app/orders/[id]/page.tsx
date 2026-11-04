"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  Receipt,
  CheckCircle2,
  Circle,
  CreditCard,
  XCircle,
  Clock,
  Truck,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { API_URL } from "@/lib/api";
import toast from "react-hot-toast";
import loadRazorpay from "@/lib/loadRazorpay";

type Product = {
  id: number;
  name: string;
  thumbnail?: string | null;
};

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number | string;
  product?: Product;
};

type Shipment = {
  id: number;
  orderId: number;
  shiprocketOrderId?: string | null;
  shipmentId?: string | null;
  awbCode?: string | null;
  courierCompanyId?: number | null;
  courierName?: string | null;
  status: string;
  statusDescription?: string | null;
  pickupScheduledDate?: string | null;
  pickupTokenNumber?: string | null;
  etd?: string | null;
  labelUrl?: string | null;
  manifestUrl?: string | null;
  routingCode?: string | null;
  trackingHistory?: any;
  lastTrackedAt?: string | null;
};

type Order = {
  id: number;
  orderNumber: string;
  totalAmount: number | string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  address: string;
  createdAt: string;
  items: OrderItem[];
  shipment?: Shipment | null;
};

const statusSteps = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);

  function handleCopyAwb(code: string) {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedAwb(true);
    toast.success("Tracking number copied to clipboard!");
    setTimeout(() => setCopiedAwb(false), 2500);
  }

  async function handleRefreshTracking() {
    if (!order?.shipment?.awbCode) return;
    try {
      setTrackingLoading(true);
      const token = localStorage.getItem("customer_token");
      const res = await fetch(`${API_URL}/shipping/track/${order.shipment.awbCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.shipment) {
        setOrder((prev) => (prev ? { ...prev, shipment: data.shipment } : null));
        toast.success("Tracking status refreshed");
      } else {
        toast.error(data.message || "Failed to update tracking");
      }
    } catch (err: any) {
      toast.error(err.message || "Unable to refresh tracking");
    } finally {
      setTrackingLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    try {
      const token = localStorage.getItem("customer_token");
      if (!token) {
        router.replace("/login");
        return;
      }
      const orderId = params.id;
      if (!orderId) throw new Error("Invalid order ID");

      const response = await fetch(`${API_URL}/orders/my-orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("customer_token");
        localStorage.removeItem("customer");
        router.replace("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Order not found");
      }

      setOrder(result.data);
    } catch (error: any) {
      setError(error?.message || "Unable to load order details");
    } finally {
      setLoading(false);
    }
  }

  async function handleRetryPayment() {
    if (!order) return;
    const token = localStorage.getItem("customer_token");
    if (!token) {
      toast.error("Please login to proceed with payment");
      router.push("/login");
      return;
    }

    try {
      setActionLoading(true);

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Unable to load Razorpay checkout SDK. Please check your internet connection.");
      }

      const res = await fetch(`${API_URL}/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: order.id }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to initialize payment");
      }

      const { paymentId, razorpayOrderId, amount, currency, key } = json.data;

      const options = {
        key,
        amount,
        currency: currency || "INR",
        name: "SW Hub",
        description: `Order #${order.orderNumber}`,
        order_id: razorpayOrderId,
        theme: {
          color: "#0EA5E9",
        },
        handler: async function (response: any) {
          try {
            toast.loading("Verifying payment...", { id: "verify-toast" });

            const verifyRes = await fetch(`${API_URL}/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                paymentId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyJson = await verifyRes.json();
            toast.dismiss("verify-toast");

            if (verifyJson.success) {
              toast.success("Payment verified! Order confirmed! 🎉");
              loadOrder();
            } else {
              toast.error(verifyJson.message || "Payment verification failed");
              loadOrder();
            }
          } catch (err: any) {
            toast.dismiss("verify-toast");
            toast.error(err.message || "Verification error");
          }
        },
        modal: {
          ondismiss: function () {
            toast("Payment window closed.", { icon: "ℹ️" });
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate payment retry");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancelOrder() {
    if (!order) return;
    if (!confirm("Are you sure you want to cancel this order? Reserved items will be restored to inventory.")) {
      return;
    }

    const token = localStorage.getItem("customer_token");
    if (!token) return;

    try {
      setActionLoading(true);
      const res = await fetch(`${API_URL}/orders/my-orders/${order.id}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to cancel order");
      }

      toast.success("Order cancelled successfully");
      loadOrder();
    } catch (err: any) {
      toast.error(err.message || "Unable to cancel order");
    } finally {
      setActionLoading(false);
    }
  }

  function formatDateTime(date: string) {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED":
        return "bg-red-50 text-red-600 border-red-200";
      case "SHIPPED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "PACKED":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  }

  function getCurrentStep() {
    if (!order || order.orderStatus === "CANCELLED") return -1;
    return statusSteps.indexOf(order.orderStatus);
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-black/5 max-w-md w-full">
          <div className="text-5xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-slate-800">Order not found</h1>
          <p className="mt-2 text-slate-500">{error || "We couldn't find this order."}</p>
          <Link
            href="/orders"
            className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-bold text-white transition hover:bg-orange-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStep();
  const isOnlinePending =
    order.paymentMethod === "ONLINE" &&
    order.paymentStatus === "PENDING" &&
    order.orderStatus !== "CANCELLED";
  const canCancel = order.orderStatus === "PENDING";

  return (
    <div className="min-h-[80vh] bg-slate-50 px-4 py-10 font-sans">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>

        {/* PENDING PAYMENT ALERT STRIP */}
        {isOnlinePending && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-900 text-sm">Payment Pending</h3>
                <p className="text-xs text-amber-700 mt-0.5">
                  Complete your online payment to confirm this order and dispatch items.
                </p>
              </div>
            </div>
            <button
              onClick={handleRetryPayment}
              disabled={actionLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition shrink-0 disabled:opacity-50"
            >
              <CreditCard size={15} />
              <span>{actionLoading ? "Processing..." : "Complete Payment Now"}</span>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Order #{order.orderNumber}
            </h1>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl border ${getStatusStyle(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </span>

            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
              >
                <XCircle size={14} />
                <span>Cancel Order</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Tracking and Items (Left Column) */}
          <div className="md:col-span-2 space-y-8">
            {/* COURIER DELIVERY & LIVE TRACKING CARD */}
            {order.shipment && (
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80 overflow-hidden relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-orange-600">
                      <Truck size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-black text-slate-900">
                          {order.shipment.courierName || "Courier Delivery Partner"}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {order.shipment.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {order.shipment.statusDescription || "Dispatched via Shiprocket delivery network"}
                      </p>
                    </div>
                  </div>

                  {order.shipment.awbCode && (
                    <button
                      onClick={handleRefreshTracking}
                      disabled={trackingLoading}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition disabled:opacity-50 self-start sm:self-auto"
                      title="Refresh live courier tracking"
                    >
                      <RefreshCw size={13} className={trackingLoading ? "animate-spin" : ""} />
                      <span>{trackingLoading ? "Updating..." : "Refresh"}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {/* AWB Code */}
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tracking Number (AWB)
                    </span>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="font-mono font-bold text-sm text-slate-900 tracking-wider">
                        {order.shipment.awbCode || "Processing..."}
                      </span>
                      {order.shipment.awbCode && (
                        <button
                          onClick={() => handleCopyAwb(order.shipment?.awbCode || "")}
                          className="flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 transition"
                          title="Copy AWB number"
                        >
                          {copiedAwb ? (
                            <>
                              <Check size={13} className="text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Estimated Delivery
                    </span>
                    <p className="font-bold text-sm text-slate-900 mt-1.5">
                      {order.shipment.etd || "3 - 5 Business Days"}
                    </p>
                  </div>
                </div>

                {/* Tracking Milestones from Shiprocket Scans */}
                {Array.isArray(order.shipment.trackingHistory) && order.shipment.trackingHistory.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                      Courier Activity History
                    </h3>
                    <div className="space-y-3 relative pl-4 border-l-2 border-slate-100 ml-1">
                      {order.shipment.trackingHistory.slice(-4).reverse().map((scan: any, sIdx: number) => (
                        <div key={sIdx} className="relative">
                          <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-orange-500 ring-4 ring-white" />
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              {scan.activity || scan.status}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {scan.location ? `${scan.location} • ` : ""}{scan.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tracking Tracker */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80">
              <h2 className="text-lg font-black text-slate-900 mb-6">Order Tracking</h2>
              {order.orderStatus === "CANCELLED" ? (
                <div className="rounded-2xl bg-red-50 p-5 text-red-700 border border-red-200">
                  <p className="font-bold text-sm mb-1">Order Cancelled</p>
                  <p className="text-xs text-red-600">
                    This order has been cancelled and will not be delivered. Reserved stock was restored.
                  </p>
                </div>
              ) : (
                <div className="relative pl-4 border-l-2 border-slate-100 space-y-6 ml-2">
                  {statusSteps.map((status, idx) => {
                    const completed = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={status} className="relative">
                        <div className="absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-white ring-4 ring-white">
                          {completed ? (
                            <CheckCircle2
                              className="w-6 h-6 text-emerald-600"
                              fill="currentColor"
                              stroke="white"
                            />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 fill-white" />
                          )}
                        </div>
                        <div className="pl-4">
                          <h3
                            className={`font-bold text-xs uppercase tracking-wider ${
                              completed ? "text-slate-900" : "text-slate-400"
                            }`}
                          >
                            {status}
                          </h3>
                          {isCurrent && (
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                              {status === "PENDING"
                                ? "Awaiting confirmation and payment verification."
                                : status === "CONFIRMED"
                                ? "Order verified and sent to warehouse."
                                : status === "PACKED"
                                ? "Items securely packed and prepared for pickup."
                                : status === "SHIPPED"
                                ? "Package in transit with delivery partner."
                                : "Order safely delivered to your doorstep."}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-700" />
                <span>Items in this Order ({order.items.length})</span>
              </h2>
              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                        {item.product?.thumbnail ? (
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <Package size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-bold text-xs text-slate-800 hover:text-orange-600 transition line-clamp-1"
                        >
                          {item.product?.name || `Product #${item.productId}`}
                        </Link>
                        <p className="mt-0.5 text-[11px] text-slate-500 font-medium">
                          Qty: <strong className="text-slate-700">{item.quantity}</strong> × ₹
                          {Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xs text-slate-900">
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Payment Summary */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80">
              <h2 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-slate-700" /> Payment Summary
              </h2>
              <div className="space-y-3 text-xs font-medium text-slate-500">
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-bold text-slate-900">
                    {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment (Razorpay)"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment Status</span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      order.paymentStatus === "PAID"
                        ? "bg-emerald-50 text-emerald-700"
                        : order.paymentStatus === "REFUNDED"
                        ? "bg-purple-50 text-purple-700"
                        : order.paymentStatus === "FAILED"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">Grand Total</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              {isOnlinePending && (
                <button
                  onClick={handleRetryPayment}
                  disabled={actionLoading}
                  className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-orange-600 hover:bg-orange-700 py-3 text-xs font-bold text-white shadow-sm transition disabled:opacity-50"
                >
                  <CreditCard size={15} />
                  <span>{actionLoading ? "Processing..." : "Pay Now"}</span>
                </button>
              )}
            </div>

            {/* Shipping Address */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-700" /> Shipping Address
              </h2>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <p className="whitespace-pre-line text-xs font-medium leading-relaxed text-slate-700">
                  {order.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}