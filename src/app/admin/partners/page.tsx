"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type Partner,
  blankPartner,
  getPartners,
  savePartner,
  deletePartner,
} from "@/lib/partners";

const TYPES: Partner["type"][] = [
  "Hotel",
  "Parking",
  "Travel Agent",
  "Restaurant",
  "Other",
];

const STATUSES: Partner["status"][] = ["prospect", "active", "paused"];

const FILTERS = ["All", ...TYPES] as const;

const statusColor: Record<Partner["status"], string> = {
  prospect: "bg-yellow-400/15 text-yellow-300 border border-yellow-400/25",
  active: "bg-green-500/15 text-green-300 border border-green-400/25",
  paused: "bg-white/15 text-white/40 border border-white/15",
};

const inputClass =
  "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
const labelClass =
  "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState<Partner>(blankPartner());
  const [editing, setEditing] = useState(false);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const data = await getPartners();
    setPartners(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  function set<K extends keyof Partner>(key: K, value: Partner[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function resetForm() {
    setForm(blankPartner());
    setEditing(false);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    await savePartner(form);
    await refresh();
    resetForm();
    setSaving(false);
  }

  function handleEdit(p: Partner) {
    setForm(p);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this partner?")) return;
    await deletePartner(id);
    await refresh();
    if (form.id === id) resetForm();
  }

  const filtered =
    filter === "All" ? partners : partners.filter((p) => p.type === filter);

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1">
            {"// Strategic Partnerships"}
          </div>
          <Link
            href="/admin"
            className="text-sky-400 hover:text-sky-300 text-sm font-semibold"
          >
            ← Admin
          </Link>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mt-2">
            Strategic Partnerships
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Galveston hotels, parking operators, travel agents & restaurants —
            cross-linking and co-marketing.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Form */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-extrabold uppercase tracking-wider mb-5">
            {editing ? "Edit Partner" : "Add Partner"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input
                className={inputClass}
                placeholder="Partner / business name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) =>
                  set("type", e.target.value as Partner["type"])
                }
              >
                {TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#0b1020]">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Contact Name</label>
              <input
                className={inputClass}
                placeholder="Primary contact"
                value={form.contactName}
                onChange={(e) => set("contactName", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                placeholder="(409) 555-0123"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                className={inputClass}
                placeholder="contact@partner.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input
                className={inputClass}
                placeholder="https://partner.com"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address</label>
              <input
                className={inputClass}
                placeholder="Street, Galveston TX"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Cross-Link URL</label>
              <input
                className={inputClass}
                placeholder="URL we link to / they link back"
                value={form.crossLinkUrl}
                onChange={(e) => set("crossLinkUrl", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) =>
                  set("status", e.target.value as Partner["status"])
                }
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-[#0b1020]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Deal Terms</label>
              <textarea
                className={inputClass}
                rows={2}
                placeholder="Co-marketing / commission / cross-link arrangement"
                value={form.dealTerms}
                onChange={(e) => set("dealTerms", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Notes</label>
              <textarea
                className={inputClass}
                rows={2}
                placeholder="Internal notes"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save partner"}
            </button>
            {editing && (
              <button
                onClick={resetForm}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-semibold px-5 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === f
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-16 text-center">
            <p className="text-white/45 text-lg font-bold">No partners yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-[#0b1020] rounded-2xl border border-white/10 p-6"
              >
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-white text-base">
                        {p.name}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/25">
                        {p.type}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColor[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </div>
                    {(p.contactName || p.phone || p.email) && (
                      <div className="text-white/55 text-sm mt-1">
                        {[p.contactName, p.phone, p.email]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    )}
                    {p.address && (
                      <div className="text-white/35 text-xs mt-0.5">
                        {p.address}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 mt-1">
                      {p.website && (
                        <a
                          href={p.website}
                          target="_blank"
                          rel="noopener"
                          className="text-sky-400 hover:text-sky-300 text-sm"
                        >
                          Website ↗
                        </a>
                      )}
                      {p.crossLinkUrl && (
                        <a
                          href={p.crossLinkUrl}
                          target="_blank"
                          rel="noopener"
                          className="text-sky-400 hover:text-sky-300 text-sm"
                        >
                          Cross-link ↗
                        </a>
                      )}
                    </div>
                    {p.dealTerms && (
                      <div className="text-white/55 text-sm mt-2">
                        <span className="text-white/35">Deal: </span>
                        {p.dealTerms}
                      </div>
                    )}
                    {p.notes && (
                      <div className="text-white/45 text-sm mt-1">
                        <span className="text-white/35">Notes: </span>
                        {p.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 text-white/80 hover:text-white font-semibold px-4 py-2 rounded-full text-xs uppercase tracking-wider"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-400/40 text-white/80 hover:text-red-300 font-semibold px-4 py-2 rounded-full text-xs uppercase tracking-wider"
                    >
                      Delete
                    </button>
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
