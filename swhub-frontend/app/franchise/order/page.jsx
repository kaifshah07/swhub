"use client";

import { useState, useEffect } from "react";
import { API_URL, productImageUrl } from "@/lib/api";
import toast from "react-hot-toast";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

export default function B2BOrderPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products?limit=100`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        const newQ = p.quantity + delta;
        return newQ > 0 ? { ...p, quantity: newQ } : p;
      }
      return p;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const getPrice = (p) => p.franchisePrice || p.discountPrice || p.price;
  
  const totalAmount = cart.reduce((sum, item) => sum + (getPrice(item) * item.quantity), 0);

  const placeOrder = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    try {
      const token = localStorage.getItem("franchiseToken");
      const payload = {
        items: cart.map(c => ({ productId: c.id, quantity: c.quantity }))
      };
      const res = await fetch(`${API_URL}/franchise-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Order placed successfully!");
        setCart([]);
      } else {
        toast.error(data.message || "Order failed");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  return (
    <div className="flex h-full">
      {/* Product List */}
      <div className="flex-1 p-6 overflow-auto border-r border-gray-200 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6">Restock Products</h2>
        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  {p.thumbnail ? (
                    <img src={productImageUrl(p.thumbnail)} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 flex-1">{p.name}</h3>
                <div className="mt-2 flex items-end justify-between">
                  <div className="text-emerald-700 font-bold">₹{getPrice(p)}</div>
                  <button 
                    onClick={() => addToCart(p)}
                    className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white flex flex-col shadow-xl z-10">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingCart size={20} /> Current Order</h2>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">{cart.length} items</span>
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">Cart is empty</div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 items-center pb-4 border-b border-gray-100">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold line-clamp-1">{item.name}</h4>
                  <div className="text-emerald-700 font-bold text-sm">₹{getPrice(item)} <span className="text-gray-400 text-xs font-normal">x {item.quantity}</span></div>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded"><Minus size={14}/></button>
                  <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded"><Plus size={14}/></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16}/></button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-600">Total</span>
            <span className="text-2xl font-black text-gray-900">₹{totalAmount.toLocaleString()}</span>
          </div>
          <button 
            onClick={placeOrder}
            disabled={cart.length === 0}
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            Place B2B Order
          </button>
        </div>
      </div>
    </div>
  );
}
