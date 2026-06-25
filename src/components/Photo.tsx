"use client";

import { useState } from "react";

/**
 * Generic photo with graceful fallbacks. Renders `src`; if it's missing it tries
 * `fallbackSrc` (e.g. the ship photo for a cabin card); if that's missing too it
 * shows a clean gradient — so layouts always look intentional even before real
 * photos are dropped in.
 */
export default function Photo({
  src,
  fallbackSrc,
  alt,
  gradient = "from-blue-700 to-[#0a1f44]",
  className = "",
  overlay = true,
}: {
  src: string;
  fallbackSrc?: string;
  alt: string;
  gradient?: string;
  className?: string;
  overlay?: boolean;
}) {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current}
          alt={alt}
          loading="lazy"
          onError={() => {
            if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
            else setFailed(true);
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {overlay && (
        <>
          <div className="absolute inset-0 grid-bg opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/85 via-[#05070d]/15 to-transparent" />
        </>
      )}
    </div>
  );
}
