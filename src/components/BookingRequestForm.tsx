"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

// Request types a guest can submit from their portal. Room moves and guest
// changes MUST come through here so we have every request in writing.
const TYPES: { key: string; label: string }[] = [
  { key: "room-move", label: "Room move / cabin change" },
  { key: "guest-change", label: "Add, remove, or update a guest" },
  { key: "name-correction", label: "Name correction" },
  { key: "cancellation", label: "Cancel my booking" },
  { key: "booking-change", label: "Other booking change" },
];

export default function BookingRequestForm({
  email,
  name,
}: {
  email: string;
  name?: string;
}) {
  const [type, setType] = useState("room-move");
  const [confirm, setConfirm] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit() {
    if (!details.trim()) {
      alert("Please describe your request so we can take care of it.");
      return;
    }
    setBusy(true);
    const label = TYPES.find((t) => t.key === type)?.label ?? type;
    await supabase.from("inquiries").insert({
      confirm_number: confirm.trim() || "REQ-" + Math.random().toString(36).toUpperCase().slice(2, 8),
      first_name: name || "Account",
      last_name: "",
      email,
      phone: "",
      ship: "",
      sail_date: "",
      rate_type: "",
      guests: "",
      cabin_type: "",
      crew: confirm.trim(),
      message: `BOOKING REQUEST (${label})${confirm.trim() ? ` · conf ${confirm.trim()}` : ""} — ${details}`,
      appt_date: "",
      appt_time: "",
      mode: type,
    });
    try {
      await fetch("/api/notify-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: label, customerName: name || "Account holder", customerEmail: email,
          confirmNumber: confirm.trim(), summary: details,
        }),
      });
    } catch { /* ignore — request already saved */ }
    setBusy(false);
    setSent(true);
  }

  const field =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1.5";

  if (sent) {
    return (
      <div className="text-sky-300 text-sm">
        Got it — your request was submitted and is on file. Your specialist will follow up at{" "}
        {email}. You can submit another change anytime from here.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Request type</label>
          <select className={field} value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t.key} value={t.key} className="bg-[#0b1020]">
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>Confirmation # (if you have it)</label>
          <input className={field} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="optional" />
        </div>
      </div>
      <div>
        <label className={lbl}>Details of your request</label>
        <textarea
          className={`${field} resize-none`}
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="e.g. Move us from an interior to a balcony on deck 8 · Add a 3rd guest, Jane Doe, DOB 04/12/1990 · Correct spelling of last name to Smith"
        />
      </div>
      {type === "cancellation" && (
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-3 text-amber-100/90 text-sm">
          <strong>Before you cancel:</strong> cruise-line cancellation penalties may apply
          depending on how close to sailing you are — after the final-payment date you can lose
          your deposit or more. If you have vacation protection, a covered cancellation may be
          reimbursed. We&rsquo;ll confirm your exact penalty with you before anything is
          cancelled.{" "}
          <a href="/guides/travel-insurance" className="underline hover:text-white">
            See cancellation &amp; protection details
          </a>
          .
        </div>
      )}
      <button
        onClick={submit}
        disabled={busy}
        className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
      >
        {busy ? "Submitting…" : "Submit request"}
      </button>
    </div>
  );
}
