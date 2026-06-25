"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { fmt$, fmtDateDow } from "@/lib/sea-pay";

const DEPOSIT_PP = 50;

const FARE_TYPES = [
  { value: "flexible", label: "Flexible (refundable deposit)" },
  { value: "nonrefundable", label: "Non-Refundable (lowest price)" },
  { value: "semiflex", label: "Semi-Flex (partial refund)" },
];

const ACKS: { id: string; label: string }[] = [
  {
    id: "extras",
    label:
      "I understand vacation protection and gratuities (tips) are not included in the cruise price.",
  },
  {
    id: "deposit",
    label:
      "I understand a deposit is required to confirm this cabin, and that deposits on non-refundable fares are non-refundable.",
  },
  {
    id: "final",
    label:
      "I understand the balance (final payment) is due roughly 90 days before the sail date.",
  },
  {
    id: "authorize",
    label:
      "I authorize Cruises from Galveston to hold this cabin and contact me to arrange my deposit. No card is charged on this website.",
  },
];

function confirmNumber() {
  return "CFG-" + Math.random().toString(36).toUpperCase().substring(2, 8);
}

function BookCabinContent() {
  const params = useSearchParams();

  const [ship, setShip] = useState("");
  const [sailDate, setSailDate] = useState("");
  const [cabinType, setCabinType] = useState("");
  const [cruiseLine, setCruiseLine] = useState("");
  const [pricePP, setPricePP] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("2");
  const [guest2, setGuest2] = useState("");
  const [fareType, setFareType] = useState("flexible");
  const [notes, setNotes] = useState("");
  const [acks, setAcks] = useState<Record<string, boolean>>({});

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    setShip(params.get("ship") ?? "");
    setSailDate(params.get("date") ?? "");
    setCabinType(params.get("type") ?? "");
    setCruiseLine(params.get("line") ?? "");
    const p = Number(params.get("price"));
    if (!Number.isNaN(p)) setPricePP(p);
  }, [params]);

  const grossTotal = pricePP > 0 ? pricePP * 2 : 0;
  const depositTotal = DEPOSIT_PP * (Number(guests) || 2);
  const allAcked = ACKS.every((a) => acks[a.id]);
  const canSubmit =
    firstName && lastName && email && phone && allAcked && !submitting;

  async function submit() {
    setSubmitting(true);
    const num = confirmNumber();
    const ackNote = "Acknowledged: all booking terms accepted.";
    const partyNote = guest2 ? `Guest 2: ${guest2}. ` : "";
    await supabase.from("inquiries").insert({
      confirm_number: num,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      ship,
      sail_date: sailDate,
      rate_type: fareType,
      guests,
      cabin_type: cabinType,
      crew: "",
      message:
        `CABIN BOOKING REQUEST — ${cabinType || "cabin"} on ${ship} ${sailDate}. ` +
        `From ${fmt$(pricePP)}/pp · gross ${fmt$(grossTotal)} · deposit ${fmt$(
          depositTotal
        )}. ${partyNote}${ackNote}` +
        (notes ? ` Notes: ${notes}` : ""),
      appt_date: "",
      appt_time: "",
      mode: "booking",
    });
    setConfirm(num);
    setDone(true);
    setSubmitting(false);
  }

  const field =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block text-white/70 text-sm font-medium mb-1";

  if (done) {
    return (
      <div className="min-h-screen bg-[#05070d] flex items-center justify-center px-4 py-16">
        <div className="bg-[#0b1020] rounded-3xl border border-white/10 p-10 max-w-lg w-full text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] text-white mb-2">
            Cabin Held
          </h2>
          <div className="text-white/45 font-mono text-sm mb-6">
            Confirmation #{confirm}
          </div>
          <div className="bg-sky-400/10 border border-sky-400/20 rounded-2xl p-5 mb-6 text-left text-sm text-white/60 space-y-1">
            <div>
              <strong className="text-white/80">Ship:</strong> {ship}
            </div>
            {sailDate && (
              <div>
                <strong className="text-white/80">Sails:</strong>{" "}
                {fmtDateDow(sailDate)}
              </div>
            )}
            {cabinType && (
              <div>
                <strong className="text-white/80">Cabin:</strong> {cabinType}
              </div>
            )}
            {pricePP > 0 && (
              <div>
                <strong className="text-white/80">From:</strong> {fmt$(pricePP)}
                /person · deposit {fmt$(depositTotal)}
              </div>
            )}
            <div>
              <strong className="text-white/80">Guest:</strong> {firstName}{" "}
              {lastName}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-left text-sm text-white/60 space-y-2">
            <div className="font-extrabold text-white">What happens next?</div>
            <div>
              1. Your request is logged securely under #{confirm}.
            </div>
            <div>
              2. A specialist will contact <strong className="text-white/80">{email}</strong> to
              confirm availability and arrange your deposit — by phone, check, or
              directly with the cruise line.
            </div>
            <div>3. Once your deposit is received, your cabin is booked.</div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/sailings"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-6 py-3 rounded-full text-sm transition-all"
            >
              Browse More Sailings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d]">
      <div className="bg-[#0b1020] border-b border-white/10 text-white px-6 py-7">
        <div className="max-w-3xl mx-auto">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1">
            {"// Secure Cabin Booking"}
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
            Reserve Your Cabin
          </h1>
          <p className="text-white/55 text-sm mt-1">
            Submit a secure booking request — a specialist confirms availability
            and arranges your deposit. No card is charged on this site.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* Cabin summary */}
        {(ship || cabinType) && (
          <div className="bg-sky-500/10 border border-sky-400/30 rounded-2xl p-6">
            <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/80 mb-2">
              You&rsquo;re booking
            </div>
            <div className="text-white font-extrabold text-xl">
              {cabinType ? `${cabinType} · ` : ""}
              {ship}
            </div>
            <div className="text-white/60 text-sm mt-0.5">
              {cruiseLine}
              {sailDate ? ` · Sails ${fmtDateDow(sailDate)}` : ""}
            </div>
            {pricePP > 0 && (
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <span className="text-white/70">
                  From{" "}
                  <strong className="text-holo">{fmt$(pricePP)}</strong> / person
                </span>
                <span className="text-white/70">
                  Gross total{" "}
                  <strong className="text-white">{fmt$(grossTotal)}</strong> · 2
                  guests
                </span>
                <span className="text-white/70">
                  Deposit{" "}
                  <strong className="text-white">{fmt$(depositTotal)}</strong>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Lead guest */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-4">
            Lead Guest
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>First Name *</label>
              <input
                className={field}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
              />
            </div>
            <div>
              <label className={lbl}>Last Name *</label>
              <input
                className={field}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
              />
            </div>
            <div>
              <label className={lbl}>Email *</label>
              <input
                type="email"
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className={lbl}>Phone *</label>
              <input
                type="tel"
                className={field}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(409) 555-0100"
              />
            </div>
          </div>
        </div>

        {/* Party + fare */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-4">
            Travel Party
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Number of Guests</label>
              <select
                className={field}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} guest{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <p className="text-white/40 text-xs mt-1">
                Pricing is per person, double occupancy. 3rd/4th guests at
                add-a-guest rates.
              </p>
            </div>
            <div>
              <label className={lbl}>Second Guest Name</label>
              <input
                className={field}
                value={guest2}
                onChange={(e) => setGuest2(e.target.value)}
                placeholder="Full name (optional)"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>Fare Type</label>
              <select
                className={field}
                value={fareType}
                onChange={(e) => setFareType(e.target.value)}
              >
                {FARE_TYPES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>Special Requests</label>
              <textarea
                rows={3}
                className={`${field} resize-none`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Celebrating something? Accessibility needs? Bed configuration? Let us know."
              />
            </div>
          </div>
        </div>

        {/* Acknowledgments */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-4">
            Please Confirm
          </h3>
          <div className="space-y-3">
            {ACKS.map((a) => (
              <label
                key={a.id}
                className="flex items-start gap-3 text-sm text-white/65 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={!!acks[a.id]}
                  onChange={(e) =>
                    setAcks((s) => ({ ...s, [a.id]: e.target.checked }))
                  }
                  className="mt-1 accent-sky-500 w-4 h-4 flex-shrink-0"
                />
                {a.label}
              </label>
            ))}
          </div>
        </div>

        {/* Security notice */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3 text-xs text-white/55">
          <span className="text-lg">🔒</span>
          <span>
            <strong className="text-white/80">Secure request.</strong> Your
            details are transmitted over an encrypted connection. We never
            collect credit-card numbers on this website — a specialist arranges
            your deposit directly with you.
          </span>
        </div>

        <div className="flex gap-4 justify-end">
          <Link
            href="/sailings"
            className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider px-6 py-3 rounded-full text-sm transition-all"
          >
            Cancel
          </Link>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed font-semibold uppercase tracking-wider px-8 py-3 rounded-full text-sm transition-all"
          >
            {submitting ? "Submitting…" : "Submit Secure Booking →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookCabinPage() {
  return (
    <Suspense>
      <BookCabinContent />
    </Suspense>
  );
}
