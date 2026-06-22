import Link from "next/link";

const deals = [
  {
    name: "Caribbean Classic",
    line: "Carnival Cruise Line",
    ship: "Carnival Breeze",
    nights: 7,
    destination: "Cozumel, Roatán & Belize",
    price: 549,
    badge: "🔥 Hot Deal",
    badgeColor: "bg-red-500",
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
    badge: "⭐ Popular",
    badgeColor: "bg-blue-600",
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
    badge: "✈️ Best Value",
    badgeColor: "bg-teal-600",
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
    badge: "🌴 Extended",
    badgeColor: "bg-green-600",
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
    badge: "⚡ Short Trip",
    badgeColor: "bg-orange-500",
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
    badge: "🌊 Adventure",
    badgeColor: "bg-purple-600",
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
    badge: "✨ Family Fave",
    badgeColor: "bg-yellow-500",
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
    badge: "💙 Galveston Special",
    badgeColor: "bg-blue-700",
    departs: "Every Friday",
    seaPay: false,
    hold: true,
  },
];

export default function DealsPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
            ⚓ Departing from Galveston, TX
          </div>
          <h1 className="text-5xl font-extrabold mb-4">Cruise Deals</h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            Every cruise below departs directly from the Port of Galveston —
            no airports, no hassle, just set sail!
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center text-sm font-semibold">
            <span className="bg-green-600/20 text-green-300 border border-green-500/30 px-4 py-1.5 rounded-full">
              💳 Sea Pay — Set your own payment schedule
            </span>
            <span className="bg-yellow-500/20 text-yellow-200 border border-yellow-400/30 px-4 py-1.5 rounded-full">
              🔒 Hold a Room — 24, 48 or 72 hours
            </span>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.name}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-900 h-44 flex flex-col items-center justify-center relative">
                <span className="text-7xl">🚢</span>
                <span className="text-white/80 text-sm mt-1 font-medium">
                  {deal.ship}
                </span>
                <span
                  className={`absolute top-3 left-3 ${deal.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}
                >
                  {deal.badge}
                </span>
                <span className="absolute top-3 right-3 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {deal.nights} Nights
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-1">
                  {deal.line}
                </div>
                <h3 className="font-extrabold text-blue-900 text-xl mb-1">
                  {deal.name}
                </h3>
                <p className="text-gray-500 text-sm mb-1">
                  📍 {deal.destination}
                </p>
                <p className="text-gray-400 text-xs mb-4">
                  🗓 Departs: {deal.departs} from Galveston
                </p>

                {/* Price + Book */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-4">
                  <div>
                    <span className="text-gray-400 text-xs block">From</span>
                    <span className="text-red-600 font-extrabold text-2xl">
                      ${deal.price}
                    </span>
                    <span className="text-gray-400 text-xs"> /person</span>
                  </div>
                  <Link
                    href="/contact"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-full text-sm transition-all"
                  >
                    Book Now
                  </Link>
                </div>

                {/* Sea Pay + Hold row */}
                <div className="flex gap-2 flex-wrap mt-auto">
                  {deal.seaPay ? (
                    <Link
                      href={`/sea-pay/plan?ship=${encodeURIComponent(deal.ship)}`}
                      className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
                    >
                      💳 Sea Pay Available
                    </Link>
                  ) : (
                    <span className="flex-1 text-center bg-gray-100 text-gray-400 text-xs font-bold px-3 py-2 rounded-xl cursor-default">
                      Sea Pay N/A
                    </span>
                  )}
                  {deal.hold ? (
                    <Link
                      href={`/hold?ship=${encodeURIComponent(deal.ship)}&name=${encodeURIComponent(deal.name)}`}
                      className="flex-1 text-center bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
                    >
                      🔒 Hold a Room
                    </Link>
                  ) : (
                    <span className="flex-1 text-center bg-gray-100 text-gray-400 text-xs font-bold px-3 py-2 rounded-xl cursor-default">
                      Hold N/A
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <div className="font-extrabold text-green-800 text-sm mb-1">
              💳 What is Sea Pay?
            </div>
            <p className="text-green-700 text-sm leading-relaxed">
              Sea Pay lets you set your own payment schedule — weekly, bi-weekly, or custom dates you choose. A one-time $49.99 Sea Pay fee applies. Miss a payment? A $35 late fee is charged.{" "}
              <Link href="/sea-pay" className="font-bold underline">
                Learn more →
              </Link>
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
            <div className="font-extrabold text-yellow-800 text-sm mb-1">
              🔒 What is a Room Hold?
            </div>
            <p className="text-yellow-700 text-sm leading-relaxed">
              Not quite ready? Hold your cabin for 24, 48, or 72 hours while you finalize plans. Holds are not available for sailings within 30 days.{" "}
              <Link href="/hold" className="font-bold underline">
                Request a hold →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-blue-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-3">
            Don&apos;t see what you&apos;re looking for?
          </h2>
          <p className="text-blue-200 mb-6">
            We have access to hundreds of Galveston cruise departures. Contact
            us and we&apos;ll find the perfect cruise for you.
          </p>
          <Link
            href="/contact"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-full text-lg transition-all shadow-lg inline-block"
          >
            Contact a Cruise Specialist
          </Link>
        </div>
      </section>
    </div>
  );
}
