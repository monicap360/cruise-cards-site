"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  type SailingBlock,
  type Cabin,
  type CabinCategory,
  getSailingBlocks,
  groupByType,
  CATEGORY_ICON,
} from "@/lib/room-blocks";
import { fmtDate, fmt$ } from "@/lib/sea-pay";

const CATEGORY_PHOTOS: Record<CabinCategory, { gradient: string; features: string[] }> = {
  Interior: {
    gradient: "from-slate-600 to-slate-800",
    features: ["Queen or twin beds", "Full bathroom", "Climate control", "Interactive TV", "In-room safe"],
  },
  "Ocean View": {
    gradient: "from-blue-500 to-blue-800",
    features: ["Porthole or large window", "Natural light & ocean views", "Queen or twin beds", "Full bathroom", "Extra square footage"],
  },
  Balcony: {
    gradient: "from-teal-500 to-blue-700",
    features: ["Private balcony", "Floor-to-ceiling door", "Outdoor seating", "Fresh ocean air", "Some with extended balconies"],
  },
  "Mini-Suite": {
    gradient: "from-purple-500 to-purple-800",
    features: ["Separate living area", "Sofa with pull-out", "Larger balcony", "Enhanced bathroom", "Priority boarding"],
  },
  Suite: {
    gradient: "from-yellow-500 to-orange-700",
    features: ["Full living room", "Butler service", "Premium amenities", "Whirlpool tub", "Concierge access"],
  },
};

