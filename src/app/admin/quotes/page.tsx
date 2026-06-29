"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fmt$ } from "@/lib/sea-pay";
import {
  type Quote,
  type QuoteLine,
  type QuoteCabin,
  type QuoteDay,
  blankQuote,
  newCabinId,
  getAllQuotes,
  saveQuote,
  deleteQuote,
  quoteTotal,
} from "@/lib/quotes";
import { type SailingBlock, getSailingBlocks, groupByType } from "@/lib/room-blocks";
import { destinationFor, portsFromItinerary } from "@/lib/destinations";

const DEST_SLUGS = [
  "cozumel",
  "costa-maya",
  "progreso",
  "roatan",
  "belize",
  "grand-cayman",
  "nassau",
  "key-west",
  "san-juan",
  "st-thomas",
  "cococay",
  "celebration-key",
  "half-moon-cay",
  "ocean-cay",
  "castaway-cay",
  "harvest-caye",
  "great-stirrup-cay",
];

const INPUT =
  "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
const FIELD_LABEL =
  "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

export default function AdminQuotesPage() {
  const [q, setQ] = useState<Quote>(blankQuote());
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [savedId, setSavedId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [sailings, setSailings] = useState<SailingBlock[]>([]);
  const [sailingPick, setSailingPick] = useState("");

  function refresh() {
    getAllQuotes().then(setQuotes);
  }

  useEffect(() => {
    refresh();
    getSailingBlocks().then((s) =>
      setSailings([...s].sort((a, b) => a.sailingDate.localeCompare(b.sailingDate)))
    );
  }, []);

  // Prefill the quote from a live sailing: fills ship/line/date/itinerary +
  // builds cabin options (from $/pp per category) straight from inventory.
  function loadFromSailing(block: SailingBlock) {
    const dest = destinationFor(portsFromItinerary(block.itinerary)[0] ?? "");
    const byType = groupByType(block.cabins);
    const cabinOptions: QuoteCabin[] = Object.entries(byType)
      .map(([type, cabins]) => {
        const avail = cabins.filter((c) => c.status === "available");
        const pool = avail.length ? avail : cabins;
        const min = Math.min(...pool.map((c) => c.price));
        return {
          id: newCabinId(),
          category: type,
          perPerson: Number.isFinite(min) ? min : 0,
          perks: "",
          recommended: type === "Balcony",
        };
      })
      .sort((a, b) => a.perPerson - b.perPerson);
    setQ((prev) => ({
      ...prev,
      ship: block.ship,
      cruiseLine: block.cruiseLine,
      sailDate: block.sailingDate,
      nights: block.nights,
      itinerary: block.itinerary,
      destSlug: dest?.slug || prev.destSlug,
      cabinOptions,
    }));
  }

  const total = quoteTotal(q);

  function update<K extends keyof Quote>(key: K, value: Quote[K]) {
    setQ((prev) => ({ ...prev, [key]: value }));
  }

  function updateLine(i: number, patch: Partial<QuoteLine>) {
    setQ((prev) => ({
      ...prev,
      lines: prev.lines.map((l, idx) => (idx === i ? { ...l, ...patch } : l)),
    }));
  }

  function addLine() {
    setQ((prev) => ({ ...prev, lines: [...prev.lines, { label: "", amount: 0 }] }));
  }

  function removeLine(i: number) {
    setQ((prev) => ({ ...prev, lines: prev.lines.filter((_, idx) => idx !== i) }));
  }

  // ── Cabin options ──
  function updateCabin(i: number, patch: Partial<QuoteCabin>) {
    setQ((prev) => ({
      ...prev,
      cabinOptions: prev.cabinOptions.map((c, idx) =>
        idx === i ? { ...c, ...patch } : c,
      ),
    }));
  }

  function setRecommended(i: number) {
    setQ((prev) => ({
      ...prev,
      cabinOptions: prev.cabinOptions.map((c, idx) => ({
        ...c,
        recommended: idx === i,
      })),
    }));
  }

  function addCabin() {
    setQ((prev) => ({
      ...prev,
      cabinOptions: [
        ...prev.cabinOptions,
        {
          id: newCabinId(),
          category: "",
          perPerson: 0,
          perks: "",
          recommended: prev.cabinOptions.length === 0,
        },
      ],
    }));
  }

  function removeCabin(i: number) {
    setQ((prev) => ({
      ...prev,
      cabinOptions: prev.cabinOptions.filter((_, idx) => idx !== i),
    }));
  }

  // ── Itinerary days ──
  function updateDay(i: number, patch: Partial<QuoteDay>) {
    setQ((prev) => ({
      ...prev,
      days: prev.days.map((d, idx) => (idx === i ? { ...d, ...patch } : d)),
    }));
  }

  function addDay() {
    setQ((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        { day: `Day ${prev.days.length + 1}`, port: "", note: "" },
      ],
    }));
  }

  function removeDay(i: number) {
    setQ((prev) => ({ ...prev, days: prev.days.filter((_, idx) => idx !== i) }));
  }

  // ── Includes / Excludes (textarea, one item per line) ──
  function listToText(items: string[]): string {
    return items.join("\n");
  }

  function textToList(text: string): string[] {
    return text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function handleSave() {
    const ok = await saveQuote(q);
    if (ok) {
      setSavedId(q.id);
      setCopied(false);
      refresh();
    }
  }

  function newDoc() {
    setQ(blankQuote());
    setSavedId("");
    setCopied(false);
  }

  async function handleDelete(id: string) {
    await deleteQuote(id);
    if (savedId === id) setSavedId("");
    refresh();
  }

  const shareUrl =
    savedId && typeof window !== "undefined"
      ? `${window.location.origin}/quote/${savedId}`
      : savedId
        ? `/quote/${savedId}`
        : "";

  function copyLink() {
    if (!shareUrl) return;
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
  }

  const typeBadge: Record<string, string> = {
    quote: "bg-sky-500/15 text-sky-300 border border-sky-400/25",
    invoice: "bg-green-500/15 text-green-300 border border-green-400/25",
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1">
                {"// Quotes & Invoices"}
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
                Quote &amp; Invoice Builder
              </h1>
            </div>
            <Link
              href="/admin"
              className="text-sky-400 hover:text-sky-300 font-semibold text-sm self-center"
            >
              ← Admin
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Builder */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Type toggle */}
            <div className="flex gap-2">
              {(["quote", "invoice"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update("type", t)}
                  className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                    q.type === t
                      ? "bg-white text-black"
                      : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={newDoc}
              className="text-sky-400 hover:text-sky-300 font-semibold text-sm"
            >
              + New document
            </button>
          </div>

          {/* Client */}
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">
              {"// Client"}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={FIELD_LABEL}>Client name</label>
                <input
                  className={INPUT}
                  value={q.clientName}
                  onChange={(e) => update("clientName", e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className={FIELD_LABEL}>Email</label>
                <input
                  className={INPUT}
                  value={q.clientEmail}
                  onChange={(e) => update("clientEmail", e.target.value)}
                  placeholder="jane@email.com"
                />
              </div>
              <div>
                <label className={FIELD_LABEL}>Phone</label>
                <input
                  className={INPUT}
                  value={q.clientPhone}
                  onChange={(e) => update("clientPhone", e.target.value)}
                  placeholder="(409) 555-0100"
                />
              </div>
            </div>
          </div>

          {/* Sailing */}
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">
              {"// Sailing"}
            </div>
            <div className="mb-4 bg-sky-500/[0.07] border border-sky-400/25 rounded-xl p-4">
              <label className={FIELD_LABEL}>⚡ Prefill from a live sailing (ship + sail date)</label>
              <select
                className={INPUT}
                value={sailingPick}
                onChange={(e) => {
                  setSailingPick(e.target.value);
                  const b = sailings.find((s) => s.id === e.target.value);
                  if (b) loadFromSailing(b);
                }}
              >
                <option value="" className="bg-[#0b1020]">— pick a ship &amp; sail date —</option>
                {sailings.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#0b1020]">
                    {s.ship} · {s.sailingDate} · {s.nights}n
                  </option>
                ))}
              </select>
              <p className="text-white/40 text-[11px] mt-1">
                Fills the cabin options &amp; pricing from live inventory — same ship/date for every customer you quote.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={FIELD_LABEL}>Cruise line</label>
                <input
                  className={INPUT}
                  value={q.cruiseLine}
                  onChange={(e) => update("cruiseLine", e.target.value)}
                  placeholder="Carnival Cruise Line"
                />
              </div>
              <div>
                <label className={FIELD_LABEL}>Ship</label>
                <input
                  className={INPUT}
                  value={q.ship}
                  onChange={(e) => update("ship", e.target.value)}
                  placeholder="Carnival Jubilee"
                />
              </div>
              <div>
                <label className={FIELD_LABEL}>Sail date</label>
                <input
                  type="date"
                  className={INPUT}
                  value={q.sailDate}
                  onChange={(e) => update("sailDate", e.target.value)}
                />
              </div>
              <div>
                <label className={FIELD_LABEL}>Nights</label>
                <input
                  type="number"
                  className={INPUT}
                  value={q.nights || ""}
                  onChange={(e) => update("nights", Number(e.target.value))}
                  placeholder="7"
                />
              </div>
              <div>
                <label className={FIELD_LABEL}>Itinerary</label>
                <input
                  className={INPUT}
                  value={q.itinerary}
                  onChange={(e) => update("itinerary", e.target.value)}
                  placeholder="Western Caribbean"
                />
              </div>
              <div>
                <label className={FIELD_LABEL}>Destination (hero photo)</label>
                <select
                  className={INPUT}
                  value={q.destSlug}
                  onChange={(e) => update("destSlug", e.target.value)}
                >
                  {DEST_SLUGS.map((d) => (
                    <option key={d} value={d} className="bg-[#0b1020]">
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">
              {"// Line items"}
            </div>
            <div className="space-y-3">
              {q.lines.map((line, i) => (
                <div key={i} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className={FIELD_LABEL}>Description</label>
                    <input
                      className={INPUT}
                      value={line.label}
                      onChange={(e) => updateLine(i, { label: e.target.value })}
                      placeholder="Balcony stateroom — 2 guests"
                    />
                  </div>
                  <div className="w-40">
                    <label className={FIELD_LABEL}>Amount</label>
                    <input
                      type="number"
                      className={INPUT}
                      value={line.amount || ""}
                      onChange={(e) =>
                        updateLine(i, { amount: Number(e.target.value) })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <button
                    onClick={() => removeLine(i)}
                    className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-red-300 hover:border-red-400/30 text-sm"
                    aria-label="Remove line"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={addLine}
                className="text-sky-400 hover:text-sky-300 font-semibold text-sm"
              >
                + Add line
              </button>
              <div className="text-right">
                <span className="text-white/45 label-mono text-[10px] uppercase tracking-wider mr-2">
                  Total
                </span>
                <span className="text-2xl font-extrabold text-holo">
                  {fmt$(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Cabin options */}
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1">
              {"// Cabin options the client can choose"}
            </div>
            <p className="text-white/40 text-xs mb-3">
              The headline feature — give the client side-by-side staterooms to
              compare. Per-person pricing.
            </p>
            <div className="space-y-3">
              {q.cabinOptions.map((cab, i) => (
                <div
                  key={cab.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-white/5 border border-white/10 rounded-xl p-3"
                >
                  <div className="md:col-span-3">
                    <label className={FIELD_LABEL}>Category</label>
                    <input
                      className={INPUT}
                      value={cab.category}
                      onChange={(e) =>
                        updateCabin(i, { category: e.target.value })
                      }
                      placeholder="Balcony"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={FIELD_LABEL}>Per person</label>
                    <input
                      type="number"
                      className={INPUT}
                      value={cab.perPerson || ""}
                      onChange={(e) =>
                        updateCabin(i, { perPerson: Number(e.target.value) })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className={FIELD_LABEL}>Perks</label>
                    <input
                      className={INPUT}
                      value={cab.perks}
                      onChange={(e) => updateCabin(i, { perks: e.target.value })}
                      placeholder="Priority boarding, drinks pkg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={FIELD_LABEL}>Recommended</label>
                    <label className="flex items-center gap-2 h-[42px] px-3 rounded-xl bg-white/5 border border-white/15 cursor-pointer">
                      <input
                        type="radio"
                        name="recommended-cabin"
                        checked={cab.recommended}
                        onChange={() => setRecommended(i)}
                        className="accent-sky-400"
                      />
                      <span className="text-xs text-white/70">Pick</span>
                    </label>
                  </div>
                  <div className="md:col-span-1">
                    <button
                      onClick={() => removeCabin(i)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-red-300 hover:border-red-400/30 text-sm"
                      aria-label="Remove cabin"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addCabin}
              className="mt-3 text-sky-400 hover:text-sky-300 font-semibold text-sm"
            >
              + Add cabin option
            </button>
          </div>

          {/* Itinerary (day by day) */}
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">
              {"// Itinerary (day by day)"}
            </div>
            <div className="space-y-3">
              {q.days.map((d, i) => (
                <div key={i} className="flex gap-3 items-end">
                  <div className="w-28">
                    <label className={FIELD_LABEL}>Day</label>
                    <input
                      className={INPUT}
                      value={d.day}
                      onChange={(e) => updateDay(i, { day: e.target.value })}
                      placeholder="Day 1"
                    />
                  </div>
                  <div className="w-56">
                    <label className={FIELD_LABEL}>Port</label>
                    <input
                      className={INPUT}
                      value={d.port}
                      onChange={(e) => updateDay(i, { port: e.target.value })}
                      placeholder="Galveston, TX"
                    />
                  </div>
                  <div className="flex-1">
                    <label className={FIELD_LABEL}>Note</label>
                    <input
                      className={INPUT}
                      value={d.note}
                      onChange={(e) => updateDay(i, { note: e.target.value })}
                      placeholder="Embarkation · sail away 4:00 PM"
                    />
                  </div>
                  <button
                    onClick={() => removeDay(i)}
                    className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-red-300 hover:border-red-400/30 text-sm"
                    aria-label="Remove day"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addDay}
              className="mt-3 text-sky-400 hover:text-sky-300 font-semibold text-sm"
            >
              + Add day
            </button>
          </div>

          {/* Includes / Excludes */}
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">
              {"// What's included / Not included"}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={FIELD_LABEL}>
                  What&apos;s included (one per line)
                </label>
                <textarea
                  className={`${INPUT} min-h-32`}
                  value={listToText(q.includes)}
                  onChange={(e) =>
                    update("includes", textToList(e.target.value))
                  }
                  placeholder={"Stateroom\nAll meals in main dining\nOnboard entertainment"}
                />
              </div>
              <div>
                <label className={FIELD_LABEL}>Not included (one per line)</label>
                <textarea
                  className={`${INPUT} min-h-32`}
                  value={listToText(q.excludes)}
                  onChange={(e) =>
                    update("excludes", textToList(e.target.value))
                  }
                  placeholder={"Gratuities\nShore excursions\nTravel protection"}
                />
              </div>
            </div>
          </div>

          {/* Deposit / Expires / Agent / Notes */}
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">
              {"// Details"}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={FIELD_LABEL}>Deposit</label>
                <input
                  type="number"
                  className={INPUT}
                  value={q.deposit || ""}
                  onChange={(e) => update("deposit", Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              {q.type === "quote" && (
                <div>
                  <label className={FIELD_LABEL}>Expires on</label>
                  <input
                    type="date"
                    className={INPUT}
                    value={q.expiresOn}
                    onChange={(e) => update("expiresOn", e.target.value)}
                  />
                </div>
              )}
              <div>
                <label className={FIELD_LABEL}>Agent name</label>
                <input
                  className={INPUT}
                  value={q.agentName}
                  onChange={(e) => update("agentName", e.target.value)}
                  placeholder="Monica"
                />
              </div>
              <div>
                <label className={FIELD_LABEL}>Status</label>
                <select
                  className={INPUT}
                  value={q.status}
                  onChange={(e) =>
                    update("status", e.target.value as Quote["status"])
                  }
                >
                  {(["draft", "sent", "accepted", "paid"] as const).map((s) => (
                    <option key={s} value={s} className="bg-[#0b1020]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className={FIELD_LABEL}>Notes</label>
              <textarea
                className={`${INPUT} min-h-24`}
                value={q.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Anything the client should know…"
              />
            </div>
          </div>

          {/* Save */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleSave}
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full"
            >
              Save &amp; get link
            </button>

            {savedId && (
              <div className="flex flex-wrap items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                <code className="text-sm text-sky-300 break-all">{shareUrl}</code>
                <button
                  onClick={copyLink}
                  className="text-sky-400 hover:text-sky-300 font-semibold text-sm"
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
                <Link
                  href={`/quote/${savedId}`}
                  target="_blank"
                  className="text-sky-400 hover:text-sky-300 font-semibold text-sm"
                >
                  Open ↗
                </Link>
                <a
                  href={`mailto:${encodeURIComponent(q.clientEmail)}?subject=${encodeURIComponent(
                    `Your ${q.ship || "cruise"} quote — Cruises from Galveston`
                  )}&body=${encodeURIComponent(
                    `Hi ${q.clientName || "there"},\n\n` +
                      `Here's your personalized quote for ${q.ship || "your cruise"}` +
                      `${q.sailDate ? ` sailing ${q.sailDate}` : ""}:\n${shareUrl}\n\n` +
                      `It has your cabin options and pricing. Reply here or call (409) 632-2106 to lock it in — no card is charged online.\n\n` +
                      `Cruises from Galveston · Cruise Experience Center · (409) 632-2106`
                  )}`}
                  className="bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm px-4 py-1.5 rounded-full"
                >
                  📧 Email to customer
                </a>
              </div>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-4">
            {"// Saved quotes & invoices"}
          </div>
          {quotes.length === 0 ? (
            <p className="text-white/45 text-sm">Nothing saved yet.</p>
          ) : (
            <div className="space-y-3">
              {quotes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between flex-wrap gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${typeBadge[item.type]}`}
                    >
                      {item.type}
                    </span>
                    <span className="font-extrabold text-white">
                      {item.clientName || "—"}
                    </span>
                    <span className="text-white/55 text-sm">{item.ship}</span>
                    <span className="text-white/35 text-xs capitalize">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-extrabold text-holo">
                      {fmt$(quoteTotal(item))}
                    </span>
                    <Link
                      href={`/quote/${item.id}`}
                      target="_blank"
                      className="text-sky-400 hover:text-sky-300 font-semibold text-sm"
                    >
                      Open ↗
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-white/40 hover:text-red-300 font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
