"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type Reservation,
  type ReservationStatus,
  getReservations,
  updateReservationStatus,
  updateArrivalTasks,
  rescheduleReservation,
  isActive,
  fmtDate,
  fmtTime,
  todayStr,
  SERVICE_ICON,
  STATUS_COLOR,
  STATUS_LABEL,
  RESERVATION_STATUSES,
  ARRIVAL_TASKS,
} from "@/lib/reservations";
import FrontDeskCheckout from "@/components/FrontDeskCheckout";

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
  const [dateFilter, setDateFilter] = useState<"today" | "upcoming" | "all">("today");
  const [loading, setLoading] = useState(true);
  const [reschedId, setReschedId] = useState<string>("");
  const [reschedDate, setReschedDate] = useState("");
  const [reschedTime, setReschedTime] = useState("");
  const [checkoutId, setCheckoutId] = useState<string>("");

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
    setReservations((rs) => rs.map((x) => (x.id === r.id ? { ...x, status: next } : x)));
    await updateReservationStatus(r.id, next);
  }

  async function setStatus(r: Reservation, status: ReservationStatus) {
    setReservations((rs) => rs.map((x) => (x.id === r.id ? { ...x, status } : x)));
    await updateReservationStatus(r.id, status);
  }

  async function toggleTask(r: Reservation, key: string) {
    const tasks = { ...(r.arrivalTasks || {}), [key]: !r.arrivalTasks?.[key] };
    setReservations((rs) => rs.map((x) => (x.id === r.id ? { ...x, arrivalTasks: tasks } : x)));
    try { await updateArrivalTasks(r.id, tasks); } catch { /* arrival_tasks column may not exist yet */ }
  }

  function openReschedule(r: Reservation) {
    setReschedId(r.id);
    setReschedDate(r.reservationDate || today);
    setReschedTime(r.reservationTime || "");
  }
  async function saveReschedule(r: Reservation) {
    setReservations((rs) => rs.map((x) => (x.id === r.id ? { ...x, reservationDate: reschedDate, reservationTime: reschedTime } : x)));
    setReschedId("");
    await rescheduleReservation(r.id, reschedDate, reschedTime);
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
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <Link
                href="/admin"
                className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white"
              >
                ← Admin
              </Link>
              <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1 mt-2">
                {"// Cruise Experience Center"}
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
                Front Desk Reservations
              </h1>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link
                href="/admin/inbox"
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 text-white/80 hover:text-white font-semibold uppercase tracking-wider px-5 py-3 rounded-full transition-all text-xs"
              >
                📥 Online Requests
              </Link>
              <Link
                href="/admin/documents?scope=individual"
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 text-white/80 hover:text-white font-semibold uppercase tracking-wider px-5 py-3 rounded-full transition-all text-xs"
              >
                📎 Upload Doc
              </Link>
              <Link
                href="/admin/reservations/new"
                className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-6 py-3 rounded-full transition-all text-xs"
              >
                + New Reservation
              </Link>
            </div>
          </div>

          {/* Today stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "New Online Requests", value: stats.newRequests, icon: "🆕", alert: stats.newRequests > 0 },
              { label: "Today's Reservations", value: stats.today, icon: "📅" },
              { label: "In Service", value: stats.inService, icon: "🛎️" },
              { label: "Completed Today", value: stats.completed, icon: "✅" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl p-4 border ${
                  stat.alert ? "bg-red-500/15 border-red-400/30" : "bg-[#0b1020] border-white/10"
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

      {/* List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Search guest, reservation #, service, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
          />
          {(["today", "upcoming", "all"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                dateFilter === d
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
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
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {f === "all" ? "All Statuses" : STATUS_LABEL[f as ReservationStatus]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-16 text-center text-white/45 font-bold">
            Loading reservations…
          </div>
        ) : sorted.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-16 text-center">
            <div className="text-6xl mb-4">🛎️</div>
            <p className="text-white/45 text-lg font-bold">
              No reservations {dateFilter === "today" ? "for today" : "found"}
            </p>
            <Link
              href="/admin/reservations/new"
              className="mt-4 inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-6 py-3 rounded-full text-sm"
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
                  className={`bg-[#0b1020] rounded-2xl border p-5 transition-colors hover:border-sky-400/40 ${
                    isActive(r) ? "border-white/10" : "border-white/10 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <Link
                      href={`/admin/reservations/${r.id}`}
                      className="flex items-center gap-4 flex-1 min-w-0"
                    >
                      <div className="w-12 h-12 bg-sky-500/15 border border-sky-400/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {SERVICE_ICON[r.serviceType] ?? "⚓"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-white text-base">
                            {r.guestName}
                          </span>
                          <span className="text-xs text-white/40 font-mono">
                            {r.reservationNumber}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[r.status]}`}
                          >
                            {STATUS_LABEL[r.status]}
                          </span>
                          {r.idVerified && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 border border-green-400/25">
                              🪪 ID ✓
                            </span>
                          )}
                        </div>
                        <div className="text-white/65 text-sm mt-0.5 font-semibold">
                          {r.serviceType}
                          {r.partySize > 1 && (
                            <span className="text-white/40 font-normal"> · party of {r.partySize}</span>
                          )}
                        </div>
                        <div className="text-white/35 text-xs mt-0.5">
                          {fmtDate(r.reservationDate)}
                          {r.reservationTime ? ` · ${fmtTime(r.reservationTime)}` : ""}
                          {r.agentName ? ` · ${r.agentName}` : ""}
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {r.status === "requested" ? (
                        <button
                          onClick={() => setStatus(r, "reserved")}
                          className="bg-green-500/20 text-green-200 border border-green-400/30 hover:bg-green-500/30 text-xs font-bold px-4 py-2 rounded-full transition-all"
                        >
                          ✓ Approve
                        </button>
                      ) : next ? (
                        <button
                          onClick={() => quickAdvance(r, next)}
                          className="bg-white text-black hover:bg-white/90 text-xs font-bold px-4 py-2 rounded-full transition-all"
                        >
                          → {STATUS_LABEL[next]}
                        </button>
                      ) : null}
                      <button
                        onClick={() => openReschedule(r)}
                        className="text-amber-300 hover:text-amber-200 text-xs font-bold px-3 py-2"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => setCheckoutId(checkoutId === r.id ? "" : r.id)}
                        className="text-sky-300 hover:text-sky-200 text-xs font-bold px-3 py-2"
                      >
                        💳 Checkout
                      </button>
                      <Link
                        href={`/admin/reservations/${r.id}`}
                        className="text-sky-400 hover:text-sky-300 text-xs font-bold px-3 py-2"
                      >
                        Open
                      </Link>
                    </div>
                  </div>

                  {reschedId === r.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-end gap-2">
                      <span className="label-mono text-[10px] uppercase tracking-wider text-amber-300/80 self-center">Reschedule to:</span>
                      <input type="date" value={reschedDate} onChange={(e) => setReschedDate(e.target.value)} className="bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-sky-400/60" />
                      <input type="time" value={reschedTime} onChange={(e) => setReschedTime(e.target.value)} className="bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-sky-400/60" />
                      <button onClick={() => saveReschedule(r)} className="bg-white text-black hover:bg-white/90 text-xs font-bold px-4 py-1.5 rounded-full">Save</button>
                      <button onClick={() => setReschedId("")} className="text-white/50 hover:text-white text-xs font-bold px-2">Cancel</button>
                    </div>
                  )}

                  {r.serviceType !== "Phone Call / Callback" && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2 items-center">
                      <span className="label-mono text-[10px] uppercase tracking-wider text-white/40 mr-1">Arrival:</span>
                      {ARRIVAL_TASKS.map((tk) => {
                        const done = !!r.arrivalTasks?.[tk.key];
                        return (
                          <button key={tk.key} onClick={() => toggleTask(r, tk.key)}
                            className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${done ? "bg-green-500/15 text-green-300 border-green-400/30" : "bg-white/5 text-white/50 border-white/15 hover:text-white"}`}>
                            {done ? "✓ " : ""}{tk.icon} {tk.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {checkoutId === r.id && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <FrontDeskCheckout reservation={r} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
