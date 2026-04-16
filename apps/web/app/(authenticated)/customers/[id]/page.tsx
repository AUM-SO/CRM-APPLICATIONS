"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  User,
  CreditCard,
  ShoppingBag,
  TrendingUp,
  Activity,
  Clock,
} from "lucide-react"
import type { Customer } from "@/types/customer"

const statusConfig: Record<
  Customer["status"],
  { dot: string; badgeHero: string }
> = {
  Active: {
    dot: "bg-[#38A169]",
    badgeHero: "bg-[#38A169]/15 text-[#38A169] border-[#38A169]/30",
  },
  Inactive: {
    dot: "bg-gray-400",
    badgeHero: "bg-gray-100 text-gray-500 border-gray-200",
  },
  Pending: {
    dot: "bg-[#D69E2E]",
    badgeHero: "bg-[#D69E2E]/15 text-[#D69E2E] border-[#D69E2E]/30",
  },
}

// Credit colors (on white background)
const creditColorBody: Record<Customer["credit_status"], string> = {
  "No Credit": "bg-gray-100 text-gray-500 border-gray-200",
  "Good Standing": "bg-[#38A169]/15 text-[#38A169] border-[#38A169]/30",
  Overdue: "bg-red-50 text-red-500 border-red-200",
  "Credit Hold": "bg-[#D69E2E]/15 text-[#D69E2E] border-[#D69E2E]/30",
  Excellent: "bg-[#024F42]/10 text-[#024F42] border-[#024F42]/20",
}

