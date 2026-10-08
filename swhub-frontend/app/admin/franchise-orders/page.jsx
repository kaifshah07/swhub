"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminFranchiseOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/franchise-orders/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/franchise-orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Order marked as ${status}`);
        fetchOrders();
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Franchise B2B Orders</h1>
      {loading ? <p>Loading...</p> : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4 pb-4 border-b">
                <div>
                  <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">Franchise: {order.franchise.shopName} ({order.franchise.franchiseId})</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-emerald-600">₹{order.totalAmount}</div>
                  <div className="mt-2 flex gap-2">
                    <select 
                      value={order.orderStatus} 
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-sm border rounded px-2 py-1 bg-gray-50"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PACKED">PACKED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED (Adds Stock)</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-gray-500 text-center p-10 bg-white rounded-xl shadow-sm">No franchise orders found.</p>}
        </div>
      )}
    </div>
  );
}
