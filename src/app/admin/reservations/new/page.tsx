"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  type Reservation,
  generateId,
  generateReservationNumber,
  saveReservation,
  todayStr,
  SERVICE_TYPES,
  SERVICE_ICON,
} from "@/lib/reservations";

const blank = {
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  partySize: "1",
  serviceType: "",
  ship: "",
  sailDate: "",
  bookingRef: "",
  loyaltyNumber: "",
  reservationDate: todayStr(),
  reservationTime: "",
  agentName: "",
  notes: "",
};

export default function NewReservationPage() {
  const router = useRouter();
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof blank, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const reservation: Reservation = {
      id: generateId(),
      reservationNumber: generateReservationNumber(),
      createdAt: new Date().toISOString(),
      guestName: form.guestName.trim(),
      legalFirstName: "",
      legalLastName: "",
      guestEmail: form.guestEmail.trim(),
      guestPhone: form.guestPhone.trim(),
      partySize: parseInt(form.partySize) || 1,
      serviceType: form.serviceType,
      ship: form.ship.trim(),
      sailDate: form.sailDate,
      bookingRef: form.bookingRef.trim(),
      loyaltyNumber: form.loyaltyNumber.trim(),
      reservationDate: form.reservationDate,
      reservationTime: form.reservationTime,
      agentName: form.agentName.trim(),
      status: "reserved",
      requestSummary: "",
      aiBrief: "",
      idVerified: false,
      notes: form.notes.trim(),
    };
    await saveReservation(reservation);
    router.push("/admin/reservations");
  }

  const labelCls =
    "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";
  const inputCls =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin/reservations"
            className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white"
          >
            ← Reservations
          </Link>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mt-2">New Reservation</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Guest Info */}
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <h2 className="font-extrabold text-white text-lg mb-5">
              Guest Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>
                  Guest Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.guestName}
                  onChange={(e) => set("guestName", e.target.value)}
                  required
                  autoFocus
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Phone</label>
                <input
                  type="tel"
                  value={form.guestPhone}
                  onChange={(e) => set("guestPhone", e.target.value)}
                  placeholder="(409) 555-0123"
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  value={form.guestEmail}
                  onChange={(e) => set("guestEmail", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Party Size</label>
                <input
                  type="number"
                  min="1"
                  value={form.partySize}
                  onChange={(e) => set("partySize", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Service & Schedule */}
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <h2 className="font-extrabold text-white text-lg mb-5">
              Service & Schedule
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>
                  Service <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.serviceType}
                  onChange={(e) => set("serviceType", e.target.value)}
                  required
                  className={inputCls}
                >
                  <option value="" className="bg-[#0b1020]">Select a service…</option>
                  {SERVICE_TYPES.map((s) => (
                    <option key={s} value={s} className="bg-[#0b1020]">
                      {SERVICE_ICON[s] ?? "⚓"} {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>
                  Reservation Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={form.reservationDate}
                  onChange={(e) => set("reservationDate", e.target.value)}
                  required
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Time</label>
                <input
                  type="time"
                  value={form.reservationTime}
                  onChange={(e) => set("reservationTime", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Related Cruise (optional) */}
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <h2 className="font-extrabold text-white text-lg mb-1">
              Related Cruise
            </h2>
            <p className="text-white/40 text-xs mb-5">
              Optional — link this visit to the guest&apos;s sailing.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Ship</label>
                <input
                  value={form.ship}
                  onChange={(e) => set("ship", e.target.value)}
                  placeholder="e.g. Carnival Jubilee"
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Sail Date</label>
                <input
                  type="date"
                  value={form.sailDate}
                  onChange={(e) => set("sailDate", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Booking / Confirmation #</label>
                <input
                  value={form.bookingRef}
                  onChange={(e) => set("bookingRef", e.target.value)}
                  placeholder="Optional"
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Past Guest / Loyalty #</label>
                <input
                  value={form.loyaltyNumber}
                  onChange={(e) => set("loyaltyNumber", e.target.value)}
                  placeholder="VIFP, Crown & Anchor, Latitudes…"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Agent & Notes */}
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <h2 className="font-extrabold text-white text-lg mb-5">
              Agent & Notes
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Front Desk Agent</label>
                <input
                  value={form.agentName}
                  onChange={(e) => set("agentName", e.target.value)}
                  placeholder="Your name"
                  className={inputCls}
                />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={3}
                  placeholder="Special requests, accessibility needs, follow-up…"
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Link
              href="/admin/reservations"
              className="px-6 py-3 rounded-full border border-white/15 text-white/80 font-semibold text-sm hover:border-white/40 hover:bg-white/5"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 font-semibold uppercase tracking-wider px-8 py-3 rounded-full text-sm transition-all"
            >
              {saving ? "Saving…" : "Create Reservation →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
