import Link from "next/link";

const coverageItems = [
  {
    icon: "✈️",
    title: "Trip Cancellation",
    desc: "Reimburses your non-refundable cruise fare if you must cancel for a covered reason — illness, injury, death of a family member, job loss, jury duty, or weather events that make travel impossible.",
    limit: "Up to 100% of trip cost",
  },
  {
    icon: "🚢",
    title: "Trip Interruption",
    desc: "Covers you if you must leave the ship mid-cruise due to a covered emergency. Reimburses unused cruise days and transportation home.",
    limit: "Up to 150% of trip cost",
  },
  {
    icon: "🏥",
    title: "Emergency Medical",
    desc: "Cruise ship medical facilities charge hospital-level rates — sometimes $1,000+ per day. This covers medical treatment onboard and at ports, plus emergency evacuations.",
    limit: "Up to $50,000",
  },
  {
    icon: "🚁",
    title: "Medical Evacuation",
    desc: "Air evacuation from a ship or remote port to the nearest adequate medical facility can cost $50,000–$200,000 without coverage. This covers the full cost.",
    limit: "Up to $500,000",
  },
  {
    icon: "🧳",
    title: "Baggage Loss & Delay",
    desc: "Reimburses you if checked luggage is lost, stolen, or damaged. Also covers emergency purchases if your bags are delayed more than 12 hours.",
    limit: "Up to $2,500",
  },
  {
    icon: "⏰",
    title: "Travel Delay",
    desc: "Covers meals and hotel stays if your flight or transportation is delayed more than 6 hours due to weather, mechanical issues, or other covered causes.",
    limit: "Up to $1,000",
  },
  {
    icon: "🔄",
    title: "Cancel For Any Reason",
    desc: "Optional upgrade — reimburses up to 75% of your trip cost if you cancel for ANY reason, including a change of mind. Must be purchased within 14 days of initial deposit.",
    limit: "Up to 75% of trip cost",
    optional: true,
  },
];

const coveredReasons = [
  "Sudden illness or injury (you, travel companion, or immediate family)",
  "Death of you, a travel companion, or an immediate family member",
  "Unexpected job loss or employer-required work obligation",
  "Jury duty or subpoena that cannot be postponed",
  "Home becomes uninhabitable due to fire, flood, or natural disaster",
  "Severe weather that causes a complete travel shutdown",
  "Military deployment or activation",
  "Terrorism at your departure city or destination (within 30 days of departure)",
  "Cruise ship mechanical breakdown lasting 24+ hours",
];

const notCovered = [
  "Pre-existing medical conditions (unless waiver purchased within 14 days of deposit)",
  "Change of mind (unless Cancel For Any Reason upgrade is purchased)",
  "Financial insolvency of a supplier not specifically listed in the policy",
  "War, civil unrest, or government seizure of assets",
  "Losses already covered by another insurance policy",
];

const tiers = [
  {
    name: "Standard Protection",
    price: "~6% of trip cost",
    example: "$149 on a $2,500 booking",
    highlight: false,
    includes: [
      "Trip Cancellation (100% of trip cost)",
      "Trip Interruption (150% of trip cost)",
      "Emergency Medical ($25,000)",
      "Medical Evacuation ($250,000)",
      "Baggage Loss ($1,500)",
      "Travel Delay ($500)",
    ],
  },
  {
    name: "Premium Protection",
    price: "~8% of trip cost",
    example: "$199 on a $2,500 booking",
    highlight: true,
    includes: [
      "Trip Cancellation (100% of trip cost)",
      "Trip Interruption (150% of trip cost)",
      "Emergency Medical ($50,000)",
      "Medical Evacuation ($500,000)",
      "Baggage Loss ($2,500)",
      "Travel Delay ($1,000)",
      "Pre-Existing Condition Waiver",
    ],
  },
  {
    name: "Premium + CFAR",
    price: "~10% of trip cost",
    example: "$249 on a $2,500 booking",
    highlight: false,
    includes: [
      "Everything in Premium Protection",
      "Cancel For Any Reason (75% back)",
      "Must be purchased within 14 days of deposit",
    ],
  },
];

