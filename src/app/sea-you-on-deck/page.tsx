import Link from "next/link";

const crewGroups = [
  {
    category: "Core Community",
    icon: "⚓",
    crews: [
      { name: "Cruise Crew", desc: "The general social crew — meet fellow cruisers, hang out, and have a great time together." },
      { name: "DeckWalkers Crew", desc: "Friendly faces who love to explore the ship, chat on the deck, and enjoy the journey." },
    ],
  },
  {
    category: "Social & Interest",
    icon: "🎉",
    crews: [
      { name: "Sea Duck Hunters™", desc: "Hunt for hidden rubber ducks across the ship! Trade, collect, and hide your own for others to find." },
      { name: "Sea Memories Crew", desc: "Capture every moment — photos, journals, keepsakes. Share your cruise story with fellow memory-makers." },
      { name: "SeaStrong Crew", desc: "Fitness-minded cruisers who keep their goals alive at sea. Gym sessions, challenges, and accountability partners." },
      { name: "Singles At Sea Crew", desc: "Traveling solo? Connect with other independent cruisers for group dinners, excursions, and fun." },
      { name: "Family & Friends Crew", desc: "Celebrate with your people. Coordinate activities, share tips, and make family vacations legendary." },
      { name: "Adults Only Crew", desc: "For the grown-ups who want to enjoy the quiet pools, cocktail hours, and adult-only spaces." },
      { name: "Party Wake Crew", desc: "Early risers who turn breakfast and sunrise into a party. Rise, shine, and celebrate every morning." },
      { name: "Jackpot Crew", desc: "Casino lovers and lucky charms. Share strategies, celebrate wins, and hit the jackpot together." },
      { name: "First Time Cruisers Crew", desc: "Brand new to cruising? Connect with others experiencing their first voyage — share tips, questions, and excitement." },
      { name: "Photo Crew", desc: "Shutterbugs and content creators. Find the best spots, share shots, and make each other look great." },
      { name: "Legacy Crew", desc: "Long-time cruisers passing on the love of sailing. Mentors, storytellers, and cruise veterans." },
    ],
  },
  {
    category: "Fitness & Wellness",
    icon: "🏃",
    crews: [
      { name: "Deck Runners & Walkers Crew", desc: "Log your laps on the running track and meet others keeping active at sea." },
      { name: "Sunrise Walkers Crew", desc: "Up before the crowd to watch the sun rise over the ocean with fellow early birds." },
      { name: "Sports Deck & Pickleball Crew", desc: "Friendly competition on the sports deck — pickleball, basketball, shuffleboard, and more." },
      { name: "Pool & Water Games Crew", desc: "Pool floats, water volleyball, and splash pad fun. Jump in — the water's fine." },
    ],
  },
  {
    category: "Mindfulness & Relaxation",
    icon: "🧘",
    crews: [
      { name: "Mindful Mornings Crew", desc: "Start the day with intention — yoga, meditation, journaling, and peaceful mornings at sea." },
      { name: "Zen at Sea", desc: "A crew for the calm ones. Quiet corners, deep breaths, sunsets, and stillness." },
      { name: "Serenity at Sea", desc: "Pure relaxation — hammocks, ocean breezes, and good vibes only." },
      { name: "Adult Serenity Crew", desc: "Adults-only quiet time. No rush, no noise — just the ocean and your crew." },
      { name: "Spa Loungers Crew", desc: "Thermal suites, facials, massages, and spa rituals. Treat yourself and compare notes." },
      { name: "Beauty & Spa Products Crew", desc: "Share your travel skincare routines, spa finds, and onboard beauty tips." },
      { name: "Mocktail & Chill Crew", desc: "Sip something special without the alcohol. Discover the best mocktails onboard." },
      { name: "Motion Sickness Helpers Crew", desc: "Tips, tricks, and solidarity for those who need a little extra support at sea." },
    ],
  },
  {
    category: "Family & Accessibility",
    icon: "👨‍👩‍👧",
    crews: [
      { name: "Family Cruisers Crew", desc: "Connect with other families, coordinate kid-friendly activities, and share the best family memories." },
      { name: "Teen Crew", desc: "A space for teens to connect with others their age, find activities, and have their own crew." },
      { name: "Scooter Crew", desc: "Mobility scooter users sharing tips, accessible routes, and ship navigation advice." },
      { name: "Easy Waves Crew", desc: "For guests who need a gentler, more accessible cruise experience. Helpful, welcoming, and supportive." },
      { name: "Seniors at Sea", desc: "Experienced travelers celebrating life at sea. Wisdom, laughs, and lifelong friendships." },
      { name: "LGBTQ+ Crew", desc: "A welcoming, joyful, and affirming crew for LGBTQ+ cruisers. Celebrate and sail together." },
    ],
  },
];

