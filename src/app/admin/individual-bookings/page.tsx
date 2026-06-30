"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type IndividualBooking,
  getIndividualBookings, saveIndividualBooking, deleteIndividualBooking,
  needsCheckin, newIBId,
} from "@/lib/individual-bookings";

const fmtDate = (d: string) => (d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "—");
const blank = (): IndividualBooking => ({ id: newIBId(), guestName: "", ship: "", sailDate: "", itinerary: "", bookingNumber: "", contact: "", checkinStatus: "Available", notes: "" });

function statusBadge(s: string) {
  if (/complete/i.test(s)) return "bg-green-500/15 text-green-300 border-green-400/30";
  if (/available/i.test(s)) return "bg-amber-400/15 text-amber-300 border-amber-400/30";
  return "bg-white/5 text-white/45 border-white/15";
}

export default function IndividualBookingsPage() {
  const [rows, setRows] = useState<IndividualBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [onlyNeeds, setOnlyNeeds] = useState(false);
  const [f, setF] = useState<IndividualBooking>(blank());
  const [showForm, setShowForm] = useState(false);

  async function load() { setLoading(true); setRows(await getIndividualBookings()); setLoading(false); }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!f.guestName.trim()) { alert("Guest name required."); return; }
    await saveIndividualBooking(f);
    setF(blank()); setShowForm(false); load();
  }
  async function remove(id: string) { if (confirm("Delete this booking?")) { await deleteIndividualBooking(id); load(); } }

  const shown = useMemo(() => {
    const s = search.toLowerCase();
    return rows.filter((r) =>
      (!onlyNeeds || needsCheckin(r)) &&
      (!s || `${r.guestName} ${r.ship} ${r.bookingNumber}`.toLowerCase().includes(s)));
  }, [rows, search, onlyNeeds]);

  const needCount = rows.filter(needsCheckin).length;
  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{"// Bookings"}</div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Individual Bookings</h1>
            <p className="text-white/55 text-sm">Client staterooms (non-group) — track sail dates & online check-in.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setF(blank()); setShowForm((v) => !v); }} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-4 py-2 rounded-full">{showForm ? "Close" : "+ Add"}</button>
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-4"><div className="text-2xl font-extrabold text-holo">{rows.length}</div><div className="text-white/45 text-[10px] uppercase tracking-wider label-mono mt-1">Total bookings</div></div>
          <div className={`rounded-2xl p-4 border ${needCount ? "bg-amber-400/10 border-amber-400/30" : "bg-[#0b1020] border-white/10"}`}><div className="text-2xl font-extrabold text-amber-300">{needCount}</div><div className="text-white/45 text-[10px] uppercase tracking-wider label-mono mt-1">Need check-in</div></div>
        </div>

        {showForm && (
          <div className="bg-[#0b1020] border border-sky-400/30 rounded-2xl p-5 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className={input} placeholder="Guest name *" value={f.guestName} onChange={(e) => setF({ ...f, guestName: e.target.value })} />
            <input className={input} placeholder="Ship" value={f.ship} onChange={(e) => setF({ ...f, ship: e.target.value })} />
            <input className={input} type="date" value={f.sailDate} onChange={(e) => setF({ ...f, sailDate: e.target.value })} />
            <input className={input} placeholder="Itinerary (e.g. 7-DAY Western Caribbean)" value={f.itinerary} onChange={(e) => setF({ ...f, itinerary: e.target.value })} />
            <input className={input} placeholder="Booking #" value={f.bookingNumber} onChange={(e) => setF({ ...f, bookingNumber: e.target.value })} />
            <input className={input} placeholder="Booking contact" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} />
            <input className={input} placeholder="Check-in status" value={f.checkinStatus} onChange={(e) => setF({ ...f, checkinStatus: e.target.value })} />
            <div className="sm:col-span-2 flex gap-2"><button onClick={save} className="bg-sky-600 hover:bg-sky-500 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">Save</button></div>
          </div>
        )}

        <div className="flex gap-2 mb-4 flex-wrap">
          <input className={`${input} flex-1 min-w-48`} placeholder="Search guest, ship, booking #…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={() => setOnlyNeeds((v) => !v)} className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full ${onlyNeeds ? "bg-amber-400 text-black" : "bg-white/5 text-white/60 border border-white/10 hover:text-white"}`}>Needs check-in</button>
        </div>

        {loading ? <div className="text-white/50">Loading…</div> : shown.length === 0 ? (
          <div className="text-white/45 text-center py-10">No bookings.</div>
        ) : (
          <div className="space-y-2">
            {shown.map((b) => (
              <div key={b.id} className="bg-[#0b1020] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="font-bold capitalize flex items-center gap-2">{b.guestName}
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusBadge(b.checkinStatus)}`}>{b.checkinStatus || "—"}</span>
                  </div>
                  <div className="text-white/55 text-sm capitalize">{b.ship} · {fmtDate(b.sailDate)}{b.itinerary ? ` · ${b.itinerary}` : ""}</div>
                  <div className="text-white/35 text-xs font-mono">#{b.bookingNumber}{b.contact ? ` · ${b.contact}` : ""}</div>
                </div>
                <button onClick={() => remove(b.id)} className="text-red-300/70 hover:text-red-200 text-xs font-bold shrink-0">×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
