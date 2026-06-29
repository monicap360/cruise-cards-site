"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type Offer,
  getAllOffers,
  saveOffer,
  deleteOffer,
  setOfferActive,
  newOfferId,
  DEFAULT_OFFERS,
} from "@/lib/offers";
import { GALVESTON_FLEET } from "@/lib/seed-inventory";

const CRUISE_LINES = Array.from(
  new Set(GALVESTON_FLEET.map((s) => s.cruiseLine))
).sort();

function blankOffer(sortOrder: number): Offer {
  return {
    id: newOfferId(),
    title: "",
    description: "",
    badge: "",
    icon: "🎁",
    active: true,
    sortOrder,
    cruiseLine: "",
    nights: null,
    dateStart: "",
    dateEnd: "",
  };
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Offer>(blankOffer(1));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const list = await getAllOffers();
    setOffers(list);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  function resetDraft() {
    setDraft(blankOffer(offers.length + 1));
    setEditing(false);
  }

  async function save() {
    if (!draft.title.trim()) {
      alert("Give the offer a title.");
      return;
    }
    setSaving(true);
    await saveOffer(draft);
    setSaving(false);
    resetDraft();
    refresh();
  }

  async function edit(o: Offer) {
    setDraft(o);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: string) {
    if (!confirm("Delete this offer?")) return;
    await deleteOffer(id);
    if (draft.id === id) resetDraft();
    refresh();
  }

  async function toggle(o: Offer) {
    await setOfferActive(o.id, !o.active);
    refresh();
  }

  async function seedDefaults() {
    if (!confirm("Add the 6 starter offers to the database?")) return;
    for (let i = 0; i < DEFAULT_OFFERS.length; i++) {
      await saveOffer({ ...DEFAULT_OFFERS[i], id: newOfferId() });
    }
    refresh();
  }

  const set = (patch: Partial<Offer>) => setDraft((d) => ({ ...d, ...patch }));
  const input =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const label = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
              Promotions &amp; Offers
            </h1>
            <p className="text-white/55 text-sm">
              Create offers and toggle them live. Leave the rules blank to show
              an offer on every sailing, or target a cruise line, length, or
              date window.
            </p>
          </div>
          <Link
            href="/admin"
            className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white"
          >
            ← Admin
          </Link>
        </div>

        {/* Editor */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="font-extrabold text-lg mb-4">
            {editing ? "Edit offer" : "New offer"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="sm:col-span-1">
              <label className={label}>Icon</label>
              <input
                className={input}
                value={draft.icon}
                onChange={(e) => set({ icon: e.target.value })}
                placeholder="🎁"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Badge</label>
              <input
                className={input}
                value={draft.badge}
                onChange={(e) => set({ badge: e.target.value })}
                placeholder="Lowest Fare"
              />
            </div>
            <div className="sm:col-span-3">
              <label className={label}>Title *</label>
              <input
                className={input}
                value={draft.title}
                onChange={(e) => set({ title: e.target.value })}
                placeholder="Prepaid Non-Refundable Rate"
              />
            </div>
            <div className="sm:col-span-6">
              <label className={label}>Description</label>
              <textarea
                className={input}
                rows={2}
                value={draft.description}
                onChange={(e) => set({ description: e.target.value })}
                placeholder="What the guest gets and why it's a good deal."
              />
            </div>

            <div className="sm:col-span-6 border-t border-white/10 pt-3">
              <p className="text-xs font-bold uppercase text-white/40 mb-3">
                Targeting rules (optional — blank = all sailings)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className={label}>Cruise line</label>
                  <select
                    className={input}
                    value={draft.cruiseLine || ""}
                    onChange={(e) => set({ cruiseLine: e.target.value })}
                  >
                    <option className="bg-[#0b1020]" value="">Any line</option>
                    {CRUISE_LINES.map((l) => (
                      <option className="bg-[#0b1020]" key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Length (nights/days)</label>
                  <input
                    className={input}
                    type="number"
                    value={draft.nights ?? ""}
                    onChange={(e) =>
                      set({
                        nights: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    placeholder="Any"
                  />
                </div>
                <div>
                  <label className={label}>Sail date from</label>
                  <input
                    className={input}
                    type="date"
                    value={draft.dateStart || ""}
                    onChange={(e) => set({ dateStart: e.target.value })}
                  />
                </div>
                <div>
                  <label className={label}>Sail date to</label>
                  <input
                    className={input}
                    type="date"
                    value={draft.dateEnd || ""}
                    onChange={(e) => set({ dateEnd: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className={label}>Sort order</label>
              <input
                className={input}
                type="number"
                value={draft.sortOrder}
                onChange={(e) => set({ sortOrder: Number(e.target.value) })}
              />
            </div>
            <div className="sm:col-span-2 flex items-end">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) => set({ active: e.target.checked })}
                />
                Active (live on site)
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={save}
              disabled={saving}
              className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-sm px-6 py-2.5 rounded-full"
            >
              {saving ? "Saving…" : editing ? "Update offer" : "Add offer"}
            </button>
            {editing && (
              <button
                onClick={resetDraft}
                className="border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 font-semibold text-sm px-6 py-2.5 rounded-full"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <p className="text-white/45">Loading…</p>
        ) : offers.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center">
            <p className="text-white/45 mb-4">
              No offers yet. The site is showing the 6 built-in starter offers
              until you add your own.
            </p>
            <button
              onClick={seedDefaults}
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-6 py-2.5 rounded-full"
            >
              Add the 6 starter offers
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((o) => (
              <div
                key={o.id}
                className="bg-[#0b1020] rounded-xl border border-white/10 hover:border-sky-400/40 transition-colors p-4 flex items-start gap-4"
              >
                <div className="text-2xl">{o.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold">{o.title}</span>
                    {o.badge && (
                      <span className="text-[10px] font-bold uppercase bg-sky-500/15 text-sky-300 border border-sky-400/25 rounded-full px-2 py-0.5">
                        {o.badge}
                      </span>
                    )}
                    {!o.active && (
                      <span className="text-[10px] font-bold uppercase bg-white/10 text-white/55 rounded-full px-2 py-0.5">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-white/55 text-sm mt-0.5">{o.description}</p>
                  <p className="text-white/40 text-xs mt-1">
                    {o.cruiseLine || "All lines"}
                    {o.nights ? ` · ${o.nights} nights` : ""}
                    {o.dateStart || o.dateEnd
                      ? ` · ${o.dateStart || "…"} to ${o.dateEnd || "…"}`
                      : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => toggle(o)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      o.active
                        ? "bg-green-500/15 text-green-300 border border-green-400/25 hover:bg-green-500/25"
                        : "bg-white/5 text-white/55 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {o.active ? "Live" : "Off"}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => edit(o)}
                      className="text-xs font-bold text-sky-400 hover:text-sky-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(o.id)}
                      className="text-xs font-bold text-red-300 hover:text-red-200"
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
