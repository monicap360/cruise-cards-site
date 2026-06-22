import Link from "next/link";

const options = [
  {
    id: "flexible",
    label: "Flexible Rate",
    badge: "Most Popular",
    badgeColor: "bg-blue-600",
    priceNote: "Standard price",
    icon: "🔄",
    highlight: false,
    features: [
      "Fully refundable up to final payment date",
      "Name changes allowed (subject to cruise line policy)",
      "Transferable to a family member or friend",
      "Date change allowed (fare difference may apply)",
      "Cancel anytime before final payment with no penalty",
    ],
    fine: null,
    cta: "Book Flexible",
    ctaColor: "bg-blue-900 hover:bg-blue-800",
  },
  {
    id: "semiflex",
    label: "Semi-Flex Rate",
    badge: "Save 5–8%",
    badgeColor: "bg-purple-600",
    priceNote: "Moderate savings",
    icon: "⚖️",
    highlight: false,
    features: [
      "Refundable up to 90 days before sailing",
      "50% credit (no cash refund) inside 90 days",
      "One name change allowed before final payment",
      "Non-transferable after final payment",
      "Date change with fare difference",
    ],
    fine: "Cancellations inside 90 days receive a future cruise credit only.",
    cta: "Book Semi-Flex",
    ctaColor: "bg-purple-700 hover:bg-purple-800",
  },
  {
    id: "nonrefundable",
    label: "Non-Refundable Rate",
    badge: "Best Price",
    badgeColor: "bg-red-600",
    priceNote: "Lowest available price",
    icon: "🏷️",
    highlight: true,
    features: [
      "Lowest price — no refunds for any reason",
      "Non-transferable to another person",
      "Deposit and full payment are non-refundable",
      "Travel insurance strongly recommended",
      "Name corrections allowed (admin fee may apply)",
    ],
    fine: "By choosing this rate you acknowledge that all payments are final and non-refundable under any circumstance, including illness, weather, or schedule changes.",
    cta: "Book Non-Refundable",
    ctaColor: "bg-red-600 hover:bg-red-700",
  },
  {
    id: "nontransferable",
    label: "Non-Transferable Rate",
    badge: "Save 3–5%",
    badgeColor: "bg-orange-500",
    priceNote: "Slight discount",
    icon: "🔒",
    highlight: false,
    features: [
      "Fully refundable up to final payment date",
      "Cannot be transferred to another name",
      "Original guest must sail — no substitutions",
      "Date changes allowed (fare difference applies)",
      "Same cancellation window as Flexible Rate",
    ],
    fine: "The cabin is tied to the original guest's name. No substitutions allowed at any time.",
    cta: "Book Non-Transferable",
    ctaColor: "bg-orange-600 hover:bg-orange-700",
  },
];

const faqItems = [
  {
    q: "What is a non-refundable cruise booking?",
    a: "A non-refundable booking locks in the lowest available price. In exchange, all deposits and payments are final — no refunds for cancellations, no matter the reason. This mirrors how non-refundable airline tickets and Expedia hotel rates work.",
  },
  {
    q: "What does non-transferable mean?",
    a: "Non-transferable means the booking is tied to the original guest's name and cannot be reassigned to another person. The original guest must be the one who sails. This is different from refundability — a non-transferable booking can still be refundable up to the cancellation date.",
  },
  {
    q: "Can I change the sailing date on a non-refundable booking?",
    a: "Generally no — non-refundable rates do not allow date changes. Some cruise lines may allow a one-time date change with a fee plus any fare difference. We'll clarify the specific policy for each sailing at booking.",
  },
  {
    q: "Do you recommend travel insurance for non-refundable rates?",
    a: "Yes — strongly. Trip cancellation insurance can reimburse you if you need to cancel for a covered reason (illness, injury, family emergency). We can help you find a policy that works alongside your booking.",
  },
  {
    q: "What happens if the cruise line cancels the sailing?",
    a: "If the cruise line cancels, you are entitled to a full refund regardless of your rate type — this is the cruise line's obligation, not ours. Non-refundable rates only restrict guest-initiated cancellations.",
  },
];

export default function BookingOptionsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
            Booking Rates
          </div>
          <h1 className="text-5xl font-extrabold mb-3">Choose Your Rate Type</h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            We offer flexible, semi-flex, non-refundable, and non-transferable rates — so you can match your booking to your travel style and budget.
          </p>
        </div>
      </section>

      {/* Rate Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {options.map((opt) => (
            <div key={opt.id} className={`rounded-2xl border overflow-hidden flex flex-col shadow-md ${opt.highlight ? "border-red-300 ring-2 ring-red-500" : "border-gray-100"}`}>
              <div className={`p-5 ${opt.highlight ? "bg-red-50" : "bg-white"}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{opt.icon}</span>
                  <span className={`text-xs font-extrabold text-white px-3 py-1 rounded-full ${opt.badgeColor}`}>{opt.badge}</span>
                </div>
                <h3 className="font-extrabold text-blue-900 text-xl mb-1">{opt.label}</h3>
                <p className="text-sm text-gray-500 mb-4">{opt.priceNote}</p>
                <ul className="space-y-2 mb-4">
                  {opt.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {opt.fine && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
                    ⚠️ {opt.fine}
                  </div>
                )}
              </div>
              <div className="mt-auto p-5 bg-gray-50 border-t border-gray-100">
                <Link
                  href={`/contact?rate=${opt.id}`}
                  className={`block text-center text-white font-bold px-5 py-3 rounded-full text-sm transition-all shadow ${opt.ctaColor}`}
                >
                  {opt.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-14">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">Quick Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="text-left px-5 py-3 font-bold">Feature</th>
                  <th className="text-center px-4 py-3 font-bold">Flexible</th>
                  <th className="text-center px-4 py-3 font-bold">Semi-Flex</th>
                  <th className="text-center px-4 py-3 font-bold text-red-300">Non-Refundable</th>
                  <th className="text-center px-4 py-3 font-bold">Non-Transferable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {[
                  ["Best price?", "—", "✓", "✓✓", "✓"],
                  ["Full refund available?", "✓", "Partial", "✗", "✓"],
                  ["Name change allowed?", "✓", "✓ (once)", "✗", "✗"],
                  ["Transfer to another person?", "✓", "Before FP", "✗", "✗"],
                  ["Date change?", "✓", "✓", "✗", "✓"],
                ].map(([feature, ...vals]) => (
                  <tr key={feature} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-semibold text-gray-700">{feature}</td>
                    {vals.map((v, i) => (
                      <td key={i} className={`px-4 py-3 text-center font-semibold ${v === "✗" ? "text-red-500" : v === "✓" || v === "✓✓" ? "text-green-600" : "text-yellow-600"}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">FP = Final Payment date · Policies subject to each cruise line&apos;s terms.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.q} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="font-extrabold text-blue-900 mb-2">{item.q}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-3">Not sure which rate is right for you?</h2>
          <p className="text-blue-200 mb-6">Our specialists will walk you through the best option based on your travel dates, budget, and flexibility needs.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg">
              Talk to a Specialist
            </Link>
            <Link href="/deals" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-full text-lg transition-all">
              Browse Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
