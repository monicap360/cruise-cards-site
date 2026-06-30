"use client";

import { useEffect, useState } from "react";

// Go-Live / setup to-do, shown on the admin dashboard. Checkboxes persist on this
// device (localStorage). Collapses once you've worked through it.

const ITEMS: { id: string; group: string; label: string }[] = [
  { id: "sql", group: "① Database", label: "Run master-setup.sql in Supabase — turns on Tickets, Vault, Cruise Care, Bed Config, Fulfillment, Individual Bookings (+13), Hotel RFP, arrival checklist + the multi-tenant foundation" },
  { id: "resend", group: "② Render env", label: "RESEND_API_KEY + OWNER_EMAIL + BOOKING_FROM (booking emails)" },
  { id: "resend-domain", group: "② Render env", label: "Verify cruisesfromgalveston.net in Resend (so customer emails send)" },
  { id: "twilio", group: "② Render env", label: "TWILIO_ACCOUNT_SID / AUTH_TOKEN / FROM + ALERT_SMS_TO (+ TWILIO_VOICE_TO) — text + phone ring to (409) 632-2106" },
  { id: "anthropic", group: "② Render env", label: "ANTHROPIC_API_KEY (AI assistants + chatbot)" },
  { id: "paypal", group: "② Render env", label: "NEXT_PUBLIC_PAYPAL_ME (PayPal pay links)" },
  { id: "email-auth", group: "③ Email login", label: "Supabase → Authentication: enable Email, add your user (Auto Confirm)" },
  { id: "membership", group: "③ Email login", label: "Supabase: insert membership row — (your UID, 'cfg', 'owner')" },
  { id: "carnival", group: "④ Housekeeping", label: "Update booking contact on the 13 Carnival bookings → (409) 632-2106" },
];

export default function GoLiveChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try { setDone(JSON.parse(localStorage.getItem("admin-golive") || "{}")); } catch { /* ignore */ }
    if (localStorage.getItem("admin-golive-open") === "0") setOpen(false);
  }, []);

  function toggle(id: string) {
    setDone((d) => { const n = { ...d, [id]: !d[id] }; localStorage.setItem("admin-golive", JSON.stringify(n)); return n; });
  }
  function toggleOpen() { setOpen((v) => { localStorage.setItem("admin-golive-open", v ? "0" : "1"); return !v; }); }

  const count = ITEMS.filter((i) => done[i.id]).length;
  const pct = Math.round((count / ITEMS.length) * 100);
  const groups = Array.from(new Set(ITEMS.map((i) => i.group)));

  return (
    <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-5">
      <button onClick={toggleOpen} className="w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-white">🚀 Go-Live Checklist</span>
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/25">{count}/{ITEMS.length} done · {pct}%</span>
        </div>
        <span className="text-white/40 text-sm">{open ? "▲" : "▼"}</span>
      </button>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mt-3">
        <div className="h-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all" style={{ width: `${pct}%` }} />
      </div>

      {open && (
        <div className="mt-4 space-y-4">
          {groups.map((g) => (
            <div key={g}>
              <div className="label-mono text-[10px] uppercase tracking-wider text-sky-300/60 mb-1.5">{g}</div>
              <div className="space-y-1">
                {ITEMS.filter((i) => i.group === g).map((i) => (
                  <label key={i.id} className="flex items-start gap-3 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-white/[0.03]">
                    <input type="checkbox" checked={!!done[i.id]} onChange={() => toggle(i.id)} className="mt-0.5 accent-sky-500 w-4 h-4 shrink-0" />
                    <span className={`text-sm ${done[i.id] ? "line-through text-white/35" : "text-white/80"}`}>{i.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <p className="text-white/30 text-[10px] label-mono">▮ saved on this device · full script in docs/sql/master-setup.sql</p>
        </div>
      )}
    </div>
  );
}
