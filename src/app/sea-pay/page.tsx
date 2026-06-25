import Link from "next/link";

export default function SeaPayPage() {
  return (
    <div className="bg-[#05070d]">
      {/* Hero */}
      <section className="bg-[#05070d] text-white relative overflow-hidden grid-bg py-20">
        <div className="aurora bg-sky-500 opacity-[0.14]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">{"// Powered by Cruises from Galveston"}</div>
          <h1 className="text-6xl font-extrabold uppercase tracking-[-0.01em] mb-4 text-white">
            Sea<span className="text-holo">Pay</span>
          </h1>
          <p className="text-white/55 text-xl max-w-2xl mx-auto mb-3">
            Your cruise. Your payment schedule. You set the pace — weekly, bi-weekly, or pick your own dates. Sea Pay puts <strong className="text-white">you</strong> in control.
          </p>
          <p className="text-white/45 text-base max-w-xl mx-auto mb-8">
            One-time <strong className="text-white">$49.99 enrollment fee.</strong> Miss a payment you set yourself? A <strong className="text-white">$35 late fee</strong> applies — so stick to your own plan.
          </p>
          <Link
            href="/sea-pay/plan"
            className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
          >
            Build My Payment Plan
          </Link>
        </div>
      </section>

      {/* What is Sea Pay */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white mb-3">What is Sea Pay?</h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Sea Pay is Cruises from Galveston&apos;s in-house payment plan program. Instead of paying everything up front, you set up your own schedule and pay over time.
          </p>
        </div>
        <div className="grid gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden md:grid-cols-3">
          {[
            {
              title: "You Set the Schedule",
              body: "Choose weekly, bi-weekly, monthly, or pick your exact payment dates. No one tells you when to pay — you build the plan that fits your life.",
            },
            {
              title: "One-Time Enrollment Fee",
              body: "A flat $49.99 Sea Pay fee is added to your first installment. No interest, no percentage markup on your cruise price.",
            },
            {
              title: "Stick to Your Own Plan",
              body: "You made the schedule — we hold you to it. If you miss a payment you set yourself, a $35 late fee is charged. Simple and fair.",
            },
          ].map((card) => (
            <div key={card.title} className="bg-[#05070d] p-7 hover:bg-white/[0.03]">
              <h3 className="text-xl font-extrabold uppercase tracking-[-0.01em] text-white mb-2">{card.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#0b1020] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white mb-3">How Sea Pay Works</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Choose Your Cruise",
                body: "Find your ship and sailing date. Look for the Sea Pay Available button on any ship or deal.",
              },
              {
                step: "2",
                title: "Build Your Plan",
                body: "Use our plan builder to enter your cruise total, deposit, and choose how often you want to pay — weekly, bi-weekly, monthly, or custom dates you select yourself.",
              },
              {
                step: "3",
                title: "We Review & Send Your Contract",
                body: "A Cruises from Galveston specialist reviews your plan within 24 hours. You'll receive a Sea Pay contract to e-sign.",
              },
              {
                step: "4",
                title: "Pay Your Deposit",
                body: "Your cabin is locked in once your deposit is received. The $49.99 enrollment fee is added to your first installment — not your deposit.",
              },
              {
                step: "5",
                title: "Payments on Your Schedule",
                body: "Each payment comes due on the exact dates you chose. Final payment must be received 60 days before your sailing date.",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-5 bg-[#05070d] border border-white/10 rounded-2xl p-5">
                <div className="w-10 h-10 bg-white/5 border border-white/15 text-sky-400 font-extrabold text-lg rounded-full flex items-center justify-center flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <div className="font-extrabold uppercase tracking-[-0.01em] text-white mb-0.5">{s.title}</div>
                  <p className="text-white/55 text-sm">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequency options */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white mb-3">Choose How Often You Pay</h2>
          <p className="text-white/55 text-lg">No rigid schedule — pick what works for your budget.</p>
        </div>
        <div className="grid gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Weekly",
              desc: "A small payment every 7 days. Great if you get paid weekly and want to spread it out as much as possible.",
              example: "e.g. Every Friday",
            },
            {
              label: "Bi-Weekly",
              desc: "A payment every two weeks — aligns perfectly with a bi-weekly paycheck schedule.",
              example: "e.g. Every other Monday",
            },
            {
              label: "Monthly",
              desc: "One payment per month on a day you choose. Simple and predictable — just like a regular bill.",
              example: "e.g. The 1st or 15th",
            },
            {
              label: "Custom Dates",
              desc: "Hand-pick every single payment date. Perfect if your income is irregular or you want total control.",
              example: "e.g. Pick any dates",
            },
          ].map((opt) => (
            <div key={opt.label} className="bg-[#05070d] p-7 hover:bg-white/[0.03] text-center">
              <div className="font-extrabold uppercase tracking-[-0.01em] text-white text-lg mb-2">{opt.label}</div>
              <p className="text-white/55 text-sm leading-relaxed mb-3">{opt.desc}</p>
              <span className="text-xs font-bold text-sky-400 bg-sky-400/10 border border-sky-400/20 px-3 py-1 rounded-full">{opt.example}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Fee table */}
      <section className="bg-[#0b1020] text-white py-14">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] text-center mb-8">Sea Pay Fee Schedule</h2>
          <div className="bg-[#05070d] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 font-bold text-white/45">Fee</th>
                  <th className="text-right px-6 py-4 font-bold text-white/45">Amount</th>
                  <th className="text-right px-6 py-4 font-bold text-white/45">When</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="px-6 py-4 font-semibold text-white">Sea Pay Enrollment</td>
                  <td className="px-6 py-4 text-right font-extrabold text-sky-300">$49.99</td>
                  <td className="px-6 py-4 text-right text-white/55">Added to first installment</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="px-6 py-4 font-semibold text-white">Late Payment Fee</td>
                  <td className="px-6 py-4 text-right font-extrabold text-amber-300/80">$35.00</td>
                  <td className="px-6 py-4 text-right text-white/55">Per missed payment</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-white">Interest / Markup</td>
                  <td className="px-6 py-4 text-right font-extrabold text-sky-300">$0.00</td>
                  <td className="px-6 py-4 text-right text-white/55">Never</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white text-center mb-10">Sea Pay FAQs</h2>
        <div className="space-y-4">
          {[
            {
              q: "Can I change my payment dates after I sign up?",
              a: "Contact your cruise specialist to request a schedule change. Changes must be made at least 5 days before a scheduled payment.",
            },
            {
              q: "What happens if I miss a payment?",
              a: "A $35 late fee is added to your account. After two missed payments your Sea Pay plan may be cancelled and your cruise deposit could be at risk per the cancellation policy.",
            },
            {
              q: "Is there a minimum cruise price to use Sea Pay?",
              a: "Sea Pay is available on cruises of 5 nights or longer with a total price of at least $500. Short getaways (3–4 nights) are not eligible.",
            },
            {
              q: "When is my final payment due?",
              a: "Your final installment must be received no later than 60 days before your sailing date, regardless of the schedule you set.",
            },
            {
              q: "Does Sea Pay apply to the full party?",
              a: "Yes — Sea Pay covers the total price for all guests in your booking.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit and debit cards, Zelle, and bank transfers. Cash payments can be arranged in person at our Galveston office.",
            },
          ].map((item) => (
            <details key={item.q} className="bg-[#0b1020] border border-white/10 rounded-2xl group">
              <summary className="px-6 py-4 font-bold text-white cursor-pointer flex justify-between items-center list-none">
                {item.q}
                <span className="text-sky-400 group-open:rotate-180 transition-transform text-lg">▾</span>
              </summary>
              <div className="px-6 pb-5 text-white/55 text-sm leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b1020] text-white relative overflow-hidden grid-bg py-16">
        <div className="aurora bg-sky-500 opacity-[0.14]" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] mb-4">Ready to Set Your Own Schedule?</h2>
          <p className="text-white/55 text-lg mb-8">
            Use our plan builder to enter your cruise, pick your payment frequency, and see your full schedule instantly.
          </p>
          <Link
            href="/sea-pay/plan"
            className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
          >
            Build My Sea Pay Plan
          </Link>
        </div>
      </section>
    </div>
  );
}
