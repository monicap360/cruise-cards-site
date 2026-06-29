"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type CustomerContact,
  getAllContacts,
  saveContact,
  deleteContact,
  newContactId,
  groupByCustomer,
} from "@/lib/contacts";

const CHANNELS: CustomerContact["channel"][] = [
  "call",
  "email",
  "text",
  "in-person",
  "voicemail",
  "other",
];

function blank(): CustomerContact {
  return {
    id: newContactId(),
    customerName: "",
    email: "",
    phone: "",
    channel: "call",
    direction: "outbound",
    summary: "",
    staff: "",
    contactedOn: "",
  };
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<CustomerContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<CustomerContact>(blank());
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  async function refresh() {
    setContacts(await getAllContacts());
    setLoading(false);
  }
  useEffect(() => {
    refresh();
  }, []);

  const set = (p: Partial<CustomerContact>) => setDraft((d) => ({ ...d, ...p }));

  async function save() {
    if (!draft.email.trim() || !draft.summary.trim()) {
      alert("Enter the customer email and what was communicated.");
      return;
    }
    setSaving(true);
    await saveContact(draft);
    setSaving(false);
    setDraft(blank());
    refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this log entry?")) return;
    await deleteContact(id);
    refresh();
  }

  const groups = groupByCustomer(contacts);
  const input =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
              Communication Log
            </h1>
            <p className="text-white/55 text-sm max-w-2xl">
              A point-of-contact history for every customer — log each call,
              email, or text and what was communicated. Shows how many times
              you&rsquo;ve reached out to each guest.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/credits" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">
              Credits →
            </Link>
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">
              ← Admin
            </Link>
          </div>
        </div>

        {/* Log a contact */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="font-extrabold text-lg mb-4">Log a communication</h2>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="sm:col-span-3">
              <label className={lbl}>Customer name</label>
              <input className={input} value={draft.customerName} onChange={(e) => set({ customerName: e.target.value })} placeholder="Jane Smith" />
            </div>
            <div className="sm:col-span-3">
              <label className={lbl}>Email *</label>
              <input className={input} value={draft.email} onChange={(e) => set({ email: e.target.value })} placeholder="jane@example.com" />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>Phone</label>
              <input className={input} value={draft.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="(409) 555-0100" />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>Date</label>
              <input className={input} type="date" value={draft.contactedOn} onChange={(e) => set({ contactedOn: e.target.value })} />
            </div>
            <div className="sm:col-span-1">
              <label className={lbl}>Channel</label>
              <select className={input} value={draft.channel} onChange={(e) => set({ channel: e.target.value as CustomerContact["channel"] })}>
                {CHANNELS.map((c) => <option className="bg-[#0b1020]" key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className={lbl}>Direction</label>
              <select className={input} value={draft.direction} onChange={(e) => set({ direction: e.target.value as CustomerContact["direction"] })}>
                <option className="bg-[#0b1020]" value="outbound">Outbound</option>
                <option className="bg-[#0b1020]" value="inbound">Inbound</option>
              </select>
            </div>
            <div className="sm:col-span-5">
              <label className={lbl}>What was communicated *</label>
              <input className={input} value={draft.summary} onChange={(e) => set({ summary: e.target.value })} placeholder="Left voicemail re: final payment due, sent quote for March balcony…" />
            </div>
            <div className="sm:col-span-1">
              <label className={lbl}>Staff</label>
              <input className={input} value={draft.staff} onChange={(e) => set({ staff: e.target.value })} placeholder="MP" />
            </div>
          </div>
          <button onClick={save} disabled={saving} className="mt-5 bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-sm px-6 py-2.5 rounded-full">
            {saving ? "Saving…" : "Log it"}
          </button>
        </div>

        {/* History grouped by customer */}
        {loading ? (
          <p className="text-white/45">Loading…</p>
        ) : groups.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center text-white/45">
            No communications logged yet.
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((g) => (
              <div key={g.email} className="bg-[#0b1020] rounded-xl border border-white/10 hover:border-sky-400/40 transition-colors overflow-hidden">
                <button
                  onClick={() => setOpen(open === g.email ? null : g.email)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-white/5"
                >
                  <div>
                    <div className="font-bold">{g.name || g.email}</div>
                    <div className="text-white/55 text-sm">{g.email} · last contact {g.last || "—"}</div>
                  </div>
                  <span className="text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-400/25 rounded-full px-3 py-1 whitespace-nowrap">
                    {g.count} contact{g.count === 1 ? "" : "s"}
                  </span>
                </button>
                {open === g.email && (
                  <div className="border-t border-white/10 divide-y divide-white/10">
                    {g.contacts.map((c) => (
                      <div key={c.id} className="p-4 flex items-start gap-3">
                        <div className="text-xs font-bold uppercase text-white/40 w-24 flex-shrink-0">
                          {c.contactedOn || "—"}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm">{c.summary}</div>
                          <div className="text-white/40 text-xs mt-0.5">
                            {c.direction} {c.channel}
                            {c.staff ? ` · ${c.staff}` : ""}
                          </div>
                        </div>
                        <button onClick={() => remove(c.id)} className="text-xs font-bold text-red-300 hover:text-red-200 flex-shrink-0">Delete</button>
                      </div>
                    ))}
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
