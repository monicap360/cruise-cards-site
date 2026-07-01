"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type IndividualBooking, type Passenger,
  getIndividualBookings, saveIndividualBooking, deleteIndividualBooking,
  needsCheckin, newIBId, newResToken,
} from "@/lib/individual-bookings";
import { GUIDES } from "@/lib/cruise-apps";
import CopyReservationLink from "@/components/CopyReservationLink";

const fmtDate = (d: string) => (d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "—");
const blank = (): IndividualBooking => ({
  id: newIBId(), guestName: "", cruiseLine: "", ship: "", sailDate: "", itinerary: "", bookingNumber: "",
  contact: "", checkinStatus: "Available", notes: "", passengers: [{ name: "", dob: "", vifp: "" }],
  token: newResToken(), cabinType: "", grossAmount: 0,
});

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

  function edit(b: IndividualBooking) {
    setF({ ...b, token: b.token || newResToken(), passengers: b.passengers?.length ? b.passengers : [{ name: b.guestName, dob: "", vifp: "" }] });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function save() {
    if (!f.guestName.trim() && !f.passengers[0]?.name) { alert("Guest name required."); return; }
    const guestName = f.guestName.trim() || f.passengers[0]?.name || "";
    await saveIndividualBooking({ ...f, guestName, passengers: f.passengers.filter((p) => p.name.trim()) });
    setF(blank()); setShowForm(false); load();
  }
  async function remove(id: string) { if (confirm("Delete this reservation?")) { await deleteIndividualBooking(id); load(); } }

  // passenger editing on the form
  const setPax = (i: number, patch: Partial<Passenger>) => setF((s) => ({ ...s, passengers: s.passengers.map((p, k) => (k === i ? { ...p, ...patch } : p)) }));
  const addPax = () => setF((s) => ({ ...s, passengers: [...s.passengers, { name: "", dob: "", vifp: "" }] }));
  const delPax = (i: number) => setF((s) => ({ ...s, passengers: s.passengers.filter((_, k) => k !== i) }));

  const shown = useMemo(() => {
    const s = search.toLowerCase();
    return rows.filter((r) =>
      (!onlyNeeds || needsCheckin(r)) &&
      (!s || `${r.guestName} ${r.ship} ${r.bookingNumber} ${r.cruiseLine}`.toLowerCase().includes(s)));
  }, [rows, search, onlyNeeds]);

  const needCount = rows.filter(needsCheckin).length;
  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[9px] uppercase tracking-wider text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{"// Bookings"}</div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Individual Reservations</h1>
            <p className="text-white/55 text-sm">Client staterooms — capture passengers &amp; share a PIN-protected portal.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setF(blank()); setShowForm((v) => !v); }} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-4 py-2 rounded-full">{showForm ? "Close" : "+ New Reservation"}</button>
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-4"><div className="text-2xl font-extrabold text-holo">{rows.length}</div><div className="text-white/45 text-[10px] uppercase tracking-wider label-mono mt-1">Total reservations</div></div>
          <div className={`rounded-2xl p-4 border ${needCount ? "bg-amber-400/10 border-amber-400/30" : "bg-[#0b1020] border-white/10"}`}><div className="text-2xl font-extrabold text-amber-300">{needCount}</div><div className="text-white/45 text-[10px] uppercase tracking-wider label-mono mt-1">Need check-in</div></div>
        </div>

        {showForm && (
          <div className="bg-[#0b1020] border border-sky-400/30 rounded-2xl p-5 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className={lbl}>Cruise line</label>
                <select className={input} value={f.cruiseLine} onChange={(e) => setF({ ...f, cruiseLine: e.target.value })}>
                  <option value="" className="bg-[#0b1020]">Select…</option>
                  {GUIDES.map((g) => <option key={g.line} value={g.line} className="bg-[#0b1020]">{g.line}</option>)}
                </select>
              </div>
              <div><label className={lbl}>Ship</label><input className={input} placeholder="e.g. Carnival Jubilee" value={f.ship} onChange={(e) => setF({ ...f, ship: e.target.value })} /></div>
              <div><label className={lbl}>Sail date <span className="text-sky-300/70">(sets the portal PIN)</span></label><input className={input} type="date" value={f.sailDate} onChange={(e) => setF({ ...f, sailDate: e.target.value })} /></div>
              <div><label className={lbl}>Itinerary</label><input className={input} placeholder="7-DAY Western Caribbean" value={f.itinerary} onChange={(e) => setF({ ...f, itinerary: e.target.value })} /></div>
              <div><label className={lbl}>Cruise-line reservation / booking #</label><input className={input} placeholder="e.g. ZN88D6" value={f.bookingNumber} onChange={(e) => setF({ ...f, bookingNumber: e.target.value })} /></div>
              <div><label className={lbl}>Cabin type</label><input className={input} placeholder="Balcony" value={f.cabinType} onChange={(e) => setF({ ...f, cabinType: e.target.value })} /></div>
              <div><label className={lbl}>Total price ($)</label><input className={input} inputMode="decimal" placeholder="0" value={f.grossAmount || ""} onChange={(e) => setF({ ...f, grossAmount: Number(e.target.value) || 0 })} /></div>
              <div><label className={lbl}>Contact (phone/email)</label><input className={input} placeholder="(409) 555-0123" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} /></div>
            </div>

            {/* Passengers */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className={lbl}>Passengers — name · DOB · VIFP / loyalty #</label>
                <button onClick={addPax} className="text-sky-300 hover:text-sky-200 text-xs font-bold">+ Add passenger</button>
              </div>
              <div className="space-y-2">
                {f.passengers.map((p, i) => (
                  <div key={i} className="grid grid-cols-[1fr_130px_130px_auto] gap-2">
                    <input className={input} placeholder="Full name" value={p.name} onChange={(e) => setPax(i, { name: e.target.value })} />
                    <input className={input} type="date" title="Date of birth" value={p.dob} onChange={(e) => setPax(i, { dob: e.target.value })} />
                    <input className={input + " font-mono"} placeholder="VIFP #" value={p.vifp} onChange={(e) => setPax(i, { vifp: e.target.value })} />
                    <button onClick={() => delPax(i)} className="text-red-300/70 hover:text-red-200 text-xs px-2">×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <button onClick={save} className="bg-sky-600 hover:bg-sky-500 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">Save reservation</button>
              <span className="text-white/40 text-xs">A shareable customer link + PIN is created automatically.</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4 flex-wrap">
          <input className={`${input} flex-1 min-w-48`} placeholder="Search guest, ship, booking #…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={() => setOnlyNeeds((v) => !v)} className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full ${onlyNeeds ? "bg-amber-400 text-black" : "bg-white/5 text-white/60 border border-white/10 hover:text-white"}`}>Needs check-in</button>
        </div>

        {loading ? <div className="text-white/50">Loading…</div> : shown.length === 0 ? (
          <div className="text-white/45 text-center py-10">No reservations.</div>
        ) : (
          <div className="space-y-2">
            {shown.map((b) => (
              <div key={b.id} className="bg-[#0b1020] border border-white/10 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="font-bold capitalize flex items-center gap-2">{b.guestName}
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusBadge(b.checkinStatus)}`}>{b.checkinStatus || "—"}</span>
                    </div>
                    <div className="text-white/55 text-sm capitalize">{b.cruiseLine ? `${b.cruiseLine} · ` : ""}{b.ship} · {fmtDate(b.sailDate)}{b.itinerary ? ` · ${b.itinerary}` : ""}</div>
                    <div className="text-white/35 text-xs font-mono">#{b.bookingNumber}{b.passengers?.length ? ` · ${b.passengers.length} pax` : ""}{b.contact ? ` · ${b.contact}` : ""}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <CopyReservationLink token={b.token} sailDate={b.sailDate} />
                    {b.token && <Link href={`/r/${b.token}`} target="_blank" className="text-xs font-bold bg-white text-black hover:bg-white/90 px-3 py-1.5 rounded-full">Open ↗</Link>}
                    <button onClick={() => edit(b)} className="text-xs font-bold text-sky-400 hover:text-sky-300">Edit</button>
                    <button onClick={() => remove(b.id)} className="text-red-300/70 hover:text-red-200 text-xs font-bold">×</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
