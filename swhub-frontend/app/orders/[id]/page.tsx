"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Package, MapPin, Receipt, CheckCircle2, Circle } from "lucide-react";
import { API_URL } from "@/lib/api";

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
};

const statusSteps = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        return "-blue- text-primary border-primary";
      case "CANCELLED":
        return "bg-red-600/20 text-red-600 border-red-200";
      case "SHIPPED":
        return "-sky- -sky- -sky-";
      case "CONFIRMED":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "PROCESSING":
        return "bg-amber-50 text-slate-600 border-primary";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
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
          <h1 className="text-2xl font-bold text-slate-600">Order not found</h1>
          <p className="mt-2 text-slate-500">{error || "We couldn't find this order."}</p>
          <Link href="/orders" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-[80vh] bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/orders" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-600">
          <ArrowLeft size={16} /> Back to Orders
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm border border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-600">
              Order #{order.orderNumber}
            </h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex gap-3 items-center">
             <span className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wide rounded-xl border ${getStatusStyle(order.orderStatus)}`}>
                {order.orderStatus.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
            {/* Tracking and Items (Left Column) */}
            <div className="md:col-span-2 space-y-8">
                {/* Tracking Tracker */}
                <div className="rounded-3xl bg-white p-8 shadow-sm border border-black/5">
                    <h2 className="text-xl font-bold text-slate-600 mb-8">Order Tracking</h2>
                    {order.orderStatus === "CANCELLED" ? (
                        <div className="rounded-2xl bg-red-600/10 p-6 text-red-600 border border-red-200">
                            <p className="font-bold text-lg mb-2">Order Cancelled</p>
                            <p className="text-sm">This order has been cancelled and will not be delivered.</p>
                        </div>
                    ) : (
                        <div className="relative pl-4 border-l-2 border-slate-100 space-y-8 ml-2">
                            {statusSteps.map((status, idx) => {
                                const completed = idx <= currentStep;
                                const isLast = idx === statusSteps.length - 1;
                                const isCurrent = idx === currentStep;

                                return (
                                    <div key={status} className="relative">
                                        <div className={`absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full bg-white ring-4 ring-white`}>
                                            {completed ? (
                                                <CheckCircle2 className="w-6 h-6 text-primary" fill="currentColor" stroke="white" />
                                            ) : (
                                                <Circle className="w-4 h-4 text-slate-300 fill-white" />
                                            )}
                                        </div>
                                        <div className="pl-4">
                                            <h3 className={`font-bold text-sm ${completed ? "text-slate-600" : "text-slate-400"}`}>
                                                {status.replace('_', ' ')}
                                            </h3>
                                            {isCurrent && <p className="text-xs text-slate-500 font-medium mt-1">We are currently processing this step.</p>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="rounded-3xl bg-white p-8 shadow-sm border border-black/5">
                    <h2 className="text-xl font-bold text-slate-600 mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-slate-600" /> Items in this Order
                    </h2>
                    <div className="divide-y divide-gray-100">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-5 py-5 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                                        {item.product?.thumbnail ? (
                                            <img src={item.product.thumbnail} alt={item.product.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                <Package size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Link href={`/products/${item.productId}`} className="font-bold text-slate-600 hover:text-slate-600 transition line-clamp-1">
                                            {item.product?.name || `Product #${item.productId}`}
                                        </Link>
                                        <p className="mt-1 text-sm text-slate-500 font-medium">Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-extrabold text-slate-600">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
                {/* Summary */}
                <div className="rounded-3xl bg-white p-8 shadow-sm border border-black/5">
                    <h2 className="text-xl font-bold text-slate-600 mb-6 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-slate-600" /> Payment Summary
                    </h2>
                    <div className="space-y-4 text-sm font-medium text-slate-500">
                        <div className="flex justify-between">
                            <span>Payment Method</span>
                            <span className="text-slate-600">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Payment Status</span>
                            <span className="text-slate-600">{order.paymentStatus}</span>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span className="font-bold text-slate-600 text-base">Total Amount</span>
                            <span className="text-2xl font-extrabold text-slate-600">₹{Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="rounded-3xl bg-white p-8 shadow-sm border border-black/5">
                    <h2 className="text-xl font-bold text-slate-600 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-slate-600" /> Shipping Address
                    </h2>
                    <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                        <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-slate-600">
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