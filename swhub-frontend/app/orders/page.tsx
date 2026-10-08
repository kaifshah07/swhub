"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import { useRouter } from "next/navigation";
import { User, Package, Heart, LogOut, ArrowLeft, ChevronRight, ShoppingBag } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type OrderItem = {
  id: number;
  quantity: number;
  price: string;
  productId: number;
  product?: {
    name: string;
    thumbnail?: string;
  };
};

type Order = {
  id: number;
  orderNumber: string;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItem[];
};

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customerName, setCustomerName] = useState("Customer");

  useEffect(() => {
    loadOrders();
    const stored = localStorage.getItem("customer");
    if(stored) {
        try {
            setCustomerName(JSON.parse(stored).name || "Customer");
        } catch(e){}
    }
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("customer_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(`${API_URL}/orders/my-orders`, {
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
        window.dispatchEvent(new Event("userLoggedIn"));
        router.replace("/");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load orders");
      }

      setOrders(result.data || []);
    } catch (error: any) {
      setError(error?.message || "Unable to load your orders");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer");
    window.dispatchEvent(new Event("userLoggedIn"));
    router.push("/");
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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

  return (
    <div className="min-h-[80vh] bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl grid md:grid-cols-[250px_1fr] gap-8">
        
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 h-fit hidden md:block">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-accent to-error text-lg font-bold text-white shadow-sm">
              {customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Hello,</p>
              <h3 className="font-bold text-slate-600 truncate w-[130px]">{customerName}</h3>
            </div>
          </div>

          <nav className="space-y-2">
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-600 font-medium transition">
              <User size={18} />
              My Profile
            </Link>
            <Link href="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 text-slate-600 font-semibold transition">
              <Package size={18} />
              My Orders
            </Link>
            <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-600 font-medium transition">
              <Heart size={18} />
              Wishlist
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-600/10 font-medium transition">
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div>
          <div className="mb-6 md:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-600 transition"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>

          <div className="mb-8 flex items-end justify-between">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-600 tracking-tight">
                Order History
                </h1>
                <p className="mt-2 text-slate-500 text-sm">
                Track, return, or buy things again.
                </p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-black/5 bg-white shadow-sm">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
            </div>
          ) : error ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-black/5">
              <h1 className="text-2xl font-bold text-slate-600">Unable to load orders</h1>
              <p className="mt-3 text-slate-500">{error}</p>
              <button
                type="button"
                onClick={loadOrders}
                className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary"
              >
                Try Again
              </button>
            </div>
          ) : !orders.length ? (
            <div className="rounded-3xl bg-white p-16 text-center shadow-sm border border-black/5 flex flex-col items-center">
              <div className="h-24 w-24 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="text-slate-600 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-600">No orders yet</h2>
              <p className="mt-2 text-slate-500 max-w-sm mx-auto">
                You haven't placed any orders yet. Start exploring our collections.
              </p>
              <Link
                href="/products"
                className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-accent to-error px-8 py-3.5 font-bold text-white transition hover:opacity-90 shadow-sm"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl bg-white border border-black/5 shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Order Placed</p>
                            <p className="font-semibold text-slate-600">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total</p>
                            <p className="font-semibold text-slate-600">₹{Number(order.totalAmount).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Ship To</p>
                            <p className="font-semibold text-slate-600">{customerName}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                        <p className="text-sm font-semibold text-slate-500">Order # <span className="text-slate-600">{order.orderNumber}</span></p>
                        <Link href={`/orders/${order.id}`} className="text-sm font-bold text-slate-600 hover:text-slate-600 flex items-center gap-1">
                            View Details <ChevronRight size={16} />
                        </Link>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="mb-6 flex flex-wrap gap-2">
                        <span className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wide rounded-md border ${getStatusStyle(order.orderStatus)}`}>
                            {order.orderStatus.replace('_', ' ')}
                        </span>
                        <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wide rounded-md border bg-slate-50 text-slate-600 border-slate-200">
                            {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Paid'}
                        </span>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                            <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-slate-100 overflow-hidden border border-slate-100">
                                {item.product?.thumbnail ? (
                                    <img src={item.product.thumbnail} alt={item.product.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-300">
                                        <Package size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <Link href={`/products/${item.productId}`} className="font-bold text-slate-600 hover:text-slate-600 transition line-clamp-1">
                                    {item.product?.name || `Product #${item.productId}`}
                                </Link>
                                <p className="text-sm text-slate-500 mt-1">Qty: {item.quantity}</p>
                                <div className="mt-2 flex gap-3">
                                    <button className="text-xs font-semibold text-slate-600 hover:text-slate-600">Buy it again</button>
                                </div>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
