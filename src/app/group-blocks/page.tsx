"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  type SailingBlock,
  type Cabin,
  type CabinCategory,
  getSailingBlocks,
  groupByType,
  CATEGORY_INFO,
} from "@/lib/room-blocks";
import { fmtDate, fmt$ } from "@/lib/sea-pay";
import Photo from "@/components/Photo";
import CelebrationStrip from "@/components/CelebrationStrip";

export default function GroupBlocksPage() {
  const [blocks, setBlocks] = useState<SailingBlock[]>([]);
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<string | null>(null);

  useEffect(() => {
    getSailingBlocks().then((all) =>
      setBlocks(all.filter((b) => b.cabins.some((c) => c.status === "available")))
    );
  }, []);

  return (
    <div className="bg-[#05070d]">
      {/* Header */}
      <section className="bg-[#05070d] text-white relative overflow-hidden py-16">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 left-1/2 -translate-x-1/2 -top-32 opacity-[0.14]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Group Cabin Blocks"}</div>
          <h1 className="text-5xl font-extrabold uppercase tracking-[-0.01em] text-white mb-4">Available Room Blocks</h1>
          <p className="text-white/55 text-xl max-w-2xl mx-auto">
            We hold group cabin blocks on select sailings — specific room numbers, exact decks, and known locations. See what&apos;s available and reserve yours today.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 justify-center text-sm font-semibold">
            <span className="bg-white/10 text-white/70 border border-white/15 px-4 py-1.5 rounded-full">
              Available — ready to book
            </span>
            <span className="bg-white/5 text-white/55 border border-white/10 px-4 py-1.5 rounded-full">
              Held — contact us to inquire
            </span>
          </div>
        </div>
      </section>

      {/* Group perk — free cabin with 8+ */}
      <CelebrationStrip />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2">
        <div className="bg-[#0b1020] border border-sky-400/30 rounded-2xl p-6 sm:p-8">
          <div className="grid lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">
                {"// Group Perk"}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.01em] mb-2">
                Book 8 Cabins — the{" "}
                <span className="text-holo">9th Sails Free</span>
              </h2>
              <p className="text-white/55 text-sm leading-relaxed">
                Weddings, family reunions, corporate retreats, milestone birthdays —
                bring the whole crew. Reserve eight staterooms and the ninth is on
                us, with a <span className="text-white">dedicated group
                coordinator</span> handling cabins, dining, and the whole itinerary.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  "Weddings",
                  "Family Reunions",
                  "Corporate Retreats",
                  "Bachelorette",
                  "Milestone Birthdays",
                ].map((t) => (
                  <span
                    key={t}
                    className="label-mono text-[10px] uppercase tracking-wider text-white/60 bg-white/5 border border-white/10 rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-6 py-4 rounded-full transition-all text-center"
              >
                Plan a Group Cruise
              </Link>
              <Link
                href="/sea-pay"
                className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-6 py-4 rounded-full transition-all text-center"
              >
                Ask About Group Sea Pay™
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {blocks.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-16 text-center">
            <h2 className="text-xl font-extrabold uppercase tracking-[-0.01em] text-white mb-2">No Group Blocks Available Right Now</h2>
            <p className="text-white/45 mb-6">
              New blocks are added regularly. Contact us to ask about upcoming group sailings.
            </p>
            <Link
              href="/contact"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-8 py-4 rounded-full text-sm transition-all"
            >
              Contact a Cruise Specialist
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {blocks.map((block) => {
              const available = block.cabins.filter((c) => c.status === "available");
              const byType = groupByType(available.filter((c) => !c.isGuarantee));
              const gtyByType = groupByType(available.filter((c) => c.isGuarantee));
              const isOpen = expandedBlock === block.id;

              return (
                <div key={block.id} className="bg-[#0b1020] rounded-2xl border border-white/10 overflow-hidden">
                  {/* Sailing header */}
                  <button
                    onClick={() => setExpandedBlock(isOpen ? null : block.id)}
                    className="w-full text-left"
                  >
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-[#0a1f44] text-white p-6 flex items-center justify-between flex-wrap gap-4">
                      <div className="absolute inset-0 grid-bg opacity-40" />
                      <div className="relative z-10">
                        <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">{block.ship}</h2>
                        <p className="text-white/55 text-sm mt-0.5">
                          {block.cruiseLine} · {fmtDate(block.sailingDate)} · {block.nights} nights
                        </p>
                        <p className="text-white/45 text-xs mt-0.5">{block.itinerary}</p>
                      </div>
                      <div className="relative z-10 flex items-center gap-3 flex-wrap">
                        {/* Available counts by type */}
                        {Object.entries(byType).map(([type, cabins]) => (
                          <span key={type} className="bg-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            {cabins.length} {type}
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
                        const info = CATEGORY_INFO[type as CabinCategory] ?? CATEGORY_INFO["Interior"];
                        const minPrice = Math.min(...cabins.map((c) => c.price));

                        return (
                          <div key={type} className="rounded-2xl border border-white/10 overflow-hidden">
                            {/* Type header with "photo" */}
                            <button
                              onClick={() => setExpandedType(typeOpen ? null : typeKey)}
                              className="w-full text-left"
                            >
                              <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-[#0a1f44] text-white p-5 flex items-center justify-between">
                                <Photo
                                  src={`/cabins/${type
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, "-")}.jpg`}
                                  alt={`${type} stateroom`}
                                  overlay={false}
                                  className="absolute inset-0"
                                />
                                <div className="absolute inset-0 bg-[#05070d]/60" />
                                <div className="absolute inset-0 grid-bg opacity-30" />
                                <div className="relative z-10 flex items-center gap-4">
                                  <div>
                                    <div className="font-extrabold uppercase tracking-[-0.01em] text-xl">{type}</div>
                                    <div className="text-white/55 text-xs font-semibold">
                                      {info.sqftRange}
                                    </div>
                                    <div className="text-white/55 text-sm">
                                      {cabins.length} room{cabins.length !== 1 ? "s" : ""} available · From {fmt$(minPrice)}/person
                                    </div>
                                  </div>
                                </div>
                                <div className="relative z-10 flex items-center gap-3">
                                  <div className="hidden sm:flex gap-1.5 flex-wrap max-w-xs">
                                    {info.features.slice(0, 3).map((f) => (
                                      <span key={f} className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-full">{f}</span>
                                    ))}
                                  </div>
                                  <span className="text-white/60 text-lg">{typeOpen ? "▲" : "▼"}</span>
                                </div>
                              </div>
                            </button>

                            {/* Room list */}
                            {typeOpen && (
                              <div>
                                {/* Description + square footage + features */}
                                <div className="bg-[#05070d] px-5 py-4 border-b border-white/10">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-extrabold text-sky-400 bg-sky-400/10 px-2.5 py-1 rounded-full">
                                      {info.sqftRange}
                                    </span>
                                  </div>
                                  <p className="text-sm text-white/55 leading-relaxed mb-3">
                                    {info.desc}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {info.features.map((f) => (
                                      <span key={f} className="text-xs font-semibold text-white/55 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                                        {f}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Table header */}
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 px-5 py-3 bg-[#05070d] border-b border-white/10 text-xs font-bold text-white/45 uppercase tracking-wide">
                                  <div>Room #</div>
                                  <div>Deck</div>
                                  <div>Location</div>
                                  <div className="hidden sm:block">Notes</div>
                                  <div className="text-right">Price / Book</div>
                                </div>

                                {(cabins as Cabin[]).sort((a, b) => a.deck - b.deck || a.roomNumber.localeCompare(b.roomNumber)).map((cabin) => (
                                  <div
                                    key={cabin.id}
                                    className="grid grid-cols-4 sm:grid-cols-5 gap-2 items-center px-5 py-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                                  >
                                    <div className="font-extrabold text-white font-mono text-sm">
                                      {cabin.roomNumber}
                                    </div>
                                    <div className="text-white/55 text-sm">Deck {cabin.deck}</div>
                                    <div className="text-white/55 text-sm">{cabin.location}</div>
                                    <div className="hidden sm:block text-white/45 text-xs italic">
                                      {cabin.notes || "—"}
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                      <span className="font-extrabold text-white text-sm">
                                        {fmt$(cabin.price)}<span className="text-white/45 text-xs font-normal">/pp</span>
                                      </span>
                                      <Link
                                        href={`/contact?room=${encodeURIComponent(cabin.roomNumber)}&ship=${encodeURIComponent(block.ship)}&type=${encodeURIComponent(type)}`}
                                        className="bg-white text-black hover:bg-white/90 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-all whitespace-nowrap"
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

                      {/* Guarantee (GTY) options — room assigned by cruise line */}
                      {Object.keys(gtyByType).length > 0 && (
                        <div className="rounded-2xl border border-white/10 bg-[#05070d] p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-extrabold uppercase tracking-[-0.01em] text-white">
                              Guarantee Rates — Available Anywhere on the Ship
                            </h4>
                          </div>
                          <p className="text-white/55 text-sm mb-4">
                            Lock in a category at a great rate. You&apos;re
                            guaranteed at least this stateroom type — the cruise
                            line assigns your exact room number closer to sailing.
                          </p>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Object.entries(gtyByType).map(([type, units]) => {
                              const minPrice = Math.min(
                                ...(units as Cabin[]).map((u) => u.price)
                              );
                              return (
                                <div
                                  key={type}
                                  className="bg-[#0b1020] rounded-xl border border-white/10 p-4 flex items-center justify-between gap-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <div className="font-extrabold uppercase tracking-[-0.01em] text-white text-sm">
                                        {type}
                                      </div>
                                      <div className="text-white/45 text-xs">
                                        {(CATEGORY_INFO[type as CabinCategory] ?? CATEGORY_INFO["Interior"]).sqftRange}
                                      </div>
                                      <div className="text-white/45 text-xs">
                                        From {fmt$(minPrice)}/person · GTY
                                      </div>
                                    </div>
                                  </div>
                                  <Link
                                    href={`/contact?ship=${encodeURIComponent(block.ship)}&type=${encodeURIComponent(type)}&gty=1`}
                                    className="bg-white text-black hover:bg-white/90 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full whitespace-nowrap"
                                  >
                                    Reserve
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Sea Pay + Hold buttons */}
                      <div className="flex flex-wrap gap-3 pt-2 border-t border-white/10">
                        <Link
                          href={`/sea-pay/plan?ship=${encodeURIComponent(block.ship)}`}
                          className="bg-white text-black hover:bg-white/90 text-sm font-semibold uppercase tracking-wider px-6 py-3 rounded-full transition-all"
                        >
                          Set Up Sea Pay for This Sailing
                        </Link>
                        <Link
                          href={`/hold?ship=${encodeURIComponent(block.ship)}&sailing=${encodeURIComponent(block.sailingDate)}`}
                          className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white text-sm font-semibold uppercase tracking-wider px-6 py-3 rounded-full transition-all"
                        >
                          Hold a Room (24/48/72 hr)
                        </Link>
                        <Link
                          href="/contact"
                          className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white text-sm font-semibold uppercase tracking-wider px-6 py-3 rounded-full transition-all"
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

      {/* FAQ — group vs individual */}
      <section className="bg-[#05070d] text-white border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
            {"// FAQ"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.01em] mb-8">
            Group vs. Individual Reservations
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What is an individual reservation?",
                a: "An individual (or standard) reservation is one booking for your own cabin — you pick the ship, date, and stateroom, pay your own deposit, and manage your own payments and check-in. It's the right choice for a single household traveling on its own.",
              },
              {
                q: "What is a group reservation?",
                a: "A group reservation is a block of cabins (typically 8+ staterooms / 16+ guests) held together under one group — perfect for families, reunions, weddings, churches, and friend trips. Everyone sails on the same date and ship, and the group is managed as a whole with a shared rate and a group leader.",
              },
              {
                q: "How is pricing different?",
                a: "Groups get a negotiated group rate that's locked for the whole block, plus group amenities the cruise line offers (onboard credit, perks) and often a free berth — commonly one free guest (cruise fare) for every 8 paid cabins. Individuals pay the current published fare, which moves up and down with demand.",
              },
              {
                q: "How do deposits and payments work?",
                a: "In a group, the cabins are held with group deposits and each guest pays their own deposit and balance toward their cabin by the group's deadlines. Individually, you simply pay your own deposit and final payment. Either way, each guest's balance is tracked separately.",
              },
              {
                q: "Can each guest still manage their own cabin?",
                a: "Yes. In a group, every guest has their own confirmation number, cabin, and guest details — they just sail under the group umbrella. The group leader sees a live roster (who's booked, who's paid a deposit, who's paid in full), while each guest still does their own online check-in.",
              },
              {
                q: "What happens to unbooked rooms in a group block?",
                a: "Held cabins that aren't claimed by the group's release date are returned to general inventory at the prevailing (non-group) price. That's why we show a countdown and a Book Now in the group portal — book before release to keep the group rate.",
              },
              {
                q: "Which should I choose?",
                a: "Traveling solo or as one household? An individual reservation is simplest. Bringing 8+ cabins together for an occasion? A group reservation locks a shared rate, unlocks perks and a possible free berth, and gives your leader a portal to see everyone's status at a glance.",
              },
            ].map((f) => (
              <div
                key={f.q}
                className="bg-[#0b1020] border border-white/10 rounded-2xl p-5"
              >
                <h3 className="font-bold text-white mb-1.5">{f.q}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#05070d] text-white relative overflow-hidden py-14 border-t border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 left-1/2 -translate-x-1/2 -top-32 opacity-[0.14]" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-3">Don&apos;t See Your Sailing?</h2>
          <p className="text-white/55 mb-6">
            We can add group blocks to many sailings. Contact us and we&apos;ll check inventory for you.
          </p>
          <Link
            href="/contact"
            className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-8 py-4 rounded-full text-sm transition-all inline-block"
          >
            Contact a Cruise Specialist
          </Link>
        </div>
      </section>
    </div>
  );
}
