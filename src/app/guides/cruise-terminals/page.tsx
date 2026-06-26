import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Port of Galveston Cruise Terminals Guide | Cruises from Galveston",
  description:
    "How the Port of Galveston cruise terminals work — finding your terminal by cruise line, embarkation-day timing, drop-off vs parking, luggage drop with porters, and what to bring on boarding day.",
};

const TERMINALS: {
  name: string;
  pier: string;
  line: string;
  address: string;
  note: string;
}[] = [
  {
    name: "Cruise Terminal 25",
    pier: "Pier 25",
    line: "Carnival Cruise Line",
    address: "2502 Harborside Drive, Galveston, TX 77550",
    note: "Carnival's main Galveston terminal on the Pier 25 waterfront, near the historic Strand district. (Carnival also sails from nearby Terminal 28 / Pier 28 — always check which one your boarding pass lists.)",
  },
  {
    name: "Cruise Terminal 10",
    pier: "Pier 10",
    line: "Royal Caribbean International",
    address:
      "1402 Harborside Drive (now also listed as 1152 Royal Caribbean Way), Galveston, TX 77550",
    note: "The Port of Galveston's newest terminal — the world's first Net-Zero Energy cruise terminal and the first LEED Gold–certified terminal in Texas. Home to Royal Caribbean's largest Oasis-class ships. Some maps and ride apps still show the older Harborside Drive address.",
  },
];

const BRING: { label: string; note: string }[] = [
  {
    label: "Your boarding pass / cruise documents",
    note: "Printed or saved in your cruise line's app — these show your exact terminal and arrival time.",
  },
  {
    label: "Travel documents (passport or birth certificate + photo ID)",
    note: "Match the name on your booking. See our passport guide if you're unsure.",
  },
  {
    label: "Printed luggage tags",
    note: "Attach one to each checked bag so porters can route it to your cabin.",
  },
  {
    label: "Payment card for onboard account",
    note: "Used to register your folio at check-in.",
  },
  {
    label: "A carry-on with essentials",
    note: "Medications, valuables, swimwear, and anything you'll want before checked bags arrive at your cabin.",
  },
];

export default function CruiseTerminalsPage() {
  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#05070d] text-white py-20">
        <div className="absolute inset-0 grid-bg" />
        <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Embarkation day"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.01em] mb-5">
            Port of Galveston Terminals
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            How the cruise terminals work, where to go on boarding day, and how to make
            embarkation smooth.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        {/* Quick answer */}
        <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-6">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-2">
            Quick answer
          </div>
          <p className="text-white/70 text-lg leading-relaxed">
            The Port of Galveston operates multiple cruise terminals serving Carnival,
            Royal Caribbean, MSC, Norwegian, and Disney. Your terminal depends on your
            cruise line and ship — the exact terminal and boarding address are printed on
            your cruise documents and boarding pass.{" "}
            <strong className="text-white">
              Always confirm your terminal on your boarding documents
            </strong>{" "}
            before you head to the port.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            Finding your terminal
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Galveston is one of the busiest cruise ports in the country, and the port runs
            several cruise terminals along the waterfront. Different cruise lines and ships
            sail from different terminals, and a ship can be assigned to a different
            terminal than it used last season. Rather than guessing, look for{" "}
            <strong className="text-white">your cruise line&rsquo;s terminal</strong> and
            the boarding address printed on your boarding pass and travel documents. If you
            booked with us and can&rsquo;t find it, we&rsquo;ll confirm it for you.
          </p>
        </section>

        {/* Specific terminals */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            Galveston cruise terminals at a glance
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            The two busiest cruise terminals at the Port of Galveston — and which
            line each one serves. Confirm your exact terminal on your boarding pass.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TERMINALS.map((t) => (
              <div
                key={t.name}
                className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 hover:border-sky-400/40 transition-colors"
              >
                <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1">
                  {t.pier}
                </div>
                <h3 className="text-xl font-extrabold uppercase tracking-tight mb-1">
                  {t.name}
                </h3>
                <div className="text-sky-300 font-semibold mb-3">{t.line}</div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(t.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/80 hover:text-white text-sm font-medium mb-3 underline decoration-white/20 underline-offset-2"
                >
                  📍 {t.address}
                </a>
                <p className="text-white/55 text-sm leading-relaxed">{t.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            Arriving on embarkation day
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Most cruise lines assign a staggered arrival window during online check-in to
            keep lines short — try to arrive within yours rather than all at once at
            opening. Plan extra time for Galveston traffic on busy weekend sail days, and
            keep your boarding documents and travel ID easily accessible as you approach
            the terminal. Boarding generally closes well before departure, so build in a
            cushion.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            Drop-off vs. parking
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Each terminal has a curbside zone for dropping off guests and luggage, plus
            nearby cruise parking. If someone is dropping you off, they can unload at the
            terminal curb and head out. If you&rsquo;re driving and leaving your car, you
            can reserve port parking close to your terminal in advance — we can help you
            book a spot and arrange a ride so you&rsquo;re not circling on sail day.
          </p>
          <p className="text-white/70 text-lg leading-relaxed">
            See our{" "}
            <Link href="/transportation" className="text-sky-400 hover:text-sky-300 font-semibold">
              parking &amp; transfers
            </Link>{" "}
            page to reserve a spot or a door-to-terminal ride.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            Luggage drop & porters
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            When you arrive at the terminal, porters at the curb will take your tagged
            checked bags and route them to the ship — they&rsquo;ll be delivered to your
            cabin later in the day. Make sure each bag has a printed luggage tag with your
            name, ship, and cabin, and keep medications, valuables, travel documents, and
            anything you need right away in a carry-on, since checked bags can take a few
            hours to arrive. Porters typically work for tips, so have a little cash handy.
          </p>
        </section>

        {/* What to bring checklist */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            What to bring on embarkation day
          </h2>
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 hover:border-sky-400/40 transition-colors">
            <ul className="space-y-4">
              {BRING.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span className="text-sky-400 font-bold shrink-0 text-lg leading-7">✓</span>
                  <span className="text-white/70 text-lg leading-relaxed">
                    <strong className="text-white">{item.label}</strong>
                    <span className="block text-white/50 text-base">{item.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            We can help at the Experience Center
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Not sure where to print boarding passes or luggage tags? Stop by our walk-in
            Cruise Experience Center at{" "}
            <strong className="text-white">3501 Winnie St, Galveston, TX</strong>. We can
            help you locate your terminal, print your boarding documents and luggage tags,
            and answer last-minute embarkation questions.
          </p>
        </section>

        {/* Contact CTA */}
        <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-6">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-2">
            Questions about boarding day?
          </div>
          <p className="text-white/70 text-lg leading-relaxed mb-5">
            Call us and we&rsquo;ll confirm your terminal and walk you through arrival.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="tel:+14096322106"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Call (409) 632-2106
            </a>
            <Link
              href="/transportation"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Parking &amp; transfers →
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white/45 text-xs leading-relaxed">
          <div className="label-mono text-[10px] uppercase tracking-wider text-white/40 mb-2">
            Important — confirm your terminal
          </div>
          <p>
            Terminal assignments, addresses, arrival windows, and parking options are set
            by the Port of Galveston and the individual cruise lines and can change. This
            guide is general information only. Always confirm the exact terminal, address,
            and timing on your official cruise documents and with your cruise line before
            traveling.
          </p>
        </div>
      </article>
    </div>
  );
}
