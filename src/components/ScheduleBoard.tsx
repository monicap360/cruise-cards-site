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
      <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-5 border-b border-white/10 flex-wrap">
        <CruiseLineLogo line={cruiseLine} className="h-7 sm:h-8 w-auto" />
        <h3 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-white text-center flex-1 min-w-[12rem]">
          {ship} <span className="text-holo">Cruise Schedule</span>
        </h3>
        <span className="hud label-mono text-[11px] uppercase tracking-wider text-white px-3 py-1.5 rounded-full whitespace-nowrap">
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
