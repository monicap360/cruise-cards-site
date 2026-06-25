"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type Reservation,
  type SlotAvailability,
  BOOKABLE_SERVICES,
  getDayAvailability,
  generateId,
  generateReservationNumber,
  saveReservation,
  fmtDate,
  fmtTime,
  todayStr,
  SLOT_CAPACITY,
  BOOKING_WINDOW_DAYS,
} from "@/lib/reservations";

type Step = 1 | 2 | 3 | 4;

// Each acknowledgment is separate — the guest must check every one.
const ACK_ITEMS: { id: string; label: React.ReactNode }[] = [
  {
    id: "pricing",
    label:
      "I understand vacation protection and gratuities (tips) are never included in the price of the cruise.",
  },
  {
    id: "final",
    label:
      "I understand cancellations are final and cannot be undone — there is no going back and forth with staff.",
  },
  {
    id: "online",
    label:
      "I understand cancellations must be made online, not through an agent.",
  },
  {
    id: "penalties",
    label: "I accept all penalties and agree to follow all cruise line rules.",
  },
];

function maxDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + BOOKING_WINDOW_DAYS);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function ReservePage() {
  const [step, setStep] = useState<Step>(1);

  // Selections
  const [service, setService] = useState("");
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState("");

  // Guest
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [party, setParty] = useState(1);
  const [ship, setShip] = useState("");
  const [sailDate, setSailDate] = useState("");
  const [loyaltyNumber, setLoyaltyNumber] = useState("");
  const [requestSummary, setRequestSummary] = useState("");
  const [acks, setAcks] = useState<Record<string, boolean>>({});

  const allAcked = ACK_ITEMS.every((i) => acks[i.id]);
  const toggleAck = (id: string) =>
    setAcks((a) => ({ ...a, [id]: !a[id] }));

  // Availability
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    reservation: Reservation;
    customerMessage: string;
  } | null>(null);

  const selectedService = BOOKABLE_SERVICES.find((s) => s.name === service);
  const byPhone = !!selectedService?.byPhone;

  // Load availability whenever the date changes on step 2
  useEffect(() => {
    if (step !== 2) return;
    let active = true;
    setLoadingSlots(true);
    setTime("");
    getDayAvailability(date).then((s) => {
      if (active) {
        setSlots(s);
        setLoadingSlots(false);
      }
    });
    return () => {
      active = false;
    };
  }, [step, date]);

  const openSlots = useMemo(
    () => slots.filter((s) => !s.isPast && s.remaining >= party),
    [slots, party]
  );

  async function submit() {
    setSubmitting(true);

    // 1. Ask the AI concierge — never blocks the booking if it fails.
    let customerMessage =
      "Thanks! We've shared your notes with your specialist so they're ready to help.";
    let aiBrief = "";
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: service,
          guestName: `${firstName.trim()} ${lastName.trim()}`.trim(),
          partySize: party,
          ship: ship.trim(),
          sailDate,
          byPhone,
          requestSummary: requestSummary.trim(),
        }),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.customerMessage) customerMessage = d.customerMessage;
        if (d.agentBrief) aiBrief = d.agentBrief;
      }
    } catch {
      /* keep the friendly default */
    }

    // 2. Save the reservation — syncs straight into the front desk queue.
    const reservation: Reservation = {
      id: generateId(),
      reservationNumber: generateReservationNumber(),
      createdAt: new Date().toISOString(),
      guestName: `${firstName.trim()} ${lastName.trim()}`.trim(),
      legalFirstName: firstName.trim(),
      legalLastName: lastName.trim(),
      guestEmail: email.trim(),
      guestPhone: phone.trim(),
      partySize: party,
      serviceType: service,
      ship: ship.trim(),
      sailDate,
      bookingRef: "",
      loyaltyNumber: loyaltyNumber.trim(),
      reservationDate: date,
      reservationTime: time,
      agentName: "",
      status: "requested",
      requestSummary: requestSummary.trim(),
      aiBrief,
      idVerified: false,
      notes: "",
    };
    await saveReservation(reservation);

    setConfirmation({ reservation, customerMessage });
    setSubmitting(false);
    setStep(4);
  }

  // ── Confirmation screen ─────────────────────────────────────────────────────
  if (step === 4 && confirmation) {
    const r = confirmation.reservation;
    return (
      <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden grid-bg flex items-center justify-center px-4 py-16">
        <div className="aurora bg-sky-500 -top-40 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 bg-[#0b1020] border border-white/10 rounded-2xl max-w-lg w-full p-8 sm:p-10 text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em] text-white mb-2">
            You&apos;re on the books!
          </h1>

          {/* AI concierge note */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left mb-6">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">{"// Your Cruise Concierge"}</div>
            <p className="text-white/55 leading-relaxed">
              {confirmation.customerMessage}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-2 mb-6">
            <Row label="Confirmation #" value={r.reservationNumber} mono />
            <Row label="Service" value={r.serviceType} />
            <Row label="Date" value={fmtDate(r.reservationDate)} />
            <Row label="Time" value={fmtTime(r.reservationTime)} />
            <Row
              label="Party"
              value={`${r.partySize} guest${r.partySize !== 1 ? "s" : ""}`}
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white/55 mb-4">
            <strong className="text-white">Pending confirmation.</strong> A specialist will{" "}
            {byPhone ? "call" : "text or email"} you shortly to confirm your time.
          </div>

          <p className="text-xs text-white/45 mb-6 leading-relaxed">
            Reminder: cancellations are final and must be made online — not through
            an agent. All penalties and cruise line rules apply. Vacation
            protection and gratuities are never included in the cruise price.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/experience-center"
              className="flex-1 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-6 py-3 rounded-full transition-all"
            >
              Explore the Center
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-6 py-3 rounded-full transition-all"
            >
              Book Another Visit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Hero / progress */}
      <div className="bg-[#05070d] text-white relative overflow-hidden grid-bg">
        <div className="aurora bg-sky-500 -top-40 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Cruise Experience Center · Galveston"}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.01em] mb-2">
            Reserve Your Visit
          </h1>
          <p className="text-white/55 max-w-xl mx-auto">
            New to cruising or sailing for the tenth time — booking your time with
            us takes about a minute. Pick what you need, choose a time, and
            you&apos;re set.
          </p>

          {/* Step pills */}
          <div className="flex items-center justify-center gap-2 mt-7">
            {[
              { n: 1, label: "Service" },
              { n: 2, label: "Time" },
              { n: 3, label: "Details" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                    step >= s.n
                      ? "bg-white text-black"
                      : "bg-white/5 text-white/45"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      step > s.n
                        ? "bg-sky-400 text-black"
                        : step === s.n
                          ? "bg-sky-400 text-black"
                          : "bg-white/20"
                    }`}
                  >
                    {step > s.n ? "✓" : s.n}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < 2 && <span className="text-white/30">—</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* ── Step 1: Choose a service ─────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-extrabold uppercase tracking-[-0.01em] text-white mb-1">
              What can we help you with?
            </h2>
            <p className="text-white/55 text-sm mb-6">
              First time cruising? Start with a free consultation or a quick call —
              we&apos;ll walk you through everything.
            </p>
            <div className="space-y-3">
              {BOOKABLE_SERVICES.map((s) => (
                <button
                  key={s.name}
                  onClick={() => {
                    setService(s.name);
                    setStep(2);
                  }}
                  className={`w-full text-left bg-[#0b1020] rounded-2xl border p-5 transition-all hover:bg-white/[0.03] ${
                    service === s.name
                      ? "border-sky-400/60"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold uppercase tracking-[-0.01em] text-white">
                          {s.name}
                        </span>
                        {s.firstTimer && (
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-sky-400/10 text-sky-400 border border-sky-400/30 px-2 py-0.5 rounded-full">
                            Great for first-timers
                          </span>
                        )}
                      </div>
                      <div className="text-sky-400 text-sm font-semibold mt-0.5">
                        {s.tagline}
                      </div>
                      <p className="text-white/55 text-sm mt-1 leading-relaxed">
                        {s.blurb}
                      </p>
                      <div className="text-white/45 text-xs font-semibold mt-2">
                        {s.duration} · Free
                      </div>
                    </div>
                    <span className="text-white/40 text-xl">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Pick date & time ─────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <button
              onClick={() => setStep(1)}
              className="text-sky-400 hover:text-sky-300 text-sm font-bold mb-4"
            >
              ← Change service
            </button>

            {selectedService && (
              <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-4 mb-6 flex items-center gap-3">
                <div>
                  <div className="font-extrabold uppercase tracking-[-0.01em] text-white">
                    {selectedService.name}
                  </div>
                  <div className="text-white/45 text-xs">
                    {selectedService.duration}
                    {byPhone ? " · we call you" : " · in person"}
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-xl font-extrabold uppercase tracking-[-0.01em] text-white mb-4">
              When works for you?
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  min={todayStr()}
                  max={maxDateStr()}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  How many guests?
                </label>
                <select
                  value={party}
                  onChange={(e) => setParty(parseInt(e.target.value))}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                >
                  {Array.from({ length: SLOT_CAPACITY }, (_, i) => i + 1).map(
                    (n) => (
                      <option key={n} value={n}>
                        {n} guest{n !== 1 ? "s" : ""}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="text-sm font-bold text-white mb-3">
              {fmtDate(date)} — available times
            </div>

            {loadingSlots ? (
              <div className="text-white/45 text-sm font-semibold py-8 text-center">
                Checking availability…
              </div>
            ) : openSlots.length === 0 ? (
              <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-white font-bold text-sm">
                  No open times for this date & party size.
                </p>
                <p className="text-white/55 text-xs mt-1">
                  Try another date — or call us at the center and we&apos;ll find a
                  spot.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {openSlots.map((s) => {
                  const lowLeft = s.remaining <= 2;
                  return (
                    <button
                      key={s.time}
                      onClick={() => {
                        setTime(s.time);
                        setStep(3);
                      }}
                      className={`rounded-xl border px-2 py-3 text-center transition-all hover:bg-white/[0.03] ${
                        time === s.time
                          ? "border-sky-400/60 bg-white/5"
                          : "border-white/10 bg-[#0b1020] hover:border-white/25"
                      }`}
                    >
                      <div className="font-extrabold text-white text-sm">
                        {fmtTime(s.time)}
                      </div>
                      {lowLeft && (
                        <div className="text-[10px] font-bold text-sky-400 mt-0.5">
                          {s.remaining} left
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Your details ─────────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <button
              onClick={() => setStep(2)}
              className="text-sky-400 hover:text-sky-300 text-sm font-bold mb-4"
            >
              ← Change time
            </button>

            {/* Summary */}
            <div className="bg-[#0b1020] border border-white/10 text-white rounded-2xl p-5 mb-6">
              <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">
                {"// "}{byPhone ? "Your call" : "Your visit"}
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-extrabold uppercase tracking-[-0.01em]">{service}</div>
                  <div className="text-white/55 text-sm">
                    {fmtDate(date)} at {fmtTime(time)} · {party} guest
                    {party !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-extrabold uppercase tracking-[-0.01em] text-white mb-4">
              Almost done — {byPhone ? "who should we call?" : "who's coming in?"}
            </h2>

            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Legal first name"
                  required
                  value={firstName}
                  onChange={setFirstName}
                />
                <Field
                  label="Legal last name"
                  required
                  value={lastName}
                  onChange={setLastName}
                />
              </div>
              <p className="text-xs text-white/45 -mt-1">
                Enter your name <strong className="text-white/70">exactly as it appears on your
                passport or government photo ID</strong> — this is the name that
                appears on your cruise documents.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Phone"
                  required
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  placeholder="(409) 555-0123"
                />
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
                <Field
                  label="Ship (if you know it)"
                  value={ship}
                  onChange={setShip}
                  placeholder="Optional"
                />
                <Field
                  label="Sail date (if booked)"
                  type="date"
                  value={sailDate}
                  onChange={setSailDate}
                />
                <Field
                  label="Past guest / loyalty #"
                  value={loyaltyNumber}
                  onChange={setLoyaltyNumber}
                  placeholder="VIFP, Crown & Anchor, Latitudes…"
                />
              </div>

              {/* In-person photo ID reminder */}
              {!byPhone && (
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/55">
                  <strong className="text-white">Bring a valid government photo ID.</strong> For your
                  safety and ours, our staff verify it in person when you arrive.
                  We don&apos;t store a copy.
                </div>
              )}

              {/* AI-assisted request summary */}
              <div>
                <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-1">
                  In your own words, what would you like help with?
                  <span className="text-[10px] normal-case font-semibold bg-sky-400/10 text-sky-400 border border-sky-400/30 px-2 py-0.5 rounded-full">
                    Helps us prepare
                  </span>
                </label>
                <textarea
                  value={requestSummary}
                  onChange={(e) => setRequestSummary(e.target.value)}
                  rows={4}
                  placeholder={
                    byPhone
                      ? "e.g. First cruise for our family of 4 — want help picking a ship and understanding what's included."
                      : "e.g. Need boarding passes and luggage tags printed, plus a wheelchair for my mom."
                  }
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 resize-none focus:outline-none focus:border-sky-400/60"
                />
                <p className="text-white/45 text-xs mt-1">
                  Our AI concierge reads this and briefs your specialist so the{" "}
                  {byPhone ? "call" : "visit"} is quick and personal.
                </p>
              </div>
            </div>

            {/* Important: pricing + cancellation — each acknowledged separately */}
            <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-5 mt-6 text-sm text-white/55">
              <div className="font-extrabold uppercase tracking-[-0.01em] text-white mb-1">Please note before you book</div>
              <p className="text-white/45 text-xs mb-4">
                Please check each item to confirm you understand. See our{" "}
                <Link
                  href="/cancellation-policy"
                  className="underline font-semibold text-sky-400"
                >
                  cancellation policy
                </Link>{" "}
                for full details.
              </p>
              <div className="space-y-3">
                {ACK_ITEMS.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={!!acks[item.id]}
                      onChange={() => toggleAck(item.id)}
                      className="mt-0.5 w-5 h-5 rounded border-white/20 bg-white/5 text-sky-400 focus:ring-sky-400 flex-shrink-0"
                    />
                    <span className="font-semibold text-white/70 leading-snug">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={submit}
              disabled={
                !firstName.trim() ||
                !lastName.trim() ||
                !phone.trim() ||
                !allAcked ||
                submitting
              }
              className="w-full mt-6 bg-white text-black hover:bg-white/90 disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed font-semibold uppercase tracking-wider text-sm py-4 rounded-full transition-all"
            >
              {submitting
                ? "Preparing your visit…"
                : "Request My Reservation →"}
            </button>
            <p className="text-center text-white/45 text-xs mt-3">
              Submitted over a secure, encrypted connection. No
              payment needed — we&apos;ll confirm by{" "}
              {byPhone ? "phone" : "text or email"}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-white/70 text-sm font-medium mb-1">
        {label} {required && <span className="text-sky-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
      />
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-white/45">{label}</span>
      <span className={`font-bold text-white ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
