import Link from "next/link";

const features = [
  {
    icon: "🚢",
    title: "Galveston Departures",
    desc: "Every sailing leaves from the Port of Galveston — drive up and park, or fly into Houston and we'll book your flights, hotel, and transfers.",
  },
  {
    icon: "💎",
    title: "Concierge-Level Service",
    desc: "A dedicated specialist plans every detail — ship, cabin, dining, excursions — from first idea to boarding day.",
  },
  {
    icon: "🗺️",
    title: "Pick Your Exact Cabin",
    desc: "See real room numbers on a live deck map, or lock a guarantee rate — transparency the big sites never show.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Planning",
    desc: "Our intelligent concierge tailors your visit and preps your specialist before you ever walk in or call.",
  },
];

const featuredDeals = [
  {
    name: "Caribbean Paradise",
    line: "Carnival Cruise Line",
    nights: 7,
    destination: "Cozumel · Roatán · Belize",
    price: 549,
    badge: "Signature",
    gradient: "from-blue-700 to-[#0a1f44]",
  },
  {
    name: "Bahamas Getaway",
    line: "Royal Caribbean",
    nights: 5,
    destination: "Nassau · Perfect Day CocoCay",
    price: 399,
    badge: "Most Loved",
    gradient: "from-blue-600 to-blue-900",
  },
  {
    name: "Mexico Explorer",
    line: "Norwegian Cruise Line",
    nights: 4,
    destination: "Cozumel · Progreso",
    price: 329,
    badge: "Quick Escape",
    gradient: "from-slate-600 to-blue-900",
  },
];

const stats = [
  { value: "5", label: "Cruise lines from Galveston" },
  { value: "900+", label: "Sailings to choose from" },
  { value: "1", label: "Experience Center, on the island" },
  { value: "2", label: "Houston airports for Fly & Cruise" },
];

