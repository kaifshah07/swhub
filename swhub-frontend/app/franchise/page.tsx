"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Store,
  TrendingUp,
  Users,
  BriefcaseBusiness,
} from "lucide-react";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function FranchisePage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    city: "",
    state: "",
    ownsBusiness: false,
    currentBusinessName: "",
    currentBusinessType: "",
    businessExperience: "",
    preferredLocation: "",
    preferredCity: "",
    preferredArea: "",
    investmentCapacity: "",
    storeType: "",
    startTimeline: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const response = await fetch(
  `${API_URL}/franchise-enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to submit franchise enquiry"
        );
      }

      setSubmitted(true);

      setForm({
        fullName: "",
        mobile: "",
        email: "",
        city: "",
        state: "",
        ownsBusiness: false,
        currentBusinessName: "",
        currentBusinessType: "",
        businessExperience: "",
        preferredLocation: "",
        preferredCity: "",
        preferredArea: "",
        investmentCapacity: "",
        storeType: "",
        startTimeline: "",
        message: "",
      });
    } catch (err: any) {
      setError(
        err?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-slate-50 text-slate-900">

      {/* HERO */}
      <section className="border-b border-black/5">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5E9]">
                SW Hub Franchise Network
              </p>

              <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-600 sm:text-5xl lg:text-6xl">
                Build a high-volume retail & grocery business with SW Hub.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Join the SW Hub franchise network and build a high-frequency,
                professionally supported retail business focused on daily groceries,
                beverages, kitchenware, personal care, and household essentials.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#franchise-enquiry"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0EA5E9] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-900"
                >
                  Start Franchise Enquiry
                  <ArrowRight size={17} />
                </a>

                <a
                  href="#franchise-process"
                  className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
                >
                  View Franchise Process
                </a>
              </div>
            </div>

            {/* BUSINESS SNAPSHOT */}
            <div className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Franchise opportunity
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-600">
                Is SW Hub right for you?
              </h2>

              <div className="mt-7 space-y-5">

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                    <Store size={20} className="text-[#0EA5E9]" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Retail opportunity
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Build a dedicated SW Hub retail presence
                      in your preferred market.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <TrendingUp
                      size={20}
                      className="text-[#0EA5E9]"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Business growth
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Explore a structured opportunity with a
                      growing children's retail brand.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <Users
                      size={20}
                      className="text-[#0EA5E9]"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Business support
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Discuss your location, business profile and
                      franchise requirements with our team.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY SW HUB */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0EA5E9]">
              Why partner with us
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-600 sm:text-4xl">
              Designed for entrepreneurs who want to build.
            </h2>

            <p className="mt-4 text-slate-600">
              We evaluate every franchise opportunity based on the
              partner, location, business potential and long-term
              fit.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <BenefitCard
              icon={<BriefcaseBusiness size={21} />}
              title="Entrepreneur-friendly"
              description="A franchise opportunity for entrepreneurs, existing retailers and business owners."
            />

            <BenefitCard
              icon={<MapPin size={21} />}
              title="Location focused"
              description="Your preferred city and location are evaluated as part of the franchise discussion."
            />

            <BenefitCard
              icon={<TrendingUp size={21} />}
              title="Built for growth"
              description="Create a high-frequency retail presence around daily groceries, staples, kitchenware and household needs."
            />

          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section
        id="franchise-process"
        className="border-y border-black/5 bg-slate-50"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0EA5E9]">
              Franchise journey
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-600 sm:text-4xl">
              From enquiry to launch.
            </h2>

            <p className="mt-4 text-slate-600">
              A clear process helps us understand your business
              profile and determine whether the opportunity is the
              right fit.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <ProcessStep
              number="01"
              title="Submit enquiry"
              description="Share your details, location, experience and investment plans."
            />

            <ProcessStep
              number="02"
              title="Initial discussion"
              description="Our team reviews your enquiry and connects with you."
            />

            <ProcessStep
              number="03"
              title="Business evaluation"
              description="We discuss your proposed location, business profile and requirements."
            />

            <ProcessStep
              number="04"
              title="Franchise discussion"
              description="Explore the proposed franchise model, responsibilities and next steps."
            />

            <ProcessStep
              number="05"
              title="Agreement & setup"
              description="Complete the required formalities and prepare for store setup."
            />

            <ProcessStep
              number="06"
              title="Launch"
              description="Move towards opening your SW Hub store in the selected market."
            />

          </div>
        </div>
      </section>

      {/* ENQUIRY */}
      <section
        id="franchise-enquiry"
        className="bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">

            {/* LEFT */}
            <div className="lg:pt-6">

              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0EA5E9]">
                Franchise enquiry
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-600 sm:text-4xl">
                Tell us about your franchise plans.
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-slate-600">
                Share your business and location details with our
                team. We will review your enquiry and get in touch
                to discuss the opportunity.
              </p>

              <div className="mt-8 space-y-4">

                {[
                  "Your enquiry is reviewed by our team",
                  "Discuss your preferred location",
                  "Evaluate business and investment plans",
                  "Move forward if the opportunity is a good fit",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-[#0EA5E9]"
                    />

                    <span className="text-sm leading-6 text-slate-600">
                      {item}
                    </span>
                  </div>
                ))}

              </div>
            </div>

            {/* FORM */}
            <div className="rounded-2xl border border-black/5 bg-slate-50 p-6 sm:p-8">

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                <div className="grid gap-5 sm:grid-cols-2">

                  <Input
                    label="Full Name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />

                  <Input
                    label="Mobile Number"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    required
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />

                  <Input
                    label="Current City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    required
                  />

                  <Input
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Your state"
                    required
                  />

                  <Input
                    label="Preferred City"
                    name="preferredCity"
                    value={form.preferredCity}
                    onChange={handleChange}
                    placeholder="Franchise city"
                    required
                  />

                  <Input
                    label="Preferred Location"
                    name="preferredLocation"
                    value={form.preferredLocation}
                    onChange={handleChange}
                    placeholder="Area / locality"
                    required
                  />

                  <Input
                    label="Preferred Area"
                    name="preferredArea"
                    value={form.preferredArea}
                    onChange={handleChange}
                    placeholder="Optional"
                  />

                </div>

                {/* BUSINESS */}
                <div className="border-t border-slate-200 pt-6">

                  <h3 className="text-base font-semibold text-slate-900">
                    Business profile
                  </h3>

                  <div className="mt-4 space-y-4">

                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        name="ownsBusiness"
                        checked={form.ownsBusiness}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-slate-300 accent-accent"
                      />

                      <span className="text-sm text-slate-700">
                        I currently own or operate a business
                      </span>
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2">

                      <Input
                        label="Business Name"
                        name="currentBusinessName"
                        value={form.currentBusinessName}
                        onChange={handleChange}
                        placeholder="If applicable"
                      />

                      <Input
                        label="Business Type"
                        name="currentBusinessType"
                        value={form.currentBusinessType}
                        onChange={handleChange}
                        placeholder="Retail / Trading / Other"
                      />

                    </div>

                    <Input
                      label="Business Experience"
                      name="businessExperience"
                      value={form.businessExperience}
                      onChange={handleChange}
                      placeholder="Years / relevant experience"
                    />

                  </div>
                </div>

                {/* FRANCHISE DETAILS */}
                <div className="border-t border-slate-200 pt-6">

                  <h3 className="text-base font-semibold text-slate-900">
                    Franchise plans
                  </h3>

                  <div className="mt-4 grid gap-5 sm:grid-cols-2">

                    <Select
                      label="Investment Capacity"
                      name="investmentCapacity"
                      value={form.investmentCapacity}
                      onChange={handleChange}
                      required
                      options={[
                        "Below ₹10 Lakhs",
                        "₹10–25 Lakhs",
                        "₹25–50 Lakhs",
                        "₹50 Lakhs–₹1 Crore",
                        "Above ₹1 Crore",
                      ]}
                    />

                    <Select
                      label="Store Type"
                      name="storeType"
                      value={form.storeType}
                      onChange={handleChange}
                      required
                      options={[
                        "Retail Store",
                        "Shopping Centre / Mall",
                        "High Street",
                        "Other",
                      ]}
                    />

                    <Select
                      label="Expected Start Timeline"
                      name="startTimeline"
                      value={form.startTimeline}
                      onChange={handleChange}
                      required
                      options={[
                        "Within 3 months",
                        "3–6 months",
                        "6–12 months",
                        "More than 12 months",
                      ]}
                    />

                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Additional Information
                  </label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us anything else about your franchise plans..."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#F59E0B]/10"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-600/10 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {submitted && (
                  <div className="rounded-xl border border-[#0EA5E9] bg-slate-50 px-4 py-3 text-sm text-[#0EA5E9]">
                    Your franchise enquiry has been submitted
                    successfully. Our team will contact you soon.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Submitting..."
                    : "Submit Franchise Enquiry"}

                  {!loading && <ArrowRight size={17} />}
                </button>

                <p className="text-center text-xs leading-5 text-slate-500">
                  By submitting this form, you agree to be contacted
                  by the SW Hub team regarding the retail franchise
                  opportunity.
                </p>

              </form>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}


/* ---------------- COMPONENTS ---------------- */

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-slate-50 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-[#0EA5E9]">
        {icon}
      </div>

      <h3 className="mt-5 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}


function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6">
      <span className="text-xs font-bold tracking-widest text-[#0EA5E9]">
        {number}
      </span>

      <h3 className="mt-3 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}


function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-[#0EA5E9]">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#F59E0B]/10"
      />
    </div>
  );
}


function Select({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-[#0EA5E9]">*</span>
        )}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#F59E0B]/10"
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}