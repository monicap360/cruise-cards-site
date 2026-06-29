"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { type GroupOrder, ORDER_ITEMS, getAllOrders, updateOrderStatus } from "@/lib/orders";

const STATUSES = ["New", "Working", "Done"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<GroupOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"open" | "all">("open");

  async function load() {
    setLoading(true);
    setOrders(await getAllOrders());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await updateOrderStatus(id, status);
  }

  const shown = useMemo(
    () => orders.filter((o) => (filter === "open" ? o.status !== "Done" : true)),
    [orders, filter]
  );
  const openCount = orders.filter((o) => o.status !== "Done").length;

  const meta = (item: string) => ORDER_ITEMS[item] || { label: item, emoji: "📦" };

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{"// Admin"}</div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.02em]">Group Orders</h1>
            <p className="text-white/55 text-sm mt-1">Add-on orders from group portals — soda, drink packages, prepaid tips, protection, pre-cruise hotel.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hud label-mono text-[10px] uppercase tracking-wider text-white px-3 py-1.5 rounded-full">{openCount} open</span>
            <button onClick={load} className="border border-white/20 hover:border-white/50 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full">Refresh</button>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          {(["open", "all"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full ${filter === f ? "bg-white text-black" : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"}`}>
              {f === "open" ? "Open" : "All"}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="text-white/50">Loading…</div>
          ) : shown.length === 0 ? (
            <div className="text-white/45 text-center py-12">
              {filter === "open" ? "No open orders — all caught up. 🎉" : "No orders yet."}
              <div className="text-white/30 text-xs mt-2">Orders appear here once a guest places one from their group portal.</div>
            </div>
          ) : (
            shown.map((o) => {
              const m = meta(o.item);
              return (
                <div key={o.id} className="bg-[#0b1020] border border-white/10 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="text-xl">{m.emoji}</span>{o.itemLabel || m.label}
                        {o.qty > 1 && <span className="text-white/50 text-sm">× {o.qty}</span>}
                      </div>
                      <div className="text-white/55 text-sm mt-1">
                        {o.name}{o.phone ? ` · ${o.phone}` : ""}
                      </div>
                      <div className="text-white/45 text-xs mt-1">
                        Group <span className="text-sky-300">{o.groupCode}</span>
                        {o.room ? ` · Room ${o.room}` : ""}{o.cabin ? ` · ${o.cabin}` : ""}
                        {o.createdAt ? ` · ${new Date(o.createdAt).toLocaleDateString("en-US")}` : ""}
                      </div>
                      {o.notes && <div className="text-white/60 text-sm mt-2 italic">“{o.notes}”</div>}
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {STATUSES.map((s) => (
                        <button key={s} onClick={() => setStatus(o.id, s)}
                          className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                            o.status === s
                              ? s === "Done" ? "bg-green-500/20 text-green-300 border border-green-400/30" : "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                              : "bg-white/5 text-white/45 border border-white/10 hover:text-white"
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8">
          <Link href="/admin/groups" className="text-white/50 hover:text-white text-xs font-bold uppercase tracking-wider">← Back to Groups</Link>
        </div>
      </section>
    </div>
  );
}
