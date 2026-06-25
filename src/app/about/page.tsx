import Link from "next/link";

const reasons = [
  {
    title: "Galveston Experts",
    desc: "We exclusively specialize in cruises departing from the Port of Galveston. Nobody knows these sailings better than us.",
  },
  {
    title: "Best Price Guarantee",
    desc: "We shop every cruise line to find you the best deal. If you find a lower price, we'll match it.",
  },
  {
    title: "Personal Service",
    desc: "You'll work directly with a cruise specialist — not a call center. We're here before, during, and after your trip.",
  },
  {
    title: "Years of Experience",
    desc: "We've helped thousands of Texans set sail from Galveston. Our experience means a smoother vacation for you.",
  },
  {
    title: "Drive & Cruise",
    desc: "We specialize in the unique advantage of Galveston cruising — drive to the port, park, and sail. No flying required.",
  },
  {
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
    <div className="bg-[#05070d]">
      {/* Header */}
      <section className="bg-[#05070d] text-white relative overflow-hidden grid-bg py-16">
        <div className="aurora bg-sky-500 -top-40 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Based in Galveston, Texas"}</div>
          <h1 className="text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">
            About Us
          </h1>
          <p className="text-white/55 text-xl max-w-2xl mx-auto">
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
            <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-white/55 leading-relaxed">
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
              className="inline-block mt-8 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Talk to a Specialist
            </Link>
          </div>

          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-10 text-white">
            <h3 className="text-2xl font-extrabold uppercase tracking-[-0.01em] text-center mb-8">
              Our Mission
            </h3>
            <p className="text-white/55 text-center text-lg leading-relaxed">
              To make cruise vacations from Galveston accessible, affordable,
              and unforgettable for every Texan — one amazing sailing at a time.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-[#05070d] p-4 text-center hover:bg-white/[0.03]"
                >
                  <div className="text-3xl font-extrabold text-holo">
                    {s.value}
                  </div>
                  <div className="text-white/45 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#05070d] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white mb-3">
              Why Choose the Cruise Experience Center?
            </h2>
            <p className="text-white/55 text-lg">
              We&apos;re not just a booking site — we&apos;re your Galveston cruise
              partners.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="bg-[#05070d] p-7 hover:bg-white/[0.03] transition-colors"
              >
                <h3 className="font-bold uppercase tracking-[-0.01em] text-white text-lg mb-2">
                  {r.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b1020] border-t border-white/10 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-3">
            Let&apos;s Plan Your Galveston Cruise
          </h2>
          <p className="text-white/55 mb-6">
            Ready to start your next adventure from the Port of Galveston?
            Reach out and a specialist will be in touch shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/deals"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Browse Deals
            </Link>
            <Link
              href="/contact"
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
