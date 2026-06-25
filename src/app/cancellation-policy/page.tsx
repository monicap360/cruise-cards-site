import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Protect Your Booking — Cruise Cancellation Policies | Cruises from Galveston",
  description:
    "Understand cruise cancellation policies before you book or cancel. See how penalties grow as your sail date nears, where your money goes, and why vacation protection matters.",
};

const penaltyTiers = [
  { window: "90+ days before sailing", detail: "Usually a refundable deposit", tag: "$", bar: "from-emerald-400/80 to-emerald-500/80" },
  { window: "89–60 days before sailing", detail: "May lose deposit or a portion of fare", tag: "$$", bar: "from-sky-400/80 to-sky-500/80" },
  { window: "59–30 days before sailing", detail: "May lose 50% of cruise fare", tag: "50%", bar: "from-amber-300/80 to-amber-400/80" },
  { window: "29–15 days before sailing", detail: "May lose 75% of cruise fare", tag: "75%", bar: "from-orange-400/80 to-orange-500/80" },
  { window: "14 days or less before sailing", detail: "May lose 100% of cruise fare", tag: "100%", bar: "from-rose-400/80 to-rose-500/80" },
];

const coveredReasons = [
  "Illness or injury",
  "Family emergencies",
  "Job changes",
  "Travel delays",
  "Unexpected personal situations",
  "And other covered events",
];

const beforeCancel = [
  "Future cruise credit",
  "Date changes (if allowed)",
  "Name changes (if allowed)",
  "Insurance claim assistance (if protection was purchased)",
  "Partial refund based on cruise line policy (if applicable)",
];

const beforeBook = [
  "Review the cancellation policy",
  "Understand deposit & final payment deadlines",
  "Ask questions before cancelling",
  "Consider vacation protection",
  "Keep all communication in writing",
  "Know that cruise line penalties are not controlled by the travel agency",
];

function Check() {
  return <span className="text-sky-400 flex-shrink-0 mt-0.5">✓</span>;
}

