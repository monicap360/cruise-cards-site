"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import {
  type Group,
  type GroupMember,
  type GroupRoom,
  getAllGroups,
  getMembers,
  saveGroup,
  deleteGroup,
  saveMember,
  saveMemberNote,
  deleteMember,
  memberBalance,
  newGroupId,
  newMemberId,
  newGroupCode,
  getRooms,
  saveRoom,
  deleteRoom,
  newRoomId,
  isRoomReleased,
} from "@/lib/groups";
import { uploadGuestFile } from "@/lib/documents";
import CabinThread from "@/components/CabinThread";
import { GROUP_SHEETS } from "@/lib/group-sheets";
import GroupDiscrepancies from "@/components/GroupDiscrepancies";
import GroupCruiseCare from "@/components/GroupCruiseCare";
import BedConfig from "@/components/BedConfig";

function fmt$(n: number) {
  return "$" + (n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function blankGroup(): Group {
  return {
    id: newGroupId(), code: newGroupCode(), name: "", leaderName: "", leaderEmail: "",
    leaderPhone: "", ship: "", cruiseLine: "", sailingDate: "", returnDate: "", nights: 0,
    depositDueDate: "", finalPaymentDate: "", blockSize: 0, releaseDate: "",
    groupRate: 0, contract: "", contractUrl: "", contractName: "", notes: "",
  };
}
function blankMember(groupId: string): GroupMember {
  return {
    id: newMemberId(), groupId, name: "", email: "", phone: "", cabinType: "",
    cabinNumber: "", guests: 2, fare: 0, depositPaid: 0, paidInFull: false,
    confirmationNumber: "", notes: "",
  };
}
function blankRoom(groupId: string): GroupRoom {
  return {
    id: newRoomId(), groupId, cabinType: "", label: "", ratePP: 0,
    holdUntil: "", status: "available", bookedBy: "", notes: "",
  };
}

const CABIN_TYPES = ["Interior", "Ocean View", "Balcony", "Mini-Suite", "Suite"];

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [g, setG] = useState<Group>(blankGroup());
  const [editingG, setEditingG] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [groupTab, setGroupTab] = useState<"manage" | "reservations" | "signups" | "orders">("manage");
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [m, setM] = useState<GroupMember>(blankMember(""));
  const [rooms, setRooms] = useState<GroupRoom[]>([]);
  const [r, setR] = useState<GroupRoom>(blankRoom(""));
  const [bookBusy, setBookBusy] = useState("");
  const [bookMsg, setBookMsg] = useState("");
  const [noteOpen, setNoteOpen] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteBusy, setNoteBusy] = useState(false);

  function openNote(mm: GroupMember) {
    setNoteOpen(noteOpen === mm.id ? "" : mm.id);
    setNoteText(mm.adminNotes || "");
  }
  async function saveNote(groupId: string) {
    setNoteBusy(true);
    await saveMemberNote(noteOpen, noteText);
    setMembers(await getMembers(groupId));
    setNoteBusy(false);
    setNoteOpen("");
  }

  // Upload a cruise-line reservation/confirmation PDF → AI reads it → creates the
  // cabin (member + room). Cost/payments/promos are saved on the room (admin-only).
  async function importBooking(e: React.ChangeEvent<HTMLInputElement>, groupId: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setBookBusy(groupId);
    setBookMsg("Reading the booking with AI…");
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let bin = "";
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      const b64 = btoa(bin);
      const mediaType = file.type === "image/png" ? "image/png" : file.type === "image/jpeg" ? "image/jpeg" : "application/pdf";
      const res = await fetch("/api/parse-booking", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pdfBase64: b64, mediaType }) });
      const d = await res.json();
      if (!res.ok) { setBookMsg(d.error || "Could not read that document."); setBookBusy(""); return; }
      const guests: { name?: string; dob?: string }[] = Array.isArray(d.guests) ? d.guests : [];
      const names = guests.map((x) => `${x.name}${x.dob ? ` (${x.dob})` : ""}`).join(", ");
      const lead = guests[0]?.name || String(d.reservationNumber || "Guest");
      const num = (v: unknown) => (Number(v) || 0);
      const fin = [
        num(d.totalPrice) ? `Total $${num(d.totalPrice).toFixed(2)}` : "",
        num(d.taxesPerPerson) ? `Taxes/pp $${num(d.taxesPerPerson).toFixed(2)}` : "",
        num(d.paymentsReceived) ? `Paid $${num(d.paymentsReceived).toFixed(2)}` : "",
        num(d.finalPayment) ? `Balance $${num(d.finalPayment).toFixed(2)}${d.finalPaymentDue ? ` due ${d.finalPaymentDue}` : ""}` : "",
        Array.isArray(d.promos) && d.promos.length ? `Promos: ${d.promos.join(", ")}` : "",
      ].filter(Boolean).join(" · ");
      await saveMember({ id: newMemberId(), groupId, name: lead, email: String(d.email || ""), phone: String(d.phone || ""), cabinType: String(d.category || ""), cabinNumber: String(d.stateroom || ""), guests: guests.length || 2, fare: 0, depositPaid: 0, paidInFull: false, confirmationNumber: String(d.reservationNumber || ""), notes: names });
      await saveRoom({ id: newRoomId(), groupId, cabinType: String(d.category || ""), label: String(d.stateroom || "TBD"), ratePP: 0, holdUntil: "", status: "booked", bookedBy: lead, notes: fin });
      setMembers(await getMembers(groupId));
      setRooms(await getRooms(groupId));
      setBookMsg(`✓ Loaded ${d.reservationNumber || "booking"} — ${d.category || ""} ${d.stateroom || ""}. Cost saved to the room (admin-only).`);
      setTimeout(() => setBookMsg(""), 6000);
    } catch (err) {
      setBookMsg("Import failed: " + (err instanceof Error ? err.message : "unknown error"));
    }
    setBookBusy("");
  }

  async function refresh() {
    setGroups(await getAllGroups());
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  const setGroupF = (p: Partial<Group>) => setG((s) => ({ ...s, ...p }));
  const setMemberF = (p: Partial<GroupMember>) => setM((s) => ({ ...s, ...p }));

  async function saveG() {
    if (!g.name.trim()) { alert("Group name required."); return; }
    await saveGroup(g);
    setG(blankGroup());
    setEditingG(false);
    setShowForm(false);
    refresh();
  }
  async function removeG(id: string) {
    if (!confirm("Delete this group and all its members?")) return;
    await deleteGroup(id);
    if (openId === id) setOpenId(null);
    refresh();
  }
  async function openMembers(grp: Group) {
    if (openId === grp.id) { setOpenId(null); return; }
    setOpenId(grp.id);
    setMembers(await getMembers(grp.id));
    setM(blankMember(grp.id));
    setRooms(await getRooms(grp.id));
    setR(blankRoom(grp.id));
  }
  async function saveR() {
    if (!r.cabinType.trim()) { alert("Pick a cabin type."); return; }
    await saveRoom(r);
    setRooms(await getRooms(r.groupId));
    setR(blankRoom(r.groupId));
  }
  async function removeR(id: string, groupId: string) {
    if (!confirm("Drop this room from the block?")) return;
    await deleteRoom(id);
    setRooms(await getRooms(groupId));
  }
  async function releaseR(rm: GroupRoom) {
    await saveRoom({ ...rm, status: "released" });
    setRooms(await getRooms(rm.groupId));
  }
  async function saveM() {
    if (!m.name.trim()) { alert("Member name required."); return; }
    await saveMember(m);
    setMembers(await getMembers(m.groupId));
    setM(blankMember(m.groupId));
  }
  async function removeM(id: string, groupId: string) {
    if (!confirm("Remove this member?")) return;
    await deleteMember(id);
    setMembers(await getMembers(groupId));
  }
  async function applyDeposit(mm: GroupMember, groupId: string) {
    const def = mm.depositPaid ? String(mm.depositPaid) : String(100 * (mm.guests || 1));
    const amt = prompt(`Apply deposit for ${mm.name} — amount ($):`, def);
    if (amt === null) return;
    await saveMember({ ...mm, depositPaid: Number(amt) || 0 });
    setMembers(await getMembers(groupId));
  }

  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Group Bookings</h1>
            <p className="text-white/55 text-sm max-w-2xl">
              Manage group cruises and share a live portal with the group leader —
              roster, cabins, who&rsquo;s paid a deposit, who&rsquo;s paid in full,
              and the contract.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setG(blankGroup()); setEditingG(false); setShowForm((v) => !v); }} className="bg-white text-black hover:bg-white/90 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full">{showForm && !editingG ? "Close" : "+ New Group"}</button>
            <Link href="/admin/orders" className="bg-white/5 border border-white/15 hover:border-sky-400/50 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full">📦 Group Orders</Link>
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
          </div>
        </div>

        {/* Group editor — opens on demand (New Group button / Edit) */}
        {(showForm || editingG) && (
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6 mb-8">
          <h2 className="font-extrabold text-lg mb-4">{editingG ? "Edit group" : "New group"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="sm:col-span-4"><label className={lbl}>Group name *</label><input className={input} value={g.name} onChange={(e) => setGroupF({ name: e.target.value })} placeholder="Smith Family Reunion 2026" /></div>
            <div className="sm:col-span-2"><label className={lbl}>Access code</label><input className={input} value={g.code} onChange={(e) => setGroupF({ code: e.target.value.toUpperCase() })} /></div>
            <div className="sm:col-span-3"><label className={lbl}>Leader name</label><input className={input} value={g.leaderName} onChange={(e) => setGroupF({ leaderName: e.target.value })} /></div>
            <div className="sm:col-span-3"><label className={lbl}>Leader email</label><input className={input} value={g.leaderEmail} onChange={(e) => setGroupF({ leaderEmail: e.target.value })} /></div>
            <div className="sm:col-span-3"><label className={lbl}>Ship</label><input className={input} value={g.ship} onChange={(e) => setGroupF({ ship: e.target.value })} placeholder="Carnival Jubilee" /></div>
            <div className="sm:col-span-3"><label className={lbl}>Cruise line</label><input className={input} value={g.cruiseLine} onChange={(e) => setGroupF({ cruiseLine: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Sail date</label><input type="date" className={input} value={g.sailingDate} onChange={(e) => setGroupF({ sailingDate: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Deposit due</label><input type="date" className={input} value={g.depositDueDate} onChange={(e) => setGroupF({ depositDueDate: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Final payment</label><input type="date" className={input} value={g.finalPaymentDate} onChange={(e) => setGroupF({ finalPaymentDate: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Rooms in block</label><input type="number" className={input} value={g.blockSize || ""} onChange={(e) => setGroupF({ blockSize: Number(e.target.value) })} placeholder="e.g. 20" /></div>
            <div className="sm:col-span-2"><label className={lbl}>Group rate ($/person)</label><input type="number" className={input} value={g.groupRate || ""} onChange={(e) => setGroupF({ groupRate: Number(e.target.value) })} placeholder="e.g. 549" /></div>
            <div className="sm:col-span-2"><label className={lbl}>Rooms release (date &amp; time)</label><input type="datetime-local" className={input} value={g.releaseDate} onChange={(e) => setGroupF({ releaseDate: e.target.value })} /></div>
            <div className="sm:col-span-6"><label className={lbl}>Contract / terms (shown on the portal)</label><textarea className={input} rows={3} value={g.contract} onChange={(e) => setGroupF({ contract: e.target.value })} placeholder="Group rate, included perks, deposit & final-payment terms, cancellation policy…" /></div>
            <div className="sm:col-span-6">
              <label className={lbl}>Group contract (PDF upload)</label>
              {g.contractUrl ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <a href={g.contractUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 text-sm font-semibold">📄 {g.contractName || "View contract"}</a>
                  <button type="button" onClick={() => setGroupF({ contractUrl: "", contractName: "" })} className="text-red-300 hover:text-red-200 text-xs font-bold">Remove</button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const up = await uploadGuestFile(file);
                    if ("error" in up) { alert("Upload failed: " + up.error + "\n\nMake sure the 'documents' Storage bucket exists."); return; }
                    setGroupF({ contractUrl: up.url, contractName: up.name });
                  }}
                  className="block w-full text-sm text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-white file:text-black file:font-semibold file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-wider"
                />
              )}
              <p className="text-white/40 text-xs mt-1">Uploads to the documents bucket; shown on the group portal as a download.</p>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={saveG} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-6 py-2.5 rounded-full">{editingG ? "Update group" : "Create group"}</button>
            <button onClick={() => { setG(blankGroup()); setEditingG(false); setShowForm(false); }} className="border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 font-semibold text-sm px-6 py-2.5 rounded-full">Cancel</button>
          </div>
        </div>
        )}

        {/* Groups list */}
        {loading ? <p className="text-white/45">Loading…</p> : groups.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center text-white/45">No groups yet.</div>
        ) : (
          <div className="space-y-3">
            {groups.map((grp) => (
              <div key={grp.id} className="bg-[#0b1020] rounded-xl border border-white/10 overflow-hidden">
                <div className="p-4 flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-[12rem]">
                    <div className="font-extrabold">{grp.name}</div>
                    <div className="text-white/55 text-sm">{grp.ship}{grp.sailingDate ? ` · ${grp.sailingDate}` : ""}</div>
                    <div className="text-white/40 text-xs mt-0.5">Leader: {grp.leaderName || "—"} · Code {grp.code}{grp.sailingDate ? <> · <span className="text-sky-300 font-bold">PIN {grp.sailingDate.slice(5, 7)}{grp.sailingDate.slice(8, 10)}</span> <span className="text-white/30">(what guests enter)</span></> : null}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Link href={`/groups/${grp.code}`} target="_blank" className="text-xs font-bold bg-white text-black hover:bg-white/90 px-3 py-1.5 rounded-full">Open portal ↗</Link>
                    <div className="flex gap-3">
                      <button onClick={() => { openMembers(grp); setGroupTab("manage"); }} className="text-xs font-bold text-sky-400 hover:text-sky-300">{openId === grp.id ? "Hide" : "Open group"}</button>
                      <button onClick={() => { setG(grp); setEditingG(true); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-xs font-bold text-sky-400 hover:text-sky-300">Edit</button>
                      <button onClick={() => removeG(grp.id)} className="text-xs font-bold text-red-300 hover:text-red-200">Delete</button>
                    </div>
                  </div>
                </div>

                {openId === grp.id && (
                  <div className="border-t border-white/10 p-4 bg-white/5">
                    {/* Group tabs */}
                    <div className="flex gap-1 mb-4 border-b border-white/10 flex-wrap">
                      {([["manage", "Members & Rooms"], ["reservations", "Reservations"], ["signups", "Signups"], ["orders", "Orders"]] as const).map(([k, lbl]) => (
                        <button key={k} onClick={() => setGroupTab(k)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px ${groupTab === k ? "border-sky-400 text-white" : "border-transparent text-white/45 hover:text-white"}`}>{lbl}</button>
                      ))}
                    </div>

                    {groupTab === "manage" && (<>
                    {/* Upload booking confirmation (AI) */}
                    <div className="mb-4 rounded-xl border border-sky-400/25 bg-sky-500/[0.06] p-4">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <div className="font-bold text-sm">📄 Upload booking confirmation (PDF)</div>
                          <div className="text-white/55 text-xs mt-0.5">AI reads a Royal Caribbean / Carnival reservation and adds the cabin — stateroom, category, guests + DOBs, reservation #, total, taxes, payments & promos (cost saved admin-only).</div>
                        </div>
                        <label className={`cursor-pointer bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-4 py-2.5 rounded-full ${bookBusy === grp.id ? "opacity-50 pointer-events-none" : ""}`}>
                          {bookBusy === grp.id ? "Reading…" : "Upload PDF"}
                          <input type="file" accept="application/pdf,image/png,image/jpeg" className="hidden" onChange={(e) => importBooking(e, grp.id)} />
                        </label>
                      </div>
                      {bookMsg && bookBusy !== "" && <div className="text-sky-300 text-xs mt-2">{bookMsg}</div>}
                      {bookMsg && bookBusy === "" && <div className="text-green-300 text-xs mt-2">{bookMsg}</div>}
                    </div>
                    {/* Embedded planning sheet (admin-only) */}
                    {GROUP_SHEETS[grp.code] && (
                      <div className="mb-4 rounded-xl border border-white/10 bg-[#0b1020] p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] uppercase tracking-wider text-sky-300/80 font-bold">📊 Planning sheet (admin-only)</span>
                          <a href={GROUP_SHEETS[grp.code].replace("/preview", "/edit")} target="_blank" rel="noopener noreferrer" className="text-sky-400 text-xs font-bold hover:text-sky-300">Open in Google Sheets →</a>
                        </div>
                        <iframe src={GROUP_SHEETS[grp.code]} title="Group planning sheet" className="w-full rounded-lg border border-white/10 bg-white" style={{ height: "520px" }} />
                      </div>
                    )}
                    {/* Requested vs booked reconciliation */}
                    <GroupDiscrepancies groupId={grp.id} />
                    {/* Per-cabin Cruise Care alert */}
                    <GroupCruiseCare groupId={grp.id} />
                    {/* members table */}
                    {members.length > 0 && (
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm min-w-[640px]">
                          <thead><tr className="text-white/45 text-xs uppercase">
                            <th className="text-left py-2">Guest</th><th className="text-left">Cabin</th><th className="text-right">Fare</th><th className="text-right">Deposit</th><th className="text-center">Full</th><th className="text-right">Balance</th><th></th>
                          </tr></thead>
                          <tbody>
                            {members.map((mm) => (
                              <Fragment key={mm.id}>
                              <tr className="border-t border-white/10">
                                <td className="py-2 font-semibold">
                                  {mm.name}
                                  {mm.adminNotes ? <span className="ml-1" title="Has notes">📝</span> : null}
                                </td>
                                <td>
                                  {mm.cabinType}{mm.cabinNumber ? ` #${mm.cabinNumber}` : ""}
                                  <div className="mt-1"><BedConfig memberId={mm.id} /></div>
                                  {(() => { const rm = rooms.find((x) => x.bookedBy === mm.name && x.notes); return rm ? <div className="text-white/40 text-[10px] mt-0.5 max-w-[260px]">💲 {rm.notes}</div> : null; })()}
                                </td>
                                <td className="text-right">{fmt$(mm.fare)}</td>
                                <td className="text-right">
                                  {mm.paidInFull || mm.depositPaid > 0 ? (
                                    <span className="text-green-300 font-semibold">{fmt$(mm.depositPaid)}</span>
                                  ) : (
                                    <span className="text-white/55">{fmt$(100 * (mm.guests || 2))} <span className="text-white/35 text-[10px] uppercase">due</span></span>
                                  )}
                                </td>
                                <td className="text-center">
                                  {mm.paidInFull ? (
                                    <span className="inline-block bg-green-500/15 text-green-300 text-[10px] font-bold uppercase rounded-full px-2 py-0.5">Paid</span>
                                  ) : <span className="text-white/25">—</span>}
                                </td>
                                <td className="text-right font-bold">{fmt$(memberBalance(mm))}</td>
                                <td className="text-right whitespace-nowrap">
                                  <button onClick={() => applyDeposit(mm, grp.id)} className="text-green-300 font-bold text-xs hover:text-green-200 mr-2">Apply deposit</button>
                                  <Link href={`/group-invoice/${mm.id}?copy=agent`} target="_blank" className="text-amber-300 font-bold text-xs hover:text-amber-200 mr-2">📄 Agent invoice</Link>
                                  <Link href={`/group-receipt/${mm.id}?copy=agent`} target="_blank" className="text-amber-300 font-bold text-xs hover:text-amber-200 mr-2">🧾 Agent receipt</Link>
                                  <button onClick={() => openNote(mm)} className="text-amber-300 font-bold text-xs hover:text-amber-200 mr-2">📝 Notes</button>
                                  <button onClick={() => { setM(mm); }} className="text-sky-400 font-bold text-xs hover:text-sky-300 mr-2">Edit</button>
                                  <button onClick={() => removeM(mm.id, grp.id)} className="text-red-300 font-bold text-xs hover:text-red-200">×</button>
                                </td>
                              </tr>
                              {noteOpen === mm.id && (
                                <tr>
                                  <td colSpan={7} className="pb-3">
                                    <div className="bg-[#0b1020] border border-amber-400/25 rounded-xl p-3">
                                      <div className="text-[10px] uppercase tracking-wider text-amber-300/80 font-bold mb-1.5">📝 Reservation notes / communication thread — {mm.name} (admin-only)</div>
                                      <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={4}
                                        placeholder="Log calls, requests, special arrangements… e.g. 'Booked 2 rooms for 4 guests; Knox in single room with Phong to save cost.'"
                                        className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-sm placeholder-white/35 focus:outline-none focus:border-amber-400/50" />
                                      <div className="flex gap-2 mt-2">
                                        <button onClick={() => saveNote(grp.id)} disabled={noteBusy} className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-[11px] px-4 py-2 rounded-full">{noteBusy ? "Saving…" : "Save private note"}</button>
                                        <button onClick={() => setNoteOpen("")} className="text-white/50 hover:text-white text-[11px] font-bold uppercase tracking-wider px-3 py-2">Close</button>
                                      </div>
                                      <div className="mt-3 border-t border-white/10 pt-2">
                                        <div className="text-[10px] uppercase tracking-wider text-sky-300/80 font-bold mb-1">💬 Guest message thread (two-way)</div>
                                        <CabinThread memberId={mm.id} groupCode={grp.code} sender="agent" />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                              </Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {/* member form */}
                    <div className="bg-[#0b1020] rounded-xl border border-white/10 p-4">
                      <div className="font-bold text-sm mb-3">{members.find((x) => x.id === m.id) ? "Edit member" : "Add member"}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                        <div className="sm:col-span-2"><label className={lbl}>Name</label><input className={input} value={m.name} onChange={(e) => setMemberF({ name: e.target.value })} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Email</label><input className={input} value={m.email} onChange={(e) => setMemberF({ email: e.target.value })} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Confirmation #</label><input className={input} value={m.confirmationNumber} onChange={(e) => setMemberF({ confirmationNumber: e.target.value })} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Cabin type</label><select className={input} value={m.cabinType} onChange={(e) => setMemberF({ cabinType: e.target.value })}><option value="" className="bg-[#0b1020]">—</option>{CABIN_TYPES.map((c) => <option key={c} className="bg-[#0b1020]">{c}</option>)}</select></div>
                        <div className="sm:col-span-1"><label className={lbl}>Cabin #</label><input className={input} value={m.cabinNumber} onChange={(e) => setMemberF({ cabinNumber: e.target.value })} /></div>
                        <div className="sm:col-span-1"><label className={lbl}>Guests</label><input type="number" className={input} value={m.guests} onChange={(e) => setMemberF({ guests: Number(e.target.value) })} /></div>
                        <div className="sm:col-span-1"><label className={lbl}>Fare ($)</label><input type="number" className={input} value={m.fare || ""} onChange={(e) => setMemberF({ fare: Number(e.target.value) })} /></div>
                        <div className="sm:col-span-1"><label className={lbl}>Deposit paid ($)</label><input type="number" className={input} value={m.depositPaid || ""} onChange={(e) => setMemberF({ depositPaid: Number(e.target.value) })} /></div>
                        <div className="sm:col-span-2 flex items-end"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={m.paidInFull} onChange={(e) => setMemberF({ paidInFull: e.target.checked })} /> Paid in full</label></div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={saveM} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-5 py-2 rounded-full">{members.find((x) => x.id === m.id) ? "Update member" : "Add member"}</button>
                        <button onClick={() => setM(blankMember(grp.id))} className="border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 font-semibold text-sm px-5 py-2 rounded-full">Clear</button>
                      </div>
                    </div>

                    {/* Room inventory — held rooms with per-room hold expiration */}
                    <div className="bg-[#0b1020] rounded-xl border border-white/10 p-4 mt-4">
                      <div className="font-bold text-sm mb-1">Room inventory <span className="text-white/40 font-normal">— held rooms in this block</span></div>
                      <p className="text-white/40 text-xs mb-3">Add rooms with a &ldquo;held until&rdquo; date. Once that passes, an unbooked room shows as <strong>released into inventory</strong> on the group portal.</p>
                      {rooms.length > 0 && (
                        <div className="overflow-x-auto mb-3">
                          <table className="w-full text-sm min-w-[640px]">
                            <thead><tr className="text-white/45 text-xs uppercase">
                              <th className="text-left py-2">Room</th><th className="text-right">Rate/pp</th><th className="text-left pl-3">Held until</th><th className="text-left pl-3">Status</th><th></th>
                            </tr></thead>
                            <tbody>
                              {rooms.map((rm) => {
                                const expired = isRoomReleased(rm, Date.now());
                                return (
                                  <tr key={rm.id} className="border-t border-white/10">
                                    <td className="py-2 font-semibold">{rm.cabinType}{rm.label ? ` · ${rm.label}` : ""}</td>
                                    <td className="text-right">{rm.ratePP ? fmt$(rm.ratePP) : "group rate"}</td>
                                    <td className="pl-3">{rm.holdUntil ? new Date(rm.holdUntil).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—"}</td>
                                    <td className="pl-3">{rm.status === "booked" ? <span className="text-green-300 font-bold">Booked</span> : expired ? <span className="text-white/40 font-bold">Released</span> : <span className="text-sky-300 font-bold">Available</span>}</td>
                                    <td className="text-right whitespace-nowrap">
                                      <button onClick={() => setR(rm)} className="text-sky-400 font-bold text-xs hover:text-sky-300 mr-2">Edit</button>
                                      {rm.status !== "released" && <button onClick={() => releaseR(rm)} className="text-amber-300 font-bold text-xs hover:text-amber-200 mr-2">Release</button>}
                                      <button onClick={() => removeR(rm.id, grp.id)} className="text-red-300 font-bold text-xs hover:text-red-200">Drop</button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                        <div className="sm:col-span-2"><label className={lbl}>Cabin type</label><select className={input} value={r.cabinType} onChange={(e) => setR({ ...r, cabinType: e.target.value })}><option value="" className="bg-[#0b1020]">—</option>{CABIN_TYPES.map((c) => <option key={c} className="bg-[#0b1020]">{c}</option>)}</select></div>
                        <div className="sm:col-span-2"><label className={lbl}>Label / cabin #</label><input className={input} value={r.label} onChange={(e) => setR({ ...r, label: e.target.value })} placeholder="Balcony #1" /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Rate/pp (blank = group)</label><input type="number" className={input} value={r.ratePP || ""} onChange={(e) => setR({ ...r, ratePP: Number(e.target.value) })} /></div>
                        <div className="sm:col-span-3"><label className={lbl}>Held until (release if unbooked)</label><input type="datetime-local" className={input} value={r.holdUntil} onChange={(e) => setR({ ...r, holdUntil: e.target.value })} /></div>
                        <div className="sm:col-span-3"><label className={lbl}>Status</label><select className={input} value={r.status} onChange={(e) => setR({ ...r, status: e.target.value as GroupRoom["status"] })}><option value="available" className="bg-[#0b1020]">Available</option><option value="booked" className="bg-[#0b1020]">Booked</option><option value="released" className="bg-[#0b1020]">Released</option></select></div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={saveR} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-5 py-2 rounded-full">{rooms.find((x) => x.id === r.id) ? "Update room" : "Add room"}</button>
                        <button onClick={() => setR(blankRoom(grp.id))} className="border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 font-semibold text-sm px-5 py-2 rounded-full">Clear</button>
                      </div>
                    </div>
                    </>)}

                    {groupTab === "reservations" && (
                      <div>
                        <div className="font-bold text-sm mb-3">📋 Reservations — {members.length} cabin{members.length === 1 ? "" : "s"}</div>
                        {members.length === 0 ? (
                          <p className="text-white/45 text-sm">No reservations yet.</p>
                        ) : (
                          <div className="overflow-x-auto rounded-xl border border-white/10">
                            <table className="w-full text-sm min-w-[640px]">
                              <thead><tr className="bg-white/5 text-white/45 text-[10px] uppercase tracking-wider">
                                <th className="text-left px-3 py-2">Res #</th><th className="text-left px-3 py-2">Lead</th><th className="text-left px-3 py-2">Cabin</th><th className="text-center px-3 py-2">Guests</th><th className="text-right px-3 py-2">Fare</th><th className="text-center px-3 py-2">Status</th><th className="text-right px-3 py-2">Balance</th>
                              </tr></thead>
                              <tbody>
                                {members.map((mm) => (
                                  <tr key={mm.id} className="border-t border-white/10">
                                    <td className="px-3 py-2 font-mono text-xs text-sky-300">{mm.confirmationNumber || "—"}</td>
                                    <td className="px-3 py-2 font-semibold">{mm.name}</td>
                                    <td className="px-3 py-2 text-white/70">{mm.cabinType}{mm.cabinNumber ? ` #${mm.cabinNumber}` : ""}</td>
                                    <td className="px-3 py-2 text-center text-white/70">{mm.guests || "—"}</td>
                                    <td className="px-3 py-2 text-right">{fmt$(mm.fare)}</td>
                                    <td className="px-3 py-2 text-center">{mm.paidInFull ? <span className="text-green-300 font-bold text-xs">Paid</span> : mm.depositPaid > 0 ? <span className="text-sky-300 text-xs">Deposit</span> : <span className="text-white/40 text-xs">—</span>}</td>
                                    <td className="px-3 py-2 text-right font-bold">{fmt$(memberBalance(mm))}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {groupTab === "signups" && (
                      <div className="bg-[#0b1020] rounded-xl border border-white/10 p-6 text-center">
                        <div className="font-bold mb-1">📝 Group Signups</div>
                        <p className="text-white/50 text-sm mb-4">Families, DOBs, deposits &amp; confirmations for this group.</p>
                        <Link href="/admin/signups" className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">Open Signup Tracker →</Link>
                      </div>
                    )}

                    {groupTab === "orders" && (
                      <div className="bg-[#0b1020] rounded-xl border border-white/10 p-6 text-center">
                        <div className="font-bold mb-1">📦 Group Orders</div>
                        <p className="text-white/50 text-sm mb-4">Extras, add-ons &amp; purchases for this group.</p>
                        <Link href="/admin/orders" className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">Open Group Orders →</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
