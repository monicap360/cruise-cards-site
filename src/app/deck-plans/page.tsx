import type { Metadata } from "next";
import Link from "next/link";
import DeckPlanImage from "@/components/DeckPlanImage";
import ShipGallery from "@/components/ShipGallery";
import ShipImage from "@/components/ShipImage";
import { GALVESTON_FLEET } from "@/lib/seed-inventory";
import { getTerminal } from "@/lib/port-terminals";
import { officialDeckPlanUrl } from "@/lib/deck-plans";

export const metadata: Metadata = {
  title: "Ship Deck Plans | Cruises from Galveston",
  description:
    "Browse deck-by-deck stateroom plans for cruise ships sailing from Galveston, Texas — find your cabin's deck and location before you book.",
};

export default async function DeckPlansPage({
  searchParams,
}: {
  searchParams: Promise<{ ship?: string }>;
}) {
  const { ship } = await searchParams;
  const shipName = ship?.trim();

  // No ship selected → show the fleet picker.
  if (!shipName) {
    return (
      <main className="bg-[#05070d] text-white min-h-screen">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">
            Deck Plans
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] mb-3">
            Ship Deck Plans
          </h1>
          <p className="text-white/55 max-w-2xl mb-10">
            Pick a ship to view its deck-by-deck stateroom plans. See exactly
            where each cabin sits before you claim it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GALVESTON_FLEET.map((f) => (
              <Link
                key={f.ship}
                href={`/deck-plans?ship=${encodeURIComponent(f.ship)}`}
                className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-colors h-40"
              >
                <ShipImage ship={f.ship} className="absolute inset-0" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <div className="font-bold uppercase tracking-wide text-sm">
                    {f.ship}
                  </div>
                  <div className="label-mono text-[10px] uppercase text-sky-400/80">
                    View deck plans →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  const terminal = getTerminal(shipName);
  const officialUrl = officialDeckPlanUrl(shipName);

  return (
    <main className="bg-[#05070d] text-white min-h-screen">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/deck-plans"
          className="label-mono text-[11px] uppercase tracking-wider text-white/40 hover:text-white transition-colors"
        >
          ← All ships
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4 mt-4 mb-8">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-2">
              Deck Plans
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.01em]">
              {shipName}
            </h1>
            {terminal?.entryStreet && (
              <div className="label-mono text-[10px] uppercase tracking-wider text-white/40 mt-2">
                Galveston terminal · Enter at {terminal.entryStreet}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {officialUrl && (
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-full transition-all"
              >
                Official deck plans ↗
              </a>
            )}
            <Link
              href={`/select?ship=${encodeURIComponent(shipName)}`}
              className="border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-full transition-all"
            >
              See sailings & cabins
            </Link>
          </div>
        </div>

        <DeckPlanImage ship={shipName} officialUrl={officialUrl} />

        <p className="text-white/40 text-xs mt-4 max-w-2xl">
          Deck plans are reference layouts. Exact stateroom availability and
          location are confirmed at booking. Questions about a specific deck?{" "}
          <Link href="/contact" className="text-sky-400/80 hover:text-sky-300">
            Ask our Galveston team
          </Link>
          .
        </p>

        <div className="mt-12">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-4">
            {"// Real Cruise Photos"}
          </div>
          <ShipGallery
            slug={shipName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")}
            shipName={shipName}
          />
        </div>
      </section>
    </main>
  );
}
