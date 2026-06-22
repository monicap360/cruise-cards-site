import Link from "next/link";

const serviceGroups = [
  {
    icon: "🚢",
    title: "Cruise Planning & Booking",
    services: [
      "Cruise planning and booking assistance",
      "Group cruise coordination",
      "Shore excursion guidance",
      "Non-refundable and non-transferable booking options",
      "Sea Pay payment plan enrollment",
      "Room holds (24, 48 & 72 hours)",
    ],
  },
  {
    icon: "🏨",
    title: "Travel Coordination",
    services: [
      "Hotel reservations near the port",
      "Restaurant recommendations and reservations",
      "Tours and local activity recommendations",
      "Transportation coordination",
      "Hotel, airport, and port ride assistance",
    ],
  },
  {
    icon: "🖨️",
    title: "Document & Check-In Help",
    services: [
      "Boarding pass printing",
      "Luggage tag printing",
      "Cruise paperwork and check-in assistance",
      "Passport and travel-document guidance",
      "Reservation balances, receipts, and payment assistance",
    ],
  },
  {
    icon: "♿",
    title: "Accessibility & Special Needs",
    services: [
      "Scooter rental assistance",
      "Wheelchair rental assistance",
      "Accessibility and special-assistance coordination",
      "Cruise packing checklists and terminal guidance",
    ],
  },
  {
    icon: "☕",
    title: "Comfort & Convenience",
    services: [
      "Waiting lounge with ship information and cruise videos",
      "Wi-Fi and charging stations",
      "Snacks, drinks, and travel essentials",
      "English and Spanish customer support",
    ],
  },
  {
    icon: "🎁",
    title: "Gifts & Merchandise",
    services: [
      "Cruise gifts and travel accessories",
      "Custom luggage tags",
      "Ducks and collectible cruise merchandise",
      "Celebration packages and onboard extras",
    ],
  },
];

const directions = [
  {
    from: "Houston (I-45 South)",
    drive: "~50 min / 50 miles",
    steps: [
      "Take I-45 South toward Galveston",
      "Cross the causeway onto Galveston Island",
      "Turn right on 25th Street",
      "Follow signs to Port of Galveston — Terminal 1, 2, or 25",
      "Arrive 2–3 hours before departure",
    ],
    tip: "I-45 can have heavy traffic Friday evenings. Allow extra time.",
  },
  {
    from: "Dallas (I-45 South)",
    drive: "~5 hrs / 290 miles",
    steps: [
      "Take I-45 South from Dallas all the way to Galveston",
      "Cross the causeway and follow port signs",
    ],
    tip: "Overnight in Houston to arrive rested. Book a port hotel through us.",
  },
  {
    from: "San Antonio (I-10 East)",
    drive: "~4 hrs / 220 miles",
    steps: [
      "Take I-10 East toward Houston",
      "Merge onto I-45 South toward Galveston",
      "Follow port signs at the causeway",
    ],
    tip: "Consider our hotel coordination service for a pre-cruise overnight stay.",
  },
  {
    from: "Austin (US-290 / I-10)",
    drive: "~4 hrs / 220 miles",
    steps: [
      "Take US-290 East or I-10 East toward Houston",
      "Merge onto I-45 South to Galveston",
    ],
    tip: "Saturday morning traffic near Houston can add 45–60 minutes.",
  },
  {
    from: "Oklahoma City (I-35 South)",
    drive: "~6 hrs / 380 miles",
    steps: [
      "Take I-35 South to Dallas",
      "Continue on I-45 South all the way to Galveston",
    ],
    tip: "Book a free parking consultation — we'll help you find the best terminal parking deal.",
  },
  {
    from: "George Bush Intercontinental (IAH)",
    drive: "~1 hr 15 min",
    steps: [
      "Take Beltway 8 South or I-45 South",
      "Follow I-45 South to Galveston",
    ],
    tip: "We coordinate port shuttle services. Ask us about airport-to-port transportation.",
  },
  {
    from: "Houston Hobby Airport (HOU)",
    drive: "~45 min",
    steps: [
      "Take I-45 South from Hobby Airport",
      "Cross the causeway — port terminals are straight ahead",
    ],
    tip: "Hobby is the closest airport to the port — best option for fly-to-cruise guests.",
  },
];

const disembarkTimes = [
  {
    time: "6:30 – 7:00 AM",
    type: "Self-Assist / Walk-Off",
    label: "Earliest",
    color: "bg-green-600",
    desc: "Carry all your luggage yourself. Best for guests catching early flights or with tight schedules. Available on most cruise lines.",
  },
  {
    time: "7:00 – 8:30 AM",
    type: "Express Disembarkation",
    label: "Early",
    color: "bg-blue-600",
    desc: "Priority luggage tags — your bags are among the first off the ship. Walk off when your tag color/number is called.",
  },
  {
    time: "8:30 – 10:30 AM",
    type: "Standard Disembarkation",
    label: "Standard",
    color: "bg-blue-900",
    desc: "The majority of guests disembark during this window by tag group. Bags are placed outside your cabin the night before.",
  },
  {
    time: "10:30 AM – 12:00 PM",
    type: "Late / Assisted Disembarkation",
    label: "Late",
    color: "bg-gray-600",
    desc: "Wheelchair-assisted guests and those who need extra time. All guests must be off the ship by noon.",
  },
];

