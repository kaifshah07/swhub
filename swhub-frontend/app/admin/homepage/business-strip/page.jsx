"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store, Building2, ArrowUpRight, Users, CheckCircle2 } from "lucide-react";
import { API_URL } from "@/lib/api";

export default function BusinessStripAdmin() {
  const [vendorCount, setVendorCount] = useState(0);
  const [franchiseCount, setFranchiseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = localStorage.getItem("adminToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [vendorRes, franchiseRes] = await Promise.all([
          fetch(`${API_URL}/admin/vendor-enquiries?limit=1`, { headers }),
          fetch(`${API_URL}/admin/franchise-enquiries?limit=1`, { headers }),
        ]);

        const [vendorData, franchiseData] = await Promise.all([
          vendorRes.json(),
          franchiseRes.json(),
        ]);

        if (vendorData.success) {
          setVendorCount(vendorData.meta?.total || vendorData.total || 0);
        }
        if (franchiseData.success) {
          setFranchiseCount(franchiseData.meta?.total || franchiseData.total || 0);
        }
      } catch (err) {
        console.error("Failed to load enquiries stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Homepage Business Strip Management
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Monitor conversion funnels and inbound leads for "Become a Vendor" and "Open a Franchise" call-to-actions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vendor Box */}
        <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Store size={24} />
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              Active CTA
            </span>
          </div>

          <h3 className="mt-5 text-xl font-bold text-gray-900">
            Vendor Enquiries CTA
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Routes prospective kid brands and merchants to /become-a-vendor.
          </p>

          <div className="mt-6 rounded-2xl bg-blue-50/50 p-4 border border-blue-100 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-gray-600">Total Leads Received:</span>
            <span className="text-2xl font-black text-blue-700">
              {loading ? "..." : vendorCount}
            </span>
          </div>

          <Link
            href="/admin/vendor-leads"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow hover:bg-blue-700 transition"
          >
            <span>Manage Vendor Inquiries</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Franchise Box */}
        <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Building2 size={24} />
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              Active CTA
            </span>
          </div>

          <h3 className="mt-5 text-xl font-bold text-gray-900">
            Franchise Application CTA
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Routes prospective store partners to /franchise onboarding form.
          </p>

          <div className="mt-6 rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-gray-600">Total Applications:</span>
            <span className="text-2xl font-black text-emerald-600">
              {loading ? "..." : franchiseCount}
            </span>
          </div>

          <Link
            href="/admin/franchise-leads"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700 transition"
          >
            <span>Manage Franchise Applications</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}