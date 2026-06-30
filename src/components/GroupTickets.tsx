"use client";

import { useEffect, useState } from "react";
import {
  type Ticket, getTicketsForGroup, saveTicket, addTicketMessage,
  newTicketId, newTicketToken, newTicketPin,
} from "@/lib/tickets";
import TicketThread from "@/components/TicketThread";

// Questions & Concerns inside a group/individual portal. The guest is already
// PIN-gated into the portal, so they can open tickets and reply inline.
export default function GroupTickets({ groupCode, groupName }: { groupCode: string; groupName: string }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState("");

  async function load() { try { setTickets(await getTicketsForGroup(groupCode)); } catch { /* table may not exist */ } }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [groupCode]);

  async function create() {
    if (!subject.trim()) return;
    setBusy(true);
    const t: Ticket = {
      id: newTicketId(), token: newTicketToken(), pin: newTicketPin(),
      customerName: name || groupName, customerEmail: "", customerPhone: "",
      groupCode, subject: subject.trim(), status: "Open",
    };
    const ok = await saveTicket(t);
    if (ok) await addTicketMessage(t.id, "guest", subject.trim());
    setBusy(false);
    if (ok) { setSubject(""); setName(""); await load(); setOpenId(t.id); }
    else alert("Couldn't submit — please call (409) 632-2106.");
  }

  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";

  return (
    <div>
      <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-2">{"// Questions & Concerns"}</div>
      <p className="text-white/55 text-sm mb-4">Have a question? Open a ticket and we&rsquo;ll reply right here — you&rsquo;ll see our updates without leaving this page.</p>

      <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-5 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
          <input className={input} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What can we help with?" />
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" />
        </div>
        <button onClick={create} disabled={busy} className="mt-3 bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">{busy ? "Sending…" : "Open a ticket"}</button>
      </div>

      {tickets.length > 0 && (
        <div className="space-y-2">
          {tickets.map((t) => (
            <div key={t.id} className="bg-[#0b1020] border border-white/10 rounded-xl p-4">
              <button onClick={() => setOpenId(openId === t.id ? "" : t.id)} className="w-full flex items-center justify-between gap-3 text-left">
                <span className="font-semibold text-white">{t.subject}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${t.status === "Open" ? "bg-green-500/15 text-green-300" : "bg-white/10 text-white/50"}`}>{t.status}</span>
                  <span className="text-white/40 text-xs">{openId === t.id ? "▲" : "▼"}</span>
                </span>
              </button>
              {openId === t.id && (
                <div className="mt-3 border-t border-white/10 pt-3">
                  <TicketThread ticketId={t.id} sender="guest" disabled={t.status === "Closed"} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
