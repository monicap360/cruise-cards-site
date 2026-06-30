"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const money = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

type Grp = { id: string; name: string; ship: string; sailing_date: string };
type Mem = { group_id: string; fare: number; deposit_paid: number; paid_in_full: boolean; guests: number };
type IB = { ship: string; sail_date: string; checkin_status: string };
type Ord = { total: number; paid: boolean; status: string };

const monthLabel = (m: string) => m ? new Date(m + "-01T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—";
const cap = (s: string) => s ? s.replace(/\b\w/g, (c) => c.toUpperCase()) : s;

export default function ReportsPage() {
  const [groups, setGroups] = useState<Grp[]>([]);
  const [members, setMembers] = useState<Mem[]>([]);
  const [ibs, setIbs] = useState<IB[]>([]);
  const [orders, setOrders] = useState<Ord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const g = await supabase.from("groups").select("id,name,ship,sailing_date");
      const m = await supabase.from("group_members").select("group_id,fare,deposit_paid,paid_in_full,guests");
      setGroups((g.data as Grp[]) || []);
      setMembers((m.data as Mem[]) || []);
      try { const ib = await supabase.from("individual_bookings").select("ship,sail_date,checkin_status"); setIbs((ib.data as IB[]) || []); } catch { /* table may not exist */ }
      try { const o = await supabase.from("orders").select("total,paid,status"); setOrders((o.data as Ord[]) || []); } catch { /* table may not exist */ }
      setLoading(false);
    })();
  }, []);

  const r = useMemo(() => {
    const gById = new Map(groups.map((g) => [g.id, g]));
    const perGroup = new Map<string, { name: string; ship: string; date: string; fare: number; collected: number; owed: number; guests: number; cabins: number }>();
    const perShip = new Map<string, { fare: number; guests: number; cabins: number }>();
    const perMonth = new Map<string, { fare: number; guests: number; cabins: number }>();
    let fare = 0, collected = 0, owed = 0, guests = 0, cabins = 0;

    for (const mem of members) {
      const g = gById.get(mem.group_id);
      const f = Number(mem.fare) || 0, paid = Number(mem.deposit_paid) || 0;
      const ow = mem.paid_in_full ? 0 : Math.max(0, f - paid);
      const gu = Number(mem.guests) || 0;
      fare += f; collected += paid; owed += ow; guests += gu; cabins += 1;
      if (g) {
        const pg = perGroup.get(g.id) || { name: g.name, ship: g.ship, date: g.sailing_date, fare: 0, collected: 0, owed: 0, guests: 0, cabins: 0 };
        pg.fare += f; pg.collected += paid; pg.owed += ow; pg.guests += gu; pg.cabins += 1; perGroup.set(g.id, pg);
        const ship = g.ship || "—";
        const ps = perShip.get(ship) || { fare: 0, guests: 0, cabins: 0 }; ps.fare += f; ps.guests += gu; ps.cabins += 1; perShip.set(ship, ps);
        const mo = (g.sailing_date || "").slice(0, 7);
        const pm = perMonth.get(mo) || { fare: 0, guests: 0, cabins: 0 }; pm.fare += f; pm.guests += gu; pm.cabins += 1; perMonth.set(mo, pm);
      }
    }
    const ordersCollected = orders.filter((o) => o.paid && o.status !== "refunded" && o.status !== "cancelled").reduce((s, o) => s + (Number(o.total) || 0), 0);
    const ibNeeds = ibs.filter((b) => !/complete/i.test(b.checkin_status)).length;

    return {
      fare, collected, owed, guests, cabins,
      groups: Array.from(perGroup.values()).sort((a, b) => b.fare - a.fare),
      ships: Array.from(perShip.entries()).map(([ship, v]) => ({ ship, ...v })).sort((a, b) => b.fare - a.fare),
      months: Array.from(perMonth.entries()).map(([m, v]) => ({ m, ...v })).sort((a, b) => a.m.localeCompare(b.m)),
      ordersCollected, ibCount: ibs.length, ibNeeds,
    };
  }, [groups, members, ibs, orders]);

  const KPIS = [
    { label: "Booked fare", value: money(r.fare), accent: "text-holo" },
    { label: "Deposits collected", value: money(r.collected), accent: "text-green-300" },
    { label: "Balance owed", value: money(r.owed), accent: "text-amber-300" },
    { label: "Guests", value: String(r.guests), accent: "text-white" },
    { label: "Cabins", value: String(r.cabins), accent: "text-white" },
    { label: "Individual bookings", value: String(r.ibCount), accent: "text-sky-300" },
    { label: "Need check-in", value: String(r.ibNeeds), accent: r.ibNeeds ? "text-amber-300" : "text-white/70" },
    { label: "Front-desk collected", value: money(r.ordersCollected), accent: "text-green-300" },
  ];

  const th = "text-left px-3 py-2 text-[10px] uppercase tracking-wider text-white/45 label-mono";
  const td = "px-3 py-2";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{"// Money"}</div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Reports</h1>
            <p className="text-white/55 text-sm">Sales, deposits, balances & bookings across every group.</p>
          </div>
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
        </div>

        {loading ? <div className="text-white/50">Loading…</div> : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {KPIS.map((k) => (
                <div key={k.label} className="bg-[#0b1020] border border-white/10 rounded-2xl p-4">
                  <div className={`text-2xl font-extrabold ${k.accent}`}>{k.value}</div>
                  <div className="text-white/45 text-[10px] uppercase tracking-wider label-mono mt-1">{k.label}</div>
                </div>
              ))}
            </div>

            {/* By group */}
            <div className="mb-8">
              <div className="label-mono text-[11px] uppercase tracking-[0.18em] text-sky-400/70 mb-2">By group</div>
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0b1020]">
                <table className="w-full text-sm min-w-[640px]">
                  <thead><tr className="bg-white/5"><th className={th}>Group</th><th className={th}>Ship · sails</th><th className={`${th} text-center`}>Cabins</th><th className={`${th} text-center`}>Guests</th><th className={`${th} text-right`}>Fare</th><th className={`${th} text-right`}>Collected</th><th className={`${th} text-right`}>Owed</th></tr></thead>
                  <tbody>
                    {r.groups.map((g) => (
                      <tr key={g.name} className="border-t border-white/10">
                        <td className={`${td} font-semibold`}>{g.name}</td>
                        <td className={`${td} text-white/60 capitalize`}>{g.ship}{g.date ? ` · ${g.date}` : ""}</td>
                        <td className={`${td} text-center text-white/70`}>{g.cabins}</td>
                        <td className={`${td} text-center text-white/70`}>{g.guests}</td>
                        <td className={`${td} text-right`}>{money(g.fare)}</td>
                        <td className={`${td} text-right text-green-300`}>{money(g.collected)}</td>
                        <td className={`${td} text-right font-bold text-amber-300`}>{g.owed > 0 ? money(g.owed) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* By ship + by month */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="label-mono text-[11px] uppercase tracking-[0.18em] text-sky-400/70 mb-2">By ship</div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1020] overflow-hidden">
                  <table className="w-full text-sm"><thead><tr className="bg-white/5"><th className={th}>Ship</th><th className={`${th} text-center`}>Cabins</th><th className={`${th} text-center`}>Guests</th><th className={`${th} text-right`}>Fare</th></tr></thead>
                    <tbody>{r.ships.map((s) => (<tr key={s.ship} className="border-t border-white/10"><td className={`${td} font-semibold capitalize`}>{cap(s.ship)}</td><td className={`${td} text-center text-white/70`}>{s.cabins}</td><td className={`${td} text-center text-white/70`}>{s.guests}</td><td className={`${td} text-right`}>{money(s.fare)}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
              <div>
                <div className="label-mono text-[11px] uppercase tracking-[0.18em] text-sky-400/70 mb-2">By sail month</div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1020] overflow-hidden">
                  <table className="w-full text-sm"><thead><tr className="bg-white/5"><th className={th}>Month</th><th className={`${th} text-center`}>Cabins</th><th className={`${th} text-center`}>Guests</th><th className={`${th} text-right`}>Fare</th></tr></thead>
                    <tbody>{r.months.map((m) => (<tr key={m.m} className="border-t border-white/10"><td className={`${td} font-semibold`}>{monthLabel(m.m)}</td><td className={`${td} text-center text-white/70`}>{m.cabins}</td><td className={`${td} text-center text-white/70`}>{m.guests}</td><td className={`${td} text-right`}>{money(m.fare)}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            </div>
            <p className="text-white/30 text-[11px] mt-6">Fare/deposit figures come from group rosters. Individual‑booking revenue isn't tracked yet (no fare field) — add it and it'll roll in here.</p>
          </>
        )}
      </div>
    </div>
  );
}
