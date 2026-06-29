"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type CustomerCredit,
  getAllCredits,
  saveCredit,
  deleteCredit,
  newCreditId,
} from "@/lib/credits";

function blank(): CustomerCredit {
  return {
    id: newCreditId(),
    customerName: "",
    email: "",
    bookingRef: "",
    amount: 0,
    reason: "",
    status: "active",
    expiresOn: "",
    notes: "",
  };
}

function fmt$(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AdminCreditsPage() {
  const [credits, setCredits] = useState<CustomerCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<CustomerCredit>(blank());
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setCredits(await getAllCredits());
    setLoading(false);
  }
  useEffect(() => {
    refresh();
  }, []);

  const set = (p: Partial<CustomerCredit>) => setDraft((d) => ({ ...d, ...p }));

  function reset() {
    setDraft(blank());
    setEditing(false);
  }

  async function save() {
    if (!draft.email.trim() || draft.amount <= 0) {
      alert("Enter the customer email and a credit amount.");
      return;
    }
    setSaving(true);
    await saveCredit(draft);
    setSaving(false);
    reset();
    refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this credit?")) return;
    await deleteCredit(id);
    refresh();
  }

  function mailto(c: CustomerCredit) {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const subj = `You have a ${fmt$(c.amount)} credit with Cruises from Galveston${
      c.expiresOn ? ` — rebook by ${c.expiresOn}` : ""
    }`;
    const body = [
      `Hi ${c.customerName || "there"},`,
      "",
      `Good news — you have a ${fmt$(c.amount)} credit on file with Cruises from Galveston${
        c.reason ? ` (${c.reason})` : ""
      }.`,
      "",
      c.expiresOn
        ? `To use it, you must rebook on or before ${c.expiresOn}. After that date the credit expires and is forfeited — the right to claim it is waived.`
        : `Let us know when you're ready to use it toward a new sailing.`,
      "",
      `Check your credit and start rebooking here: ${origin}/already-booked`,
      "",
      `Reply to this email or call (409) 632-2106 and we'll get you re-booked.`,
      "",
      `— Cruises from Galveston`,
    ].join("\n");
    return `mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent(
      subj
    )}&body=${encodeURIComponent(body)}`;
  }

  const input =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
              Customer Credits
            </h1>
            <p className="text-white/55 text-sm max-w-2xl">
              Issue a credit to a customer, set a rebook-by (expiration) date,
              and email them a notification. They can look it up on the public
              Already Booked page.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/contacts" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">
              Comm Log →
            </Link>
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">
              ← Admin
            </Link>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="font-extrabold text-lg mb-4">
            {editing ? "Edit credit" : "Issue a credit"}
          </h2>
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
              <label className={lbl}>Credit amount ($) *</label>
              <input className={input} type="number" value={draft.amount || ""} onChange={(e) => set({ amount: Number(e.target.value) })} placeholder="500" />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>Booking reference</label>
              <input className={input} value={draft.bookingRef} onChange={(e) => set({ bookingRef: e.target.value })} placeholder="CFG-AB12CD" />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>Rebook by (expires)</label>
              <input className={input} type="date" value={draft.expiresOn} onChange={(e) => set({ expiresOn: e.target.value })} />
            </div>
            <div className="sm:col-span-4">
              <label className={lbl}>Reason</label>
              <input className={input} value={draft.reason} onChange={(e) => set({ reason: e.target.value })} placeholder="Cancelled sailing — future cruise credit" />
            </div>
            <div className="sm:col-span-2">
              <label className={lbl}>Status</label>
              <select className={input} value={draft.status} onChange={(e) => set({ status: e.target.value as CustomerCredit["status"] })}>
                <option className="bg-[#0b1020]" value="active">Active</option>
                <option className="bg-[#0b1020]" value="used">Used</option>
                <option className="bg-[#0b1020]" value="expired">Expired</option>
              </select>
            </div>
            <div className="sm:col-span-6">
              <label className={lbl}>Internal notes</label>
              <input className={input} value={draft.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Not shown to the customer" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={save} disabled={saving} className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-sm px-6 py-2.5 rounded-full">
              {saving ? "Saving…" : editing ? "Update credit" : "Issue credit"}
            </button>
            {editing && (
              <button onClick={reset} className="border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 font-semibold text-sm px-6 py-2.5 rounded-full">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <p className="text-white/45">Loading…</p>
        ) : credits.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center text-white/45">
            No credits issued yet.
          </div>
        ) : (
          <div className="space-y-3">
            {credits.map((c) => (
              <div key={c.id} className="bg-[#0b1020] rounded-xl border border-white/10 hover:border-sky-400/40 transition-colors p-4 flex items-start gap-4 flex-wrap">
                <div className="flex-1 min-w-[12rem]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-lg text-green-300">{fmt$(c.amount)}</span>
                    <span className="font-bold">{c.customerName || c.email}</span>
                    <span className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 ${c.status === "active" ? "bg-green-500/15 text-green-300 border border-green-400/25" : "bg-white/10 text-white/55"}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="text-white/55 text-sm">{c.email}{c.bookingRef ? ` · ${c.bookingRef}` : ""}</div>
                  {c.reason && <div className="text-white/55 text-sm mt-0.5">{c.reason}</div>}
                  <div className="text-white/40 text-xs mt-1">
                    {c.expiresOn ? `Rebook by ${c.expiresOn}` : "No expiration set"}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <a href={mailto(c)} className="text-xs font-bold bg-white text-black hover:bg-white/90 px-3 py-1.5 rounded-full">
                    ✉ Email customer
                  </a>
                  <div className="flex gap-2">
                    <button onClick={() => { setDraft(c); setEditing(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-xs font-bold text-sky-400 hover:text-sky-300">Edit</button>
                    <button onClick={() => remove(c.id)} className="text-xs font-bold text-red-300 hover:text-red-200">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
