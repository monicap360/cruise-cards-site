import type { Metadata } from "next";
import Link from "next/link";
import ShipImage from "@/components/ShipImage";
import CabinShowcase from "@/components/CabinShowcase";
import CruiseTicket from "@/components/CruiseTicket";
import CruiseInclusions from "@/components/CruiseInclusions";
import CruiseOffers from "@/components/CruiseOffers";
import DestinationCard from "@/components/DestinationCard";
import { portsFromItinerary, destinationFor, cruiseItineraryTitle } from "@/lib/destinations";
import { destinations as destPages } from "@/app/destinations/destination-data";
import {
  getSailingBlock,
  groupByType,
  CATEGORY_INFO,
  type CabinCategory,
} from "@/lib/room-blocks";
import { getTerminal } from "@/lib/port-terminals";
import { getOffersForSailing } from "@/lib/offers";
import { getRateMap, rateKey } from "@/lib/rates";
import { fmtDate, durationWord } from "@/lib/sea-pay";

export const dynamic = "force-dynamic";

// SEO: real per-sailing <title> + meta description targeting the exact searches
// ("N-Night Western Caribbean Cruise from Galveston", ports, ship) — pages had
// none before, so this is a big local-SEO win over the OTAs.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const block = await getSailingBlock(id);
  if (!block) return { title: "Sailing not found — Cruises from Galveston" };
  const { region } = cruiseItineraryTitle(block.itinerary);
  const durCap = /carnival/i.test(block.cruiseLine) ? "Day" : "Night";
  const ports = portsFromItinerary(block.itinerary).join(", ");
  const prices = block.cabins.map((c) => c.price).filter((p) => p > 0);
  const from = prices.length ? Math.min(...prices) : 0;
  const title = `${block.nights}-${durCap} ${region} Cruise from Galveston on ${block.ship}${
    ports ? ` — ${ports}` : ""
  }`;
  const description = `Book a ${block.nights}-${durCap.toLowerCase()} ${region} cruise from Galveston on ${block.ship} (${block.cruiseLine})${
    ports ? `, visiting ${ports}` : ""
  }. Round-trip from the Port of Galveston, TX${
    from > 0 ? `, from $${from} per person` : ""
  } — government taxes & port fees included. Pick your exact cabin on a live deck map.`;
  return {
    title,
    description,
    alternates: { canonical: `https://cruisesfromgalveston.net/sailings/${block.id}` },
    openGraph: { title, description, type: "website" },
  };
}

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

type ItinDay = { day: number; date: string; title: string; type: "embark" | "port" | "sea" | "debark" };

// Build a sensible day-by-day schedule from the ports + length: embark Galveston
// on day 1, return on the last day, ports spread across the middle days, sea days
// fill the rest. (A typical schedule — exact times confirmed on cruise docs.)
function buildItinerary(sailingDate: string, nights: number, ports: string[]): ItinDay[] {
  const totalDays = nights + 1;
  const middleCount = Math.max(0, nights - 1);
  const slots: (string | null)[] = Array(middleCount).fill(null);
  if (ports.length && middleCount) {
    ports.forEach((p, i) => {
      const pos =
        ports.length === 1
          ? Math.floor(middleCount / 2)
          : Math.round((i * (middleCount - 1)) / (ports.length - 1));
      let idx = Math.min(Math.max(pos, 0), middleCount - 1);
      while (idx < middleCount && slots[idx] !== null) idx++;
      if (idx >= middleCount) idx = slots.findIndex((s) => s === null);
      if (idx >= 0) slots[idx] = p;
    });
  }
  const days: ItinDay[] = [];
  for (let d = 0; d < totalDays; d++) {
    const date = addDays(sailingDate, d);
    if (d === 0) days.push({ day: 1, date, title: "Depart Galveston", type: "embark" });
    else if (d === totalDays - 1) days.push({ day: d + 1, date, title: "Return to Galveston", type: "debark" });
    else {
      const slot = slots[d - 1];
      days.push({ day: d + 1, date, title: slot ?? "Fun Day at Sea", type: slot ? "port" : "sea" });
    }
  }
  return days;
}

