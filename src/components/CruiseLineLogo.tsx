"use client";

import { useState } from "react";

export function lineSlug(line: string): string {
  return line
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Cruise-line logo with a graceful text fallback. Drop a transparent PNG (ideally
 * white/light so it reads on the dark UI) at /public/cruise-lines/<slug>.png —
 * e.g. carnival-cruise-line.png, royal-caribbean.png, msc-cruises.png,
 * norwegian-cruise-line.png, disney-cruise-line.png. Until then, the line name
 * shows as text.
 */
export default function CruiseLineLogo({
  line,
  className = "h-5",
}: {
  line: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="label-mono text-[10px] uppercase tracking-wider text-sky-400/70 truncate">
        {line}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/cruise-lines/${lineSlug(line)}.png`}
      alt={line}
      onError={() => setFailed(true)}
      loading="lazy"
      className={`w-auto object-contain ${className}`}
    />
  );
}