export default function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/customers/${id}`)
      if (!res.ok) {
        setNotFound(true)
        setLoading(false)
        return
      }
      const data = await res.json()
      setCustomer(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#024F42] border-t-transparent" />
      </div>
    )
  }

  if (notFound || !customer) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
        <p className="text-lg text-gray-400">Customer not found.</p>
        <button
          onClick={() => router.push("/customers")}
          className="text-sm font-semibold text-[#024F42] hover:underline"
        >
          ← Back to list
        </button>
      </div>
    )
  }

  const status = statusConfig[customer.status] ?? statusConfig["Inactive"]

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      {/* ── Hero Header ─────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-white px-4 pt-5 pb-0 md:px-8">
        {/* Back */}
        <button
          onClick={() => router.push("/customers")}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#024F42] transition-colors hover:text-[#80B157]"
        >
          <ArrowLeft size={15} />
          Back to List
        </button>

        {/* Profile row */}
        <div className="flex flex-col items-start gap-5 pb-6 sm:flex-row sm:items-end">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#024F42] text-2xl font-bold tracking-tight text-white shadow-sm">
              {customer.initials}
            </div>
            <span
              className={`absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white ${status.dot}`}
            />
          </div>

          {/* Name + meta */}
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-[#1A202C]">
                {customer.name}
              </h1>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${status.badgeHero}`}
              >
                {customer.status}
              </span>
            </div>
            <p className="mb-1 flex items-center gap-1.5 text-sm text-gray-500">
              <Building2 size={13} className="text-[#80B157]" />
              {customer.company}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-gray-400">
              <CalendarDays size={12} className="text-[#80B157]" />
              Customer since{" "}
              {new Date(customer.active_since).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Credit badge */}
          <div className="flex-shrink-0 sm:pb-1">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${creditColorBody[customer.credit_status]}`}
            >
              <CreditCard size={12} />
              {customer.credit_status}
            </span>
          </div>
        </div>

        {/* ── Stat strip (overlaps into body) ── */}
        <div className="-mx-0 grid grid-cols-3 overflow-hidden rounded-t-xl border border-gray-100 bg-white shadow-sm my-4">
          {[
            {
              icon: <TrendingUp size={16} className="text-[#024F42]" />,
              label: "Total Spend",
              value: `฿${customer.total_spend.toLocaleString()}`,
            },
            {
              icon: <ShoppingBag size={16} className="text-[#024F42]" />,
              label: "Purchases",
              value: String(customer.number_of_purchases),
            },
            {
              icon: <Activity size={16} className="text-[#024F42]" />,
              label: "Last Activity",
              value: new Date(customer.last_activity).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              ),
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`flex items-center gap-5 px-5 py-6 ${i < 2 ? "border-r border-gray-100" : ""}`}
            >
              <div className="flex-shrink-0 rounded-lg bg-[#024F42]/8 p-2">
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                  {stat.label}
                </p>
                <p className="truncate text-sm font-bold text-[#1A202C]">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="flex-1 px-4 pt-0 md:px-8">
        <div className="grid grid-cols-1 gap-5 pt-5 pb-8 lg:grid-cols-3">
          {/* Contact & Info */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4">
              <h2 className="text-sm font-bold text-[#1A202C]">
                Contact Information
              </h2>
              <span className="rounded-full bg-[#024F42]/8 px-2.5 py-1 text-[10px] font-semibold text-[#024F42]">
                ID #{customer.id}
              </span>
            </div>

            <div className="grid grid-cols-1 divide-y divide-gray-50 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {/* Left column */}
              <div className="divide-y divide-gray-50">
                <ContactItem icon={<Mail size={15} />} label="Email">
                  <a
                    href={`mailto:${customer.email}`}
                    className="block truncate text-[#024F42] transition-colors hover:text-[#80B157]"
                  >
                    {customer.email}
                  </a>
                </ContactItem>
                <ContactItem icon={<Phone size={15} />} label="Phone">
                  <a
                    href={`tel:${customer.phone}`}
                    className="transition-colors hover:text-[#024F42]"
                  >
                    {customer.phone}
                  </a>
                </ContactItem>
                <ContactItem icon={<Building2 size={15} />} label="Company">
                  {customer.company}
                </ContactItem>
              </div>
              {/* Right column */}
              <div className="divide-y divide-gray-50">
                <ContactItem icon={<User size={15} />} label="Salesperson">
                  {customer.salesperson}
                </ContactItem>
                <ContactItem
                  icon={<CalendarDays size={15} />}
                  label="Active Since"
                >
                  {new Date(customer.active_since).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </ContactItem>
                <ContactItem
                  icon={<CreditCard size={15} />}
                  label="Credit Status"
                >
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${creditColorBody[customer.credit_status]}`}
                  >
                    {customer.credit_status}
                  </span>
                </ContactItem>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4">
              <h2 className="text-sm font-bold text-[#1A202C]">
                Recent Activity
              </h2>
              <span className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-400">
                {customer.recent_activity.length} events
              </span>
            </div>

            <ol className="space-y-0 px-5 py-4">
              {customer.recent_activity.map((act, idx) => (
                <li key={idx} className="flex gap-3">
                  <div className="flex w-4 flex-shrink-0 flex-col items-center">
                    <div
                      className={`mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                        idx === 0
                          ? "bg-[#80B157] shadow-[0_0_0_3px_rgba(128,177,87,0.25)]"
                          : "border-2 border-[#024F42]/15 bg-[#024F42]/20"
                      }`}
                    />
                    {idx < customer.recent_activity.length - 1 && (
                      <div className="my-1 w-px flex-1 bg-gradient-to-b from-[#024F42]/15 to-transparent" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="cursor-default rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5 transition-colors hover:border-[#024F42]/15 hover:bg-[#024F42]/5">
                      <p className="text-sm leading-snug font-medium text-[#1A202C]">
                        {act.action}
                      </p>
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-gray-100 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-400">
                        <Clock size={9} />
                        {act.time}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </main>
  )
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 px-6 py-4">
      <div className="mt-0.5 flex-shrink-0 rounded-md bg-[#024F42]/8 p-1.5 text-[#024F42]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
          {label}
        </p>
        <div className="text-sm font-semibold text-[#1A202C]">{children}</div>
      </div>
    </div>
  )
}
