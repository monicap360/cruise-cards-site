"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type Group,
  type GroupMember,
  type GroupRoom,
  getAllGroups,
  getMembers,
  saveGroup,
  deleteGroup,
  saveMember,
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

function fmt$(n: number) {
  return "$" + (n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function blankGroup(): Group {
  return {
    id: newGroupId(), code: newGroupCode(), name: "", leaderName: "", leaderEmail: "",
    leaderPhone: "", ship: "", cruiseLine: "", sailingDate: "", returnDate: "", nights: 0,
    depositDueDate: "", finalPaymentDate: "", blockSize: 0, releaseDate: "",
    groupRate: 0, contract: "", notes: "",
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
  const [openId, setOpenId] = useState<string | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [m, setM] = useState<GroupMember>(blankMember(""));
  const [rooms, setRooms] = useState<GroupRoom[]>([]);
  const [r, setR] = useState<GroupRoom>(blankRoom(""));

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

  const input = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const lbl = "block text-xs font-bold uppercase text-gray-500 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900">Group Bookings</h1>
            <p className="text-gray-500 text-sm max-w-2xl">
              Manage group cruises and share a live portal with the group leader —
              roster, cabins, who&rsquo;s paid a deposit, who&rsquo;s paid in full,
              and the contract.
            </p>
          </div>
          <Link href="/admin" className="text-sm font-bold text-blue-700 hover:underline">← Admin</Link>
        </div>

        {/* Group editor */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
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
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={saveG} className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-6 py-2.5 rounded-full">{editingG ? "Update group" : "Create group"}</button>
            {editingG && <button onClick={() => { setG(blankGroup()); setEditingG(false); }} className="border border-gray-300 hover:bg-gray-100 font-bold text-sm px-6 py-2.5 rounded-full">Cancel</button>}
          </div>
        </div>

        {/* Groups list */}
        {loading ? <p className="text-gray-500">Loading…</p> : groups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">No groups yet.</div>
        ) : (
          <div className="space-y-3">
            {groups.map((grp) => (
              <div key={grp.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-[12rem]">
                    <div className="font-extrabold">{grp.name}</div>
                    <div className="text-gray-500 text-sm">{grp.ship}{grp.sailingDate ? ` · ${grp.sailingDate}` : ""}</div>
                    <div className="text-gray-400 text-xs mt-0.5">Leader: {grp.leaderName || "—"} · Code {grp.code}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Link href={`/groups/${grp.code}`} target="_blank" className="text-xs font-bold bg-blue-700 text-white hover:bg-blue-800 px-3 py-1.5 rounded-full">Open portal ↗</Link>
                    <div className="flex gap-3">
                      <button onClick={() => openMembers(grp)} className="text-xs font-bold text-blue-700 hover:underline">{openId === grp.id ? "Hide" : "Manage members"}</button>
                      <button onClick={() => { setG(grp); setEditingG(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-xs font-bold text-blue-700 hover:underline">Edit</button>
                      <button onClick={() => removeG(grp.id)} className="text-xs font-bold text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>

                {openId === grp.id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    {/* members table */}
                    {members.length > 0 && (
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm min-w-[640px]">
                          <thead><tr className="text-gray-400 text-xs uppercase">
                            <th className="text-left py-2">Guest</th><th className="text-left">Cabin</th><th className="text-right">Fare</th><th className="text-right">Deposit</th><th className="text-center">Full</th><th className="text-right">Balance</th><th></th>
                          </tr></thead>
                          <tbody>
                            {members.map((mm) => (
                              <tr key={mm.id} className="border-t border-gray-200">
                                <td className="py-2 font-semibold">{mm.name}</td>
                                <td>{mm.cabinType}{mm.cabinNumber ? ` #${mm.cabinNumber}` : ""}</td>
                                <td className="text-right">{fmt$(mm.fare)}</td>
                                <td className="text-right">{fmt$(mm.depositPaid)}</td>
                                <td className="text-center">{mm.paidInFull ? "✓" : "—"}</td>
                                <td className="text-right font-bold">{fmt$(memberBalance(mm))}</td>
                                <td className="text-right">
                                  <button onClick={() => { setM(mm); }} className="text-blue-700 font-bold text-xs hover:underline mr-2">Edit</button>
                                  <button onClick={() => removeM(mm.id, grp.id)} className="text-red-600 font-bold text-xs hover:underline">×</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {/* member form */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="font-bold text-sm mb-3">{members.find((x) => x.id === m.id) ? "Edit member" : "Add member"}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                        <div className="sm:col-span-2"><label className={lbl}>Name</label><input className={input} value={m.name} onChange={(e) => setMemberF({ name: e.target.value })} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Email</label><input className={input} value={m.email} onChange={(e) => setMemberF({ email: e.target.value })} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Confirmation #</label><input className={input} value={m.confirmationNumber} onChange={(e) => setMemberF({ confirmationNumber: e.target.value })} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Cabin type</label><select className={input} value={m.cabinType} onChange={(e) => setMemberF({ cabinType: e.target.value })}><option value="">—</option>{CABIN_TYPES.map((c) => <option key={c}>{c}</option>)}</select></div>
                        <div className="sm:col-span-1"><label className={lbl}>Cabin #</label><input className={input} value={m.cabinNumber} onChange={(e) => setMemberF({ cabinNumber: e.target.value })} /></div>
                        <div className="sm:col-span-1"><label className={lbl}>Guests</label><input type="number" className={input} value={m.guests} onChange={(e) => setMemberF({ guests: Number(e.target.value) })} /></div>
                        <div className="sm:col-span-1"><label className={lbl}>Fare ($)</label><input type="number" className={input} value={m.fare || ""} onChange={(e) => setMemberF({ fare: Number(e.target.value) })} /></div>
                        <div className="sm:col-span-1"><label className={lbl}>Deposit paid ($)</label><input type="number" className={input} value={m.depositPaid || ""} onChange={(e) => setMemberF({ depositPaid: Number(e.target.value) })} /></div>
                        <div className="sm:col-span-2 flex items-end"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={m.paidInFull} onChange={(e) => setMemberF({ paidInFull: e.target.checked })} /> Paid in full</label></div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={saveM} className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-5 py-2 rounded-full">{members.find((x) => x.id === m.id) ? "Update member" : "Add member"}</button>
                        <button onClick={() => setM(blankMember(grp.id))} className="border border-gray-300 hover:bg-gray-100 font-bold text-sm px-5 py-2 rounded-full">Clear</button>
                      </div>
                    </div>

                    {/* Room inventory — held rooms with per-room hold expiration */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
                      <div className="font-bold text-sm mb-1">Room inventory <span className="text-gray-400 font-normal">— held rooms in this block</span></div>
                      <p className="text-gray-400 text-xs mb-3">Add rooms with a &ldquo;held until&rdquo; date. Once that passes, an unbooked room shows as <strong>released into inventory</strong> on the group portal.</p>
                      {rooms.length > 0 && (
                        <div className="overflow-x-auto mb-3">
                          <table className="w-full text-sm min-w-[640px]">
                            <thead><tr className="text-gray-400 text-xs uppercase">
                              <th className="text-left py-2">Room</th><th className="text-right">Rate/pp</th><th className="text-left pl-3">Held until</th><th className="text-left pl-3">Status</th><th></th>
                            </tr></thead>
                            <tbody>
                              {rooms.map((rm) => {
                                const expired = isRoomReleased(rm, Date.now());
                                return (
                                  <tr key={rm.id} className="border-t border-gray-200">
                                    <td className="py-2 font-semibold">{rm.cabinType}{rm.label ? ` · ${rm.label}` : ""}</td>
                                    <td className="text-right">{rm.ratePP ? fmt$(rm.ratePP) : "group rate"}</td>
                                    <td className="pl-3">{rm.holdUntil ? new Date(rm.holdUntil).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—"}</td>
                                    <td className="pl-3">{rm.status === "booked" ? <span className="text-green-700 font-bold">Booked</span> : expired ? <span className="text-gray-400 font-bold">Released</span> : <span className="text-blue-700 font-bold">Available</span>}</td>
                                    <td className="text-right whitespace-nowrap">
                                      <button onClick={() => setR(rm)} className="text-blue-700 font-bold text-xs hover:underline mr-2">Edit</button>
                                      {rm.status !== "released" && <button onClick={() => releaseR(rm)} className="text-amber-600 font-bold text-xs hover:underline mr-2">Release</button>}
                                      <button onClick={() => removeR(rm.id, grp.id)} className="text-red-600 font-bold text-xs hover:underline">Drop</button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                        <div className="sm:col-span-2"><label className={lbl}>Cabin type</label><select className={input} value={r.cabinType} onChange={(e) => setR({ ...r, cabinType: e.target.value })}><option value="">—</option>{CABIN_TYPES.map((c) => <option key={c}>{c}</option>)}</select></div>
                        <div className="sm:col-span-2"><label className={lbl}>Label / cabin #</label><input className={input} value={r.label} onChange={(e) => setR({ ...r, label: e.target.value })} placeholder="Balcony #1" /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Rate/pp (blank = group)</label><input type="number" className={input} value={r.ratePP || ""} onChange={(e) => setR({ ...r, ratePP: Number(e.target.value) })} /></div>
                        <div className="sm:col-span-3"><label className={lbl}>Held until (release if unbooked)</label><input type="datetime-local" className={input} value={r.holdUntil} onChange={(e) => setR({ ...r, holdUntil: e.target.value })} /></div>
                        <div className="sm:col-span-3"><label className={lbl}>Status</label><select className={input} value={r.status} onChange={(e) => setR({ ...r, status: e.target.value as GroupRoom["status"] })}><option value="available">Available</option><option value="booked">Booked</option><option value="released">Released</option></select></div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={saveR} className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-5 py-2 rounded-full">{rooms.find((x) => x.id === r.id) ? "Update room" : "Add room"}</button>
                        <button onClick={() => setR(blankRoom(grp.id))} className="border border-gray-300 hover:bg-gray-100 font-bold text-sm px-5 py-2 rounded-full">Clear</button>
                      </div>
                    </div>
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
