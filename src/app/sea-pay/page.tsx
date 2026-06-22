import Link from "next/link";

export default function SeaPayPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-green-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-5 uppercase tracking-wide">
            💳 Powered by Cruises from Galveston
          </div>
          <h1 className="text-6xl font-black mb-4 tracking-tight">
            Sea<span className="text-red-400">Pay</span>
          </h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-3">
            Your cruise. Your payment schedule. You set the pace — weekly, bi-weekly, or pick your own dates. Sea Pay puts <strong>you</strong> in control.
          </p>
          <p className="text-blue-200 text-base max-w-xl mx-auto mb-8">
            One-time <strong className="text-white">$49.99 enrollment fee.</strong> Miss a payment you set yourself? A <strong className="text-white">$35 late fee</strong> applies — so stick to your own plan.
          </p>
          <Link
            href="/sea-pay/plan"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-extrabold px-10 py-4 rounded-full text-lg transition-all shadow-xl"
          >
            Build My Payment Plan →
          </Link>
        </div>
      </section>

      {/* What is Sea Pay */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-3">What is Sea Pay?</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Sea Pay is Cruises from Galveston&apos;s in-house payment plan program. Instead of paying everything up front, you set up your own schedule and pay over time.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "📅",
              title: "You Set the Schedule",
              body: "Choose weekly, bi-weekly, monthly, or pick your exact payment dates. No one tells you when to pay — you build the plan that fits your life.",
              color: "from-blue-500 to-blue-700",
            },
            {
              icon: "💳",
              title: "One-Time Enrollment Fee",
              body: "A flat $49.99 Sea Pay fee is added to your first installment. No interest, no percentage markup on your cruise price.",
              color: "from-green-500 to-green-700",
            },
            {
              icon: "⚠️",
              title: "Stick to Your Own Plan",
              body: "You made the schedule — we hold you to it. If you miss a payment you set yourself, a $35 late fee is charged. Simple and fair.",
              color: "from-red-500 to-red-700",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl overflow-hidden shadow-md">
              <div className={`bg-gradient-to-br ${card.color} text-white p-6`}>
                <div className="text-4xl mb-2">{card.icon}</div>
                <h3 className="text-xl font-extrabold">{card.title}</h3>
              </div>
              <div className="bg-white p-5 border border-gray-100 rounded-b-2xl">
                <p className="text-gray-500 text-sm leading-relaxed">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-3">How Sea Pay Works</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Choose Your Cruise",
                body: "Find your ship and sailing date. Look for the green 💳 Sea Pay Available button on any ship or deal.",
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
              <div key={s.step} className="flex gap-5 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-blue-900 text-white font-extrabold text-lg rounded-full flex items-center justify-center flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <div className="font-extrabold text-blue-900 mb-0.5">{s.title}</div>
                  <p className="text-gray-500 text-sm">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequency options */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-3">Choose How Often You Pay</h2>
          <p className="text-gray-500 text-lg">No rigid schedule — pick what works for your budget.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: "Weekly",
              icon: "📆",
              desc: "A small payment every 7 days. Great if you get paid weekly and want to spread it out as much as possible.",
              example: "e.g. Every Friday",
            },
            {
              label: "Bi-Weekly",
              icon: "📅",
              desc: "A payment every two weeks — aligns perfectly with a bi-weekly paycheck schedule.",
              example: "e.g. Every other Monday",
            },
            {
              label: "Monthly",
              icon: "🗓️",
              desc: "One payment per month on a day you choose. Simple and predictable — just like a regular bill.",
              example: "e.g. The 1st or 15th",
            },
            {
              label: "Custom Dates",
              icon: "✏️",
              desc: "Hand-pick every single payment date. Perfect if your income is irregular or you want total control.",
              example: "e.g. Pick any dates",
            },
          ].map((opt) => (
            <div key={opt.label} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
              <div className="text-4xl mb-3">{opt.icon}</div>
              <div className="font-extrabold text-blue-900 text-lg mb-2">{opt.label}</div>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">{opt.desc}</p>
              <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">{opt.example}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Fee table */}
      <section className="bg-blue-900 text-white py-14">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-8">Sea Pay Fee Schedule</h2>
          <div className="bg-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left px-6 py-4 font-bold text-blue-200">Fee</th>
                  <th className="text-right px-6 py-4 font-bold text-blue-200">Amount</th>
                  <th className="text-right px-6 py-4 font-bold text-blue-200">When</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="px-6 py-4 font-semibold">Sea Pay Enrollment</td>
                  <td className="px-6 py-4 text-right font-extrabold text-green-400">$49.99</td>
                  <td className="px-6 py-4 text-right text-blue-200">Added to first installment</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="px-6 py-4 font-semibold">Late Payment Fee</td>
                  <td className="px-6 py-4 text-right font-extrabold text-red-400">$35.00</td>
                  <td className="px-6 py-4 text-right text-blue-200">Per missed payment</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold">Interest / Markup</td>
                  <td className="px-6 py-4 text-right font-extrabold text-green-400">$0.00</td>
                  <td className="px-6 py-4 text-right text-blue-200">Never</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-extrabold text-blue-900 text-center mb-10">Sea Pay FAQs</h2>
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
            <details key={item.q} className="bg-white rounded-2xl shadow-sm border border-gray-100 group">
              <summary className="px-6 py-4 font-bold text-blue-900 cursor-pointer flex justify-between items-center list-none">
                {item.q}
                <span className="text-blue-400 group-open:rotate-180 transition-transform text-lg">▾</span>
              </summary>
              <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-green-700 to-blue-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Ready to Set Your Own Schedule?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Use our plan builder to enter your cruise, pick your payment frequency, and see your full schedule instantly.
          </p>
          <Link
            href="/sea-pay/plan"
            className="inline-block bg-white text-blue-900 hover:bg-blue-50 font-extrabold px-10 py-4 rounded-full text-lg transition-all shadow-xl"
          >
            💳 Build My Sea Pay Plan →
          </Link>
        </div>
      </section>
    </div>
  );
}
