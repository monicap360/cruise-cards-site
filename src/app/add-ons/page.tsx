import Link from "next/link";
import Photo from "@/components/Photo";

export const metadata = {
  title: "Hotels, Transfers, Tours & Cruise Add-Ons in Galveston",
  description:
    "Build your whole trip: pre-cruise Seawall hotels & Harbor House, airport/port transfers, Galveston tours, luggage storage, parking, and onboard extras — booked alongside your cruise.",
};

type Item = {
  name: string;
  desc: string;
  price: string;
  address?: string;
  roomTypes?: string[];
};

type Category = {
  id: string;
  kicker: string;
  title: string;
  blurb: string;
  items: Item[];
};

const categories: Category[] = [
  {
    id: "hotels",
    kicker: "// Stay",
    title: "Hotels & Accommodations",
    blurb:
      "Arrive rested. We book the best pre- and post-cruise rooms on the Seawall and down by the harbor — all minutes from the Port of Galveston.",
    items: [
      {
        name: "Harbor House Hotel & Marina",
        desc: "Right on the water at Pier 21 — the closest stay to the cruise terminals.",
        address: "28 Pier 21, Galveston, TX 77550",
        roomTypes: ["Standard King", "Double Queen", "Harbor-View Suite"],
        price: "from $169 / night",
      },
      {
        name: "Grand Galvez (Hotel Galvez)",
        desc: "The iconic beachfront “Queen of the Gulf,” fully restored on the Seawall.",
        address: "2024 Seawall Blvd, Galveston, TX 77550",
        roomTypes: ["King", "Double Queen", "Gulf-View", "Suite"],
        price: "from $219 / night",
      },
      {
        name: "The San Luis Resort",
        desc: "Gulf-front resort on the Seawall with a spa, pools, and dining.",
        address: "5222 Seawall Blvd, Galveston, TX 77551",
        roomTypes: ["King", "Double Queen", "Gulf-View Suite"],
        price: "from $199 / night",
      },
      {
        name: "Holiday Inn Resort On The Beach",
        desc: "Family-friendly and right on the Seawall, steps from the sand.",
        address: "5002 Seawall Blvd, Galveston, TX 77551",
        roomTypes: ["Standard", "Pool/Gulf View", "Kids Suite"],
        price: "from $159 / night",
      },
      {
        name: "DoubleTree by Hilton Beach",
        desc: "Comfortable Seawall stay with easy beach and port access.",
        address: "1702 Seawall Blvd, Galveston, TX 77550",
        roomTypes: ["King", "Double Queen"],
        price: "from $149 / night",
      },
    ],
  },
  {
    id: "transfers",
    kicker: "// Move",
    title: "Airport & Port Transfers",
    blurb:
      "From the terminal at IAH or Hobby straight to the gangway — shared, private, or by the coach-load.",
    items: [
      { name: "Airport ↔ Port Shuttle", desc: "Shared shuttle from IAH / Hobby to the cruise terminal.", price: "from $35 / person" },
      { name: "Private Car Service", desc: "Door-to-port black car, up to 4 guests.", price: "from $120" },
      { name: "Group Motorcoach", desc: "Chartered coach for groups of 20 or more.", price: "request quote" },
      { name: "Park & Cruise Bundle", desc: "Hotel night + terminal parking + shuttle, bundled.", price: "from $129" },
    ],
  },
  {
    id: "tours",
    kicker: "// Explore Galveston",
    title: "Galveston Excursions & Tours",
    blurb:
      "Explore Galveston at your leisure before or after your cruise. Hear the stories, take pictures, and make beautiful memories as you experience Galveston's charm — here are our recommendations.",
    items: [
      { name: "Historic Trolley Tour", desc: "Roll past Galveston's landmarks and the Victorian Strand district.", price: "from $25" },
      { name: "Dolphin Watch Harbor Cruise", desc: "Ninety minutes on the bay — dolphins practically guaranteed.", price: "from $18" },
      { name: "The Strand Historic District", desc: "Downtown's shops, galleries, restaurants, and bars in 19th-century buildings.", price: "self-guided" },
      { name: "Bishop's Palace", desc: "Tour Galveston's grandest 1892 Gilded-Age mansion.", price: "from $16" },
      { name: "Galveston Island Pleasure Pier", desc: "Rides, games, and funnel cake out over the Gulf.", price: "from $30" },
      { name: "Moody Gardens", desc: "Aquarium, rainforest pyramid, and Palm Beach water park.", price: "from $45" },
      { name: "1877 Tall Ship ELISSA & Seaport", desc: "Climb aboard a restored 19th-century sailing ship.", price: "from $14" },
      { name: "Galveston Ghost Tour", desc: "After-dark stories and haunts of the island's storied past.", price: "from $25" },
    ],
  },
  {
    id: "extras",
    kicker: "// Assist",
    title: "Parking, Rentals & Accessibility",
    blurb:
      "The practical stuff, handled — so the only thing you carry aboard is a good mood.",
    items: [
      { name: "Port Terminal Parking", desc: "Reserved covered or uncovered parking by the terminal.", price: "from $15 / day" },
      { name: "Mobility Scooter Rental", desc: "Delivered to and collected from your stateroom.", price: "from $40 / day" },
      { name: "Wheelchair Rental", desc: "Standard and bariatric chairs available.", price: "from $25 / cruise" },
      { name: "Luggage Valet & Tags", desc: "Printed tags and porter assistance at drop-off.", price: "included" },
    ],
  },
  {
    id: "embark-essentials",
    kicker: "// Don't Sail Without",
    title: "Embark-Day Essentials",
    blurb:
      "The little things that save your sail day — handled at the desk before you ever reach the gangway.",
    items: [
      {
        name: "Anchors Essentials™",
        desc: "Reef-safe sunscreen, key-card lanyards, magnetic cabin hooks, cruise-safe power strips, motion-sickness relief, and door-decoration kits.",
        price: "shop in-center",
      },
      {
        name: "Bag Drop & Stow™ · Galveston Luggage Storage",
        desc: "Late flight, shuttle pickup, or a late hotel or Airbnb check-in? We babysit bags! Leave your luggage with us and go explore downtown Galveston's shops, restaurants, bars, and galleries. Space is limited — please make a reservation.",
        price: "from $10 / bag · reservation required",
      },
      {
        name: "Port Cash & Tips™",
        desc: "Small bills and ready-to-go tip envelopes for crew gratuities and port vendors.",
        price: "at the desk",
      },
      {
        name: "Doc Stop™",
        desc: "Passport photos plus printing and copies of passports, IDs, and travel documents.",
        price: "from $12",
      },
      {
        name: "Stay Connected™",
        desc: "Travel SIM/eSIM data and portable chargers for the ship and every port.",
        price: "from $19",
      },
      {
        name: "Snap & Sail™",
        desc: "Your embarkation-day photo at our branded backdrop — print it or post it.",
        price: "complimentary",
      },
      {
        name: "Cruising 101™",
        desc: "A quick first-timer class: what to pack, how check-in works, and insider tips before you board.",
        price: "free",
      },
    ],
  },
  {
    id: "gifts",
    kicker: "// Celebrate",
    title: "Gifts & Onboard Extras",
    blurb:
      "Surprise someone — or yourself — with a little something waiting in the cabin.",
    items: [
      { name: "Bon Voyage Package", desc: "Stateroom decorations, treats, and a card.", price: "from $49" },
      { name: "Custom Luggage Tags", desc: "Personalized, durable, ready at the desk.", price: "from $12" },
      { name: "Collectible Sea Duck™", desc: "The original — start your hunt.", price: "from $15" },
      { name: "Onboard Credit Gift", desc: "Any amount, applied to their sailing.", price: "any amount" },
    ],
  },
];

