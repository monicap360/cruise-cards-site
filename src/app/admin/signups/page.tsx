"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type SignupEntry,
  blankSignup,
  getSignups,
  saveSignup,
  deleteSignup,
  signupTotals,
} from "@/lib/signups";

export default function SignupsPage() {
  const [rows, setRows] = useState<SignupEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<string>("");
  const [s, setS] = useState<SignupEntry>(() => blankSignup());
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");

  async function refresh() {
    const data = await getSignups();
    setRows(data);
    if (!group && data.length) setGroup(data[0].groupLabel);
    setLoading(false);
  }
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups = useMemo(
    () => Array.from(new Set(rows.map((r) => r.groupLabel).filter(Boolean))),
    [rows]
  );
  const set = (p: Partial<SignupEntry>) => setS((x) => ({ ...x, ...p }));

  async function save() {
    if (!s.leadName.trim() && !s.guestNames.trim()) {
      alert("Add a lead/family name or guest names.");
      return;
    }
    await saveSignup({ ...s, groupLabel: s.groupLabel || group });
    setS(blankSignup(group));
    setEditing(false);
    refresh();
  }
  function edit(r: SignupEntry) {
    setS({ ...r });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function remove(id: string) {
    if (!confirm("Delete this signup?")) return;
    await deleteSignup(id);
    refresh();
  }

  const inGroup = rows.filter((r) => (group ? r.groupLabel === group : true));
  const shown = search.trim()
    ? inGroup.filter((r) =>
        `${r.leadName} ${r.email} ${r.phone} ${r.guestNames} ${r.reservationNumber} ${r.cabins} ${r.notes}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : inGroup;
  const t = signupTotals(inGroup);

  const input =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

  const yes = (v: string) => v.toUpperCase().startsWith("Y");

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
            <Link href="/admin/group-deposits" className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 hover:text-sky-300">🏦 Group Deposits →</Link>
            <Link href="/admin/rooming-list" className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 hover:text-sky-300">🛏️ Rooming List →</Link>
          </div>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1 mt-2">{"// Group Signups"}</div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Group Signup Tracker</h1>
          <p className="text-white/55 text-sm max-w-2xl mt-1">
            🔒 Admin only — contains guest DOBs, contacts, and reservation numbers. Never shown to customers.
          </p>

          {groups.length > 0 && (
            <div className="mt-4">
              <select value={group} onChange={(e) => setGroup(e.target.value)} className={`${input} max-w-md`}>
                {groups.map((g) => (
                  <option key={g} value={g} className="bg-[#0b1020]">{g}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-5">
            {[
              { label: "Families", value: t.families },
              { label: "Total guests", value: t.guests },
              { label: "Adults", value: t.adults },
              { label: "Kids", value: t.kids },
              { label: "Confirmed", value: t.confirmed },
              { label: "Deposits paid", value: t.depositsPaid },
            ].map((c) => (
              <div key={c.label} className="bg-[#0b1020] border border-white/10 rounded-2xl px-3 py-3">
                <div className="text-xl font-extrabold text-holo">{c.value}</div>
                <div className="text-white/45 label-mono text-[9px] uppercase tracking-wider">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Add / edit */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h2 className="font-extrabold text-lg mb-4">{editing ? "Edit signup" : "Add a family / signup"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="sm:col-span-2"><label className={lbl}>Group</label><input className={input} value={s.groupLabel || group} onChange={(e) => set({ groupLabel: e.target.value })} placeholder="Thanksgiving 2026 — Liberty of the Seas" /></div>
            <div className="sm:col-span-2"><label className={lbl}>Family / lead contact</label><input className={input} value={s.leadName} onChange={(e) => set({ leadName: e.target.value })} /></div>
            <div className="sm:col-span-1"><label className={lbl}>DOB</label><input className={input} value={s.dob} onChange={(e) => set({ dob: e.target.value })} placeholder="1/23/1985" /></div>
            <div className="sm:col-span-1"><label className={lbl}>Reservation #</label><input className={input} value={s.reservationNumber} onChange={(e) => set({ reservationNumber: e.target.value })} /></div>
            <div className="sm:col-span-3"><label className={lbl}>Email</label><input className={input} value={s.email} onChange={(e) => set({ email: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Phone</label><input className={input} value={s.phone} onChange={(e) => set({ phone: e.target.value })} /></div>
            <div className="sm:col-span-1"><label className={lbl}>Cabins / pref</label><input className={input} value={s.cabins} onChange={(e) => set({ cabins: e.target.value })} placeholder="1 Balcony" /></div>
            <div className="sm:col-span-1"><label className={lbl}>Adults</label><input type="number" className={input} value={s.adults} onChange={(e) => set({ adults: Number(e.target.value) })} /></div>
            <div className="sm:col-span-1"><label className={lbl}>Kids</label><input type="number" className={input} value={s.kids} onChange={(e) => set({ kids: Number(e.target.value) })} /></div>
            <div className="sm:col-span-1"><label className={lbl}>Total guests</label><input type="number" className={input} value={s.totalGuests} onChange={(e) => set({ totalGuests: Number(e.target.value) })} /></div>
            <div className="sm:col-span-1"><label className={lbl}>Confirmed?</label><select className={input} value={s.confirmed} onChange={(e) => set({ confirmed: e.target.value })}><option className="bg-[#0b1020]" value="Y">Y</option><option className="bg-[#0b1020]" value="N">N</option><option className="bg-[#0b1020]" value="">—</option></select></div>
            <div className="sm:col-span-2"><label className={lbl}>Deposit status</label><input className={input} value={s.depositStatus} onChange={(e) => set({ depositStatus: e.target.value })} placeholder="N Sent Invoice" /></div>
            <div className="sm:col-span-6"><label className={lbl}>Guest full names (as on ID)</label><textarea className={input} rows={3} value={s.guestNames} onChange={(e) => set({ guestNames: e.target.value })} /></div>
            <div className="sm:col-span-6"><label className={lbl}>Notes</label><textarea className={input} rows={2} value={s.notes} onChange={(e) => set({ notes: e.target.value })} /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all">{editing ? "Save changes" : "Add signup"}</button>
            {editing && <button onClick={() => { setS(blankSignup(group)); setEditing(false); }} className="text-white/50 hover:text-white text-xs font-bold px-4">Cancel</button>}
          </div>
        </div>

        {/* List */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{`// ${shown.length} famil${shown.length === 1 ? "y" : "ies"}`}</div>
            <input className="bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60 w-64 max-w-full" placeholder="Search name, email, res #, cabin…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {loading ? (
            <p className="text-white/45">Loading…</p>
          ) : shown.length === 0 ? (
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center text-white/45">No signups yet.</div>
          ) : (
            <div className="space-y-2">
              {shown.map((r) => (
                <div key={r.id} className="bg-[#0b1020] rounded-xl border border-white/10 p-4">
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white">{r.leadName || "(no lead name)"}</span>
                        {r.reservationNumber && <span className="text-white/40 font-mono text-xs">#{r.reservationNumber}</span>}
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${yes(r.confirmed) ? "bg-green-500/15 text-green-300 border-green-400/25" : "bg-yellow-400/15 text-yellow-300 border-yellow-400/25"}`}>{yes(r.confirmed) ? "Confirmed" : "Not confirmed"}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${yes(r.depositStatus) ? "bg-green-500/15 text-green-300 border-green-400/25" : "bg-red-500/15 text-red-300 border-red-400/25"}`}>{r.depositStatus || "No deposit"}</span>
                      </div>
                      <div className="text-white/50 text-xs mt-1 flex flex-wrap gap-x-2">
                        {r.email && <a href={`mailto:${r.email}`} className="text-sky-400 hover:text-sky-300">{r.email}</a>}
                        {r.phone && <a href={`tel:${r.phone}`} className="text-sky-400 hover:text-sky-300">{r.phone}</a>}
                        {r.dob && <span>· DOB {r.dob}</span>}
                        <span>· {r.adults}A / {r.kids}K · {r.totalGuests} guests · {r.cabins}</span>
                      </div>
                      {r.guestNames && <div className="text-white/70 text-sm mt-1.5 whitespace-pre-wrap">{r.guestNames}</div>}
                      {r.notes && <div className="text-white/45 text-xs mt-1 whitespace-pre-wrap">📝 {r.notes}</div>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => edit(r)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs px-4 py-2 rounded-full">Edit</button>
                      <button onClick={() => remove(r.id)} className="bg-red-500/10 hover:bg-red-500/20 border border-red-400/25 text-red-300 font-semibold text-xs px-4 py-2 rounded-full">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
