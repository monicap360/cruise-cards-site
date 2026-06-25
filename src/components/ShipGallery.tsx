"use client";

import { useState } from "react";

/**
 * Real-cruise photo gallery. Drop guest/agency photos at
 * /public/ships/<slug>/1.jpg, 2.jpg, … (up to `count`). Any that aren't there
 * are silently skipped. When none exist yet, a short hint shows instead.
 */
export default function ShipGallery({
  slug,
  shipName,
  count = 8,
}: {
  slug: string;
  shipName: string;
  count?: number;
}) {
  const [ok, setOk] = useState<boolean[]>(() => Array(count).fill(true));
  const anyVisible = ok.some(Boolean);

  return (
    <div>
      {anyVisible ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: count }).map((_, i) =>
            ok[i] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={`/ships/${slug}/${i + 1}.jpg`}
                alt={`${shipName} — guest photo ${i + 1}`}
                loading="lazy"
                onError={() =>
                  setOk((prev) => {
                    const n = [...prev];
                    n[i] = false;
                    return n;
                  })
                }
                className="w-full h-40 sm:h-44 object-cover rounded-xl border border-white/10"
              />
            ) : null
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#0b1020] p-8 text-center">
          <p className="text-white/55 text-sm">
            Real photos from {shipName} sailings will appear here.
          </p>
          <p className="label-mono text-[10px] uppercase tracking-wider text-white/30 mt-2">
            Drop photos at /public/ships/{slug}/1.jpg, 2.jpg, …
          </p>
        </div>
      )}
    </div>
  );
}
