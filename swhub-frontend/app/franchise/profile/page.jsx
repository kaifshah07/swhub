"use client";

import { useEffect, useState } from "react";
import { Store, MapPin, Mail, Phone, CreditCard, ShieldCheck } from "lucide-react";

export default function FranchiseProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("franchiseUser");
    if (u) {
      setUser(JSON.parse(u));
    }
  }, []);

  if (!user) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <Store className="text-emerald-600" size={32} />
        Franchise Profile
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-900"></div>
        
        {/* Avatar & Title */}
        <div className="px-8 pb-8 relative">
          <div className="w-24 h-24 bg-white rounded-xl shadow-md flex items-center justify-center -mt-12 mb-4 border border-gray-100">
            <span className="text-4xl font-black text-emerald-600">{user.shopName?.charAt(0) || "S"}</span>
          </div>
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.shopName || "My Store"}</h2>
              <p className="text-gray-500 font-medium">Franchise ID: {user.franchiseId}</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
              <ShieldCheck size={14} /> {user.roleTier}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Details</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Store size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Owner Name</p>
                  <p className="font-medium">{user.fullName}</p>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Business Details</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">GST Number</p>
                  <p className="font-medium">{user.gstNumber || "Not Provided"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Store Address</p>
                  <p className="font-medium">{user.address}</p>
                  <p className="text-gray-600">{user.city}, {user.state} {user.pincode}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
