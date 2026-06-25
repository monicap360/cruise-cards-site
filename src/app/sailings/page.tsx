import Link from "next/link";
import ShipImage from "@/components/ShipImage";
import CruiseLineLogo from "@/components/CruiseLineLogo";
import { getSailingBlocks } from "@/lib/room-blocks";
import { fmt$, fmtDate, durationWord } from "@/lib/sea-pay";

export const dynamic = "force-dynamic";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const metadata = {
  title: "Choose Your Sail Date",
  description:
    "Pick your sail date from Galveston and see your cabin options — interior, ocean view, balcony, and suites.",
};

export default async function SailingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    ship?: string;
    line?: string;
    year?: string;
    month?: string;
    guests?: string;
  }>;
}) {
  const { ship, line, year, month, guests } = await searchParams;
  const all = await getSailingBlocks();
  const baseBlocks = ship
    ? all.filter((b) => b.ship === ship)
    : line
    ? all.filter((b) => b.cruiseLine === line)
    : all;
  const what = ship ?? line;
  const label = what ?? "Pick a Sailing";

  // Available years/months for the date filter
  const years = Array.from(
    new Set(baseBlocks.map((b) => b.sailingDate.slice(0, 4)))
  ).sort();
  const months = year
    ? Array.from(
        new Set(
          baseBlocks
            .filter((b) => b.sailingDate.startsWith(year))
            .map((b) => b.sailingDate.slice(5, 7))
        )
      ).sort()
    : [];

  let blocks = baseBlocks;
  if (year) blocks = blocks.filter((b) => b.sailingDate.startsWith(year));
  if (year && month)
    blocks = blocks.filter((b) => b.sailingDate.slice(5, 7) === month);
  if (guests)
    blocks = blocks.filter((b) =>
      b.cabins.some((c) => c.maxGuests >= parseInt(guests))
    );

  const baseQ: Record<string, string> = {};
  if (ship) baseQ.ship = ship;
  if (line) baseQ.line = line;
  if (guests) baseQ.guests = guests;
  const href = (extra: Record<string, string | undefined>) => {
    const p = new URLSearchParams(baseQ);
    for (const [k, v] of Object.entries(extra)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/sailings?${s}` : "/sailings";
  };
  const guestsHref = (g?: string) => {
    const p = new URLSearchParams();
    if (ship) p.set("ship", ship);
    if (line) p.set("line", line);
    if (year) p.set("year", year);
    if (year && month) p.set("month", month);
    if (g) p.set("guests", g);
    const s = p.toString();
    return s ? `/sailings?${s}` : "/sailings";
  };
  const chip = (active: boolean) =>
    `label-mono text-[11px] uppercase tracking-wider px-4 py-2 rounded-full transition-colors ${
      active
        ? "bg-white text-black"
        : "border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
    }`;

  return (
    <div className="bg-[#05070d] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        {ship ? (
          <ShipImage ship={ship} overlay={false} className="absolute inset-0" />
        ) : (
          <div className="absolute inset-0 grid-bg" />
        )}
        <div className="absolute inset-0 bg-[#05070d]/80" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">
            {"// Step 2 · Choose Your Sail Date"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-4">
            {label}
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Choose a date below to see your cabin options and pricing. Every sailing
            departs from the Port of Galveston.
          </p>
          <Link
            href="/select"
            className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white transition-colors inline-block mt-5"
          >
            ← Change ship or line
          </Link>
        </div>
      </section>

      {years.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
            {"// Filter by Date"}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={href({})} className={chip(!year)}>
              All Years
            </Link>
            {years.map((y) => (
              <Link key={y} href={href({ year: y })} className={chip(year === y)}>
                {y}
              </Link>
            ))}
          </div>
          {year && months.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              <Link href={href({ year })} className={chip(!month)}>
                All Months
              </Link>
              {months.map((m) => (
                <Link
                  key={m}
                  href={href({ year, month: m })}
                  className={chip(month === m)}
                >
                  {MONTH_NAMES[parseInt(m) - 1] ?? m}
                </Link>
              ))}
            </div>
          )}

          {/* Guests / passengers filter */}
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mt-6 mb-3">
            {"// Passengers"}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={guestsHref()} className={chip(!guests)}>
              Any
            </Link>
            {["1", "2", "3", "4", "5"].map((g) => (
              <Link key={g} href={guestsHref(g)} className={chip(guests === g)}>
                {g} {g === "1" ? "guest" : "guests"}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {blocks.length === 0 ? (
          <div className="text-center py-12 max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-3">
              No published dates{what ? ` for ${what}` : ""} yet
            </h2>
            <p className="text-white/55 mb-7">
              We have access to far more Galveston departures than are listed here.
              Tell us your dates and we&apos;ll find your sailing.
            </p>
            <Link
              href={`/contact${what ? `?ship=${encodeURIComponent(what)}` : ""}`}
              className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Request {what ?? "a Sailing"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blocks.map((b) => {
              const available = b.cabins.filter(
                (c) => c.status === "available"
              ).length;
              const prices = b.cabins.map((c) => c.price).filter((p) => p > 0);
              const from = prices.length ? Math.min(...prices) : 0;
              return (
                <Link
                  key={b.id}
                  href={`/sailings/${b.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-sky-400/40 transition-colors flex flex-col"
                >
                  {/* Futuristic ship-photo backdrop */}
                  <ShipImage ship={b.ship} overlay={false} className="absolute inset-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020]/96 via-[#0b1020]/82 to-[#0b1020]/55" />
                  <div className="absolute inset-0 grid-bg opacity-20" />
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

                  <div className="relative z-10 p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="hud label-mono text-[10px] uppercase tracking-wider text-white px-2.5 py-1 rounded-full">
                        {b.nights} {durationWord(b.cruiseLine)}
                      </span>
                      <CruiseLineLogo
                        line={b.cruiseLine}
                        className="h-4 max-w-[130px]"
                      />
                    </div>
                    <div className="text-2xl font-extrabold text-white mb-1">
                      {fmtDate(b.sailingDate)}
                    </div>
                    <div className="text-white/45 text-sm mb-3">
                      returns {fmtDate(b.returnDate)}
                    </div>
                    <p className="text-white/60 text-sm flex-1">
                      <span className="text-sky-400/80 font-semibold">
                        Galveston
                      </span>{" "}
                      → {b.itinerary} →{" "}
                      <span className="text-sky-400/80 font-semibold">
                        Galveston
                      </span>
                    </p>
                    <div className="flex items-end justify-between border-t border-white/10 pt-4 mt-4">
                      <div>
                        {from > 0 && (
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
                            <div className="text-white/35 text-[10px] leading-tight mt-0.5">
                              double occupancy · 3–5 guests, ask for rate
                            </div>
                          </>
                        )}
                        <div className="label-mono text-[10px] uppercase text-sky-400/70 mt-1.5">
                          {available} cabins open
                        </div>
                      </div>
                      <span className="label-mono text-[11px] uppercase tracking-wider text-white/40 group-hover:text-sky-400/80 transition-colors">
                        See options →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
