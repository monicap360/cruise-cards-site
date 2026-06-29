import Link from "next/link";
import ShipImage from "@/components/ShipImage";
import { getTerminal } from "@/lib/port-terminals";

export const metadata = {
  title: "Cruise Ships Sailing from Galveston",
  description:
    "Every cruise ship homeported in Galveston — Carnival Jubilee, Breeze, Dream & Miracle; Royal Caribbean; MSC Seascape; Norwegian Viva; Disney Magic; and the new Carnival Tropicale (2028). Photos, itineraries & terminal entry streets.",
};

const cruiseLines = [
  {
    name: "Carnival Cruise Line",
    color: "from-blue-700 to-[#0a1f44]",
    emoji: "🎉",
    description:
      "Carnival sails more ships from Galveston than any other line — including the brand-new Carnival Jubilee, one of the largest cruise ships ever homeported in Texas. Perfect for families, groups, and first-time cruisers.",
    ships: [
      {
        ship: "Carnival Jubilee",
        badge: "🆕 Newest Ship",
        destinations: "7-Night Western Caribbean — Cozumel, Roatán, Belize & Costa Maya",
        desc:
          "Galveston's newest and most impressive ship. This Excel-class mega-ship debuted in December 2023 and features the BOLT roller coaster at sea, Summer Landing resort-style deck, 20+ dining options, and massive family entertainment zones. If you want the biggest, newest cruise experience leaving Texas — this is it.",
        seaPay: true,
      },
      {
        ship: "Carnival Breeze",
        badge: "",
        destinations: "Western Caribbean — Cozumel, Roatán & Belize",
        desc:
          "A Dream-class ship packed with outdoor fun. The WaterWorks aqua park features towering waterslides, and the Serenity adults-only retreat offers a peaceful escape. Guy's Burger Joint, BlueIguana Cantina, and a lively Red Frog Rum Bar round out the experience. Great all-around value.",
        seaPay: true,
      },
      {
        ship: "Carnival Freedom",
        badge: "",
        destinations: "3–4 Night Cozumel Getaways",
        desc:
          "Perfect for a quick escape. This Conquest-class ship is ideal for first-timers or anyone who wants a taste of the Caribbean without committing to a full week. The WaterWorks park, casino, comedy club, and multiple dining options make even short sailings feel complete.",
        seaPay: false,
      },
      {
        ship: "Carnival Vista",
        badge: "",
        destinations: "7–8 Night Extended Caribbean",
        desc:
          "The ship that redefined Carnival — the first at sea to feature an IMAX theater and the SkyRide aerial bicycle attraction suspended over the ocean. The Havana Bar & Pool brings a Cuban resort vibe, and Guy's Pig & Anchor Smokehouse is a crowd favorite. Excellent for longer voyages.",
        seaPay: true,
      },
      {
        ship: "Carnival Dream",
        badge: "",
        destinations: "Western Caribbean — Grand Cayman & Cozumel",
        desc:
          "One of Carnival's most beloved ships. The Dream-class design offers wide open spaces, the relaxing Serenity adults-only area, a full WaterWorks park, and a massive casino. Its warm, party-ready atmosphere makes it a top choice for groups and celebratory sailings.",
        seaPay: true,
      },
      {
        ship: "Carnival Legend",
        badge: "",
        destinations: "Mexico & Western Caribbean",
        desc:
          "A smaller, more intimate Spirit-class ship that delivers a classic cruise feel. With just over 2,100 guests, the Legend never feels overcrowded. Highlights include the Serenity adults-only retreat, the Golden Fleece steakhouse, a full spa, and a lively atrium that serves as the social hub of the ship.",
        seaPay: true,
      },
    ],
  },
  {
    name: "Royal Caribbean",
    color: "from-blue-500 to-blue-800",
    emoji: "👑",
    description:
      "Royal Caribbean brings world-class thrills and jaw-dropping ships to Galveston — including Symphony of the Seas, one of the largest cruise ships ever built. Perfect for adventure seekers and active families.",
    ships: [
      {
        ship: "Symphony of the Seas",
        badge: "🌟 Flagship",
        destinations: "7-Night Caribbean — Perfect Day at CocoCay, Nassau & More",
        desc:
          "One of the largest cruise ships in the world and an absolute marvel at sea. Symphony of the Seas features 7 distinct neighborhood districts — including a living Central Park, a lively Boardwalk with a carousel, and the Royal Promenade. Thrill-seekers love the Ultimate Abyss (the tallest slide at sea), the Perfect Storm waterslides, an ice skating rink, a zip line, and the FlowRider surf simulator. Over 20 restaurants and 23 pool deck experiences. If you want to be blown away, this is your ship.",
        seaPay: true,
      },
      {
        ship: "Liberty of the Seas",
        badge: "",
        destinations: "5-Night Bahamas — Nassau & Perfect Day at CocoCay",
        desc:
          "A Freedom-class powerhouse loaded with activities. The FlowRider surf simulator, rock climbing wall, H2O Zone water park for kids, ice skating rink, and multiple pools keep the whole family busy. Royal Promenade shopping and dining, plus a full casino and live entertainment — all in a 5-night package that's easy on the budget.",
        seaPay: true,
      },
      {
        ship: "Mariner of the Seas",
        badge: "",
        destinations: "Eastern Caribbean — St. Thomas & Puerto Rico",
        desc:
          "A Voyager-class ship amplified and modernized in 2018. The Sky Pad VR bungee trampoline, laser tag arena, and Splashaway Bay aqua park for kids are standout additions. The Royal Promenade runs the length of the ship with cafes, bars, and entertainment. Mariner strikes a great balance between activity-packed fun and relaxed Caribbean cruising.",
        seaPay: true,
      },
      {
        ship: "Voyager of the Seas",
        badge: "",
        destinations: "Western Caribbean — Cozumel & Grand Cayman",
        desc:
          "The original adventure ship — Voyager of the Seas pioneered the concept of activities-at-sea when it launched. Inline skating, a full-size basketball court, rock climbing, and the iconic Royal Promenade are all on board. A timeless ship that still delivers a phenomenal experience, especially for Western Caribbean itineraries.",
        seaPay: false,
      },
    ],
  },
  {
    name: "Norwegian Cruise Line",
    color: "from-teal-500 to-teal-700",
    emoji: "🌊",
    description:
      "Norwegian's Freestyle Cruising philosophy means no assigned dining times, no formal dress codes, and total flexibility. Dine when you want, do what you want — your cruise, your rules.",
    ships: [
      {
        ship: "Norwegian Joy",
        badge: "",
        destinations: "7-Night Caribbean — Roatán, Belize & Cozumel",
        desc:
          "A Breakaway-Plus class ship built for non-stop excitement. Norwegian Joy features a two-level race track at sea, a laser tag arena, the Galaxy Pavilion virtual reality experience, and an Aqua Park with multi-story waterslides. With 28 dining options and The Waterfront outdoor promenade, Joy lives up to its name for every type of traveler.",
        seaPay: true,
      },
      {
        ship: "Norwegian Breakaway",
        badge: "",
        destinations: "4-Night Mexico — Cozumel & Progreso",
        desc:
          "A Breakaway-class ship that brought a new standard of entertainment to NCL. The Aqua Park boasts five waterslides including the Whip and Free Fall. The Waterfront is an outdoor promenade lined with restaurants and bars — a genuinely unique feature that lets you dine oceanside. Excellent for shorter Mexico getaways.",
        seaPay: true,
      },
      {
        ship: "Norwegian Sky",
        badge: "",
        destinations: "4-Night Gulf of Mexico Getaway",
        desc:
          "A more intimate classic NCL ship perfect for a relaxed long-weekend escape. Norwegian Sky's smaller size means easy navigation and a friendly atmosphere. Multiple dining options, a full spa and fitness center, and NCL's signature Freestyle freedom make it a great starter cruise or a low-key getaway for couples.",
        seaPay: false,
      },
    ],
  },
  {
    name: "MSC Cruises",
    color: "from-slate-600 to-slate-900",
    emoji: "⚓",
    description:
      "MSC Cruises is the world's third-largest cruise line and one of the fastest-growing at the Port of Galveston. With a distinctly European flair, MSC ships offer an upscale atmosphere, stunning modern design, and exceptional value — a refreshing alternative to the big American lines.",
    ships: [
      {
        ship: "MSC Seashore",
        badge: "🌟 Flagship at Galveston",
        destinations: "7-Night Western Caribbean — Cozumel, Roatán & Costa Maya",
        desc:
          "MSC Seashore is one of the most beautiful ships sailing from Galveston. Launched in 2021, her sleek modern design maximizes ocean views with a revolutionary hull that brings the sea closer to guests than any ship before it. The MSC Waterpark features thrilling slides, the Forest Aqua Park offers treetop-style water fun, and the indoor/outdoor promenade runs along the ship's edge over the water. With 12 dining venues, a world-class spa, and a lively casino, MSC Seashore delivers a sophisticated cruise experience at a remarkable price.",
        seaPay: true,
      },
    ],
  },
  {
    name: "Disney Cruise Line",
    color: "from-yellow-400 to-orange-500",
    emoji: "✨",
    description:
      "Disney Cruise Line sails from Galveston and delivers the most magical vacation at sea — bar none. Every detail, from the food to the entertainment to the staff, is designed to create memories that last a lifetime. Whether you're 4 or 74, a Disney cruise from Galveston is an experience unlike anything else on the water.",
    ships: [
      {
        ship: "Disney Wonder",
        badge: "⚓ Primary Galveston Ship",
        destinations: "Western Caribbean — Key West, Grand Cayman & Cozumel",
        desc:
          "Disney Wonder is the primary Disney ship homeported in Galveston — a classic ship that's been lovingly updated and remains one of the most beloved in the fleet. Signature rotational dining, a full lineup of Broadway-caliber shows, the thrilling AquaDunk waterslide, and dedicated spaces for every age group make Wonder the gold standard for family cruising from Texas.",
        seaPay: true,
      },
      {
        ship: "Disney Magic",
        badge: "Seasonal",
        destinations: "Bahamas & Caribbean — Select Sailings",
        desc:
          "The original Disney cruise ship — the one that started it all — sails select seasonal itineraries from Galveston. Disney Magic features the AquaDunk waterslide, the adults-only District 97 lounge, and the Rapunzel-themed Royal Court restaurant. Same Disney magic, same impeccable service, same Broadway shows — in the ship that launched a legend.",
        seaPay: false,
      },
    ],
    onBoard: [
      {
        icon: "🍽️",
        title: "Rotational Dining — A Disney Original",
        desc: "Disney invented rotational dining and it remains one of the most beloved features at sea. Each night of your cruise you dine at a different themed restaurant — and your servers rotate with you so they get to know your family. On Disney Wonder from Galveston: Triton's (elegant under-the-sea), Animator's Palate (a living, animated dining room), and Tiana's Place (New Orleans jazz and soul food inspired by The Princess and the Frog).",
      },
      {
        icon: "🎭",
        title: "Broadway-Caliber Live Shows Every Night",
        desc: "Disney Cruise Line produces original Broadway-style productions that rival anything you'd see on land. The Walt Disney Theatre hosts full-scale musicals with professional performers, stunning costumes, and elaborate sets — new shows each night of the voyage. Past productions include Believe, The Golden Mickeys, and Disney Dreams — An Enchanted Classic.",
      },
      {
        icon: "🐭",
        title: "Character Meet & Greets — On the Ship",
        desc: "Mickey, Minnie, Donald, Goofy, Disney princesses, Marvel heroes, and Star Wars characters all appear on board for meet-and-greets, deck parties, and surprise pop-ups throughout the voyage. Unlike theme parks, wait times are short and encounters feel personal. Every character appearance on a Disney cruise is a genuine moment — not a rushed photo op.",
      },
      {
        icon: "🧒",
        title: "Kids' Clubs for Every Age (3–17)",
        desc: "Disney's age-specific kids' clubs are the best at sea — staffed by trained counselors and open late so parents can actually enjoy adult time. Oceaneer Club (ages 3–10) features themed labs including Marvel's Avengers Academy and Star Wars: Cargo Bay. Edge (ages 11–14) is a tween-exclusive hangout. Vibe (ages 14–17) is an adults-only-style space for teens with their own pool deck access.",
      },
      {
        icon: "🍸",
        title: "Adults-Only Spaces (Yes, Really)",
        desc: "Disney Cruise Line has some of the best adult spaces at sea. District 97 is a sophisticated cocktail lounge with live music. Skyline Bar offers a virtual panoramic view of world cities at dusk. The Tube is a British-pub-themed bar. Senses Spa & Salon is a full-service luxury spa with exclusive treatments. After the kids are tucked in at the clubs, the ship is yours.",
      },
      {
        icon: "🎬",
        title: "Buena Vista Theatre — First-Run Movies at Sea",
        desc: "Every Disney ship features a real movie theater — the Buena Vista Theatre — that shows first-run Disney, Pixar, Marvel, and Star Wars films throughout the voyage. Sometimes Disney films premiere on the ship before they hit theaters. Popcorn, comfortable seats, and the biggest screen at sea make movie nights on a Disney cruise genuinely special.",
      },
      {
        icon: "🌙",
        title: "Pirate Night — A Disney Cruise Tradition",
        desc: "Every sailing includes Pirate Night — one of the most anticipated events of any Disney cruise. Guests don pirate costumes, enjoy a special deck party with Jack Sparrow, and watch a spectacular fireworks show fired from the ship at sea (Disney is one of only two cruise lines permitted to do this). It's a once-in-a-lifetime moment that families talk about for years.",
      },
      {
        icon: "🏝️",
        title: "Castaway Cay — Disney's Private Island",
        desc: "Many Galveston sailings include a stop at Castaway Cay, Disney's legendary private island in the Bahamas. Unlike other cruise line islands, Castaway Cay is designed so guests can walk directly off the ship — no tenders needed. Disney characters roam the island, the snorkel trail is one of the best in the Bahamas, and the adults-only Serenity Bay beach is a paradise within a paradise.",
      },
    ],
  },
];

