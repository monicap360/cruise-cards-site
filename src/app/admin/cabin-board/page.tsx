"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const money = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const cap = (s: string) => (s ? s.replace(/\b\w/g, (c) => c.toUpperCase()) : "Unassigned");

type Grp = { id: string; name: string; ship: string; sailing_date: string };
type Mem = { id: string; group_id: string; name: string; cabin_type: string; cabin_number: string; fare: number; deposit_paid: number; paid_in_full: boolean; guests: number };
type IB = { guest_name: string; ship: string; sail_date: string; booking_number: string; checkin_status: string };

type Cabin = { kind: "group"; m: Mem; groupName: string; date: string } | { kind: "ind"; b: IB };

export default function CabinBoardPage() {
  const [groups, setGroups] = useState<Grp[]>([]);
  const [members, setMembers] = useState<Mem[]>([]);
  const [ibs, setIbs] = useState<IB[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const g = await supabase.from("groups").select("id,name,ship,sailing_date");
      const m = await supabase.from("group_members").select("id,group_id,name,cabin_type,cabin_number,fare,deposit_paid,paid_in_full,guests");
      setGroups((g.data as Grp[]) || []);
      setMembers((m.data as Mem[]) || []);
      try { const ib = await supabase.from("individual_bookings").select("guest_name,ship,sail_date,booking_number,checkin_status"); setIbs((ib.data as IB[]) || []); } catch { /* table may not exist */ }
      setLoading(false);
    })();
  }, []);

  const ships = useMemo(() => {
    const gById = new Map(groups.map((g) => [g.id, g]));
    const byShip = new Map<string, Cabin[]>();
    for (const m of members) {
      const g = gById.get(m.group_id);
      const ship = (g?.ship || "Unassigned").toLowerCase();
      const arr = byShip.get(ship) || []; arr.push({ kind: "group", m, groupName: g?.name || "—", date: g?.sailing_date || "" }); byShip.set(ship, arr);
    }
    for (const b of ibs) {
      const ship = (b.ship || "Unassigned").toLowerCase();
      const arr = byShip.get(ship) || []; arr.push({ kind: "ind", b }); byShip.set(ship, arr);
    }
    return Array.from(byShip.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [groups, members, ibs]);

  function memStatus(m: Mem) {
    const fare = m.fare || 0, paid = m.deposit_paid || 0;
    if (m.paid_in_full || (fare > 0 && paid >= fare)) return { label: "Paid", cls: "bg-green-500/15 text-green-300 border-green-400/30" };
    if (paid > 0) return { label: `Owes ${money(Math.max(0, fare - paid))}`, cls: "bg-amber-400/15 text-amber-300 border-amber-400/30" };
    return { label: "No deposit", cls: "bg-red-500/15 text-red-300 border-red-400/30" };
  }
  const ibBadge = (s: string) => /complete/i.test(s) ? "bg-green-500/15 text-green-300 border-green-400/30" : "bg-amber-400/15 text-amber-300 border-amber-400/30";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{"// Front Desk"}</div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Cabin Board</h1>
            <p className="text-white/55 text-sm">Every cabin by ship — group cabins &amp; individual bookings, with status.</p>
          </div>
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
        </div>

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
                    <Link key={i} href={`/admin/folio/${c.m.id}`} className="bg-[#0b1020] border border-white/10 rounded-xl p-4 hover:border-sky-400/40 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold capitalize">{c.m.name}</div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${memStatus(c.m).cls}`}>{memStatus(c.m).label}</span>
                      </div>
                      <div className="text-white/55 text-xs mt-1">{c.m.cabin_type}{c.m.cabin_number ? ` #${c.m.cabin_number}` : ""} · {c.m.guests}g</div>
                      <div className="text-white/35 text-[11px] mt-0.5">{c.groupName}{c.date ? ` · ${c.date}` : ""}</div>
                    </Link>
                  ) : (
                    <div key={i} className="bg-[#0b1020] border border-white/10 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold capitalize">{c.b.guest_name}</div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${ibBadge(c.b.checkin_status)}`}>{/complete/i.test(c.b.checkin_status) ? "Checked in" : "Check-in due"}</span>
                      </div>
                      <div className="text-white/55 text-xs mt-1">Individual · #{c.b.booking_number}</div>
                      <div className="text-white/35 text-[11px] mt-0.5">{c.b.sail_date}</div>
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
