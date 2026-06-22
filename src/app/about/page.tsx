import Link from "next/link";

const reasons = [
  {
    icon: "🗺️",
    title: "Galveston Experts",
    desc: "We exclusively specialize in cruises departing from the Port of Galveston. Nobody knows these sailings better than us.",
  },
  {
    icon: "💰",
    title: "Best Price Guarantee",
    desc: "We shop every cruise line to find you the best deal. If you find a lower price, we'll match it.",
  },
  {
    icon: "📞",
    title: "Personal Service",
    desc: "You'll work directly with a cruise specialist — not a call center. We're here before, during, and after your trip.",
  },
  {
    icon: "🌟",
    title: "Years of Experience",
    desc: "We've helped thousands of Texans set sail from Galveston. Our experience means a smoother vacation for you.",
  },
  {
    icon: "🚗",
    title: "Drive & Cruise",
    desc: "We specialize in the unique advantage of Galveston cruising — drive to the port, park, and sail. No flying required.",
  },
  {
    icon: "🤝",
    title: "After-Sale Support",
    desc: "Questions before you board? Need help with travel docs? We're with you every step of the way.",
  },
];

const stats = [
  { value: "10,000+", label: "Happy Cruisers" },
  { value: "4", label: "Cruise Line Partners" },
  { value: "50+", label: "Itineraries Available" },
  { value: "100%", label: "Galveston Departures" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
            ⚓ Based in Galveston, Texas
          </div>
          <h1 className="text-5xl font-extrabold mb-4">About Us</h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            We are the Cruise Experience Center — Galveston&apos;s dedicated cruise
            specialists, helping Texans discover the world from their own
            backyard.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-blue-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                The Cruise Experience Center was born from a simple passion:
                helping Texans experience the joy of cruising without the hassle
                of flying to a faraway port.
              </p>
              <p>
                Located in Galveston, Texas, we are uniquely positioned to be
                your local cruise experts. The Port of Galveston is one of the
                busiest cruise ports in the United States, and we know every
                ship, every terminal, and every sailing schedule by heart.
              </p>
              <p>
                Whether you&apos;re a first-time cruiser wondering which ship is
                right for you, or a seasoned sailor looking for the best deal
                on a longer Caribbean voyage, our specialists are here to help
                you plan the perfect trip.
              </p>
              <p>
                We believe cruising from Galveston is one of the best vacation
                values in America — drive to the port, park your car, and wake
                up somewhere beautiful. Let us show you why.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-block mt-8 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg"
            >
              Talk to a Specialist
            </Link>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-3xl p-10 text-white">
            <div className="text-7xl text-center mb-6">🚢</div>
            <h3 className="text-2xl font-extrabold text-center mb-8">
              Our Mission
            </h3>
            <p className="text-blue-100 text-center text-lg leading-relaxed">
              To make cruise vacations from Galveston accessible, affordable,
              and unforgettable for every Texan — one amazing sailing at a time.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/15 rounded-xl p-4 text-center"
                >
                  <div className="text-3xl font-extrabold text-yellow-300">
                    {s.value}
                  </div>
                  <div className="text-blue-200 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-3">
              Why Choose the Cruise Experience Center?
            </h2>
            <p className="text-gray-500 text-lg">
              We&apos;re not just a booking site — we&apos;re your Galveston cruise
              partners.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{r.icon}</div>
                <h3 className="font-bold text-blue-900 text-lg mb-2">
                  {r.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-3">
            Let&apos;s Plan Your Galveston Cruise ⚓
          </h2>
          <p className="text-blue-200 mb-6">
            Ready to start your next adventure from the Port of Galveston?
            Reach out and a specialist will be in touch shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/deals"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg"
            >
              Browse Deals
            </Link>
            <Link
              href="/contact"
              className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
