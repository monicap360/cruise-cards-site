"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type Order, type OrderStatus,
  ORDER_STATUSES, STATUS_BADGE,
  getOrders, setOrderStatus, setOrderPaid, deleteOrder,
} from "@/lib/fulfillment";

const money = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const SOURCE_LABEL: Record<string, string> = {
  "front-desk": "🛎️ Front Desk",
  group: "👥 Group",
  "add-on": "➕ Add-on",
  online: "🌐 Online",
};

export default function FulfillmentPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"open" | OrderStatus | "all">("open");

  async function load() { setLoading(true); setOrders(await getOrders()); setLoading(false); }
  useEffect(() => { load(); }, []);

  async function status(o: Order, s: OrderStatus) {
    setOrders((x) => x.map((y) => (y.id === o.id ? { ...y, status: s } : y)));
    await setOrderStatus(o.id, s);
  }
  async function togglePaid(o: Order) {
    setOrders((x) => x.map((y) => (y.id === o.id ? { ...y, paid: !y.paid } : y)));
    await setOrderPaid(o.id, !o.paid);
  }
  async function remove(id: string) { if (confirm("Delete this order?")) { await deleteOrder(id); load(); } }

  const shown = useMemo(() => orders.filter((o) =>
    filter === "all" ? true : filter === "open" ? o.status === "pending" : o.status === filter), [orders, filter]);

  const openCount = orders.filter((o) => o.status === "pending").length;
  const owed = orders.filter((o) => o.status === "pending" && !o.paid).reduce((s, o) => s + o.total, 0);
  const collected = orders.filter((o) => o.paid && o.status !== "refunded" && o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{"// Orders"}</div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Fulfillment</h1>
            <p className="text-white/55 text-sm">Every guest order — front desk, groups, add-ons — in one queue to fulfill, redeem, or refund.</p>
          </div>
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Open orders", value: String(openCount), accent: "text-amber-300" },
            { label: "Owed (unpaid)", value: money(owed), accent: "text-sky-300" },
            { label: "Collected", value: money(collected), accent: "text-green-300" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0b1020] border border-white/10 rounded-2xl p-4">
              <div className={`text-2xl font-extrabold ${s.accent}`}>{s.value}</div>
              <div className="text-white/45 text-[10px] uppercase tracking-wider label-mono mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(["open", ...ORDER_STATUSES, "all"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full ${filter === f ? "bg-white text-black" : "bg-white/5 text-white/55 border border-white/10 hover:text-white"}`}>{f}</button>
          ))}
        </div>

        {loading ? <div className="text-white/50">Loading…</div> : shown.length === 0 ? (
          <div className="text-white/45 text-center py-12">{filter === "open" ? "No open orders. 🎉" : "No orders."}</div>
        ) : (
          <div className="space-y-3">
            {shown.map((o) => (
              <div key={o.id} className="bg-[#0b1020] border border-white/10 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{o.customerName || "Guest"}</span>
                      <span className="text-white/35 text-xs">{SOURCE_LABEL[o.source] || o.source}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_BADGE[o.status]}`}>{o.status}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${o.paid ? "bg-green-500/15 text-green-300 border-green-400/30" : "bg-white/5 text-white/45 border-white/15"}`}>{o.paid ? `paid · ${o.method}` : "unpaid"}</span>
                    </div>
                    <div className="text-white/55 text-sm mt-1">
                      {o.items.map((it, i) => (
                        <span key={i}>{i > 0 ? " · " : ""}{it.qty > 1 ? `${it.qty}× ` : ""}{it.name}{!it.free && !it.partner ? ` (${money(it.price * it.qty)})` : it.free ? " (free)" : ` (${it.partner})`}</span>
                      ))}
                    </div>
                    {o.customerContact && <div className="text-white/30 text-xs mt-0.5">{o.customerContact}</div>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-extrabold text-holo">{money(o.total)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-white/10 text-xs font-bold">
                  <button onClick={() => togglePaid(o)} className={o.paid ? "text-white/50 hover:text-white" : "text-green-300 hover:text-green-200"}>{o.paid ? "Mark unpaid" : "✓ Mark paid"}</button>
                  <span className="text-white/15">|</span>
                  <button onClick={() => status(o, "fulfilled")} className="text-green-300 hover:text-green-200">Fulfill</button>
                  <button onClick={() => status(o, "redeemed")} className="text-sky-300 hover:text-sky-200">Redeem</button>
                  <button onClick={() => status(o, "refunded")} className="text-red-300 hover:text-red-200">Refund</button>
                  <button onClick={() => status(o, "pending")} className="text-amber-300 hover:text-amber-200">Reopen</button>
                  <button onClick={() => status(o, "cancelled")} className="text-white/50 hover:text-white">Cancel</button>
                  <span className="text-white/15">|</span>
                  <button onClick={() => remove(o.id)} className="text-red-300/70 hover:text-red-200">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
