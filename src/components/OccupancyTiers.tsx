"use client";

import { useState } from "react";
import Link from "next/link";
import { fmt$ } from "@/lib/sea-pay";

// 3rd guest and beyond are priced at a fraction of the per-person base rate
// (the classic "add-a-guest" discount). Tune here to change every cabin's tiers.
const EXTRA_GUEST_FRACTION = 0.5;

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
  const total = totalFor(sel);
  const perPerson = Math.round(total / sel);
  const reserveHref = `${reserveBase}${
    reserveBase.includes("?") ? "&" : "?"
  }guests=${sel}&total=${total}`;

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
          <div className="flex items-baseline gap-2">
            <span className="text-holo font-extrabold text-3xl leading-none">
              {fmt$(total)}
            </span>
            <span className="text-white/50 text-sm">
              total · {sel} guest{sel > 1 ? "s" : ""}
            </span>
          </div>
          <div className="text-white/45 text-xs mt-1.5">
            ~{fmt$(perPerson)} / person · taxes &amp; fees included
            {sel === 2 && (
              <span className="text-sky-300 font-semibold">
                {" "}
                · 2-Guest Special
              </span>
            )}
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
