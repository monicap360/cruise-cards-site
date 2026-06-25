import Link from "next/link";
import ShipImage from "@/components/ShipImage";
import CabinShowcase from "@/components/CabinShowcase";
import CruiseTicket from "@/components/CruiseTicket";
import CruiseInclusions from "@/components/CruiseInclusions";
import CruiseOffers from "@/components/CruiseOffers";
import DestinationCard from "@/components/DestinationCard";
import { portsFromItinerary, destinationFor } from "@/lib/destinations";
import {
  getSailingBlock,
  groupByType,
  CATEGORY_INFO,
  type CabinCategory,
} from "@/lib/room-blocks";
import { getTerminal } from "@/lib/port-terminals";
import { getOffersForSailing } from "@/lib/offers";
import { fmtDate, durationWord } from "@/lib/sea-pay";

export const dynamic = "force-dynamic";

const ORDER: CabinCategory[] = [
  "Interior",
  "Ocean View",
  "Balcony",
  "Mini-Suite",
  "Suite",
];

function regionOf(itinerary: string): string {
  const t = itinerary.toLowerCase();
  if (
    t.includes("nassau") ||
    t.includes("cococay") ||
    t.includes("bahamas") ||
    t.includes("ocean cay")
  )
    return "Bahamas";
  return "Western Caribbean";
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function dateRangeLabel(start: string, end: string): string {
  const opts = { weekday: "short", month: "short", day: "2-digit" } as const;
  const s = new Date(start + "T12:00:00").toLocaleDateString("en-US", opts);
  const e = new Date(end + "T12:00:00").toLocaleDateString("en-US", {
    ...opts,
    year: "numeric",
  });
  return `${s} – ${e}`;
}

export default async function SailingOptionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const block = await getSailingBlock(id);

  if (!block) {
    return (
      <div className="bg-[#05070d] text-white min-h-[60vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-3">
            Sailing not found
          </h1>
          <p className="text-white/55 mb-7">
            That sailing may have sold out or been removed.
          </p>
          <Link
            href="/select"
            className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
          >
            Choose Another Cruise
          </Link>
        </div>
      </div>
    );
  }

  const byType = groupByType(block.cabins);
  const types = ORDER.filter((t) => byType[t]?.length);
  const terminal = getTerminal(block.ship);
  const shipParam = encodeURIComponent(block.ship);
  const offers = await getOffersForSailing({
    cruiseLine: block.cruiseLine,
    sailingDate: block.sailingDate,
    nights: block.nights,
  });
  const ports = portsFromItinerary(block.itinerary);

  return (
    <div className="bg-[#05070d] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <ShipImage ship={block.ship} overlay={false} className="absolute inset-0" />
        <div className="absolute inset-0 bg-[#05070d]/80" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <Link
            href={`/sailings?ship=${shipParam}`}
            className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white transition-colors inline-block mb-5"
          >
            ← Change date
          </Link>
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Step 3 · Choose Your Cabin"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-3">
            {block.ship}
          </h1>
          <p className="text-white/70 text-lg">
            {fmtDate(block.sailingDate)} · {block.nights}{" "}
            {durationWord(block.cruiseLine)} · {block.itinerary}
          </p>
          <p className="text-white/45 text-sm mt-1">
            {block.cruiseLine}
            {terminal ? ` · enter at ${terminal.entryStreet}` : ""}
          </p>
          <p className="label-mono text-[11px] uppercase tracking-wider text-sky-400/70 mt-2">
            Round-trip from Galveston · Closed-loop sailing · Returns to Galveston
          </p>
        </div>
      </section>

      {/* Your cruise ticket */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
          {"// Your Cruise Ticket"}
        </div>
        <CruiseTicket
          ship={block.ship}
          cruiseLine={block.cruiseLine}
          sailingDate={block.sailingDate}
          returnDate={block.returnDate}
          nights={block.nights}
          itinerary={block.itinerary}
          fromPrice={(() => {
            const p = block.cabins.map((c) => c.price).filter((n) => n > 0);
            return p.length ? Math.min(...p) : undefined;
          })()}
          embarkStreet={terminal?.entryStreet}
        />
      </section>

      {/* Ports of call */}
      {ports.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">
            {"// Ports of Call"}
          </div>
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] text-white mb-6">
            Where You&rsquo;ll Wake Up
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ports.map((p) => (
              <DestinationCard key={p} d={destinationFor(p)} />
            ))}
          </div>
        </section>
      )}

      {/* Promotions / offers */}
      {offers.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">
            {"// Add an Offer to Your Cruise"}
          </div>
          <CruiseOffers
            offers={offers}
            contextHref={`/contact?ship=${shipParam}&date=${block.sailingDate}`}
          />
        </section>
      )}

      {/* Cabin options */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-5">
        {types.map((type) => {
          const cabins = byType[type];
          const prices = cabins.map((c) => c.price).filter((p) => p > 0);
          const from = prices.length ? Math.min(...prices) : 0;
          const available = cabins.filter((c) => c.status === "available").length;
          const info = CATEGORY_INFO[type] ?? CATEGORY_INFO.Interior;
          const slug = type.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const maxGuests = Math.max(...cabins.map((c) => c.maxGuests));

          return (
            <CabinShowcase
              key={type}
              type={type}
              durationRegion={`${block.nights}-${
                /carnival/i.test(block.cruiseLine) ? "Day" : "Night"
              } ${regionOf(block.itinerary)}`}
              ship={block.ship}
              cruiseLine={block.cruiseLine}
              dateRangeLabel={dateRangeLabel(
                block.sailingDate,
                addDays(block.sailingDate, block.nights)
              )}
              fromPort="Galveston"
              fromPerson={from}
              available={available}
              slug={slug}
              gradient={info.gradient}
              sqftRange={info.sqftRange}
              desc={info.desc}
              features={info.features}
              reserveHref={`/book-cabin?ship=${shipParam}&date=${block.sailingDate}&type=${encodeURIComponent(
                type
              )}&price=${from}&line=${encodeURIComponent(block.cruiseLine)}&dest=${encodeURIComponent(
                ports[0] ?? ""
              )}`}
              holdHref={`/hold?ship=${shipParam}&name=${encodeURIComponent(
                block.ship + " " + type
              )}`}
              seaPayHref={`/sea-pay/plan?ship=${shipParam}`}
              maxGuests={maxGuests}
            />
          );
        })}

        {types.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/55 mb-6">
              This sailing has no cabins loaded yet.
            </p>
            <Link
              href={`/contact?ship=${shipParam}&date=${block.sailingDate}`}
              className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Ask About This Sailing
            </Link>
          </div>
        )}
      </section>

      {/* What's included / not included */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">
          {"// What's Included in Your Cruise"}
        </div>
        <CruiseInclusions />
      </section>
    </div>
  );
}
