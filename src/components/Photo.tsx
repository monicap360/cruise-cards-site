"use client";

import { useState } from "react";

/**
 * Generic photo with a graceful gradient fallback. Renders the image at `src`
 * (typically a file under /public) and falls back to a clean gradient if the
 * file is missing — so layouts always look intentional even before real photos
 * are dropped in.
 */
export default function Photo({
  src,
  alt,
  gradient = "from-blue-700 to-[#0a1f44]",
  className = "",
  overlay = true,
}: {
  src: string;
  alt: string;
  gradient?: string;
  className?: string;
  overlay?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
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