const ITIN_ICON: Record<ItinDay["type"], string> = { embark: "🚢", port: "🏝️", sea: "🌊", debark: "⚓" };
const ITIN_TAG: Record<ItinDay["type"], string> = { embark: "Embark", port: "Port of Call", sea: "At Sea", debark: "Debark" };

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
  const itinerary = buildItinerary(block.sailingDate, block.nights, ports);
  const rateMap = await getRateMap();

  const cabinPrices = block.cabins.map((c) => c.price).filter((p) => p > 0);
  const fromPrice = cabinPrices.length ? Math.min(...cabinPrices) : 0;
  const tripLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `${block.nights}-Night ${block.itinerary} on ${block.ship}`,
    description: `Round-trip ${block.nights}-night cruise from Galveston, TX on ${block.ship} (${block.cruiseLine}) visiting ${block.itinerary}. Per person, double occupancy — government taxes, port expenses & fees included.`,
    provider: { "@type": "TravelAgency", name: "Cruises from Galveston", telephone: "+1-409-632-2106" },
    departureTime: block.sailingDate,
    ...(fromPrice > 0
      ? {
          offers: {
            "@type": "Offer",
            price: fromPrice,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `https://cruisesfromgalveston.net/sailings/${block.id}`,
          },
        }
      : {}),
  };

  return (
    <div className="bg-[#05070d] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tripLd) }} />
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
          <p className="text-holo text-lg sm:text-2xl font-extrabold uppercase tracking-tight mb-2">
            {block.nights}-{/carnival/i.test(block.cruiseLine) ? "Day" : "Night"}{" "}
            {cruiseItineraryTitle(block.itinerary).title} from Galveston
          </p>
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
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/group-blocks?ship=${shipParam}&date=${block.sailingDate}`}
              className="inline-block border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
            >
              👥 Groups on this sailing
            </Link>
            <Link
              href={`/waitlist?ship=${shipParam}&date=${block.sailingDate}`}
              className="inline-block border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
            >
              📋 Join waitlist
            </Link>
            <Link
              href={`/sailings/${id}/sheet`}
              className="inline-block border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
            >
              🖨 Print / Save PDF
            </Link>
            <Link
              href={`/reserve?ship=${shipParam}&date=${block.sailingDate}`}
              className="inline-block border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
            >
              📅 Book appointment
            </Link>
          </div>
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
          fromPrice={fromPrice > 0 ? fromPrice : undefined}
          {...(() => {
            const dest = ports[0] ? destinationFor(ports[0]) : null;
            // Cheapest cabin type on this sailing → shown on the ticket photo.
            const cheapest = block.cabins
              .filter((c) => c.price > 0)
              .sort((a, b) => a.price - b.price)[0];
            const cabType = cheapest?.type;
            const info = cabType
              ? CATEGORY_INFO[cabType as CabinCategory] ?? CATEGORY_INFO.Interior
              : undefined;
            const top = offers[0];
            return {
              destName: dest?.name,
              destSlug: dest?.slug,
              destGradient: dest?.gradient,
              cabinType: cabType ? (/suite/i.test(cabType) ? cabType : `${cabType} Cabin`) : undefined,
              cabinSlug: cabType ? cabType.toLowerCase().replace(/[^a-z0-9]+/g, "-") : undefined,
              cabinGradient: info?.gradient,
              shipSlug: block.ship.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
              special: top
                ? { icon: top.icon, badge: top.badge, title: top.title, description: top.description }
                : undefined,
            };
          })()}
        />
      </section>

      {/* Day-by-day itinerary */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">
          {"// Day-by-Day Itinerary"}
        </div>
        <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] text-white mb-2">
          Your {block.nights}-{/carnival/i.test(block.cruiseLine) ? "Day" : "Night"}{" "}
          {cruiseItineraryTitle(block.itinerary).region} Cruise from Galveston
        </h2>
        <p className="text-white/45 text-sm mb-6">
          A typical schedule for this round-trip sailing. Exact arrival times and any
          tender ports are confirmed on your cruise documents.
        </p>
        <div className="rounded-2xl border border-white/10 bg-[#0b1020] overflow-hidden divide-y divide-white/10">
          {itinerary.map((it) => (
            <div key={it.day} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex flex-col items-center w-12 shrink-0">
                <span className="label-mono text-[9px] uppercase text-white/40">Day</span>
                <span className="text-2xl font-extrabold text-white leading-none">{it.day}</span>
              </div>
              <div className="w-9 text-center shrink-0 text-2xl">{ITIN_ICON[it.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold uppercase tracking-tight text-sm">{it.title}</div>
                <div className="text-white/45 text-xs mt-0.5">{fmtDate(it.date)}</div>
              </div>
              <span className="label-mono text-[9px] uppercase tracking-wider text-sky-300/70 bg-sky-400/10 border border-sky-400/20 px-2.5 py-1 rounded-full shrink-0">
                {ITIN_TAG[it.type]}
              </span>
            </div>
          ))}
        </div>
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
            {ports.map((p) => {
              const d = destinationFor(p);
              const hasPage = destPages.some((dp) => dp.id === d.slug);
              return (
                <DestinationCard
                  key={p}
                  d={d}
                  href={hasPage ? `/destinations/${d.slug}` : undefined}
                />
              );
            })}
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
          // Admin-set cruise-line rate (per ship + cabin type) overrides the
          // seeded cabin price when present.
          const rateOverride = rateMap[rateKey(block.ship, type)];
          const from = rateOverride ?? (prices.length ? Math.min(...prices) : 0);
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
              holdHref={`/hold?ship=${shipParam}&date=${block.sailingDate}&type=${encodeURIComponent(
                type
              )}`}
              seaPayHref={`/sea-pay/plan?ship=${shipParam}`}
              printHref={`/sailings/${id}/sheet?cabin=${encodeURIComponent(type)}`}
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
