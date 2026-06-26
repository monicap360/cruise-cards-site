"use client";

import Link from "next/link";
import { useState } from "react";
import Photo from "@/components/Photo";
import { destinations } from "./destination-data";

const filters = [
  { id: "all", label: "All Destinations", count: destinations.length },
  { id: "mexico", label: "Mexico", count: destinations.filter((d) => d.region === "mexico").length },
  { id: "central-america", label: "Central America", count: destinations.filter((d) => d.region === "central-america").length },
  { id: "caribbean", label: "Caribbean", count: destinations.filter((d) => d.region === "caribbean").length },
  { id: "bahamas", label: "Bahamas", count: destinations.filter((d) => d.region === "bahamas").length },
  { id: "private-islands", label: "Private Islands", count: destinations.filter((d) => d.region === "private-islands").length },
];

const lineColors: Record<string, string> = {
  Carnival: "bg-white/10 text-white border border-white/15",
  "Royal Caribbean": "bg-white/10 text-white border border-white/15",
  Norwegian: "bg-white/10 text-white border border-white/15",
  Princess: "bg-white/10 text-white border border-white/15",
  MSC: "bg-white/10 text-white border border-white/15",
  Disney: "bg-white/10 text-white border border-white/15",
};

export default function DestinationsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? destinations
      : destinations.filter((d) => d.region === activeFilter);

  return (
    <div className="bg-[#05070d]">
      {/* Hero */}
      <section className="bg-[#05070d] text-white relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-bg" />
        <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Sail from Galveston, Texas"}</div>
          <h1 className="text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">Cruise Destinations</h1>
          <p className="text-white/55 text-xl max-w-2xl mx-auto">
            From Mayan ruins to private islands, world-class reefs to colonial
            cities — every destination below is reachable directly from the Port
            of Galveston.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-[#0b1020] border border-white/10 rounded-full px-4 py-2 font-semibold text-white/55">
              {destinations.length} Destinations
            </div>
            <div className="bg-[#0b1020] border border-white/10 rounded-full px-4 py-2 font-semibold text-white/55">
              6 Cruise Lines
            </div>
            <div className="bg-[#0b1020] border border-white/10 rounded-full px-4 py-2 font-semibold text-white/55">
              6 Private Islands
            </div>
            <div className="bg-[#0b1020] border border-white/10 rounded-full px-4 py-2 font-semibold text-white/55">
              All Depart from Galveston
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-[#05070d] border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeFilter === f.id
                    ? "bg-white text-black"
                    : "bg-white/[0.03] text-white/55 border border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {f.label}
                <span
                  className={`ml-2 text-xs ${
                    activeFilter === f.id ? "text-black/50" : "text-white/45"
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destination Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="bg-[#0b1020] rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-colors"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${dest.color} text-white p-6 relative overflow-hidden`}>
                <Photo
                  src={`/destinations/${dest.id}.jpg`}
                  alt={dest.name}
                  overlay={false}
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-[#05070d]/55" />
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{dest.flag}</span>
                      <span className="text-white/70 text-sm font-medium">
                        {dest.country}
                      </span>
                    </div>
                    <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-1">{dest.name}</h2>
                    <p className="text-white/80 text-sm font-medium">{dest.tagline}</p>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className="text-5xl mb-1">{dest.icon}</div>
                    <div className="bg-black/30 border border-white/20 rounded-full px-3 py-1 text-xs font-bold text-white whitespace-nowrap">
                      {dest.nights}
                    </div>
                  </div>
                </div>
                {/* Highlight badge */}
                <div className="relative z-10 mt-3 inline-block bg-black/30 border border-white/15 rounded-full px-3 py-1 text-xs font-bold">
                  {dest.highlight}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-5">
                <p className="text-white/55 text-sm leading-relaxed">
                  {dest.description}
                </p>

                {/* Activities */}
                <div>
                  <h3 className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">{"// Top Things to Do"}</h3>
                  <ul className="space-y-2">
                    {dest.activities.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/55">
                        <span className="text-lg leading-none mt-0.5 flex-shrink-0">{a.icon}</span>
                        <span>{a.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cruise Lines */}
                <div>
                  <h3 className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">{"// Cruise Lines from Galveston"}</h3>
                  <div className="flex flex-wrap gap-2">
                    {dest.cruiseLines.map((line) => (
                      <span
                        key={line}
                        className={`text-xs font-bold px-3 py-1 rounded-full ${lineColors[line] ?? "bg-white/10 text-white border border-white/15"}`}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Best For */}
                <div>
                  <h3 className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">{"// Best For"}</h3>
                  <div className="flex flex-wrap gap-2">
                    {dest.bestFor.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium bg-white/[0.03] text-white/55 border border-white/10 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/destinations/${dest.id}`}
                    className="flex-1 text-center bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider py-3 rounded-full text-sm transition-all"
                  >
                    Explore {dest.name}
                  </Link>
                  <Link
                    href={`/find?q=${encodeURIComponent(dest.dealKey ?? dest.name)}`}
                    className="px-4 py-3 rounded-full text-sm font-semibold uppercase tracking-wider border border-white/25 text-white/80 hover:text-white hover:border-white/50 transition-all whitespace-nowrap"
                  >
                    Cruises →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/45">
            <p className="text-xl font-bold uppercase tracking-[-0.01em]">No destinations found</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-[#05070d] border-t border-white/10 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-3">
            Not Sure Which Destination is Right for You?
          </h2>
          <p className="text-white/55 mb-6">
            Our Galveston cruise specialists have sailed these ports and know
            every itinerary inside and out. Tell us what you&apos;re looking for
            and we&apos;ll find the perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Talk to a Specialist
            </Link>
            <Link
              href="/deals"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Browse Current Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
