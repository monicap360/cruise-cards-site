"use client";
import Link from "next/link";

export default function FloatingCTA() {
  return (
    <Link
      href="/contact"
      className="fixed bottom-6 left-6 z-50 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-5 py-3 rounded-full shadow-2xl text-xs transition-all flex items-center gap-2 border border-black/10"
    >
      Talk to a Specialist
    </Link>
  );
}
