"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type Booking,
  getBookings,
  fmt$,
  fmtDateShort,
  getBookingBalance,
  getTotalPaid,
  isOverdue,
} from "@/lib/sea-pay";

async function handleLogout() {
  await fetch("/api/admin-auth", { method: "DELETE" });
  window.location.href = "/admin/login";
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.ship.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const totalRevenue = bookings.reduce((s, b) => s + b.totalPrice, 0);
  const totalCollected = bookings.reduce((s, b) => s + getTotalPaid(b), 0);
  const overdueBookings = bookings.filter((b) =>
    b.paymentPlan.some((p) => isOverdue(p))
  ).length;

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-blue-300 text-sm font-semibold uppercase tracking-wide mb-1">
                Cruises from Galveston
              </div>
              <h1 className="text-3xl font-extrabold">Sea Pay Admin</h1>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/admin/room-blocks"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-3 rounded-full transition-all"
              >
                🛏️ Room Blocks
              </Link>
              <Link
                href="/admin/new-booking"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg"
              >
                + New Booking
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-3 rounded-full transition-all text-sm"
              >
                🔒 Log Out
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total Bookings", value: bookings.length, icon: "📋" },
              { label: "Total Revenue", value: fmt$(totalRevenue), icon: "💰" },
              { label: "Collected", value: fmt$(totalCollected), icon: "✅" },
              {
                label: "Overdue",
                value: overdueBookings,
                icon: "⚠️",
                alert: overdueBookings > 0,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl p-4 ${
                  stat.alert ? "bg-red-600" : "bg-white/10"
                }`}
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-extrabold">{stat.value}</div>
                <div className="text-blue-200 text-xs font-semibold mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search name, booking #, ship…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {["all", "pending", "confirmed", "paid", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                filter === f
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">🚢</div>
            <p className="text-gray-400 text-lg font-bold">No bookings yet</p>
            <Link
              href="/admin/new-booking"
              className="mt-4 inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-full text-sm"
            >
              Create First Booking
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => {
              const balance = getBookingBalance(b);
              const hasOverdue = b.paymentPlan.some((p) => isOverdue(p));
              return (
                <Link
                  key={b.id}
                  href={`/admin/bookings/${b.id}`}
                  className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        🚢
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-blue-900 text-base">
                            {b.customerName}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {b.bookingNumber}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColor[b.status]}`}
                          >
                            {b.status}
                          </span>
                          {hasOverdue && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                              ⚠️ Overdue
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 text-sm mt-0.5">
                          {b.ship} — {b.itinerary}
                        </div>
                        <div className="text-gray-400 text-xs mt-0.5">
                          Sailing {fmtDateShort(b.sailingDate)} ·{" "}
                          {b.numberOfGuests} guest
                          {b.numberOfGuests !== 1 ? "s" : ""} ·{" "}
                          {b.cabinType}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-blue-900">
                        {fmt$(b.totalPrice)}
                      </div>
                      <div
                        className={`text-sm font-bold ${
                          balance === 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {balance === 0
                          ? "✅ Paid in Full"
                          : `${fmt$(balance)} remaining`}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Created {fmtDateShort(b.createdAt.split("T")[0])}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
