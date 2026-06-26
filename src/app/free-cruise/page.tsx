"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Offered free-cruise dates (staff can adjust). Shown to VIFP members.
const FREE_DATES = [
  { id: "fd1", label: "Carnival Breeze · 5-Day Western Caribbean", date: "Oct 12, 2026" },
  { id: "fd2", label: "Carnival Jubilee · 7-Day Western Caribbean", date: "Nov 7, 2026" },
  { id: "fd3", label: "Liberty of the Seas · Bahamas & Perfect Day", date: "Nov 20, 2026" },
  { id: "fd4", label: "Carnival Vista · 6-Day Western Caribbean", date: "Jan 9, 2027" },
];

export default function FreeCruisePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vifp, setVifp] = useState("");
  const [authed, setAuthed] = useState(false);
  const [choice, setChoice] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  async function respond(canMakeIt: boolean) {
    await supabase.from("inquiries").insert({
      confirm_number: "FC-" + Math.random().toString(36).toUpperCase().slice(2, 8),
      first_name: name || "VIFP Member",
      last_name: "",
      email,
      phone: "",
      ship: "",
      sail_date: "",
      rate_type: "",
      guests: "",
      cabin_type: "",
      crew: vifp ? `VIFP ${vifp}` : "",
      message: canMakeIt
        ? `FREE CRUISE — YES, interested. Date: ${
            FREE_DATES.find((d) => d.id === choice)?.label ?? choice || "flexible"
          }. ${notes}`
        : `FREE CRUISE — Can't make these dates this time. ${notes}`,
      appt_date: "",
      appt_time: "",
      mode: "free-cruise",
    });
    setDone(true);
  }

  const field =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";

  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      <section className="relative overflow-hidden grid-bg py-16">
        <div className="aurora bg-sky-500 w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-xl mx-auto px-4 text-center">
          <div className="text-5xl mb-3">🎁</div>
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
            {"// Carnival VIFP Exclusive"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.02em] mb-3">
            Your Free Cruise
          </h1>
          <p className="text-white/60 text-lg">
            As a valued Carnival VIFP member, we&rsquo;ve set aside a free cruise
            for you. See the dates and let us know — even if now isn&rsquo;t the
            right time.
          </p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {done ? (
          <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🚢</div>
            <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-2">
              Thank you!
            </h2>
            <p className="text-white/60">
              Your response is in. A specialist will follow up at{" "}
              <span className="text-white font-semibold">{email}</span> to lock in
              your free cruise or keep you posted on the next opening.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-7 py-3 rounded-full"
            >
              Back home
            </Link>
          </div>
        ) : !authed ? (
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 space-y-3">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-1">
              Create your access
            </div>
            <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input className={field} value={vifp} onChange={(e) => setVifp(e.target.value)} placeholder="Carnival VIFP # (optional)" />
            <button
              onClick={() => email.trim() && setAuthed(true)}
              disabled={!email.trim()}
              className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-sm py-3.5 rounded-full transition-all"
            >
              See my free cruise dates →
            </button>
          </div>
        ) : (
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              {"// Available Dates"}
            </div>
            <div className="space-y-2">
              {FREE_DATES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setChoice(d.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    choice === d.id
                      ? "border-sky-400/70 bg-sky-400/10"
                      : "border-white/15 bg-white/5 hover:border-white/40"
                  }`}
                >
                  <div className="font-bold text-white">{d.label}</div>
                  <div className="text-white/55 text-sm">{d.date}</div>
                </button>
              ))}
            </div>
            <textarea
              className={`${field} mt-4 resize-none`}
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything we should know? (guests, preferences…)"
            />
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={() => respond(true)}
                disabled={!choice}
                className="flex-1 bg-white text-black hover:bg-white/90 disabled:opacity-40 font-semibold uppercase tracking-wider text-sm py-3.5 rounded-full transition-all"
              >
                Yes — I want this cruise!
              </button>
              <button
                onClick={() => respond(false)}
                className="flex-1 border border-white/25 hover:border-white/60 text-white font-semibold uppercase tracking-wider text-sm py-3.5 rounded-full transition-all"
              >
                Can&rsquo;t make these dates
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
