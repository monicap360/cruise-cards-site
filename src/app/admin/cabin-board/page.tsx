"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAllGuestProfiles, LOYALTY_PROGRAMS, type GuestProfile } from "@/lib/guest-profile";

const money = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const cap = (s: string) => (s ? s.replace(/\b\w/g, (c) => c.toUpperCase()) : "Unassigned");
const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);

type Grp = { id: string; name: string; ship: string; sailing_date: string };
type Mem = {
  id: string; group_id: string; name: string; cabin_type: string; cabin_number: string;
  deck: string; confirmation_number: string; fare: number; gross_amount: number; net_amount: number;
  deposit_paid: number; paid_in_full: boolean; guests: number; loyalty_program: string; loyalty_number: string;
};
type IB = {
  id: string; guest_name: string; ship: string; sail_date: string; booking_number: string;
  checkin_status: string; cabin_type: string; deck: string; gross_amount: number; net_amount: number;
  loyalty_program: string; loyalty_number: string;
};

type Cabin = { kind: "group"; m: Mem; groupName: string; date: string } | { kind: "ind"; b: IB };

// Editable fields shared by both kinds.
type EditForm = {
  kind: "group" | "ind"; id: string; name: string; confirmation: string; cabinType: string;
  cabinNumber: string; deck: string; loyaltyProgram: string; loyaltyNumber: string; gross: string; net: string; paid: string;
};

