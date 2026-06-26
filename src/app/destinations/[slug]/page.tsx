"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Photo from "@/components/Photo";
import { destinations } from "../destination-data";
import { getPortGuide } from "@/lib/port-guides";

export default function DestinationDetailPage() {
  const params = useParams();
  const slug = String(params.slug ?? "");
  const dest = destinations.find((d) => d.id === slug);

  if (!dest) {
    return (
      <div className="bg-[#05070d] text-white min-h-[60vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-3">
            Destination not found
          </h1>
          <Link
            href="/destinations"
            className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
          >
            All Destinations
          </Link>
        </div>
      </div>
    );
  }

  const isIsland = dest.region === "private-islands";
  const guide = getPortGuide(dest.id, isIsland);

  return (
    <div className="bg-[#05070d] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <Photo
          src={`/destinations/${dest.id}.jpg`}
          alt={`${dest.name}, ${dest.country}`}
          gradient={dest.color}
          overlay={false}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/55 to-[#05070d]/30" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14">
          <Link
            href="/destinations"
            className="label-mono text-[11px] uppercase tracking-wider text-white/60 hover:text-white transition-colors inline-block mb-5"
          >
            ← All destinations
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{dest.flag}</span>
            <span className="text-white/70 text-sm font-medium">
              {dest.country}
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-3">
            {dest.name}
          </h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl">
            {dest.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/find?q=${encodeURIComponent(dest.dealKey ?? dest.name)}`}
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all"
            >
              See cruises to {dest.name} →
            </Link>
            <span className="hud label-mono text-[11px] uppercase tracking-wider text-white px-4 py-3 rounded-full">
              {dest.nights} from Galveston
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {/* Overview */}
        <div>
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
            {"// About the Port"}
          </div>
          <p className="text-white/70 text-lg leading-relaxed max-w-3xl">
            {dest.description}
          </p>
        </div>

        {/* Port-day practical guide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[#0b1020] border border-sky-400/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🚢</span>
              <h2 className="font-extrabold uppercase tracking-tight text-white">
                When you get off the ship
              </h2>
            </div>
            <p className="text-white/65 text-sm leading-relaxed">
              {guide.arrival}
            </p>
          </div>
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🚕</span>
              <h2 className="font-extrabold uppercase tracking-tight text-white">
                Getting around &amp; taxis
              </h2>
            </div>
            <p className="text-white/65 text-sm leading-relaxed">
              {guide.gettingAround}
            </p>
          </div>
        </div>

        {/* Insider tips */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💡</span>
            <h2 className="font-extrabold uppercase tracking-tight text-white">
              Insider tips
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {guide.tips.map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 text-white/65 text-sm"
              >
                <span className="text-sky-400 flex-shrink-0 mt-0.5">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Top things to do */}
        <div>
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Top Things to Do in Port"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dest.activities.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-[#0b1020] border border-white/10 rounded-xl p-4"
              >
                <span className="text-2xl flex-shrink-0">{a.icon}</span>
                <span className="text-white/70 text-sm leading-relaxed">
                  {a.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lines + best for */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
              {"// Cruise Lines from Galveston"}
            </div>
            <div className="flex flex-wrap gap-2">
              {dest.cruiseLines.map((l) => (
                <span
                  key={l}
                  className="bg-white/5 border border-white/15 rounded-full px-3.5 py-1.5 text-sm text-white/75"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
              {"// Best For"}
            </div>
            <div className="flex flex-wrap gap-2">
              {dest.bestFor.map((b) => (
                <span
                  key={b}
                  className="bg-sky-500/10 border border-sky-400/25 text-sky-200 rounded-full px-3.5 py-1.5 text-sm"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-2">
            Ready to set sail to {dest.name}?
          </h2>
          <p className="text-white/55 mb-6 max-w-xl mx-auto">
            Every sailing is a round-trip from the Port of Galveston. Pick your
            dates and cabin, or let a specialist plan it for you.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={`/find?q=${encodeURIComponent(dest.dealKey ?? dest.name)}`}
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all"
            >
              See cruises to {dest.name}
            </Link>
            <Link
              href="/contact"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all"
            >
              Ask a specialist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
