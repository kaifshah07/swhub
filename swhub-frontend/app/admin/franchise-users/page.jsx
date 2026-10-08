"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";
import { Plus, Edit, Trash2, Power } from "lucide-react";
import toast from "react-hot-toast";

export default function FranchiseUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    roleTier: "FRANCHISE",
    gstNumber: "",
    parentId: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    businessName: "",
    shopName: "",
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/franchise-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch franchise users");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        password: "", // Don't pre-fill password
        roleTier: user.roleTier,
        gstNumber: user.gstNumber || "",
        parentId: user.parentId || "",
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        businessName: user.businessName,
        shopName: user.shopName,
        isActive: user.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        fullName: "", email: "", phone: "", password: "", roleTier: "FRANCHISE", gstNumber: "", parentId: "",
        address: "", city: "", state: "", pincode: "", businessName: "", shopName: "", isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const url = editingId ? `${API_URL}/franchise-users/${editingId}` : `${API_URL}/franchise-users`;
      const method = editingId ? "PUT" : "POST";
      
      const payload = { ...formData };
      if (editingId && !payload.password) {
        delete payload.password; // Do not send empty password on update
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "Updated successfully" : "Created successfully");
        setIsModalOpen(false);
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to save user");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/franchise-users/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Status updated");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Franchise Users</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 font-semibold"
        >
          <Plus size={20} /> Add Franchise
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Contact</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Shop / Business</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Role</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-800">{user.franchiseId}</td>
                  <td className="p-4 text-sm text-gray-800 font-medium">{user.fullName}</td>
                  <td className="p-4 text-sm text-gray-600">
                    <div>{user.email}</div>
                    <div className="text-xs text-gray-400">{user.phone}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div>{user.shopName}</div>
                    <div className="text-xs text-gray-400">{user.businessName}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{user.roleTier}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleOpenModal(user)} className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => toggleStatus(user.id, user.isActive)} className="text-gray-600 hover:bg-gray-100 p-2 rounded">
                      <Power size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">{editingId ? "Edit Franchise User" : "Add Franchise User"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input required type="email" className="w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password {editingId ? "(Leave empty to keep current)" : "*"}</label>
                <input required={!editingId} type="password" className="w-full border p-2 rounded" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role Tier *</label>
                <select className="w-full border p-2 rounded" value={formData.roleTier} onChange={e => setFormData({...formData, roleTier: e.target.value})}>
                  <option value="MASTER">Master Franchise</option>
                  <option value="FRANCHISE">Standard Franchise</option>
                  <option value="SUB_STORE">Sub Store</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GST Number (Optional)</label>
                <input type="text" className="w-full border p-2 rounded" value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Parent Uplink ID (Optional)</label>
                <input type="text" placeholder="ID of parent franchise" className="w-full border p-2 rounded" value={formData.parentId} onChange={e => setFormData({...formData, parentId: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Name *</label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shop Name *</label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address *</label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State *</label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pincode *</label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                <label htmlFor="isActive" className="text-sm font-medium">Account Active</label>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700">Save Franchise</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
