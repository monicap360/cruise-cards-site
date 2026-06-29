import Link from "next/link";
import { GROUP_CRUISES } from "@/lib/group-cruises";

// Internal-linking strip surfacing the group/celebration occasion pages.
export default function CelebrationStrip() {
  return (
    <section className="bg-[#05070d] text-white border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
          {"// Celebrate at Sea"}
        </div>
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.01em]">
            Group &amp; Celebration Cruises
          </h2>
          <Link
            href="/group-cruises"
            className="text-sky-400 hover:text-sky-300 font-semibold text-sm"
          >
            See all occasions →
          </Link>
        </div>
        <p className="text-white/55 max-w-2xl mb-6">
          Whatever you&rsquo;re celebrating, we block the cabins, lock the group rate, and plan
          every detail — round-trip from Galveston.
        </p>
        <div className="flex flex-wrap gap-2">
          {GROUP_CRUISES.map((g) => (
            <Link
              key={g.slug}
              href={`/group-cruises/${g.slug}`}
              className="bg-white/5 border border-white/10 hover:border-sky-400/40 rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
            >
              {g.emoji} {g.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
