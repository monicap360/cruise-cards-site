"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const HOLD_OPTIONS = [
  { hours: 24, label: "24 Hours", desc: "Same-day decision", color: "bg-blue-600 border-blue-600" },
  { hours: 48, label: "48 Hours", desc: "Two-day window", color: "bg-blue-700 border-blue-700" },
  { hours: 72, label: "72 Hours", desc: "Three-day window", color: "bg-blue-900 border-blue-900" },
];

function HoldForm() {
  const params = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    ship: params.get("ship") ?? "",
    sailingDate: "",
    cabinType: "",
    holdHours: 48,
    notes: "",
  });
  const [withinWindow, setWithinWindow] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!form.sailingDate) { setWithinWindow(false); return; }
    const sailing = new Date(form.sailingDate + "T12:00:00");
    const daysOut = Math.floor((sailing.getTime() - Date.now()) / 86400000);
    setWithinWindow(daysOut < 30);
  }, [form.sailingDate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (withinWindow) return;
    // In production this would POST to an API / Supabase
    // For now we save a hold request to localStorage for admin review
    const holds = JSON.parse(localStorage.getItem("cfg-holds") ?? "[]");
    holds.unshift({
      id: Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + form.holdHours * 3600000).toISOString(),
      ...form,
    });
    localStorage.setItem("cfg-holds", JSON.stringify(holds));
    setSubmitted(true);
  }

  if (submitted) {
    const expiry = new Date(Date.now() + form.holdHours * 3600000);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-extrabold text-blue-900 mb-2">Room Hold Requested!</h2>
          <p className="text-gray-500 mb-4">
            Your <span className="font-bold text-blue-900">{form.holdHours}-hour hold</span> request for{" "}
            <span className="font-bold text-blue-900">{form.ship}</span> has been received.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left text-sm">
            <div className="font-bold text-yellow-800 mb-1">Hold expires:</div>
            <div className="text-yellow-700 font-mono">
              {expiry.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}{" "}
              at {expiry.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            A cruise specialist will contact you at <span className="font-semibold">{form.email}</span> to confirm your hold. If we do not hear from you before expiry, the cabin will be released.
          </p>
          <Link href="/" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full text-sm transition-all inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-block bg-yellow-500 text-white text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
            🔒 Room Hold Service
          </div>
          <h1 className="text-4xl font-extrabold mb-3">Hold Your Cabin</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Not quite ready to book? Hold your cabin for up to 72 hours while you finalize plans — no payment required.
          </p>
          <div className="mt-4 inline-block bg-red-600/80 text-white text-xs font-bold px-4 py-2 rounded-full">
            ⚠️ Holds not available within 30 days of sailing
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hold Duration */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-blue-900 text-lg mb-4">How long do you need?</h2>
            <div className="grid grid-cols-3 gap-3">
              {HOLD_OPTIONS.map((opt) => (
                <button
                  key={opt.hours}
                  type="button"
                  onClick={() => set("holdHours", opt.hours)}
                  className={`rounded-xl border-2 p-4 text-center font-bold transition-all ${
                    form.holdHours === opt.hours
                      ? `${opt.color} text-white`
                      : "border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  <div className="text-2xl font-extrabold">{opt.label}</div>
                  <div className="text-xs mt-0.5 opacity-80">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cruise Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-blue-900 text-lg mb-4">Cruise Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Ship / Cruise <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.ship}
                  onChange={(e) => set("ship", e.target.value)}
                  required
                  placeholder="e.g. Carnival Jubilee"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Desired Sailing Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.sailingDate}
                  onChange={(e) => set("sailingDate", e.target.value)}
                  required
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    withinWindow
                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />
                {withinWindow && (
                  <p className="text-red-600 text-xs font-bold mt-1.5">
                    ⚠️ This sailing is within 30 days — holds are not available. Please call us to book directly.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Cabin Type
                </label>
                <select
                  value={form.cabinType}
                  onChange={(e) => set("cabinType", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-blue-900 text-lg mb-4">Your Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={2}
                  placeholder="Number of guests, preferences…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-sm text-yellow-800">
            <strong>Hold Policy:</strong> Holds are courtesy reservations only. Your cabin will be reserved for{" "}
            <strong>{form.holdHours} hours</strong> from the time of confirmation. If you do not book within that window, the cabin is automatically released with no penalty. Holds cannot be placed on sailings within 30 days of departure.
          </div>

          <button
            type="submit"
            disabled={withinWindow || !form.sailingDate || !form.name || !form.email || !form.phone}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-extrabold py-4 rounded-full text-lg transition-all shadow-lg"
          >
            🔒 Request {form.holdHours}-Hour Hold
          </button>
        </form>
      </div>
    </div>
  );
}

export default function HoldPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-400 font-bold">Loading…</div></div>}>
      <HoldForm />
    </Suspense>
  );
}
