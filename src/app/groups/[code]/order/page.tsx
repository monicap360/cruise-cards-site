"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ORDER_ITEMS, newOrderId, saveOrder, parkingPrice, GRATUITY_PER_DAY, PARK_OVERRIDE, PROTECTION_OVERRIDE, type GroupOrder } from "@/lib/orders";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/shop";
import BrandLogo from "@/components/BrandLogo";

function OrderInner() {
  const params = useParams();
  const sp = useSearchParams();
  const code = String(params.code || "");
  const itemKey = sp.get("item") || "";
  const room = sp.get("room") || "";
  const cabin = sp.get("cabin") || "";
  const guests = Number(sp.get("guests") || 2);
  const nights = Number(sp.get("nights") || 5);
  const item = ORDER_ITEMS[itemKey];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [arrival, setArrival] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [plate, setPlate] = useState("");
  const [carType, setCarType] = useState("");
  const [carPeople, setCarPeople] = useState("");
  const [bags, setBags] = useState("");
  const [dropFirst, setDropFirst] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const tipsTotal = itemKey === "tips" ? Math.round(GRATUITY_PER_DAY * (nights || 5) * guests) : 0;
  const parkingCost = itemKey === "parking" ? (PARK_OVERRIDE[code] || parkingPrice(nights)) : 0;
  const protectionCost = itemKey === "protection" ? (PROTECTION_OVERRIDE[code] || 0) : 0;
  const est = tipsTotal || parkingCost || protectionCost;

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
  const isParking = itemKey === "parking";

  async function submit() {
    if (!name.trim()) { setErr("Please add the name on the reservation."); return; }
    if (isTravel && !arrival) { setErr("Let us know if you're flying or driving."); return; }
    if (isParking && !plate.trim()) { setErr("Please add the license plate for the vehicle."); return; }
    if (item.ack && !agreed) { setErr("Please check the box to acknowledge and continue."); return; }
    setBusy(true); setErr("");
    const travelNote = isTravel
      ? `Arrival: ${arrival}${arrival === "Driving" && vehicle ? ` · Vehicle: ${vehicle}` : ""}. `
      : "";
    const parkingNote = isParking
      ? `Vehicle: ${carType || "—"} · Plate: ${plate || "—"} · ${carPeople || "?"} people · ${bags || "?"} bags · ${dropFirst === "yes" ? "Dropping guests/luggage at ship first" : "Parking directly"}. `
      : "";
    const ackNote = item.ack ? `[ACKNOWLEDGED: ${item.ack}] ` : "";
    const o: GroupOrder = {
      id: newOrderId(), groupCode: code, item: itemKey, itemLabel: item.label,
      room, cabin, name, phone, qty: item.qty ? qty : 1,
      notes: ackNote + travelNote + parkingNote + notes + (cabin ? ` · ${cabin}` : ""), status: "New",
    };
    const ok = await saveOrder(o);
    setBusy(false);
    if (ok) { setDone(true); return; }
    // Fallback to email if the orders table isn't set up yet
    const body = `Order: ${item.label}${item.qty ? ` × ${qty}` : ""}\nGroup: ${code}\nRoom ${room}${cabin ? ` (${cabin})` : ""}\nName: ${name}\nPhone: ${phone}\nNotes: ${notes}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${item.label} — ${cabin || "Group " + code}`)}&body=${encodeURIComponent(body)}`;
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/45 mb-1.5">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Branded top bar */}
      <header className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="bg-white rounded-lg px-2.5 py-1.5 inline-flex"><BrandLogo className="h-7" /></span>
          <Link href={`/groups/${code}`} className="text-white/50 hover:text-white text-xs font-bold uppercase tracking-wider">← Back to group</Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-2">{item.ack ? "// Request" : "// Secure Checkout"}</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em]">{item.label}</h1>
        <p className="text-white/55 mt-2 max-w-xl">{item.desc}</p>

        <div className="mt-8 grid md:grid-cols-[1fr_300px] gap-6 items-start">
          {/* Form */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1020] p-6 sm:p-7 order-2 md:order-1">
            {done ? (
              <div className="text-center py-8">
                <div className="mx-auto h-14 w-14 rounded-full bg-green-500/15 border border-green-400/30 flex items-center justify-center text-green-300 text-2xl">✓</div>
                <h2 className="text-xl font-extrabold mt-4">{item.ack ? "Request received" : "Order received"}</h2>
                <p className="text-white/55 text-sm mt-2 max-w-xs mx-auto">Thank you — your specialist will review this and follow up to confirm the details{item.ack ? ", any fees, and next steps." : " and pricing shortly."}</p>
                <Link href={`/groups/${code}`} className="inline-block mt-6 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full">
                  Back to your group
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="text-sm font-bold tracking-tight">Your details</div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Name on reservation">
                    <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                  </Field>
                  <Field label="Cell phone">
                    <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(409) 000-0000" />
                  </Field>
                </div>

                {item.qty && (
                  <Field label="Quantity">
                    <input type="number" min={1} className={`${input} w-28`} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
                  </Field>
                )}

                {isTravel && (
                  <Field label="Are you flying or driving in?">
                    <div className="grid grid-cols-2 gap-3">
                      {["Driving", "Flying"].map((a) => (
                        <button key={a} type="button" onClick={() => setArrival(a)}
                          className={`rounded-xl px-4 py-3 text-sm font-semibold border transition-all ${arrival === a ? "bg-sky-500/15 border-sky-400/60 text-white" : "bg-white/[0.03] border-white/15 text-white/70 hover:border-sky-400/40"}`}>
                          {a} in
                        </button>
                      ))}
                    </div>
                    {arrival === "Driving" && (
                      <input className={`${input} mt-3`} value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="Vehicle type (SUV, truck, minivan, sedan)" />
                    )}
                    {arrival === "Flying" && (
                      <p className="text-white/45 text-xs mt-2">We can arrange a transfer from Houston (IAH / Hobby) — add details below.</p>
                    )}
                  </Field>
                )}

                {isParking && (
                  <div className="space-y-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-white/45">Vehicle details</div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input className={input} value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="License plate #" />
                      <input className={input} value={carType} onChange={(e) => setCarType(e.target.value)} placeholder="Car make/model (e.g. Toyota Highlander)" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/45 mb-1.5">Dropping guests &amp; luggage at the ship first?</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[["yes", "Yes — drop at ship first"], ["no", "No — park directly"]].map(([v, l]) => (
                          <button key={v} type="button" onClick={() => setDropFirst(v)}
                            className={`rounded-xl px-4 py-3 text-sm font-semibold border transition-all ${dropFirst === v ? "bg-sky-500/15 border-sky-400/60 text-white" : "bg-white/[0.03] border-white/15 text-white/70 hover:border-sky-400/40"}`}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input className={input} type="number" min={1} value={carPeople} onChange={(e) => setCarPeople(e.target.value)} placeholder="People in car" />
                      {dropFirst !== "yes" && (
                        <input className={input} type="number" min={0} value={bags} onChange={(e) => setBags(e.target.value)} placeholder="Luggage bags" />
                      )}
                    </div>
                    <div className="rounded-xl border border-green-400/30 bg-green-500/[0.07] px-4 py-3 text-sm text-green-200">
                      💵 Pay parking by <span className="font-bold">Cash App: $galvestonmonica</span> — please add your cabin/last name in the note.
                    </div>
                  </div>
                )}

                <Field label={item.ack ? "Details" : "Notes (optional)"}>
                  <textarea className={input} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={item.notePrompt || "Sizes, preferences, special requests…"} />
                </Field>

                {item.ack && (
                  <label className="flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-500/[0.07] px-4 py-3 cursor-pointer">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-sky-500 shrink-0" />
                    <span className="text-white/75 text-xs leading-relaxed">{item.ack}</span>
                  </label>
                )}

                {err && <div className="text-amber-300 text-sm">{err}</div>}
                <button onClick={submit} disabled={busy}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-white disabled:opacity-50 font-semibold uppercase tracking-wider text-sm px-6 py-4 rounded-xl transition-all">
                  {busy ? "Submitting…" : item.ack ? "Submit request" : "Place order"}
                </button>
                <p className="text-white/40 text-xs text-center">🔒 No card charged online — we confirm pricing &amp; how to pay. Questions? {CONTACT_PHONE_DISPLAY}</p>
              </div>
            )}
          </div>

          {/* Order summary */}
          <aside className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 order-1 md:order-2 md:sticky md:top-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-4">Order summary</div>
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-sky-500/10 border border-sky-400/25 flex items-center justify-center text-lg">{item.emoji}</div>
              <div>
                <div className="font-bold leading-tight">{item.label}</div>
                <div className="text-white/45 text-xs mt-1">{item.priceNote}</div>
              </div>
            </div>
            <div className="mt-5 border-t border-white/10 pt-4 space-y-2.5 text-sm">
              {room && (
                <div className="flex justify-between gap-3">
                  <span className="text-white/45">Room</span>
                  <span className="text-right">{room}{cabin ? ` · ${cabin}` : ""}</span>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <span className="text-white/45">Guests</span>
                <span>{guests}</span>
              </div>
              {est > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="text-white/45">{parkingCost > 0 ? "Parking (per vehicle)" : protectionCost > 0 ? "Protection (cabin)" : "Gratuities"}</span>
                  <span className="text-holo font-extrabold">${est}</span>
                </div>
              )}
            </div>
            <div className="mt-5 rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2.5 text-[11px] leading-relaxed text-white/45">
              Reviewed by your specialist before anything is charged. Pay by mailed check or directly with the cruise line.
            </div>
          </aside>
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
