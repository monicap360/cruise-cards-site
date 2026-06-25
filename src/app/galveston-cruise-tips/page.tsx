import Link from "next/link";

export const metadata = {
  title: "Best Galveston Cruise Tips | Cruises from Galveston",
  description:
    "Insider tips for cruising from the Port of Galveston — parking, embarkation day, documents, packing, ports, and disembarkation, from local specialists.",
};

type Section = {
  kicker: string;
  title: string;
  tips: { h: string; d: string }[];
};

const SECTIONS: Section[] = [
  {
    kicker: "// Getting Here & Parking",
    title: "Arrive Smart",
    tips: [
      {
        h: "Come in the night before",
        d: "I-45 into Galveston backs up Friday evenings and Saturday mornings. Stay on the Seawall or at Harbor House by the port and start sail day relaxed.",
      },
      {
        h: "Reserve parking ahead",
        d: "Pre-booked port parking is cheaper than driving up — or bundle it with a hotel night in a Park & Embark™ package.",
      },
      {
        h: "Know your entry street",
        d: "Terminals are blocks apart. Carnival Jubilee enters at 22nd Street, Carnival Breeze at 35th — going to the wrong building costs you time on a tight morning.",
      },
      {
        h: "Closest airport is Hobby",
        d: "Houston Hobby (HOU) is ~45 minutes away; IAH is ~1 hr 15. Ask us about airport-to-port transfers.",
      },
    ],
  },
  {
    kicker: "// Embarkation Day",
    title: "Boarding Like a Pro",
    tips: [
      {
        h: "Grab an early check-in time",
        d: "Online check-in opens about 14 days out — log in the moment it does to lock an early arrival appointment.",
      },
      {
        h: "Pack a carry-on for day one",
        d: "Your checked bags arrive at your cabin hours after you board. Keep meds, swimsuit, documents, and a change of clothes on you.",
      },
      {
        h: "Bring the cabin hacks",
        d: "A lanyard for your key card, magnetic hooks (cabin walls are metal), and a cruise-safe power strip (no surge protectors — they're banned) make life easier.",
      },
      {
        h: "Small bills for porters",
        d: "Tip the curbside porters $1–2 per bag — have singles ready so your luggage gets aboard smoothly.",
      },
    ],
  },
  {
    kicker: "// Documents",
    title: "Passport or Birth Certificate?",
    tips: [
      {
        h: "Round-trip Galveston is 'closed-loop'",
        d: "US citizens can sail with a birth certificate + government photo ID — but a passport is strongly recommended.",
      },
      {
        h: "Why a passport still matters",
        d: "If you miss the ship at a port, you need a passport to fly home from a foreign country. It's worth the peace of mind.",
      },
      {
        h: "Names must match exactly",
        d: "The name on your booking must match your travel document exactly — even a nickname mismatch can cause a denial at check-in.",
      },
    ],
  },
  {
    kicker: "// Money & Gratuities",
    title: "Spend Less, Stress Less",
    tips: [
      {
        h: "Prepay your gratuities",
        d: "Daily gratuities (~$16/guest/day) are auto-added to your account. Prepay to budget for them up front.",
      },
      {
        h: "Pre-purchase packages",
        d: "Drink, Wi-Fi, and specialty dining packages are cheaper bought before you sail than onboard.",
      },
      {
        h: "Carry small USD in port",
        d: "Cozumel and other ports take cards, but cash (small US bills) is king for taxis, vendors, and tips.",
      },
    ],
  },
  {
    kicker: "// Packing",
    title: "Pack Like You've Done This",
    tips: [
      {
        h: "Layers + one dressy outfit",
        d: "Ships are chilly inside; ports are hot. Bring layers and one outfit for the elegant/formal night.",
      },
      {
        h: "Motion-sickness backup",
        d: "Even good sailors hit rough seas. Pack remedies (bands or tablets) just in case — we stock them at the desk too.",
      },
      {
        h: "Reef-safe sunscreen + a water bottle",
        d: "Many ports require reef-safe sunscreen, and a refillable bottle saves money all week.",
      },
    ],
  },
  {
    kicker: "// In Port",
    title: "Make the Most of Every Stop",
    tips: [
      {
        h: "Book excursions through us",
        d: "Ship- or agency-booked excursions guarantee the ship waits if your tour runs late — a big safety net independent tours don't offer.",
      },
      {
        h: "Watch 'ship time'",
        d: "The ship runs on its own time, which can differ from local time. Always set your watch to ship time and be back 30+ minutes before all-aboard.",
      },
      {
        h: "The ship will not wait",
        d: "Miss all-aboard and you're getting to the next port on your own dime. Don't cut it close.",
      },
    ],
  },
  {
    kicker: "// Disembarkation",
    title: "Getting Home Easy",
    tips: [
      {
        h: "Self-assist for early flights",
        d: "Carry your own bags off (walk-off) from ~6:30–7:00 AM if you have a flight. Build at least 3 hours between walk-off and a Houston departure.",
      },
      {
        h: "Everyone's off by noon",
        d: "All guests must be off the ship by about noon. Choose your luggage tag color/timing to match your travel plans.",
      },
      {
        h: "Store bags & book the next one",
        d: "Drop your luggage with us, grab a shower, and let's plan your next sailing while the glow is fresh.",
      },
    ],
  },
  {
    kicker: "// First-Timer",
    title: "Brand-New to Cruising?",
    tips: [
      {
        h: "Download the cruise line app",
        d: "Carnival HUB and the like show the daily schedule, menus, and onboard chat — your at-sea command center.",
      },
      {
        h: "Plan sea days vs port days",
        d: "Book spa, specialty dining, and shows for sea days; save energy for adventures on port days.",
      },
      {
        h: "Take Cruising 101™ with us",
        d: "Our quick first-timer class covers packing, check-in, and insider tips so nothing catches you off guard.",
      },
    ],
  },
];

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SECTIONS.flatMap((s) =>
    s.tips.map((t) => ({
      "@type": "Question",
      name: t.h,
      acceptedAnswer: { "@type": "Answer", text: t.d },
    }))
  ),
};

export default function GalvestonCruiseTipsPage() {
  return (
    <div className="bg-[#05070d] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-6">
            {"// Local Knowledge"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-5">
            Best Galveston <span className="text-holo">Cruise Tips</span>
          </h1>
          <p className="text-white/55 text-lg">
            Hard-won, Galveston-specific advice from specialists who live it — so
            your first cruise (or your fortieth) goes off without a hitch.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
              {s.kicker}
            </div>
            <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-8">
              {s.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
              {s.tips.map((t) => (
                <div key={t.h} className="bg-[#05070d] p-6">
                  <h3 className="font-bold text-white text-base mb-2">{t.h}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{t.d}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[44rem] h-[44rem] -bottom-72 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            Got a question we didn&apos;t cover?
          </h2>
          <p className="text-white/55 text-lg mb-9">
            That&apos;s what we&apos;re here for. Ask a Galveston specialist anything —
            no question is too small.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Ask a Specialist
            </Link>
            <Link
              href="/experience-center"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Visit the Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
