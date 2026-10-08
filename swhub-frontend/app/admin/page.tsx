"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  FolderTree,
  ShoppingBag,
  IndianRupee,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Plus,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { getDashboard } from "./services/api/dashboard";
import { productImageUrl } from "@/lib/api";

interface Product {
  id: number;
  name: string;
  stock: number;
  price?: number;
  discountPrice?: number;
  thumbnail?: string;
  category?: {
    name: string;
  };
}

interface DashboardData {
  statistics: {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
  };
  recentProducts: Product[];
  lowStockProducts: Product[];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData>({
    statistics: {
      totalProducts: 0,
      totalCategories: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
    },
    recentProducts: [],
    lowStockProducts: [],
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const data = await getDashboard();
      if (data?.statistics) {
        setDashboard(data);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0EA5E9] border-t-transparent" />
          <p className="text-xs font-bold text-slate-500">Loading Dashboard Metrics...</p>
        </div>
      </div>
    );
  }

  const { statistics, recentProducts, lowStockProducts } = dashboard;

  return (
    <div className="space-y-8">
      {/* GREETING & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span>Store Overview</span>
            <span className="text-xs font-bold text-slate-600 bg-amber-50/70 border border-[#0EA5E9] px-2.5 py-0.5 rounded-full">
              Live Data
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Real-time sales, order volume, and catalog inventory overview.
          </p>
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0EA5E9] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 transition hover:bg-[#0EA5E9] active:scale-95"
          >
            <Plus size={15} />
            <span>Manage Products</span>
          </Link>
          <Link
            href="/admin/homepage"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
          >
            <Sparkles size={15} className="text-slate-600" />
            <span>Homepage Shelves</span>
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* TOTAL REVENUE */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-[#0EA5E9]">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              ₹{Number(statistics.totalRevenue || 0).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-[#0EA5E9] flex items-center gap-1">
            <ArrowUpRight size={14} />
            <span>From completed & verified orders</span>
          </p>
        </div>

        {/* TOTAL ORDERS */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-slate-600">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {statistics.totalOrders || 0}
            </span>
            {statistics.pendingOrders > 0 && (
              <span className="text-xs font-bold text-slate-600 bg-amber-50 px-2 py-0.5 rounded-full">
                {statistics.pendingOrders} pending
              </span>
            )}
          </div>
          <p className="mt-2 text-[11px] font-medium text-slate-400">
            {statistics.completedOrders} orders fulfilled
          </p>
        </div>

        {/* TOTAL PRODUCTS */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Catalog
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Package size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {statistics.totalProducts || 0}
            </span>
            <span className="text-xs font-bold text-slate-500">Products</span>
          </div>
          <p className="mt-2 text-[11px] font-medium text-slate-400">
            Across {statistics.totalCategories || 0} categories
          </p>
        </div>

        {/* TOTAL CUSTOMERS */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Registered Customers
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-[#0EA5E9]">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {statistics.totalCustomers || 0}
            </span>
            <span className="text-xs font-bold text-slate-500">Customers</span>
          </div>
          <p className="mt-2 text-[11px] font-medium text-slate-400">
            Active shoppers & accounts
          </p>
        </div>
      </div>

      {/* TWO COLUMN GRID: RECENT PRODUCTS & LOW STOCK ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT PRODUCTS (2 COLUMNS) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Recently Added Products
              </h2>
              <p className="text-xs text-slate-400">Latest merchandise in store</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-slate-600 hover:text-slate-600 flex items-center gap-1 transition"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">
              No products found in store yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          {product.thumbnail ? (
                            <img
                              src={productImageUrl(product.thumbnail)}
                              alt={product.name}
                              className="h-9 w-9 rounded-xl object-contain border border-slate-100 bg-slate-50"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                              <Package size={16} />
                            </div>
                          )}
                          <span className="font-bold text-slate-800 line-clamp-1 max-w-[220px]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                          {product.category?.name || "General"}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            product.stock > 10
                              ? "bg-slate-50 text-[#0EA5E9]"
                              : product.stock > 0
                              ? "bg-amber-50 text-slate-600"
                              : "bg-red-600/10 text-red-600"
                          }`}
                        >
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href="/admin/products"
                          className="font-bold text-slate-600 hover:text-slate-600"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* LOW STOCK ALERTS (1 COLUMN) */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600/20 text-red-600">
                <AlertTriangle size={16} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Low Stock Warnings
                </h2>
                <p className="text-[11px] text-slate-400">Needs restock</p>
              </div>
            </div>
            <span className="rounded-full bg-red-600/20 px-2 py-0.5 text-[11px] font-bold text-red-600">
              {lowStockProducts.length} items
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <p className="font-bold text-[#0EA5E9]">All stocks healthy! 🎉</p>
                <p className="mt-1">No products below safety threshold.</p>
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-600/10/40 p-3"
                >
                  <div className="flex-1 pr-3">
                    <p className="font-bold text-slate-800 line-clamp-1 text-xs">
                      {p.name}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Category: {p.category?.name || "General"}
                    </span>
                  </div>
                  <span className="rounded-xl bg-red-600 px-2.5 py-1 text-xs font-black text-white shrink-0">
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              href="/admin/products"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              <span>Restock Inventory</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
