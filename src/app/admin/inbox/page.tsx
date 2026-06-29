"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const MODE_META: Record<string, { label: string; icon: string }> = {
  booking: { label: "Cabin booking", icon: "🛏️" },
  hold: { label: "Room hold", icon: "⏳" },
  transportation: { label: "Transportation", icon: "🚐" },
  parking: { label: "Cruise parking", icon: "🅿️" },
  "free-cruise": { label: "Free cruise", icon: "🎁" },
  "driver-application": { label: "Driver application", icon: "🪪" },
  rebook: { label: "Rebooking", icon: "🔄" },
  question: { label: "Question", icon: "💬" },
  appointment: { label: "Appointment", icon: "📅" },
  inquiry: { label: "Inquiry", icon: "✉️" },
  rfp: { label: "Agent group RFP", icon: "📩" },
  "rooming-list": { label: "Rooming list", icon: "🧾" },
  waitlist: { label: "Waitlist request", icon: "📋" },
  "room-move": { label: "Room move request", icon: "🛏️" },
  "guest-change": { label: "Guest change request", icon: "👤" },
  "name-correction": { label: "Name correction", icon: "✏️" },
  cancellation: { label: "Cancellation request", icon: "🚫" },
  "booking-change": { label: "Booking change", icon: "🔧" },
  "group-signup": { label: "Group signup", icon: "🚢" },
};

type Req = {
  id: string;
  name: string;
  email: string;
  phone: string;
  ship: string;
  sailDate: string;
  cabin: string;
  mode: string;
  message: string;
  confirm: string;
  status: string;
  createdAt: string;
};

