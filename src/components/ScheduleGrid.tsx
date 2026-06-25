import Link from "next/link";
import { durationWord } from "@/lib/sea-pay";

type Sail = {
  id: string;
  sailingDate: string;
  nights: number;
  itinerary: string;
};

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

/**
 * Live ship sailing schedule — a grid of futuristic, clickable date tiles
 * generated from real inventory. Every tile links to its booking page.
 */
export default function ScheduleGrid({
  cruiseLine,
  sailings,
  limit,
}: {
  cruiseLine: string;
  sailings: Sail[];
  limit?: number;
}) {
  const dur = durationWord(cruiseLine);
  const word = dur === "days" ? "DAY" : "NIGHT";
  const rows = limit ? sailings.slice(0, limit) : sailings;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {rows.map((s) => {
        const d = new Date(s.sailingDate + "T12:00:00");
        const day = String(d.getDate()).padStart(2, "0");
        const weekday = d
          .toLocaleDateString("en-US", { weekday: "short" })
          .toUpperCase();
        const monthYear = d
          .toLocaleDateString("en-US", { month: "short", year: "numeric" })
          .toUpperCase();
        return (
          <Link
            key={s.id}
            href={`/sailings/${s.id}`}
            className="group relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 overflow-hidden hover:border-sky-400/50 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-200"
          >
            {/* hover accent line */}
            <span className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* day badge */}
            <span className="relative flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex flex-col items-center justify-center leading-none shadow-[0_0_20px_-6px_rgba(56,189,248,0.7)]">
              <span className="text-[#05070d] font-extrabold text-2xl">
                {day}
              </span>
              <span className="text-[#05070d]/70 font-bold text-[9px] tracking-wider mt-0.5">
                {weekday}
              </span>
            </span>

            <div className="min-w-0 flex-1">
              <div className="font-bold text-white text-sm leading-tight">
                {monthYear}
              </div>
              <div className="text-white/50 text-xs mt-0.5">
                {s.nights}-{word} {regionOf(s.itinerary)}
              </div>
              <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/0 group-hover:text-sky-300 transition-colors mt-1.5">
                Select this date →
              </div>
            </div>

            {/* chevron */}
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 flex-shrink-0 text-white/25 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        );
      })}
    </div>
  );
}
