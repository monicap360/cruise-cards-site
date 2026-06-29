import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  allFeederSlugs,
  citiesInState,
  getFeederCity,
  getFeederState,
  nearbyCities,
  type FeederCity,
  type FeederState,
} from "@/lib/feeder";

export const dynamic = "force-static";

const PORT_DEST = "Port of Galveston Cruise Terminal, Galveston, TX 77550";

export function generateStaticParams() {
  return allFeederSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const state = getFeederState(slug);
  if (state) {
    return {
      title: `Cruises from ${state.state} to Galveston | Parking, Hotels & Transfers`,
      description: `Planning a Galveston cruise from ${state.state}? Compare driving vs. flying, find Park-Stay-Cruise hotels with parking and a port shuttle, and let us handle your Houston-airport transfer.`,
    };
  }
  const city = getFeederCity(slug);
  if (city) {
    return {
      title: `Cruises from ${city.city}, ${city.stateAbbr} to Galveston | Drive Time, Parking & Hotels`,
      description: `Cruising from ${city.city}, ${city.stateAbbr}? It's ${city.driveTime} (${city.miles} mi) to the Port of Galveston. Compare parking, Park-Stay-Cruise hotels, and Houston-airport transfers — we plan it all.`,
    };
  }
  return { title: "Cruises from Your City to Galveston" };
}

export default async function CruisesFromSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const state = getFeederState(slug);
  if (state) return <StatePage state={state} />;
  const city = getFeederCity(slug);
  if (city) return <CityPage city={city} />;
  notFound();
}

/* ── Shared bits ──────────────────────────────────────────────────────── */

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function pill(href: string, label: string) {
  return (
    <Link
      key={href + label}
      href={href}
      className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white label-mono text-[11px] uppercase tracking-wider px-4 py-2 rounded-full transition-all"
    >
      {label}
    </Link>
  );
}

/* ── City page ────────────────────────────────────────────────────────── */

