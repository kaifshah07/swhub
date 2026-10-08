"use client";

import Link from "next/link";
import {
  Edit3,
  Trash2,
  ExternalLink,
  Package,
  Sparkles,
  Tag,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { productImageUrl } from "@/lib/api";

export default function ProductTable({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 mb-3">
          <Package size={28} />
        </div>
        <h3 className="text-base font-bold text-slate-800">No products found</h3>
        <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
          Try adjusting your search query or filters, or add a brand-new product to your store catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="p-4 pl-6">Product Details</th>
              <th className="p-4">Category</th>
              <th className="p-4">Pricing</th>
              <th className="p-4">Inventory</th>
              <th className="p-4">Homepage Shelf</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => {
              const sellingPrice = Number(p.discountPrice ?? p.price ?? 0);
              const mrp = Number(p.price ?? sellingPrice);
              const discountPercent =
                mrp > sellingPrice && mrp > 0
                  ? Math.round(((mrp - sellingPrice) / mrp) * 100)
                  : 0;

              return (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/60 transition group"
                >
                  {/* PRODUCT INFO */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-12 w-12 shrink-0 rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center">
                        {p.thumbnail ? (
                          <img
                            src={productImageUrl(p.thumbnail)}
                            alt={p.name}
                            className="h-full w-full object-contain p-1 transition group-hover:scale-105"
                          />
                        ) : (
                          <Package size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div className="min-w-0 max-w-[240px]">
                        <p className="font-bold text-slate-900 line-clamp-1 text-xs group-hover:text-orange-600 transition">
                          {p.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          {p.brand && (
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                              {p.brand}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-slate-400">
                            {p.sku || `BAL-${p.id}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY & SUBCATEGORY */}
                  <td className="p-4">
                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                      {p.category?.name || "General"}
                    </span>
                    {p.subcategory?.name && (
                      <span className="block text-[10px] text-slate-400 mt-1 font-medium pl-1">
                        ↳ {p.subcategory.name}
                      </span>
                    )}
                  </td>

                  {/* PRICING */}
                  <td className="p-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-slate-900 text-sm">
                        ₹{sellingPrice.toFixed(0)}
                      </span>
                      {discountPercent > 0 && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{mrp.toFixed(0)}
                        </span>
                      )}
                    </div>
                    {discountPercent > 0 && (
                      <span className="inline-block mt-0.5 rounded-full bg-emerald-50 px-2 py-0.2 text-[10px] font-black text-emerald-600">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </td>

                  {/* INVENTORY */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        p.stock > 5
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : p.stock > 0
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          p.stock > 5
                            ? "bg-emerald-500"
                            : p.stock > 0
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span>
                        {p.stock > 5
                          ? `${p.stock} In Stock`
                          : p.stock > 0
                          ? `Low (${p.stock} left)`
                          : "Out of Stock"}
                      </span>
                    </span>
                  </td>

                  {/* HOMEPAGE SHELF PILLS */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {p.isFeatured && (
                        <span className="rounded-full bg-emerald-100/80 text-emerald-700 text-[10px] px-2 py-0.5 font-bold border border-emerald-200">
                          Featured
                        </span>
                      )}
                      {p.isTrending && (
                        <span className="rounded-full bg-orange-100/80 text-orange-700 text-[10px] px-2 py-0.5 font-bold border border-orange-200">
                          Trending
                        </span>
                      )}
                      {p.isNewArrival && (
                        <span className="rounded-full bg-purple-100/80 text-purple-700 text-[10px] px-2 py-0.5 font-bold border border-purple-200">
                          New
                        </span>
                      )}
                      {p.isFlashSale && (
                        <span className="rounded-full bg-red-100/80 text-red-700 text-[10px] px-2 py-0.5 font-bold border border-red-200">
                          Flash
                        </span>
                      )}
                      {p.isBestSeller && (
                        <span className="rounded-full bg-amber-100/80 text-amber-700 text-[10px] px-2 py-0.5 font-bold border border-amber-200">
                          Best Seller
                        </span>
                      )}
                      {!p.isFeatured &&
                        !p.isTrending &&
                        !p.isNewArrival &&
                        !p.isFlashSale &&
                        !p.isBestSeller && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Standard
                          </span>
                        )}
                    </div>
                  </td>

                  {/* STORE STATUS */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        p.isActive ? "text-emerald-700" : "text-slate-400"
                      }`}
                    >
                      {p.isActive ? (
                        <CheckCircle2 size={15} className="text-emerald-500" />
                      ) : (
                        <XCircle size={15} className="text-slate-300" />
                      )}
                      <span>{p.isActive ? "Active" : "Draft"}</span>
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 pr-6 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/products/${p.id}`}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                        title="View on Storefront"
                      >
                        <ExternalLink size={15} />
                      </Link>

                      <button
                        onClick={() => onEdit(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition"
                        title="Edit Product"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        onClick={() => onDelete(p.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete Product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
