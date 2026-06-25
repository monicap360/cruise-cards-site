import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShipImage from "@/components/ShipImage";
import { GALVESTON_FLEET } from "@/lib/seed-inventory";
import { getSailingBlocks } from "@/lib/room-blocks";
import { getTerminal } from "@/lib/port-terminals";
import { officialDeckPlanUrl } from "@/lib/deck-plans";
import { fmt$, fmtDate, durationWord } from "@/lib/sea-pay";

export const dynamic = "force-dynamic";

const SITE_URL = "https://galvestoncruiseagency.com";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function findShip(slug: string) {
  return GALVESTON_FLEET.find((f) => slugify(f.ship) === slug);
}

export function generateStaticParams() {
  return GALVESTON_FLEET.map((f) => ({ ship: slugify(f.ship) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ship: string }>;
}): Promise<Metadata> {
  const { ship } = await params;
  const f = findShip(ship);
  if (!f) return { title: "Ship not found | Cruises from Galveston" };
  const title = `${f.ship} from Galveston — Itineraries, Prices & Deck Plans`;
  const description = `Book ${f.ship} (${f.cruiseLine}) cruises from the Port of Galveston, Texas. ${f.durationLabel} round-trip sailings to ${f.itinerary}. Compare dates, cabins, and prices, then book with a local Galveston team.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/ships-from-galveston/${ship}` },
    openGraph: { title, description, url: `${SITE_URL}/ships-from-galveston/${ship}` },
  };
}

