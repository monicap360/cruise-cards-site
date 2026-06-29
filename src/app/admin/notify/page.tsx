"use client";

import Link from "next/link";
import { useState } from "react";
import { saveContact, newContactId } from "@/lib/contacts";

type Tmpl = { id: string; label: string; subject: string; body: string };

const SIGN = "\n\n— Cruises from Galveston · (409) 632-2106";

const TEMPLATES: Tmpl[] = [
  { id: "updated", label: "Reservation updated", subject: "Your reservation has been updated", body: "Hi {name},\n\nGood news — your cruise reservation has been updated. Please review the latest details, and let us know if you have any questions." + SIGN },
  { id: "repriced", label: "Repriced — you saved money 🎉", subject: "We lowered the price of your cruise", body: "Hi {name},\n\nGreat news — the price on your sailing dropped and we repriced your reservation. You're now paying less for the very same cruise, and the savings are reflected in your balance." + SIGN },
  { id: "upgraded", label: "Stateroom upgraded", subject: "Your stateroom has been upgraded", body: "Hi {name},\n\nWonderful news — your stateroom has been upgraded! You'll enjoy a better cabin, and your booking has been updated to reflect it." + SIGN },
  { id: "moved-family", label: "Moved closer to family/group", subject: "We moved your room closer to your group", body: "Hi {name},\n\nYou wanted to be near your family/group — done! We moved your stateroom closer to the rest of your party so you can all be together." + SIGN },
  { id: "deposit", label: "Deposit received", subject: "We received your deposit", body: "Hi {name},\n\nThis confirms we received your deposit — your cabin is secured. Your remaining balance and final payment date are on your invoice." + SIGN },
  { id: "final-reminder", label: "Final payment reminder", subject: "Reminder: final payment coming up", body: "Hi {name},\n\nA friendly reminder that your final payment is coming due. To avoid an automatic cancellation by the cruise line, please complete payment by your final payment date — reply or call and we'll take care of it." + SIGN },
  { id: "paid-full", label: "Paid in full", subject: "You're paid in full — all set to sail!", body: "Hi {name},\n\nYou're paid in full and all set! Next up is online check-in and your boarding pass — we'll send check-in instructions shortly." + SIGN },
  { id: "docs", label: "Check-in / documents ready", subject: "Time to check in for your cruise", body: "Hi {name},\n\nOnline check-in is open for your sailing. Download your cruise line's app, add your booking number, and complete check-in to get your boarding pass and arrival time. Step-by-step help: {origin}/cruise-line-apps" + SIGN },
  { id: "itinerary", label: "Itinerary change (cruise line)", subject: "A change to your sailing itinerary", body: "Hi {name},\n\nThe cruise line has made a change to your itinerary. We want to be sure you're aware — please review the updated details and reach out with any questions." + SIGN },
  { id: "cabin-reassigned", label: "Cabin reassigned by cruise line", subject: "Update to your stateroom assignment", body: "Hi {name},\n\nThe cruise line reassigned your stateroom. We're reviewing it to make sure it still fits your needs — if anything looks off, tell us and we'll work to fix it." + SIGN },
  { id: "cancelled", label: "Reservation cancelled", subject: "Your reservation has been cancelled", body: "Hi {name},\n\nThis confirms your reservation has been cancelled. Any applicable credit is noted on your account — you can check it anytime at {origin}/already-booked." + SIGN },
  { id: "rebooked", label: "Rebooked — new details", subject: "You're rebooked — here are your new details", body: "Hi {name},\n\nYou're all rebooked! Your new sailing is confirmed and any credit on file has been applied. Review your updated invoice and let us know if you need anything." + SIGN },
  { id: "credit", label: "Credit issued", subject: "You have a travel credit with us", body: "Hi {name},\n\nYou have a travel credit on file with Cruises from Galveston. Look it up and start rebooking anytime at {origin}/already-booked — note that credits have an expiration date." + SIGN },
  { id: "free-cruise", label: "⭐ Free cruise invite (Carnival VIFP)", subject: "🎉 You have a FREE cruise waiting!", body: "Hi {name},\n\nAs a valued Carnival VIFP member, you have a FREE cruise ready to claim with Cruises from Galveston!\n\nCreate your free login to see the available dates, then tell us which one works for you. If this time around doesn't fit your schedule, no problem — just let us know. Either way, we don't want you to miss it.\n\nSee your free cruise dates and respond here: {origin}/free-cruise" + SIGN },
];

export default function AdminNotifyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tid, setTid] = useState(TEMPLATES[0].id);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [logged, setLogged] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  function applyTemplate(id: string) {
    setTid(id);
    const t = TEMPLATES.find((x) => x.id === id)!;
    const sub = (s: string) =>
      s.replace(/{name}/g, name || "there").replace(/{origin}/g, origin);
    setSubject(sub(t.subject));
    setBody(sub(t.body));
  }

  // Re-apply when name changes so {name} updates.
  function onNameChange(v: string) {
    setName(v);
    const t = TEMPLATES.find((x) => x.id === tid)!;
    setSubject(t.subject.replace(/{name}/g, v || "there").replace(/{origin}/g, origin));
    setBody(t.body.replace(/{name}/g, v || "there").replace(/{origin}/g, origin));
  }

  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  async function logIt() {
    if (!email.trim()) { alert("Enter the customer email."); return; }
    await saveContact({
      id: newContactId(),
      groupId: "" as never,
      customerName: name,
      email,
      phone: "",
      channel: "email",
      direction: "outbound",
      summary: subject,
      staff: "",
      contactedOn: new Date().toISOString().slice(0, 10),
    } as never);
    setLogged("Logged to the communication log ✓");
    setTimeout(() => setLogged(""), 4000);
  }

  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Customer Updates</h1>
            <p className="text-white/55 text-sm max-w-2xl">
              Pick a situation, personalize the message, and email it to the
              customer. Log it to the communication history with one click.
            </p>
          </div>
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
        </div>

        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={lbl}>Customer name</label><input className={input} value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="Jane Smith" /></div>
            <div><label className={lbl}>Customer email</label><input className={input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" /></div>
          </div>

          <div>
            <label className={lbl}>Situation / template</label>
            <select className={input} value={tid} onChange={(e) => applyTemplate(e.target.value)}>
              {TEMPLATES.map((t) => <option className="bg-[#0b1020]" key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>

          <div>
            <label className={lbl}>Subject</label>
            <input className={input} value={subject} onChange={(e) => setSubject(e.target.value)} onFocus={() => { if (!subject) applyTemplate(tid); }} />
          </div>
          <div>
            <label className={lbl}>Message</label>
            <textarea className={`${input} font-mono`} rows={10} value={body} onChange={(e) => setBody(e.target.value)} onFocus={() => { if (!body) applyTemplate(tid); }} />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <a href={mailto} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-6 py-2.5 rounded-full">✉ Send email</a>
            <button onClick={logIt} className="border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 font-semibold text-sm px-6 py-2.5 rounded-full">Log to comm history</button>
            {logged && <span className="text-green-300 text-sm font-semibold">{logged}</span>}
          </div>
          <p className="text-white/40 text-xs">
            Tip: select a template to auto-fill, then tweak the wording. Links to
            the customer&rsquo;s credit, check-in guide, and free-cruise page are
            inserted automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
