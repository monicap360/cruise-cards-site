import Link from "next/link";

const options = [
  {
    id: "flexible",
    label: "Flexible Rate",
    badge: "Most Popular",
    priceNote: "Standard price",
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
  },
  {
    id: "semiflex",
    label: "Semi-Flex Rate",
    badge: "Save 5–8%",
    priceNote: "Moderate savings",
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
  },
  {
    id: "nonrefundable",
    label: "Non-Refundable Rate",
    badge: "Best Price",
    priceNote: "Lowest available price",
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
  },
  {
    id: "nontransferable",
    label: "Non-Transferable Rate",
    badge: "Save 3–5%",
    priceNote: "Slight discount",
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
    <div className="bg-[#05070d]">
      {/* Hero */}
      <section className="bg-[#05070d] text-white relative overflow-hidden grid-bg py-20">
        <div className="aurora bg-sky-500 w-[600px] h-[600px] -top-40 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Booking Rates"}</div>
          <h1 className="text-5xl font-extrabold uppercase tracking-[-0.01em] mb-3">Choose Your Rate Type</h1>
          <p className="text-white/55 text-xl max-w-2xl mx-auto">
            We offer flexible, semi-flex, non-refundable, and non-transferable rates — so you can match your booking to your travel style and budget.
          </p>
        </div>
      </section>

      {/* Rate Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {options.map((opt) => (
            <div key={opt.id} className={`rounded-2xl border overflow-hidden flex flex-col bg-[#0b1020] ${opt.highlight ? "border-sky-400/70" : "border-white/10"}`}>
              <div className="p-5">
                <div className="flex items-start justify-end mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 border border-sky-400/30 bg-sky-400/10 px-3 py-1 rounded-full">{opt.badge}</span>
                </div>
                <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-xl mb-1">{opt.label}</h3>
                <p className="text-sm text-white/45 mb-4">{opt.priceNote}</p>
                <ul className="space-y-2 mb-4">
                  {opt.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/55">
                      <span className="text-sky-400 font-bold mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {opt.fine && (
                  <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3 text-xs text-amber-300/80">
                    {opt.fine}
                  </div>
                )}
              </div>
              <div className="mt-auto p-5 border-t border-white/10">
                <Link
                  href={`/contact?rate=${opt.id}`}
                  className="block text-center bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-5 py-3 rounded-full text-sm transition-all"
                >
                  {opt.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-14">
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] text-white mb-6 text-center">Quick Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-[#0b1020] text-white">
                <tr>
                  <th className="text-left px-5 py-3 font-bold">Feature</th>
                  <th className="text-center px-4 py-3 font-bold">Flexible</th>
                  <th className="text-center px-4 py-3 font-bold">Semi-Flex</th>
                  <th className="text-center px-4 py-3 font-bold text-sky-300">Non-Refundable</th>
                  <th className="text-center px-4 py-3 font-bold">Non-Transferable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-[#05070d]">
                {[
                  ["Best price?", "—", "✓", "✓✓", "✓"],
                  ["Full refund available?", "✓", "Partial", "✗", "✓"],
                  ["Name change allowed?", "✓", "✓ (once)", "✗", "✗"],
                  ["Transfer to another person?", "✓", "Before FP", "✗", "✗"],
                  ["Date change?", "✓", "✓", "✗", "✓"],
                ].map(([feature, ...vals]) => (
                  <tr key={feature} className="hover:bg-white/[0.03]">
                    <td className="px-5 py-3 font-semibold text-white/70">{feature}</td>
                    {vals.map((v, i) => (
                      <td key={i} className={`px-4 py-3 text-center font-semibold ${v === "✗" ? "text-white/40" : v === "✓" || v === "✓✓" ? "text-sky-400" : "text-amber-300/80"}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-white/45 mt-3 text-center">FP = Final Payment date · Policies subject to each cruise line&apos;s terms.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#05070d] py-14 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.q} className="bg-[#0b1020] rounded-2xl border border-white/10 p-5">
                <div className="font-extrabold text-white mb-2">{item.q}</div>
                <p className="text-sm text-white/55 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#05070d] text-white py-14 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-3">Not sure which rate is right for you?</h2>
          <p className="text-white/55 mb-6">Our specialists will walk you through the best option based on your travel dates, budget, and flexibility needs.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all">
              Talk to a Specialist
            </Link>
            <Link href="/deals" className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all">
              Browse Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