export default async function ShipLandingPage({
  params,
}: {
  params: Promise<{ ship: string }>;
}) {
  const { ship } = await params;
  const f = findShip(ship);
  if (!f) notFound();

  const all = await getSailingBlocks();
  const sailings = all
    .filter((b) => b.ship === f.ship)
    .sort((a, b) => a.sailingDate.localeCompare(b.sailingDate));
  const prices = sailings.flatMap((b) =>
    b.cabins.map((c) => c.price).filter((p) => p > 0)
  );
  const fromPrice = prices.length ? Math.min(...prices) : 0;
  const terminal = getTerminal(f.ship);
  const officialUrl = officialDeckPlanUrl(f.ship);
  const dur = durationWord(f.cruiseLine);
  const upcoming = sailings.slice(0, 8);

  const faqs = [
    {
      q: `Where does ${f.ship} sail from?`,
      a: `${f.ship} departs round-trip from the Port of Galveston, Texas — a drive-up homeport with no flights required (though we can also book your flights and transfers). ${
        terminal
          ? `On sail day, enter at ${terminal.entryStreet}.`
          : ""
      }`,
    },
    {
      q: `Where does ${f.ship} cruise to from Galveston?`,
      a: `${f.cruiseLine}'s ${f.ship} sails ${f.durationLabel} itineraries visiting ${f.itinerary}. Every cruise is round-trip (closed-loop) back to Galveston.`,
    },
    {
      q: `How much is a ${f.ship} cruise from Galveston?`,
      a:
        fromPrice > 0
          ? `${f.ship} cruises start from ${fmt$(
              fromPrice
            )} per person (double occupancy, taxes & port fees included). Final pricing depends on sail date and cabin type.`
          : `Pricing varies by sail date and cabin. Contact our Galveston team for a current quote.`,
    },
    {
      q: `Can I park at the terminal for a ${f.ship} cruise?`,
      a: `Yes — reserved terminal parking is available, plus hotels, transfers, and luggage service. We bundle the whole trip from our Galveston Cruise Experience Center.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };

  return (
    <div className="bg-[#05070d] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <ShipImage ship={f.ship} overlay={false} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/85 to-[#05070d]/55" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <Link
            href="/ships-from-galveston"
            className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white transition-colors inline-block mb-5"
          >
            ← All Galveston ships
          </Link>
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
            {f.cruiseLine} · {f.durationLabel}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-4">
            {f.ship} Cruises from Galveston
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Round-trip, closed-loop sailings from the Port of Galveston, Texas to{" "}
            {f.itinerary}.
            {f.seasonalNote ? ` ${f.seasonalNote}.` : ""}
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              href={`/sailings?ship=${encodeURIComponent(f.ship)}`}
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
            >
              See dates &amp; prices
            </Link>
            <Link
              href={`/deck-plans?ship=${encodeURIComponent(f.ship)}`}
              className="border border-white/25 hover:border-white/70 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
            >
              Deck plans
            </Link>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
        {[
          { v: f.cruiseLine, l: "Cruise line" },
          { v: f.durationLabel, l: "Lengths" },
          {
            v: sailings.length ? `${sailings.length}` : "Ask us",
            l: "Galveston sailings",
          },
          {
            v: fromPrice > 0 ? `${fmt$(fromPrice)}` : "Quote",
            l: "From / person",
          },
        ].map((s) => (
          <div key={s.l} className="bg-[#0b1020] p-5">
            <div className="font-bold text-white text-sm leading-tight">
              {s.v}
            </div>
            <div className="label-mono text-[10px] uppercase text-sky-400/70 mt-1">
              {s.l}
            </div>
          </div>
        ))}
      </section>

      {/* Overview copy (SEO content) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-4 text-white/65 leading-relaxed">
        <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] text-white">
          Sailing {f.ship} from Galveston, Texas
        </h2>
        <p>
          {f.ship} is part of the {f.cruiseLine} fleet sailing year-round from the
          Port of Galveston — one of the most convenient cruise homeports in the
          country. Galveston is a drive-up port for millions of Texans and
          neighboring states, so most guests skip the airport entirely. Flying
          in? We also book your flights, hotel, and transfers as a Fly &amp;
          Cruise package.
        </p>
        <p>
          Every {f.ship} cruise from Galveston is a round-trip,{" "}
          <strong className="text-white/80">closed-loop sailing</strong> — you
          depart and return to Galveston — visiting {f.itinerary}. Typical
          lengths are {f.durationLabel}.
          {terminal
            ? ` On embarkation day, ${f.ship} guests enter the Port of Galveston at ${terminal.entryStreet}.`
            : ""}
        </p>
        <p>
          As your local Galveston Cruise Experience Center, we match the big
          online travel agencies on price and add what they can&apos;t: in-person
          help, terminal know-how, parking and luggage service, and a team that
          treats you like a neighbor.
        </p>
      </section>

      {/* Upcoming sailings */}
      {upcoming.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">
            {"// Upcoming " + f.ship + " sailings"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcoming.map((b) => {
              const p = b.cabins.map((c) => c.price).filter((n) => n > 0);
              const from = p.length ? Math.min(...p) : 0;
              return (
                <Link
                  key={b.id}
                  href={`/sailings/${b.id}`}
                  className="group bg-[#0b1020] border border-white/10 rounded-xl p-4 hover:border-white/30 transition-colors flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-white">
                      {fmtDate(b.sailingDate)}
                    </div>
                    <div className="text-white/45 text-xs">
                      {b.nights} {dur} · {b.itinerary}
                    </div>
                  </div>
                  {from > 0 && (
                    <div className="text-right flex-shrink-0">
                      <div className="text-white font-bold">{fmt$(from)}</div>
                      <div className="text-white/35 text-[10px]">/ person</div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
          <Link
            href={`/sailings?ship=${encodeURIComponent(f.ship)}`}
            className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 hover:text-white transition-colors inline-block mt-5"
          >
            See all {f.ship} dates →
          </Link>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-6">
          {f.ship} from Galveston — FAQ
        </h2>
        <div className="space-y-3">
          {faqs.map((x) => (
            <div
              key={x.q}
              className="bg-[#0b1020] border border-white/10 rounded-xl p-5"
            >
              <h3 className="font-bold text-white mb-1.5">{x.q}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{x.a}</p>
            </div>
          ))}
        </div>

        {officialUrl && (
          <p className="text-white/40 text-xs mt-6">
            Official {f.ship} deck plans:{" "}
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400/80 hover:text-sky-300"
            >
              {f.cruiseLine} ↗
            </a>
          </p>
        )}
      </section>
    </div>
  );
}
