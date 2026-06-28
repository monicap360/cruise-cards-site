"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const CABIN_PREFS = ["Any cabin", "Interior", "Ocean View", "Balcony", "Suite"];

export default function WaitlistForm({
  defaultShip = "",
  defaultDate = "",
}: {
  defaultShip?: string;
  defaultDate?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ship, setShip] = useState(defaultShip);
  const [date, setDate] = useState(defaultDate);
  const [guests, setGuests] = useState(2);
  const [cabin, setCabin] = useState("Any cabin");
  const [notes, setNotes] = useState("");
  const [ack, setAck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit() {
    if (!name.trim() || (!phone.trim() && !email.trim())) {
      alert("Please add your name and a phone number (or email) so we can reach you.");
      return;
    }
    if (!ack) {
      alert("Please acknowledge that the waitlist does not guarantee space.");
      return;
    }
    setBusy(true);
    await supabase.from("inquiries").insert({
      confirm_number: "WL-" + Math.random().toString(36).toUpperCase().slice(2, 8),
      first_name: name,
      last_name: "",
      email,
      phone,
      ship,
      sail_date: date,
      rate_type: "",
      guests: String(guests),
      cabin_type: cabin,
      crew: "",
      message:
        `WAITLIST REQUEST — ${ship || "any ship"}${date ? ` · ${date}` : ""} · ` +
        `${guests} guest(s) · ${cabin}. ${notes}`.trim(),
      appt_date: "",
      appt_time: "",
      mode: "waitlist",
    });
    setBusy(false);
    setSent(true);
  }

  const field =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1.5";

  if (sent) {
    return (
      <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-3">📋</div>
        <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-2">
          You&rsquo;re on the waitlist
        </h2>
        <p className="text-white/60 max-w-md mx-auto">
          Thanks, {name.split(" ")[0] || "there"}. You&rsquo;re on the list for{" "}
          {ship || "your requested sailing"}{date ? ` (${date})` : ""}. Remember — this
          doesn&rsquo;t hold a cabin. <strong className="text-white">If a room opens up,
          we&rsquo;ll call you</strong> at {phone || email}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 sm:p-8">
      {/* Rules / disclaimer up top so it's unmissable */}
      <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-4 mb-6">
        <div className="label-mono text-[10px] uppercase tracking-wider text-amber-300/90 mb-1">
          Please read
        </div>
        <p className="text-amber-100/90 text-sm leading-relaxed">
          Joining the waitlist <strong>does not guarantee a cabin or space on the ship</strong>.
          Sailings can stay sold out. If a room becomes available, a specialist from Cruises
          from Galveston will <strong>call you</strong> — at that point you can decide whether to
          book. The waitlist is free and places no hold or charge.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Your name *</label>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Phone (best for a callback) *</label>
          <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Email</label>
          <input type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Guests</label>
          <input type="number" min={1} className={field} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
        </div>
        <div>
          <label className={lbl}>Ship</label>
          <input className={field} value={ship} onChange={(e) => setShip(e.target.value)} placeholder="Any Galveston ship" />
        </div>
        <div>
          <label className={lbl}>Sail date or month</label>
          <input className={field} value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. 2026-12-09 or 'Dec 2026'" />
        </div>
        <div>
          <label className={lbl}>Cabin preference</label>
          <select className={field} value={cabin} onChange={(e) => setCabin(e.target.value)}>
            {CABIN_PREFS.map((c) => (
              <option key={c} value={c} className="bg-[#0b1020]">{c}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={lbl}>Notes (flexibility on dates, # of cabins, etc.)</label>
          <textarea className={`${field} resize-none`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>

      <label className="flex items-start gap-3 mt-5 text-sm text-white/70 cursor-pointer">
        <input
          type="checkbox"
          checked={ack}
          onChange={(e) => setAck(e.target.checked)}
          className="mt-1 h-4 w-4 flex-shrink-0"
        />
        <span>
          I understand that joining the waitlist <strong className="text-white">does not
          guarantee a cabin or space on the ship</strong>, and that Cruises from Galveston will
          call me if a room becomes available.
        </span>
      </label>

      <button
        onClick={submit}
        disabled={busy}
        className="w-full mt-6 bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-sm py-4 rounded-full transition-all"
      >
        {busy ? "Adding you…" : "Join the waitlist →"}
      </button>
    </div>
  );
}
