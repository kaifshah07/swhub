"use client";

import { useState, useEffect } from "react";
import { API_URL, productImageUrl } from "@/lib/api";
import toast from "react-hot-toast";
import { ShoppingCart, Plus, Minus, Trash2, Printer } from "lucide-react";

export default function FranchiseBilling() {
  const [stock, setStock] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", paymentMethod: "COD" });
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const token = localStorage.getItem("franchiseToken");
      const res = await fetch(`${API_URL}/franchise-inventory/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStock(data.data);
      }
    } catch (error) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (stockItem) => {
    if (stockItem.quantity <= 0) return toast.error("Out of stock");
    setCart(prev => {
      const existing = prev.find(p => p.productId === stockItem.productId);
      if (existing) {
        if (existing.cartQty >= stockItem.quantity) {
          toast.error("Not enough local stock");
          return prev;
        }
        return prev.map(p => p.productId === stockItem.productId ? { ...p, cartQty: p.cartQty + 1 } : p);
      }
      return [...prev, { ...stockItem, cartQty: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(p => {
      if (p.productId === productId) {
        const newQ = p.cartQty + delta;
        if (newQ > p.quantity) {
          toast.error("Not enough local stock");
          return p;
        }
        return newQ > 0 ? { ...p, cartQty: newQ } : p;
      }
      return p;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(p => p.productId !== productId));
  };

  const getPrice = (p) => p.product.discountPrice || p.product.price;
  
  const subTotal = cart.reduce((sum, item) => sum + (getPrice(item) * item.cartQty), 0);
  const taxAmount = subTotal * 0.18; // 18% GST default
  const totalAmount = subTotal + taxAmount;

  const generateInvoice = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    try {
      const token = localStorage.getItem("franchiseToken");
      const payload = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        paymentMethod: customerInfo.paymentMethod,
        items: cart.map(c => ({ productId: c.productId, quantity: c.cartQty }))
      };
      const res = await fetch(`${API_URL}/franchise-invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Invoice generated successfully!");
        setInvoiceData({
          ...data.data,
          cartItems: cart.map(item => ({ ...item, printPrice: getPrice(item) })),
          subTotal,
          taxAmount,
          totalAmount,
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone
        });
        setCart([]);
        setCustomerInfo({ name: "", phone: "", paymentMethod: "COD" });
        fetchStock();
      } else {
        toast.error(data.message || "Failed to generate invoice");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  return (
    <>
    <div className="flex h-full print:hidden">
      {/* Product List */}
      <div className="flex-1 p-6 overflow-auto border-r border-gray-200 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6">POS Billing - Local Stock</h2>
        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {stock.map(s => (
              <div key={s.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  {s.product.thumbnail ? (
                    <img src={productImageUrl(s.product.thumbnail)} alt={s.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 flex-1">{s.product.name}</h3>
                <div className="mt-2 text-xs text-gray-500 font-medium">Stock: {s.quantity} units</div>
                <div className="mt-2 flex items-end justify-between">
                  <div className="text-emerald-700 font-bold">₹{getPrice(s)}</div>
                  <button 
                    onClick={() => addToCart(s)}
                    disabled={s.quantity === 0}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50"
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
          <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingCart size={20} /> Current Bill</h2>
          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">{cart.length} items</span>
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">No items scanned</div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex gap-3 items-center pb-4 border-b border-gray-100">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold line-clamp-1">{item.product.name}</h4>
                  <div className="text-green-600 font-bold text-sm">₹{getPrice(item)}</div>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-white rounded"><Minus size={14}/></button>
                  <span className="text-sm font-semibold w-6 text-center">{item.cartQty}</span>
                  <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-white rounded"><Plus size={14}/></button>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16}/></button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-4">
            <div className="space-y-2 mb-4">
               <input type="text" placeholder="Customer Name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full border px-3 py-2 text-sm rounded-lg" />
               <input type="text" placeholder="Customer Phone" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full border px-3 py-2 text-sm rounded-lg" />
               <select value={customerInfo.paymentMethod} onChange={e => setCustomerInfo({...customerInfo, paymentMethod: e.target.value})} className="w-full border px-3 py-2 text-sm rounded-lg">
                  <option value="COD">CASH</option>
                  <option value="ONLINE">CARD / UPI</option>
               </select>
            </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-700">₹{subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">GST (18%)</span>
            <span className="font-semibold text-gray-700">₹{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="font-bold text-gray-800">Total</span>
            <span className="text-2xl font-black text-green-600">₹{totalAmount.toFixed(2)}</span>
          </div>
          <button 
            onClick={generateInvoice}
            disabled={cart.length === 0}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Printer size={18} /> Print Invoice & Pay
          </button>
        </div>
      </div>
    </div>

    {/* Printable Invoice Modal */}
    {invoiceData && (
      <div className="fixed inset-0 bg-gray-500/50 z-[9999] p-8 overflow-auto print:p-0 print:bg-white">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xl print:shadow-none print:border-none print:p-0">
          <div className="flex justify-between items-start border-b pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter">TAX INVOICE</h1>
              <p className="text-gray-500 mt-1">Invoice #{invoiceData.invoiceNumber}</p>
              <p className="text-gray-500 text-sm">Date: {new Date(invoiceData.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <h2 className="font-bold text-lg text-gray-800">SW Hub Partner Store</h2>
              <p className="text-gray-500 text-sm">B2C Retail Invoice</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider mb-2">Billed To</h3>
            <p className="font-medium text-lg">{invoiceData.customerName || "Walk-in Customer"}</p>
            {invoiceData.customerPhone && <p className="text-gray-600">{invoiceData.customerPhone}</p>}
          </div>

          <table className="w-full text-left mb-8">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="py-3 text-sm font-bold text-gray-600 uppercase tracking-wider">Item</th>
                <th className="py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Qty</th>
                <th className="py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">Price</th>
                <th className="py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoiceData.cartItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-4">
                    <p className="font-semibold text-gray-800">{item.product.name}</p>
                    <p className="text-xs text-gray-400">SKU: {item.product.sku}</p>
                  </td>
                  <td className="py-4 text-center font-medium">{item.cartQty}</td>
                  <td className="py-4 text-right">₹{item.printPrice}</td>
                  <td className="py-4 text-right font-bold">₹{(item.printPrice * item.cartQty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="w-1/2 ml-auto space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">₹{invoiceData.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (18%)</span>
              <span className="font-semibold">₹{invoiceData.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3">
              <span className="font-black text-gray-900 text-lg">Grand Total</span>
              <span className="font-black text-green-600 text-lg">₹{invoiceData.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-gray-400 border-t pt-6">
            <p>Thank you for shopping at SW Hub!</p>
            <p>This is a computer-generated invoice and does not require a physical signature.</p>
          </div>

          <div className="mt-8 flex justify-end gap-4 print:hidden">
            <button 
              onClick={() => setInvoiceData(null)} 
              className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button 
              onClick={() => window.print()} 
              className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Printer size={18} /> Print Document
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