export default function ExperienceCenterPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
            📍 Galveston, Texas
          </div>
          <h1 className="text-5xl font-extrabold mb-3">Cruise Experience Center</h1>
          <p className="text-3xl font-bold text-red-400 mb-4">Cruises Start Here.</p>
          <p className="text-blue-100 text-xl max-w-3xl mx-auto mb-2">
            Plan. Book. Sail.
          </p>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Your one-stop cruise concierge in Galveston — from the moment you start planning to the moment you board.
          </p>

          {/* Signage text */}
          <div className="mt-8 max-w-3xl mx-auto bg-white/10 border border-white/20 rounded-2xl p-6 text-left">
            <div className="text-white font-black text-xl text-center mb-3 tracking-widest uppercase">
              CRUISE EXPERIENCE CENTER
            </div>
            <div className="text-blue-200 text-sm text-center leading-relaxed">
              Cruise Planning • Hotels • Tours • Transportation<br />
              Boarding Pass Printing • Luggage Tags • Accessibility Support<br />
              Scooter &amp; Wheelchair Rentals • Wi-Fi • Charging<br />
              Cruise Gifts • Travel Help • Concierge Support
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-3">Everything Under One Roof</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From booking your first cruise to printing your boarding pass, we handle every detail.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceGroups.map((group) => (
            <div key={group.title} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{group.icon}</span>
                <h3 className="font-extrabold text-blue-900 text-lg">{group.title}</h3>
              </div>
              <ul className="space-y-2">
                {group.services.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Sea You on Deck */}
      <section className="bg-gradient-to-br from-blue-900 to-teal-700 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-block bg-white/10 border border-white/20 text-blue-200 text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
              Powered by Cruise Experience Center
            </div>
            <div className="text-yellow-400 text-sm font-extrabold uppercase tracking-widest mb-2">Sea You On Deck Crews™</div>
            <h2 className="text-3xl font-extrabold mb-2">Find Your People Before You Sail.</h2>
            <p className="text-blue-100 max-w-xl mx-auto text-base">
              Cruise communities, meetups, tips, and onboard connections — join a crew that matches your cruise style. Stay private or connect before you board.
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 mb-8">
            {[
              { name: "Sea Duck Hunters™", icon: "🦆", color: "bg-yellow-400", text: "text-yellow-900" },
              { name: "First Time Cruisers", icon: "🚢", color: "bg-blue-500", text: "text-white" },
              { name: "Family Cruisers", icon: "👨‍👩‍👧", color: "bg-green-500", text: "text-white" },
              { name: "Adults Only", icon: "🍸", color: "bg-purple-600", text: "text-white" },
              { name: "Singles at Sea", icon: "🌟", color: "bg-pink-500", text: "text-white" },
              { name: "SeaStrong Crew", icon: "💪", color: "bg-red-600", text: "text-white" },
              { name: "Easy Waves", icon: "♿", color: "bg-teal-400", text: "text-white" },
              { name: "Jackpot Crew", icon: "🎰", color: "bg-orange-500", text: "text-white" },
              { name: "Party Wake Crew", icon: "🎉", color: "bg-indigo-500", text: "text-white" },
            ].map((crew) => (
              <div key={crew.name} className={`${crew.color} ${crew.text} rounded-2xl p-3 text-center flex flex-col items-center gap-1`}>
                <span className="text-2xl">{crew.icon}</span>
                <span className="text-xs font-extrabold leading-tight">{crew.name}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/sea-you-on-deck" className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-extrabold px-8 py-4 rounded-full text-lg transition-all shadow-lg inline-block">
              See All 30+ Crews &amp; Join
            </Link>
          </div>
        </div>
      </section>

      {/* Disembarkation Times */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-3">Earliest Disembarkation Times</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              The ship arrives at the Port of Galveston early in the morning. Here&apos;s when you can expect to get off — based on your luggage method and tag group.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {disembarkTimes.map((item) => (
              <div key={item.type} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className={`${item.color} text-white p-4 text-center`}>
                  <div className="text-xs font-bold uppercase tracking-wide opacity-80 mb-1">{item.label}</div>
                  <div className="text-2xl font-extrabold">{item.time}</div>
                </div>
                <div className="p-4">
                  <div className="font-extrabold text-blue-900 text-sm mb-2">{item.type}</div>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-sm text-yellow-800">
            <strong>💡 Pro tip:</strong> If you have a morning flight out of Houston, always choose Self-Assist (Walk-Off) or Express. Build in at least 3 hours between your expected walk-off time and your flight departure. We can help coordinate airport transportation — just ask.
          </div>
        </div>
      </section>

      {/* Directions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-3">Directions to the Port of Galveston</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Galveston is the drive-to cruise capital of the South. Here&apos;s how to get here from anywhere in the region.
          </p>
          <div className="mt-4 inline-block bg-blue-50 border border-blue-200 text-blue-800 text-sm font-semibold px-5 py-2 rounded-full">
            📍 Port of Galveston — 2502 Harborside Dr, Galveston, TX 77550
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {directions.map((dir) => (
            <div key={dir.from} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <h3 className="font-extrabold text-blue-900 text-base">From {dir.from}</h3>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{dir.drive}</span>
              </div>
              <ol className="space-y-1 mb-3">
                {dir.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-400 font-bold flex-shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
              {dir.tip && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-xs text-yellow-800">
                  💡 {dir.tip}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-3">Ready to Start Planning?</h2>
          <p className="text-blue-200 mb-6">
            Come visit us in Galveston or reach out — our cruise specialists are standing by to make your voyage seamless from start to finish.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg">
              Contact Us
            </Link>
            <Link href="/deals" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-full text-lg transition-all">
              Browse Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