const featuredCrews = [
  { name: "Sea Duck Hunters™", icon: "🦆", color: "bg-yellow-400", textColor: "text-yellow-900" },
  { name: "First Time Cruisers", icon: "🚢", color: "bg-blue-500", textColor: "text-white" },
  { name: "Family Cruisers", icon: "👨‍👩‍👧", color: "bg-green-500", textColor: "text-white" },
  { name: "Adults Only", icon: "🍸", color: "bg-purple-600", textColor: "text-white" },
  { name: "Singles at Sea", icon: "🌟", color: "bg-pink-500", textColor: "text-white" },
  { name: "SeaStrong Crew", icon: "💪", color: "bg-red-600", textColor: "text-white" },
  { name: "Easy Waves", icon: "♿", color: "bg-teal-500", textColor: "text-white" },
  { name: "Jackpot Crew", icon: "🎰", color: "bg-orange-500", textColor: "text-white" },
  { name: "Party Wake Crew", icon: "🎉", color: "bg-indigo-500", textColor: "text-white" },
];

export default function SeaYouOnDeckPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-white/10 border border-white/20 text-blue-200 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Powered by Cruise Experience Center
          </div>
          <div className="text-yellow-400 text-sm font-extrabold uppercase tracking-widest mb-2">Sea You On Deck Crews™</div>
          <h1 className="text-5xl font-extrabold mb-3">Find Your People Before You Sail.</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-2">
            Join crews built around your cruise style, interests, and onboard experience.
          </p>
          <p className="text-blue-200 text-base max-w-xl mx-auto">
            Cruise communities, meetups, tips, and onboard connections — powered by Cruise Experience Center.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/sea-you-on-deck/join" className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-extrabold px-8 py-4 rounded-full text-lg transition-all shadow-lg">
              Join a Crew
            </Link>
            <Link href="/sea-you-on-deck/community" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-full text-lg transition-all">
              🔍 Who&apos;s on My Sailing?
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Sea You On Deck Crews™ · Powered by Cruise Experience Center</span>
        </div>
        <h2 className="text-3xl font-extrabold text-blue-900 mb-10 text-center">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: "1", icon: "🚢", title: "Book Your Cruise", desc: "Choose your ship and sail date through Cruises from Galveston. Sea You on Deck is included with every booking." },
            { step: "2", icon: "🌊", title: "Choose Your Privacy", desc: "Stay private — no one knows you're onboard — or join one or more crews that match your vibe." },
            { step: "3", icon: "🤝", title: "Meet Your Crew", desc: "Connect with crewmates before sailing, coordinate activities, and enjoy the voyage together." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-14 h-14 rounded-full bg-blue-900 text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-4">
                {s.step}
              </div>
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="font-extrabold text-blue-900 text-lg mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-start gap-4">
          <span className="text-3xl flex-shrink-0">🔒</span>
          <div>
            <div className="font-extrabold text-blue-900 mb-1">Your Privacy is Always Protected</div>
            <p className="text-sm text-gray-600">
              You control everything. Choosing to stay private means no other passengers can find or contact you through Sea You on Deck. Only guests who actively join a crew are visible to their crewmates — and only within that crew.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Crews (easy starter picks) */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-blue-900 mb-2">Popular Crews to Join</h2>
            <p className="text-gray-500">The most popular crews for first-time members — easy to understand, fun to join.</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {featuredCrews.map((crew) => (
              <Link
                key={crew.name}
                href={`/sea-you-on-deck/join?crew=${encodeURIComponent(crew.name)}`}
                className={`${crew.color} ${crew.textColor} rounded-2xl p-3 text-center flex flex-col items-center gap-1 hover:opacity-90 transition-opacity shadow-sm`}
              >
                <span className="text-2xl">{crew.icon}</span>
                <span className="text-xs font-extrabold leading-tight">{crew.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Crews */}
      <section id="crews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Sea You On Deck Crews™ · Powered by Cruise Experience Center</div>
          <h2 className="text-4xl font-extrabold text-blue-900 mb-2">All Crews</h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Cruise communities, meetups, tips, and onboard connections. Over 30 crews across every interest, lifestyle, and travel style. Join up to 3 crews per sailing.
          </p>
        </div>
        <div className="space-y-12">
          {crewGroups.map((group) => (
            <div key={group.category}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{group.icon}</span>
                <h3 className="text-2xl font-extrabold text-blue-900">{group.category}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.crews.map((crew) => (
                  <div key={crew.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                    <div className="font-extrabold text-blue-900 mb-2">{crew.name}</div>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">{crew.desc}</p>
                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs text-gray-300 font-semibold">A Sea You On Deck Crew™<br/>Powered by Cruise Experience Center</span>
                      <Link
                        href={`/sea-you-on-deck/join?crew=${encodeURIComponent(crew.name)}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                      >
                        Join →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-3">Ready to Find Your Crew?</h2>
          <p className="text-blue-200 mb-6">
            Let us know which ship, sail date, and crews you&apos;re interested in. We&apos;ll connect you with your crewmates before you ever step onboard.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/sea-you-on-deck/join" className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-extrabold px-8 py-4 rounded-full text-lg transition-all shadow-lg">
              Join a Crew
            </Link>
            <Link href="/sea-you-on-deck/community" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-full text-lg transition-all">
              🔍 Who&apos;s on My Sailing?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
