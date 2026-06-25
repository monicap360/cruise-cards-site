import Link from "next/link";

const onboardCredits = [
  {
    name: "$100 Onboard Credit",
    value: "$100",
    desc: "Use toward specialty dining, spa treatments, excursions, arcade credits, or the gift shop. Automatically applied to your onboard account.",
    eligible: "Most 5–7 night sailings",
  },
  {
    name: "$200 Onboard Credit",
    value: "$200",
    desc: "Double the spending power — ideal for longer sailings or couples who want to enjoy premium amenities without worrying about the tab.",
    eligible: "7–8 night sailings & suites",
  },
];

const addOns = [
  {
    name: "Half-Off Drink Package",
    badge: "50% Off",
    desc: "Enjoy unlimited drinks at sea for half the price — cocktails, beer, wine, specialty coffees, and non-alcoholic beverages. One of the best values on any cruise.",
    note: "Available for select cruise lines and sailings",
  },
  {
    name: "Shore Excursion Credit",
    badge: "Up to $200",
    desc: "Pre-book guided tours, snorkeling adventures, beach breaks, and cultural experiences. Your credit is applied at checkout — more port, less price.",
    note: "Credit amount varies by sailing length",
  },
  {
    name: "Free Stateroom Decorations",
    badge: "Complimentary",
    desc: "We coordinate with the ship's guest services to have your cabin decorated before you board — balloons, banners, rose petals, and personalized touches for a truly special arrival.",
    note: "Available on select cruise lines with advance notice",
  },
];

const packages = [
  {
    name: "Birthday at Sea",
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
    <div className="bg-[#05070d]">
      {/* Header */}
      <section className="bg-[#05070d] text-white relative overflow-hidden grid-bg py-16">
        <div className="aurora bg-sky-500 opacity-[0.14]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Exclusive to Cruises from Galveston"}</div>
          <h1 className="text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">Cruise Specials & Packages</h1>
          <p className="text-white/55 text-xl max-w-2xl mx-auto">
            Onboard credits, drink packages, shore excursion credits, and custom celebration packages — all arranged by your Galveston cruise specialist.
          </p>
        </div>
      </section>

      {/* OBC Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white mb-3">Onboard Credit (OBC)</h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Free money to spend however you want on board — dining, spa, excursions, shopping, or drinks. Ask us about OBC when booking your cruise.
          </p>
        </div>
        <div className="grid gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden md:grid-cols-2 max-w-3xl mx-auto">
          {onboardCredits.map((obc) => (
            <div key={obc.name} className="bg-[#05070d] p-8 hover:bg-white/[0.03]">
              <div className="text-center mb-5">
                <div className="text-5xl font-extrabold text-holo">{obc.value}</div>
                <div className="text-white/45 text-sm font-semibold mt-1 uppercase tracking-wider">Onboard Credit</div>
              </div>
              <p className="text-white/55 text-sm leading-relaxed mb-3">{obc.desc}</p>
              <div className="text-xs font-bold text-sky-300 bg-sky-400/10 border border-sky-400/20 px-3 py-1 rounded-full inline-block">
                {obc.eligible}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add-ons */}
      <section className="bg-[#0b1020] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white mb-3">Add-On Specials</h2>
            <p className="text-white/55 text-lg max-w-2xl mx-auto">
              Upgrade your cruise experience with these popular add-ons — available when you book through us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((item) => (
              <div key={item.name} className="bg-[#05070d] border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-end mb-4">
                  <span className="bg-sky-400/10 border border-sky-400/20 text-sky-300 text-xs font-extrabold px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-lg mb-2">{item.name}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-3">{item.desc}</p>
                <p className="text-xs text-white/45 italic">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Celebration Packages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white mb-3">Celebration Packages</h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Birthdays, anniversaries, honeymoons, milestones — we make sure the ship knows you&apos;re celebrating.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.name} className="bg-[#0b1020] border border-white/10 rounded-2xl overflow-hidden">
              <div className="border-b border-white/10 p-7">
                <h3 className="text-2xl font-extrabold uppercase tracking-[-0.01em] text-white">{pkg.name}</h3>
                <p className="text-white/55 text-sm mt-0.5">{pkg.tagline}</p>
              </div>
              <div className="p-6">
                <div className="font-bold text-white/45 text-sm uppercase tracking-wide mb-3">
                  Package Includes:
                </div>
                <ul className="space-y-2 mb-5">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-white/55">
                      <span className="text-sky-400 font-bold mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {pkg.note && (
                  <p className="text-xs text-white/45 italic mb-5">{pkg.note}</p>
                )}
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <span className="text-white/45 text-xs block">Package add-on from</span>
                    <span className="text-holo font-extrabold text-2xl">${pkg.from}</span>
                  </div>
                  <Link
                    href={`/contact?package=${encodeURIComponent(pkg.name)}`}
                    className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-5 py-2 rounded-full transition-all"
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
      <section className="bg-[#0b1020] text-white relative overflow-hidden grid-bg py-14">
        <div className="aurora bg-sky-500 opacity-[0.14]" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-4">How to Add Specials to Your Booking</h2>
          <p className="text-white/55 text-lg mb-6">
            All specials and packages are arranged through your Cruises from Galveston specialist. Just mention it when you book — or contact us to add to an existing reservation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Contact Us to Add a Special
            </Link>
            <Link
              href="/deals"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Browse Cruise Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
