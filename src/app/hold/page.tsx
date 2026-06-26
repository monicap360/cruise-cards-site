"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const HOLD_OPTIONS = [
  { hours: 24, label: "24 Hours", desc: "Free courtesy hold", fee: 0 },
  { hours: 48, label: "48 Hours", desc: "Two-day window", fee: 15 },
  { hours: 72, label: "72 Hours", desc: "Three-day window", fee: 25 },
];

function HoldForm() {
  const params = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    ship: params.get("ship") ?? "",
    sailingDate: params.get("date") ?? "",
    cabinType: params.get("type") ?? "",
    holdHours: 48,
    notes: "",
  });
  const [withinWindow, setWithinWindow] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const opt = HOLD_OPTIONS.find((o) => o.hours === form.holdHours) ?? HOLD_OPTIONS[0];
  const holdFee = opt.fee;
  const expiry = new Date(Date.now() + form.holdHours * 3600000);
  const expiryLabel =
    expiry.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) +
    " at " +
    expiry.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  useEffect(() => {
    if (!form.sailingDate) { setWithinWindow(false); return; }
    const sailing = new Date(form.sailingDate + "T12:00:00");
    const daysOut = Math.floor((sailing.getTime() - Date.now()) / 86400000);
    setWithinWindow(daysOut < 30);
  }, [form.sailingDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (withinWindow) return;
    await supabase.from("holds").insert({
      id: Math.random().toString(36).substring(2),
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      ship: form.ship,
      sailing_date: form.sailingDate,
      cabin_type: form.cabinType,
      duration_hours: form.holdHours,
      expires_at: new Date(Date.now() + form.holdHours * 3600000).toISOString(),
      status: "active",
    });
    setSubmitted(true);
  }

  if (submitted) {
    const expiry = new Date(Date.now() + form.holdHours * 3600000);
    return (
      <div className="min-h-screen bg-[#05070d] flex items-center justify-center px-4">
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-10 max-w-md w-full text-center">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] text-white mb-2">Room Hold Requested</h2>
          <p className="text-white/55 mb-4">
            Your <span className="font-bold text-white">{form.holdHours}-hour hold</span> request for{" "}
            <span className="font-bold text-white">
              {form.cabinType ? `${form.cabinType} · ` : ""}{form.ship}
            </span>{" "}
            has been received.
          </p>
          <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4 mb-6 text-left text-sm">
            <div className="font-bold text-amber-300/80 mb-1">Hold expires:</div>
            <div className="text-amber-300/80 font-mono">
              {expiry.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}{" "}
              at {expiry.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </div>
            {holdFee > 0 && (
              <div className="text-amber-300/70 text-xs mt-2">
                ${holdFee} extended-hold service fee applies (credited toward your
                booking).
              </div>
            )}
          </div>
          <p className="text-white/45 text-sm mb-6">
            A cruise specialist will contact you at <span className="font-semibold text-white/70">{form.email}</span> to confirm your hold. If we do not hear from you before expiry, the cabin will be released.
          </p>
          <Link href="/" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-8 py-3 rounded-full text-sm transition-all inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d]">
      {/* Header */}
      <div className="bg-[#05070d] text-white relative overflow-hidden grid-bg py-16">
        <div className="aurora bg-sky-500 w-[600px] h-[600px] -top-40 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Room Hold Service"}</div>
          <h1 className="text-4xl font-extrabold uppercase tracking-[-0.01em] mb-3">Hold Your Cabin</h1>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            Not quite ready to book? Hold your cabin for up to 72 hours while you finalize plans — no payment required.
          </p>
          <div className="mt-4 inline-block text-amber-300/80 bg-amber-400/10 border border-amber-400/20 text-xs font-bold px-4 py-2 rounded-full">
            Holds not available within 30 days of sailing
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cabin you're holding */}
          {(form.ship || form.cabinType) && (
            <div className="bg-sky-500/10 border border-sky-400/30 rounded-2xl p-5">
              <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/80 mb-1">
                Holding this cabin
              </div>
              <div className="text-white font-extrabold text-lg">
                {form.cabinType ? `${form.cabinType} · ` : ""}
                {form.ship}
              </div>
              {form.sailingDate && (
                <div className="text-white/60 text-sm">
                  Sails{" "}
                  {new Date(form.sailingDate + "T12:00:00").toLocaleDateString(
                    "en-US",
                    { weekday: "short", month: "long", day: "numeric", year: "numeric" }
                  )}
                </div>
              )}
            </div>
          )}

          {/* Hold Duration */}
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
            <h2 className="font-extrabold uppercase tracking-[-0.01em] text-white text-lg mb-1">How long do you need?</h2>
            <p className="text-white/45 text-sm mb-4">
              The first 24 hours are a free courtesy hold. Extended holds carry a
              small service fee that&rsquo;s applied to your booking when you book.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {HOLD_OPTIONS.map((o) => (
                <button
                  key={o.hours}
                  type="button"
                  onClick={() => set("holdHours", o.hours)}
                  className={`rounded-xl border p-4 text-center font-bold transition-all ${
                    form.holdHours === o.hours
                      ? "border-sky-400/70 bg-sky-400/10 text-white"
                      : "border-white/15 bg-white/5 text-white/55 hover:border-white/40"
                  }`}
                >
                  <div className="text-2xl font-extrabold">{o.label}</div>
                  <div className="text-xs mt-0.5 opacity-80">{o.desc}</div>
                  <div className={`text-[11px] font-bold mt-1.5 ${o.fee === 0 ? "text-sky-300" : "text-amber-300/90"}`}>
                    {o.fee === 0 ? "Free" : `+$${o.fee} service fee`}
                  </div>
                </button>
              ))}
            </div>
            {!withinWindow && form.sailingDate && (
              <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white/70">
                Hold would expire{" "}
                <span className="font-bold text-white">{expiryLabel}</span>
                {holdFee > 0 && (
                  <>
                    {" "}· <span className="text-amber-300/90 font-bold">${holdFee} service fee</span> (applied to your booking)
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cruise Info */}
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
            <h2 className="font-extrabold uppercase tracking-[-0.01em] text-white text-lg mb-4">Cruise Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  Ship / Cruise <span className="text-sky-400">*</span>
                </label>
                <input
                  value={form.ship}
                  onChange={(e) => set("ship", e.target.value)}
                  required
                  placeholder="e.g. Carnival Jubilee"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  Desired Sailing Date <span className="text-sky-400">*</span>
                </label>
                <input
                  type="date"
                  value={form.sailingDate}
                  onChange={(e) => set("sailingDate", e.target.value)}
                  required
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none ${
                    withinWindow
                      ? "border-amber-400/40 focus:border-amber-400/60"
                      : "border-white/15 focus:border-sky-400/60"
                  }`}
                />
                {withinWindow && (
                  <p className="text-amber-300/80 text-xs font-bold mt-1.5">
                    This sailing is within 30 days — holds are not available. Please call us to book directly.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  Cabin Type
                </label>
                <select
                  value={form.cabinType}
                  onChange={(e) => set("cabinType", e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-400/60"
                >
                  <option value="">Select cabin type…</option>
                  {["Interior", "Ocean View", "Balcony", "Mini-Suite", "Suite", "Family Suite"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
            <h2 className="font-extrabold uppercase tracking-[-0.01em] text-white text-lg mb-4">Your Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  Full Name <span className="text-sky-400">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">
                    Email <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">
                    Phone <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={2}
                  placeholder="Number of guests, preferences…"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl p-5 text-sm text-amber-300/80">
            <strong>Hold Policy:</strong> Your cabin will be held for{" "}
            <strong>{form.holdHours} hours</strong> from confirmation. The first
            24 hours are a free courtesy hold; 48- and 72-hour holds carry a
            non-refundable service fee (${"" + holdFee}) that is credited toward
            your booking when you book. If you don&rsquo;t book within the window,
            the cabin is released. Holds cannot be placed within 30 days of
            departure.
          </div>

          <button
            type="submit"
            disabled={withinWindow || !form.sailingDate || !form.name || !form.email || !form.phone}
            className="w-full bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed font-semibold uppercase tracking-wider py-4 rounded-full text-sm transition-all"
          >
            Request {form.holdHours}-Hour Hold
            {holdFee > 0 ? ` · $${holdFee} fee` : " · Free"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function HoldPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070d] flex items-center justify-center"><div className="text-white/45 font-bold">Loading…</div></div>}>
      <HoldForm />
    </Suspense>
  );
}
