import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: "📋",
    title: "Book Your Cruise",
    desc: "Work with our Galveston cruise specialists to find the perfect ship, itinerary, and cabin. We handle every detail from start to finish.",
  },
  {
    step: "02",
    icon: "💳",
    title: "Pay Your Deposit",
    desc: "Secure your cabin with a deposit — typically $200–$500 per person depending on the cruise. Your spot is locked in the moment we receive it.",
  },
  {
    step: "03",
    icon: "📅",
    title: "Set Up Your Sea Pay Plan",
    desc: "We calculate equal monthly installments from today until 60 days before your sailing. Pay on your schedule — no interest, no fees.",
  },
  {
    step: "04",
    icon: "✅",
    title: "Sail Paid in Full",
    desc: "By the time you board your ship in Galveston, your cruise is completely paid for. Relax and enjoy every moment stress-free.",
  },
];

const faqs = [
  {
    q: "Is there any interest or fee for using Sea Pay?",
    a: "None. Sea Pay is our gift to you. No interest, no processing fees, no hidden charges. You pay only the cruise price — spread over time.",
  },
  {
    q: "What if I miss a monthly payment?",
    a: "Life happens. Contact us before your due date and we'll work with you to adjust. Payments more than 30 days late may affect your booking status.",
  },
  {
    q: "When is my final payment due?",
    a: "All payments must be received 60 days before your sailing date. This is when cruise lines require final payment from travel agencies.",
  },
  {
    q: "Can I pay off my balance early?",
    a: "Absolutely — and we encourage it! Pay ahead any time with no penalty. Many clients pay off their cruise months early for total peace of mind.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Zelle, check, money order, and cash payments at our office. Credit card payments may be arranged — contact us for details.",
  },
  {
    q: "What happens if I need to cancel?",
    a: "Cancellation policies vary by cruise line and how far in advance you cancel. We always recommend travel insurance. See your booking contract for your specific terms.",
  },
];

export default function SeaPayPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-6 uppercase tracking-wide">
            ⚓ Powered by Cruises from Galveston
          </div>
          <h1 className="text-6xl font-extrabold mb-4">
            Sea<span className="text-red-400">Pay</span>
          </h1>
          <p className="text-2xl text-blue-100 font-semibold mb-4">
            Your cruise. Your schedule. Zero interest.
          </p>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-8">
            Sea Pay is our in-house payment plan that lets you spread the cost
            of your Galveston cruise into manageable monthly installments — with
            no interest, no fees, and no stress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg"
            >
              Start a Sea Pay Plan
            </Link>
            <Link
              href="/deals"
              className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg"
            >
              Browse Cruise Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Why Sea Pay */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "💰", title: "Zero Interest", desc: "Every dollar you pay goes toward your cruise — not fees or interest. Ever." },
              { icon: "📅", title: "Monthly Installments", desc: "Equal payments every month, automatically calculated based on your sailing date." },
              { icon: "🔒", title: "Lock In Your Cabin", desc: "A deposit secures your exact cabin and rate the day you book. No price increases." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 shadow-md text-center border border-gray-100">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-extrabold text-blue-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-3">How Sea Pay Works</h2>
          <p className="text-gray-500 text-lg">Four simple steps from booking to boarding.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 h-full">
                <div className="text-4xl font-black text-blue-100 mb-2">{s.step}</div>
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-extrabold text-blue-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Example Plan */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2">Example Sea Pay Plan</h2>
            <p className="text-blue-200">7-Night Caribbean cruise for 2 guests sailing in 6 months</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-center">
              {[
                { label: "Cruise Total", value: "$2,498" },
                { label: "Deposit Today", value: "$500" },
                { label: "Monthly Payment", value: "$333" },
                { label: "Months", value: "6" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-3xl font-extrabold text-red-400">{item.value}</div>
                  <div className="text-blue-200 text-sm mt-1">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/20 pt-6">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Final"].map((m, i) => (
                  <div key={m} className={`rounded-xl p-3 text-center text-sm ${i === 5 ? "bg-red-600" : "bg-white/10"}`}>
                    <div className="font-bold text-xs text-blue-200 mb-1">{m}</div>
                    <div className="font-extrabold">{i === 5 ? "$333" : "$333"}</div>
                  </div>
                ))}
              </div>
              <p className="text-center text-blue-300 text-sm mt-4">
                ✅ Paid in full 60 days before sailing — no surprises
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-3">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-blue-900 text-lg mb-2">{faq.q}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-600 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-3">Ready to Start Your Sea Pay Plan? ⚓</h2>
          <p className="text-red-100 mb-6">
            Contact our team today and we&apos;ll build your personalized payment plan in minutes.
          </p>
          <Link
            href="/contact"
            className="bg-white text-red-600 hover:bg-red-50 font-extrabold px-10 py-4 rounded-full text-lg transition-all shadow-lg inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
