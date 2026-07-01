"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Photo from "@/components/Photo";
import CruiseLineLogo from "@/components/CruiseLineLogo";
import { type SailingBlock } from "@/lib/room-blocks";
import { destinationWithPhoto } from "@/lib/destinations";
import { fmt$, fmtDate, durationWord } from "@/lib/sea-pay";
import { SEARCH_CONTENT } from "@/lib/search-content";

function monthLabel(ym: string): string {
  const d = new Date(ym + "-01T12:00:00");
  if (Number.isNaN(d.getTime())) return ym;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

const TYPE_ICON: Record<string, string> = {
  Ship: "🚢",
  Destination: "🏝️",
  Page: "⚓",
};

const SORTS = [
  { key: "soonest", label: "Soonest" },
  { key: "price", label: "Price: low to high" },
  { key: "length", label: "Length" },
];

const PAGE_SIZE = 24;

function priceOf(b: SailingBlock): number {
  const p = b.cabins.map((c) => c.price).filter((n) => n > 0);
  return p.length ? Math.min(...p) : Infinity;
}

function FindInner() {
  const [blocks, setBlocks] = useState<SailingBlock[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [ship, setShip] = useState("");
  const [line, setLine] = useState("");
  const [port, setPort] = useState("");
  const [month, setMonth] = useState("");
  const [nights, setNights] = useState("");
  const [sort, setSort] = useState("soonest");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const searchParams = useSearchParams();
  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
    setShip(searchParams.get("ship") ?? "");
    setLine(searchParams.get("line") ?? "");
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/sailings")
      .then((r) => r.json())
      .then((b: SailingBlock[]) => {
        setBlocks(Array.isArray(b) ? b : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // reset visible count whenever the query/filters change
  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [q, ship, line, port, month, nights, sort]);

  // If a cruise line is chosen and the selected ship isn't part of that line,
  // drop the stale ship so the two filters never contradict each other.
  useEffect(() => {
    if (line && ship && !blocks.some((b) => b.cruiseLine === line && b.ship === ship)) {
      setShip("");
    }
  }, [line, ship, blocks]);

  // Ship list narrows to the selected cruise line — so clicking a line only
  // pulls up that line's ships (not every ship at the port).
  const shipsList = useMemo(
    () =>
      Array.from(
        new Set(
          blocks
            .filter((b) => !line || b.cruiseLine === line)
            .map((b) => b.ship)
        )
      ).sort(),
    [blocks, line]
  );
  const lines = useMemo(
    () => Array.from(new Set(blocks.map((b) => b.cruiseLine))).sort(),
    [blocks]
  );
  const ports = useMemo(() => {
    const set = new Set<string>();
    blocks.forEach((b) =>
      b.itinerary.split(/[·,&]/).forEach((p) => {
        const t = p.trim();
        if (t) set.add(t);
      })
    );
    return Array.from(set).sort();
  }, [blocks]);
  const months = useMemo(
    () => Array.from(new Set(blocks.map((b) => b.sailingDate.slice(0, 7)))).sort(),
    [blocks]
  );
  const nightOptions = useMemo(
    () => Array.from(new Set(blocks.map((b) => b.nights))).sort((a, b) => a - b),
    [blocks]
  );

  const results = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const filtered = blocks.filter((b) => {
      if (ship && b.ship !== ship) return false;
      if (line && b.cruiseLine !== line) return false;
      if (port && !b.itinerary.toLowerCase().includes(port.toLowerCase()))
        return false;
      if (month && !b.sailingDate.startsWith(month)) return false;
      if (nights && b.nights !== parseInt(nights)) return false;
      if (ql) {
        const hay = `${b.ship} ${b.cruiseLine} ${b.itinerary}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
    filtered.sort((a, b) => {
      if (sort === "price") return priceOf(a) - priceOf(b);
      if (sort === "length")
        return a.nights - b.nights || a.sailingDate.localeCompare(b.sailingDate);
      return a.sailingDate.localeCompare(b.sailingDate);
    });
    return filtered;
  }, [blocks, q, ship, line, port, month, nights, sort]);

  const contentResults = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return ql ? SEARCH_CONTENT.filter((i) => i.keywords.includes(ql)) : [];
  }, [q]);

  const activePills = [
    q && { label: `“${q}”`, clear: () => setQ("") },
    ship && { label: ship, clear: () => setShip("") },
    line && { label: line, clear: () => setLine("") },
    port && { label: port, clear: () => setPort("") },
    month && { label: monthLabel(month), clear: () => setMonth("") },
    nights && { label: `${nights} nights`, clear: () => setNights("") },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const clearAll = () => {
    setQ("");
    setShip("");
    setLine("");
    setPort("");
    setMonth("");
    setNights("");
  };

  const selectCls =
    "bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400/60";

  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* ── Hero banner + search ── */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ships/carnival-breeze.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/85 to-[#05070d]/55" />
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">
            {"// Find a Cruise"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-3">
            Search Every <span className="text-holo">Galveston</span> Sailing
          </h1>
          <p className="text-white/55 text-base sm:text-lg max-w-2xl mb-7">
            Every cruise below is a round-trip, closed-loop sailing from the Port
            of Galveston. Pricing is per person, double occupancy —{" "}
            <span className="text-white/80 font-semibold">
              government taxes, port expenses &amp; fees included
            </span>
            .
          </p>

          <div className="relative mb-4">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 text-lg">
              ⌕
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ship, destination, or cruise line…"
              className="w-full bg-white/5 border border-white/15 rounded-2xl pl-12 pr-5 py-4 text-white text-lg placeholder-white/40 focus:outline-none focus:border-sky-400/60"
            />
          </div>

          {/* Cruise-line quick chips */}
          {lines.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {lines.map((l) => {
                const active = line === l;
                return (
                  <button
                    key={l}
                    onClick={() => setLine(active ? "" : l)}
                    className={`flex items-center gap-2 rounded-full border px-3.5 py-2 transition-colors ${
                      active
                        ? "bg-white border-white"
                        : "bg-white/5 border-white/15 hover:border-white/40"
                    }`}
                  >
                    {active ? (
                      <span className="label-mono text-[10px] uppercase tracking-wider text-black">
                        {l}
                      </span>
                    ) : (
                      <CruiseLineLogo line={l} className="h-3.5 max-w-[110px]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <select className={selectCls} value={ship} onChange={(e) => setShip(e.target.value)}>
              <option value="" className="bg-[#0b1020]">Any ship</option>
              {shipsList.map((s) => (
                <option key={s} value={s} className="bg-[#0b1020]">{s}</option>
              ))}
            </select>
            <select className={selectCls} value={port} onChange={(e) => setPort(e.target.value)}>
              <option value="" className="bg-[#0b1020]">Any destination</option>
              {ports.map((p) => (
                <option key={p} value={p} className="bg-[#0b1020]">{p}</option>
              ))}
            </select>
            <select className={selectCls} value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="" className="bg-[#0b1020]">Any month</option>
              {months.map((m) => (
                <option key={m} value={m} className="bg-[#0b1020]">{monthLabel(m)}</option>
              ))}
            </select>
            <select className={selectCls} value={nights} onChange={(e) => setNights(e.target.value)}>
              <option value="" className="bg-[#0b1020]">Any length</option>
              {nightOptions.map((n) => (
                <option key={n} value={n} className="bg-[#0b1020]">
                  {n} nights / {n} days
                </option>
              ))}
            </select>
            <select className={selectCls} value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => (
                <option key={s.key} value={s.key} className="bg-[#0b1020]">
                  Sort: {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active filter pills */}
          {activePills.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {activePills.map((p) => (
                <button
                  key={p.label}
                  onClick={p.clear}
                  className="group flex items-center gap-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 px-3 py-1.5 text-xs text-white hover:bg-sky-500/25 transition-colors"
                >
                  {p.label}
                  <span className="text-white/50 group-hover:text-white">×</span>
                </button>
              ))}
              <button
                onClick={clearAll}
                className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white transition-colors ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Results ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <p className="text-white/45 label-mono text-sm uppercase">Searching…</p>
        ) : (
          <>
            <div className="flex items-end justify-between gap-3 mb-6">
              <div className="label-mono text-[11px] uppercase text-sky-400/80">
                {`// ${results.length} Sailing${
                  results.length === 1 ? "" : "s"
                } Found`}
              </div>
            </div>

            {results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {results.slice(0, limit).map((b) => {
                    const from = priceOf(b);
                    const available = b.cabins.filter(
                      (c) => c.status === "available"
                    ).length;
                    const dest = destinationWithPhoto(b.itinerary);
                    const rooms = Array.from(new Set(b.cabins.map((c) => c.type)))
                      .map((type) => {
                        const ps = b.cabins
                          .filter((c) => c.type === type && c.price > 0)
                          .map((c) => c.price);
                        return { type, from: ps.length ? Math.min(...ps) : 0 };
                      })
                      .filter((r) => r.from > 0)
                      .sort((a, c) => a.from - c.from);
                    return (
                      <Link
                        key={b.id}
                        href={`/sailings/${b.id}`}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-sky-400/40 transition-colors flex flex-col sm:flex-row"
                      >
                        {/* Destination photo */}
                        <div className="relative sm:w-52 h-40 sm:h-auto flex-shrink-0">
                          <Photo
                            src={`/destinations/${dest.slug}.jpg`}
                            alt={dest.name}
                            gradient={dest.gradient}
                            overlay={false}
                            className="absolute inset-0"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/80 via-[#05070d]/10 to-transparent" />
                          <span className="absolute top-3 left-3 hud label-mono text-[10px] uppercase tracking-wider text-white px-2.5 py-1 rounded-full">
                            {b.nights} {durationWord(b.cruiseLine)}
                          </span>
                          <span className="absolute bottom-2.5 left-3 right-3 text-white text-sm font-extrabold uppercase tracking-tight leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                            {dest.name}
                          </span>
                        </div>
                        {/* Details */}
                        <div className="flex-1 p-5 flex flex-col">
                          <CruiseLineLogo
                            line={b.cruiseLine}
                            className="h-4 max-w-[130px] mb-1.5"
                          />
                          <div className="text-xl font-extrabold uppercase tracking-[-0.01em] text-white leading-tight">
                            {b.ship}
                          </div>
                          <div className="text-white/55 text-sm mt-1">
                            {fmtDate(b.sailingDate)} → returns{" "}
                            {fmtDate(b.returnDate)}
                          </div>
                          <p className="text-white/45 text-sm mt-1 flex-1">
                            <span className="text-sky-400/80">Galveston</span> →{" "}
                            {b.itinerary} →{" "}
                            <span className="text-sky-400/80">Galveston</span>
                          </p>
                          {rooms.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {rooms.map((r) => (
                                <span
                                  key={r.type}
                                  className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-white/70"
                                >
                                  {r.type}{" "}
                                  <span className="text-holo font-bold">{fmt$(r.from)}</span>
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-end justify-between border-t border-white/10 pt-3 mt-3">
                            <div>
                              {from < Infinity && (
                                <>
                                  <span className="text-white/40 label-mono text-[10px] uppercase">
                                    From
                                  </span>
                                  <div className="text-holo font-extrabold text-2xl leading-none">
                                    {fmt$(from)}
                                    <span className="text-white/40 text-xs font-normal">
                                      {" "}
                                      / person
                                    </span>
                                  </div>
                                </>
                              )}
                              <div className="text-green-300/90 text-[10px] mt-1 font-semibold">
                                ✓ Taxes, port fees &amp; gov fees included
                              </div>
                              <div className="text-white/35 text-[10px] mt-0.5">
                                dbl occ · {available} cabins open
                              </div>
                            </div>
                            <span className="bg-white text-black group-hover:bg-white/90 font-semibold uppercase tracking-wider text-[11px] px-5 py-2.5 rounded-full transition-all">
                              See options →
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {results.length > limit && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setLimit((n) => n + PAGE_SIZE)}
                      className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-xs px-8 py-3.5 rounded-full transition-all"
                    >
                      Show more ({results.length - limit} more)
                    </button>
                  </div>
                )}
              </>
            ) : contentResults.length > 0 ? (
              <p className="text-white/55 text-lg max-w-2xl">
                No live sailings are loaded for{" "}
                <span className="text-white font-semibold">“{q}”</span> right now —
                here&apos;s the ship &amp; pages we found below. Tell us your dates
                and we&apos;ll pull live inventory for you.
              </p>
            ) : (
              <div className="text-center py-12 max-w-xl mx-auto">
                <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-3">
                  No sailings match
                </h2>
                <p className="text-white/55 mb-7">
                  Try fewer filters — or tell us what you want and we&apos;ll find
                  it from our full Galveston inventory.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={clearAll}
                    className="border border-white/25 hover:border-white/70 text-white font-semibold uppercase tracking-wider text-sm px-6 py-3.5 rounded-full transition-all"
                  >
                    Clear filters
                  </button>
                  <Link
                    href="/contact"
                    className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-6 py-3.5 rounded-full transition-all"
                  >
                    Ask a Specialist
                  </Link>
                </div>
              </div>
            )}

            {/* Contextual content matches (only when searching text) */}
            {contentResults.length > 0 && (
              <div className="mt-16">
                <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">
                  {"// Ships, Destinations & Pages"}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentResults.map((i) => (
                    <Link
                      key={i.type + i.title}
                      href={i.href}
                      className="group bg-[#0b1020] border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-colors flex items-stretch"
                    >
                      <div className="w-28 sm:w-32 flex-shrink-0 relative min-h-[6rem]">
                        {i.image ? (
                          <Photo
                            src={i.image}
                            alt={i.title}
                            overlay={false}
                            className="absolute inset-0"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-sky-600/30 to-[#0a1f44] flex items-center justify-center text-2xl">
                            {TYPE_ICON[i.type] ?? "⚓"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 p-5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="label-mono text-[10px] uppercase text-sky-400/70 mb-1">
                            {i.type}
                          </div>
                          <div className="font-bold text-white uppercase tracking-tight truncate">
                            {i.title}
                          </div>
                          <div className="text-white/50 text-sm line-clamp-2">
                            {i.subtitle}
                          </div>
                        </div>
                        <span className="text-white/30 group-hover:text-sky-400 transition-colors text-lg flex-shrink-0">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default function FindPage() {
  return (
    <Suspense fallback={null}>
      <FindInner />
    </Suspense>
  );
}
