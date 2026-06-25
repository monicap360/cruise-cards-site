import Link from "next/link";
import Photo from "@/components/Photo";
import { fmt$ } from "@/lib/sea-pay";

/**
 * Representative-stateroom showcase: a full cabin photo with a frosted glass
 * info panel (category, ship, dates, from-price per person, fees-included note,
 * and the "layout & décor may vary" disclaimer). Drop a real photo in at
 * /public/cabins/<slug>.jpg; a clean gradient shows until then.
 */
export default function CabinShowcase({
  type,
  durationRegion,
  ship,
  cruiseLine,
  dateRangeLabel,
  fromPort,
  fromPerson,
  available,
  slug,
  gradient,
  reserveHref,
  holdHref,
  seaPayHref,
}: {
  type: string;
  durationRegion: string;
  ship: string;
  cruiseLine: string;
  dateRangeLabel: string;
  fromPort: string;
  fromPerson: number;
  available: number;
  slug: string;
  gradient: string;
  reserveHref: string;
  holdHref: string;
  seaPayHref: string;
}) {
  const title = /suite/i.test(type) ? type : `${type} Cabin`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10">
      {/* Representative stateroom photo */}
      <Photo
        src={`/cabins/${slug}.jpg`}
        alt={`Representative ${type} stateroom`}
        gradient={gradient}
        overlay={false}
        className="absolute inset-0"
      />
      {/* Readability wash behind the panel (left → right) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/70 via-[#05070d]/15 to-transparent" />

      <div className="relative z-10 p-4 sm:p-6 min-h-[380px] flex">
        {/* Frosted info panel */}
        <div className="w-full sm:max-w-sm rounded-2xl bg-white/90 backdrop-blur-md ring-1 ring-white/70 shadow-2xl p-6 text-[#0a1f44] flex flex-col">
          <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            {title}
          </h3>
          <div className="text-lg font-bold mt-1">{durationRegion}</div>
          <div className="text-base font-bold text-[#0369a1]">{ship}</div>
          <div className="label-mono text-[10px] uppercase tracking-wider text-[#0a1f44]/55 mt-0.5">
            {cruiseLine}
          </div>

          <div className="mt-4 text-sm font-semibold">{dateRangeLabel}</div>
          <div className="text-sm text-[#0a1f44]/75">from {fromPort}, TX</div>

          {fromPerson > 0 && (
            <div className="mt-4 border-t border-[#0a1f44]/15 pt-3">
              <div className="text-base">
                From{" "}
                <span className="text-3xl font-extrabold">
                  {fmt$(fromPerson)}
                </span>{" "}
                <span className="text-sm font-semibold">per person</span>
              </div>
              <div className="text-xs text-[#0a1f44]/70 mt-0.5">
                Port fees &amp; taxes included
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={reserveHref}
              className="bg-[#0a1f44] text-white hover:bg-[#0a1f44]/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
            >
              Reserve
            </Link>
            <Link
              href={holdHref}
              className="border border-[#0a1f44]/30 hover:border-[#0a1f44]/70 text-[#0a1f44] font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
            >
              Hold a Room
            </Link>
            <Link
              href={seaPayHref}
              className="border border-[#0a1f44]/30 hover:border-[#0a1f44]/70 text-[#0a1f44] font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
            >
              Sea Pay™
            </Link>
          </div>

          <div className="mt-auto pt-4 text-[11px] leading-snug text-[#0a1f44]/60">
            Representative {type} stateroom · {available} open. Layout &amp;
            décor may vary.
          </div>
        </div>
      </div>
    </div>
  );
}
