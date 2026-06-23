import Link from "next/link";

const schedule = [
  { window: "91+ days before sailing", penalty: "Deposit only forfeited", refund: "Full refund of all payments above deposit", color: "bg-green-600", badge: "Full Refund" },
  { window: "61–90 days before sailing", penalty: "25% of total fare", refund: "75% refund of total fare paid", color: "bg-yellow-500", badge: "25% Penalty" },
  { window: "31–60 days before sailing", penalty: "50% of total fare", refund: "50% refund of total fare paid", color: "bg-orange-500", badge: "50% Penalty" },
  { window: "15–30 days before sailing", penalty: "75% of total fare", refund: "25% refund of total fare paid", color: "bg-red-500", badge: "75% Penalty" },
  { window: "0–14 days before sailing", penalty: "100% of total fare — no refund", refund: "No refund issued under any circumstance", color: "bg-red-800", badge: "No Refund" },
];

const nonRefundableRules = [
  "The full booking amount is forfeited at the time of booking — no refund at any time for any reason.",
  "Name changes may be allowed with a fee prior to final payment — subject to cruise line policy.",
  "Date changes are not permitted.",
  "No exceptions for illness, weather, emergencies, or government advisories.",
  "Vacation Protection is strongly recommended for all non-refundable bookings.",
];

const faqs = [
  {
    q: "What counts as the cancellation date?",
    a: "The cancellation date is the date we receive your written cancellation request — not the date of the sailing. Cancellations must be submitted in writing via email to cruisesfromgalveston.texas@gmail.com or in person at the Cruise Experience Center.",
  },
  {
    q: "What if the cruise line cancels the sailing?",
    a: "If the cruise line cancels or significantly alters the itinerary, you are entitled to a full refund of all amounts paid — regardless of your rate type. This is the cruise line's obligation and overrides our cancellation policy.",
  },
  {
    q: "Can I transfer my booking to someone else instead of cancelling?",
    a: "Flexible and Semi-Flex rate bookings may allow one name transfer before final payment, subject to a fee. Non-Transferable and Non-Refundable rate bookings do not permit transfers. See our Booking Options page for details.",
  },
  {
    q: "What if I have Vacation Protection?",
    a: "If you purchased a Vacation Protection plan and cancel for a covered reason, your plan may reimburse your cruise fare — up to the coverage limits in your policy. You would file a claim directly with the protection provider. We assist with documentation.",
  },
  {
    q: "Is the deposit refundable?",
    a: "Deposits are refundable if cancellation occurs 91 or more days before sailing (Flexible rate). For Semi-Flex, deposits are refundable before 90 days. For Non-Refundable bookings, deposits are never refundable.",
  },
  {
    q: "What about Sea Pay payment plans?",
    a: "If you cancel a Sea Pay booking, the applicable cancellation penalty applies to the full booking amount — not just what you have paid to date. The remaining balance may still be owed depending on the cancellation window.",
  },
];

export default function CancellationPolicyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-3">Policy</div>
          <h1 className="text-4xl font-extrabold mb-3">Cancellation Policy</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Understanding your cancellation window can save you significant money. We strongly recommend Vacation Protection for all bookings.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/vacation-protection" className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-6 py-3 rounded-full text-sm transition-all shadow">
              View Vacation Protection →
            </Link>
            <Link href="/booking-options" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-full text-sm transition-all">
              Booking Rate Types
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Flexible / Semi-Flex Schedule */}
        <section>
          <h2 className="text-2xl font-extrabold text-blue-900 mb-2">Flexible &amp; Semi-Flex Rate Cancellation Schedule</h2>
          <p className="text-gray-500 mb-6 text-sm">Applies to Flexible and Semi-Flex rate bookings. The penalty increases as you approach the sail date.</p>
          <div className="space-y-3">
            {schedule.map((row) => (
              <div key={row.window} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                <div className={`${row.color} text-white px-5 py-4 flex items-center gap-3 sm:w-56 flex-shrink-0`}>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide opacity-80">{row.badge}</div>
                    <div className="font-extrabold text-sm leading-tight mt-0.5">{row.window}</div>
                  </div>
                </div>
                <div className="px-6 py-4 flex-1">
                  <div className="font-extrabold text-gray-800 text-sm mb-1">Penalty: {row.penalty}</div>
                  <div className="text-xs text-gray-400">{row.refund}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Non-Refundable */}
        <section>
          <h2 className="text-2xl font-extrabold text-blue-900 mb-2">Non-Refundable Rate</h2>
          <p className="text-gray-500 mb-5 text-sm">Non-refundable bookings carry no cancellation rights. By accepting this rate, you agree to the following conditions.</p>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <ul className="space-y-3">
              {nonRefundableRules.map((rule, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-red-800">
                  <span className="font-extrabold text-red-600 flex-shrink-0 mt-0.5">✗</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Waiver reminder */}
        <section className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">⚠️</span>
            <div>
              <div className="font-extrabold text-yellow-900 text-lg mb-2">Vacation Protection Declination</div>
              <p className="text-sm text-yellow-800 leading-relaxed mb-4">
                If you choose not to purchase Vacation Protection, you will be required to sign a <strong>Vacation Protection Declination &amp; Liability Release</strong> form. This form acknowledges that you were offered coverage, understand the cancellation risks, and release Cruises from Galveston™ from any financial liability related to your uncovered losses.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/vacation-protection" className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold px-5 py-2 rounded-full text-sm transition-all">
                  Learn About Protection
                </Link>
                <Link href="/decline-protection" className="border border-yellow-400 text-yellow-800 font-bold px-5 py-2 rounded-full text-sm hover:bg-yellow-100 transition-all">
                  Sign Declination Form
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-extrabold text-blue-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="font-extrabold text-blue-900 mb-2">{faq.q}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Legal note */}
        <section className="border-t border-gray-100 pt-8">
          <p className="text-xs text-gray-400 leading-relaxed">
            This cancellation policy is the policy of Cruises from Galveston™ and applies to all bookings made directly through our agency. Individual cruise lines may have additional or different policies that apply simultaneously. In the event of a conflict, the more restrictive policy applies. Policy is subject to change; the version in effect at the time of your booking applies. For questions, contact us at cruisesfromgalveston.texas@gmail.com.
          </p>
        </section>
      </div>
    </div>
  );
}
