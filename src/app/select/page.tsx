import Link from "next/link";
import ShipImage from "@/components/ShipImage";
import { GALVESTON_FLEET, type FleetShip } from "@/lib/seed-inventory";

export const metadata = {
  title: "Select Your Cruise — Lines & Ships from Galveston",
  description:
    "Pick your cruise line and ship sailing from Galveston — Carnival, Royal Caribbean, MSC, Norwegian & Disney. Choose a ship to start booking.",
};

function byLine(): [string, FleetShip[]][] {
  const map: Record<string, FleetShip[]> = {};
  for (const s of GALVESTON_FLEET) {
    (map[s.cruiseLine] ??= []).push(s);
  }
  return Object.entries(map);
}

export default function SelectPage() {
  const lines = byLine();

  return (
    <div className="bg-[#05070d] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-6">
            {"// Choose Your Ship"}
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-5 max-w-3xl">
            Select Your <span className="text-holo">Cruise</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Pick a cruise line, choose your ship, and we&apos;ll take it from there.
            Every ship below sails right from the Port of Galveston.
          </p>
        </div>
      </section>

      {/* Lines + ships */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {lines.map(([line, ships]) => (
          <div key={line}>
            <div className="flex items-end justify-between flex-wrap gap-2 mb-6">
              <Link
                href={`/sailings?line=${encodeURIComponent(line)}`}
                className="group inline-flex items-center gap-2"
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.01em] group-hover:text-sky-300 transition-colors">
                  {line}
                </h2>
                <span className="text-white/30 group-hover:text-sky-400 transition-colors text-xl">
                  →
                </span>
              </Link>
              <Link
                href={`/sailings?line=${encodeURIComponent(line)}`}
                className="label-mono text-[11px] uppercase tracking-wider text-sky-400/70 hover:text-white transition-colors"
              >
                See all dates →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ships.map((s) => (
                <Link
                  key={s.ship}
                  href={`/sailings?ship=${encodeURIComponent(s.ship)}`}
                  className="group bg-[#0b1020] rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-colors flex flex-col"
                >
                  <ShipImage ship={s.ship} className="h-40" />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="label-mono text-[10px] text-sky-400/70 uppercase mb-1">
                      {s.cruiseLine}
                    </div>
                    <h3 className="font-bold text-white text-lg uppercase tracking-tight mb-1">
                      {s.ship}
                    </h3>
                    <p className="text-white/45 text-sm">{s.itinerary}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {s.durationLabel} · from Galveston
                    </p>
                    {s.seasonalNote && (
                      <p className="label-mono text-[10px] uppercase text-sky-400/70 mt-2">
                        {s.seasonalNote}
                      </p>
                    )}
                    <span className="label-mono text-[11px] uppercase tracking-wider text-white/40 group-hover:text-sky-400/80 transition-colors mt-auto pt-5">
                      Select this ship →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Help CTA */}
      <section className="border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            Not sure which ship?
          </h2>
          <p className="text-white/55 text-lg mb-8">
            Tell us how you like to cruise and a Galveston specialist will match you
            to the perfect ship and sailing.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Talk to a Specialist
            </Link>
            <Link
              href="/ships-from-galveston"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Compare Ships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
