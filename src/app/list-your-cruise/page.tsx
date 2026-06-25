"use client";

import Link from "next/link";
import { useState } from "react";
import {
  saveListing,
  generateId,
  CRUISE_LINES,
  ADMIN_FEE,
  type Listing,
} from "@/lib/last-minute";
import { fmt$ } from "@/lib/sea-pay";

export default function ListYourCruisePage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [cruiseLine, setCruiseLine] = useState<string>(CRUISE_LINES[0]);
  const [ship, setShip] = useState("");
  const [sailDate, setSailDate] = useState("");
  const [nights, setNights] = useState("7");
  const [itinerary, setItinerary] = useState("");
  const [cabinType, setCabinType] = useState("");
  const [guests, setGuests] = useState("2");
  const [bookingRef, setBookingRef] = useState("");
  const [pricePaid, setPricePaid] = useState("");
  const [penalty, setPenalty] = useState("");
  const [desiredBack, setDesiredBack] = useState("");
  const [consent, setConsent] = useState(false);
  const [cabinNumber, setCabinNumber] = useState("");
  const [paidInFull, setPaidInFull] = useState<boolean | null>(null);
  const [passengers, setPassengers] = useState<{ name: string; dob: string }[]>(
    []
  );

  const guestCount = Math.max(1, Math.min(8, parseInt(guests) || 1));
  function setPassenger(i: number, field: "name" | "dob", val: string) {
    setPassengers((prev) => {
      const next = [...prev];
      while (next.length < guestCount) next.push({ name: "", dob: "" });
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    const listing: Listing = {
      id: generateId(),
      createdAt: "",
      status: "pending",
      sellerName,
      sellerEmail,
      sellerPhone,
      cruiseLine,
      ship,
      sailDate,
      nights: parseInt(nights) || 0,
      itinerary,
      cabinType,
      guests: guestCount,
      bookingRef,
      cabinNumber,
      paidInFull: paidInFull ?? false,
      passengers: passengers.slice(0, guestCount),
      pricePaid: parseFloat(pricePaid) || 0,
      penaltyAmount: parseFloat(penalty) || 0,
      desiredBack: parseFloat(desiredBack) || 0,
      buyerPrice: 0,
      sellerRefund: 0,
      notes: "",
    };
    await saveListing(listing);
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="bg-[#05070d] text-white min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">
            {"// Listing Received"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] mb-5">
            We&apos;re on it.
          </h1>
          <p className="text-white/60 text-lg mb-4">
            Thanks, {sellerName.split(" ")[0] || "friend"}. A cruise specialist will
            verify your booking&apos;s transfer eligibility with {cruiseLine} and
            call you at the number you provided.
          </p>
          <p className="text-white/45 text-sm mb-10">
            For your security, we&apos;ll collect your booking PIN and complete the
            transfer by phone — never through this form.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/last-minute"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              See the Board
            </Link>
            <Link
              href="/"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const labelCls = "block text-white/70 text-sm font-medium mb-1.5";

  return (
    <div className="bg-[#05070d] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-6">
            {"// Transfer & Resell"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-5">
            List Your Cruise
          </h1>
          <p className="text-white/55 text-lg">
            Can&apos;t sail? Transfer your booking to us and we&apos;ll find a
            last-minute traveler to take it over — so you recover part of what you
            paid instead of losing it all.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Eligibility / security notice */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-5 mb-8 text-sm text-white/60 leading-relaxed">
          <span className="text-sky-400 font-semibold">Before you list — </span>
          transfers depend on your cruise line&apos;s name-change rules and
          aren&apos;t possible on every fare. We&apos;ll verify eligibility first.
          <span className="text-white/80">
            {" "}
            Never enter your booking PIN here
          </span>{" "}
          — a specialist collects it by phone once your booking is confirmed
          eligible.
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* You */}
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              {"// Your Details"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Full name *</label>
                <input
                  className={inputCls}
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  required
                  placeholder="As it appears on the booking"
                />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  className={inputCls}
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className={labelCls}>Phone *</label>
                <input
                  type="tel"
                  className={inputCls}
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  required
                  placeholder="(409) 555-0123"
                />
              </div>
            </div>
          </div>

          {/* Cruise */}
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              {"// The Cruise"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Cruise line *</label>
                <select
                  className={inputCls}
                  value={cruiseLine}
                  onChange={(e) => setCruiseLine(e.target.value)}
                  required
                >
                  {CRUISE_LINES.map((c) => (
                    <option key={c} value={c} className="bg-[#0b1020]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Ship *</label>
                <input
                  className={inputCls}
                  value={ship}
                  onChange={(e) => setShip(e.target.value)}
                  required
                  placeholder="e.g. Carnival Breeze"
                />
              </div>
              <div>
                <label className={labelCls}>Sail date *</label>
                <input
                  type="date"
                  className={inputCls}
                  value={sailDate}
                  onChange={(e) => setSailDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nights</label>
                  <input
                    type="number"
                    min="1"
                    className={inputCls}
                    value={nights}
                    onChange={(e) => setNights(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Guests</label>
                  <input
                    type="number"
                    min="1"
                    className={inputCls}
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Itinerary / ports</label>
                <input
                  className={inputCls}
                  value={itinerary}
                  onChange={(e) => setItinerary(e.target.value)}
                  placeholder="e.g. Cozumel · Roatán · Belize"
                />
              </div>
              <div>
                <label className={labelCls}>Cabin type</label>
                <input
                  className={inputCls}
                  value={cabinType}
                  onChange={(e) => setCabinType(e.target.value)}
                  placeholder="e.g. Balcony, Deck 8"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Booking / confirmation number *</label>
                <input
                  className={inputCls}
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  required
                  placeholder="Booking number only — no PIN"
                />
              </div>
            </div>
          </div>

          {/* Passengers & cabin */}
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              {"// Passengers & Cabin"}
            </div>
            <div className="mb-5 max-w-xs">
              <label className={labelCls}>Cabin / stateroom number</label>
              <input
                className={inputCls}
                value={cabinNumber}
                onChange={(e) => setCabinNumber(e.target.value)}
                placeholder="e.g. 8240"
              />
            </div>
            <label className={labelCls}>
              Every guest on the booking — exact name + date of birth *
            </label>
            <p className="text-white/40 text-xs mb-3">
              Cruise lines require each guest&apos;s exact legal name and DOB to
              transfer a booking.
            </p>
            <div className="space-y-3">
              {Array.from({ length: guestCount }).map((_, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    className={inputCls}
                    value={passengers[i]?.name ?? ""}
                    onChange={(e) => setPassenger(i, "name", e.target.value)}
                    placeholder={`Guest ${i + 1} — full legal name`}
                    required
                  />
                  <input
                    type="date"
                    aria-label={`Guest ${i + 1} date of birth`}
                    className={inputCls}
                    value={passengers[i]?.dob ?? ""}
                    onChange={(e) => setPassenger(i, "dob", e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Money */}
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              {"// The Money"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className={labelCls}>Total you paid (USD) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputCls}
                  value={pricePaid}
                  onChange={(e) => setPricePaid(e.target.value)}
                  required
                  placeholder="e.g. 1180"
                />
              </div>
              <div>
                <label className={labelCls}>Cancellation penalty (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputCls}
                  value={penalty}
                  onChange={(e) => setPenalty(e.target.value)}
                  placeholder="e.g. 400"
                />
              </div>
              <div>
                <label className={labelCls}>You&apos;d like back (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputCls}
                  value={desiredBack}
                  onChange={(e) => setDesiredBack(e.target.value)}
                  placeholder="e.g. 700"
                />
              </div>
            </div>
            <label className={labelCls}>Is the booking paid in full? *</label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              {[
                { v: true, l: "Paid in full" },
                { v: false, l: "Balance still owed" },
              ].map((o) => {
                const active = paidInFull === o.v;
                return (
                  <button
                    type="button"
                    key={o.l}
                    onClick={() => setPaidInFull(o.v)}
                    className={`rounded-xl px-4 py-3 border text-sm font-semibold transition-colors ${
                      active
                        ? "border-sky-400/70 bg-sky-400/10 text-white"
                        : "border-white/15 bg-white/5 text-white/70 hover:border-white/40"
                    }`}
                  >
                    {o.l}
                  </button>
                );
              })}
            </div>
            <p className="text-white/40 text-xs mt-3">
              We&apos;ll price the cabin to recover as much of your money as we can.
              The buyer pays the cruise line&apos;s name-change fee plus a flat{" "}
              {fmt$(ADMIN_FEE)} agency fee.
            </p>
          </div>

          {/* Consent */}
          <label className="flex items-start gap-3 bg-[#0b1020] border border-white/10 rounded-2xl p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 accent-sky-500 w-4 h-4 flex-shrink-0"
            />
            <span className="text-white/60 text-sm leading-relaxed">
              I understand I must transfer this booking to Cruises from Galveston™
              for resale, that a specialist will verify eligibility and collect
              transfer details by phone, and that any refund is issued by the
              agency per policy once the cabin is sold.
            </span>
          </label>

          <button
            type="submit"
            disabled={!consent || submitting}
            className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
          >
            {submitting ? "Submitting…" : "Submit My Listing"}
          </button>
        </form>
      </section>
    </div>
  );
}
