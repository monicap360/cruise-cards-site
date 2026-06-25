import Link from "next/link";
import ShipImage from "@/components/ShipImage";
import CruiseLineLogo from "@/components/CruiseLineLogo";
import ScheduleGrid from "@/components/ScheduleGrid";
import { durationWord } from "@/lib/sea-pay";

type Sail = {
  id: string;
  sailingDate: string;
  nights: number;
  itinerary: string;
};

/**
 * Poster-style sailing schedule: ship hero banner + branded header (cruise-line
 * logo, ship name, length) over a live date-badge grid. Inspired by the printed
 * Carnival schedule sheets.
 */
export default function ScheduleBoard({
  ship,
  cruiseLine,
  sailings,
  limit,
}: {
  ship: string;
  cruiseLine: string;
  sailings: Sail[];
  limit?: number;
}) {
  const dur = durationWord(cruiseLine);
  const word = dur === "days" ? "DAY" : "NIGHT";
  const lengths = Array.from(new Set(sailings.map((s) => s.nights)));
  const lenLabel =
    lengths.length === 1 ? `${lengths[0]}-${word} CRUISES` : "ALL SAILINGS";

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0b1020]">
      {/* Ship hero banner */}
      <div className="relative h-40 sm:h-56">
        <ShipImage ship={ship} overlay={false} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020] via-[#0b1020]/10 to-transparent" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
      </div>

      {/* Branded header band */}
      <div className="px-5 sm:px-8 py-7 border-b border-white/10 text-center">
        <div className="flex items-center justify-center mb-3">
          <CruiseLineLogo line={cruiseLine} className="h-7 sm:h-8 w-auto" />
        </div>
        <h3 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] text-white leading-none">
          {ship}
        </h3>
        <div className="flex items-center justify-center gap-3 mt-3.5">
          <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-sky-400/60" />
          <span className="label-mono text-[11px] uppercase tracking-[0.28em] text-sky-400/90">
            Cruise Schedule
          </span>
          <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-sky-400/60" />
        </div>
        <span className="inline-block mt-4 hud label-mono text-[11px] uppercase tracking-wider text-white px-4 py-1.5 rounded-full">
          {lenLabel}
        </span>
      </div>

      {/* Date-badge grid */}
      <div className="p-5 sm:p-8">
        <ScheduleGrid cruiseLine={cruiseLine} sailings={sailings} limit={limit} />
        <div className="mt-7 flex justify-center">
          <Link
            href={`/sailings?ship=${encodeURIComponent(ship)}`}
            className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-7 py-3 rounded-full transition-all"
          >
            Pick a date &amp; price →
          </Link>
        </div>
      </div>
    </div>
  );
}
