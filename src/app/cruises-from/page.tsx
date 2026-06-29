import Link from "next/link";
import type { Metadata } from "next";
import { FEEDER_STATES, citiesInState } from "@/lib/feeder";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Cruises from Your City to Galveston | Drive Times, Parking & Hotels",
  description:
    "Find your city's path to a Galveston cruise. Drive times, parking, Park-Stay-Cruise hotels, and Houston-airport transfers for feeder cities across Texas, Oklahoma, Louisiana, and beyond.",
};

export default function CruisesFromIndexPage() {
  return (
    <div className="bg-[#05070d] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 left-1/2 -translate-x-1/2 -top-40 opacity-[0.14]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Feeder markets"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-5">
            Cruises from Your City
            <br />
            <span className="text-holo">to Galveston</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mb-8">
            Galveston is the drive-to cruise capital of the South. Pick your city
            or state for exact drive times, a live map, a parking-vs-flying
            breakdown, and the Park-Stay-Cruise hotels and Houston-airport
            transfers we set up for you.
          </p>
          <Link
            href="/find"
            className="bg-white text-black font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-white/90 transition-all inline-block"
          >
            Search Sailings
          </Link>
        </div>
      </section>

      {/* States + cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="space-y-10">
          {FEEDER_STATES.map((state) => {
            const cities = citiesInState(state.state);
            if (cities.length === 0) return null;
            return (
              <div key={state.slug}>
                <Link
                  href={`/cruises-from/${state.slug}`}
                  className="group inline-flex items-baseline gap-3 mb-5"
                >
                  <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.01em] group-hover:text-holo transition-colors">
                    {state.state}
                  </h2>
                  <span className="label-mono text-[10px] uppercase tracking-wider text-sky-400/70 group-hover:text-sky-300 transition-colors">
                    State hub →
                  </span>
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
                  {cities.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/cruises-from/${c.slug}`}
                      className="bg-[#05070d] p-5 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="font-bold text-white uppercase tracking-tight text-sm">
                        {c.city}, {c.stateAbbr}
                      </div>
                      <div className="text-white/45 label-mono text-[10px] uppercase mt-1">
                        {c.miles} mi · {c.driveTime}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
