import Link from "next/link";
import { getListedListings, SAMPLE_LISTINGS, ADMIN_FEE, type Listing } from "@/lib/last-minute";
import { fmt$ } from "@/lib/sea-pay";
import BoardingPass from "@/components/BoardingPass";
import { getTerminal } from "@/lib/port-terminals";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Last-Minute Cruises from Galveston",
  description:
    "Transferred cabins on sailings leaving soon from Galveston — real cabins you can't get at the pier. Or list a cruise you can't take and recover part of what you paid.",
};

function firstPort(itinerary: string): string {
  return itinerary.split(/[·,]/)[0]?.trim() || "Caribbean";
}

function regionOf(itinerary: string): string {
  const s = itinerary.toLowerCase();
  if (s.includes("nassau") || s.includes("cococay") || s.includes("baham"))
    return "Bahamas";
  if (
    s.includes("cozumel") ||
    s.includes("roat") ||
    s.includes("belize") ||
    s.includes("costa maya") ||
    s.includes("progreso") ||
    s.includes("grand cayman")
  )
    return "Western Caribbean";
  if (s.includes("san juan") || s.includes("st. ") || s.includes("thomas"))
    return "Eastern Caribbean";
  return "Caribbean";
}

function sailLabel(l: Listing): string {
  if (!l.sailDate) return "Departs soon";
  const d = new Date(l.sailDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return l.sailDate;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function LastMinutePage() {
  const live = await getListedListings();
  const board = live.length > 0 ? live : SAMPLE_LISTINGS;
  const usingSamples = live.length === 0;

  return (
    <div className="bg-[#05070d] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-6">
            {"// Transferred Cabins · Sail Soon"}
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-6 max-w-3xl">
            Last-Minute <span className="text-holo">Sailings</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mb-10">
            Real cabins from travelers who can no longer sail — transferred to our
            agency and ready for a new name. You can&apos;t get these at the pier.
            When they&apos;re gone, they&apos;re gone.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#board"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              See Available Cabins
            </a>
            <Link
              href="/list-your-cruise"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              List Your Cruise
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-white/10">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-10">
          {"// How a Transfer Works"}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {[
            {
              n: "01",
              t: "Claim a cabin",
              d: "Tell us which sailing you want. We confirm it's still available and start the name change with the cruise line.",
            },
            {
              n: "02",
              t: "We transfer it to you",
              d: `Your name goes on the booking. You pay the cruise line's name-change fee plus a flat ${fmt$(
                ADMIN_FEE
              )} agency fee — far less than booking new.`,
            },
            {
              n: "03",
              t: "You sail",
              d: "You get the cabin at a last-minute price, and the original guest recovers part of what they paid. Everybody wins.",
            },
          ].map((s) => (
            <div key={s.n} className="bg-[#05070d] p-8">
              <div className="label-mono text-sky-400/70 text-sm mb-5">{s.n}</div>
              <h3 className="font-bold text-white uppercase tracking-wide text-base mb-2">
                {s.t}
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="text-white/40 text-xs mt-5 max-w-3xl leading-relaxed">
          Transfers are subject to each cruise line&apos;s name-change rules and
          aren&apos;t possible on every fare. Our specialists verify eligibility
          before any money changes hands.
        </p>
      </section>

      {/* Board */}
      <section id="board" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
              {"// Available Now"}
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em]">
              Open Cabins
            </h2>
          </div>
          <Link
            href="/list-your-cruise"
            className="label-mono text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors"
          >
            List your cruise →
          </Link>
        </div>

        {usingSamples && (
          <div className="mb-8 bg-[#0b1020] border border-white/10 rounded-2xl px-5 py-3 text-white/55 text-sm">
            <span className="label-mono text-[11px] uppercase text-sky-400/80 mr-2">
              Sample
            </span>
            Example listings shown below — real transferred cabins appear here as
            guests list them.
          </div>
        )}

        <div className="space-y-5">
          {board.map((l) => {
            const deckMatch = (l.cabinType || "").match(/\(Deck\s*(\d+)\)/i);
            const category = deckMatch
              ? (l.cabinType || "").replace(/\s*\(Deck\s*\d+\)/i, "").trim()
              : l.cabinType || "Guarantee Cabin";
            const deckLocation = deckMatch ? `Deck ${deckMatch[1]}` : undefined;
            return (
              <BoardingPass
                key={l.id}
                nights={l.nights}
                region={regionOf(l.itinerary)}
                ship={l.ship}
                cruiseLine={l.cruiseLine}
                departLabel={sailLabel(l)}
                toPort={firstPort(l.itinerary)}
                category={category}
                roomNumber={l.cabinNumber}
                deckLocation={deckLocation}
                total={l.buyerPrice}
                guests={l.guests}
                originalPrice={l.pricePaid}
                badge={l.sample ? "Sample" : "Transferred"}
                embarkStreet={getTerminal(l.ship)?.entryStreet}
                href={`/contact?listing=${encodeURIComponent(
                  l.sample ? "sample" : l.id
                )}`}
                ctaLabel="Claim Cabin"
                mapHref={`/deck-plans?ship=${encodeURIComponent(l.ship)}`}
              />
            );
          })}
        </div>
      </section>

      {/* Seller CTA */}
      <section className="relative border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[44rem] h-[44rem] -bottom-72 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            Can&apos;t make your sailing?
          </h2>
          <p className="text-white/55 text-lg mb-9">
            Don&apos;t let it go to waste. Transfer your booking to us, and we&apos;ll
            find a last-minute traveler to take it over — so you recover part of
            what you paid.
          </p>
          <Link
            href="/list-your-cruise"
            className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
          >
            List Your Cruise
          </Link>
        </div>
      </section>
    </div>
  );
}
