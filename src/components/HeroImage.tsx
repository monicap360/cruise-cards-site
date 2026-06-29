"use client";

import { useState } from "react";

// Tries each candidate src in order, falling back on error. The last candidate
// should be a file that always exists so there's never a broken image.
export default function HeroImage({
  candidates,
  alt,
  className = "",
}: {
  candidates: string[];
  alt: string;
  className?: string;
}) {
  const [i, setI] = useState(0);
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={candidates[i]}
      alt={alt}
      onError={() => setI((x) => Math.min(x + 1, candidates.length - 1))}
      className={className}
    />
  );
}