export default function VacationProtectionPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-teal-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-yellow-400 text-blue-900 text-sm font-extrabold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
            Strongly Recommended
          </div>
          <h1 className="text-5xl font-extrabold mb-3">Vacation Protection Plan</h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-2">
            One unexpected illness, missed flight, or family emergency can cost you your entire cruise fare. Vacation Protection covers what your booking rate does not.
          </p>
          <p className="text-blue-200 text-base max-w-xl mx-auto">
            Offered through Cruises from Galveston™ · Cruise Experience Center™ at time of booking.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/book" className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-extrabold px-8 py-4 rounded-full text-lg transition-all shadow-lg">
              Add Protection at Booking
            </Link>
            <Link href="/decline-protection" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-full text-lg transition-all">
              Decline &amp; Sign Waiver
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Coverage Grid */}
        <section>
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2 text-center">What&apos;s Covered</h2>
          <p className="text-gray-400 text-center mb-8">Coverage details vary by plan tier. See plan comparison below.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coverageItems.map((item) => (
              <div key={item.title} className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col ${item.optional ? "border-purple-200" : "border-gray-100"}`}>
                {item.optional && (
                  <div className="text-xs font-extrabold text-purple-600 uppercase tracking-wide mb-2">Optional Upgrade</div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="font-extrabold text-blue-900 text-base">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{item.desc}</p>
                <div className="mt-3 bg-blue-50 text-blue-700 text-xs font-extrabold px-3 py-1.5 rounded-full self-start">
                  {item.limit}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Plan Tiers */}
        <section>
          <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center">Plan Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((tier) => (
              <div key={tier.name} className={`rounded-2xl border overflow-hidden shadow-md flex flex-col ${tier.highlight ? "border-blue-400 ring-2 ring-blue-500" : "border-gray-100"}`}>
                {tier.highlight && (
                  <div className="bg-blue-600 text-white text-xs font-extrabold text-center py-2 uppercase tracking-wide">Most Popular</div>
                )}
                <div className="bg-white p-6 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-blue-900 text-lg mb-1">{tier.name}</h3>
                  <div className="text-2xl font-extrabold text-blue-700 mb-0.5">{tier.price}</div>
                  <div className="text-xs text-gray-400 mb-5">e.g., {tier.example}</div>
                  <ul className="space-y-2 flex-1">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/book" className="mt-6 block text-center bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-3 rounded-full text-sm transition-all">
                    Add at Booking
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Covered Reasons */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-extrabold text-blue-900 mb-4">Covered Cancellation Reasons</h2>
            <ul className="space-y-2">
              {coveredReasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-blue-900 mb-4">What Is Not Covered</h2>
            <ul className="space-y-2">
              {notCovered.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">✗</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Declination warning */}
        <section className="bg-red-50 border border-red-200 rounded-2xl p-7">
          <div className="flex items-start gap-4">
            <span className="text-4xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="text-xl font-extrabold text-red-900 mb-2">Choosing to Decline</h3>
              <p className="text-sm text-red-800 leading-relaxed mb-4">
                If you choose not to purchase Vacation Protection, you are required to sign our <strong>Vacation Protection Declination &amp; Liability Release</strong>. By signing, you confirm that you were offered protection, understand the financial risks of declining, and release <strong>Cruises from Galveston™</strong> from any liability for losses that could have been covered under this plan. You may not seek compensation from our agency for losses arising from events this plan would have covered.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/book" className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all">
                  I Want Protection — Book Now
                </Link>
                <Link href="/decline-protection" className="bg-red-100 hover:bg-red-200 border border-red-300 text-red-800 font-bold px-5 py-2.5 rounded-full text-sm transition-all">
                  I Decline — Sign Waiver
                </Link>
              </div>
            </div>
          </div>
        </section>

        <p className="text-xs text-gray-400 text-center leading-relaxed">
          Vacation Protection plans are offered in partnership with third-party insurance providers. Coverage terms, limits, and exclusions are defined by the provider&apos;s policy documents provided at enrollment. Cruises from Galveston™ is not an insurance company and does not underwrite coverage. For questions, contact us at cruisesfromgalveston.texas@gmail.com.
        </p>
      </div>
    </div>
  );
}
