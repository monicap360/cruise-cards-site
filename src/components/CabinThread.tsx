"use client";

import { useEffect, useState } from "react";
import { type CabinMessage, getCabinThread, sendCabinMessage } from "@/lib/cabin-thread";

// Two-way message thread for one reservation. `sender` is "guest" on the portal,
// "agent" in admin. `dark=false` renders light (white admin cards) styling.
export default function CabinThread({
  memberId,
  groupCode,
  sender,
}: {
  memberId: string;
  groupCode: string;
  sender: "guest" | "agent";
}) {
  const [msgs, setMsgs] = useState<CabinMessage[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  async function load() {
    try { setMsgs(await getCabinThread(memberId)); } catch { /* table may not exist yet */ }
  }
  useEffect(() => { if (open) load(); /* eslint-disable-next-line */ }, [open, memberId]);

  async function send() {
    if (!body.trim()) return;
    setBusy(true);
    const ok = await sendCabinMessage(memberId, groupCode, sender, body.trim());
    setBusy(false);
    if (ok) { setBody(""); load(); }
    else alert("Couldn't send — please call (409) 632-2106.");
  }

  const fmt = (t?: string) => (t ? new Date(t).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "");

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-semibold text-sky-400 hover:text-sky-300"
      >
        💬 Message {sender === "guest" ? "your specialist" : "guest"}{msgs.length ? ` (${msgs.length})` : ""} {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="mt-2 rounded-xl border border-white/10 bg-[#0b1020] p-3">
          <div className="space-y-2 max-h-56 overflow-y-auto mb-2">
            {msgs.length === 0 ? (
              <div className="text-white/40 text-xs">No messages yet — start the conversation.</div>
            ) : (
              msgs.map((m) => {
                const mine = m.sender === sender;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.sender === "agent" ? "bg-sky-500/15 text-sky-100 border border-sky-400/20" : "bg-white/5 text-white/85 border border-white/10"}`}>
                      <div className="text-[10px] uppercase tracking-wider opacity-50 mb-0.5">{m.sender === "agent" ? "Cruises from Galveston" : "Guest"} · {fmt(m.createdAt)}</div>
                      <div className="whitespace-pre-wrap">{m.body}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={sender === "guest" ? "Type a message to your specialist…" : "Reply to the guest…"}
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm placeholder-white/35 focus:outline-none focus:border-sky-400/60"
            />
            <button onClick={send} disabled={busy} className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-[11px] px-4 rounded-xl">
              {busy ? "…" : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
