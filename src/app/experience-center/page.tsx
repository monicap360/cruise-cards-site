import Link from "next/link";
import StoreHours from "@/components/StoreHours";

export const metadata = {
  title: "Cruise Experience Center — Galveston Walk-In Cruise Help",
  description:
    "A real walk-in Cruise Experience Center in Galveston: boarding-pass & luggage-tag printing, luggage storage, embark-day essentials, scooter & wheelchair rentals, and in-person specialists. Cruises Start Here.",
};

const serviceGroups = [
  {
    title: "Cruise Planning & Booking",
    href: "/deals",
    services: [
      "Cruise planning and booking assistance",
      "Help finishing a booking you started elsewhere",
      "Group cruise coordination",
      "Shore excursion guidance",
      "Non-refundable and non-transferable booking options",
      "Sea Pay payment plan enrollment",
      "Room holds (24, 48 & 72 hours)",
    ],
  },
  {
    title: "Travel Coordination",
    href: "/add-ons#hotels",
    services: [
      "Hotel reservations near the port",
      "Restaurant recommendations and reservations",
      "Tours and local activity recommendations",
      "Transportation coordination",
      "Hotel, airport, and port ride assistance",
    ],
  },
  {
    title: "Document & Check-In Help",
    href: "/reserve",
    services: [
      "Boarding pass printing",
      "Luggage tag printing",
      "Cruise paperwork and check-in assistance",
      "Passport and travel-document guidance",
      "Reservation balances, receipts, and payment assistance",
    ],
  },
  {
    title: "Accessibility & Special Needs",
    href: "/add-ons#extras",
    services: [
      "Scooter rental assistance",
      "Wheelchair rental assistance",
      "Accessibility and special-assistance coordination",
      "Oxygen, CPAP supplies & medical-equipment rental",
      "Cruise packing checklists and terminal guidance",
    ],
  },
  {
    title: "Comfort & Convenience",
    href: "/reserve",
    services: [
      "Waiting lounge with ship information and cruise videos",
      "Wi-Fi and charging stations",
      "Snacks, drinks, and travel essentials",
      "English and Spanish customer support",
    ],
  },
  {
    title: "Gifts & Merchandise",
    href: "/add-ons#gifts",
    services: [
      "Cruise gifts and travel accessories",
      "Custom luggage tags",
      "Ducks and collectible cruise merchandise",
      "Celebration packages and onboard extras",
    ],
  },
  {
    title: "Embark-Day Essentials",
    href: "/add-ons#embark-essentials",
    services: [
      "Anchors Essentials™ — sunscreen, lanyards, magnetic hooks, power strips",
      "Bag Drop & Stow™ — we babysit your bags (reservation required)",
      "Port Cash & Tips™ — small bills & tip envelopes",
      "Doc Stop™ — passport photos, printing & copies",
      "Stay Connected™ — travel SIM/eSIM & chargers",
      "Snap & Sail™ embarkation-day photo backdrop",
    ],
  },
  {
    title: "Book Your Next™",
    href: "/book",
    services: [
      "Next-cruise planning with onboard-credit perks",
      "Loyalty status match across cruise lines",
      "Sea Pay™ your deposit on the spot",
      "Cruising 101™ first-timer class & packing workshops",
      "Crew Meetup™ space for Sea You on Deck™ roll calls",
    ],
  },
];

const crews = [
  "Sea Duck Hunters™",
  "First Time Cruisers",
  "Family Cruisers",
  "Adults Only",
  "Singles at Sea",
  "SeaStrong Crew",
  "Easy Waves",
  "Jackpot Crew",
  "Party Wake Crew",
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
    desc: "Carry all your luggage yourself. Best for guests catching early flights or with tight schedules. Available on most cruise lines.",
  },
  {
    time: "7:00 – 8:30 AM",
    type: "Express Disembarkation",
    label: "Early",
    desc: "Priority luggage tags — your bags are among the first off the ship. Walk off when your tag color/number is called.",
  },
  {
    time: "8:30 – 10:30 AM",
    type: "Standard Disembarkation",
    label: "Standard",
    desc: "The majority of guests disembark during this window by tag group. Bags are placed outside your cabin the night before.",
  },
  {
    time: "10:30 AM – 12:00 PM",
    type: "Late / Assisted Disembarkation",
    label: "Late",
    desc: "Wheelchair-assisted guests and those who need extra time. All guests must be off the ship by noon.",
  },
];

