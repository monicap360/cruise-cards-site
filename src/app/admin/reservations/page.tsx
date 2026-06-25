"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type Reservation,
  type ReservationStatus,
  getReservations,
  updateReservationStatus,
  isActive,
  fmtDate,
  fmtTime,
  todayStr,
  SERVICE_ICON,
  STATUS_COLOR,
  STATUS_LABEL,
  RESERVATION_STATUSES,
} from "@/lib/reservations";

const QUICK_NEXT: Partial<Record<ReservationStatus, ReservationStatus>> = {
  requested: "reserved",
  reserved: "checked-in",
  "checked-in": "in-service",
  "in-service": "completed",
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<"today" | "upcoming" | "all">(
    "today"
  );
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await getReservations();
    setReservations(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const today = todayStr();

  async function quickAdvance(r: Reservation, next: ReservationStatus) {
    setReservations((rs) =>
      rs.map((x) => (x.id === r.id ? { ...x, status: next } : x))
    );
    await updateReservationStatus(r.id, next);
  }

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const s = search.toLowerCase();
      const matchSearch =
        !s ||
        r.guestName.toLowerCase().includes(s) ||
        r.reservationNumber.toLowerCase().includes(s) ||
        r.serviceType.toLowerCase().includes(s) ||
        (r.guestPhone ?? "").toLowerCase().includes(s);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      const matchDate =
        dateFilter === "all" ||
        (dateFilter === "today" && r.reservationDate === today) ||
        (dateFilter === "upcoming" && r.reservationDate >= today);
      return matchSearch && matchStatus && matchDate;
    });
  }, [reservations, search, statusFilter, dateFilter, today]);

  // Sort the visible list by date then time ascending for the desk view
  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        if (a.reservationDate !== b.reservationDate)
          return a.reservationDate.localeCompare(b.reservationDate);
        return (a.reservationTime || "").localeCompare(b.reservationTime || "");
      }),
    [filtered]
  );

  const todays = reservations.filter((r) => r.reservationDate === today);
  const stats = {
    newRequests: reservations.filter((r) => r.status === "requested").length,
    today: todays.length,
    inService: todays.filter((r) => r.status === "in-service").length,
    completed: todays.filter((r) => r.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Link
                href="/admin"
                className="text-blue-300 hover:text-white text-sm font-semibold"
              >
                ← Admin
              </Link>
              <div className="text-blue-300 text-sm font-semibold uppercase tracking-wide mb-1 mt-2">
                Cruise Experience Center
              </div>
              <h1 className="text-3xl font-extrabold">Front Desk Reservations</h1>
            </div>
            <Link
              href="/admin/reservations/new"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg"
            >
              + New Reservation
            </Link>
          </div>

          {/* Today stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              {
                label: "New Online Requests",
                value: stats.newRequests,
                icon: "🆕",
                alert: stats.newRequests > 0,
              },
              { label: "Today's Reservations", value: stats.today, icon: "📅" },
              { label: "In Service", value: stats.inService, icon: "🛎️" },
              { label: "Completed Today", value: stats.completed, icon: "✅" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl p-4 ${stat.alert ? "bg-red-600" : "bg-white/10"}`}
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

      {/* List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Search guest, reservation #, service, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {(["today", "upcoming", "all"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                dateFilter === d
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", ...RESERVATION_STATUSES].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                statusFilter === f
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f === "all"
                ? "All Statuses"
                : STATUS_LABEL[f as ReservationStatus]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-400 font-bold">
            Loading reservations…
          </div>
        ) : sorted.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">🛎️</div>
            <p className="text-gray-400 text-lg font-bold">
              No reservations {dateFilter === "today" ? "for today" : "found"}
            </p>
            <Link
              href="/admin/reservations/new"
              className="mt-4 inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-full text-sm"
            >
              Create a Reservation
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((r) => {
              const next = QUICK_NEXT[r.status];
              return (
                <div
                  key={r.id}
                  className={`bg-white rounded-2xl shadow-sm border p-5 transition-shadow hover:shadow-md ${
                    isActive(r) ? "border-gray-100" : "border-gray-100 opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <Link
                      href={`/admin/reservations/${r.id}`}
                      className="flex items-center gap-4 flex-1 min-w-0"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {SERVICE_ICON[r.serviceType] ?? "⚓"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-blue-900 text-base">
                            {r.guestName}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {r.reservationNumber}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[r.status]}`}
                          >
                            {STATUS_LABEL[r.status]}
                          </span>
                          {r.idVerified && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              🪪 ID ✓
                            </span>
                          )}
                        </div>
                        <div className="text-gray-600 text-sm mt-0.5 font-semibold">
                          {r.serviceType}
                          {r.partySize > 1 && (
                            <span className="text-gray-400 font-normal">
                              {" "}
                              · party of {r.partySize}
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 text-xs mt-0.5">
                          {fmtDate(r.reservationDate)}
                          {r.reservationTime ? ` · ${fmtTime(r.reservationTime)}` : ""}
                          {r.agentName ? ` · ${r.agentName}` : ""}
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {next && (
                        <button
                          onClick={() => quickAdvance(r, next)}
                          className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-full transition-all"
                        >
                          → {STATUS_LABEL[next]}
                        </button>
                      )}
                      <Link
                        href={`/admin/reservations/${r.id}`}
                        className="text-blue-600 hover:text-blue-800 text-xs font-bold px-3 py-2"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