export default function CancellationPolicyPage() {
  return (
    <div className="bg-[#05070d] text-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-5">
            Cruise Care · Galveston, Texas
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-4">
            Protect Your <span className="text-holo">Booking</span>
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-white/80 mb-3">
            Before there&rsquo;s a problem — not after.
          </p>
          <p className="text-white/55 max-w-2xl mb-8">
            Travel is an investment. Please protect it. Our goal is simple: help
            you plan the perfect vacation and protect your trip investment.
          </p>
          <div className="inline-flex flex-wrap gap-3">
            <Link href="/vacation-protection" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all">
              Explore Vacation Protection
            </Link>
            <Link href="/contact" className="border border-white/25 hover:border-white/70 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all">
              Ask Us First
            </Link>
          </div>
        </div>
      </section>

      {/* ── Band ── */}
      <div className="bg-[#0b1020] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
          <p className="label-mono text-[11px] sm:text-xs uppercase tracking-wider text-sky-400/90">
            Understand cruise cancellation policies before you book or cancel
          </p>
        </div>
      </div>

      {/* ── Three cards ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-extrabold uppercase tracking-tight mb-2">
            What happens when you cancel?
          </h2>
          <p className="text-white/55 text-sm leading-relaxed mb-5">
            Cruise lines have strict cancellation policies. Once your reservation
            enters the penalty period, part or all of your payment may become
            non-refundable. Penalties depend on how close you are to your sail
            date:
          </p>
          <div className="space-y-2">
            {penaltyTiers.map((t) => (
              <div key={t.window} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                <span className={`flex-shrink-0 w-11 text-center text-[11px] font-extrabold text-[#05070d] rounded-md py-1 bg-gradient-to-br ${t.bar}`}>
                  {t.tag}
                </span>
                <div className="min-w-0">
                  <div className="text-white text-sm font-bold leading-tight">{t.window}</div>
                  <div className="text-white/50 text-xs">{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/45 text-xs mt-4">
            Policies vary by cruise line and fare type. When in doubt, ask us!
          </p>
        </div>

        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-extrabold uppercase tracking-tight mb-2">
            Where does the money go?
          </h2>
          <p className="text-white/55 text-sm leading-relaxed mb-5">
            When you book, your payment is applied directly to your cruise
            reservation with the cruise line.
          </p>
          <div className="rounded-xl bg-sky-500/10 border border-sky-400/20 p-4 mb-4">
            <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/90 mb-1">In penalty period</div>
            <p className="text-white/70 text-sm">
              If you cancel, the cruise line keeps the penalty amount based on
              their cancellation policy.
            </p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Important to know</div>
            <p className="text-white/70 text-sm">
              The travel agency cannot override cruise line policies, remove
              penalties, or guarantee refunds after the deadline has passed.
            </p>
          </div>
        </div>

        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-extrabold uppercase tracking-tight mb-2">
            Why vacation protection matters
          </h2>
          <p className="text-white/55 text-sm leading-relaxed mb-4">
            Unexpected things happen. Vacation protection can help protect your
            trip investment if you need to cancel for a covered reason, such as:
          </p>
          <ul className="space-y-2 mb-5">
            {coveredReasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-white/75 text-sm">
                <Check />
                {r}
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-white/70 text-sm">
              Without protection, you may be responsible for the cruise
              line&rsquo;s cancellation penalties — even if the reason for
              cancelling is unexpected.
            </p>
          </div>
        </div>
      </section>

      {/* ── Before cancel / shield / before book ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-extrabold uppercase tracking-tight mb-1">
            Before you cancel, contact us first!
          </h2>
          <p className="text-white/55 text-sm mb-4">
            You may have options that can help reduce your loss, such as:
          </p>
          <ul className="space-y-2">
            {beforeCancel.map((b) => (
              <li key={b} className="flex items-start gap-2 text-white/75 text-sm">
                <Check />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-sky-400/20 bg-gradient-to-b from-sky-500/15 to-[#0b1020] p-8 flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-3">🛡️</div>
          <div className="text-2xl font-extrabold uppercase tracking-tight leading-tight mb-2">
            Protect it today,
            <br />
            enjoy it tomorrow!
          </div>
          <p className="text-sky-300/90 font-semibold text-sm mb-5">
            Peace of mind is worth it.
          </p>
          <Link href="/vacation-protection" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all">
            Add Protection
          </Link>
        </div>

        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-extrabold uppercase tracking-tight mb-4">
            Before you book, please:
          </h2>
          <ul className="space-y-2">
            {beforeBook.map((b) => (
              <li key={b} className="flex items-start gap-2 text-white/75 text-sm">
                <Check />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Bottom banners ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="font-extrabold uppercase tracking-tight text-white">
                Don&rsquo;t let avoidable penalties ruin your vacation.
              </div>
              <div className="text-white/60 text-sm">
                Protect your booking so you don&rsquo;t lose your money if life
                happens.
              </div>
            </div>
          </div>
          <div className="label-mono text-sm uppercase tracking-wider text-sky-400/90 text-center whitespace-nowrap">
            Plan Smart. Travel Protected.
          </div>
        </div>

        <div className="rounded-2xl bg-[#0b1020] border border-white/10 p-8 text-center">
          <div className="text-2xl mb-2">💙</div>
          <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-2">
            We care about our guests and your vacation
          </h2>
          <p className="text-white/55 max-w-2xl mx-auto mb-6">
            We&rsquo;re here to help you plan, book, and sail with confidence from
            start to finish. Ask us about Cruise Care or Vacation Protection
            today.
          </p>
          <div className="inline-flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all">
              Contact Our Team
            </Link>
            <Link href="/vacation-protection" className="border border-white/25 hover:border-white/70 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all">
              Vacation Protection Details
            </Link>
          </div>
        </div>

        <p className="text-white/30 text-xs text-center mt-6 max-w-3xl mx-auto">
          This page is general guidance. Exact cancellation deadlines, penalty
          amounts, and refund terms are set by each cruise line and fare type and
          appear in your cruise confirmation. Cruises from Galveston™ cannot waive
          or override cruise line penalties.
        </p>
      </section>
    </div>
  );
}
