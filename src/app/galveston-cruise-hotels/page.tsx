import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Galveston Cruise Hotels with Parking & Shuttle | Park, Stay & Cruise",
  description:
    "The best Galveston 'park, stay & cruise' hotels — a pre-cruise night plus up to 7 nights of parking and a round-trip port shuttle. We book the bundle for you. Summer rates from ~$250/night.",
  alternates: { canonical: "/galveston-cruise-hotels" },
};

type Hotel = {
  name: string;
  distance: string;
  perks: string[];
  vibe: string;
};

const HOTELS: Hotel[] = [
  {
    name: "Harbor House Hotel & Marina at Pier 21",
    distance: "0.4 mi — steps from the terminal",
    perks: ["Walk or 5-minute ride to the cruise terminal", "Harborfront rooms right over the marina", "On historic Pier 21 — restaurants & the Strand at your door", "Group rates pending — ask us for current pricing"],
    vibe: "Closest to the port — wake up on the water and stroll to your ship.",
  },
  {
    name: "Hilton Galveston Island Resort",
    distance: "Beachfront",
    perks: ["1 night + up to 7 nights parking", "Round-trip port shuttle", "Oceanfront pool & beach access"],
    vibe: "Beachfront resort — make a vacation of the night before.",
  },
  {
    name: "Holiday Inn Resort Galveston",
    distance: "2.7 mi from terminal",
    perks: ["Up to 7 nights free parking", "Round-trip port shuttle", "Breakfast for two (kids eat free)", "Big outdoor pool, arcade, tennis"],
    vibe: "Most family-friendly — pool, waterfall, kids' activities.",
  },
  {
    name: "Comfort Suites Galveston",
    distance: "6.2 mi from terminal",
    perks: ["Up to 7 nights parking", "Port shuttle", "Free hot breakfast", "Outdoor pool"],
    vibe: "Great value with a free hot breakfast.",
  },
  {
    name: "SpringHill Suites Galveston",
    distance: "4.5 mi from terminal",
    perks: ["Up to 7 nights parking", "Port shuttle", "Spacious suites", "Indoor pool & fitness center"],
    vibe: "Roomy suites and an indoor pool.",
  },
];

const FAQ = [
  {
    q: "What is a 'park, stay & cruise' package?",
    a: "You stay one night at a Galveston hotel before your cruise, leave your car in their lot for the whole sailing (usually up to 7 nights), and ride their shuttle to and from the cruise terminal. It removes the two biggest sail-day headaches — parking and getting to the port.",
  },
  {
    q: "How much do Galveston cruise hotels cost?",
    a: "Nightly rates peak in summer (June–August) at roughly $250 and up, and are lower off-season. Full park-and-cruise bundles (a night plus parking) often start around $359. Many of these packages must be booked directly — we handle that for you.",
  },
  {
    q: "Do I have to fly?",
    a: "No — most guests drive in and park. If you're coming from farther out, fly into Houston (IAH or Hobby) and we'll arrange your transfer to the hotel and port.",
  },
  {
    q: "How do I add a hotel to my cruise?",
    a: "Add it right on your cabin reservation (the 'Pre & Post-Cruise' section), or call us at (409) 632-2106 and a specialist will bundle the hotel, parking, shuttle, and transfers with your booking.",
  },
];

export default function GalvestonCruiseHotelsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/galveston-port.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/85 to-[#05070d]/60" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">{"// Park, Stay & Cruise"}</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-4">
            Galveston Cruise Hotels with <span className="text-holo">Parking &amp; Shuttle</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Skip the sail-day stress: stay the night before, park free for your whole cruise, and
            ride the shuttle to the terminal. We book the whole bundle — hotel, parking, shuttle,
            and transfers — with your cabin.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href="/book-cabin" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all">Add a hotel to my cruise</Link>
            <a href="tel:+14096322106" className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all">Call (409) 632-2106</a>
          </div>
        </div>
      </section>

      {/* What it includes */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: "🛏️", t: "Stay", d: "A relaxed night near the port before you sail." },
            { icon: "🅿️", t: "Park", d: "Leave your car in the hotel lot — usually up to 7 nights." },
            { icon: "🚐", t: "Cruise", d: "Round-trip shuttle to and from the terminal." },
          ].map((c) => (
            <div key={c.t} className="bg-[#0b1020] border border-white/10 rounded-2xl p-5">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-extrabold uppercase tracking-tight">{c.t}</div>
              <div className="text-white/55 text-sm mt-1">{c.d}</div>
            </div>
          ))}
        </div>

        <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-5">{"// Recommended hotels"}</div>
        <div className="space-y-4">
          {HOTELS.map((h) => (
            <div key={h.name} className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-xl font-extrabold">{h.name}</h2>
                <span className="text-[11px] font-bold uppercase px-3 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/25">{h.distance}</span>
              </div>
              <p className="text-white/55 text-sm mt-1">{h.vibe}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {h.perks.map((p) => (
                  <span key={p} className="text-xs text-white/70 bg-white/5 border border-white/10 rounded-full px-3 py-1">✓ {p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-white/40 text-xs mt-4">
          Summer (Jun–Aug) rates run ~$250/night and up; lower off-season. Package details &amp; rates
          vary and are confirmed when you book — many bundles are only available direct, which is why we book them for you.
        </p>

        {/* FAQ */}
        <div className="mt-14">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-5">{"// Frequently asked"}</div>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <div key={f.q} className="bg-[#0b1020] border border-white/10 rounded-2xl p-5">
                <div className="font-bold text-white">{f.q}</div>
                <div className="text-white/60 text-sm mt-1.5">{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-[#0b1020] border border-sky-400/25 rounded-2xl p-7 text-center">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-2">Bundle your hotel with your cruise</h2>
          <p className="text-white/55 mb-5">Add a pre- or post-cruise hotel right on your reservation, or let a Galveston specialist build the whole trip.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/book-cabin" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all">Reserve a cabin + hotel</Link>
            <Link href="/transportation" className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all">Parking & transfers</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