const portFacts = [
  { icon: "📍", title: "Location", value: "2502 Harborside Dr, Galveston, TX 77550" },
  { icon: "🅿️", title: "Parking", value: "On-site parking available at the terminal" },
  { icon: "🚗", title: "Drive Time", value: "~50 miles from Houston — about 1 hour" },
  { icon: "🚢", title: "Terminals", value: "Terminal 1, 2, and the Cruise Terminal 25" },
  { icon: "📅", title: "Year-Round", value: "Ships depart every week of the year" },
  { icon: "🛳️", title: "Volume", value: "One of the busiest cruise ports in the US" },
];

export default function ShipsFromGalvestonPage() {
  return (
    <div className="bg-[#05070d]">
      {/* Header */}
      <section className="bg-[#05070d] text-white relative overflow-hidden py-16">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 left-1/2 -translate-x-1/2 -top-32 opacity-[0.14]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Port of Galveston, Texas"}</div>
          <h1 className="text-5xl font-extrabold uppercase tracking-[-0.01em] text-white mb-4">
            Ships from Galveston
          </h1>
          <p className="text-white/55 text-xl max-w-2xl mx-auto">
            Galveston is one of America&apos;s top cruise ports. Drive in and
            park, or fly into Houston (IAH/HOU) and we&apos;ll arrange your
            transfer — all major cruise lines depart from right here in Texas.
          </p>
        </div>
      </section>

      {/* Port Facts */}
      <section className="bg-[#05070d] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] text-white text-center mb-8">
            Port of Galveston — Quick Facts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {portFacts.map((fact) => (
              <div
                key={fact.title}
                className="bg-[#05070d] p-7 text-center hover:bg-white/[0.03] transition-colors"
              >
                <div className="font-bold text-white text-xs uppercase tracking-wide mb-1">
                  {fact.title}
                </div>
                <div className="text-white/45 text-xs leading-snug">
                  {fact.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Start in Galveston */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white mb-3">
            Why Start Your Cruise in Galveston?
          </h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Millions of Texans and Southerners choose Galveston over Miami or Fort Lauderdale — and for good reason.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mb-10">
          {[
            {
              icon: "✈️",
              title: "Easy to Reach",
              body: "Many guests drive to the port and park, while those farther out fly into Houston (IAH/HOU) and we arrange the transfer. Either way, getting to your ship is simple.",
            },
            {
              icon: "🚗",
              title: "Drive From Anywhere in Texas",
              body: "Houston is 50 miles away. Dallas, San Antonio, and Austin are all within 4–5 hours. Oklahoma City is under 6 hours. Galveston is the drive-to cruise capital of the South.",
            },
            {
              icon: "🌅",
              title: "Arrive Early, Stay Longer",
              body: "Come the night before and explore The Historic Strand District, Seawall Boulevard, and Galveston's world-famous beaches. Make it a full vacation before you even board.",
            },
            {
              icon: "🌡️",
              title: "Year-Round Warm Weather",
              body: "The Gulf Coast stays warm most of the year, and your ship sails straight into the Caribbean sunshine — no cold-weather layovers between you and paradise.",
            },
            {
              icon: "🛳️",
              title: "One of America's Busiest Ports",
              body: "Galveston is a top 3 U.S. cruise port. Ships depart every single week of the year, giving you maximum flexibility on dates, lengths, and cruise lines.",
            },
            {
              icon: "💵",
              title: "More Money for Your Vacation",
              body: "When you drive instead of fly, that's money saved on flights, airport parking, and checked bags — money you can spend on excursions, upgrades, and drinks at sea.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#05070d] p-7 hover:bg-white/[0.03] transition-colors"
            >
              <h3 className="font-bold uppercase tracking-[-0.01em] text-white text-lg mb-2">{item.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-8 text-white text-center">
          <p className="text-2xl font-extrabold uppercase tracking-[-0.01em] mb-2">
            50+ million people live within a day&apos;s drive of Galveston.
          </p>
          <p className="text-white/55 text-lg">
            Your cruise starts the moment you leave your driveway — not at an airport gate.
          </p>
        </div>
      </section>

      {/* Cruise Lines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white mb-3">
            Cruise Lines at the Port of Galveston
          </h2>
          <p className="text-white/55 text-lg">
            Major cruise lines call Galveston home — including some of the largest ships ever built.
            Here&apos;s what sails from your Texas backyard.
          </p>
        </div>

        <div className="space-y-10">
          {cruiseLines.map((line) => (
            <div
              key={line.name}
              className="bg-[#0b1020] rounded-2xl overflow-hidden border border-white/10"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-[#0a1f44] text-white p-6 flex items-center gap-4">
                <div className="absolute inset-0 grid-bg opacity-40" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-extrabold uppercase tracking-[-0.01em]">{line.name}</h3>
                  <p className="text-white/55 text-sm mt-1 max-w-2xl">{line.description}</p>
                </div>
              </div>
              <div className="p-6">
                <h4 className="label-mono text-[11px] uppercase text-sky-400/80 mb-5">{"// Ships & Itineraries from Galveston"}</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {line.ships.map((s) => (
                    <div
                      key={s.ship}
                      className="bg-[#05070d] rounded-xl p-5 border border-white/10"
                    >
                      <ShipImage
                        ship={s.ship}
                        className="h-32 -mx-5 -mt-5 mb-4 rounded-t-xl"
                      />
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <span className="font-extrabold uppercase tracking-[-0.01em] text-white text-base">
                              {s.ship}
                            </span>
                            {s.badge && (
                              <span className="text-xs font-bold bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                                {s.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-sky-400 text-xs font-semibold">
                            {s.destinations}
                          </div>
                          {getTerminal(s.ship) && (
                            <div className="label-mono text-[10px] uppercase text-white/45 mt-1.5">
                              Embark · enter at {getTerminal(s.ship)!.entryStreet}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-white/55 text-sm leading-relaxed mb-4">
                        {s.desc}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <Link
                          href={`/sailings?ship=${encodeURIComponent(s.ship)}`}
                          className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-white/90 text-xs font-semibold uppercase tracking-wider px-5 py-2 rounded-full transition-all"
                        >
                          See Sailings & Pricing →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {"onBoard" in line && Array.isArray(line.onBoard) && (
                  <div className="mt-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-px flex-1 bg-white/10" />
                      <h4 className="label-mono text-[11px] uppercase text-sky-400/80 whitespace-nowrap">{"// The Disney Experience On Board"}</h4>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {line.onBoard.map((exp: { icon: string; title: string; desc: string }) => (
                        <div
                          key={exp.title}
                          className="bg-[#05070d] border border-white/10 rounded-xl p-5"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-extrabold uppercase tracking-[-0.01em] text-white text-sm">{exp.title}</h5>
                          </div>
                          <p className="text-white/55 text-sm leading-relaxed">{exp.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold uppercase tracking-[-0.01em] text-white mb-3">
            Compare Cruise Lines from Galveston
          </h2>
          <p className="text-white/55 text-lg">
            Not sure which line is right for you? Here&apos;s a quick side-by-side.
          </p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full bg-[#0b1020] text-sm">
            <thead>
              <tr className="bg-[#05070d] text-white">
                <th className="px-5 py-4 text-left font-bold">Feature</th>
                <th className="px-5 py-4 text-center font-bold">Carnival</th>
                <th className="px-5 py-4 text-center font-bold">Royal Caribbean</th>
                <th className="px-5 py-4 text-center font-bold">Norwegian</th>
                <th className="px-5 py-4 text-center font-bold">MSC</th>
                <th className="px-5 py-4 text-center font-bold">Disney</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  feature: "Family Friendly",
                  carnival: "✅",
                  royal: "✅",
                  ncl: "✅",
                  msc: "✅",
                  disney: "✅ Best",
                },
                {
                  feature: "Nightlife / Adults",
                  carnival: "✅ Very Lively",
                  royal: "✅",
                  ncl: "✅ Party",
                  msc: "✅ European Vibe",
                  disney: "⚠️ Mild",
                },
                {
                  feature: "Private Island",
                  carnival: "Half Moon Cay",
                  royal: "CocoCay",
                  ncl: "Great Stirrup Cay",
                  msc: "Ocean Cay",
                  disney: "Castaway Cay",
                },
                {
                  feature: "Galveston Year-Round?",
                  carnival: "✅ Yes",
                  royal: "✅ Yes",
                  ncl: "✅ Yes",
                  msc: "✅ Yes",
                  disney: "Seasonal",
                },
                {
                  feature: "Budget-Friendly",
                  carnival: "✅ Best Value",
                  royal: "✅",
                  ncl: "✅",
                  msc: "✅ Great Value",
                  disney: "⚠️ Premium",
                },
                {
                  feature: "Best For",
                  carnival: "Fun & Budget",
                  royal: "Thrill-Seekers",
                  ncl: "Freestyle Dining",
                  msc: "European Style",
                  disney: "Young Families",
                },
              ].map((row, i) => (
                <tr
                  key={row.feature}
                  className={i % 2 === 0 ? "bg-[#0b1020]" : "bg-[#05070d]"}
                >
                  <td className="px-5 py-4 font-semibold text-white border-b border-white/10">
                    {row.feature}
                  </td>
                  <td className="px-5 py-4 text-center text-white/55 border-b border-white/10">
                    {row.carnival}
                  </td>
                  <td className="px-5 py-4 text-center text-white/55 border-b border-white/10">
                    {row.royal}
                  </td>
                  <td className="px-5 py-4 text-center text-white/55 border-b border-white/10">
                    {row.ncl}
                  </td>
                  <td className="px-5 py-4 text-center text-white/55 border-b border-white/10">
                    {row.msc}
                  </td>
                  <td className="px-5 py-4 text-center text-white/55 border-b border-white/10">
                    {row.disney}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-white/45 text-sm mt-4">
          Not sure which is right for you? Contact us — we&apos;ll match you with the perfect cruise line.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-[#05070d] text-white relative overflow-hidden py-14">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 left-1/2 -translate-x-1/2 -top-32 opacity-[0.14]" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-3">
            Ready to Book Your Galveston Cruise?
          </h2>
          <p className="text-white/55 mb-6">
            Our specialists know every ship, every itinerary, and every sailing
            from the Port of Galveston. Let us find the perfect cruise for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/deals"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              See Current Deals
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
