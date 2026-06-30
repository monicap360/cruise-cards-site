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

const TOOLS = [
  { href: "/admin/inbox", label: "📥 Online Requests" },
  { href: "/admin/customers", label: "📇 Customers (CRM)" },
  { href: "/admin/tickets", label: "🎫 Support Tickets" },
  { href: "/admin/vault", label: "🔐 Password Vault" },
  { href: "/admin/hotel-rfp", label: "🏨 Hotel RFP" },
  { href: "/admin/reservations", label: "🛎️ Front Desk" },
  { href: "/admin/departures", label: "🛳️ Departures" },
  { href: "/admin/sales", label: "📈 Sales" },
  { href: "/admin/room-blocks", label: "🛏️ Room Blocks" },
  { href: "/admin/waivers", label: "⚖️ Waivers" },
  { href: "/admin/offers", label: "🎁 Offers" },
  { href: "/admin/rates", label: "💲 Rates" },
  { href: "/admin/credits", label: "💳 Credits" },
  { href: "/admin/accounting", label: "📊 Accounting" },
  { href: "/admin/contacts", label: "📇 Comm Log" },
  { href: "/admin/documents", label: "📄 Documents" },
  { href: "/admin/groups", label: "👥 Groups" },
  { href: "/admin/group-deposits", label: "🏦 Group Deposits" },
  { href: "/admin/signups", label: "📝 Group Signups" },
  { href: "/admin/rfp", label: "📩 Agent RFPs" },
  { href: "/admin/partners", label: "🤝 Partners" },
  { href: "/admin/quotes", label: "📝 Quotes" },
  { href: "/admin/invoice", label: "🧾 Invoice" },
  { href: "/admin/notify", label: "✉️ Updates" },
  { href: "/admin/social", label: "📣 Social" },
  { href: "/admin/outreach", label: "🤝 Outreach" },
  { href: "/admin/deep-dive", label: "📰 Deep-Dive" },
  { href: "/admin/social-playbook", label: "📈 Growth Playbook" },
  { href: "/admin/activity", label: "📡 Activity" },
  { href: "/admin/tasks", label: "✅ Tasks" },
];

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getBookings().then((data) => setBookings(data));
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
    pending: "bg-yellow-400/15 text-yellow-300 border border-yellow-400/25",
    confirmed: "bg-sky-500/15 text-sky-300 border border-sky-400/25",
    paid: "bg-green-500/15 text-green-300 border border-green-400/25",
    cancelled: "bg-red-500/15 text-red-300 border border-red-400/25",
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1">
                {"// Cruises from Galveston · Staff"}
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
                Sea Pay Admin
              </h1>
            </div>
            <div className="flex gap-2 flex-wrap">
              {TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 text-white/80 hover:text-white font-semibold px-4 py-2.5 rounded-full transition-all text-[13px]"
                >
                  {t.label}
                </Link>
              ))}
              <Link
                href="/admin/new-booking"
                className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all text-xs"
              >
                + New Booking
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-semibold px-4 py-2.5 rounded-full transition-all text-[13px]"
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
                className={`rounded-2xl p-4 border ${
                  stat.alert
                    ? "bg-red-500/15 border-red-400/30"
                    : "bg-[#0b1020] border-white/10"
                }`}
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-extrabold text-holo">{stat.value}</div>
                <div className="text-white/45 label-mono text-[10px] uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bookings list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search name, booking #, ship…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
          />
          {["all", "pending", "confirmed", "paid", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                filter === f
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-16 text-center">
            <div className="text-6xl mb-4">🚢</div>
            <p className="text-white/45 text-lg font-bold">No bookings yet</p>
            <Link
              href="/admin/new-booking"
              className="mt-4 inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-6 py-3 rounded-full text-sm"
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
                  className="block bg-[#0b1020] rounded-2xl border border-white/10 p-5 hover:border-sky-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sky-500/15 border border-sky-400/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        🚢
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-white text-base">
                            {b.customerName}
                          </span>
                          <span className="text-xs text-white/40 font-mono">
                            {b.bookingNumber}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColor[b.status]}`}
                          >
                            {b.status}
                          </span>
                          {hasOverdue && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-400/25">
                              ⚠️ Overdue
                            </span>
                          )}
                        </div>
                        <div className="text-white/55 text-sm mt-0.5">
                          {b.ship} — {b.itinerary}
                        </div>
                        <div className="text-white/35 text-xs mt-0.5">
                          Sailing {fmtDateShort(b.sailingDate)} ·{" "}
                          {b.numberOfGuests} guest
                          {b.numberOfGuests !== 1 ? "s" : ""} · {b.cabinType}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-holo">
                        {fmt$(b.totalPrice)}
                      </div>
                      <div
                        className={`text-sm font-bold ${
                          balance === 0 ? "text-green-300" : "text-red-300"
                        }`}
                      >
                        {balance === 0
                          ? "✅ Paid in Full"
                          : `${fmt$(balance)} remaining`}
                      </div>
                      <div className="text-white/35 text-xs">
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
