import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Passport & Travel Document Requirements | Cruises from Galveston",
  description:
    "What travel documents you need for a round-trip (closed-loop) cruise from the Port of Galveston. US citizens may sail with a birth certificate and photo ID, but a passport is strongly recommended.",
};

export default function PassportRequirementsPage() {
  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#05070d] text-white py-20">
        <div className="absolute inset-0 grid-bg" />
        <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Plan with confidence"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.01em] mb-5">
            Passport & Travel Documents
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            What you need to board a round-trip cruise from the Port of Galveston —
            and why we still recommend a passport.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        {/* Quick answer callout */}
        <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-6">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-2">
            Quick answer
          </div>
          <p className="text-white/70 text-lg leading-relaxed">
            On a <strong className="text-white">closed-loop cruise</strong> — one that
            departs from and returns to the same US port, like Galveston — US citizens
            may generally travel with a{" "}
            <strong className="text-white">government-issued birth certificate</strong>{" "}
            (original or certified copy) plus a{" "}
            <strong className="text-white">government-issued photo ID</strong> such as a
            driver&rsquo;s license. A passport is{" "}
            <strong className="text-white">not strictly required</strong>, but it is
            strongly recommended. Always confirm the exact requirement on your cruise
            documents.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            What is a closed-loop cruise?
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            A closed-loop cruise begins and ends at the same US port. Nearly every
            sailing out of Galveston — Western Caribbean and Bahamas itineraries on
            Carnival, Royal Caribbean, MSC, Norwegian, and Disney — leaves from Galveston
            and returns to Galveston. Because you never need to fly into or out of a
            foreign country to complete the trip, US citizens qualify for relaxed
            document rules under the Western Hemisphere Travel Initiative.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            US citizens (adults)
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            For a closed-loop Galveston cruise you may board with either:
          </p>
          <ul className="space-y-3">
            {[
              "A valid US passport book or US passport card, OR",
              "A government-issued birth certificate (original or certified copy — not a photocopy or hospital souvenir certificate) PLUS a government-issued photo ID such as a driver's license or state ID.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-white/70 text-lg leading-relaxed">
                <span className="text-sky-400 font-bold shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            Children
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            On a closed-loop cruise, US-citizen children under 16 may generally travel
            with a birth certificate alone (no photo ID required). Children 16 and older
            follow the adult rules above. If a child is traveling without both parents,
            some cruise lines request a signed, notarized consent letter from the absent
            parent or guardian — ask a specialist and confirm with your cruise line.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            Why we recommend a passport anyway
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            A passport (book or card) is not required for a closed-loop sailing, but it
            protects you if plans change. If you have a medical emergency, miss the ship,
            or need to fly home from a foreign port, you will need a passport book to
            board a flight back to the US. The passport book works for air travel
            worldwide; the wallet-sized passport card is valid for sea and land travel
            from Canada, Mexico, the Caribbean, and Bermuda but not for international
            flights. For peace of mind, a passport book is the safest choice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            Non-US citizens & permanent residents
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Citizens of other countries generally need a valid passport and may also need
            a visa or other entry documents depending on nationality and the ports
            visited. Lawful US permanent residents should carry their Permanent Resident
            Card (green card) along with a passport. Requirements vary by citizenship — if
            this applies to you, call us before you book so we can help you confirm the
            right documents.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">
            Names must match your booking
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            The name on your travel documents must match the name on your cruise booking
            exactly. If you have legally changed your name (for example, after marriage),
            bring supporting documentation such as a marriage certificate, and let us know
            before your sail date so we can correct the reservation if needed. A
            mismatched name can prevent you from boarding.
          </p>
        </section>

        {/* Closing / contact note */}
        <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-6">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-2">
            Not sure what to bring?
          </div>
          <p className="text-white/70 text-lg leading-relaxed mb-5">
            We will walk through your exact documents with you. Call{" "}
            <a href="tel:+14096322106" className="text-white font-semibold hover:text-sky-300">
              (409) 632-2106
            </a>{" "}
            or stop by the Cruise Experience Center at 3501 Winnie St, Galveston, TX.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="tel:+14096322106"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Call (409) 632-2106
            </a>
            <Link
              href="/guides"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              ← All guides
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white/45 text-xs leading-relaxed">
          <div className="label-mono text-[10px] uppercase tracking-wider text-white/40 mb-2">
            Important — verify before you travel
          </div>
          <p>
            Travel-document requirements are set by US Customs and Border Protection
            (CBP), the US Department of State, and the individual cruise lines, and they
            can change at any time. This guide is general information, not legal or travel
            advice. Always confirm the current requirements for your specific sailing on
            your cruise documents, with your cruise line, and at the CBP and travel.state.gov
            websites before you depart.
          </p>
        </div>
      </article>
    </div>
  );
}
