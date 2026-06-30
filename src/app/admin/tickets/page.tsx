"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type Ticket, getTickets, saveTicket, setTicketStatus, deleteTicket,
  newTicketId, newTicketToken, newTicketPin,
} from "@/lib/tickets";
import TicketThread from "@/components/TicketThread";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"open" | "all">("open");
  const [f, setF] = useState({ customerName: "", customerEmail: "", customerPhone: "", subject: "" });
  const [openId, setOpenId] = useState("");

  async function load() { setLoading(true); setTickets(await getTickets()); setLoading(false); }
  useEffect(() => { load(); }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = (t: Ticket) => `${origin}/ticket/${t.token}`;

  async function create() {
    if (!f.subject.trim() || !f.customerName.trim()) { alert("Add a customer name and subject."); return; }
    const t: Ticket = {
      id: newTicketId(), token: newTicketToken(), pin: newTicketPin(),
      customerName: f.customerName, customerEmail: f.customerEmail, customerPhone: f.customerPhone,
      groupCode: "", subject: f.subject, status: "Open",
    };
    await saveTicket(t);
    setF({ customerName: "", customerEmail: "", customerPhone: "", subject: "" });
    await load();
    setOpenId(t.id);
  }
  async function toggle(t: Ticket) { await setTicketStatus(t.id, t.status === "Open" ? "Closed" : "Open"); await load(); }
  async function remove(id: string) { if (confirm("Delete this ticket?")) { await deleteTicket(id); await load(); } }
  function emailLink(t: Ticket) {
    const body = `Hi ${t.customerName.split(" ")[0] || "there"},\n\nWe've opened a support ticket for "${t.subject}". View it and reply here:\n${link(t)}\nYour PIN: ${t.pin}\n\nCruises from Galveston · (409) 632-2106`;
    window.location.href = `mailto:${encodeURIComponent(t.customerEmail)}?subject=${encodeURIComponent(`Your ticket — ${t.subject}`)}&body=${encodeURIComponent(body)}`;
  }

  const shown = useMemo(() => tickets.filter((t) => (filter === "open" ? t.status === "Open" : true)), [tickets, filter]);
  const openCount = tickets.filter((t) => t.status === "Open").length;
  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{"// Support"}</div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Tickets</h1>
            <p className="text-white/55 text-sm max-w-2xl">Guest questions &amp; concerns. Each gets a PIN link the customer opens to see your updates and reply — update notes here and they see it instantly.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hud label-mono text-[10px] uppercase tracking-wider text-white px-3 py-1.5 rounded-full">{openCount} open</span>
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
          </div>
        </div>

        {/* New ticket */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-5 mb-6">
          <div className="font-bold text-sm mb-3">Open a new ticket</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className={input} value={f.customerName} onChange={(e) => setF({ ...f, customerName: e.target.value })} placeholder="Customer name *" />
            <input className={input} value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} placeholder="Subject / question *" />
            <input className={input} value={f.customerEmail} onChange={(e) => setF({ ...f, customerEmail: e.target.value })} placeholder="Email" />
            <input className={input} value={f.customerPhone} onChange={(e) => setF({ ...f, customerPhone: e.target.value })} placeholder="Phone" />
          </div>
          <button onClick={create} className="mt-3 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">Create ticket + PIN link</button>
        </div>

        <div className="flex gap-2 mb-4">
          {(["open", "all"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full ${filter === s ? "bg-white text-black" : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"}`}>{s}</button>
          ))}
        </div>

        {loading ? <div className="text-white/50">Loading…</div> : shown.length === 0 ? (
          <div className="text-white/45 text-center py-10">{filter === "open" ? "No open tickets. 🎉" : "No tickets yet."}</div>
        ) : (
          <div className="space-y-3">
            {shown.map((t) => (
              <div key={t.id} className="bg-[#0b1020] border border-white/10 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-bold flex items-center gap-2">{t.subject}
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${t.status === "Open" ? "bg-green-500/15 text-green-300" : "bg-white/10 text-white/50"}`}>{t.status}</span>
                    </div>
                    <div className="text-white/50 text-sm">{[t.customerName, t.customerEmail, t.customerPhone].filter(Boolean).join(" · ")}</div>
                    <div className="text-white/35 text-xs mt-0.5">PIN <span className="text-sky-300 font-mono font-bold">{t.pin}</span></div>
                  </div>
                  <div className="flex gap-3 text-xs font-bold shrink-0">
                    {t.customerEmail && <button onClick={() => emailLink(t)} className="text-sky-400 hover:text-sky-300">📧 Email</button>}
                    <button onClick={() => navigator.clipboard?.writeText(`${link(t)} (PIN ${t.pin})`)} className="text-white/55 hover:text-white">Copy link</button>
                    <button onClick={() => setOpenId(openId === t.id ? "" : t.id)} className="text-sky-400 hover:text-sky-300">{openId === t.id ? "Hide" : "Open"}</button>
                    <button onClick={() => toggle(t)} className={t.status === "Open" ? "text-amber-300 hover:text-amber-200" : "text-green-300 hover:text-green-200"}>{t.status === "Open" ? "Close" : "Reopen"}</button>
                    <button onClick={() => remove(t.id)} className="text-red-300 hover:text-red-200">×</button>
                  </div>
                </div>
                {openId === t.id && (
                  <div className="mt-4 border-t border-white/10 pt-3">
                    <TicketThread ticketId={t.id} sender="agent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
