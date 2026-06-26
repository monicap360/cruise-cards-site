import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cruise Planning Guides | Cruises from Galveston",
  description:
    "Plan your Galveston cruise with confidence. Guides on passport & travel-document requirements, the Port of Galveston cruise terminals, travel protection insurance, parking, check-in, and shore excursions.",
};

type Guide = {
  href: string;
  icon: string;
  title: string;
  desc: string;
};

const GUIDES: Guide[] = [
  {
    href: "/guides/passport-requirements",
    icon: "🛂",
    title: "Passport & Travel Documents",
    desc: "What ID you need for a round-trip Galveston cruise — and why a passport still helps.",
  },
  {
    href: "/guides/cruise-terminals",
    icon: "🚢",
    title: "Port of Galveston Terminals",
    desc: "Finding your terminal, embarkation-day timing, drop-off, and luggage drop with porters.",
  },
  {
    href: "/guides/travel-insurance",
    icon: "🛡️",
    title: "Travel Protection Insurance",
    desc: "What cruise insurance covers and how to choose between line plans and third-party coverage.",
  },
  {
    href: "/transportation",
    icon: "🚐",
    title: "Parking & Transfers",
    desc: "Reserve port parking or a door-to-terminal ride for your sail date.",
  },
  {
    href: "/cruise-line-apps",
    icon: "📲",
    title: "App & Check-In",
    desc: "Download your cruise line's app and complete online check-in before you sail.",
  },
  {
    href: "/destinations",
    icon: "🏝️",
    title: "Ports & Excursions",
    desc: "Explore the destinations and shore excursions on Western Caribbean itineraries.",
  },
];

export default function GuidesHubPage() {
  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#05070d] text-white py-20">
        <div className="absolute inset-0 grid-bg" />
        <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Cruise Planning Guides"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.01em] mb-5">
            Everything you need before you sail.
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Clear, Galveston-specific answers to the questions we hear most at the
            Experience Center — from travel documents to terminals to protecting
            your trip. Plan. Book. Protect. Sail. Return.
          </p>
        </div>
      </section>

      {/* Guide grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group bg-[#0b1020] border border-white/10 rounded-2xl p-7 hover:border-sky-400/40 transition-colors flex flex-col"
            >
              <div className="text-4xl mb-4">{g.icon}</div>
              <h2 className="text-lg font-extrabold uppercase tracking-[-0.01em] mb-2">
                {g.title}
              </h2>
              <p className="text-white/55 text-sm leading-relaxed flex-1">{g.desc}</p>
              <span className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 group-hover:text-sky-300 mt-5">
                Read guide →
              </span>
            </Link>
          ))}
        </div>

        {/* Help CTA */}
        <div className="mt-14 bg-[#0b1020] border border-sky-400/25 rounded-2xl p-8 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
            {"// Talk to a specialist"}
          </div>
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-3">
            Still have questions?
          </h2>
          <p className="text-white/55 max-w-xl mx-auto mb-6">
            Stop by the Cruise Experience Center at 3501 Winnie St, Galveston, TX, or
            call us — a real specialist will help you plan, book, and protect your
            sailing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+14096322106"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Call (409) 632-2106
            </a>
            <Link
              href="/contact"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
