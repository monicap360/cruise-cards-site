import Link from "next/link";
import { FB_GROUP_URL } from "@/lib/social";

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
  { name: "Sea Duck Hunters™" },
  { name: "First Time Cruisers" },
  { name: "Family Cruisers" },
  { name: "Adults Only" },
  { name: "Singles at Sea" },
  { name: "SeaStrong Crew" },
  { name: "Easy Waves" },
  { name: "Jackpot Crew" },
  { name: "Party Wake Crew" },
];

export default function SeaYouOnDeckPage() {
  return (
    <div className="bg-[#05070d] text-white">
      {/* Hero */}
      <section className="bg-[#05070d] text-white relative overflow-hidden grid-bg py-20">
        <div className="aurora bg-sky-500 w-[600px] h-[600px] -top-40 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Powered by Cruise Experience Center"}</div>
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">{"// Sea You On Deck Crews™"}</div>
          <h1 className="text-5xl font-extrabold uppercase tracking-[-0.01em] mb-4">Booked? See Who&apos;s On Deck.</h1>
          <p className="text-xl text-white/55 max-w-2xl mx-auto mb-2">
            Once you&apos;ve booked your cruise, see who&apos;s sailing with you and join crews built around your style, interests, and onboard experience.
          </p>
          <p className="text-white/45 text-base max-w-xl mx-auto">
            Cruise communities, meetups, tips, and onboard connections — powered by Cruise Experience Center.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href="/sea-you-on-deck/join" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all">
              Join a Crew
            </Link>
            <Link href="/sea-you-on-deck/community" className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all">
              Who&apos;s on My Sailing?
            </Link>
          </div>
        </div>
      </section>

      {/* Facebook Group connection */}
      <section className="bg-[#0b1020] border-y border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">{"// Our Facebook Community"}</div>
            <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">Join our Facebook Group</h2>
            <p className="text-white/55 mt-1 max-w-xl">
              Roll calls, tips, deals, and fellow Galveston cruisers — connect with your sailing before you
              board and keep the conversation going after. Sea You on Deck crews + our Facebook Group, together.
            </p>
          </div>
          <a
            href={FB_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1877F2] hover:bg-[#1466d6] text-white font-semibold uppercase tracking-wider text-sm px-7 py-4 rounded-full whitespace-nowrap"
          >
            Join the Facebook Group →
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-2">
          <span className="label-mono text-[11px] uppercase text-sky-400/80">{"// Sea You On Deck Crews™ · Powered by Cruise Experience Center"}</span>
        </div>
        <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] text-white mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {[
            { step: "01", title: "Book Your Cruise", desc: "Choose your ship and sail date through Cruises from Galveston. Sea You on Deck is included with every booking." },
            { step: "02", title: "Choose Your Privacy", desc: "Stay private — no one knows you're onboard — or join one or more crews that match your vibe." },
            { step: "03", title: "Meet Your Crew", desc: "Once you're booked, connect with crewmates on your sailing, coordinate activities, and enjoy the voyage together." },
          ].map((s) => (
            <div key={s.step} className="bg-[#05070d] p-7 hover:bg-white/[0.03] text-center">
              <div className="label-mono text-sky-400 text-sm mb-4">{s.step}</div>
              <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-lg mb-2">{s.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#0b1020] border border-white/10 rounded-2xl p-6 flex items-start gap-4">
          <div>
            <div className="font-extrabold uppercase tracking-[-0.01em] text-white mb-1">Your Privacy is Always Protected</div>
            <p className="text-sm text-white/55">
              You control everything. Choosing to stay private means no other passengers can find or contact you through Sea You on Deck. Only guests who actively join a crew are visible to their crewmates — and only within that crew.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Crews (easy starter picks) */}
      <section className="bg-[#05070d] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] text-white mb-2">Popular Crews to Join</h2>
            <p className="text-white/55">The most popular crews for first-time members — easy to understand, fun to join.</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {featuredCrews.map((crew, i) => (
              <Link
                key={crew.name}
                href={`/sea-you-on-deck/join?crew=${encodeURIComponent(crew.name)}`}
                className="bg-[#0b1020] border border-white/10 rounded-2xl p-3 text-center flex flex-col items-center gap-1 hover:bg-white/[0.03] transition-colors"
              >
                <span className="label-mono text-sky-400 text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-xs font-extrabold text-white leading-tight">{crew.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Crews */}
      <section id="crews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">{"// Sea You On Deck Crews™ · Powered by Cruise Experience Center"}</div>
          <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white mb-2">All Crews</h2>
          <p className="text-white/55 text-base max-w-2xl mx-auto">
            Cruise communities, meetups, tips, and onboard connections. Over 30 crews across every interest, lifestyle, and travel style. Join up to 3 crews per sailing.
          </p>
        </div>
        <div className="space-y-12">
          {crewGroups.map((group) => (
            <div key={group.category}>
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-2xl font-extrabold uppercase tracking-[-0.01em] text-white">{group.category}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.crews.map((crew) => (
                  <div key={crew.name} className="bg-[#0b1020] border border-white/10 rounded-2xl p-5 flex flex-col">
                    <div className="font-extrabold uppercase tracking-[-0.01em] text-white mb-2">{crew.name}</div>
                    <p className="text-sm text-white/55 leading-relaxed flex-1">{crew.desc}</p>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-white/45 font-semibold">A Sea You On Deck Crew™<br/>Powered by Cruise Experience Center</span>
                      <Link
                        href={`/sea-you-on-deck/join?crew=${encodeURIComponent(crew.name)}`}
                        className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors flex-shrink-0"
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
      <section className="bg-[#05070d] relative overflow-hidden grid-bg text-white py-16">
        <div className="aurora bg-sky-500 w-[500px] h-[500px] -bottom-40 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-3">Already Booked? Find Your Crew.</h2>
          <p className="text-white/55 mb-6">
            Let us know which ship, sail date, and crews you&apos;re interested in. Once you&apos;ve booked, we&apos;ll connect you with the crewmates already on your sailing.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/sea-you-on-deck/join" className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all">
              Join a Crew
            </Link>
            <Link href="/sea-you-on-deck/community" className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all">
              Who&apos;s on My Sailing?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
