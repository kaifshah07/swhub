"use client";

import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api";

export default function BecomeAVendorPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    state: "",
    currentBusiness: "",
    investmentCapacity: "",
    preferredLocation: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await axios.post(
      `${API_URL}/vendor-enquiries`,
      form
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
          "Failed to submit enquiry"
      );
    }

    alert(
      "Thank you! Your vendor enquiry has been submitted successfully."
    );

    setForm({
      name: "",
      mobile: "",
      email: "",
      city: "",
      state: "",
      currentBusiness: "",
      investmentCapacity: "",
      preferredLocation: "",
      message: "",
    });
  } catch (error: any) {
    console.error(
      "Vendor enquiry submission error:",
      error
    );

    alert(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to submit enquiry"
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Partner With SW Hub
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-600 md:text-5xl">
            Become a Vendor
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Join SW Hub and grow your business by supplying groceries, FMCG, and household essentials
            through our marketplace.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-600">
                Business Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tell us a little about yourself and your business.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Mobile Number *
                </label>

                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  placeholder="Enter mobile number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  City *
                </label>

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  State *
                </label>

                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  placeholder="Enter your state"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Current Business
                </label>

                <input
                  name="currentBusiness"
                  value={form.currentBusiness}
                  onChange={handleChange}
                  placeholder="e.g. Grocery Store, Retailer"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Investment Capacity
                </label>

                <select
                  name="investmentCapacity"
                  value={form.investmentCapacity}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-primary"
                >
                  <option value="">Select investment capacity</option>
                  <option value="Below ₹5 Lakhs">Below ₹5 Lakhs</option>
                  <option value="₹5 - ₹10 Lakhs">₹5 - ₹10 Lakhs</option>
                  <option value="₹10 - ₹25 Lakhs">₹10 - ₹25 Lakhs</option>
                  <option value="₹25 Lakhs+">₹25 Lakhs+</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Preferred Location
                </label>

                <input
                  name="preferredLocation"
                  value={form.preferredLocation}
                  onChange={handleChange}
                  placeholder="Where would you like to operate?"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Message
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us anything else about your business..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "Submitting..." : "Submit Vendor Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
