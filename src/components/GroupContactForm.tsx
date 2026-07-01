"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

// Each passenger: put a phone + email on file AND self-confirm their legal name
// and date of birth (with the $150 name-change acknowledgment, since we're past
// final payment). Saves into the group's message stream for the front desk.
export default function GroupContactForm({ groupCode }: { groupCode: string }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const canSubmit = name.trim() && dob && (phone.trim() || email.trim()) && agree;

  async function submit() {
    if (!canSubmit) return;
    setBusy(true);
    const stamp = new Date().toISOString();
    await supabase.from("group_messages").insert({
      id: "gc-" + Math.random().toString(36).slice(2, 9),
      group_code: groupCode,
      sender: "guest",
      body:
        `📇 CONTACT + NAME/DOB CONFIRMED — ${name.trim()} · DOB ${dob} · ${phone.trim() || "no phone"} · ${email.trim() || "no email"} ` +
        `· ✅ "${name.trim()}" confirmed legal name & DOB are correct and match legal documents, and accepts the $150 name-change fee if a change is needed (past final payment). Recorded ${stamp}`,
    });
    setBusy(false);
    setSent(true);
  }

  const input =
    "w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";

  return (
    <div className="rounded-2xl border border-sky-400/30 bg-sky-500/[0.06] p-5">
      <div className="flex items-start gap-3">
        <span className="text-2xl">📇</span>
        <div>
          <div className="text-white font-bold">Action needed — confirm your details &amp; add your contact info</div>
          <p className="text-white/60 text-sm mt-1">
            Every passenger must add a <strong className="text-white/80">phone &amp; email</strong> and <strong className="text-white/80">confirm their legal name and date of birth</strong>. Each guest completes this themselves.
          </p>
        </div>
      </div>
      {sent ? (
        <div className="mt-4 text-green-300 text-sm">✓ Thank you! Your details are confirmed and on file. (Another passenger? Refresh and submit again.)</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <label className="block"><span className="label-mono text-[9px] uppercase tracking-wider text-white/50">Legal name (as on ID)</span>
              <input className={input + " mt-1"} placeholder="First & last name" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="block"><span className="label-mono text-[9px] uppercase tracking-wider text-white/50">Date of birth</span>
              <input className={input + " mt-1"} type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></label>
            <label className="block"><span className="label-mono text-[9px] uppercase tracking-wider text-white/50">Phone</span>
              <input className={input + " mt-1"} type="tel" placeholder="(409) 555-0123" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            <label className="block"><span className="label-mono text-[9px] uppercase tracking-wider text-white/50">Email</span>
              <input className={input + " mt-1"} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          </div>
          <label className="flex items-start gap-3 mt-4 cursor-pointer">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="accent-sky-500 w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-white/70 text-xs leading-relaxed">
              I confirm that my <strong className="text-white/90">name and date of birth above are correct and match my legal documents</strong>. I understand that because we are <strong className="text-white/90">past the final payment date</strong>, a <strong className="text-amber-300">$150 name-change fee</strong> applies if a correction is needed later.
            </span>
          </label>
          <button
            onClick={submit}
            disabled={busy || !canSubmit}
            className="mt-4 bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full"
          >
            {busy ? "Saving…" : "Confirm & submit"}
          </button>
        </>
      )}
    </div>
  );
}
