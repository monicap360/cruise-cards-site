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
 * Live ship sailing schedule — a date-badge grid (like a printed cruise
 * calendar) generated from real inventory. Every date links to its booking page.
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
  const rows = limit ? sailings.slice(0, limit) : sailings;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-3">
      {rows.map((s) => {
        const d = new Date(s.sailingDate + "T12:00:00");
        const day = String(d.getDate()).padStart(2, "0");
        const weekday = d
          .toLocaleDateString("en-US", { weekday: "short" })
          .toUpperCase();
        const monthYear = d
          .toLocaleDateString("en-US", { month: "long", year: "numeric" })
          .toUpperCase();
        return (
          <Link
            key={s.id}
            href={`/sailings/${s.id}`}
            className="group flex items-center gap-3 rounded-xl p-2 -m-2 hover:bg-white/5 transition-colors"
          >
            <span className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 text-[#05070d] font-extrabold text-xl flex items-center justify-center">
              {day}
            </span>
            <div className="min-w-0">
              <div className="font-bold text-white text-sm leading-tight">
                {weekday} {monthYear}
              </div>
              <div className="text-white/50 text-xs">
                {s.nights}-{dur === "days" ? "DAY" : "NIGHT"}{" "}
                {regionOf(s.itinerary)}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
