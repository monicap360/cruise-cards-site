"use client";

import { useEffect, useState } from "react";
import { IN_HOUSE_SERVICES } from "@/lib/services";
import { type Reservation, type CheckoutItem, PAYMENT_METHODS } from "@/lib/reservations";
import { type Order, type OrderStatus, getOrderByReservation, saveOrder, newOrderId } from "@/lib/fulfillment";

// Point-of-service checkout. Adds the services a guest used and writes a single
// order into the central Fulfillment queue (/admin/fulfillment) — keyed by the
// reservation, so re-opening edits the same order. No merchant: cash/check/Apple Cash.

const money = (n: number) => "$" + n.toFixed(2);
const isPartner = (name: string) => /scootaround/i.test(IN_HOUSE_SERVICES.find((s) => s.name === name)?.note || "");

export default function FrontDeskCheckout({ reservation }: { reservation: Reservation }) {
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [pick, setPick] = useState("");
  const [method, setMethod] = useState<string>("Cash");
  const [paid, setPaid] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      const existing = await getOrderByReservation(reservation.id);
      if (existing) {
        setItems(existing.items); setMethod(existing.method || "Cash");
        setPaid(existing.paid); setOrderId(existing.id); setStatus(existing.status);
      }
    })();
  }, [reservation.id]);

  const total = items.filter((i) => !i.free && !i.partner).reduce((s, i) => s + i.price * i.qty, 0);

  function add() {
    const svc = IN_HOUSE_SERVICES.find((s) => s.name === pick);
    if (!svc) return;
    setItems((x) => [...x, { name: svc.name, price: svc.price ?? 0, qty: 1, free: svc.free, partner: isPartner(svc.name) ? "ScootAround" : undefined }]);
    setPick(""); setSaved(false);
  }
  const upd = (i: number, patch: Partial<CheckoutItem>) => { setItems((x) => x.map((it, idx) => (idx === i ? { ...it, ...patch } : it))); setSaved(false); };
  const del = (i: number) => { setItems((x) => x.filter((_, idx) => idx !== i)); setSaved(false); };

  async function save() {
    if (items.length === 0) { setErr("Add at least one service."); return; }
    const order: Order = {
      id: orderId || newOrderId(), source: "front-desk", reservationId: reservation.id, groupCode: "",
      customerName: reservation.guestName, customerContact: reservation.guestPhone || reservation.guestEmail,
      items, total, method, paid, status, notes: reservation.reservationNumber,
    };
    const ok = await saveOrder(order);
    if (ok) { setOrderId(order.id); setSaved(true); setErr(""); }
    else setErr("Couldn't save — add the orders table (SQL) first.");
  }

  const inp = "bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-sky-400/60";

  return (
    <div className="bg-[#070d1a] border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-sm">💳 Front Desk Checkout</span>
        <a href="/admin/fulfillment" className="text-sky-400 hover:text-sky-300 text-xs font-bold">Fulfillment →</a>
      </div>

      <div className="flex gap-2 mb-3">
        <select value={pick} onChange={(e) => setPick(e.target.value)} className={`${inp} flex-1`}>
          <option value="" className="bg-[#0b1020]">Add a service…</option>
          {IN_HOUSE_SERVICES.map((s) => (
            <option key={s.name} value={s.name} className="bg-[#0b1020]">
              {s.free ? "🆓 " : "💲 "}{s.name}{s.price ? ` ($${s.price}${s.unit ? " " + s.unit : ""})` : ""}
            </option>
          ))}
        </select>
        <button onClick={add} disabled={!pick} className="bg-white text-black hover:bg-white/90 disabled:opacity-40 font-bold uppercase tracking-wider text-[11px] px-4 rounded-lg">Add</button>
      </div>

      {items.length === 0 ? (
        <div className="text-white/40 text-sm py-2">No services added yet.</div>
      ) : (
        <div className="space-y-1.5 mb-3">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-2 flex-wrap text-sm">
              <span className="flex-1 min-w-[8rem]">{it.name}
                {it.free && <span className="ml-1 text-[10px] font-bold uppercase text-green-300">free</span>}
                {it.partner && <span className="ml-1 text-[10px] font-bold uppercase text-amber-300">{it.partner} · commission</span>}
              </span>
              <span className="text-white/40 text-xs">qty</span>
              <input type="number" min={1} value={it.qty} onChange={(e) => upd(i, { qty: Math.max(1, Number(e.target.value)) })} className={`${inp} w-14`} />
              {!it.free && !it.partner ? (
                <>
                  <span className="text-white/40 text-xs">@</span>
                  <input type="number" min={0} value={it.price} onChange={(e) => upd(i, { price: Number(e.target.value) })} className={`${inp} w-20`} />
                  <span className="w-16 text-right font-mono text-white/80">{money(it.price * it.qty)}</span>
                </>
              ) : <span className="w-16 text-right text-white/30 text-xs">—</span>}
              <button onClick={() => del(i)} className="text-red-300/70 hover:text-red-200 text-xs">×</button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-white/10 pt-3 flex items-center justify-between flex-wrap gap-3">
        <div className="text-lg font-extrabold">Owed: <span className="text-holo">{money(total)}</span></div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={method} onChange={(e) => { setMethod(e.target.value); setSaved(false); }} className={inp}>
            {PAYMENT_METHODS.map((m) => <option key={m} value={m} className="bg-[#0b1020]">{m}</option>)}
          </select>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="checkbox" checked={paid} onChange={(e) => { setPaid(e.target.checked); setSaved(false); }} className="accent-green-500" /> Paid
          </label>
          <button onClick={save} className="bg-sky-600 hover:bg-sky-500 text-white font-bold uppercase tracking-wider text-[11px] px-4 py-2 rounded-full">{saved ? "Saved ✓" : "Save to queue"}</button>
        </div>
      </div>
      {err && <div className="text-amber-300 text-xs mt-2">{err}</div>}
      <p className="text-white/30 text-[10px] mt-2">Goes to the Fulfillment queue. No card processing — cash, check, or Apple Cash. ScootAround items are commission (billed by ScootAround).</p>
    </div>
  );
}
