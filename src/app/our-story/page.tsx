import Link from "next/link";
import TrustBadges from "@/components/TrustBadges";
import Reviews from "@/components/Reviews";
import AgentProfile from "@/components/AgentProfile";
import { agentBySlug } from "@/lib/agents";

export const metadata = {
  title: "Our Story — Cruises from Galveston",
  description:
    "The real story behind Cruises from Galveston — a CLIA-accredited, Galveston-based agency and Cruise Experience Center, personally run by Monica Pena.",
};

// Set NEXT_PUBLIC_PRESS_URL to the Galveston County Daily News article link.
const PRESS_URL = process.env.NEXT_PUBLIC_PRESS_URL || "https://www.galvnews.com";

export default function OurStoryPage() {
  const monica = agentBySlug("monica");
  return (
    <div className="bg-[#05070d] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[44rem] h-[44rem] -top-72 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-4">{"// Cruises from Galveston"}</div>
          <h1 className="text-5xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-none mb-5">Our Story</h1>
          <p className="text-white/60 text-lg">Real people. Real Galveston. A cruise agency that treats your trip like it's our own.</p>
        </div>
      </section>

      {/* Narrative */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-white/75 text-lg leading-relaxed">
        <p>
          Cruises from Galveston started with a simple belief: sailing from your own backyard should be
          <strong className="text-white"> easy, personal, and something to look forward to</strong> — not a stressful maze of
          websites and call centers.
        </p>
        <p>
          Founded and personally run by <strong className="text-white">Monica Pena</strong>, a proud Galveston‑based cruise
          specialist, we've helped hundreds of families, friends, and reunion groups set sail from the Port of Galveston.
          Monica knows every ship at the port, loves matching first‑time cruisers to their perfect cabin, and handles every
          group personally — from the first quote all the way to the moment you board.
        </p>
        <p>
          As a <strong className="text-white">CLIA‑accredited agency</strong> with a real Experience Center right here on the
          island, we're not a faceless website. We're your neighbors — a place you can walk into, a real person who answers,
          and a team that treats your cruise like it's our own.
        </p>
        <p>
          Today, we're building the <Link href="/experience-center" className="text-sky-400 hover:text-sky-300 underline">Cruise Experience Center</Link> to
          make sailing from Galveston the warmest, most cared‑for it's ever been — because your vacation should start the
          moment you start planning.
        </p>
      </section>

      {/* Press */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl border border-sky-400/25 bg-[#0b1020] p-6 text-center">
          <div className="label-mono text-[10px] uppercase tracking-widest text-sky-400/70 mb-2">📰 As featured in</div>
          <div className="text-2xl font-extrabold text-white">The Galveston County Daily News</div>
          <p className="text-white/55 text-sm mt-2">Our founder was featured in Galveston's hometown newspaper — a proud milestone for a local business built on trust.</p>
          <a href={PRESS_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sky-300 hover:text-sky-200 text-sm font-bold">Read the feature →</a>
        </div>
      </section>

      {/* Meet Monica */}
      {monica && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-4">{"// Meet your specialist"}</div>
          <AgentProfile agent={monica} />
        </section>
      )}

      {/* Trust */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-4">{"// Why you're in good hands"}</div>
        <TrustBadges />
      </section>

      {/* Reviews */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-t border-white/10 pt-16">
        <Reviews />
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-4">Let's plan your cruise</h2>
        <p className="text-white/55 mb-7">Come see us in Galveston, or reach out — we can't wait to get you sailing.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/book-a-call" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full">Book a Call</Link>
          <Link href="/experience-center" className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full">Visit the Center</Link>
        </div>
      </section>
    </div>
  );
}
