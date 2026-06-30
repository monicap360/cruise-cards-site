"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type Customer, type Offer,
  getCustomers, saveCustomer, deleteCustomer,
  getOffers, saveOffer, deleteOffer,
  newCustomerId, newOfferId, newOfferToken,
} from "@/lib/crm";
import { type Ticket, saveTicket, newTicketId, newTicketToken, newTicketPin } from "@/lib/tickets";

const fmt$ = (n: number) => "$" + (n || 0).toLocaleString("en-US");
const STATUS_COLOR: Record<string, string> = {
  Sent: "bg-white/10 text-white/60", Viewed: "bg-sky-500/15 text-sky-300",
  Approved: "bg-amber-500/15 text-amber-300", Booked: "bg-green-500/15 text-green-300",
  Denied: "bg-red-500/15 text-red-300",
};

const blankCustomer = (): Customer => ({ id: newCustomerId(), name: "", email: "", phone: "", source: "", notes: "" });
const blankOffer = (c?: Customer): Offer => ({
  id: newOfferId(), token: newOfferToken(), customerId: c?.id || "", customerName: c?.name || "",
  customerEmail: c?.email || "", title: "", ship: "", cruiseLine: "", sailDate: "", nights: 7,
  cabinType: "Balcony", pricePP: 0, total: 0, notes: "", status: "Sent",
});

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [c, setC] = useState<Customer>(blankCustomer());
  const [editingC, setEditingC] = useState(false);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    setCustomers(await getCustomers());
    setOffers(await getOffers());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const offerUrl = (o: Offer) => `${origin}/offer/${o.token}`;

  async function saveC() {
    if (!c.name.trim()) { alert("Customer name required."); return; }
    await saveCustomer(c);
    setC(blankCustomer()); setEditingC(false);
    setCustomers(await getCustomers());
  }
  async function removeC(id: string) {
    if (!confirm("Delete this customer?")) return;
    await deleteCustomer(id);
    setCustomers(await getCustomers());
  }
  async function openTicket(cust: Customer) {
    const subject = prompt(`New ticket for ${cust.name} — subject:`);
    if (!subject) return;
    const t: Ticket = {
      id: newTicketId(), token: newTicketToken(), pin: newTicketPin(),
      customerName: cust.name, customerEmail: cust.email, customerPhone: cust.phone,
      groupCode: "", subject, status: "Open",
    };
    await saveTicket(t);
    alert(`Ticket opened for ${cust.name}. Manage it in Support Tickets. PIN ${t.pin}.`);
  }
  async function saveOf() {
    if (!offer) return;
    if (!offer.title.trim()) { alert("Give the offer a title."); return; }
    await saveOffer(offer);
    setOffers(await getOffers());
    setOffer(null);
  }
  async function removeOf(id: string) {
    if (!confirm("Delete this offer?")) return;
    await deleteOffer(id);
    setOffers(await getOffers());
  }

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? customers.filter((x) => `${x.name} ${x.email} ${x.phone}`.toLowerCase().includes(s)) : customers;
  }, [customers, q]);

  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block text-[10px] uppercase tracking-wider text-white/50 mb-1";

  function emailOffer(o: Offer) {
    const body = `Hi ${o.customerName.split(" ")[0] || "there"},\n\n` +
      `Here's your cruise offer${o.ship ? ` on ${o.ship}` : ""}${o.sailDate ? ` (${o.sailDate})` : ""}:\n` +
      `${o.title}\n${o.pricePP ? `From ${fmt$(o.pricePP)}/person. ` : ""}\n\n` +
      `View it, and approve or book, here:\n${offerUrl(o)}\n\nCruises from Galveston · (409) 632-2106`;
    window.location.href = `mailto:${encodeURIComponent(o.customerEmail)}?subject=${encodeURIComponent(`Your cruise offer — ${o.title}`)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{"// CRM"}</div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Customers &amp; Offers</h1>
            <p className="text-white/55 text-sm max-w-2xl">Your customer database. Send a cruise offer by email — they can view, approve, decline, or book it from the link.</p>
          </div>
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
        </div>

        {/* Add / edit customer */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-5 mb-6">
          <div className="font-bold text-sm mb-3">{editingC ? "Edit customer" : "Add a customer"}</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><label className={lbl}>Name *</label><input className={input} value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></div>
            <div><label className={lbl}>Email</label><input className={input} value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></div>
            <div><label className={lbl}>Phone</label><input className={input} value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} /></div>
            <div><label className={lbl}>Source</label><input className={input} value={c.source} onChange={(e) => setC({ ...c, source: e.target.value })} placeholder="Facebook, referral, walk-in…" /></div>
            <div className="sm:col-span-2"><label className={lbl}>Notes</label><input className={input} value={c.notes} onChange={(e) => setC({ ...c, notes: e.target.value })} /></div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={saveC} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">{editingC ? "Save" : "Add customer"}</button>
            {editingC && <button onClick={() => { setC(blankCustomer()); setEditingC(false); }} className="border border-white/20 text-white/70 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full">Cancel</button>}
          </div>
        </div>

        <input className={`${input} mb-4`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…" />

        {loading ? <div className="text-white/50">Loading…</div> : shown.length === 0 ? (
          <div className="text-white/45 text-center py-10">No customers yet — add one above.</div>
        ) : (
          <div className="space-y-3">
            {shown.map((cust) => {
              const theirs = offers.filter((o) => o.customerId === cust.id);
              return (
                <div key={cust.id} className="bg-[#0b1020] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-bold text-white">{cust.name}</div>
                      <div className="text-white/50 text-sm">{[cust.email, cust.phone].filter(Boolean).join(" · ")}</div>
                      {cust.source && <div className="text-white/35 text-xs mt-0.5">Source: {cust.source}</div>}
                      {cust.notes && <div className="text-white/45 text-xs mt-1 italic">{cust.notes}</div>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setOffer(blankOffer(cust))} className="bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full">+ Offer</button>
                      <button onClick={() => openTicket(cust)} className="text-amber-300 text-xs font-bold hover:text-amber-200">🎫 Ticket</button>
                      <button onClick={() => { setC(cust); setEditingC(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-sky-400 text-xs font-bold hover:text-sky-300">Edit</button>
                      <button onClick={() => removeC(cust.id)} className="text-red-300 text-xs font-bold hover:text-red-200">×</button>
                    </div>
                  </div>
                  {theirs.length > 0 && (
                    <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
                      {theirs.map((o) => (
                        <div key={o.id} className="flex items-center justify-between gap-3 flex-wrap text-sm">
                          <div>
                            <span className="font-semibold">{o.title}</span>
                            <span className="text-white/45"> {o.pricePP ? `· ${fmt$(o.pricePP)}/pp` : ""}{o.ship ? ` · ${o.ship}` : ""}</span>
                            <span className={`ml-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_COLOR[o.status] || "bg-white/10 text-white/60"}`}>{o.status}</span>
                          </div>
                          <div className="flex gap-3 text-xs font-bold">
                            <button onClick={() => emailOffer(o)} className="text-sky-400 hover:text-sky-300">📧 Email</button>
                            <button onClick={() => { navigator.clipboard?.writeText(offerUrl(o)); }} className="text-white/55 hover:text-white">Copy link</button>
                            <Link href={`/offer/${o.token}`} target="_blank" className="text-white/55 hover:text-white">Preview</Link>
                            <button onClick={() => removeOf(o.id)} className="text-red-300 hover:text-red-200">×</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Offer editor */}
        {offer && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto p-4">
            <div className="bg-[#0b1020] border border-white/15 rounded-2xl p-6 max-w-lg w-full my-8">
              <div className="font-bold mb-3">New offer for {offer.customerName}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2"><label className={lbl}>Offer title *</label><input className={input} value={offer.title} onChange={(e) => setOffer({ ...offer, title: e.target.value })} placeholder="7-Night Western Caribbean Deal" /></div>
                <div><label className={lbl}>Ship</label><input className={input} value={offer.ship} onChange={(e) => setOffer({ ...offer, ship: e.target.value })} /></div>
                <div><label className={lbl}>Cruise line</label><input className={input} value={offer.cruiseLine} onChange={(e) => setOffer({ ...offer, cruiseLine: e.target.value })} /></div>
                <div><label className={lbl}>Sail date</label><input className={input} value={offer.sailDate} onChange={(e) => setOffer({ ...offer, sailDate: e.target.value })} placeholder="2026-07-18" /></div>
                <div><label className={lbl}>Nights</label><input type="number" className={input} value={offer.nights} onChange={(e) => setOffer({ ...offer, nights: Number(e.target.value) })} /></div>
                <div><label className={lbl}>Cabin</label><input className={input} value={offer.cabinType} onChange={(e) => setOffer({ ...offer, cabinType: e.target.value })} /></div>
                <div><label className={lbl}>Price / person ($)</label><input type="number" className={input} value={offer.pricePP || ""} onChange={(e) => setOffer({ ...offer, pricePP: Number(e.target.value) })} /></div>
                <div><label className={lbl}>Total ($)</label><input type="number" className={input} value={offer.total || ""} onChange={(e) => setOffer({ ...offer, total: Number(e.target.value) })} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Notes / what's included</label><textarea className={input} rows={3} value={offer.notes} onChange={(e) => setOffer({ ...offer, notes: e.target.value })} /></div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={saveOf} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">Save offer</button>
                <button onClick={() => setOffer(null)} className="border border-white/20 text-white/70 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full">Cancel</button>
              </div>
              <p className="text-white/40 text-xs mt-2">After saving, use 📧 Email to send the customer their offer link.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
