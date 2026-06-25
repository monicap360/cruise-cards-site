"use client";

import { useState } from "react";

export function shipSlug(ship: string): string {
  return ship
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Ship photo with a graceful fallback. Drops in a real image from
 * /public/ships/<slug>.jpg when present; otherwise shows a clean gradient so
 * the layout always looks intentional. Add photos by saving files as e.g.
 * public/ships/carnival-jubilee.jpg (matching the ship name, slugified).
 */
export default function ShipImage({
  ship,
  className = "",
  gradient = "from-blue-700 to-[#0a1f44]",
  overlay = true,
}: {
  ship: string;
  className?: string;
  gradient?: string;
  overlay?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const slug = shipSlug(ship);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/ships/${slug}.jpg`}
          alt={ship}
          onError={() => setFailed(true)}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      {overlay && (
        <>
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/75 via-[#05070d]/10 to-transparent" />
        </>
      )}
    </div>
  );
}
