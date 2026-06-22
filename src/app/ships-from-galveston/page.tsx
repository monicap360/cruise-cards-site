import Link from "next/link";

const cruiseLines = [
  {
    name: "Carnival Cruise Line",
    color: "from-red-500 to-red-700",
    ships: [
      { ship: "Carnival Breeze", destinations: "Western Caribbean — Cozumel, Roatán, Belize" },
      { ship: "Carnival Freedom", destinations: "Cozumel Short Getaways (3–4 nights)" },
      { ship: "Carnival Vista", destinations: "Extended Caribbean (7–8 nights)" },
      { ship: "Carnival Dream", destinations: "Western Caribbean — Grand Cayman, Cozumel" },
    ],
    description:
      "Carnival offers the most frequent sailings from Galveston with multiple ships year-round. Great for families and first-time cruisers.",
    emoji: "🎉",
  },
  {
    name: "Royal Caribbean",
    color: "from-blue-500 to-blue-800",
    ships: [
      { ship: "Liberty of the Seas", destinations: "Bahamas — Nassau & CocoCay (5 nights)" },
      { ship: "Mariner of the Seas", destinations: "Eastern Caribbean — St. Thomas, Puerto Rico" },
      { ship: "Voyager of the Seas", destinations: "Western Caribbean — Cozumel, Grand Cayman" },
    ],
    description:
      "Royal Caribbean brings world-class amenities and exciting activities aboard. Perfect for adventure seekers and families.",
    emoji: "👑",
  },
  {
    name: "Norwegian Cruise Line",
    color: "from-teal-500 to-teal-700",
    ships: [
      { ship: "Norwegian Breakaway", destinations: "Mexico — Cozumel & Progreso (4 nights)" },
      { ship: "Norwegian Sky", destinations: "Gulf of Mexico Getaway (4 nights)" },
      { ship: "Norwegian Joy", destinations: "Caribbean — Roatán, Belize & Cozumel" },
    ],
    description:
      "Norwegian's Freestyle Cruising gives you ultimate flexibility. Dine when you want, do what you want — your cruise, your way.",
    emoji: "🌊",
  },
  {
    name: "Disney Cruise Line",
    color: "from-yellow-400 to-orange-500",
    ships: [
      { ship: "Disney Wonder", destinations: "Western Caribbean — Key West, Grand Cayman & Cozumel" },
      { ship: "Disney Magic", destinations: "Bahamas & Caribbean select sailings" },
    ],
    description:
      "The most magical cruise experience at sea! Disney Wonder sails seasonally from Galveston — perfect for families with kids.",
    emoji: "✨",
  },
];

const portFacts = [
  { icon: "📍", title: "Location", value: "2502 Harborside Dr, Galveston, TX 77550" },
  { icon: "🅿️", title: "Parking", value: "On-site parking available at the terminal" },
  { icon: "🚗", title: "Drive Time", value: "~50 miles from Houston — about 1 hour" },
  { icon: "🚢", title: "Terminals", value: "Terminal 1, 2, and the Cruise Terminal 25" },
  { icon: "📅", title: "Year-Round", value: "Ships depart every week of the year" },
  { icon: "🛳️", title: "Volume", value: "One of the busiest cruise ports in the US" },
];

