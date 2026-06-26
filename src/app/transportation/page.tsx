"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const DRIVER_PHONE_DISPLAY = "(409) 220-6109";
const DRIVER_PHONE_TEL = "+14092206109";

function confirmNo(p: string) {
  return p + Math.random().toString(36).toUpperCase().slice(2, 8);
}

export default function TransportationPage() {
  // ride request
  const [service, setService] = useState<"transfer" | "parking">("transfer");
  const [r, setR] = useState({ name: "", email: "", phone: "", pickup: "", dropoff: "", when: "", guests: "", notes: "" });
  const [rDone, setRDone] = useState("");
  const setRF = (k: keyof typeof r, v: string) => setR((s) => ({ ...s, [k]: v }));

  // driver application
  const [d, setD] = useState({ name: "", email: "", phone: "", vehicle: "", notes: "" });
  const [dDone, setDDone] = useState("");
  const setDF = (k: keyof typeof d, v: string) => setD((s) => ({ ...s, [k]: v }));

  async function requestRide() {
    const num = confirmNo("TR-");
    await supabase.from("inquiries").insert({
      confirm_number: num, first_name: r.name, last_name: "", email: r.email, phone: r.phone,
      ship: "", sail_date: r.when, rate_type: "", guests: r.guests, cabin_type: "", crew: "",
      message: `${service === "parking" ? "CRUISE PARKING" : "TRANSPORTATION"} REQUEST (Your Car Host LLC). Pickup: ${r.pickup}. Drop-off: ${r.dropoff}. When: ${r.when}. Guests: ${r.guests}. ${r.notes}`,
      appt_date: "", appt_time: "", mode: service === "parking" ? "parking" : "transportation",
    });
    setRDone(num);
  }
  async function applyDriver() {
    const num = confirmNo("DV-");
    await supabase.from("inquiries").insert({
      confirm_number: num, first_name: d.name, last_name: "", email: d.email, phone: d.phone,
      ship: "", sail_date: "", rate_type: "", guests: "", cabin_type: "", crew: "VENDOR/PARTNER APPLICATION",
      message: `TRANSPORTATION PARTNER APPLICATION (Your Car Host LLC). Vehicle: ${d.vehicle}. ${d.notes}`,
      appt_date: "", appt_time: "", mode: "driver-application",
    });
    setDDone(num);
  }

  const field = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block text-white/70 text-sm font-medium mb-1";

  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 grid-bg">
        <div className="aurora bg-sky-500 w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
          <div className="text-5xl mb-3">🚐</div>
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Port Transfers & Rides"}</div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] mb-3">Transportation</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Door-to-port rides, airport transfers, and group shuttles — arranged
            through <span className="text-white font-semibold">Your Car Host LLC</span>,
            our transportation booking platform.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Request a ride */}
        <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-3">Request transportation</h2>
          <div className="flex gap-2 mb-4">
            {([["transfer", "🚐 Port transfer / ride"], ["parking", "🅿️ Cruise parking"]] as const).map(([k, label]) => (
              <button key={k} type="button" onClick={() => setService(k)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${service === k ? "bg-sky-400/15 text-white border-sky-400/60" : "bg-white/5 text-white/55 border-white/15 hover:border-white/40"}`}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-white/55 text-sm mb-5">
            {service === "parking"
              ? "Reserve parking at the Port of Galveston for your sailing — we'll confirm your spot and rate."
              : "Tell us your pickup, drop-off, and time — we'll connect you with an available partner and confirm your ride."}
          </p>
          {rDone ? (
            <div className="bg-sky-400/10 border border-sky-400/20 rounded-2xl p-5 text-white/70 text-sm">
              Request received — <span className="font-bold text-white">#{rDone}</span>. A coordinator will confirm your ride and partner at {r.email}.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={lbl}>Name *</label><input className={field} value={r.name} onChange={(e) => setRF("name", e.target.value)} /></div>
                <div><label className={lbl}>Phone *</label><input className={field} value={r.phone} onChange={(e) => setRF("phone", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Email *</label><input className={field} type="email" value={r.email} onChange={(e) => setRF("email", e.target.value)} /></div>
                <div><label className={lbl}>Pickup location</label><input className={field} value={r.pickup} onChange={(e) => setRF("pickup", e.target.value)} placeholder="Hotel, home, airport…" /></div>
                <div><label className={lbl}>Drop-off</label><input className={field} value={r.dropoff} onChange={(e) => setRF("dropoff", e.target.value)} placeholder="Port of Galveston terminal…" /></div>
                <div><label className={lbl}>Date &amp; time</label><input className={field} value={r.when} onChange={(e) => setRF("when", e.target.value)} placeholder="Sat Jun 27, 9:30 AM" /></div>
                <div><label className={lbl}>Guests &amp; bags</label><input className={field} value={r.guests} onChange={(e) => setRF("guests", e.target.value)} placeholder="4 guests, 6 bags" /></div>
                <div className="sm:col-span-2"><label className={lbl}>Notes</label><input className={field} value={r.notes} onChange={(e) => setRF("notes", e.target.value)} placeholder="Car seat, wheelchair access…" /></div>
              </div>
              <button onClick={requestRide} disabled={!r.name || !r.email || !r.phone} className="mt-5 bg-white text-black hover:bg-white/90 disabled:opacity-40 font-semibold uppercase tracking-wider text-sm px-8 py-3.5 rounded-full transition-all">Request ride →</button>
            </>
          )}
        </div>

        {/* Drive with us */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-1">Drive with Your Car Host</h2>
          <p className="text-white/55 text-sm mb-2">
            Become an independent <strong className="text-white/80">Transportation Partner</strong>. Like rideshare,
            you operate under your own authority, license, and insurance — we
            connect you with guests who need rides to and from the port.
          </p>
          <div className="bg-sky-500/10 border border-sky-400/30 rounded-xl p-4 my-4">
            <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/80 mb-1">Drivers — call to apply</div>
            <a href={`tel:${DRIVER_PHONE_TEL}`} className="text-2xl font-extrabold text-holo">{DRIVER_PHONE_DISPLAY}</a>
            <div className="text-white/45 text-xs mt-1">A separate line for partners — not the guest booking number.</div>
          </div>
          {dDone ? (
            <div className="bg-sky-400/10 border border-sky-400/20 rounded-2xl p-5 text-white/70 text-sm">
              Application received — <span className="font-bold text-white">#{dDone}</span>. We&rsquo;ll review and reach out. You can also call {DRIVER_PHONE_DISPLAY}.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={lbl}>Name *</label><input className={field} value={d.name} onChange={(e) => setDF("name", e.target.value)} /></div>
                <div><label className={lbl}>Phone *</label><input className={field} value={d.phone} onChange={(e) => setDF("phone", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Email *</label><input className={field} type="email" value={d.email} onChange={(e) => setDF("email", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Vehicle (make, model, capacity)</label><input className={field} value={d.vehicle} onChange={(e) => setDF("vehicle", e.target.value)} placeholder="2022 Suburban · 7 passengers" /></div>
                <div className="sm:col-span-2"><label className={lbl}>About you (license, insurance, experience)</label><input className={field} value={d.notes} onChange={(e) => setDF("notes", e.target.value)} placeholder="TX license, commercial insurance, 3 yrs…" /></div>
              </div>
              <button onClick={applyDriver} disabled={!d.name || !d.email || !d.phone} className="mt-5 border border-white/25 hover:border-white/60 text-white font-semibold uppercase tracking-wider text-sm px-8 py-3.5 rounded-full transition-all">Apply as a partner</button>
            </>
          )}
        </div>

        {/* Legal */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white/45 text-xs leading-relaxed">
          <div className="label-mono text-[10px] uppercase tracking-wider text-white/40 mb-2">Important — transportation disclaimer</div>
          <p className="mb-2">
            Transportation is arranged through <strong>Your Car Host LLC</strong>, a transportation
            booking platform that connects guests with independent, third-party
            transportation providers (&ldquo;Transportation Partners&rdquo;). Your Car Host LLC
            and Cruises from Galveston do <strong>not</strong> own or operate vehicles, do not
            employ drivers, and do not provide transportation services directly.
          </p>
          <p className="mb-2">
            All Transportation Partners are <strong>independent contractors</strong> solely
            responsible for their own licensing, permits, insurance, vehicle
            maintenance, safety, and compliance with all applicable laws. Your Car
            Host LLC&rsquo;s role is limited to facilitating the request and connection
            between guest and partner; it is not the carrier and assumes no
            liability for the transportation itself.
          </p>
          <p className="text-white/35">
            This summary is for information only and is not legal advice. Final
            vendor/partner agreements and consumer terms should be reviewed by a
            licensed attorney.
          </p>
        </div>

        <div className="text-center">
          <Link href="/add-ons" className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 hover:text-sky-300">
            ← Hotels, transfers &amp; extras
          </Link>
        </div>
      </section>
    </div>
  );
}
