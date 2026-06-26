import Link from "next/link";
import { POSTS } from "@/lib/news";

export const metadata = {
  title: "Cruise News & Galveston Updates",
  description:
    "The latest cruise news for travelers sailing from the Port of Galveston — new private islands, itinerary changes, parking, documents, and booking strategy from local specialists.",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsPage() {
  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-6">
            {"// News & Updates"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-5">
            Cruise news, <span className="text-holo">from the island.</span>
          </h1>
          <p className="text-white/55 text-lg">
            New private islands, itinerary changes, and the Galveston-specific
            know-how that actually affects your sailing — written by specialists
            who live and work at the port.
          </p>
        </div>
      </section>

      {/* Article grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              href={`/news/${p.slug}`}
              className="group bg-[#0b1020] border border-white/10 rounded-2xl p-6 flex flex-col hover:border-sky-400/40 transition-colors"
            >
              <div className="inline-flex self-start items-center rounded-full bg-sky-400/10 text-sky-400 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 mb-4">
                {p.category}
              </div>
              <h2 className="text-xl font-extrabold uppercase tracking-[-0.01em] leading-snug mb-3 group-hover:text-sky-300 transition-colors">
                {p.title}
              </h2>
              <p className="text-white/55 text-sm leading-relaxed mb-6 flex-1">
                {p.excerpt}
              </p>
              <div className="flex items-center justify-between text-[12px] text-white/40 border-t border-white/10 pt-4 mt-auto">
                <span>{formatDate(p.date)}</span>
                <span>{p.readMins} min read</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