export default function ShipsFromGalvestonPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
            🚢 Port of Galveston, Texas
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            Ships from Galveston
          </h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            Galveston is one of America&apos;s top cruise ports. Skip the airport
            and drive straight to your vacation — all major cruise lines depart
            from right here in Texas.
          </p>
        </div>
      </section>

      {/* Port Facts */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-blue-900 text-center mb-8">
            Port of Galveston — Quick Facts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {portFacts.map((fact) => (
              <div
                key={fact.title}
                className="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100"
              >
                <div className="text-3xl mb-2">{fact.icon}</div>
                <div className="font-bold text-blue-900 text-xs uppercase tracking-wide mb-1">
                  {fact.title}
                </div>
                <div className="text-gray-500 text-xs leading-snug">
                  {fact.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cruise Lines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-3">
            Cruise Lines at the Port of Galveston
          </h2>
          <p className="text-gray-500 text-lg">
            Four major cruise lines call Galveston home. Here&apos;s what sails
            from your Texas backyard.
          </p>
        </div>

        <div className="space-y-8">
          {cruiseLines.map((line) => (
            <div
              key={line.name}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className={`bg-gradient-to-r ${line.color} text-white p-6 flex items-center gap-4`}>
                <span className="text-5xl">{line.emoji}</span>
                <div>
                  <h3 className="text-2xl font-extrabold">{line.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{line.description}</p>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-blue-900 mb-4 text-sm uppercase tracking-wide">
                  Ships & Itineraries from Galveston
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {line.ships.map((s) => (
                    <div
                      key={s.ship}
                      className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
                    >
                      <span className="text-2xl mt-0.5">🚢</span>
                      <div>
                        <div className="font-bold text-blue-900 text-sm">
                          {s.ship}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          {s.destinations}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-3">
            Compare Cruise Lines from Galveston
          </h2>
          <p className="text-gray-500 text-lg">
            Not sure which line is right for you? Here&apos;s a quick side-by-side.
          </p>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-md">
          <table className="w-full bg-white text-sm">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-5 py-4 text-left font-bold">Feature</th>
                <th className="px-5 py-4 text-center font-bold">Carnival</th>
                <th className="px-5 py-4 text-center font-bold">Royal Caribbean</th>
                <th className="px-5 py-4 text-center font-bold">Norwegian</th>
                <th className="px-5 py-4 text-center font-bold">Disney</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  feature: "Family Friendly",
                  carnival: "✅",
                  royal: "✅",
                  ncl: "✅",
                  disney: "✅ Best",
                },
                {
                  feature: "Nightlife / Adults",
                  carnival: "✅ Very Lively",
                  royal: "✅",
                  ncl: "✅ Party",
                  disney: "⚠️ Mild",
                },
                {
                  feature: "Private Island",
                  carnival: "Half Moon Cay",
                  royal: "CocoCay",
                  ncl: "Great Stirrup Cay",
                  disney: "Castaway Cay",
                },
                {
                  feature: "Galveston Year-Round?",
                  carnival: "✅ Yes",
                  royal: "✅ Yes",
                  ncl: "✅ Yes",
                  disney: "Seasonal",
                },
                {
                  feature: "Budget-Friendly",
                  carnival: "✅ Best Value",
                  royal: "✅",
                  ncl: "✅",
                  disney: "⚠️ Premium",
                },
                {
                  feature: "Best For",
                  carnival: "Fun & Budget",
                  royal: "Thrill-Seekers",
                  ncl: "Freestyle Dining",
                  disney: "Young Families",
                },
              ].map((row, i) => (
                <tr
                  key={row.feature}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-5 py-4 font-semibold text-blue-900 border-b border-gray-100">
                    {row.feature}
                  </td>
                  <td className="px-5 py-4 text-center text-gray-600 border-b border-gray-100">
                    {row.carnival}
                  </td>
                  <td className="px-5 py-4 text-center text-gray-600 border-b border-gray-100">
                    {row.royal}
                  </td>
                  <td className="px-5 py-4 text-center text-gray-600 border-b border-gray-100">
                    {row.ncl}
                  </td>
                  <td className="px-5 py-4 text-center text-gray-600 border-b border-gray-100">
                    {row.disney}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-gray-400 text-sm mt-4">
          Not sure which is right for you? Contact us — we&apos;ll match you with the perfect cruise line.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-red-600 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-3">
            Ready to Book Your Galveston Cruise? ⚓
          </h2>
          <p className="text-red-100 mb-6">
            Our specialists know every ship, every itinerary, and every sailing
            from the Port of Galveston. Let us find the perfect cruise for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/deals"
              className="bg-white text-red-600 hover:bg-red-50 font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg"
            >
              See Current Deals
            </Link>
            <Link
              href="/contact"
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
