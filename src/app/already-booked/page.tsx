"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { fmt$, fmtDateDow } from "@/lib/sea-pay";
import type { CustomerCredit } from "@/lib/credits";

function confirmNumber() {
  return "CFG-" + Math.random().toString(36).toUpperCase().substring(2, 8);
}

export default function AlreadyBookedPage() {
  // ── credit lookup ──
  const [email, setEmail] = useState("");
  const [ref, setRef] = useState("");
  const [credits, setCredits] = useState<CustomerCredit[]>([]);
  const [looked, setLooked] = useState(false);
  const [looking, setLooking] = useState(false);

  async function lookup() {
    if (!email.trim()) return;
    setLooking(true);
    try {
      const r = await fetch(
        `/api/credit-lookup?email=${encodeURIComponent(email)}&ref=${encodeURIComponent(ref)}`
      );
      const d = await r.json();
      setCredits(Array.isArray(d.credits) ? d.credits : []);
    } catch {
      setCredits([]);
    }
    setLooked(true);
    setLooking(false);
  }

  // ── rebook a cancelled cruise ──
  const [rb, setRb] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    ref: "",
    oldShip: "",
    newDates: "",
    notes: "",
  });
  const [rbDone, setRbDone] = useState("");
  const setR = (k: keyof typeof rb, v: string) =>
    setRb((s) => ({ ...s, [k]: v }));

  async function submitRebook() {
    const num = confirmNumber();
    await supabase.from("inquiries").insert({
      confirm_number: num,
      first_name: rb.first,
      last_name: rb.last,
      email: rb.email,
      phone: rb.phone,
      ship: rb.oldShip,
      sail_date: "",
      rate_type: "",
      guests: "",
      cabin_type: "",
      crew: "",
      message:
        `REBOOK CANCELLED CRUISE. Original booking ref: ${rb.ref || "n/a"}. ` +
        `Original ship: ${rb.oldShip || "n/a"}. New dates wanted: ${rb.newDates || "flexible"}. ` +
        (rb.notes ? `Notes: ${rb.notes}` : ""),
      appt_date: "",
      appt_time: "",
      mode: "rebook",
    });
    setRbDone(num);
  }

  const field =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block text-white/70 text-sm font-medium mb-1";

  const canRebook = rb.first && rb.last && rb.email;

  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 grid-bg">
        <div className="aurora bg-sky-500 w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Guest Services"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] mb-3">
            Already Booked?
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Check your agency credit, rebook a cancelled cruise, or review our
            refund &amp; cancellation policy — all in one place.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {/* ── Credit lookup ── */}
        <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💳</span>
            <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
              Check Your Credit
            </h2>
          </div>
          <p className="text-white/55 text-sm mb-5 max-w-2xl">
            If we&rsquo;ve issued you an agency or future-cruise credit, look it
            up with the email on your booking. A credit must be used to rebook by
            its expiration date.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className={lbl}>Email on booking *</label>
              <input
                className={field}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className={lbl}>Booking reference (optional)</label>
              <input
                className={field}
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="e.g. CFG-AB12CD"
              />
            </div>
            <button
              onClick={lookup}
              disabled={!email.trim() || looking}
              className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-sm px-6 py-3 rounded-full transition-all whitespace-nowrap"
            >
              {looking ? "Checking…" : "Check credit"}
            </button>
          </div>

          {looked && credits.length === 0 && (
            <div className="mt-5 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/60">
              No active credit found for that email. If you believe you have a
              credit,{" "}
              <Link href="/contact" className="text-sky-400 hover:text-sky-300">
                contact us
              </Link>{" "}
              and we&rsquo;ll sort it out.
            </div>
          )}

          {credits.map((c) => (
            <div
              key={c.id}
              className="mt-5 bg-sky-500/10 border border-sky-400/30 rounded-2xl p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/80">
                  Agency credit
                </div>
                {c.bookingRef && (
                  <div className="label-mono text-[10px] text-white/40">
                    Ref {c.bookingRef}
                  </div>
                )}
              </div>
              <div className="text-holo font-extrabold text-4xl leading-none mt-1">
                {fmt$(c.amount)}
              </div>
              {c.reason && (
                <div className="text-white/60 text-sm mt-2">{c.reason}</div>
              )}
              {c.expiresOn && (
                <div className="mt-3 bg-amber-400/10 border border-amber-400/25 rounded-xl p-3 text-amber-200/90 text-sm">
                  <strong>Rebook by {fmtDateDow(c.expiresOn)}.</strong> This
                  credit must be applied to a new booking on or before this date.
                  After it expires, the credit is forfeited and the right to
                  claim it is waived.
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="#rebook"
                  className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
                >
                  Rebook with this credit →
                </a>
                <Link
                  href="/find"
                  className="border border-white/25 hover:border-white/60 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
                >
                  Browse sailings
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ── Rebook a cancelled cruise ── */}
        <div id="rebook" className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 sm:p-8 scroll-mt-24">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔄</span>
            <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
              Rebook a Cancelled Cruise
            </h2>
          </div>
          {rbDone ? (
            <div className="bg-sky-400/10 border border-sky-400/20 rounded-2xl p-6 mt-3">
              <div className="font-extrabold text-white text-lg mb-1">
                Request received — #{rbDone}
              </div>
              <p className="text-white/60 text-sm">
                A specialist will reach out to {rb.email} to rebook your sailing
                and apply any credit on file. If your credit has a deadline,
                we&rsquo;ll make sure it&rsquo;s used in time.
              </p>
            </div>
          ) : (
            <>
              <p className="text-white/55 text-sm mb-5 max-w-2xl">
                Had a cruise cancelled? Tell us what you had and what you&rsquo;d
                like instead — we&rsquo;ll rebook it and apply any agency credit
                to the new sailing.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>First name *</label>
                  <input className={field} value={rb.first} onChange={(e) => setR("first", e.target.value)} placeholder="Jane" />
                </div>
                <div>
                  <label className={lbl}>Last name *</label>
                  <input className={field} value={rb.last} onChange={(e) => setR("last", e.target.value)} placeholder="Smith" />
                </div>
                <div>
                  <label className={lbl}>Email *</label>
                  <input className={field} type="email" value={rb.email} onChange={(e) => setR("email", e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <label className={lbl}>Phone</label>
                  <input className={field} type="tel" value={rb.phone} onChange={(e) => setR("phone", e.target.value)} placeholder="(409) 555-0100" />
                </div>
                <div>
                  <label className={lbl}>Original booking reference</label>
                  <input className={field} value={rb.ref} onChange={(e) => setR("ref", e.target.value)} placeholder="If you have it" />
                </div>
                <div>
                  <label className={lbl}>Original ship</label>
                  <input className={field} value={rb.oldShip} onChange={(e) => setR("oldShip", e.target.value)} placeholder="e.g. Liberty of the Seas" />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>New dates / what you&rsquo;d like</label>
                  <input className={field} value={rb.newDates} onChange={(e) => setR("newDates", e.target.value)} placeholder="e.g. any 5-night in March, balcony, 2 guests" />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Anything else?</label>
                  <textarea className={`${field} resize-none`} rows={3} value={rb.notes} onChange={(e) => setR("notes", e.target.value)} placeholder="Tell us anything that helps us rebook you." />
                </div>
              </div>
              <button
                onClick={submitRebook}
                disabled={!canRebook}
                className="mt-5 bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 font-semibold uppercase tracking-wider text-sm px-8 py-3.5 rounded-full transition-all"
              >
                Request Rebooking →
              </button>
            </>
          )}
        </div>

        {/* ── Refunds & cancellations ── */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📋</span>
            <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
              Refunds &amp; Cancellations
            </h2>
          </div>
          <ul className="space-y-3 text-white/65 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-sky-400 flex-shrink-0">•</span>
              <span>
                <strong className="text-white/85">Deposits & penalties</strong> are
                set by the cruise line, not by us. Non-refundable fares keep a
                non-refundable deposit; cancellation penalties increase the
                closer you get to the sail date.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-sky-400 flex-shrink-0">•</span>
              <span>
                <strong className="text-white/85">Final payment</strong> is due
                ~90 days before sailing. Miss it and the cruise line&rsquo;s
                system automatically cancels the reservation, triggering its
                penalties.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-sky-400 flex-shrink-0">•</span>
              <span>
                <strong className="text-white/85">Refund vs. credit.</strong>{" "}
                Depending on the fare and timing, you may receive a refund to your
                original payment method or a future-cruise / agency{" "}
                <em>credit</em>. Any credit we hold for you shows under{" "}
                <a href="#" className="text-sky-400 hover:text-sky-300">Check Your Credit</a>{" "}
                above.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-sky-400 flex-shrink-0">•</span>
              <span>
                <strong className="text-white/85">Credits expire.</strong> A
                credit must be used to rebook by its expiration date. After that
                date it is forfeited and the right to claim it is waived.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-sky-400 flex-shrink-0">•</span>
              <span>
                <strong className="text-white/85">Rebuild fee.</strong> If a
                booking is reinstated or rebuilt after a cancellation, a $250
                agency service fee applies (in addition to any cruise-line fees),
                and rebooking depends on the cabin and sailing still being
                available.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-sky-400 flex-shrink-0">•</span>
              <span>
                <strong className="text-white/85">Vacation protection</strong> is
                strongly recommended — it can cover cancellations for covered
                reasons that cruise-line penalties otherwise wouldn&rsquo;t.
              </span>
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/cancellation-policy"
              className="border border-white/25 hover:border-white/60 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
            >
              Full cancellation policy
            </Link>
            <Link
              href="/contact"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
            >
              Talk to a specialist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
