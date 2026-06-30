"use client";

import { useEffect, useState } from "react";
import { type TicketMessage, getTicketMessages, addTicketMessage } from "@/lib/tickets";

export default function TicketThread({
  ticketId,
  sender,
  light = false,
  disabled = false,
}: {
  ticketId: string;
  sender: "agent" | "guest";
  light?: boolean;
  disabled?: boolean;
}) {
  const [msgs, setMsgs] = useState<TicketMessage[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try { setMsgs(await getTicketMessages(ticketId)); } catch { /* table may not exist yet */ }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [ticketId]);

  async function send() {
    if (!body.trim()) return;
    setBusy(true);
    const ok = await addTicketMessage(ticketId, sender, body.trim());
    setBusy(false);
    if (ok) { setBody(""); load(); }
    else alert("Couldn't send — please try again.");
  }

  const fmt = (t?: string) => (t ? new Date(t).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "");
  const bubbleAgent = light ? "bg-sky-100 text-sky-900 border-sky-200" : "bg-sky-500/15 text-sky-100 border-sky-400/20";
  const bubbleGuest = light ? "bg-gray-100 text-gray-800 border-gray-200" : "bg-white/5 text-white/85 border-white/10";
  const inputCls = light
    ? "flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-sky-500"
    : "flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm placeholder-white/35 focus:outline-none focus:border-sky-400/60";

  return (
    <div>
      <div className="space-y-2 max-h-72 overflow-y-auto mb-3">
        {msgs.length === 0 ? (
          <div className={light ? "text-gray-400 text-sm" : "text-white/40 text-sm"}>No messages yet.</div>
        ) : (
          msgs.map((m) => {
            const mine = m.sender === sender;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm border ${m.sender === "agent" ? bubbleAgent : bubbleGuest}`}>
                  <div className="text-[10px] uppercase tracking-wider opacity-50 mb-0.5">{m.sender === "agent" ? "Cruises from Galveston" : "You"} · {fmt(m.createdAt)}</div>
                  <div className="whitespace-pre-wrap">{m.body}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {!disabled && (
        <div className="flex gap-2">
          <input value={body} onChange={(e) => setBody(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={sender === "agent" ? "Add a note / reply (the guest sees this)…" : "Reply…"} className={inputCls} />
          <button onClick={send} disabled={busy} className="bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-50 font-semibold uppercase tracking-wider text-[11px] px-4 rounded-xl">
            {busy ? "…" : "Send"}
          </button>
        </div>
      )}
      {disabled && <div className={light ? "text-gray-400 text-xs" : "text-white/40 text-xs"}>This ticket is closed. Call (409) 632‑2106 to reopen.</div>}
    </div>
  );
}
