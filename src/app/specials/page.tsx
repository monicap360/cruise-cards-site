import Link from "next/link";

const onboardCredits = [
  {
    name: "$100 Onboard Credit",
    icon: "💵",
    value: "$100",
    color: "from-blue-500 to-blue-700",
    desc: "Use toward specialty dining, spa treatments, excursions, arcade credits, or the gift shop. Automatically applied to your onboard account.",
    eligible: "Most 5–7 night sailings",
  },
  {
    name: "$200 Onboard Credit",
    icon: "💰",
    value: "$200",
    color: "from-blue-700 to-blue-900",
    desc: "Double the spending power — ideal for longer sailings or couples who want to enjoy premium amenities without worrying about the tab.",
    eligible: "7–8 night sailings & suites",
  },
];

const addOns = [
  {
    icon: "🍹",
    name: "Half-Off Drink Package",
    badge: "50% Off",
    badgeColor: "bg-red-500",
    desc: "Enjoy unlimited drinks at sea for half the price — cocktails, beer, wine, specialty coffees, and non-alcoholic beverages. One of the best values on any cruise.",
    note: "Available for select cruise lines and sailings",
  },
  {
    icon: "🏝️",
    name: "Shore Excursion Credit",
    badge: "Up to $200",
    badgeColor: "bg-green-600",
    desc: "Pre-book guided tours, snorkeling adventures, beach breaks, and cultural experiences. Your credit is applied at checkout — more port, less price.",
    note: "Credit amount varies by sailing length",
  },
  {
    icon: "🎀",
    name: "Free Stateroom Decorations",
    badge: "Complimentary",
    badgeColor: "bg-purple-600",
    desc: "We coordinate with the ship's guest services to have your cabin decorated before you board — balloons, banners, rose petals, and personalized touches for a truly special arrival.",
    note: "Available on select cruise lines with advance notice",
  },
];

const packages = [
  {
    name: "Birthday at Sea",
    emoji: "🎂",
    color: "from-pink-500 to-rose-700",
    tagline: "Make their day unforgettable on the water",
    includes: [
      "Cabin decorated with birthday balloons & banner",
      "$100 Onboard Credit for the birthday guest",
      "Complimentary birthday cake delivered to stateroom",
      "Shore excursion credit for 1 port stop",
      "Priority dinner seating (where available)",
    ],
    from: 149,
    note: "Upgrade to $200 OBC available for an additional $100",
  },
  {
    name: "Anniversary Voyage",
    emoji: "💑",
    color: "from-red-500 to-rose-800",
    tagline: "Celebrate your love story at sea",
    includes: [
      "Cabin decorated with rose petals & romantic lighting",
      "$100 Onboard Credit per couple",
      "Sparkling wine & chocolate-covered strawberries",
      "Couples spa discount (20% off select treatments)",
      "Specialty dinner reservation at a top restaurant",
    ],
    from: 179,
    note: "Honeymoon upgrade includes champagne & keepsake photo",
  },
  {
    name: "Milestone Celebration",
    emoji: "🎉",
    color: "from-yellow-500 to-orange-600",
    tagline: "50th birthday? 25th anniversary? Retirement? Let's celebrate right.",
    includes: [
      "$200 Onboard Credit for the guest of honor",
      "Full cabin decoration package",
      "Custom banner with name & milestone",
      "Shore excursion credit at every port",
      "Group photo session with ship photographer",
    ],
    from: 249,
    note: "Includes complimentary cruise specialist coordination",
  },
  {
    name: "Honeymoon Package",
    emoji: "💍",
    color: "from-purple-600 to-indigo-800",
    tagline: "Start your forever on the water",
    includes: [
      "Cabin decorated with rose petals, candles & keepsake banner",
      "$200 Onboard Credit for the couple",
      "Premium sparkling wine on arrival",
      "Couples massage — 30% off when booked in advance",
      "Private sunset balcony dinner (select ships)",
    ],
    from: 299,
    note: "Requires balcony or above cabin category",
  },
];

export default function SpecialsPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
            ⭐ Exclusive to Cruises from Galveston
          </div>
          <h1 className="text-5xl font-extrabold mb-4">Cruise Specials & Packages</h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            Onboard credits, drink packages, shore excursion credits, and custom celebration packages — all arranged by your Galveston cruise specialist.
          </p>
        </div>
      </section>

      {/* OBC Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-3">Onboard Credit (OBC)</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Free money to spend however you want on board — dining, spa, excursions, shopping, or drinks. Ask us about OBC when booking your cruise.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {onboardCredits.map((obc) => (
            <div key={obc.name} className="rounded-2xl overflow-hidden shadow-lg">
              <div className={`bg-gradient-to-br ${obc.color} text-white p-8 text-center`}>
                <div className="text-5xl mb-2">{obc.icon}</div>
                <div className="text-5xl font-black">{obc.value}</div>
                <div className="text-white/80 text-sm font-semibold mt-1">Onboard Credit</div>
              </div>
              <div className="bg-white p-6 border border-gray-100">
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{obc.desc}</p>
                <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                  {obc.eligible}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add-ons */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-3">Add-On Specials</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Upgrade your cruise experience with these popular add-ons — available when you book through us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((item) => (
              <div key={item.name} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{item.icon}</span>
                  <span className={`${item.badgeColor} text-white text-xs font-extrabold px-3 py-1 rounded-full`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-blue-900 text-lg mb-2">{item.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{item.desc}</p>
                <p className="text-xs text-gray-400 italic">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Celebration Packages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-3">Celebration Packages</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Birthdays, anniversaries, honeymoons, milestones — we make sure the ship knows you&apos;re celebrating.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.name} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className={`bg-gradient-to-br ${pkg.color} text-white p-7`}>
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{pkg.emoji}</span>
                  <div>
                    <h3 className="text-2xl font-extrabold">{pkg.name}</h3>
                    <p className="text-white/80 text-sm mt-0.5">{pkg.tagline}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="font-bold text-blue-900 text-sm uppercase tracking-wide mb-3">
                  Package Includes:
                </div>
                <ul className="space-y-2 mb-5">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {pkg.note && (
                  <p className="text-xs text-gray-400 italic mb-5">{pkg.note}</p>
                )}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-gray-400 text-xs block">Package add-on from</span>
                    <span className="text-red-600 font-extrabold text-2xl">${pkg.from}</span>
                  </div>
                  <Link
                    href={`/contact?package=${encodeURIComponent(pkg.name)}`}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-full text-sm transition-all"
                  >
                    Add to My Booking
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to add */}
      <section className="bg-blue-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-4">How to Add Specials to Your Booking</h2>
          <p className="text-blue-100 text-lg mb-6">
            All specials and packages are arranged through your Cruises from Galveston specialist. Just mention it when you book — or contact us to add to an existing reservation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg"
            >
              Contact Us to Add a Special
            </Link>
            <Link
              href="/deals"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-full text-lg transition-all"
            >
              Browse Cruise Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
