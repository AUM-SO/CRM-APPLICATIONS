"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Phone, Building2, CalendarDays,
  User, CreditCard, ShoppingBag, TrendingUp, Activity,
} from "lucide-react";
import type { Customer } from "@/types/customer";

const statusColor: Record<string, string> = {
  Active: "bg-[#38A169]/15 text-[#38A169] border-[#38A169]/30",
  Inactive: "bg-gray-100 text-gray-500 border-gray-200",
  Pending: "bg-[#D69E2E]/15 text-[#D69E2E] border-[#D69E2E]/30",
};

const creditColor: Record<string, string> = {
  "No Credit": "bg-gray-100 text-gray-500 border-gray-200",
  "Good Standing": "bg-[#38A169]/15 text-[#38A169] border-[#38A169]/30",
  "Excellent": "bg-[#024F42]/15 text-[#024F42] border-[#024F42]/30",
  "Overdue": "bg-red-50 text-red-600 border-red-200",
  "Credit Hold": "bg-[#D69E2E]/15 text-[#D69E2E] border-[#D69E2E]/30",
};

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="mt-0.5 text-[#80B157] flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <div className="text-sm font-semibold text-[#1A202C] mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-start gap-4">
      <div className="p-2.5 rounded-lg bg-[#024F42]/10 text-[#024F42] flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-[#1A202C] mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/customers/${id}`);
      if (!res.ok) { setNotFound(true); setLoading(false); return; }
      const data = await res.json();
      setCustomer(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-[#024F42] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !customer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-gray-500 text-lg">Customer not found.</p>
        <button
          onClick={() => router.push("/customers")}
          className="text-[#024F42] font-semibold hover:underline"
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 px-4 md:px-6 py-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/customers")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#024F42] hover:text-[#80B157] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to List
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#024F42] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {customer.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-[#1A202C]">{customer.name}</h1>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor[customer.status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
                {customer.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
              <Building2 size={13} className="text-[#80B157]" />
              {customer.company}
            </p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
              <CalendarDays size={12} className="text-[#80B157]" />
              Active since{" "}
              {new Date(customer.active_since).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-xs font-semibold ${creditColor[customer.credit_status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
              <CreditCard size={12} />
              {customer.credit_status}
            </span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Total Spend"
          value={`฿${customer.total_spend.toLocaleString()}`}
        />
        <StatCard
          icon={<ShoppingBag size={20} />}
          label="Number of Purchases"
          value={String(customer.number_of_purchases)}
        />
        <StatCard
          icon={<Activity size={20} />}
          label="Last Activity"
          value={new Date(customer.last_activity).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          sub={new Date(customer.last_activity).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Contact & Info */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-[#024F42] uppercase tracking-wider mb-1">
            Contact Information
          </h2>
          <div className="divide-y divide-gray-50">
            <InfoRow icon={<Mail size={16} />} label="Email" value={<a href={`mailto:${customer.email}`} className="hover:text-[#80B157] transition-colors">{customer.email}</a>} />
            <InfoRow icon={<Phone size={16} />} label="Phone" value={<a href={`tel:${customer.phone}`} className="hover:text-[#80B157] transition-colors">{customer.phone}</a>} />
            <InfoRow icon={<Building2 size={16} />} label="Company" value={customer.company} />
            <InfoRow icon={<User size={16} />} label="Salesperson" value={customer.salesperson} />
            <InfoRow
              icon={<CalendarDays size={16} />}
              label="Active Since"
              value={new Date(customer.active_since).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            />
            <InfoRow
              icon={<CreditCard size={16} />}
              label="Credit Status"
              value={
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${creditColor[customer.credit_status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
                  {customer.credit_status}
                </span>
              }
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-[#024F42] uppercase tracking-wider mb-4">
            Recent Activity
          </h2>
          <ol className="relative border-l-2 border-[#024F42]/15 space-y-5 pl-5">
            {customer.recent_activity.map((act, idx) => (
              <li key={idx} className="relative">
                <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#80B157] border-2 border-white" />
                <p className="text-sm font-semibold text-[#1A202C] leading-tight">{act.action}</p>
                <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}
