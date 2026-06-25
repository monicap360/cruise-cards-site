import Link from "next/link";
import Photo from "@/components/Photo";
import OccupancyTiers from "@/components/OccupancyTiers";

function shipSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Cabin category card for the sailing page. Cabin-focused (the ship, line, and
 * dates live on the page hero/ticket, so they're not repeated here). Shows a
 * representative photo, size & occupancy, price with gross total, features, and
 * booking actions. Drop a real photo at /public/cabins/<slug>.jpg.
 */
export default function CabinShowcase({
  type,
  ship,
  fromPerson,
  available,
  slug,
  gradient,
  reserveHref,
  holdHref,
  seaPayHref,
  maxGuests,
  sqftRange,
  desc,
  features,
}: {
  type: string;
  ship: string;
  fromPerson: number;
  available: number;
  slug: string;
  gradient: string;
  reserveHref: string;
  holdHref: string;
  seaPayHref: string;
  maxGuests?: number;
  sqftRange?: string;
  desc?: string;
  features?: string[];
  // accepted for compatibility; not displayed (shown on page hero/ticket)
  durationRegion?: string;
  cruiseLine?: string;
  dateRangeLabel?: string;
  fromPort?: string;
}) {
  const title = /suite/i.test(type) ? type : `${type} Cabin`;

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0b1020] hover:border-white/25 transition-colors flex flex-col lg:flex-row">
      {/* Photo */}
      <div className="relative lg:w-80 h-52 lg:h-auto flex-shrink-0">
        <Photo
          src={`/cabins/${slug}.jpg`}
          fallbackSrc={`/ships/${shipSlug(ship)}.jpg`}
          alt={`Representative ${type} stateroom`}
          gradient={gradient}
          overlay={false}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020]/90 via-[#0b1020]/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0b1020]/40" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-extrabold text-2xl uppercase tracking-tight leading-none">
            {title}
          </h3>
          <div className="label-mono text-[10px] uppercase tracking-wider text-sky-300 mt-1.5">
            {sqftRange}
            {maxGuests ? ` · Sleeps up to ${maxGuests}` : ""}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 p-6 flex flex-col">
        {desc && (
          <p className="text-white/60 text-sm leading-relaxed mb-4">{desc}</p>
        )}

        {features && features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-5">
            {features.map((f) => (
              <div
                key={f}
                className="flex items-start gap-2 text-white/70 text-sm"
              >
                <span className="text-sky-400 flex-shrink-0">+</span>
                {f}
              </div>
            ))}
          </div>
        )}

        {/* Occupancy pricing + actions */}
        <div className="mt-auto border-t border-white/10 pt-4">
          {fromPerson > 0 ? (
            <OccupancyTiers
              pricePerPerson={fromPerson}
              maxGuests={maxGuests ?? 4}
              reserveBase={reserveHref}
            />
          ) : (
            <div className="text-white/55 text-sm">Call for pricing</div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <Link
              href={holdHref}
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
            >
              Hold a Room
            </Link>
            <Link
              href={seaPayHref}
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
            >
              Sea Pay™
            </Link>
          </div>
        </div>

        <div className="text-white/30 text-[10px] mt-3">
          Representative {type} stateroom · {available} available. Layout &amp;
          décor may vary.
        </div>
      </div>
    </div>
  );
}
