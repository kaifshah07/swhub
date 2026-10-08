"use client";

import { useEffect, useState } from "react";
import api from "../services/api/axios";

export default function AdminVendorLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);
      const res = await api.get("/vendor-enquiries");
      setLeads(res.data.data || res.data.enquiries || []);
    } catch (err) {
      console.error("Failed to load vendor leads:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await api.patch(`/vendor-enquiries/${id}/status`, { status: newStatus });
      loadLeads();
      if (selectedLead?.id === id) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await api.delete(`/vendor-enquiries/${id}`);
      setSelectedLead(null);
      loadLeads();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete enquiry");
    }
  }

  const statuses = ["PENDING", "CONTACTED", "APPROVED", "REJECTED"];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vendor Leads</h1>
          <p className="text-sm text-gray-500 mt-1">
            Supplier and vendor partnership enquiries
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          Loading vendor enquiries...
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          No vendor enquiries submitted yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs uppercase tracking-wider text-gray-600">
                <th className="p-4">Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4">Current Business</th>
                <th className="p-4">Investment Capacity</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.mobile}</p>
                    {lead.email && <p className="text-xs text-gray-400">{lead.email}</p>}
                  </td>
                  <td className="p-4 text-gray-700">
                    {lead.city}, {lead.state}
                  </td>
                  <td className="p-4 text-gray-600">{lead.currentBusiness || "-"}</td>
                  <td className="p-4 text-gray-600">{lead.investmentCapacity || "-"}</td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded border outline-none ${
                        lead.status === "APPROVED"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : lead.status === "CONTACTED"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : lead.status === "REJECTED"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="text-red-600 hover:text-red-800 font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Vendor Enquiry Details
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-600">Applicant:</span>{" "}
                <span className="font-bold text-gray-800">{selectedLead.name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Phone:</span> {selectedLead.mobile}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Email:</span> {selectedLead.email || "-"}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Location:</span> {selectedLead.city},{" "}
                {selectedLead.state}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Current Business:</span>{" "}
                {selectedLead.currentBusiness || "None"}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Investment Capacity:</span>{" "}
                {selectedLead.investmentCapacity || "Not specified"}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Preferred Location:</span>{" "}
                {selectedLead.preferredLocation || "-"}
              </div>
              {selectedLead.message && (
                <div>
                  <span className="font-semibold text-gray-600 block mb-1">Message:</span>
                  <p className="bg-gray-50 p-3 rounded-lg text-gray-700 whitespace-pre-wrap">
                    {selectedLead.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
