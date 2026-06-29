"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ORDER_ITEMS, newOrderId, saveOrder, type GroupOrder } from "@/lib/orders";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/shop";

function OrderInner() {
  const params = useParams();
  const sp = useSearchParams();
  const code = String(params.code || "");
  const itemKey = sp.get("item") || "";
  const room = sp.get("room") || "";
  const cabin = sp.get("cabin") || "";
  const guests = Number(sp.get("guests") || 2);
  const item = ORDER_ITEMS[itemKey];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [arrival, setArrival] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const tipsTotal = itemKey === "tips" ? 18 * 5 * guests : 0; // $18 pp/day × 5 nights

  const input =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";

  if (!item) {
    return (
      <div className="min-h-screen bg-[#05070d] text-white flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-extrabold">That item isn&rsquo;t available</h1>
        <Link href={`/groups/${code}`} className="text-sky-400 hover:text-sky-300 font-semibold">← Back to your group</Link>
      </div>
    );
  }

  const isTravel = itemKey === "travel";

  async function submit() {
    if (!name.trim()) { setErr("Please add the name on the reservation."); return; }
    if (isTravel && !arrival) { setErr("Let us know if you're flying or driving."); return; }
    setBusy(true); setErr("");
    const travelNote = isTravel
      ? `Arrival: ${arrival}${arrival === "Driving" && vehicle ? ` · Vehicle: ${vehicle}` : ""}. `
      : "";
    const o: GroupOrder = {
      id: newOrderId(), groupCode: code, item: itemKey, itemLabel: item.label,
      room, cabin, name, phone, qty: item.qty ? qty : 1,
      notes: travelNote + notes + (cabin ? ` · ${cabin}` : ""), status: "New",
    };
    const ok = await saveOrder(o);
    setBusy(false);
    if (ok) { setDone(true); return; }
    // Fallback to email if the orders table isn't set up yet
    const body = `Order: ${item.label}${item.qty ? ` × ${qty}` : ""}\nGroup: ${code}\nRoom ${room}${cabin ? ` (${cabin})` : ""}\nName: ${name}\nPhone: ${phone}\nNotes: ${notes}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${item.label} — ${cabin || "Group " + code}`)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <Link href={`/groups/${code}`} className="text-white/50 hover:text-white text-xs font-bold uppercase tracking-wider">← Back to your group</Link>

        <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1020] p-6">
          <div className="text-5xl">{item.emoji}</div>
          <h1 className="text-2xl font-extrabold mt-3">{item.label}</h1>
          <p className="text-white/60 text-sm mt-1">{item.desc}</p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            {room && <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/70">Room {room}{cabin ? ` · ${cabin}` : ""}</span>}
            <span className="bg-sky-500/10 border border-sky-400/25 rounded-full px-3 py-1 text-sky-300">{item.priceNote}</span>
            {tipsTotal > 0 && <span className="bg-green-500/10 border border-green-400/25 rounded-full px-3 py-1 text-green-300">Est. ${tipsTotal} for {guests} guest{guests === 1 ? "" : "s"}</span>}
          </div>

          {done ? (
            <div className="mt-6 rounded-xl bg-green-50 text-green-800 border border-green-200 px-4 py-4 font-semibold">
              ✓ Order received! We&rsquo;ll reach out to confirm details and pricing.
              <div className="mt-3">
                <Link href={`/groups/${code}`} className="text-green-700 underline text-sm">Back to your group →</Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name on reservation" />
              <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Cell phone" />
              {item.qty && (
                <div className="flex items-center gap-3">
                  <label className="text-white/60 text-sm">Quantity</label>
                  <input type="number" min={1} className={`${input} w-24`} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
                </div>
              )}
              {isTravel && (
                <div className="space-y-3">
                  <div>
                    <label className="text-white/60 text-sm">Are you flying or driving in?</label>
                    <div className="flex gap-2 mt-2">
                      {["Driving", "Flying"].map((a) => (
                        <button key={a} type="button" onClick={() => setArrival(a)}
                          className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold border ${arrival === a ? "bg-sky-500/20 border-sky-400/60 text-white" : "bg-white/5 border-white/15 text-white/70 hover:border-sky-400/40"}`}>
                          {a === "Driving" ? "🚗 Driving in" : "✈️ Flying in"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {arrival === "Driving" && (
                    <input className={input} value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="Vehicle type (e.g. SUV, truck, minivan, sedan)" />
                  )}
                  {arrival === "Flying" && (
                    <p className="text-white/50 text-sm">Flying in? We can arrange a transfer from Houston (IAH/Hobby) — add details below.</p>
                  )}
                </div>
              )}
              <textarea className={input} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything we should know? (sizes, preferences, special requests…)" />
              {err && <div className="text-amber-300 text-sm">{err}</div>}
              <button onClick={submit} disabled={busy} className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-6 py-3.5 rounded-full">
                {busy ? "Sending…" : "Place order"}
              </button>
              <p className="text-white/40 text-xs text-center">No card charged online — we&rsquo;ll confirm pricing and how to pay. Questions? {CONTACT_PHONE_DISPLAY}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={null}>
      <OrderInner />
    </Suspense>
  );
}
