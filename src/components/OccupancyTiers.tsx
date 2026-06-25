"use client";

import { useState } from "react";
import Link from "next/link";
import { fmt$ } from "@/lib/sea-pay";

// 3rd guest and beyond are priced at a fraction of the per-person base rate
// (the classic "add-a-guest" discount). Tune here to change every cabin's tiers.
const EXTRA_GUEST_FRACTION = 0.5;

// Promotional discount shown off the regular fare. Change this one number to
// adjust the advertised savings on every cabin card.
const DISCOUNT_OFF = 0.2; // 20% off the regular rate

export default function OccupancyTiers({
  pricePerPerson,
  maxGuests,
  reserveBase,
}: {
  pricePerPerson: number;
  maxGuests: number;
  reserveBase: string;
}) {
  const cap = Math.min(Math.max(maxGuests, 2), 5);
  const sizes: number[] = [];
  for (let n = 2; n <= cap; n++) sizes.push(n);

  const [sel, setSel] = useState(2);

  const totalFor = (n: number) =>
    Math.round(
      pricePerPerson * 2 + (n - 2) * pricePerPerson * EXTRA_GUEST_FRACTION
    );
  const regular = totalFor(sel); // regular (full) fare for this party size
  const sale = Math.round(regular * (1 - DISCOUNT_OFF)); // discounted fare
  const saved = regular - sale;
  const perPerson = Math.round(sale / sel);
  const reserveHref = `${reserveBase}${
    reserveBase.includes("?") ? "&" : "?"
  }guests=${sel}&total=${sale}`;

  return (
    <div>
      {/* Party-size tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {sizes.map((n) => (
          <button
            key={n}
            onClick={() => setSel(n)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
              sel === n
                ? "bg-sky-400/15 text-white border-sky-400/60"
                : "bg-white/5 text-white/55 border-white/15 hover:border-white/40"
            }`}
          >
            {n} guests
          </button>
        ))}
      </div>

      {/* Selected tier — only this one shows */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-white/40 text-lg line-through">
              {fmt$(regular)}
            </span>
            <span className="text-holo font-extrabold text-3xl leading-none">
              {fmt$(sale)}
            </span>
            <span className="text-white/50 text-sm">
              total · {sel} guest{sel > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Save {fmt$(saved)} · {Math.round(DISCOUNT_OFF * 100)}% off
            </span>
            <span className="text-white/45 text-xs">
              ~{fmt$(perPerson)} / person · taxes &amp; fees included
            </span>
          </div>
        </div>
        <Link
          href={reserveHref}
          className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