export default function AddOnsPage() {
  return (
    <div className="bg-[#05070d] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-6">{"// Everything Under One Roof"}</div>
          <h1 className="text-5xl sm:text-7xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-6 max-w-3xl">
            Build Your <span className="text-holo">Whole Trip</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mb-10">
            Hotels, transfers, tours, parking, and onboard extras — booked
            alongside your cruise by the same specialists. Pick what you need and
            we&apos;ll lock it in.
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="hud text-white label-mono text-[11px] uppercase tracking-wider px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {c.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.map((c) => (
        <section
          key={c.id}
          id={c.id}
          className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 border-b border-white/10"
        >
          <div className="max-w-2xl mb-12">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              {c.kicker}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.01em] mb-4">
              {c.title}
            </h2>
            <p className="text-white/55 text-lg">{c.blurb}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {c.items.map((item) => (
              <div
                key={item.name}
                className="bg-[#05070d] p-7 flex flex-col hover:bg-white/[0.03] transition-colors"
              >
                {c.id === "hotels" && (
                  <Photo
                    src={`/hotels/${item.name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, "")}.jpg`}
                    alt={item.name}
                    className="h-32 -mx-7 -mt-7 mb-5"
                  />
                )}
                <h3 className="font-bold text-white uppercase tracking-wide text-sm mb-2">
                  {item.name}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed flex-1">
                  {item.desc}
                </p>
                {item.address && (
                  <p className="text-white/40 text-xs mt-3 leading-relaxed">
                    {item.address}
                  </p>
                )}
                {item.roomTypes && item.roomTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.roomTypes.map((rt) => (
                      <span
                        key={rt}
                        className="text-[10px] uppercase tracking-wide text-white/60 bg-white/5 border border-white/10 rounded-full px-2.5 py-1"
                      >
                        {rt}
                      </span>
                    ))}
                  </div>
                )}
                <div className="label-mono text-[11px] uppercase text-sky-400/80 mt-5 mb-4">
                  {item.price}
                </div>
                <Link
                  href={`/reserve?addon=${encodeURIComponent(item.name)}`}
                  className="border border-white/25 hover:bg-white hover:text-black text-white label-mono text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-full transition-all text-center"
                >
                  Request
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[44rem] h-[44rem] -bottom-72 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            Want it all in one plan?
          </h2>
          <p className="text-white/55 text-lg mb-9">
            Tell us your sailing and we&apos;ll bundle the hotel, transfer, and
            extras into a single, simple itinerary.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/reserve"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Plan With a Specialist
            </Link>
            <Link
              href="/deals"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Browse Cruises
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
