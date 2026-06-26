import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're Booked! What's Next | Cruises from Galveston",
  description:
    "Just booked your cruise from Galveston? Here's your step-by-step guide to what happens next — confirmation, online check-in, payments, excursions, and setting sail.",
};

const STEPS = [
  {
    icon: "📧",
    title: "Watch for your confirmation",
    body: "We'll email your booking confirmation and your cruise-line booking number. Keep that number handy — you'll use it for everything below.",
    cta: { href: "/account", label: "Track my booking" },
  },
  {
    icon: "🔐",
    title: "Create your account",
    body: "Log into your customer account to see your booking status, any travel credits, and message your specialist anytime.",
    cta: { href: "/account", label: "Open my account" },
  },
  {
    icon: "📱",
    title: "Download the app & check in",
    body: "Get your cruise line's app, add your booking number, and complete online check-in to receive your boarding pass and arrival time.",
    cta: { href: "/cruise-line-apps", label: "App & check-in guide" },
  },
  {
    icon: "💳",
    title: "Make your payments",
    body: "Pay your deposit, then your balance by the final payment date. Set your own schedule with Sea Pay so nothing sneaks up on you.",
    cta: { href: "/sea-pay", label: "About Sea Pay" },
  },
  {
    icon: "🤿",
    title: "Add the extras",
    body: "Lock in shore excursions, drink packages, Wi-Fi, and specialty dining early — the best ones sell out before sailing.",
    cta: { href: "/add-ons", label: "Browse add-ons" },
  },
  {
    icon: "🧳",
    title: "Get ready to sail",
    body: "Double-check your passport or ID, arrange parking at the Port of Galveston, and pack smart with our local tips.",
    cta: { href: "/galveston-cruise-tips", label: "Galveston cruise tips" },
  },
  {
    icon: "🚢",
    title: "Count down & set sail",
    body: "Watch the days melt away, then drive up, park, and step aboard. We're with you before, during, and after your cruise.",
    cta: { href: "/countdown", label: "Start the countdown" },
  },
];

export default function WhatsNextPage() {
  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 grid-bg">
        <div className="aurora bg-sky-500 w-[640px] h-[640px] -top-64 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Welcome Aboard"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-4">
            You&rsquo;re Booked!
            <br />
            <span className="text-holo">Here&rsquo;s what&rsquo;s next.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            The hard part&rsquo;s done — your cabin is reserved. Follow these
            simple steps and you&rsquo;ll be sipping a drink on deck before you
            know it.
          </p>
        </div>
      </section>

      {/* Steps timeline */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="relative bg-[#0b1020] border border-white/10 rounded-2xl p-6 hover:border-sky-400/30 transition-colors flex gap-5"
            >
              <div className="flex-shrink-0 flex flex-col items-center">
                <span className="w-11 h-11 rounded-full bg-sky-400/15 text-sky-300 font-extrabold flex items-center justify-center">
                  {i + 1}
                </span>
                {i < STEPS.length - 1 && (
                  <span className="w-px flex-1 bg-white/10 mt-2" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{s.icon}</span>
                  <h2 className="font-extrabold uppercase tracking-tight text-white text-lg">
                    {s.title}
                  </h2>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{s.body}</p>
                <Link
                  href={s.cta.href}
                  className="inline-block mt-3 label-mono text-[11px] uppercase tracking-wider text-sky-400/80 hover:text-sky-300 transition-colors"
                >
                  {s.cta.label} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-[#0b1020] border border-sky-400/25 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-2">
            Questions before you sail?
          </h2>
          <p className="text-white/55 mb-6">
            Your specialist is one call or message away — before, during, and
            after your cruise.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="tel:+14096322106"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all"
            >
              Call (409) 632-2106
            </a>
            <Link
              href="/account"
              className="border border-white/25 hover:border-white/60 text-white font-semibold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full transition-all"
            >
              Message my specialist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
