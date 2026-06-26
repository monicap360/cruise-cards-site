// ── News & Cruise Updates — editorial content for the Experience Center ──────
// SEO content engine for "Cruises from Galveston." Posts are accurate, useful,
// and specific to sailing round-trip from the Port of Galveston. Keep prices
// non-committal — quote live fares by phone at (409) 632-2106.

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: string;
  excerpt: string;
  readMins: number;
  body: string[]; // array of paragraph strings
};

const RAW_POSTS: Post[] = [
  {
    slug: "perfect-day-cococay-from-galveston",
    title: "Perfect Day at CocoCay Is Now Sailing from Galveston",
    date: "2026-05-18",
    category: "Royal Caribbean",
    excerpt:
      "Liberty of the Seas is running Western Caribbean and Bahamas itineraries from Galveston that stop at Royal Caribbean's private island — here's what that means for Texas cruisers.",
    readMins: 5,
    body: [
      "For years, the only way most Texans could reach Perfect Day at CocoCay — Royal Caribbean's award-winning private island in the Bahamas — was to fly to Florida first. That changed when Liberty of the Seas repositioned to Galveston and began running itineraries that call at CocoCay, putting the line's most talked-about destination within a short drive of Houston and the rest of the state.",
      "Perfect Day at CocoCay sits in the Berry Islands of the Bahamas. The island is built around its complimentary attractions: Oasis Lagoon, the largest freshwater pool in the Caribbean; Chill Island with its calm, swimmable beaches; and a sprawling free lunch buffet that's included in your cruise fare. You can have a full, satisfying island day without spending an extra dollar.",
      "If you want to go bigger, the paid add-ons are the headliners. Thrill Waterpark packs in Daredevil's Peak — the tallest waterslide in North America — plus a wave pool and dozens of slides. The Up, Up and Away helium balloon lifts you 450 feet for a panoramic view, and Coco Beach Club offers an over-the-water cabana experience. These sell out, so book them through your cruise planner well before sail day.",
      "From Galveston, CocoCay typically appears on longer Bahamas-leaning sailings rather than the short 4- and 5-night Western Caribbean runs to Cozumel and Costa Maya. Itineraries and the ships assigned to Galveston shift by season, so confirm that CocoCay is actually on the specific departure date you're looking at before you book.",
      "A few practical notes for first-timers: the island is a docked port, not a tender stop, which means you simply walk off the ship — easy for families, strollers, and anyone with mobility needs. Bring reef-safe sunscreen, water shoes for the beaches, and your SeaPass card, which is how you'll pay for anything on the island.",
      "Because CocoCay sailings out of Galveston are still relatively new and in high demand, the best cabins and the marquee island experiences go fast. If a Perfect Day at CocoCay cruise is on your list, talk to a Galveston specialist early — call (409) 632-2106 — and we'll line up the sailing, the cabin, and the island add-ons together.",
    ],
  },
  {
    slug: "carnival-celebration-key-what-to-know",
    title: "Carnival's Celebration Key: What to Know",
    date: "2026-04-22",
    category: "Carnival",
    excerpt:
      "Carnival's brand-new private destination on Grand Bahama is reshaping itineraries — including some that depart right here from Galveston. Here's the rundown.",
    readMins: 6,
    body: [
      "Celebration Key is Carnival Cruise Line's exclusive port destination on Grand Bahama Island, which opened in 2025 as the largest investment Carnival has ever made in a single destination. Built from the ground up specifically for Carnival guests, it's designed to be a full day's worth of beach, pool, and play without ever boarding a tender — ships dock right at the pier.",
      "The destination is organized into themed areas Carnival calls 'portals.' Paradise Plaza is the welcoming hub, while Calypso Lagoon leans into a lively, music-and-bar atmosphere with the largest swim-up bar in the Caribbean. Starfish Lagoon is the family-friendly zone with calm water and shaded spots, and Pearl Cove Beach Club is the adults-oriented, premium ticketed area with an infinity pool overlooking the water.",
      "A big part of the appeal is what's included. Access to the beaches, the freshwater lagoon areas, and a lot of the seating comes with your cruise — you don't have to buy a single excursion to have a great day. Paid extras include private cabanas, the Pearl Cove Beach Club, and a slate of excursions, all bookable in advance through your cruise planner.",
      "For Galveston cruisers, the key question is itinerary placement. Celebration Key is on Grand Bahama, so it shows up on eastern-leaning Bahamas itineraries rather than the classic Western Caribbean runs to Cozumel, Costa Maya, and Mahogany Bay that dominate Galveston schedules. As Carnival rotates ships and seasons, Celebration Key has begun appearing on select longer sailings; always verify it's listed on your exact departure date.",
      "Because the pier accommodates large ships docking directly, getting on and off is straightforward — good news for families with young kids, grandparents, and anyone who'd rather skip the tender-boat shuffle. Plan to bring reef-safe sunscreen and water shoes, and remember everything on the island is charged to your Sail & Sign card.",
      "Carnival sails several ships from Galveston, including Carnival Jubilee and Carnival Breeze, and the lineup evolves. If you specifically want Celebration Key on your sailing, that narrows the options — so let a Galveston specialist match you to the right ship and date. Call (409) 632-2106 and we'll sort out the itinerary, cabin, and any cabana or beach club add-ons.",
    ],
  },
  {
    slug: "galveston-cruise-parking-on-port-vs-off-port",
    title: "Galveston Cruise Parking: On-Port vs Off-Port",
    date: "2026-03-30",
    category: "Galveston Tips",
    excerpt:
      "Where you leave your car on sail day affects your budget, your walk to the terminal, and your stress level. Here's an honest comparison for first-timers.",
    readMins: 6,
    body: [
      "Parking is one of the first real decisions you'll make about a Galveston cruise, and it genuinely matters — the right choice can save you money and a stressful morning. Broadly, you're choosing between official on-port parking operated through the Port of Galveston and the many privately run off-port lots scattered nearby.",
      "On-port parking is the most convenient option. The lots sit within walking distance of the cruise terminals, so you park, grab your bags, and walk to the building. It's run through the Port of Galveston's official parking program, and you'll generally want to reserve a spot online in advance — sail days sell out, and pre-booking is typically cheaper than paying the drive-up rate. The trade-off is that it's usually the priciest option and the open-air lots leave your car exposed to the coastal weather.",
      "Off-port lots are the budget-friendly alternative. These private operators sit a few minutes from the terminals and run shuttles that pick you up at your car and drop you at the cruise building, then reverse the trip when you return. Many offer covered or indoor parking, which is a real perk on the Gulf Coast where sun, salt air, and the occasional hailstorm are facts of life. The trade-off is the shuttle: you're on someone else's schedule, and on a busy morning there can be a short wait.",
      "When you're comparing prices, compare the total for your full number of nights, not the nightly rate — a lot that looks cheaper per day can flip once you add it all up. Also check what's actually included: some off-port lots build the shuttle, tips, and in-and-out access into the price, while others tack them on.",
      "A few things to watch regardless of where you park. Terminals in Galveston are spread out — Carnival Jubilee, Carnival Breeze, and the Royal Caribbean and other terminals each have their own entrance, sometimes blocks apart — so confirm which building your ship uses and make sure your parking choice serves it. Arrive with a cushion of time; I-45 into Galveston backs up on Friday evenings and Saturday mornings.",
      "Our honest take: if walking up to the terminal and skipping a shuttle is worth the premium to you, book on-port early. If you'd rather save money and like the idea of covered parking, a reputable off-port lot is a great call. Either way, reserve ahead in peak season.",
      "If you'd rather not think about it at all, ask us about bundling parking with a pre-cruise hotel night in a Park & Embark package — you sleep near the port, leave the car, and start sail day relaxed. Call a Galveston specialist at (409) 632-2106 and we'll set it up.",
    ],
  },
  {
    slug: "passport-or-birth-certificate-closed-loop-rules",
    title: "Passport or Birth Certificate? Closed-Loop Cruise Rules",
    date: "2026-03-12",
    category: "Travel Documents",
    excerpt:
      "Most Galveston cruises are 'closed-loop,' which changes what documents U.S. citizens need. Here's exactly what to bring — and why a passport is still the smarter choice.",
    readMins: 5,
    body: [
      "One of the most common questions we get is whether you need a passport to cruise from Galveston. The short answer for U.S. citizens on a typical Galveston sailing is: not strictly — but you should strongly consider getting one anyway. Here's how the rules actually work.",
      "Nearly every cruise out of Galveston is a 'closed-loop' cruise, meaning it departs from and returns to the same U.S. port — you leave Galveston and you come back to Galveston. Under the Western Hemisphere Travel Initiative, U.S. citizens on a closed-loop cruise may re-enter the country using a government-issued birth certificate (an original or certified copy) together with a government-issued photo ID, such as a driver's license. A passport is not legally required for that specific scenario.",
      "There are important caveats. Children under 16 can typically sail on a closed-loop cruise with just a birth certificate. Adults need that birth certificate plus the photo ID — a hospital 'keepsake' certificate doesn't count; it has to be issued by a government vital records office. Names need to match across your documents and your booking, which trips up a lot of recently married travelers.",
      "Non-U.S. citizens are a different story. Lawful permanent residents need their Permanent Resident (green) card, and citizens of other countries generally need a valid passport and, depending on nationality, a visa. If anyone in your party isn't a U.S. citizen, confirm their specific requirements well before sail day.",
      "Here's why we recommend a passport even when it isn't required: if you have a medical emergency, miss the ship in a foreign port, or the itinerary changes, you may need to fly home from Mexico or another country — and you cannot board an international flight back to the U.S. without a passport. A birth certificate is fine for the cruise itself but useless at an international airport. For the cost and a few weeks of processing, a passport buys you a real safety net.",
      "Bottom line: U.S. citizens can sail a round-trip Galveston cruise on a birth certificate plus photo ID, but a passport is the safer, more flexible choice — and it's required for anyone flying. If you're unsure what your specific party needs, call a Galveston specialist at (409) 632-2106 and we'll walk through it before you book.",
    ],
  },
  {
    slug: "best-time-to-book-a-cruise-from-galveston",
    title: "Best Time to Book a Cruise from Galveston",
    date: "2026-02-20",
    category: "Booking Strategy",
    excerpt:
      "Is there really a perfect moment to book? Sort of. Here's how timing, seasons, and the famous 'Wave Season' actually affect your Galveston cruise fare.",
    readMins: 6,
    body: [
      "Everyone wants the secret window where cruise fares hit rock bottom. The honest truth is that pricing is dynamic — it moves with demand, cabin availability, and the cruise line's goals for each sailing — so there's no single magic date. But there are clear patterns, and understanding them helps you book with confidence instead of second-guessing.",
      "The biggest one is Wave Season, the industry's promotional period that runs roughly from January through March. This is when cruise lines roll out their most aggressive perks — onboard credit, reduced deposits, free or discounted drink and Wi-Fi packages, and 'kids sail free' style offers. Wave Season is less about the lowest sticker price and more about getting the most value packed into the fare, which often makes it the best overall time to lock in a Galveston cruise.",
      "For timing within the year, booking several months to a year ahead tends to give you the best combination of choice and price. Early bookings get you the widest selection of cabins and the best spots — and cruise lines often protect early bookers, so if the price later drops you can frequently request the lower rate or added perks before final payment. The closer you get to sail day, the thinner the inventory.",
      "There is a last-minute lane, but it's a gamble. If a sailing hasn't filled, prices can fall sharply in the final weeks. The catch is that you take whatever cabins are left, airfare and hotels near the port are pricier on short notice, and popular dates simply won't have deals. Last-minute works best if you're flexible on dates, ship, and cabin, and you live close enough to drive to Galveston.",
      "Season matters too. Summer and the winter holidays are peak demand because that's when families can travel, so fares run higher. The shoulder months — late spring and the fall — often bring softer pricing. Keep in mind that Atlantic hurricane season runs June through November; itineraries can be adjusted for weather, and many travelers find peace of mind worth the cost of travel protection during those months.",
      "Our practical advice: if you know you want to cruise, book early during or near Wave Season to capture both selection and perks, and lean on your agency to monitor the fare so you can grab any price drop before final payment. If you're flexible and patient, keep an eye on last-minute deals.",
      "Either way, you don't have to track all of this yourself — that's our job. Call a Galveston specialist at (409) 632-2106 and we'll tell you whether to book now or wait, and watch the price for you after you do.",
    ],
  },
];

// Posts sorted newest-first by date.
export const POSTS: Post[] = [...RAW_POSTS].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
