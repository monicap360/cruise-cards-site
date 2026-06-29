"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { type Group, getAllGroups } from "@/lib/groups";
import {
  type HotelRfp, GALVESTON_HOTELS,
  getRfps, saveRfp, deleteRfp, newRfpId, newRfpToken,
} from "@/lib/hotel-rfp";

const fmt$ = (n: number) => "$" + (n || 0).toLocaleString("en-US");
const STATUS: Record<string, string> = {
  Sent: "bg-white/10 text-white/60", Submitted: "bg-sky-500/15 text-sky-300",
  Selected: "bg-green-500/15 text-green-300", Declined: "bg-red-500/15 text-red-300",
};

export default function AdminHotelRfpPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [rfps, setRfps] = useState<HotelRfp[]>([]);
  const [loading, setLoading] = useState(true);
  const [f, setF] = useState({ groupCode: "", hotelName: GALVESTON_HOTELS[0], contactName: "", contactEmail: "", contactPhone: "", nightsBefore: 1 });

  async function load() {
    setLoading(true);
    setGroups(await getAllGroups());
    setRfps(await getRfps());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = (r: HotelRfp) => `${origin}/hotel-rfp/${r.token}`;

  async function createRfp() {
    const g = groups.find((x) => x.code === f.groupCode);
    if (!g) { alert("Pick a group."); return; }
    if (!f.contactEmail.trim()) { alert("Add the hotel contact email."); return; }
    const r: HotelRfp = {
      id: newRfpId(), token: newRfpToken(), groupCode: g.code, groupName: g.name,
      ship: g.ship, sailDate: g.sailingDate, roomsNeeded: g.blockSize, nightsBefore: f.nightsBefore,
      hotelName: f.hotelName, contactName: f.contactName, contactEmail: f.contactEmail, contactPhone: f.contactPhone,
      status: "Sent", nightlyRate: 0, roomType: "", parkStayCruise: false, parkingDays: 0, shuttle: false, terms: "",
    };
    await saveRfp(r);
    setF({ ...f, contactName: "", contactEmail: "", contactPhone: "" });
    setRfps(await getRfps());
  }

  function emailRfp(r: HotelRfp) {
    const body = `Hello ${r.contactName || "there"},\n\n` +
      `Cruises from Galveston has a group sailing on ${r.ship}${r.sailDate ? ` (${r.sailDate})` : ""} — "${r.groupName}" — with about ${r.roomsNeeded} rooms needing ${r.nightsBefore} pre-cruise night(s) at ${r.hotelName}.\n\n` +
      `Please submit your best group rate (and any park-stay-cruise / shuttle terms) here:\n${link(r)}\n\nThank you!\nCruises from Galveston · (409) 632-2106`;
    window.location.href = `mailto:${encodeURIComponent(r.contactEmail)}?subject=${encodeURIComponent(`Group rate request — ${r.groupName} (${r.ship})`)}&body=${encodeURIComponent(body)}`;
  }
  async function setStatus(r: HotelRfp, status: HotelRfp["status"]) {
    await saveRfp({ ...r, status });
    setRfps(await getRfps());
  }
  async function remove(id: string) { if (confirm("Delete this RFP?")) { await deleteRfp(id); setRfps(await getRfps()); } }

  const byGroup = useMemo(() => {
    const m: Record<string, HotelRfp[]> = {};
    rfps.forEach((r) => { (m[r.groupName] = m[r.groupName] || []).push(r); });
    return m;
  }, [rfps]);

  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block text-[10px] uppercase tracking-wider text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{"// Hotel RFP"}</div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Hotel Rate Requests</h1>
            <p className="text-white/55 text-sm max-w-2xl">Send a hotel&rsquo;s GM/DOS a link to submit a group rate. Submitted rates flow into the group portal.</p>
          </div>
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
        </div>

        {/* New RFP */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-5 mb-6">
          <div className="font-bold text-sm mb-3">Send a new hotel rate request</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><label className={lbl}>Group / reservation</label>
              <select className={input} value={f.groupCode} onChange={(e) => setF({ ...f, groupCode: e.target.value })}>
                <option value="" className="bg-[#0b1020]">— pick —</option>
                {groups.map((g) => <option key={g.id} value={g.code} className="bg-[#0b1020]">{g.name} · {g.ship}</option>)}
              </select>
            </div>
            <div><label className={lbl}>Hotel</label>
              <select className={input} value={f.hotelName} onChange={(e) => setF({ ...f, hotelName: e.target.value })}>
                {GALVESTON_HOTELS.map((h) => <option key={h} className="bg-[#0b1020]">{h}</option>)}
              </select>
            </div>
            <div><label className={lbl}>Pre-cruise nights</label><input type="number" className={input} value={f.nightsBefore} onChange={(e) => setF({ ...f, nightsBefore: Number(e.target.value) })} /></div>
            <div><label className={lbl}>Contact name (GM / DOS)</label><input className={input} value={f.contactName} onChange={(e) => setF({ ...f, contactName: e.target.value })} /></div>
            <div><label className={lbl}>Contact email *</label><input className={input} value={f.contactEmail} onChange={(e) => setF({ ...f, contactEmail: e.target.value })} /></div>
            <div><label className={lbl}>Contact phone</label><input className={input} value={f.contactPhone} onChange={(e) => setF({ ...f, contactPhone: e.target.value })} /></div>
          </div>
          <button onClick={createRfp} className="mt-3 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">Create &amp; get link</button>
        </div>

        {loading ? <div className="text-white/50">Loading…</div> : rfps.length === 0 ? (
          <div className="text-white/45 text-center py-10">No requests yet — send one above.</div>
        ) : (
          <div className="space-y-5">
            {Object.entries(byGroup).map(([groupName, list]) => (
              <div key={groupName}>
                <div className="text-white/50 text-xs uppercase tracking-wider font-bold mb-2">{groupName}</div>
                <div className="space-y-2">
                  {list.map((r) => (
                    <div key={r.id} className="bg-[#0b1020] border border-white/10 rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="font-bold">{r.hotelName} <span className={`ml-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS[r.status]}`}>{r.status}</span></div>
                          <div className="text-white/45 text-xs mt-0.5">{[r.contactName, r.contactEmail, r.contactPhone].filter(Boolean).join(" · ")}</div>
                          {r.status !== "Sent" && (
                            <div className="text-sm mt-2">
                              <span className="text-holo font-extrabold">{fmt$(r.nightlyRate)}</span><span className="text-white/45">/night {r.roomType ? `· ${r.roomType}` : ""}</span>
                              {r.parkStayCruise && <span className="text-green-300 text-xs"> · 🅿️ Park-stay-cruise{r.parkingDays ? ` (${r.parkingDays} nights)` : ""}{r.shuttle ? " + shuttle" : ""}</span>}
                              {r.terms && <div className="text-white/55 text-xs mt-1 italic">{r.terms}</div>}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3 text-xs font-bold shrink-0">
                          <button onClick={() => emailRfp(r)} className="text-sky-400 hover:text-sky-300">📧 Email link</button>
                          <button onClick={() => navigator.clipboard?.writeText(link(r))} className="text-white/55 hover:text-white">Copy link</button>
                          {r.status === "Submitted" && <button onClick={() => setStatus(r, "Selected")} className="text-green-300 hover:text-green-200">✓ Select</button>}
                          <button onClick={() => remove(r.id)} className="text-red-300 hover:text-red-200">×</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
