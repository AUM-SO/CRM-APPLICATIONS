"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight, UserPlus,
} from "lucide-react";
import type { Customer } from "@/types/customer";

type SortField = "name" | "total_spend" | "number_of_purchases" | "status" | "last_activity";

const LIMIT = 20;

const statusColor: Record<string, string> = {
  Active: "bg-[#38A169]/15 text-[#38A169]",
  Inactive: "bg-gray-100 text-gray-500",
  Pending: "bg-[#D69E2E]/15 text-[#D69E2E]",
};

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      search: debouncedSearch,
      sortBy,
      order,
      page: String(page),
      limit: String(LIMIT),
    });
    const res = await fetch(`/api/customers?${params}`);
    const json = await res.json();
    setCustomers(json.data ?? []);
    setTotal(json.total ?? 0);
    setTotalPages(json.totalPages ?? 1);
    setLoading(false);
  }, [debouncedSearch, sortBy, order, page]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, order]);

  function toggleSort(field: SortField) {
    if (sortBy === field) {
      setOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortBy !== field) return <ArrowUpDown size={13} className="text-gray-400" />;
    return order === "asc"
      ? <ArrowUp size={13} className="text-[#024F42]" />
      : <ArrowDown size={13} className="text-[#024F42]" />;
  }

  const from = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const to = Math.min(page * LIMIT, total);

  return (
    <main className="flex-1 px-4 md:px-6 py-6">
      {/* Page title + Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#024F42]">Customer List</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total.toLocaleString()} customers total
          </p>
        </div>
        <button
          type="button"
          onClick={() => {}}
          className="inline-flex items-center gap-2 rounded-lg bg-[#024F42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#024F42]/90 transition-colors shadow-sm"
        >
          <UserPlus size={15} />
          Add New Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name, company or salesperson…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm placeholder-gray-400 outline-none focus:border-[#024F42] focus:ring-2 focus:ring-[#024F42]/20 transition"
        />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7FCF8] border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <button
                    onClick={() => toggleSort("name")}
                    className="flex items-center gap-1.5 hover:text-[#024F42] transition-colors"
                  >
                    Customer <SortIcon field="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Salesperson
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <button
                    onClick={() => toggleSort("status")}
                    className="flex items-center gap-1.5 hover:text-[#024F42] transition-colors"
                  >
                    Status <SortIcon field="status" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                  <button
                    onClick={() => toggleSort("total_spend")}
                    className="flex items-center gap-1.5 hover:text-[#024F42] transition-colors ml-auto"
                  >
                    Total Spend <SortIcon field="total_spend" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                  <button
                    onClick={() => toggleSort("number_of_purchases")}
                    className="flex items-center gap-1.5 hover:text-[#024F42] transition-colors ml-auto"
                  >
                    Purchases <SortIcon field="number_of_purchases" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">
                  <button
                    onClick={() => toggleSort("last_activity")}
                    className="flex items-center gap-1.5 hover:text-[#024F42] transition-colors"
                  >
                    Last Activity <SortIcon field="last_activity" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-gray-100 rounded" />
                          <div className="h-2.5 w-20 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="h-3 w-24 bg-gray-100 rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-5 w-14 bg-gray-100 rounded-full" />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="h-3 w-20 bg-gray-100 rounded ml-auto" />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="h-3 w-10 bg-gray-100 rounded ml-auto" />
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="h-3 w-24 bg-gray-100 rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-7 w-20 bg-gray-100 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[#F7FCF8] transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#024F42] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {c.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1A202C] truncate">{c.name}</p>
                          <p className="text-xs text-gray-400 truncate">{c.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {c.salesperson}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[c.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[#1A202C] font-medium hidden lg:table-cell">
                      ฿{c.total_spend.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 hidden lg:table-cell">
                      {c.number_of_purchases}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden xl:table-cell">
                      {new Date(c.last_activity).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => router.push(`/customers/${c.id}`)}
                        className="inline-flex items-center rounded-lg border border-[#024F42] px-3 py-1 text-xs font-semibold text-[#024F42] hover:bg-[#024F42] hover:text-white transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
            <span>
              Showing {from}–{to} of {total.toLocaleString()}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 font-medium text-[#024F42]">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