function fmt(d: string): string {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function InboxPage() {
  const [items, setItems] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"new" | "handled" | "all">("new");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [a, setA] = useState({ name: "", phone: "", email: "", ship: "", date: "", type: "waitlist", notes: "" });
  const [addBusy, setAddBusy] = useState(false);

  async function addEntry() {
    if (!a.name.trim() || (!a.phone.trim() && !a.email.trim())) {
      alert("Add a name and a phone or email.");
      return;
    }
    setAddBusy(true);
    const labelMap: Record<string, string> = { waitlist: "WAITLIST", callback: "CALLBACK REQUEST", lead: "LEAD" };
    const row = {
      confirm_number: a.type === "waitlist" ? "WL-" + Math.random().toString(36).toUpperCase().slice(2, 8) : "",
      first_name: a.name, last_name: "", email: a.email, phone: a.phone,
      ship: a.ship, sail_date: a.date, rate_type: "", guests: "", cabin_type: "", crew: "",
      message: `${labelMap[a.type] || "LEAD"} (added by office)${a.ship ? ` — ${a.ship}` : ""}${a.date ? ` · ${a.date}` : ""}. ${a.notes}`.trim(),
      appt_date: "", appt_time: "",
    };
    const wantMode = a.type === "callback" ? "appointment" : a.type === "waitlist" ? "waitlist" : "inquiry";
    let { error } = await supabase.from("inquiries").insert({ ...row, mode: wantMode });
    if (error) ({ error } = await supabase.from("inquiries").insert({ ...row, mode: "inquiry" }));
    setAddBusy(false);
    if (error) { alert("Couldn't add: " + error.message); return; }
    setA({ name: "", phone: "", email: "", ship: "", date: "", type: a.type, notes: "" });
    setShowAdd(false);
    refresh();
  }

  async function refresh() {
    const { data } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(
      (data ?? []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        name: `${(r.first_name as string) ?? ""} ${(r.last_name as string) ?? ""}`.trim(),
        email: (r.email as string) ?? "",
        phone: (r.phone as string) ?? "",
        ship: (r.ship as string) ?? "",
        sailDate: (r.sail_date as string) ?? "",
        cabin: (r.cabin_type as string) ?? "",
        mode: (r.mode as string) ?? "inquiry",
        message: (r.message as string) ?? "",
        confirm: (r.confirm_number as string) ?? "",
        status: (r.status as string) ?? "new",
        createdAt: (r.created_at as string) ?? "",
      }))
    );
    setLoading(false);
  }
  useEffect(() => {
    refresh();
  }, []);

  async function setStatus(id: string, status: string) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await supabase.from("inquiries").update({ status }).eq("id", id);
  }

  const isHandled = (r: Req) => r.status === "handled" || r.status === "done" || r.status === "closed";

  const typesPresent = useMemo(
    () => Array.from(new Set(items.map((r) => r.mode))).sort(),
    [items]
  );

  const shown = useMemo(() => {
    return items.filter((r) => {
      if (statusFilter === "new" && isHandled(r)) return false;
      if (statusFilter === "handled" && !isHandled(r)) return false;
      if (typeFilter !== "all" && r.mode !== typeFilter) return false;
      return true;
    });
  }, [items, statusFilter, typeFilter]);

  const newCount = items.filter((r) => !isHandled(r)).length;

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1 mt-2">
            {"// Online Requests"}
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Website Inbox</h1>
          <p className="text-white/55 text-sm max-w-2xl mt-1">
            Everything submitted on the website — bookings, waitlists, rooming lists, room
            moves, cancellations, rebookings, group RFPs, transportation, and questions —
            lands here for front desk and the owner. Mark each one handled as you work it.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#0b1020] border border-white/10 rounded-2xl px-5 py-3">
            <span className="text-2xl font-extrabold text-holo">{newCount}</span>
            <span className="text-white/45 label-mono text-[10px] uppercase tracking-wider">New / unhandled</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
        {/* Add a lead / waitlist / callback by hand */}
        <div>
          <button onClick={() => setShowAdd((v) => !v)} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">
            {showAdd ? "× Close" : "➕ Add lead / waitlist / callback"}
          </button>
          {showAdd && (
            <div className="mt-3 bg-[#0b1020] border border-white/10 rounded-2xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1">Type</label>
                  <select value={a.type} onChange={(e) => setA({ ...a, type: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-400/60">
                    <option value="waitlist" className="bg-[#0b1020]">Waitlist</option>
                    <option value="callback" className="bg-[#0b1020]">Phone-call request / callback</option>
                    <option value="lead" className="bg-[#0b1020]">Lead</option>
                  </select>
                </div>
                <input value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} placeholder="Name *" className="self-end w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
                <input value={a.phone} onChange={(e) => setA({ ...a, phone: e.target.value })} placeholder="Phone" className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
                <input value={a.email} onChange={(e) => setA({ ...a, email: e.target.value })} placeholder="Email" className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
                <input value={a.ship} onChange={(e) => setA({ ...a, ship: e.target.value })} placeholder="Ship (optional)" className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
                <input value={a.date} onChange={(e) => setA({ ...a, date: e.target.value })} placeholder="Sail date(s) — e.g. Jul 5 or 6, 2026" className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
                <textarea value={a.notes} onChange={(e) => setA({ ...a, notes: e.target.value })} placeholder="Notes" rows={2} className="sm:col-span-2 w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
              </div>
              <button onClick={addEntry} disabled={addBusy} className="mt-3 bg-sky-500 hover:bg-sky-400 text-white disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full">
                {addBusy ? "Adding…" : "Add to inbox"}
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {(["new", "handled", "all"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                statusFilter === s ? "bg-white text-black" : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
          <span className="w-px h-6 bg-white/10 mx-1" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-sky-400/60"
          >
            <option value="all" className="bg-[#0b1020]">All types</option>
            {typesPresent.map((m) => (
              <option key={m} value={m} className="bg-[#0b1020]">
                {(MODE_META[m]?.label ?? m)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-white/45">Loading…</p>
        ) : shown.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center text-white/45">
            {statusFilter === "new" ? "No new requests — you're all caught up. 🎉" : "Nothing here."}
          </div>
        ) : (
          <div className="space-y-2">
            {shown.map((r) => {
              const meta = MODE_META[r.mode] ?? MODE_META.inquiry;
              const handled = isHandled(r);
              return (
                <div key={r.id} className="bg-[#0b1020] rounded-xl border border-white/10 p-4">
                  <div className="flex items-start gap-3 flex-wrap">
                    <span className="text-2xl">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white">{r.name || r.email || "Guest"}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/25">
                          {meta.label}
                        </span>
                        {handled && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 border border-green-400/25">
                            Handled
                          </span>
                        )}
                        {r.confirm && <span className="text-white/40 font-mono text-xs">#{r.confirm}</span>}
                      </div>
                      <div className="text-white/50 text-xs mt-0.5 flex flex-wrap gap-x-2">
                        {r.email && <a href={`mailto:${r.email}`} className="text-sky-400 hover:text-sky-300">{r.email}</a>}
                        {r.phone && <a href={`tel:${r.phone}`} className="text-sky-400 hover:text-sky-300">{r.phone}</a>}
                        {r.ship && <span>· {r.ship}</span>}
                        {r.sailDate && <span>· sail {r.sailDate}</span>}
                        {r.cabin && <span>· {r.cabin}</span>}
                      </div>
                      {r.message && <div className="text-white/70 text-sm mt-1.5 whitespace-pre-wrap">{r.message}</div>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-white/35 text-xs mb-2">{fmt(r.createdAt)}</div>
                      {handled ? (
                        <button onClick={() => setStatus(r.id, "new")} className="text-white/50 hover:text-white text-xs font-bold">
                          Reopen
                        </button>
                      ) : (
                        <button
                          onClick={() => setStatus(r.id, "handled")}
                          className="bg-white text-black hover:bg-white/90 text-xs font-bold px-4 py-2 rounded-full"
                        >
                          Mark handled
                        </button>
                      )}
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
