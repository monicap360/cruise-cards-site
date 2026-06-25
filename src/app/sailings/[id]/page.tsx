import Link from "next/link";
import Photo from "@/components/Photo";
import ShipImage from "@/components/ShipImage";
import {
  getSailingBlock,
  groupByType,
  CATEGORY_INFO,
  type CabinCategory,
} from "@/lib/room-blocks";
import { getTerminal } from "@/lib/port-terminals";
import { fmt$, fmtDate } from "@/lib/sea-pay";

export const dynamic = "force-dynamic";

const ORDER: CabinCategory[] = [
  "Interior",
  "Ocean View",
  "Balcony",
  "Mini-Suite",
  "Suite",
];

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
            {fmtDate(block.sailingDate)} · {block.nights} nights · {block.itinerary}
          </p>
          <p className="text-white/45 text-sm mt-1">
            {block.cruiseLine}
            {terminal ? ` · enter at ${terminal.entryStreet}` : ""}
          </p>
        </div>
      </section>

      {/* Cabin options */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-5">
        {types.map((type) => {
          const cabins = byType[type];
          const prices = cabins.map((c) => c.price).filter((p) => p > 0);
          const from = prices.length ? Math.min(...prices) : 0;
          const available = cabins.filter((c) => c.status === "available").length;
          const info = CATEGORY_INFO[type] ?? CATEGORY_INFO.Interior;
          const slug = type.toLowerCase().replace(/[^a-z0-9]+/g, "-");

          return (
            <div
              key={type}
              className="bg-[#0b1020] border border-white/10 rounded-2xl overflow-hidden flex flex-col sm:flex-row"
            >
              <Photo
                src={`/cabins/${slug}.jpg`}
                alt={`${type} stateroom`}
                gradient={info.gradient}
                className="sm:w-64 h-44 sm:h-auto flex-shrink-0"
              />
              <div className="p-6 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-xl font-extrabold uppercase tracking-[-0.01em] text-white">
                      {type}
                    </h3>
                    <div className="label-mono text-[10px] uppercase text-sky-400/70">
                      {info.sqftRange} · {available} open
                    </div>
                  </div>
                  {from > 0 && (
                    <div className="text-right">
                      <span className="text-white/40 label-mono text-[10px] uppercase">
                        From
                      </span>
                      <div className="text-white font-extrabold text-2xl leading-none">
                        {fmt$(from)}
                        <span className="text-white/40 text-xs font-normal">
                          {" "}
                          / person
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-white/55 text-sm leading-relaxed mb-4">
                  {info.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/book?ship=${shipParam}&date=${block.sailingDate}`}
                    className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
                  >
                    Reserve
                  </Link>
                  <Link
                    href={`/hold?ship=${shipParam}&name=${encodeURIComponent(
                      block.ship + " " + type
                    )}`}
                    className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
                  >
                    Hold a Room
                  </Link>
                  <Link
                    href={`/sea-pay/plan?ship=${shipParam}`}
                    className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
                  >
                    Sea Pay™
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {types.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/55 mb-6">
              This sailing has no cabins loaded yet.
            </p>
            <Link
              href={`/contact?ship=${shipParam}`}
              className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Ask About This Sailing
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
