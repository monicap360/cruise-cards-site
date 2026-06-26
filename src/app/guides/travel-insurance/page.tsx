import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Travel Protection & Cruise Insurance Guide | Cruises from Galveston",
  description:
    "What cruise travel protection covers — trip cancellation and interruption, medical emergencies and evacuation abroad, missed connections, and lost baggage — and how to choose between cruise-line plans and third-party insurance.",
};

const BENEFITS: { icon: string; label: string; desc: string }[] = [
  {
    icon: "🚫",
    label: "Trip cancellation",
    desc: "Reimburse prepaid, non-refundable costs if you have to cancel for a covered reason before you sail.",
  },
  {
    icon: "⏸️",
    label: "Trip interruption",
    desc: "Help with costs if a covered event cuts your cruise short or you need to head home early.",
  },
  {
    icon: "🏥",
    label: "Emergency medical",
    desc: "Coverage for covered medical care abroad — where your everyday US health plan often won't follow you.",
  },
  {
    icon: "🚁",
    label: "Medical evacuation",
    desc: "Potentially the biggest reason to insure: emergency transport from a ship or foreign port can be very costly.",
  },
  {
    icon: "🔗",
    label: "Missed connection",
    desc: "Assistance if a covered delay causes you to miss the ship at embarkation.",
  },
  {
    icon: "🧳",
    label: "Baggage protection",
    desc: "Help if your luggage is lost, stolen, or delayed during your trip.",
  },
];

export default function TravelInsurancePage() {
  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#05070d] text-white py-20">
        <div className="absolute inset-0 grid-bg" />
        <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Protect your trip"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.01em] mb-5">
            Travel Protection Insurance
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            The &ldquo;Protect&rdquo; in Plan. Book. Protect. Sail. Return. Here&rsquo;s
            what cruise travel protection covers and how to choose the right plan.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {/* Why it matters */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            Why travel protection matters
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            A cruise is a big, prepaid investment, and a lot can happen between booking day
            and sail day. Travel protection is designed to help if you have to cancel,
            something interrupts your trip, you get sick or injured abroad, you miss the
            ship, or your luggage goes missing. The single most important reason many
            travelers insure a cruise is{" "}
            <strong className="text-white">emergency medical care and evacuation</strong>{" "}
            — your everyday US health plan often provides little or no coverage outside the
            country, and being transported home from a ship or foreign port can be
            extremely expensive.
          </p>
        </section>

        {/* Benefits grid */}
        <section className="space-y-5">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            What it typically protects against
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {BENEFITS.map((b) => (
              <div
                key={b.label}
                className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 hover:border-sky-400/40 transition-colors"
              >
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="text-base font-extrabold uppercase tracking-[-0.01em] mb-2">
                  {b.label}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Coverage varies by plan — the benefits, limits, covered reasons, and
            exclusions are defined in each plan&rsquo;s terms. Always review the terms
            before you rely on any specific protection.
          </p>
        </section>

        {/* Line plan vs third party */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            Cruise-line plans vs. third-party insurance
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            You generally have two ways to protect a cruise, and they work differently:
          </p>
          <div className="grid grid-cols-1 gap-5">
            <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 hover:border-sky-400/40 transition-colors">
              <h3 className="text-lg font-extrabold uppercase tracking-[-0.01em] mb-2">
                Cruise-line protection plans
              </h3>
              <p className="text-white/60 leading-relaxed">
                Offered directly by the cruise line and added to your booking. They&rsquo;re
                simple to add and are tied to your sailing — and some include a credit toward
                a future cruise if you cancel for a reason the standard plan doesn&rsquo;t
                cover. They&rsquo;re typically focused on the cruise itself, so they may not
                cover everything a comprehensive policy would.
              </p>
            </div>
            <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 hover:border-sky-400/40 transition-colors">
              <h3 className="text-lg font-extrabold uppercase tracking-[-0.01em] mb-2">
                Third-party travel insurance
              </h3>
              <p className="text-white/60 leading-relaxed">
                Bought from an independent travel-insurance provider. These plans often
                cover your whole trip — including flights, hotels, and transfers — and can
                offer higher medical and evacuation limits. Many sell optional &ldquo;cancel
                for any reason&rdquo; upgrades, which usually must be purchased within a
                short window after your initial deposit.
              </p>
            </div>
          </div>
          <p className="text-white/70 text-lg leading-relaxed">
            Neither option is automatically &ldquo;better&rdquo; — the right choice depends
            on your trip, your health needs, and what you want covered. We help you compare.
          </p>
        </section>

        {/* How we help */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            How our specialists help
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            When you book with the Cruise Experience Center, a specialist will explain your
            protection options, help you compare a cruise-line plan against third-party
            coverage, and add the protection you choose to your reservation. Because some
            upgrades — like &ldquo;cancel for any reason&rdquo; — must be added early, the
            best time to decide is right when you book. We&rsquo;ll make sure you understand
            what each plan does and doesn&rsquo;t cover before you commit.
          </p>
        </section>

        {/* CTA */}
        <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-8 text-center">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">
            {"// Talk to a specialist"}
          </div>
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-3">
            Protect your sailing
          </h2>
          <p className="text-white/55 max-w-xl mx-auto mb-6">
            Let us help you choose the right coverage and add it when you book. Call or
            visit the Experience Center at 3501 Winnie St, Galveston, TX.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+14096322106"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Call (409) 632-2106
            </a>
            <Link
              href="/contact"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Talk to a specialist
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white/45 text-xs leading-relaxed">
          <div className="label-mono text-[10px] uppercase tracking-wider text-white/40 mb-2">
            Important — coverage varies by plan
          </div>
          <p>
            This guide is general information only and is not insurance advice or a
            guarantee of coverage. Benefits, limits, covered reasons, exclusions, and
            eligibility vary by plan and provider. Whether any particular loss is covered
            depends entirely on the terms, conditions, and exclusions of the specific plan
            you purchase. Always read the plan documents carefully and ask questions before
            you buy.
          </p>
        </div>
      </article>
    </div>
  );
}
