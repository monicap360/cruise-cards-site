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
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const lbl = "block text-xs font-bold uppercase text-gray-500 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900">
              Communication Log
            </h1>
            <p className="text-gray-500 text-sm max-w-2xl">
              A point-of-contact history for every customer — log each call,
              email, or text and what was communicated. Shows how many times
              you&rsquo;ve reached out to each guest.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/credits" className="text-sm font-bold text-blue-700 hover:underline">
              Credits →
            </Link>
            <Link href="/admin" className="text-sm font-bold text-blue-700 hover:underline">
              ← Admin
            </Link>
          </div>
        </div>

        {/* Log a contact */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
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
                {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className={lbl}>Direction</label>
              <select className={input} value={draft.direction} onChange={(e) => set({ direction: e.target.value as CustomerContact["direction"] })}>
                <option value="outbound">Outbound</option>
                <option value="inbound">Inbound</option>
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
          <button onClick={save} disabled={saving} className="mt-5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm px-6 py-2.5 rounded-full">
            {saving ? "Saving…" : "Log it"}
          </button>
        </div>

        {/* History grouped by customer */}
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
            No communications logged yet.
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((g) => (
              <div key={g.email} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpen(open === g.email ? null : g.email)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50"
                >
                  <div>
                    <div className="font-bold">{g.name || g.email}</div>
                    <div className="text-gray-500 text-sm">{g.email} · last contact {g.last || "—"}</div>
                  </div>
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 rounded-full px-3 py-1 whitespace-nowrap">
                    {g.count} contact{g.count === 1 ? "" : "s"}
                  </span>
                </button>
                {open === g.email && (
                  <div className="border-t border-gray-100 divide-y divide-gray-100">
                    {g.contacts.map((c) => (
                      <div key={c.id} className="p-4 flex items-start gap-3">
                        <div className="text-xs font-bold uppercase text-gray-400 w-24 flex-shrink-0">
                          {c.contactedOn || "—"}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm">{c.summary}</div>
                          <div className="text-gray-400 text-xs mt-0.5">
                            {c.direction} {c.channel}
                            {c.staff ? ` · ${c.staff}` : ""}
                          </div>
                        </div>
                        <button onClick={() => remove(c.id)} className="text-xs font-bold text-red-600 hover:underline flex-shrink-0">Delete</button>
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
