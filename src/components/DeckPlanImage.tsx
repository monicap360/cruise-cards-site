"use client";

import { useState } from "react";
import { shipSlug } from "@/components/ShipImage";

/**
 * Ship deck-plan poster with a graceful fallback. Drops in a real deck plan
 * from /public/deck-plans/<slug>.jpg when present (e.g.
 * public/deck-plans/carnival-breeze.jpg). Until a file is added, shows a clean
 * placeholder so the page always looks intentional.
 */
export default function DeckPlanImage({
  ship,
  officialUrl,
}: {
  ship: string;
  officialUrl?: string;
}) {
  const [failed, setFailed] = useState(false);
  const slug = shipSlug(ship);

  if (failed) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0b1020] p-10 sm:p-14 text-center">
        <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">
          Deck Plans
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{ship} deck plans</h2>
        <p className="text-white/55 text-sm max-w-md mx-auto">
          View the cruise line&rsquo;s official deck-by-deck stateroom plans for
          this ship — always the most current layout.
        </p>
        {officialUrl && (
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-full transition-all"
          >
            Open official deck plans ↗
          </a>
        )}
        <p className="label-mono text-[10px] uppercase tracking-wider text-white/30 mt-5">
          Prefer to host it here? Drop a poster at /public/deck-plans/{slug}.jpg
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/deck-plans/${slug}.jpg`}
        alt={`${ship} deck plans`}
        onError={() => setFailed(true)}
        className="w-full h-auto"
      />
    </div>
  );
}
