"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { blankRFP, saveRFP, type RFPRequest } from "@/lib/rfp";

export default function RequestGroupSpacePage() {
  const [r, setR] = useState<RFPRequest>(blankRFP());
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (p: Partial<RFPRequest>) => setR((s) => ({ ...s, ...p }));

  async function submit() {
    if (!r.agencyName.trim() || !r.agentName.trim() || !r.agentEmail.trim()) {
      alert("Agency name, your name, and email are required.");
      return;
    }
    setBusy(true);
    await saveRFP({ ...r, status: "new" });
    // Mirror into the main inbox / Activity feed so it isn't missed.
    await supabase.from("inquiries").insert({
      confirm_number: "RFP-" + r.id.slice(-6).toUpperCase(),
      first_name: r.agentName,
      last_name: `(${r.agencyName})`,
      email: r.agentEmail,
      phone: r.agentPhone,
      ship: r.ship,
      sail_date: r.sailDate,
      rate_type: "",
      guests: "",
      cabin_type: r.cabinTypes,
      crew: r.credential,
      message: `AGENT GROUP-SPACE RFP — ${r.cabins} cabins on ${r.ship || "TBD"} ${r.sailDate}. Types: ${r.cabinTypes || "—"}. ${r.notes}`,
      appt_date: "",
      appt_time: "",
      mode: "rfp",
    });
    setBusy(false);
    setSent(true);
  }

  const field =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1.5";

  if (sent) {
    return (
      <div className="bg-[#05070d] text-white min-h-[70vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">📩</div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-3">
            Request received
          </h1>
          <p className="text-white/60 mb-7">
            Thanks, {r.agentName.split(" ")[0] || "agent"}. We&rsquo;ll review
            availability for your group and send a quote — group rate, your
            per-room terms, deposit, and how long we can hold the block. Watch
            your inbox at {r.agentEmail}.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#05070d] py-16">
        <div className="absolute inset-0 grid-bg" />
        <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// For travel agents"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] mb-4">
            Request <span className="text-holo">group space</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Host your own group on a Galveston sailing without negotiating your
            own block. Tell us what you need, place a deposit to hold the rooms,
            and manage your travelers in a live portal. You sell — we hold the
            space and handle the logistics.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { n: "1", t: "Request", d: "Tell us the ship, date, and how many cabins you want held." },
            { n: "2", t: "Hold", d: "We quote your group rate + terms; a deposit locks the block." },
            { n: "3", t: "Host", d: "Manage your roster in a live portal until your hold date." },
          ].map((s) => (
            <div key={s.n} className="bg-[#0b1020] border border-white/10 rounded-2xl p-5">
              <div className="label-mono text-sky-400/70 text-sm mb-2">0{s.n}</div>
              <div className="font-bold uppercase tracking-wide mb-1">{s.t}</div>
              <div className="text-white/55 text-sm">{s.d}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              {"// Your agency"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={lbl}>Agency name *</label>
                <input className={field} value={r.agencyName} onChange={(e) => set({ agencyName: e.target.value })} placeholder="Sunshine Travel LLC" />
              </div>
              <div>
                <label className={lbl}>Your name *</label>
                <input className={field} value={r.agentName} onChange={(e) => set({ agentName: e.target.value })} />
              </div>
              <div>
                <label className={lbl}>CLIA / IATA / ARC #</label>
                <input className={field} value={r.credential} onChange={(e) => set({ credential: e.target.value })} placeholder="For verification" />
              </div>
              <div>
                <label className={lbl}>Email *</label>
                <input type="email" className={field} value={r.agentEmail} onChange={(e) => set({ agentEmail: e.target.value })} />
              </div>
              <div>
                <label className={lbl}>Phone</label>
                <input className={field} value={r.agentPhone} onChange={(e) => set({ agentPhone: e.target.value })} />
              </div>
            </div>
          </div>

          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              {"// The group you want to host"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Cruise line</label>
                <input className={field} value={r.cruiseLine} onChange={(e) => set({ cruiseLine: e.target.value })} placeholder="Carnival / Royal Caribbean…" />
              </div>
              <div>
                <label className={lbl}>Ship (if known)</label>
                <input className={field} value={r.ship} onChange={(e) => set({ ship: e.target.value })} placeholder="Carnival Jubilee" />
              </div>
              <div>
                <label className={lbl}>Sail date (or month)</label>
                <input className={field} value={r.sailDate} onChange={(e) => set({ sailDate: e.target.value })} placeholder="2026-11-14 or 'Nov 2026'" />
              </div>
              <div>
                <label className={lbl}>Cabins needed</label>
                <input type="number" className={field} value={r.cabins || ""} onChange={(e) => set({ cabins: Number(e.target.value) })} placeholder="e.g. 12" />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Cabin types / mix</label>
                <input className={field} value={r.cabinTypes} onChange={(e) => set({ cabinTypes: e.target.value })} placeholder="e.g. 8 balcony, 4 interior" />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Anything else</label>
                <textarea className={`${field} resize-none`} rows={3} value={r.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Group occasion, must-have dates, amenity needs, target deposit window…" />
              </div>
            </div>
          </div>

          <button
            onClick={submit}
            disabled={busy}
            className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-sm py-4 rounded-full transition-all"
          >
            {busy ? "Sending…" : "Request group space →"}
          </button>
          <p className="text-white/35 text-xs text-center">
            Submitting a request doesn&rsquo;t hold space. We&rsquo;ll confirm
            availability and send terms, including the deposit required to hold
            your block and our per-room host fee.
          </p>
        </div>
      </section>
    </div>
  );
}
