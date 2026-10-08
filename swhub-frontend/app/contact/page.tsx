import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageSquare, ShieldCheck, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full -blue- px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            Customer Care & Helpdesk
          </span>
          <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Contact SW Hub
          </h1>
          <p className="mt-3 text-slate-600 max-w-lg mx-auto text-sm md:text-base">
            Have a question about your grocery delivery, return, or franchise inquiry? We are here to assist you 7 days a week.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-primary mb-4">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-slate-900">Phone Support</h3>
            <p className="text-xs text-slate-500 mt-1">Mon - Sun: 7:00 AM - 10:00 PM</p>
            <a href="tel:+919876543210" className="mt-4 font-mono font-bold text-sm text-primary hover:underline">
              +91 9876543210
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-primary mb-4">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-slate-900">Email Support</h3>
            <p className="text-xs text-slate-500 mt-1">Average response time: 2 hours</p>
            <a href="mailto:support@swhub.com" className="mt-4 font-semibold text-sm text-primary hover:underline">
              support@swhub.com
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-primary mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-slate-900">Headquarters</h3>
            <p className="text-xs text-slate-500 mt-1">Distribution & Fulfillment</p>
            <span className="mt-4 text-xs font-medium text-slate-700">
              SW Hub Retail Logistics, Mumbai, India
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl -blue- text-primary mb-4">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">100% Customer Satisfaction Promise</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
            Not happy with the freshness of groceries or condition of household items? Request a swift replacement or instant refund directly through your order history.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
            <Link
              href="/franchise"
              className="inline-flex items-center gap-2 rounded-xl border border-primary bg-slate-50 px-6 py-3 text-sm font-bold text-primary transition hover:-blue-"
            >
              Franchise Inquiries
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