export default function CabinBoardPage() {
  const [groups, setGroups] = useState<Grp[]>([]);
  const [members, setMembers] = useState<Mem[]>([]);
  const [ibs, setIbs] = useState<IB[]>([]);
  const [profiles, setProfiles] = useState<GuestProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "owes" | "none" | "paid" | "checkin">("all");
  const [edit, setEdit] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const g = await supabase.from("groups").select("id,name,ship,sailing_date");
    const m = await supabase.from("group_members").select("*");
    setGroups((g.data as Grp[]) || []);
    setMembers(((m.data as Record<string, unknown>[]) || []).map((r) => ({
      id: r.id as string, group_id: r.group_id as string, name: (r.name as string) || "", cabin_type: (r.cabin_type as string) || "",
      cabin_number: (r.cabin_number as string) || "", deck: (r.deck as string) || "", confirmation_number: (r.confirmation_number as string) || "",
      fare: num(r.fare), gross_amount: num(r.gross_amount), net_amount: num(r.net_amount), deposit_paid: num(r.deposit_paid),
      paid_in_full: !!r.paid_in_full, guests: num(r.guests), loyalty_program: (r.loyalty_program as string) || "", loyalty_number: (r.loyalty_number as string) || "",
    })));
    try {
      const ib = await supabase.from("individual_bookings").select("*");
      setIbs(((ib.data as Record<string, unknown>[]) || []).map((r) => ({
        id: r.id as string, guest_name: (r.guest_name as string) || "", ship: (r.ship as string) || "", sail_date: (r.sail_date as string) || "",
        booking_number: (r.booking_number as string) || "", checkin_status: (r.checkin_status as string) || "", cabin_type: (r.cabin_type as string) || "",
        deck: (r.deck as string) || "", gross_amount: num(r.gross_amount), net_amount: num(r.net_amount),
        loyalty_program: (r.loyalty_program as string) || "", loyalty_number: (r.loyalty_number as string) || "",
      })));
    } catch { /* table may not exist */ }
    try { setProfiles(await getAllGuestProfiles()); } catch { /* table may not exist */ }
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  // Guest-submitted profiles, keyed for enrichment (loyalty/deck/confirmation).
  const profByName = useMemo(() => { const map = new Map<string, GuestProfile>(); for (const p of profiles) if (p.name) map.set(p.name.trim().toLowerCase(), p); return map; }, [profiles]);
  const profByConfirm = useMemo(() => { const map = new Map<string, GuestProfile>(); for (const p of profiles) if (p.confirmationNumber) map.set(p.confirmationNumber.trim().toLowerCase(), p); return map; }, [profiles]);

  type Enriched = Cabin & { statusKey: string; text: string; ship: string; prof?: GuestProfile };

  const all = useMemo<Enriched[]>(() => {
    const gById = new Map(groups.map((g) => [g.id, g]));
    const out: Enriched[] = [];
    for (const m of members) {
      const g = gById.get(m.group_id);
      const ship = g?.ship || "Unassigned";
      const fare = m.fare || 0, paid = m.deposit_paid || 0;
      const statusKey = (m.paid_in_full || (fare > 0 && paid >= fare)) ? "paid" : paid > 0 ? "owes" : "none";
      const prof = profByName.get(m.name.trim().toLowerCase()) || (m.confirmation_number ? profByConfirm.get(m.confirmation_number.trim().toLowerCase()) : undefined);
      out.push({ kind: "group", m, groupName: g?.name || "—", date: g?.sailing_date || "", statusKey, ship, prof, text: `${m.name} ${m.cabin_number} ${m.confirmation_number} ${g?.name || ""} ${ship}`.toLowerCase() });
    }
    for (const b of ibs) {
      const statusKey = /complete/i.test(b.checkin_status) ? "checkedin" : "checkin";
      const prof = profByConfirm.get(b.booking_number.trim().toLowerCase()) || profByName.get(b.guest_name.trim().toLowerCase());
      out.push({ kind: "ind", b, statusKey, ship: b.ship || "Unassigned", prof, text: `${b.guest_name} ${b.booking_number} ${b.ship}`.toLowerCase() });
    }
    return out;
  }, [groups, members, ibs, profByName, profByConfirm]);

  const counts = useMemo(() => ({
    owes: all.filter((c) => c.statusKey === "owes").length,
    none: all.filter((c) => c.statusKey === "none").length,
    paid: all.filter((c) => c.statusKey === "paid").length,
    checkin: all.filter((c) => c.statusKey === "checkin").length,
  }), [all]);

  const ships = useMemo(() => {
    const s = search.toLowerCase();
    const filtered = all.filter((c) => (!s || c.text.includes(s)) && (statusFilter === "all" || c.statusKey === statusFilter));
    const byShip = new Map<string, Enriched[]>();
    for (const c of filtered) { const ship = c.ship.toLowerCase(); const arr = byShip.get(ship) || []; arr.push(c); byShip.set(ship, arr); }
    return Array.from(byShip.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [all, search, statusFilter]);

  // Total profit across the board (gross − net).
  const totalProfit = useMemo(() => {
    let p = 0;
    for (const m of members) p += num(m.gross_amount) - num(m.net_amount);
    for (const b of ibs) p += num(b.gross_amount) - num(b.net_amount);
    return p;
  }, [members, ibs]);

  function memStatus(m: Mem) {
    const fare = m.fare || 0, paid = m.deposit_paid || 0;
    if (m.paid_in_full || (fare > 0 && paid >= fare)) return { label: "Paid", cls: "bg-green-500/15 text-green-300 border-green-400/30" };
    if (paid > 0) return { label: `Owes ${money(Math.max(0, fare - paid))}`, cls: "bg-amber-400/15 text-amber-300 border-amber-400/30" };
    return { label: "No deposit", cls: "bg-red-500/15 text-red-300 border-red-400/30" };
  }

  function openEditGroup(m: Mem, prof?: GuestProfile) {
    setEdit({
      kind: "group", id: m.id, name: m.name, confirmation: m.confirmation_number || prof?.confirmationNumber || "",
      cabinType: m.cabin_type || prof?.cabinType || "", cabinNumber: m.cabin_number || "", deck: m.deck || prof?.deck || "",
      loyaltyProgram: m.loyalty_program || prof?.loyaltyProgram || "", loyaltyNumber: m.loyalty_number || prof?.loyaltyNumber || "",
      gross: m.gross_amount ? String(m.gross_amount) : m.fare ? String(m.fare) : "", net: m.net_amount ? String(m.net_amount) : "",
      paid: m.deposit_paid ? String(m.deposit_paid) : "",
    });
  }
  function openEditIB(b: IB, prof?: GuestProfile) {
    setEdit({
      kind: "ind", id: b.id, name: b.guest_name, confirmation: b.booking_number || prof?.confirmationNumber || "",
      cabinType: b.cabin_type || prof?.cabinType || "", cabinNumber: "", deck: b.deck || prof?.deck || "",
      loyaltyProgram: b.loyalty_program || prof?.loyaltyProgram || "", loyaltyNumber: b.loyalty_number || prof?.loyaltyNumber || "",
      gross: b.gross_amount ? String(b.gross_amount) : "", net: b.net_amount ? String(b.net_amount) : "", paid: "",
    });
  }

  async function saveEdit() {
    if (!edit) return;
    setSaving(true);
    const gross = Number(edit.gross) || 0, net = Number(edit.net) || 0;
    try {
      if (edit.kind === "group") {
        const paid = Number(edit.paid) || 0;
        const { error } = await supabase.from("group_members").update({
          cabin_type: edit.cabinType, cabin_number: edit.cabinNumber, deck: edit.deck, confirmation_number: edit.confirmation,
          loyalty_program: edit.loyaltyProgram, loyalty_number: edit.loyaltyNumber, gross_amount: gross, net_amount: net,
          fare: gross, deposit_paid: paid, paid_in_full: gross > 0 && paid >= gross,
        }).eq("id", edit.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("individual_bookings").update({
          booking_number: edit.confirmation, cabin_type: edit.cabinType, deck: edit.deck,
          loyalty_program: edit.loyaltyProgram, loyalty_number: edit.loyaltyNumber, gross_amount: gross, net_amount: net,
        }).eq("id", edit.id);
        if (error) throw error;
      }
      setEdit(null);
      await refresh();
    } catch (e) {
      alert("Save failed — you may need to run the latest master-setup.sql (adds the cabin-board columns).\n\n" + (e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const field = "w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const label = "label-mono text-[9px] uppercase tracking-wider text-sky-300/60";

  const editGross = Number(edit?.gross) || 0, editNet = Number(edit?.net) || 0, editProfit = editGross - editNet;

  // Compact detail line for a card (confirmation · room · deck · loyalty).
  function CardLines({ confirmation, room, deck, loyalty, gross, net }: { confirmation?: string; room?: string; deck?: string; loyalty?: string; gross: number; net: number }) {
    const profit = gross - net;
    return (
      <>
        {confirmation && <div className="text-white/55 text-xs mt-1">Conf# <span className="font-mono text-white/75">{confirmation}</span></div>}
        <div className="text-white/55 text-xs mt-0.5">{room || "Cabin TBD"}{deck ? ` · Deck ${deck}` : ""}</div>
        {loyalty && <div className="text-sky-300/80 text-[11px] mt-0.5">🎖 {loyalty}</div>}
        {(gross > 0 || net > 0) && (
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            <span className="text-white/45">Gross {money(gross)}</span>
            <span className="text-white/30">− Net {money(net)}</span>
            <span className={`font-bold ${profit >= 0 ? "text-green-300" : "text-red-300"}`}>= {money(profit)} profit</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{"// Front Desk"}</div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Cabin Board</h1>
            <p className="text-white/55 text-sm">Every cabin by ship — confirmation #, room, deck, loyalty & profit. Click any card to update.</p>
          </div>
          <div className="text-right">
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white block">← Admin</Link>
            <div className="mt-2">
              <div className="label-mono text-[9px] uppercase tracking-wider text-white/40">Total profit</div>
              <div className={`text-2xl font-extrabold ${totalProfit >= 0 ? "text-green-300" : "text-red-300"}`}>{money(totalProfit)}</div>
            </div>
          </div>
        </div>

        {!loading && (
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guest, cabin #, group, confirmation #…"
              className="flex-1 min-w-48 bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
            {([["all", "All"], ["owes", `Owes (${counts.owes})`], ["none", `No deposit (${counts.none})`], ["paid", `Paid (${counts.paid})`], ["checkin", `Needs check-in (${counts.checkin})`]] as const).map(([k, lbl]) => (
              <button key={k} onClick={() => setStatusFilter(k)}
                className={`text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-full ${statusFilter === k ? "bg-white text-black" : "bg-white/5 text-white/60 border border-white/10 hover:text-white"}`}>{lbl}</button>
            ))}
          </div>
        )}

        {loading ? <div className="text-white/50">Loading…</div> : ships.length === 0 ? (
          <div className="text-white/45 text-center py-12">No cabins yet.</div>
        ) : (
          <div className="space-y-8">
            {ships.map(([ship, cabins]) => (
              <div key={ship}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-lg font-extrabold capitalize">🚢 {cap(ship)}</h2>
                  <span className="text-white/40 text-sm">{cabins.length} cabin{cabins.length === 1 ? "" : "s"}</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cabins.map((c, i) => c.kind === "group" ? (
                    <button key={i} onClick={() => openEditGroup(c.m, c.prof)} className="text-left bg-[#0b1020] border border-white/10 rounded-xl p-4 hover:border-sky-400/40 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold capitalize">{c.m.name}</div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${memStatus(c.m).cls}`}>{memStatus(c.m).label}</span>
                      </div>
                      <CardLines
                        confirmation={c.m.confirmation_number || c.prof?.confirmationNumber}
                        room={`${c.m.cabin_type || c.prof?.cabinType || ""}${c.m.cabin_number ? ` #${c.m.cabin_number}` : ""}`.trim()}
                        deck={c.m.deck || c.prof?.deck}
                        loyalty={c.m.loyalty_number ? `${c.m.loyalty_program || "Loyalty"}: ${c.m.loyalty_number}` : c.prof?.loyaltyNumber ? `${c.prof.loyaltyProgram || "Loyalty"}: ${c.prof.loyaltyNumber}` : ""}
                        gross={c.m.gross_amount} net={c.m.net_amount}
                      />
                      <div className="text-white/35 text-[11px] mt-1.5">{c.groupName}{c.date ? ` · ${c.date}` : ""} · {c.m.guests}g</div>
                    </button>
                  ) : (
                    <button key={i} onClick={() => openEditIB(c.b, c.prof)} className="text-left bg-[#0b1020] border border-white/10 rounded-xl p-4 hover:border-sky-400/40 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold capitalize">{c.b.guest_name}</div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${/complete/i.test(c.b.checkin_status) ? "bg-green-500/15 text-green-300 border-green-400/30" : "bg-amber-400/15 text-amber-300 border-amber-400/30"}`}>{/complete/i.test(c.b.checkin_status) ? "Checked in" : "Check-in due"}</span>
                      </div>
                      <div className="text-white/40 text-[11px] mt-1">Individual booking</div>
                      <CardLines
                        confirmation={c.b.booking_number}
                        room={c.b.cabin_type || c.prof?.cabinType}
                        deck={c.b.deck || c.prof?.deck}
                        loyalty={c.b.loyalty_number ? `${c.b.loyalty_program || "Loyalty"}: ${c.b.loyalty_number}` : c.prof?.loyaltyNumber ? `${c.prof.loyaltyProgram || "Loyalty"}: ${c.prof.loyaltyNumber}` : ""}
                        gross={c.b.gross_amount} net={c.b.net_amount}
                      />
                      <div className="text-white/35 text-[11px] mt-1.5">{c.b.sail_date}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {edit && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-auto" onClick={() => !saving && setEdit(null)}>
          <div className="bg-[#0b1020] border border-white/15 rounded-2xl p-6 w-full max-w-lg my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/80">{edit.kind === "group" ? "Group cabin" : "Individual booking"}</div>
                <h3 className="text-xl font-extrabold capitalize">{edit.name || "Guest"}</h3>
              </div>
              <button onClick={() => setEdit(null)} className="text-white/50 hover:text-white text-xl">×</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block col-span-2"><span className={label}>Confirmation / Booking #</span>
                <input className={field + " mt-1 font-mono"} value={edit.confirmation} onChange={(e) => setEdit({ ...edit, confirmation: e.target.value })} placeholder="e.g. ZN88D6" /></label>
              <label className="block"><span className={label}>Room type</span>
                <input className={field + " mt-1"} value={edit.cabinType} onChange={(e) => setEdit({ ...edit, cabinType: e.target.value })} placeholder="Balcony" /></label>
              <label className="block"><span className={label}>Cabin #</span>
                <input className={field + " mt-1"} value={edit.cabinNumber} onChange={(e) => setEdit({ ...edit, cabinNumber: e.target.value })} placeholder="8015" /></label>
              <label className="block"><span className={label}>Deck</span>
                <input className={field + " mt-1"} value={edit.deck} onChange={(e) => setEdit({ ...edit, deck: e.target.value })} placeholder="8" /></label>
              <label className="block"><span className={label}>Loyalty program</span>
                <select className={field + " mt-1"} value={edit.loyaltyProgram} onChange={(e) => setEdit({ ...edit, loyaltyProgram: e.target.value })}>
                  <option value="" className="bg-[#0b1020]">—</option>
                  {LOYALTY_PROGRAMS.map((p) => <option key={p} value={p} className="bg-[#0b1020]">{p}</option>)}
                </select></label>
              <label className="block col-span-2"><span className={label}>Loyalty # (VIFP / Crown & Anchor)</span>
                <input className={field + " mt-1 font-mono"} value={edit.loyaltyNumber} onChange={(e) => setEdit({ ...edit, loyaltyNumber: e.target.value })} placeholder="Loyalty number" /></label>

              <label className="block"><span className={label}>Gross amount ($)</span>
                <input className={field + " mt-1"} inputMode="decimal" value={edit.gross} onChange={(e) => setEdit({ ...edit, gross: e.target.value })} placeholder="what the guest pays" /></label>
              <label className="block"><span className={label}>Net amount ($)</span>
                <input className={field + " mt-1"} inputMode="decimal" value={edit.net} onChange={(e) => setEdit({ ...edit, net: e.target.value })} placeholder="cruise-line cost" /></label>
              {edit.kind === "group" && (
                <label className="block col-span-2"><span className={label}>Paid so far ($) — log PayPal / check / card payments here</span>
                  <input className={field + " mt-1"} inputMode="decimal" value={edit.paid} onChange={(e) => setEdit({ ...edit, paid: e.target.value })} placeholder="0" /></label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="text-white/55 text-xs">Profit (gross − net)</span>
                <span className={`text-xl font-extrabold ${editProfit >= 0 ? "text-green-300" : "text-red-300"}`}>{money(editProfit)}</span>
              </div>
              {edit.kind === "group" && (
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="text-white/55 text-xs">Balance due</span>
                  <span className={`text-xl font-extrabold ${editGross - (Number(edit.paid) || 0) <= 0 ? "text-green-300" : "text-amber-300"}`}>{money(Math.max(0, editGross - (Number(edit.paid) || 0)))}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={saveEdit} disabled={saving} className="flex-1 bg-white text-black hover:bg-white/90 disabled:opacity-50 font-bold uppercase tracking-wider text-sm py-3 rounded-full">{saving ? "Saving…" : "Save"}</button>
              <button onClick={() => setEdit(null)} disabled={saving} className="px-6 border border-white/15 text-white/70 hover:text-white hover:border-white/40 rounded-full text-sm">Cancel</button>
            </div>
            {edit.kind === "group" && (
              <Link href={`/admin/folio/${edit.id}`} className="block text-center text-sky-400 hover:text-sky-300 text-xs mt-3">Open full folio →</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