function CityPage({ city }: { city: FeederCity }) {
  const stateSlug = city.state.toLowerCase().replace(/\s+/g, "-");
  const mapSrc = `https://maps.google.com/maps?saddr=${encodeURIComponent(
    city.city + ", " + city.stateAbbr
  )}&daddr=${encodeURIComponent(PORT_DEST)}&output=embed`;
  const nearby = nearbyCities(city, 4);

  const faqs = [
    {
      q: `How long is the drive from ${city.city} to Galveston?`,
      a: `It's roughly ${city.miles} miles from ${city.city}, ${city.stateAbbr} to the Port of Galveston — ${city.driveTime} of driving via ${city.route}. Use the live map above for exact, current directions.`,
    },
    {
      q: `Where do I park for a Galveston cruise?`,
      a: `You can park right at the Port of Galveston (reserve ahead, roughly from ~$90/week), or book a Park-Stay-Cruise hotel that bundles a pre-cruise night with free or discounted parking and a shuttle to the terminal — a favorite of ${city.city} cruisers.`,
    },
    {
      q: `Should I fly or drive from ${city.city}?`,
      a:
        city.mode === "fly"
          ? `From ${city.city}, flying is usually the smart move — driving is ${city.driveTime}. Fly into Houston (IAH or HOU) and we'll arrange a transfer to the Galveston terminal.`
          : city.mode === "drive"
          ? `From ${city.city}, driving is the easy choice — it's only ${city.driveTime} via ${city.route}, with no airport, no baggage fees, and no flight delays between you and the ship.`
          : `From ${city.city} it's a close call: driving is ${city.driveTime} (${city.miles} mi), or you can fly into Houston (IAH/HOU) and we'll handle the transfer. We'll help you compare total cost and time.`,
    },
    {
      q: `Are there hotels with parking and a shuttle near Galveston?`,
      a: `Yes — several Galveston and Houston-area hotels offer Park-Stay-Cruise packages that include a pre-cruise night, free or discounted parking for the length of your sailing, and a shuttle to the port. We'll match you to one that fits your travel plan.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const recommendation =
    city.mode === "fly"
      ? `Because ${city.city} is ${city.miles} miles out, most cruisers fly into Houston (IAH or HOU) and let us arrange the transfer to the port.`
      : city.mode === "drive"
      ? `Since ${city.city} is just ${city.driveTime} away, driving is the clear winner — park at the port or grab a Park-Stay-Cruise hotel the night before.`
      : `From ${city.city} both options work: drive down (${city.driveTime}) or fly into Houston. We'll help you weigh cost vs. time.`;

  return (
    <div className="bg-[#05070d] text-white">
      <JsonLd data={faqJsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 left-1/2 -translate-x-1/2 -top-40 opacity-[0.14]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Feeder market"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-5">
            Cruises from {city.city}, {city.stateAbbr}
            <br />
            <span className="text-holo">to Galveston</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mb-8">
            {city.city} to the Port of Galveston is {city.driveTime} ({city.miles}{" "}
            miles). We handle the details that trip people up — port parking,
            Park-Stay-Cruise hotels, and Houston-airport transfers — so your only
            job is to show up and sail.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/find"
              className="bg-white text-black font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-white/90 transition-all text-center"
            >
              Search Sailings
            </Link>
            <Link
              href="/reserve"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all text-center"
            >
              Plan My Trip
            </Link>
          </div>
        </div>
      </section>

      {/* Directions + map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              {"// Driving directions"}
            </div>
            <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-5">
              {city.city} → Port of Galveston
            </h2>
            <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mb-5">
              <div className="bg-[#0b1020] p-5">
                <div className="text-holo text-2xl font-bold">{city.miles}</div>
                <div className="text-white/45 label-mono text-[10px] uppercase mt-1">
                  Miles (approx)
                </div>
              </div>
              <div className="bg-[#0b1020] p-5">
                <div className="text-holo text-2xl font-bold leading-tight">
                  {city.driveTime.replace("about ", "")}
                </div>
                <div className="text-white/45 label-mono text-[10px] uppercase mt-1">
                  Drive time
                </div>
              </div>
              <div className="bg-[#0b1020] p-5">
                <div className="text-white text-sm font-semibold leading-snug">
                  {city.route}
                </div>
                <div className="text-white/45 label-mono text-[10px] uppercase mt-1">
                  Best route
                </div>
              </div>
            </div>
            <p className="text-white/55 text-sm leading-relaxed">
              {recommendation}
            </p>
          </div>
          <iframe
            title={`Map from ${city.city}, ${city.stateAbbr} to the Port of Galveston`}
            loading="lazy"
            className="w-full h-72 rounded-2xl border border-white/10"
            src={mapSrc}
          />
        </div>
      </section>

      {/* Parking vs Fly vs Shuttle table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
          {"// Getting there"}
        </div>
        <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-3">
          Park, Fly, or Shuttle?
        </h2>
        <p className="text-white/55 mb-6 max-w-2xl">{recommendation}</p>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full bg-[#0b1020] text-sm">
            <thead>
              <tr className="bg-[#05070d] text-white">
                <th className="px-5 py-4 text-left font-bold">Option</th>
                <th className="px-5 py-4 text-left font-bold">Cost</th>
                <th className="px-5 py-4 text-left font-bold">Time</th>
                <th className="px-5 py-4 text-left font-bold">Convenience</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  option: "Drive & park at the port",
                  cost: "from ~$90/wk parking",
                  time: city.driveTime,
                  conv:
                    city.mode === "drive"
                      ? "Simplest — your car waits at the terminal"
                      : "Long haul, but no flights or transfers",
                },
                {
                  option: "Drive + Park-Stay-Cruise hotel",
                  cost: "$$ (hotel bundles parking + shuttle)",
                  time: `${city.driveTime} + 1 night`,
                  conv:
                    "Most relaxed — arrive early, park free, shuttle to ship",
                },
                {
                  option: "Fly into Houston (IAH/HOU) + transfer",
                  cost: "$$$ (airfare + transfer)",
                  time: "Flight + ~1 hr to port",
                  conv:
                    city.mode === "fly"
                      ? "Recommended — fastest from here, we book the transfer"
                      : "Fastest door-to-door, we arrange the transfer",
                },
              ].map((row, i) => (
                <tr
                  key={row.option}
                  className={i % 2 === 0 ? "bg-[#0b1020]" : "bg-[#05070d]"}
                >
                  <td className="px-5 py-4 font-semibold text-white border-b border-white/10">
                    {row.option}
                  </td>
                  <td className="px-5 py-4 text-white/55 border-b border-white/10">
                    {row.cost}
                  </td>
                  <td className="px-5 py-4 text-white/55 border-b border-white/10">
                    {row.time}
                  </td>
                  <td className="px-5 py-4 text-white/55 border-b border-white/10">
                    {row.conv}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-white/40 text-xs mt-3">
          Costs are general ranges — we&apos;ll quote your exact parking, hotel,
          and transfer when we plan your trip.
        </p>
      </section>

      {/* Park, Stay & Cruise packages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-8 sm:p-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Park, Stay & Cruise"}
          </div>
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            Pre-cruise hotels with parking + a shuttle
          </h2>
          <p className="text-white/60 leading-relaxed mb-4 max-w-3xl">
            The #1 headache for {city.city} cruisers isn&apos;t the drive — it&apos;s
            what to do with the car and how to avoid a stressful sail-day morning.
            Park-Stay-Cruise hotel packages near Galveston solve both: you spend the
            night before in a comfortable room, leave your car parked free or
            discounted for the length of your sailing, and ride a shuttle straight to
            the terminal. Arrive rested, skip the dawn drive, and start your vacation
            the moment you check in.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              href="/add-ons"
              className="bg-white text-black font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-white/90 transition-all text-center"
            >
              See Package Add-Ons
            </Link>
            <Link
              href="/reserve"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all text-center"
            >
              Plan My Trip
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
          {"// FAQ"}
        </div>
        <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-8">
          Cruising from {city.city} — Common Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {faqs.map((f) => (
            <div key={f.q} className="bg-[#05070d] p-7">
              <h3 className="font-bold text-white text-base mb-2">{f.q}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
          {"// Keep planning"}
        </div>
        <div className="flex flex-wrap gap-2">
          {pill("/find", "Search Sailings")}
          {pill("/ships-from-galveston", "Ships from Galveston")}
          {pill("/add-ons", "Add-Ons & Packages")}
          {pill("/transportation", "Transportation")}
          {pill(`/cruises-from/${stateSlug}`, `All ${city.state} Cities`)}
          {nearby.map((n) =>
            pill(`/cruises-from/${n.slug}`, `From ${n.city}, ${n.stateAbbr}`)
          )}
        </div>
      </section>
    </div>
  );
}

/* ── State hub page ───────────────────────────────────────────────────── */

function StatePage({ state }: { state: FeederState }) {
  const cities = citiesInState(state.state);

  const faqs = [
    {
      q: `How far is Galveston from ${state.state}?`,
      a: `It depends on your city. ${cities
        .slice(0, 3)
        .map((c) => `${c.city} is ${c.driveTime}`)
        .join(", ")}. Pick your city below for exact directions, a live map, and a parking-vs-flying breakdown.`,
    },
    {
      q: `Is it better to drive or fly from ${state.state}?`,
      a: `Closer cities usually drive and park at the port (or use a Park-Stay-Cruise hotel), while farther ones fly into Houston and we arrange the transfer. Open your city page to compare cost and time.`,
    },
    {
      q: `Are there hotels with parking and a port shuttle?`,
      a: `Yes — Park-Stay-Cruise packages bundle a pre-cruise night with free or discounted parking and a shuttle to the Galveston terminal. We'll match ${state.state} travelers to one that fits.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="bg-[#05070d] text-white">
      <JsonLd data={faqJsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 left-1/2 -translate-x-1/2 -top-40 opacity-[0.14]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Feeder market"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-5">
            Cruises from {state.state}
            <br />
            <span className="text-holo">to Galveston</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mb-8">{state.intro}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/find"
              className="bg-white text-black font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-white/90 transition-all text-center"
            >
              Search Sailings
            </Link>
            <Link
              href="/reserve"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all text-center"
            >
              Plan My Trip
            </Link>
          </div>
        </div>
      </section>

      {/* City grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
          {"// Pick your city"}
        </div>
        <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-8">
          {state.state} Cities → Galveston
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((c) => (
            <Link
              key={c.slug}
              href={`/cruises-from/${c.slug}`}
              className="group bg-[#0b1020] border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-colors"
            >
              <h3 className="font-extrabold uppercase tracking-tight text-lg mb-1">
                {c.city}, {c.stateAbbr}
              </h3>
              <div className="text-sky-400 text-sm font-semibold">
                {c.miles} mi · {c.driveTime}
              </div>
              <span className="label-mono text-[10px] uppercase tracking-wider text-sky-400/70 group-hover:text-sky-300 transition-colors mt-4 inline-block">
                Cruises from {c.city} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Park, Stay & Cruise framing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-8 sm:p-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Park, Stay & Cruise"}
          </div>
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            Parking, hotels & transfers — handled
          </h2>
          <p className="text-white/60 leading-relaxed max-w-3xl">
            However you reach Galveston from {state.state}, we smooth out the parts
            that stress travelers: a Park-Stay-Cruise hotel the night before with free
            or discounted parking and a shuttle to the port, or — if you&apos;re
            flying — a transfer from Houston&apos;s airports (IAH/HOU) straight to the
            terminal. One plan, one team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              href="/find"
              className="bg-white text-black font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-white/90 transition-all text-center"
            >
              Search Sailings
            </Link>
            <Link
              href="/reserve"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all text-center"
            >
              Plan My Trip
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
          {"// FAQ"}
        </div>
        <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-8">
          Cruising from {state.state} — Common Questions
        </h2>
        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {faqs.map((f) => (
            <div key={f.q} className="bg-[#05070d] p-7">
              <h3 className="font-bold text-white text-base mb-2">{f.q}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
