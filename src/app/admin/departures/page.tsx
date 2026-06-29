"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type Booking,
  getBookings,
  getBookingBalance,
  fmt$,
} from "@/lib/sea-pay";
import { supabase } from "@/lib/supabase";

type WebRequest = {
  id: string;
  name: string;
  ship: string;
  sailDate: string;
  cabin: string;
  createdAt: string;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

function fmtDay(d: string): string {
  if (!d) return "No date";
  const dt = new Date(d + "T12:00:00");
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-400/15 text-yellow-300 border border-yellow-400/25",
  confirmed: "bg-sky-500/15 text-sky-300 border border-sky-400/25",
  paid: "bg-green-500/15 text-green-300 border border-green-400/25",
  cancelled: "bg-red-500/15 text-red-300 border border-red-400/25",
};

export default function DeparturesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<WebRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"departures" | "returns">("departures");
  const [scope, setScope] = useState<"upcoming" | "all">("upcoming");

  useEffect(() => {
    getBookings().then((b) => {
      setBookings(b);
      setLoading(false);
    });
    supabase
      .from("inquiries")
      .select("id, first_name, last_name, ship, sail_date, cabin_type, created_at, mode")
      .eq("mode", "booking")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRequests(
          (data ?? []).map((r: Record<string, unknown>) => ({
            id: r.id as string,
            name: `${(r.first_name as string) ?? ""} ${(r.last_name as string) ?? ""}`.trim(),
            ship: (r.ship as string) ?? "",
            sailDate: (r.sail_date as string) ?? "",
            cabin: (r.cabin_type as string) ?? "",
            createdAt: (r.created_at as string) ?? "",
          }))
        );
      });
  }, []);

  const today = todayStr();

  const groups = useMemo(() => {
    const dateOf = (b: Booking) =>
      view === "departures" ? b.sailingDate : b.returnDate;
    const map = new Map<string, Booking[]>();
    bookings
      .filter((b) => b.status !== "cancelled")
      .filter((b) => {
        const d = dateOf(b);
        if (!d) return false;
        return scope === "all" ? true : d >= today;
      })
      .forEach((b) => {
        const d = dateOf(b);
        map.set(d, [...(map.get(d) ?? []), b]);
      });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [bookings, view, scope, today]);

  const pendingUpcoming = requests.filter(
    (r) => r.sailDate && r.sailDate >= today
  );

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin"
            className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white"
          >
            ← Admin
          </Link>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1 mt-2">
            {"// Departures & Returns"}
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
            Sailings Board
          </h1>
          <p className="text-white/55 text-sm max-w-2xl mt-1">
            Who&rsquo;s boarding and who&rsquo;s coming back — your cruise version of an
            arrivals/departures board, built from confirmed bookings.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Pending website requests */}
        <div className="bg-[#0b1020] rounded-2xl border border-yellow-400/25 p-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="label-mono text-[11px] uppercase tracking-wider text-yellow-300/90">
              {`// ${pendingUpcoming.length} pending website request${
                pendingUpcoming.length === 1 ? "" : "s"
              } — confirm into bookings`}
            </div>
            <Link href="/admin/activity" className="text-sky-400 hover:text-sky-300 text-xs font-bold">
              View all in Activity →
            </Link>
          </div>
          {pendingUpcoming.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {pendingUpcoming.slice(0, 6).map((r) => (
                <div key={r.id} className="text-sm text-white/70 flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold">{r.name || "Guest"}</span>
                  <span className="text-white/40">·</span>
                  <span>{r.ship || "—"}</span>
                  {r.cabin && <span className="text-white/40">· {r.cabin}</span>}
                  <span className="text-white/40">· sail {fmtDay(r.sailDate)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {(["departures", "returns"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                view === v
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {v === "departures" ? "🛳️ Departures" : "🏠 Returns"}
            </button>
          ))}
          <span className="w-px h-6 bg-white/10 mx-1" />
          {(["upcoming", "all"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                scope === s
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Board */}
        {loading ? (
          <p className="text-white/45">Loading…</p>
        ) : groups.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center text-white/45">
            No {scope === "upcoming" ? "upcoming " : ""}
            {view} yet. Confirmed bookings appear here by{" "}
            {view === "departures" ? "sail date" : "return date"}.
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map(([date, list]) => {
              const guests = list.reduce((s, b) => s + (b.numberOfGuests || 0), 0);
              const ships = Array.from(new Set(list.map((b) => b.ship))).join(", ");
              const isToday = date === today;
              return (
                <div key={date} className="bg-[#0b1020] rounded-2xl border border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between gap-3 flex-wrap px-5 py-3 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-white">{fmtDay(date)}</span>
                      {isToday && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                          Today
                        </span>
                      )}
                    </div>
                    <div className="text-white/50 text-xs">
                      {ships} · {list.length} cabin{list.length === 1 ? "" : "s"} · {guests} guest{guests === 1 ? "" : "s"}
                    </div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {list.map((b) => {
                      const bal = getBookingBalance(b);
                      return (
                        <Link
                          key={b.id}
                          href={`/admin/bookings/${b.id}`}
                          className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-white/5 flex-wrap"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white">{b.customerName}</span>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full capitalize ${statusColor[b.status] ?? "bg-white/10 text-white/60"}`}>
                                {b.status}
                              </span>
                            </div>
                            <div className="text-white/50 text-xs mt-0.5">
                              {b.ship} · {b.cabinType}
                              {b.cabinNumber ? ` ${b.cabinNumber}` : ""} · {b.numberOfGuests} guest
                              {b.numberOfGuests === 1 ? "" : "s"}
                              {view === "departures" && b.returnDate ? ` · returns ${fmtDay(b.returnDate)}` : ""}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${bal === 0 ? "text-green-300" : "text-red-300"}`}>
                              {bal === 0 ? "✅ Paid" : `${fmt$(bal)} due`}
                            </div>
                            <div className="text-white/35 text-[11px] font-mono">{b.bookingNumber}</div>
                          </div>
                        </Link>
                      );
                    })}
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