const journey = [
  {
    icon: "🧭",
    title: "Plan",
    desc: "Search every Galveston sailing, compare ships, and map your perfect cabin — with a real specialist or our AI concierge.",
    href: "/find",
    cta: "Find a cruise",
  },
  {
    icon: "🚢",
    title: "Book",
    desc: "Lock your cabin with a low deposit, hold a room, or split it into easy payments with Sea Pay™.",
    href: "/select",
    cta: "Select a cruise",
  },
  {
    icon: "🛡️",
    title: "Protect",
    desc: "Add vacation protection so an unexpected change doesn't cost your trip investment.",
    href: "/vacation-protection",
    cta: "Protect your booking",
  },
  {
    icon: "⚓",
    title: "Sail",
    desc: "Count down the days, prep with our checklist, and step aboard right from the island.",
    href: "/countdown",
    cta: "Cruise countdown",
  },
  {
    icon: "☕",
    title: "Return",
    desc: "Beat the debarkation chaos — our Return & Refresh service smooths the morning you get back.",
    href: "/add-ons",
    cta: "Return & Refresh",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#05070d] text-white min-h-[92vh] flex items-end overflow-hidden">
        {/* Blueprint grid + single cool glow */}
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[52rem] h-[52rem] -top-72 left-1/2 -translate-x-1/2 opacity-[0.16]" />
        </div>

        {/* Compass rose */}
        <div className="hidden lg:block absolute right-[-2rem] xl:right-12 top-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-25">
          <svg
            viewBox="0 0 200 200"
            className="w-[30rem] h-[30rem] text-sky-400"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            {/* rings */}
            <circle cx="100" cy="100" r="95" strokeWidth="0.75" opacity="0.5" />
            <circle cx="100" cy="100" r="82" strokeWidth="0.75" opacity="0.4" />
            <circle
              cx="100"
              cy="100"
              r="68"
              strokeWidth="0.75"
              strokeDasharray="1 5"
              opacity="0.6"
            />
            {/* tick marks every 15° */}
            <g strokeWidth="0.75" opacity="0.45">
              {Array.from({ length: 24 }).map((_, i) => {
                const a = (i * 15 * Math.PI) / 180;
                const r1 = i % 2 === 0 ? 88 : 91;
                return (
                  <line
                    key={i}
                    x1={100 + r1 * Math.sin(a)}
                    y1={100 - r1 * Math.cos(a)}
                    x2={100 + 95 * Math.sin(a)}
                    y2={100 - 95 * Math.cos(a)}
                  />
                );
              })}
            </g>
            {/* diagonal short rays */}
            <g strokeWidth="0.75" opacity="0.5">
              <line x1="100" y1="100" x2="148" y2="52" />
              <line x1="100" y1="100" x2="148" y2="148" />
              <line x1="100" y1="100" x2="52" y2="148" />
              <line x1="100" y1="100" x2="52" y2="52" />
            </g>
            {/* cardinal star — N/S vertical, E/W horizontal */}
            <path
              d="M100 22 L108 100 L100 178 L92 100 Z"
              fill="currentColor"
              fillOpacity="0.22"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M22 100 L100 108 L178 100 L100 92 Z"
              fill="#ffffff"
              fillOpacity="0.12"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle
              cx="100"
              cy="100"
              r="3.5"
              fill="currentColor"
              stroke="none"
            />
            {/* cardinal letters */}
            <g
              fill="currentColor"
              stroke="none"
              fontSize="13"
              fontWeight="700"
              textAnchor="middle"
              style={{ fontFamily: "var(--font-geist-mono, monospace)" }}
            >
              <text x="100" y="16">
                N
              </text>
              <text x="190" y="105">
                E
              </text>
              <text x="100" y="197">
                S
              </text>
              <text x="11" y="105">
                W
              </text>
            </g>
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-16">
          <div className="animate-fade-up flex items-center gap-2 text-white/50 label-mono text-[11px] uppercase mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Galveston, Texas · Cruises Start Here™
          </div>
          <h1 className="animate-fade-up delay-1 mb-6">
            <span className="block text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white/55 mb-3">
              Welcome to the
            </span>
            <span className="block text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em]">
              Cruise <span className="text-holo">Experience</span> Center
            </span>
          </h1>
          <p className="animate-fade-up delay-2 text-white/55 text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
            Powered by Cruises from Galveston™ — your home base to plan, book,
            and sail. Real specialists, live cabin maps, and an AI concierge,
            right here on the island.{" "}
            <span className="text-white/80 font-semibold">
              Plan. Book. Sail.
            </span>
          </p>
          <div className="animate-fade-up delay-3 flex flex-col sm:flex-row gap-3">
            <Link
              href="/deals"
              className="bg-white text-black font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-white/90 transition-all text-center"
            >
              Explore Sailings
            </Link>
            <Link
              href="/reserve"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all text-center"
            >
              Plan a Visit
            </Link>
          </div>

          {/* Stats strip — hairline cells */}
          <div className="animate-fade-up delay-3 mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden max-w-4xl">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#05070d] px-5 py-5">
                <div className="text-3xl font-bold tracking-tight text-white">
                  {s.value}
                </div>
                <div className="text-white/45 label-mono text-[10px] uppercase mt-1.5 leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Texas hospitality band ───────────────────────────────────────── */}
      <section className="bg-[#0b1020] border-y border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-7 text-center">
          <div className="label-mono text-[10px] uppercase tracking-[0.2em] text-sky-400/80 mb-2">
            ★ Lone Star Service
          </div>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed">
            A genuine <span className="text-white font-semibold">Texas welcome</span> —
            honest advice, no pressure, and a local Galveston team that treats you
            like a neighbor, from our island to your stateroom.
          </p>
        </div>
      </section>

      {/* ── The journey: Plan. Book. Protect. Sail. Return. ──────────────── */}
      <section className="bg-[#05070d] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              {"// How It Works"}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] leading-[0.95]">
              Plan. <span className="text-holo">Book.</span> Protect. Sail.
              Return.
            </h2>
            <p className="text-white/55 text-lg mt-4">
              One team for the whole journey — from first idea to the morning you
              get back.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {journey.map((s, i) => (
              <Link
                key={s.title}
                href={s.href}
                className="group bg-[#0b1020] border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-colors flex flex-col"
              >
                <div className="label-mono text-sky-400/70 text-sm mb-4">
                  0{i + 1}
                </div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-extrabold uppercase tracking-tight text-lg mb-2">
                  {s.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed flex-1">
                  {s.desc}
                </p>
                <span className="label-mono text-[10px] uppercase tracking-wider text-sky-400/70 group-hover:text-sky-300 transition-colors mt-4">
                  {s.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us ───────────────────────────────────────────────────────── */}
      <section className="bg-[#05070d] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl mb-16">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Why Galveston"}</div>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">
              Cruising, reimagined.
            </h2>
            <p className="text-white/55 text-lg">
              A five-star travel concierge fused with technology the big booking
              sites simply don&apos;t offer.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-[#05070d] p-7 hover:bg-white/[0.03] transition-colors"
              >
                <div className="label-mono text-sky-400/70 text-sm mb-6">
                  0{i + 1}
                </div>
                <h3 className="font-bold text-base uppercase tracking-wide mb-2">
                  {f.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured deals ───────────────────────────────────────────────── */}
      <section className="bg-[#05070d] text-white border-t border-white/10 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">{"// Now Boarding"}</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em]">
                Featured Voyages
              </h2>
            </div>
            <Link
              href="/deals"
              className="label-mono text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors"
            >
              View all sailings →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featuredDeals.map((deal) => (
              <div
                key={deal.name}
                className="group bg-[#0b1020] rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-colors"
              >
                <div
                  className={`relative h-44 bg-gradient-to-br ${deal.gradient} overflow-hidden`}
                >
                  <div className="absolute inset-0 grid-bg opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020] via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 hud text-white label-mono text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    {deal.badge}
                  </span>
                  <span className="absolute bottom-4 left-5 text-white/80 label-mono text-[11px] uppercase">
                    {deal.nights} Nights
                  </span>
                </div>
                <div className="p-6">
                  <div className="label-mono text-[10px] text-sky-400/70 uppercase mb-2">
                    {deal.line}
                  </div>
                  <h3 className="font-bold text-white text-xl uppercase tracking-tight mb-1">
                    {deal.name}
                  </h3>
                  <p className="text-white/45 text-sm mb-5">{deal.destination}</p>
                  <div className="flex items-end justify-between border-t border-white/10 pt-4">
                    <div>
                      <span className="text-white/40 label-mono text-[10px] uppercase">
                        From
                      </span>
                      <div className="text-white font-bold text-2xl leading-none mt-1">
                        ${deal.price}
                        <span className="text-sm text-white/40 font-normal">
                          {" "}
                          / person
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/contact"
                      className="border border-white/25 hover:bg-white hover:text-black text-white label-mono text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-full transition-all"
                    >
                      Reserve
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience Center band ───────────────────────────────────────── */}
      <section className="relative bg-[#05070d] text-white overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 grid-bg" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">{"// A real place on Galveston Island"}</div>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4 leading-[0.95]">
              The Cruise
              <br />
              Experience Center
            </h2>
            <p className="text-holo font-bold text-xl mb-5 uppercase tracking-wide">
              Cruises Start Here.
            </p>
            <p className="text-white/55 text-lg mb-8 max-w-xl">
              Not just a website — a destination you can walk into. Boarding-pass
              printing, luggage tags, scooter &amp; wheelchair rentals, a comfortable
              lounge, and specialists ready in person. Your journey begins the moment
              you step through the door.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/reserve"
                className="bg-white text-black font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full hover:bg-white/90 transition-all text-center"
              >
                Plan a Visit
              </Link>
              <Link
                href="/experience-center"
                className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all text-center"
              >
                Explore the Center
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {[
              { n: "01", label: "Live deck maps" },
              { n: "02", label: "Sea Pay plans" },
              { n: "03", label: "Check-in help" },
              { n: "04", label: "Group blocks" },
            ].map((t) => (
              <div
                key={t.label}
                className="bg-[#05070d] p-8 hover:bg-white/[0.03] transition-colors"
              >
                <div className="label-mono text-sky-400/70 text-sm mb-4">{t.n}</div>
                <div className="font-semibold text-white uppercase tracking-wide text-sm">
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="relative bg-[#05070d] text-white border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -bottom-72 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 text-center">
          <h2 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] mb-5">
            Your horizon is <span className="text-holo">waiting</span>
          </h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto mb-10">
            Tell us how you like to cruise and we&apos;ll handle the rest — from the
            perfect cabin to the moment you step aboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-white text-black font-semibold uppercase tracking-wider text-sm px-10 py-4 rounded-full hover:bg-white/90 transition-all"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/group-blocks"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-10 py-4 rounded-full transition-all"
            >
              Browse Cabins &amp; Dates
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
