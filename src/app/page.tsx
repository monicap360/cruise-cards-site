import Link from "next/link";

const features = [
  {
    icon: "🚢",
    title: "Galveston Departures",
    desc: "All cruises depart from the Port of Galveston — no flying required!",
  },
  {
    icon: "💰",
    title: "Best Price Guarantee",
    desc: "We find the best deals on Caribbean, Mexico, and Bahamas cruises.",
  },
  {
    icon: "🌟",
    title: "Expert Guidance",
    desc: "Our cruise specialists help you pick the perfect ship and itinerary.",
  },
  {
    icon: "📋",
    title: "Hassle-Free Booking",
    desc: "We handle every detail from booking to boarding day.",
  },
];

const featuredDeals = [
  {
    name: "Caribbean Paradise",
    line: "Carnival Cruise Line",
    nights: 7,
    destination: "Cozumel, Roatán & Belize",
    price: 549,
    badge: "🔥 Hot Deal",
    badgeColor: "bg-red-500",
  },
  {
    name: "Bahamas Getaway",
    line: "Royal Caribbean",
    nights: 5,
    destination: "Nassau & CocoCay",
    price: 399,
    badge: "⭐ Popular",
    badgeColor: "bg-blue-600",
  },
  {
    name: "Mexico Explorer",
    line: "Norwegian Cruise Line",
    nights: 4,
    destination: "Cozumel & Progreso",
    price: 329,
    badge: "✈️ New Route",
    badgeColor: "bg-teal-600",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
              ⚓ Sailing from Galveston, Texas
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
              Set Sail on Your
              <span className="text-red-400"> Dream Cruise</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              The Cruise Experience Center is Galveston&apos;s premier cruise
              specialist. Discover incredible deals on Caribbean, Bahamas, and
              Mexico cruises — all departing right from your backyard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/deals"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg text-center"
              >
                Browse Cruise Deals 🚢
              </Link>
              <Link
                href="/ships-from-galveston"
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg text-center"
              >
                Ships from Galveston
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-3">
            Why Book With Us?
          </h2>
          <p className="text-gray-500 text-lg">
            We make cruise planning easy, affordable, and fun.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-blue-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Deals */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-3">
              Featured Cruise Deals
            </h2>
            <p className="text-gray-500 text-lg">
              Handpicked deals — all departing from Galveston.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDeals.map((deal) => (
              <div
                key={deal.name}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 h-40 flex items-center justify-center relative">
                  <span className="text-7xl">🚢</span>
                  <span
                    className={`absolute top-3 left-3 ${deal.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}
                  >
                    {deal.badge}
                  </span>
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-1">
                    {deal.line}
                  </div>
                  <h3 className="font-extrabold text-blue-900 text-xl mb-1">
                    {deal.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    📍 {deal.destination}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-xs">From</span>
                      <div className="text-red-600 font-extrabold text-2xl">
                        ${deal.price}
                        <span className="text-sm text-gray-400 font-normal">
                          /pp
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {deal.nights} nights
                      </span>
                    </div>
                    <Link
                      href="/contact"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-full text-sm transition-all"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/deals"
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-full text-lg transition-all shadow-lg inline-block"
            >
              View All Deals →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-red-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4">
            Ready to Set Sail? ⚓
          </h2>
          <p className="text-red-100 text-lg mb-8">
            Contact our cruise specialists today and let us plan your perfect
            vacation from the Port of Galveston.
          </p>
          <Link
            href="/contact"
            className="bg-white text-red-600 hover:bg-red-50 font-extrabold px-10 py-4 rounded-full text-lg transition-all shadow-lg inline-block"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