export default function ExperienceCenterPage() {
  return (
    <div className="bg-[#05070d] text-white">
      {/* Hero — a destination you arrive at */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[48rem] h-[48rem] -top-72 left-1/2 -translate-x-1/2 opacity-[0.16]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-6">{"// Galveston Island, Texas"}</div>
          <h1 className="text-5xl sm:text-7xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-5">
            The Cruise
            <br />
            Experience Center
          </h1>
          <p className="text-holo font-bold text-2xl sm:text-3xl uppercase tracking-wide mb-7">
            Cruises Start Here.
          </p>
          <p className="text-white/55 text-lg max-w-2xl mx-auto mb-12">
            Not a call center. Not just a website. A place you walk into — where
            your whole cruise comes together, from first idea to the moment you
            board.
          </p>

          {/* Arrival info bar */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mb-12">
            {[
              { label: "Walk right in", sub: "No appointment needed" },
              { label: "Easy to reach", sub: "Minutes from the port" },
              { label: "English & Spanish", sub: "Specialists in person" },
              { label: "Mon–Sat", sub: "9am – 6pm CST" },
            ].map((b, i) => (
              <div key={b.label} className="bg-[#05070d] px-5 py-6 text-left">
                <div className="label-mono text-sky-400/70 text-xs mb-3">
                  0{i + 1}
                </div>
                <div className="font-semibold text-white text-sm leading-tight">
                  {b.label}
                </div>
                <div className="text-white/45 text-xs mt-1">{b.sub}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/reserve"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Plan Your Visit
            </Link>
            <Link
              href="/deals"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Browse Cruises
            </Link>
            <a
              href="tel:+14099002110"
              className="border border-sky-400/40 hover:border-sky-400/80 hover:bg-sky-400/10 text-sky-300 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              📞 Call the Center · (409) 900-2110
            </a>
          </div>
        </div>
      </section>

      {/* Services Grid — every desk is bookable */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
        <div className="max-w-2xl mb-4">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Everything Under One Roof"}</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            Six Desks. One Roof.
          </h2>
          <p className="text-white/55 text-lg">
            From booking your first cruise to printing your boarding pass — tap a
            desk to start.
          </p>
        </div>
        <div className="label-mono text-[11px] uppercase text-white/40 mb-10">
          Select a service to book →
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {serviceGroups.map((group, i) => (
            <Link
              key={group.title}
              href={group.href}
              className="group bg-[#05070d] p-7 hover:bg-white/[0.03] transition-colors flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="label-mono text-sky-400/70 text-sm">
                  0{i + 1}
                </span>
                <span className="text-white/30 group-hover:text-white transition-colors text-lg">
                  →
                </span>
              </div>
              <h3 className="font-bold text-white uppercase tracking-wide text-base mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2 flex-1">
                {group.services.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm text-white/55"
                  >
                    <span className="text-sky-400 mt-0.5 flex-shrink-0">–</span>
                    {s}
                  </li>
                ))}
              </ul>
              <span className="label-mono text-[11px] uppercase text-white/40 group-hover:text-sky-400/80 transition-colors mt-6">
                Book this →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Store Hours */}
      <StoreHours />

      {/* Sea You on Deck — post-booking perk */}
      <section className="relative border-y border-white/10 overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">{"// Sea You On Deck Crews™ · Powered by the Experience Center"}</div>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">
              Booked? See Who&apos;s On Deck.
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto text-lg">
              Once your sailing is booked, unlock your ship&apos;s crews — meet the
              people on your exact departure, swap tips, and plan meetups before you
              ever step aboard. Stay private, or connect. Your call.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mb-10">
            {crews.map((name, i) => (
              <div
                key={name}
                className="bg-[#05070d] px-5 py-6 hover:bg-white/[0.03] transition-colors"
              >
                <div className="label-mono text-sky-400/70 text-xs mb-3">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-semibold text-white uppercase tracking-wide text-sm leading-tight">
                  {name}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/sea-you-on-deck/join"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Join a Crew
            </Link>
            <Link
              href="/sea-you-on-deck/community"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Who&apos;s On My Sailing?
            </Link>
          </div>
        </div>
      </section>

      {/* Disembarkation Times */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl mb-12">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Day of Disembarkation"}</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            Earliest Off-Times
          </h2>
          <p className="text-white/55 text-lg">
            The ship arrives at the Port of Galveston early. Here&apos;s when you can
            expect to step off — based on your luggage method and tag group.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {disembarkTimes.map((item) => (
            <div key={item.type} className="bg-[#05070d] p-6">
              <div className="label-mono text-[11px] uppercase text-sky-400/70 mb-2">
                {item.label}
              </div>
              <div className="text-xl font-bold text-white mb-3">{item.time}</div>
              <div className="font-semibold text-white text-sm mb-2">
                {item.type}
              </div>
              <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-[#0b1020] border border-white/10 rounded-2xl p-5 text-sm text-white/60">
          <span className="text-sky-400 font-semibold">Pro tip — </span>
          If you have a morning flight out of Houston, choose Self-Assist (Walk-Off)
          or Express, and build in at least 3 hours between your expected walk-off
          time and your flight. We can coordinate airport transportation — just ask.
        </div>
      </section>

      {/* Directions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/10">
        <div className="max-w-2xl mb-12">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Getting Here"}</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            Directions to the Port
          </h2>
          <p className="text-white/55 text-lg mb-5">
            Galveston is the drive-to cruise capital of the South. Here&apos;s how to
            reach us from anywhere in the region.
          </p>
          <div className="inline-block bg-[#0b1020] border border-white/10 text-white/70 text-sm px-5 py-2 rounded-full">
            Port of Galveston — 2502 Harborside Dr, Galveston, TX 77550
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {directions.map((dir) => (
            <div key={dir.from} className="bg-[#05070d] p-6">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <h3 className="font-bold text-white text-base">From {dir.from}</h3>
                <span className="label-mono text-[11px] uppercase text-sky-400/80">
                  {dir.drive}
                </span>
              </div>
              <ol className="space-y-1.5 mb-4">
                {dir.steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-white/55"
                  >
                    <span className="label-mono text-sky-400/60 flex-shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              {dir.tip && (
                <div className="bg-[#0b1020] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white/55">
                  <span className="text-sky-400">Tip — </span>
                  {dir.tip}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[44rem] h-[44rem] -bottom-72 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            Ready to Start Planning?
          </h2>
          <p className="text-white/55 text-lg mb-9">
            Come visit us in Galveston or reach out — our specialists are standing by
            to make your voyage seamless from start to finish. Call the center at{" "}
            <a href="tel:+14099002110" className="text-sky-300 font-semibold hover:text-sky-200">(409) 900-2110</a>.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/reserve"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Plan Your Visit
            </Link>
            <a
              href="tel:+14099002110"
              className="border border-sky-400/40 hover:border-sky-400/80 hover:bg-sky-400/10 text-sky-300 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              📞 (409) 900-2110
            </a>
            <Link
              href="/contact"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Contact Us
            </Link>
            <Link
              href="/deals"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Browse Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