export default function GroupBlocksPage() {
  const [blocks, setBlocks] = useState<SailingBlock[]>([]);
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<string | null>(null);

  useEffect(() => {
    const all = getSailingBlocks();
    setBlocks(all.filter((b) => b.cabins.some((c) => c.status === "available")));
  }, []);

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
            🚢 Group Cabin Blocks
          </div>
          <h1 className="text-5xl font-extrabold mb-4">Available Room Blocks</h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            We hold group cabin blocks on select sailings — specific room numbers, exact decks, and known locations. See what&apos;s available and reserve yours today.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 justify-center text-sm font-semibold">
            <span className="bg-green-600/20 text-green-300 border border-green-500/30 px-4 py-1.5 rounded-full">
              ✅ Available — ready to book
            </span>
            <span className="bg-yellow-500/20 text-yellow-200 border border-yellow-400/30 px-4 py-1.5 rounded-full">
              🔒 Held — contact us to inquire
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {blocks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">🚢</div>
            <h2 className="text-xl font-extrabold text-blue-900 mb-2">No Group Blocks Available Right Now</h2>
            <p className="text-gray-400 mb-6">
              New blocks are added regularly. Contact us to ask about upcoming group sailings.
            </p>
            <Link
              href="/contact"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full text-sm transition-all"
            >
              Contact a Cruise Specialist
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {blocks.map((block) => {
              const byType = groupByType(block.cabins.filter((c) => c.status === "available"));
              const isOpen = expandedBlock === block.id;

              return (
                <div key={block.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                  {/* Sailing header */}
                  <button
                    onClick={() => setExpandedBlock(isOpen ? null : block.id)}
                    className="w-full text-left"
                  >
                    <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h2 className="text-2xl font-extrabold">{block.ship}</h2>
                        <p className="text-blue-200 text-sm mt-0.5">
                          {block.cruiseLine} · {fmtDate(block.sailingDate)} · {block.nights} nights
                        </p>
                        <p className="text-blue-300 text-xs mt-0.5">{block.itinerary}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Available counts by type */}
                        {Object.entries(byType).map(([type, cabins]) => (
                          <span key={type} className="bg-white/15 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            {(CATEGORY_ICON as Record<string, string>)[type]} {cabins.length} {type}
                          </span>
                        ))}
                        <span className="text-white/60 text-xl">{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </div>
                  </button>

                  {/* Expanded: room list by type */}
                  {isOpen && (
                    <div className="p-6 space-y-6">
                      {Object.entries(byType).map(([type, cabins]) => {
                        const typeKey = `${block.id}-${type}`;
                        const typeOpen = expandedType === typeKey;
                        const info = CATEGORY_PHOTOS[type as CabinCategory] ?? CATEGORY_PHOTOS["Interior"];
                        const minPrice = Math.min(...cabins.map((c) => c.price));

                        return (
                          <div key={type} className="rounded-2xl border border-gray-100 overflow-hidden">
                            {/* Type header with "photo" */}
                            <button
                              onClick={() => setExpandedType(typeOpen ? null : typeKey)}
                              className="w-full text-left"
                            >
                              <div className={`bg-gradient-to-br ${info.gradient} text-white p-5 flex items-center justify-between`}>
                                <div className="flex items-center gap-4">
                                  <span className="text-4xl">
                                    {(CATEGORY_ICON as Record<string, string>)[type]}
                                  </span>
                                  <div>
                                    <div className="font-extrabold text-xl">{type}</div>
                                    <div className="text-white/70 text-sm">
                                      {cabins.length} room{cabins.length !== 1 ? "s" : ""} available · From {fmt$(minPrice)}/person
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="hidden sm:flex gap-1.5 flex-wrap max-w-xs">
                                    {info.features.slice(0, 3).map((f) => (
                                      <span key={f} className="bg-white/15 text-white text-xs px-2.5 py-1 rounded-full">{f}</span>
                                    ))}
                                  </div>
                                  <span className="text-white/60 text-lg">{typeOpen ? "▲" : "▼"}</span>
                                </div>
                              </div>
                            </button>

                            {/* Room list */}
                            {typeOpen && (
                              <div>
                                {/* Features bar */}
                                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                                  <div className="flex flex-wrap gap-2">
                                    {info.features.map((f) => (
                                      <span key={f} className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">
                                        ✓ {f}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Table header */}
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide">
                                  <div>Room #</div>
                                  <div>Deck</div>
                                  <div>Location</div>
                                  <div className="hidden sm:block">Notes</div>
                                  <div className="text-right">Price / Book</div>
                                </div>

                                {(cabins as Cabin[]).sort((a, b) => a.deck - b.deck || a.roomNumber.localeCompare(b.roomNumber)).map((cabin) => (
                                  <div
                                    key={cabin.id}
                                    className="grid grid-cols-4 sm:grid-cols-5 gap-2 items-center px-5 py-4 border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                                  >
                                    <div className="font-extrabold text-blue-900 font-mono text-sm">
                                      {cabin.roomNumber}
                                    </div>
                                    <div className="text-gray-600 text-sm">Deck {cabin.deck}</div>
                                    <div className="text-gray-600 text-sm">{cabin.location}</div>
                                    <div className="hidden sm:block text-gray-400 text-xs italic">
                                      {cabin.notes || "—"}
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                      <span className="font-extrabold text-blue-900 text-sm">
                                        {fmt$(cabin.price)}<span className="text-gray-400 text-xs font-normal">/pp</span>
                                      </span>
                                      <Link
                                        href={`/contact?room=${encodeURIComponent(cabin.roomNumber)}&ship=${encodeURIComponent(block.ship)}&type=${encodeURIComponent(type)}`}
                                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all whitespace-nowrap"
                                      >
                                        Reserve
                                      </Link>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Sea Pay + Hold buttons */}
                      <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                        <Link
                          href={`/sea-pay/plan?ship=${encodeURIComponent(block.ship)}`}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all"
                        >
                          💳 Set Up Sea Pay for This Sailing
                        </Link>
                        <Link
                          href={`/hold?ship=${encodeURIComponent(block.ship)}&sailing=${encodeURIComponent(block.sailingDate)}`}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all"
                        >
                          🔒 Hold a Room (24/48/72 hr)
                        </Link>
                        <Link
                          href="/contact"
                          className="border border-gray-200 text-gray-600 text-sm font-bold px-5 py-2.5 rounded-full hover:bg-gray-50 transition-all"
                        >
                          Ask a Specialist
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-3">Don&apos;t See Your Sailing?</h2>
          <p className="text-blue-200 mb-6">
            We can add group blocks to many sailings. Contact us and we&apos;ll check inventory for you.
          </p>
          <Link
            href="/contact"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-full text-lg transition-all shadow-lg inline-block"
          >
            Contact a Cruise Specialist
          </Link>
        </div>
      </section>
    </div>
  );
}
