import Link from "next/link";
import ShipImage from "@/components/ShipImage";

export const metadata = {
  title: "Cruise Deals from Galveston",
  description:
    "Current cruise deals departing the Port of Galveston — Carnival, Royal Caribbean, Norwegian, MSC & Disney to Cozumel, the Bahamas & the Western Caribbean. Low deposits and Sea Pay™ payment plans.",
};

const deals = [
  {
    name: "Caribbean Classic",
    line: "Carnival Cruise Line",
    ship: "Carnival Breeze",
    nights: 7,
    destination: "Cozumel, Roatán & Belize",
    price: 549,
    badge: "Hot Deal",
    badgeColor: "bg-sky-400 text-black",
    departs: "Every Sunday",
    seaPay: true,
    hold: true,
  },
  {
    name: "Bahamas Getaway",
    line: "Royal Caribbean",
    ship: "Liberty of the Seas",
    nights: 5,
    destination: "Nassau & CocoCay",
    price: 399,
    badge: "Popular",
    badgeColor: "bg-white text-black",
    departs: "Every Saturday",
    seaPay: true,
    hold: true,
  },
  {
    name: "Mexico Explorer",
    line: "Norwegian Cruise Line",
    ship: "Norwegian Breakaway",
    nights: 4,
    destination: "Cozumel & Progreso",
    price: 329,
    badge: "Best Value",
    badgeColor: "bg-white/10 text-white border border-white/20",
    departs: "Every Thursday",
    seaPay: true,
    hold: true,
  },
  {
    name: "Western Caribbean",
    line: "Carnival Cruise Line",
    ship: "Carnival Vista",
    nights: 8,
    destination: "Montego Bay, Grand Cayman & Cozumel",
    price: 699,
    badge: "Extended",
    badgeColor: "bg-white/10 text-white border border-white/20",
    departs: "Select Saturdays",
    seaPay: true,
    hold: true,
  },
  {
    name: "Cozumel Quick Escape",
    line: "Carnival Cruise Line",
    ship: "Carnival Freedom",
    nights: 3,
    destination: "Cozumel, Mexico",
    price: 249,
    badge: "Short Trip",
    badgeColor: "bg-white/10 text-white border border-white/20",
    departs: "Every Monday",
    seaPay: false,
    hold: true,
  },
  {
    name: "Eastern Caribbean Adventure",
    line: "Royal Caribbean",
    ship: "Mariner of the Seas",
    nights: 7,
    destination: "Puerto Rico, St. Thomas & Nassau",
    price: 649,
    badge: "Adventure",
    badgeColor: "bg-white/10 text-white border border-white/20",
    departs: "Select Sundays",
    seaPay: true,
    hold: true,
  },
  {
    name: "Western Caribbean Deluxe",
    line: "Disney Cruise Line",
    ship: "Disney Wonder",
    nights: 7,
    destination: "Key West, Grand Cayman & Cozumel",
    price: 1099,
    badge: "Family Fave",
    badgeColor: "bg-white/10 text-white border border-white/20",
    departs: "Select Saturdays",
    seaPay: true,
    hold: true,
  },
  {
    name: "Gulf of Mexico Getaway",
    line: "Norwegian Cruise Line",
    ship: "Norwegian Sky",
    nights: 4,
    destination: "Progreso & Cozumel",
    price: 299,
    badge: "Galveston Special",
    badgeColor: "bg-sky-400 text-black",
    departs: "Every Friday",
    seaPay: false,
    hold: true,
  },
];

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>;
}) {
  const { to } = await searchParams;
  const port = to?.trim();
  const filteredDeals = port
    ? deals.filter((d) =>
        d.destination.toLowerCase().includes(port.toLowerCase())
      )
    : deals;

  return (
    <div className="bg-[#05070d]">
      {/* Header */}
      <section className="bg-[#05070d] text-white relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-bg" />
        <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Departing from Galveston, TX"}</div>
          <h1 className="text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            {port ? `Cruises to ${port}` : "Cruise Deals"}
          </h1>
          <p className="text-white/55 text-xl max-w-2xl mx-auto">
            {port
              ? `Every sailing below visits ${port} and departs directly from the Port of Galveston.`
              : "Every cruise below departs directly from the Port of Galveston — no airports, no hassle, just set sail!"}
          </p>
          {port && (
            <div className="mt-6">
              <Link
                href="/deals"
                className="inline-block border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
              >
                View all cruise deals
              </Link>
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3 justify-center text-sm font-semibold">
            <span className="bg-[#0b1020] text-white/55 border border-white/10 px-4 py-1.5 rounded-full">
              Sea Pay — Set your own payment schedule
            </span>
            <span className="bg-[#0b1020] text-white/55 border border-white/10 px-4 py-1.5 rounded-full">
              Hold a Room — 24, 48 or 72 hours
            </span>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12 max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] text-white mb-2">
              No published deals to {port} right now
            </h2>
            <p className="text-white/55 mb-6">
              We have access to hundreds of Galveston departures that aren&apos;t
              all listed here. Tell us your dates and we&apos;ll find a sailing to{" "}
              {port} for you.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Ask a Specialist About {port}
            </Link>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <div
              key={deal.name}
              className="bg-[#0b1020] border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-all flex flex-col"
            >
              <div className="relative h-44 border-b border-white/10 overflow-hidden">
                <ShipImage ship={deal.ship} className="absolute inset-0" />
                <span className="absolute bottom-3 left-4 z-10 text-white/90 label-mono text-[11px] uppercase tracking-wide">
                  {deal.ship}
                </span>
                <span className="absolute top-3 left-3 z-10 hud text-white label-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                  {deal.badge}
                </span>
                <span className="absolute top-3 right-3 z-10 bg-black/40 text-white border border-white/20 label-mono text-[10px] uppercase px-3 py-1 rounded-full">
                  {deal.nights} Nights
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-1">
                  {deal.line}
                </div>
                <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-xl mb-1">
                  {deal.name}
                </h3>
                <p className="text-white/55 text-sm mb-1">
                  {deal.destination}
                </p>
                <p className="text-white/45 text-xs mb-4">
                  Departs: {deal.departs} from Galveston
                </p>

                {/* Price + Book */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                  <div>
                    <span className="text-white/45 text-xs block">From</span>
                    <span className="text-white font-extrabold text-2xl">
                      ${deal.price}
                    </span>
                    <span className="text-white/45 text-xs"> /person</span>
                  </div>
                  <Link
                    href={`/sailings?ship=${encodeURIComponent(deal.ship)}`}
                    className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
                  >
                    See Dates →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* Info bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-5">
            <div className="font-extrabold uppercase tracking-[-0.01em] text-white text-sm mb-1">
              What is Sea Pay?
            </div>
            <p className="text-white/55 text-sm leading-relaxed">
              Sea Pay lets you set your own payment schedule — weekly, bi-weekly, or custom dates you choose. A one-time $49.99 Sea Pay fee applies. Miss a payment? A $35 late fee is charged.{" "}
              <Link href="/sea-pay" className="font-semibold text-sky-400 hover:text-sky-300 underline">
                Learn more
              </Link>
            </p>
          </div>
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-5">
            <div className="font-extrabold uppercase tracking-[-0.01em] text-white text-sm mb-1">
              What is a Room Hold?
            </div>
            <p className="text-white/55 text-sm leading-relaxed">
              Not quite ready? Hold your cabin for 24, 48, or 72 hours while you finalize plans. Holds are not available for sailings within 30 days.{" "}
              <Link href="/hold" className="font-semibold text-sky-400 hover:text-sky-300 underline">
                Request a hold
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#05070d] border-t border-white/10 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-3">
            Don&apos;t see what you&apos;re looking for?
          </h2>
          <p className="text-white/55 mb-6">
            We have access to hundreds of Galveston cruise departures. Contact
            us and we&apos;ll find the perfect cruise for you.
          </p>
          <Link
            href="/contact"
            className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all inline-block"
          >
            Contact a Cruise Specialist
          </Link>
        </div>
      </section>
    </div>
  );
}
