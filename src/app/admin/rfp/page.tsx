"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type RFPRequest,
  type RFPStatus,
  getAllRFPs,
  saveRFP,
  deleteRFP,
} from "@/lib/rfp";
import {
  type Group,
  newGroupId,
  newGroupCode,
  saveGroup,
} from "@/lib/groups";

function fmt$(n: number) {
  return "$" + (n || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const STATUS_META: Record<RFPStatus, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-yellow-500/15 text-yellow-300 border border-yellow-400/25" },
  reviewing: { label: "Reviewing", cls: "bg-sky-500/15 text-sky-300 border border-sky-400/25" },
  quoted: { label: "Quoted", cls: "bg-purple-500/15 text-purple-300 border border-purple-400/25" },
  accepted: { label: "Accepted", cls: "bg-green-500/15 text-green-300 border border-green-400/25" },
  declined: { label: "Declined", cls: "bg-red-500/15 text-red-300 border border-red-400/25" },
};

export default function AdminRfpPage() {
  const [list, setList] = useState<RFPRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setList(await getAllRFPs());
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  function patch(id: string, p: Partial<RFPRequest>) {
    setList((l) => l.map((x) => (x.id === id ? { ...x, ...p } : x)));
  }
  async function save(item: RFPRequest) {
    await saveRFP(item);
    refresh();
  }
  async function accept(item: RFPRequest) {
    if (!confirm(`Accept this RFP and create a hosted group for ${item.agencyName}?`)) return;
    const code = newGroupCode();
    const g: Group = {
      id: newGroupId(),
      code,
      name: `${item.agencyName}${item.ship ? ` — ${item.ship}` : ""}`.trim() || "Hosted Group",
      leaderName: item.agentName,
      leaderEmail: item.agentEmail,
      leaderPhone: item.agentPhone,
      ship: item.ship,
      cruiseLine: item.cruiseLine,
      sailingDate: item.sailDate,
      returnDate: "",
      nights: 0,
      depositDueDate: "",
      finalPaymentDate: "",
      blockSize: item.cabins || 0,
      releaseDate: item.holdUntil || "",
      groupRate: item.quoteRatePP || 0,
      contract:
        `Hosted by ${item.agencyName} (agent ${item.agentName}` +
        `${item.credential ? `, ${item.credential}` : ""}). ` +
        `Group rate from $${item.quoteRatePP}/pp. Host fee $${item.feePerRoom}/room. ` +
        `Deposit $${item.depositAmount} to hold ${item.cabins} cabins` +
        `${item.holdUntil ? ` through ${item.holdUntil}` : ""}. ${item.quoteNotes}`,
      notes: `From RFP ${item.id}. Host fee $${item.feePerRoom}/room.`,
    };
    await saveGroup(g);
    await saveRFP({ ...item, status: "accepted", groupCode: code });
    refresh();
  }
  async function remove(id: string) {
    if (!confirm("Delete this RFP?")) return;
    await deleteRFP(id);
    refresh();
  }

  const accepted = list.filter((r) => r.status === "accepted");
  const openCount = list.filter((r) => r.status === "new" || r.status === "reviewing" || r.status === "quoted").length;
  const potentialFees = accepted.reduce((s, r) => s + (r.feePerRoom || 0) * (r.cabins || 0), 0);

  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Agent Group-Space RFPs</h1>
            <p className="text-white/55 text-sm max-w-2xl">
              Outside agents requesting space you host. Quote a rate + your
              per-room fee, then accept to spin up a hosted group with the agent
              as leader.
            </p>
          </div>
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { v: openCount, l: "Open requests" },
            { v: accepted.length, l: "Hosted groups" },
            { v: fmt$(potentialFees), l: "Potential host fees" },
          ].map((s) => (
            <div key={s.l} className="bg-[#0b1020] rounded-2xl border border-white/10 p-4 text-center">
              <div className="text-2xl font-extrabold text-holo">{s.v}</div>
              <div className="text-white/45 text-xs font-semibold mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <p className="text-white/45">Loading…</p>
        ) : list.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center text-white/45">
            No RFPs yet. Share the <Link href="/request-group-space" className="text-sky-400 font-bold hover:text-sky-300">Request Group Space</Link> page with agents.
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((r) => {
              const meta = STATUS_META[r.status];
              return (
                <div key={r.id} className="bg-[#0b1020] rounded-2xl border border-white/10 overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-white">{r.agencyName || "—"}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${meta.cls}`}>{meta.label}</span>
                          {r.credential && <span className="text-xs text-white/40 font-mono">{r.credential}</span>}
                        </div>
                        <div className="text-white/70 text-sm mt-0.5">
                          {r.agentName} · {r.agentEmail}{r.agentPhone ? ` · ${r.agentPhone}` : ""}
                        </div>
                        <div className="text-white/55 text-sm mt-1">
                          {r.cabins || "?"} cabins · {r.ship || r.cruiseLine || "ship TBD"}{r.sailDate ? ` · ${r.sailDate}` : ""}
                          {r.cabinTypes ? ` · ${r.cabinTypes}` : ""}
                        </div>
                        {r.notes && <div className="text-white/40 text-xs mt-1 max-w-xl">{r.notes}</div>}
                      </div>
                      {r.groupCode && (
                        <Link href={`/groups/${r.groupCode}`} target="_blank" className="text-xs font-bold bg-green-500/15 text-green-300 border border-green-400/25 hover:bg-green-500/25 px-3 py-1.5 rounded-full whitespace-nowrap">
                          Open hosted portal ↗
                        </Link>
                      )}
                    </div>

                    {/* Quote */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-4 border-t border-white/10">
                      <div><label className={lbl}>Rate /pp</label><input type="number" className={input} value={r.quoteRatePP || ""} onChange={(e) => patch(r.id, { quoteRatePP: Number(e.target.value) })} /></div>
                      <div><label className={lbl}>Fee /room</label><input type="number" className={input} value={r.feePerRoom || ""} onChange={(e) => patch(r.id, { feePerRoom: Number(e.target.value) })} /></div>
                      <div><label className={lbl}>Deposit</label><input type="number" className={input} value={r.depositAmount || ""} onChange={(e) => patch(r.id, { depositAmount: Number(e.target.value) })} /></div>
                      <div><label className={lbl}>Hold until</label><input type="date" className={input} value={r.holdUntil} onChange={(e) => patch(r.id, { holdUntil: e.target.value })} /></div>
                      <div><label className={lbl}>Status</label>
                        <select className={input} value={r.status} onChange={(e) => patch(r.id, { status: e.target.value as RFPStatus })}>
                          {(Object.keys(STATUS_META) as RFPStatus[]).map((s) => <option key={s} value={s} className="bg-[#0b1020]">{STATUS_META[s].label}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2 sm:col-span-5"><label className={lbl}>Quote notes (shown in the hosted group contract)</label><input className={input} value={r.quoteNotes} onChange={(e) => patch(r.id, { quoteNotes: e.target.value })} placeholder="Included amenity points, perks, payment terms…" /></div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button onClick={() => save(r)} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-5 py-2 rounded-full">Save quote</button>
                      {r.status !== "accepted" && (
                        <button onClick={() => accept(r)} className="bg-green-500/15 text-green-300 border border-green-400/25 hover:bg-green-500/25 font-semibold text-sm px-5 py-2 rounded-full">Accept → create hosted group</button>
                      )}
                      <a href={`mailto:${r.agentEmail}?subject=Your group space request&body=Hi ${r.agentName},`} className="border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 font-semibold text-sm px-5 py-2 rounded-full">Email agent</a>
                      <button onClick={() => remove(r.id)} className="text-red-300 font-bold text-sm px-3 py-2 hover:text-red-200 ml-auto">Delete</button>
                    </div>

                    {r.status === "accepted" && (
                      <div className="mt-3 text-xs text-green-300 font-semibold">
                        Hosted group created · code {r.groupCode} · est. host fee {fmt$((r.feePerRoom || 0) * (r.cabins || 0))} across {r.cabins} rooms
                      </div>
                    )}
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
