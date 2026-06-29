"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { saveSignup, newSignupId, type SignupEntry } from "@/lib/signups";

// The featured group sailing this page collects signups for. To run another
// group, change these fields (or we can make it data-driven later).
const GROUP = {
  label: "Thanksgiving 2026 — Liberty of the Seas",
  ship: "Liberty of the Seas",
  line: "Royal Caribbean",
  sailDate: "2026-11-23",
  returnDate: "2026-11-28",
  nights: 5,
  port: "Galveston",
  itinerary: "Western Caribbean",
  destSlug: "cozumel",
  blurb: "5 nights round-trip from Galveston · Nov 23–28, 2026",
};

const CABIN_PREFS = ["Interior", "Ocean View", "Balcony", "Not sure yet"];

type Form = {
  leadName: string;
  email: string;
  phone: string;
  dob: string;
  adults: number;
  kids: number;
  cabinsNeeded: number;
  cabinPref: string;
  guestNames: string;
  notes: string;
};

const blank: Form = {
  leadName: "",
  email: "",
  phone: "",
  dob: "",
  adults: 2,
  kids: 0,
  cabinsNeeded: 1,
  cabinPref: "Balcony",
  guestNames: "",
  notes: "",
};

export default function GroupSignupPage() {
  const [step, setStep] = useState(1);
  const [f, setF] = useState<Form>(blank);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (p: Partial<Form>) => setF((x) => ({ ...x, ...p }));
  const totalGuests = (f.adults || 0) + (f.kids || 0);

  const input =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block text-sm font-semibold text-white/70 mb-1.5";

  const canNext = useMemo(() => {
    if (step === 1) return f.leadName.trim() && (f.email.trim() || f.phone.trim());
    if (step === 2) return totalGuests > 0 && f.cabinsNeeded > 0;
    return true;
  }, [step, f, totalGuests]);

  async function submit() {
    setSubmitting(true);
    setError("");
    const entry: SignupEntry = {
      id: newSignupId(),
      groupLabel: GROUP.label,
      leadName: f.leadName,
      dob: f.dob,
      phone: f.phone,
      email: f.email,
      adults: f.adults,
      kids: f.kids,
      totalGuests,
      cabins: `${f.cabinsNeeded} ${f.cabinPref}`,
      reservationNumber: "",
      guestNames: f.guestNames,
      guests: [],
      confirmed: "Y",
      depositStatus: "",
      notes: f.notes ? `[Web signup] ${f.notes}` : "[Web signup]",
    };
    const ok = await saveSignup(entry);
    // Also drop it into Online Requests so front desk sees it in the inbox.
    await supabase.from("inquiries").insert({
      first_name: f.leadName,
      last_name: "",
      email: f.email,
      phone: f.phone,
      ship: GROUP.ship,
      sail_date: GROUP.sailDate,
      cabin_type: `${f.cabinsNeeded} ${f.cabinPref}`,
      mode: "group-signup",
      status: "new",
      message: `Group signup: ${GROUP.label} — ${f.adults} adults, ${f.kids} kids (${totalGuests} guests). ${f.notes}`.trim(),
    });
    setSubmitting(false);
    if (ok) setDone(true);
    else setError("Something went wrong saving your signup. Please call us at (409) 632-2106.");
  }

  if (done) {
    return (
      <div className="bg-[#05070d] text-white min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <div className="text-6xl mb-5">🚢🎉</div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-3">You&rsquo;re on the list!</h1>
          <p className="text-white/65 mb-6">
            Thanks, {f.leadName.split(" ")[0] || "friend"} — we&rsquo;ve got your signup for{" "}
            <span className="text-white font-semibold">{GROUP.label}</span>. A Galveston
            specialist will call or email you to confirm your cabin and walk you through the
            deposit. No payment is taken online.
          </p>
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-5 text-left text-sm text-white/70 space-y-1.5">
            <div><span className="text-white/45">Group:</span> {GROUP.label}</div>
            <div><span className="text-white/45">Party:</span> {f.adults} adults · {f.kids} kids · {totalGuests} guests</div>
            <div><span className="text-white/45">Cabins:</span> {f.cabinsNeeded} {f.cabinPref}</div>
            <div><span className="text-white/45">Questions?</span> <a href="tel:+14096322106" className="text-sky-400">(409) 632-2106</a></div>
          </div>
          <p className="text-white/45 text-sm mt-5">
            Organizing this group?{" "}
            <a href="/group-leader" className="text-sky-400 hover:text-sky-300 font-semibold">
              Manage your group →
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/destinations/${GROUP.destSlug}.jpg`} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/85 to-[#05070d]/60" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 text-center">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">{"// Group Cruise Signup"}</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-3">
            Join the <span className="text-holo">{GROUP.ship}</span> Group
          </h1>
          <p className="text-white/60 text-lg">{GROUP.blurb}</p>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1">
              <div className={`h-1.5 rounded-full ${step >= n ? "bg-sky-400" : "bg-white/10"}`} />
              <div className={`mt-2 text-[11px] uppercase tracking-wider font-bold ${step >= n ? "text-white" : "text-white/35"}`}>
                {n === 1 ? "Contact" : n === 2 ? "Your party" : "Guests"}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold mb-1">Who should we contact?</h2>
              <div><label className={lbl}>Family / lead contact name *</label><input className={input} value={f.leadName} onChange={(e) => set({ leadName: e.target.value })} placeholder="Your full name" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={lbl}>Email</label><input className={input} type="email" value={f.email} onChange={(e) => set({ email: e.target.value })} placeholder="you@example.com" /></div>
                <div><label className={lbl}>Phone</label><input className={input} value={f.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="(409) 555-0100" /></div>
              </div>
              <div><label className={lbl}>Your date of birth</label><input className={input} value={f.dob} onChange={(e) => set({ dob: e.target.value })} placeholder="MM/DD/YYYY" /></div>
              <p className="text-white/40 text-xs">Add an email or phone so we can reach you. No payment is taken online.</p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold mb-1">Tell us about your party</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Adults</label><input className={input} type="number" min={0} value={f.adults} onChange={(e) => set({ adults: Number(e.target.value) })} /></div>
                <div><label className={lbl}>Kids</label><input className={input} type="number" min={0} value={f.kids} onChange={(e) => set({ kids: Number(e.target.value) })} /></div>
              </div>
              <div className="text-sm text-white/60">Total guests: <span className="text-white font-bold">{totalGuests}</span></div>
              <div><label className={lbl}>Cabins needed</label><input className={input} type="number" min={1} value={f.cabinsNeeded} onChange={(e) => set({ cabinsNeeded: Number(e.target.value) })} /></div>
              <div>
                <label className={lbl}>Cabin preference</label>
                <div className="grid grid-cols-2 gap-2">
                  {CABIN_PREFS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set({ cabinPref: c })}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                        f.cabinPref === c ? "bg-white text-black border-white" : "bg-white/5 text-white/70 border-white/15 hover:border-white/40"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold mb-1">Guests & anything else</h2>
              <div>
                <label className={lbl}>Guest full names (as on ID, if known)</label>
                <textarea className={input} rows={5} value={f.guestNames} onChange={(e) => set({ guestNames: e.target.value })} placeholder={"One guest per line\nFirst Last\nFirst Last"} />
              </div>
              <div><label className={lbl}>Notes / requests</label><textarea className={input} rows={3} value={f.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Drink packages, who rooms with whom, accessibility needs…" /></div>
              {error && <p className="text-red-300 text-sm">{error}</p>}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/65 space-y-1">
                <div className="font-bold text-white">Review</div>
                <div>{f.leadName} · {f.email || f.phone}</div>
                <div>{f.adults} adults · {f.kids} kids · {totalGuests} guests · {f.cabinsNeeded} {f.cabinPref}</div>
              </div>
            </div>
          )}

          {/* Nav */}
          <div className="flex items-center justify-between gap-3 mt-7">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="text-white/55 hover:text-white font-semibold text-sm">← Back</button>
            ) : <span />}
            {step < 3 ? (
              <button
                onClick={() => canNext && setStep(step + 1)}
                disabled={!canNext}
                className="bg-white text-black hover:bg-white/90 disabled:opacity-40 font-semibold uppercase tracking-wider text-sm px-8 py-3.5 rounded-full transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={submitting}
                className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold uppercase tracking-wider text-sm px-8 py-3.5 rounded-full transition-all"
              >
                {submitting ? "Submitting…" : "Sign up for the group"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-white/35 text-xs mt-5">
          Questions? Call <a href="tel:+14096322106" className="text-sky-400">(409) 632-2106</a> or visit the Cruise Experience Center, 3501 Winnie St, Galveston, TX.
        </p>
      </div>
    </div>
  );
}
