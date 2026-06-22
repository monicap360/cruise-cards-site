"use client";
import Link from "next/link";

export default function FloatingCTA() {
  return (
    <Link
      href="/contact"
      className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-full shadow-2xl text-sm transition-all flex items-center gap-2"
    >
      📞 Talk to a Cruise Specialist
    </Link>
  );
}
