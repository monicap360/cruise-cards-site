import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import { GROUP_CRUISES } from "@/lib/group-cruises";

export const metadata: Metadata = {
  title: "Group & Celebration Cruises from Galveston | Weddings, Reunions & More",
  description:
    "Plan a group or celebration cruise from Galveston — weddings, honeymoons, anniversaries, family reunions, corporate retreats, bachelorette, milestone birthdays & retirement. Group rates, blocked cabins, and a dedicated coordinator.",
  alternates: { canonical: "/group-cruises" },
};

export default function GroupCruisesIndex() {
  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      <section className="relative overflow-hidden border-b border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/galveston-port.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/85 to-[#05070d]/60" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">{"// Group & Celebration Cruises"}</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-4">
            Celebrate It <span className="text-holo">at Sea</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Whatever you&rsquo;re celebrating, we block the cabins, lock the group rate, and plan every
            detail — round-trip from Galveston. Pick your occasion:
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href="/group-signup" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all">Start a group</Link>
            <a href="tel:+14096322106" className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all">Call (409) 632-2106</a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GROUP_CRUISES.map((g) => (
            <Link
              key={g.slug}
              href={`/group-cruises/${g.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-sky-400/40 transition-colors min-h-[10rem] flex flex-col justify-end"
            >
              <Photo src={`/destinations/${g.destSlug}.jpg`} alt={g.name} overlay={false} className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/70 to-transparent" />
              <div className="relative z-10 p-5">
                <div className="text-2xl mb-1">{g.emoji}</div>
                <div className="font-extrabold uppercase tracking-tight leading-tight">{g.name}</div>
                <div className="text-white/55 text-xs mt-1 line-clamp-2">{g.tagline}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
