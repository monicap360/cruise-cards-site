"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Photo from "@/components/Photo";
import { getSailingBlocks, type SailingBlock } from "@/lib/room-blocks";
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

function FindInner() {
  const [blocks, setBlocks] = useState<SailingBlock[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [ship, setShip] = useState("");
  const [line, setLine] = useState("");
  const [port, setPort] = useState("");
  const [month, setMonth] = useState("");
  const [nights, setNights] = useState("");

  // React to ?q= and ?ship= so searches/links always update results.
  const searchParams = useSearchParams();
  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
    setShip(searchParams.get("ship") ?? "");
  }, [searchParams]);

  useEffect(() => {
    getSailingBlocks().then((b) => {
      setBlocks(b);
      setLoading(false);
    });
  }, []);

  const shipsList = useMemo(
    () => Array.from(new Set(blocks.map((b) => b.ship))).sort(),
    [blocks]
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
    return blocks
      .filter((b) => {
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
      })
      .sort((a, b) => a.sailingDate.localeCompare(b.sailingDate));
  }, [blocks, q, ship, line, port, month, nights]);

  const contentResults = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return ql
      ? SEARCH_CONTENT.filter((i) => i.keywords.includes(ql))
      : SEARCH_CONTENT;
  }, [q]);

  const hasFilters = q || ship || line || port || month || nights;
  const selectCls =
    "bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400/60";

  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero banner + search */}
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
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-7">
            Search Every <span className="text-holo">Galveston</span> Sailing
          </h1>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ship, destination, or cruise line…"
            className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-white text-lg placeholder-white/40 focus:outline-none focus:border-sky-400/60 mb-4"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <select className={selectCls} value={ship} onChange={(e) => setShip(e.target.value)}>
              <option value="" className="bg-[#0b1020]">Any ship</option>
              {shipsList.map((s) => (
                <option key={s} value={s} className="bg-[#0b1020]">{s}</option>
              ))}
            </select>
            <select className={selectCls} value={line} onChange={(e) => setLine(e.target.value)}>
              <option value="" className="bg-[#0b1020]">Any cruise line</option>
              {lines.map((l) => (
                <option key={l} value={l} className="bg-[#0b1020]">{l}</option>
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
                <option key={n} value={n} className="bg-[#0b1020]">{n} nights</option>
              ))}
            </select>
          </div>
          {hasFilters && (
            <button
              onClick={() => {
                setQ("");
                setShip("");
                setLine("");
                setPort("");
                setMonth("");
                setNights("");
              }}
              className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white transition-colors mt-4"
            >
              Clear all filters
            </button>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <p className="text-white/45 label-mono text-sm uppercase">Searching…</p>
        ) : (
          <>
            {results.length > 0 && (
              <div className="mb-14">
                <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">
                  {`// ${results.length} Sailing${
                    results.length === 1 ? "" : "s"
                  } Found`}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {results.map((b) => {
                    const prices = b.cabins
                      .map((c) => c.price)
                      .filter((p) => p > 0);
                    const from = prices.length ? Math.min(...prices) : 0;
                    return (
                      <Link
                        key={b.id}
                        href={`/sailings/${b.id}`}
                        className="group bg-[#0b1020] border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="label-mono text-[10px] uppercase text-sky-400/70 mb-1">
                              {b.cruiseLine}
                            </div>
                            <div className="text-xl font-extrabold uppercase tracking-[-0.01em] text-white">
                              {b.ship}
                            </div>
                            <div className="text-white/55 text-sm mt-1">
                              {fmtDate(b.sailingDate)} · {b.nights}{" "}
                              {durationWord(b.cruiseLine)}
                            </div>
                            <p className="text-white/45 text-sm mt-1">
                              <span className="text-sky-400/80">Galveston</span> →{" "}
                              {b.itinerary} →{" "}
                              <span className="text-sky-400/80">Galveston</span>
                            </p>
                          </div>
                          {from > 0 && (
                            <div className="text-right flex-shrink-0">
                              <span className="text-white/40 label-mono text-[10px] uppercase">
                                From
                              </span>
                              <div className="text-white font-bold text-xl">
                                {fmt$(from)}
                              </div>
                              <div className="text-white/40 text-[10px] leading-tight">
                                / person · dbl occ
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {contentResults.length > 0 && (
              <div>
                <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">
                  {"// Cruises, Ships & Destinations"}
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

            {results.length === 0 && contentResults.length === 0 && (
              <div className="text-center py-12 max-w-xl mx-auto">
                <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-3">
                  No matches
                </h2>
                <p className="text-white/55 mb-7">
                  Try fewer words — or tell us what you want and we&apos;ll find it.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
                >
                  Ask a Specialist
                </Link>
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
