"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  type IndividualBooking, type Passenger,
  getBookingByToken, updatePassengers,
} from "@/lib/individual-bookings";
import { getPayments, type Payment } from "@/lib/payments";
import { appGuideFor, appSearch } from "@/lib/cruise-apps";
import { PAYMENT_METHODS, PAY_APPT_HREF } from "@/lib/payment-methods";
import { uploadGuestFile } from "@/lib/documents";
import { appendReservationNote } from "@/lib/individual-bookings";
import Link from "next/link";

const money = (n: number) => "$" + (n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d: string) => (d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "—");
const mmdd = (d: string) => { const m = (d || "").match(/(\d{4})-(\d{1,2})-(\d{1,2})/); return m ? m[2].padStart(2, "0") + m[3].padStart(2, "0") : ""; };

export default function ReservationPortal() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? "";

  const [booking, setBooking] = useState<IndividualBooking | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pax, setPax] = useState<Passenger[]>([]);
  const [saved, setSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  async function copyVal(key: string, value: string) {
    try { await navigator.clipboard.writeText(value); } catch { /* ignore */ }
    setCopiedKey(key); setTimeout(() => setCopiedKey(""), 1500);
  }
  async function onReceipt(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !booking) return;
    setUploading(true); setUploadMsg("");
    const res = await uploadGuestFile(file);
    if ("url" in res) {
      await appendReservationNote(booking.token, `[receipt] ${booking.guestName}: ${res.name} — ${res.url}`);
      setUploadMsg("✓ Receipt received — thank you! We'll confirm once it's reviewed.");
    } else {
      setUploadMsg("Upload failed — please email the receipt to cruisesfromgalveston.texas@gmail.com.");
    }
    setUploading(false);
    e.target.value = "";
  }

  useEffect(() => {
    (async () => {
      const b = await getBookingByToken(token);
      setBooking(b);
      if (b) { setPax(b.passengers?.length ? b.passengers : [{ name: b.guestName, dob: "", vifp: "" }]); try { setPayments(await getPayments(b.id)); } catch { /* table may not exist */ } }
      // auto-open if PIN is in the URL (?pin=MMDD)
      const urlPin = new URLSearchParams(window.location.search).get("pin") || "";
      if (b && urlPin && urlPin === mmdd(b.sailDate)) setAuthed(true);
      setLoading(false);
    })();
  }, [token]);

  const pin = booking ? mmdd(booking.sailDate) : "";
  const paidTotal = useMemo(() => payments.reduce((s, p) => s + p.amount, 0), [payments]);
  const balance = Math.max(0, (booking?.grossAmount || 0) - paidTotal);

  function tryPin() {
    if (pin && pinInput.trim() === pin) setAuthed(true);
    else alert("That PIN doesn't match. It's your sail date as 4 digits (MMDD).");
  }
  function logout() { setAuthed(false); setPinInput(""); }
  async function savePax() {
    if (!booking) return;
    await updatePassengers(booking.token, pax.filter((p) => p.name.trim()));
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  }
  const setP = (i: number, patch: Partial<Passenger>) => setPax((s) => s.map((p, k) => (k === i ? { ...p, ...patch } : p)));

  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const card = "rounded-2xl border border-white/10 bg-[#0b1020] p-6";

  if (loading) return <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center"><p className="text-white/50">Loading your reservation…</p></div>;

  if (!booking) return (
    <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-3">Reservation not found</h1>
        <p className="text-white/55">Double-check your link, or contact Cruises from Galveston at (409) 632-2106.</p>
      </div>
    </div>
  );

  // ── PIN gate ──
  if (!authed) return (
    <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">{"// Your Cruise Reservation"}</div>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-2">{booking.guestName}</h1>
        <p className="text-white/55 text-sm mb-6">{booking.ship}{booking.sailDate ? ` · ${fmtDate(booking.sailDate)}` : ""}</p>
        <p className="text-white/55 text-sm mb-3">Enter your PIN — it&rsquo;s your <strong className="text-white/80">sail date as 4 digits</strong> (MMDD).</p>
        <input className={input + " text-center text-lg tracking-widest"} inputMode="numeric" maxLength={4} placeholder="MMDD" value={pinInput}
          onChange={(e) => setPinInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryPin()} />
        <button onClick={tryPin} className="w-full mt-3 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm py-3 rounded-full">View my reservation →</button>
      </div>
    </div>
  );

  const guide = appGuideFor(booking.cruiseLine || booking.ship);

  // ── Reservation view ──
  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-1">{"// Your Cruise Reservation"}</div>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight">{booking.guestName}</h1>
          </div>
          <button onClick={logout} className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white border border-white/15 rounded-full px-4 py-2">Log out</button>
        </div>

        {/* Live status — what's going on */}
        {booking.statusNote && (
          <div className="flex items-start gap-3 rounded-2xl border border-sky-400/30 bg-sky-500/[0.08] p-4">
            <span className="text-2xl leading-none">📋</span>
            <div>
              <div className="text-sky-200 font-bold text-sm">Reservation update — we're working on your booking</div>
              <p className="text-white/75 text-sm mt-1 leading-relaxed">{booking.statusNote}</p>
            </div>
          </div>
        )}

        {/* Travel protection update */}
        {booking.protectionNote && (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/[0.07] p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none">🛡️</span>
              <div>
                <div className="text-amber-200 font-bold text-sm">Travel Protection — important update</div>
                <p className="text-white/75 text-sm mt-1 leading-relaxed">{booking.protectionNote}</p>
                {booking.protectionUrl && (
                  <a href={booking.protectionUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">
                    View Travel Defenders protection →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className={card}>
          <div className="label-mono text-[10px] uppercase text-sky-400/70 mb-3">Reservation Summary</div>
          <div className="text-2xl font-extrabold uppercase tracking-tight">{booking.ship}</div>
          {booking.cruiseLine && <div className="text-sky-300 text-sm font-semibold">{booking.cruiseLine}</div>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <Field label="Sail date" value={fmtDate(booking.sailDate)} />
            <Field label="Itinerary" value={booking.itinerary || "—"} />
            <Field label="Cabin" value={booking.cabinType || "—"} />
            <Field label="Booking #" value={booking.bookingNumber || "—"} mono />
          </div>
        </div>

        {/* Passengers — guest can change */}
        <div className={card}>
          <div className="flex items-center justify-between mb-3">
            <div className="label-mono text-[10px] uppercase text-sky-400/70">Guests — you can update these</div>
            <button onClick={() => setPax((s) => [...s, { name: "", dob: "", vifp: "" }])} className="text-sky-300 hover:text-sky-200 text-xs font-bold">+ Add guest</button>
          </div>
          <div className="space-y-2">
            {pax.map((p, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_150px_150px] gap-2">
                <input className={input} placeholder="Full name (as on ID)" value={p.name} onChange={(e) => setP(i, { name: e.target.value })} />
                <input className={input} type="date" title="Date of birth" value={p.dob} onChange={(e) => setP(i, { dob: e.target.value })} />
                <input className={input + " font-mono"} placeholder="VIFP / loyalty #" value={p.vifp} onChange={(e) => setP(i, { vifp: e.target.value })} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={savePax} className="bg-sky-600 hover:bg-sky-500 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">Save my changes</button>
            {saved && <span className="text-green-300 text-sm">✓ Saved — thank you!</span>}
          </div>
        </div>

        {/* Invoice & receipt */}
        <div className={card}>
          <div className="label-mono text-[10px] uppercase text-sky-400/70 mb-3">Invoice &amp; Receipt</div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3"><div className="label-mono text-[9px] uppercase text-white/40">Cruise total</div><div className="text-white font-bold text-lg mt-1">{money(booking.grossAmount)}</div></div>
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3"><div className="label-mono text-[9px] uppercase text-green-300/70">Paid</div><div className="text-green-300 font-bold text-lg mt-1">{money(paidTotal)}</div></div>
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3"><div className="label-mono text-[9px] uppercase text-amber-300/70">Balance</div><div className={`font-bold text-lg mt-1 ${balance <= 0 ? "text-green-300" : "text-amber-300"}`}>{balance <= 0 ? "Paid in full" : money(balance)}</div></div>
          </div>
          {payments.length > 0 && (
            <div className="mt-4">
              <div className="label-mono text-[9px] uppercase text-white/40 mb-2">Payments received</div>
              <div className="divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="text-white/60">{p.createdAt ? p.createdAt.slice(0, 10) : ""} · {p.method}{p.note ? ` · ${p.note}` : ""}</span>
                    <span className="text-white font-semibold">{money(p.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-white/35 text-[11px] mt-3">Questions about your invoice? Call us at (409) 632-2106.</p>
        </div>

        {/* How to pay */}
        <div className={card}>
          <div className="label-mono text-[10px] uppercase text-sky-400/70 mb-1">How to Pay</div>
          <p className="text-white/50 text-sm mb-4">Choose whichever is easiest — then upload your receipt below so we can post it to your balance.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((m) => (
              <div key={m.key} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{m.icon}</span>
                  <span className="font-bold text-white">{m.name}</span>
                </div>
                {m.value && (
                  <button onClick={() => copyVal(m.key, m.value!)} title="Tap to copy"
                    className="mt-2 inline-flex items-center gap-2 bg-sky-500/10 border border-sky-400/25 rounded-lg px-3 py-1.5 text-sky-200 font-mono text-sm hover:bg-sky-500/20">
                    {m.value}
                    <span className="text-[10px] uppercase tracking-wider text-sky-300/70">{copiedKey === m.key ? "copied ✓" : "copy"}</span>
                  </button>
                )}
                <p className="text-white/50 text-xs mt-2">{m.detail}</p>
                {m.apptButton && (
                  <Link href={PAY_APPT_HREF} className="mt-2 inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-[11px] px-4 py-2 rounded-full">
                    📅 Book in-person appointment
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Upload receipt */}
          <div className="mt-4 rounded-xl border border-dashed border-sky-400/30 bg-sky-500/[0.05] p-4 text-center">
            <div className="text-white font-semibold text-sm mb-1">📤 Upload your payment receipt</div>
            <p className="text-white/50 text-xs mb-3">Screenshot or photo of your Zelle / Cash App / Venmo / check confirmation.</p>
            <label className="inline-block bg-sky-600 hover:bg-sky-500 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full cursor-pointer">
              {uploading ? "Uploading…" : "Choose file"}
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={onReceipt} disabled={uploading} />
            </label>
            {uploadMsg && <div className="text-sm mt-3 text-green-300">{uploadMsg}</div>}
          </div>
          <p className="text-white/40 text-[11px] mt-3">
            These options keep card-processing fees down so we can pass the savings on to you. Prefer a card? Just ask — we&rsquo;re happy to help.
          </p>
        </div>

        {/* App + check-in instructions */}
        <div className={card}>
          <div className="label-mono text-[10px] uppercase text-sky-400/70 mb-1">Download the App &amp; Add Your Reservation</div>
          <div className="text-lg font-extrabold text-white">{guide.app}</div>
          <div className="text-white/50 text-sm">{guide.appNote}</div>
          <div className="flex gap-2 mt-3 flex-wrap">
            <a href={appSearch(guide.app, "ios")} target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/15 hover:border-sky-400/50 rounded-full px-4 py-2 text-xs font-bold"> App Store</a>
            <a href={appSearch(guide.app, "android")} target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/15 hover:border-sky-400/50 rounded-full px-4 py-2 text-xs font-bold">▶ Google Play</a>
            <a href={guide.portalUrl} target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/15 hover:border-sky-400/50 rounded-full px-4 py-2 text-xs font-bold">🌐 {guide.portal}</a>
          </div>
          <ol className="mt-4 space-y-2">
            {guide.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-white/75">
                <span className="label-mono text-[11px] text-sky-400/70 font-bold shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <p className="text-white/40 text-[11px] mt-3">
            You&rsquo;ll need your booking number <strong className="text-white/70 font-mono">{booking.bookingNumber || "(above)"}</strong>, ship, sail date, and last name to add the reservation.
          </p>
        </div>

        <div className="text-center text-white/30 text-xs pt-2">Cruises from Galveston™ · (409) 632-2106</div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="label-mono text-[9px] uppercase tracking-wider text-white/40">{label}</div>
      <div className={`text-white/85 text-sm mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
