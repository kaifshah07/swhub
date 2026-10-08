"use client";

import { useEffect, useState } from "react";
import { API_URL, productImageUrl } from "@/lib/api";
import { Package, ShoppingBag, FileText, TrendingUp, AlertTriangle, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import dayjs from "dayjs";

export default function FranchiseDashboard() {
  const [data, setData] = useState({
    stats: {
      totalStock: 0,
      lowStock: 0,
      outOfStock: 0,
      totalOrders: 0,
      totalSales: 0,
    },
    recentOrders: [],
    recentInvoices: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("franchiseToken");
      const res = await fetch(`${API_URL}/franchise-dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const { stats, recentOrders, recentInvoices } = data;

  if (loading) return <div className="p-8 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Local Stock</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStock}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Package size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">B2B Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</h3>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><ShoppingBag size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">POS Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1 flex items-center"><IndianRupee size={20}/> {stats.totalSales}</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.lowStock}</h3>
            </div>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><AlertTriangle size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Out of Stock</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.outOfStock}</h3>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent B2B Orders</h2>
          {recentOrders.length === 0 ? <p className="text-gray-500 text-sm">No orders yet.</p> : (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{dayjs(order.createdAt).format('DD MMM, YYYY')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{order.totalAmount}</p>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{order.orderStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent POS Invoices</h2>
          {recentInvoices.length === 0 ? <p className="text-gray-500 text-sm">No invoices generated yet.</p> : (
             <div className="space-y-4">
              {recentInvoices.map(inv => (
                <div key={inv.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{inv.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">{inv.customerName || 'Walk-in'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{inv.totalAmount}</p>
                    <p className="text-xs text-gray-500">{dayjs(inv.createdAt).format('DD MMM, YYYY')}</p>
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
