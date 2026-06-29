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
  {
    slug: "galveston-cruise-questions-answered",
    title: "Your Top Galveston Cruise Questions, Answered",
    date: "2026-06-26",
    category: "Community",
    excerpt:
      "Parking, passports, what's included, deposits, kids, drive vs fly — we rounded up the questions we hear most at our Galveston Experience Center and answered them plainly.",
    readMins: 6,
    body: [
      "We talk to Texas cruisers every single day at our walk-in Cruise Experience Center on Winnie Street, and the same handful of questions come up again and again. Rather than make you call to ask the basics, we collected the most common ones here and answered them as honestly and plainly as we can. If your question isn't covered, that's exactly what the phone is for — (409) 632-2106.",
      "\"Where do I park, and how much is it?\" You have two broad choices: official parking through the Port of Galveston, which is closest to the terminals, or one of the private off-port lots nearby that run shuttles to the cruise building. On-port is the most convenient and usually the priciest; off-port lots are budget-friendly and many offer covered parking. Either way, reserve in advance for peak weekends, and compare the total cost for your full number of nights rather than the nightly rate.",
      "\"Do I need a passport?\" For U.S. citizens on a typical round-trip Galveston sailing — which is a 'closed-loop' cruise — you can usually sail with a government-issued birth certificate plus a photo ID instead of a passport. That said, we recommend a passport anyway: if you ever need to fly home from a foreign port due to an emergency or a missed ship, you cannot board an international flight without one. Anyone flying into Houston to reach the port also needs valid ID for that flight.",
      "\"What's actually included in the price?\" Your cruise fare covers your cabin, most of the dining (main dining room, buffet, and several casual spots), the big production shows and most onboard entertainment, the pools, the gym, and getting from port to port. What's usually extra: alcohol and specialty coffees, specialty restaurants, shore excursions, spa treatments, Wi-Fi, gratuities, and photos. Drink and Wi-Fi packages can bundle some of that — ask us whether one pencils out for your trip.",
      "\"Should I drive or fly?\" If you're within reasonable driving distance, most Galveston cruisers simply drive in and park — it's the easiest and often cheapest path. If you're farther out, you can fly into Houston (either Bush Intercontinental/IAH or Hobby/HOU) and we'll arrange a transfer down to the port. We'll help you weigh the drive against airfare plus transfers so you pick the option that actually saves you money and hassle.",
      "\"How do I pay, and when?\" We don't charge cards online. To hold your cabin you place a deposit, and then you either mail a check to our office at 3501 Winnie St, Galveston, TX 77550, or pay the cruise line directly — whichever you prefer. The deposit locks in your cabin and price, and the balance is typically due around 120 days before you sail. We'll give you the exact final-payment date for your specific booking in writing.",
      "\"Is a cruise good for kids?\" Galveston is one of the most family-friendly cruise ports in the country, and the lines we book — Carnival, Royal Caribbean, MSC, Norwegian, and Disney — all run age-based kids' clubs, pools, and family activities. Closed-loop rules also make documents simpler for children under 16. Tell us the ages in your party and we'll point you toward the ships and itineraries that fit your family best.",
      "Still have a question we didn't cover? That's normal — every party is a little different. Search live sailings at /find to see what's available, or call a Galveston specialist at (409) 632-2106 and ask us anything. You can also stop by the Experience Center on Winnie Street and we'll walk you through it in person.",
    ],
  },
  {
    slug: "galveston-park-stay-cruise-hotels",
    title: "Galveston Park, Stay & Cruise Hotels: Which One Is Right for You?",
    date: "2026-06-20",
    category: "Hotels & Parking",
    excerpt:
      "A pre-cruise hotel night turns a stressful drive-in morning into a relaxed start. Here's a look at Galveston's main park-stay-cruise hotels and how the packages work.",
    readMins: 6,
    body: [
      "If you're driving any real distance to Galveston, spending the night before your cruise near the port is one of the smartest moves you can make. A 'park, stay & cruise' package bundles a hotel room with parking for the length of your sailing and, at many properties, a shuttle to the terminal — so you arrive the day before, sleep well, leave your car at the hotel, and start sail day calm instead of frazzled from a pre-dawn drive. Here's a rundown of the hotels Galveston cruisers ask about most.",
      "Hilton Galveston Island Resort sits right on the seawall with Gulf views, a beachfront pool, and a full-service feel. It's a popular pick for travelers who want their pre-cruise night to feel like the start of the vacation rather than just a place to crash. Park-stay-cruise rates here typically include your room plus parking for the duration of the cruise, with a shuttle option to the terminal.",
      "Holiday Inn Resort Galveston (on the seawall) is another beachfront option with a resort atmosphere, pools, and easy access to Galveston's restaurants and attractions. It tends to appeal to families who want a little extra to do the afternoon and evening before they sail. As with the others, confirm exactly how many days of parking the package covers and whether shuttle service is included or extra.",
      "Comfort Suites Galveston is a strong value-focused choice. It's a comfortable, no-frills base with free breakfast, and its park-stay-cruise packages are popular with cruisers who'd rather put their budget toward the sailing itself. SpringHill Suites by Marriott Galveston Island offers a step up in finish with suite-style rooms, and is well liked by couples and small families who want a bit more space the night before.",
      "Moody Gardens Hotel is a destination in its own right, attached to the famous Moody Gardens pyramids, aquarium, and rainforest. If you're traveling with kids and arriving a day early anyway, it can turn the pre-cruise night into a genuine mini-vacation. It sits a bit farther from the immediate port area, so pay attention to the shuttle or transfer details when you compare.",
      "When you're choosing among these, a few things matter more than the nightly rate. First, total parking days included — make sure the package actually covers your full sailing length, not just one night. Second, the shuttle: is it included, how often does it run, and does it serve your ship's specific terminal? Third, location relative to the port and to anything you'd like to do the night before. We're happy to lay these side by side for your dates.",
      "It's worth knowing that hotel availability and package pricing in Galveston move with the cruise calendar — busy sail weekends fill the seawall hotels fast. If a specific property matters to you, book the room early and let us coordinate it with your cruise so the timing lines up cleanly. We can also help match the right hotel to your party size and budget.",
      "Want help pairing a pre-cruise hotel with your sailing? Search available cruises at /find, then call a Galveston specialist at (409) 632-2106 and we'll line up the room, the parking, and the shuttle so everything's set before you ever leave home.",
    ],
  },
  {
    slug: "galveston-cruise-parking-compared",
    title: "Where to Park for Your Galveston Cruise: Every Option Compared",
    date: "2026-06-14",
    category: "Hotels & Parking",
    excerpt:
      "From the Port of Galveston's official lots to the many third-party operators nearby, here's a clear comparison of your cruise parking choices and how to pick the right one.",
    readMins: 6,
    body: [
      "Parking is one of the first logistics you'll sort out for a Galveston cruise, and it has a real effect on your budget, your walk to the terminal, and how your sail-day morning feels. The choices fall into two camps: official parking run through the Port of Galveston, and the cluster of privately operated third-party lots a few minutes away. Both work well — the right pick depends on what you value most.",
      "Official Port of Galveston parking sits closest to the cruise terminals, within walking distance of the buildings. You reserve a spot in advance through the port's parking program, and pre-booking is generally cheaper than the drive-up rate. The upside is simplicity: park, grab your bags, and walk to the terminal with no shuttle in the mix. The trade-offs are that it's usually the most expensive option and the lots are open-air, so your car sits in the coastal sun and weather.",
      "Third-party lots are the budget-friendly alternative, and Galveston has several well-known operators. Names cruisers ask about include Lighthouse Parking, Patriot Cruise Parking, Port Parking, Discount Cruise Parking, Park 2 Cruise, and Galveston VIP. They sit a short drive from the terminals and run shuttles that collect you at your car and drop you at the cruise building, then bring you back when you return.",
      "The appeal of the off-port lots is twofold: lower prices and, at several of them, covered or indoor parking — a genuine perk on the Gulf Coast where sun, salt air, and the occasional hailstorm take a toll on a car left in the open. The trade-off is the shuttle. You're on the operator's schedule rather than your own, and on a busy sail morning there can be a short wait at pickup or return.",
      "To compare fairly, look past the nightly rate and add up the total for your full number of nights — a lot that looks cheaper per day can lose its edge once you total it. Then check what's actually bundled in: some operators include the shuttle, tips, and in-and-out access in the headline price while others add them on. Read the cancellation terms too, since plans change.",
      "One Galveston-specific catch: the terminals are spread out, and different ships use different buildings with separate entrances, sometimes blocks apart. Before you book any lot, confirm which terminal your ship uses and make sure your parking choice — official or third-party — actually serves it. And give yourself a time cushion, because I-45 into Galveston backs up on Friday evenings and Saturday mornings.",
      "Our honest take: if skipping the shuttle and walking straight up to the terminal is worth a premium to you, reserve official port parking early. If you'd rather save money and like covered parking, a reputable third-party lot is an excellent call. In peak season, book whichever you choose well ahead — the good spots sell out.",
      "Not sure which fits your trip? You can also sidestep the decision entirely by parking at a pre-cruise hotel as part of a park-stay-cruise package. Search sailings at /find or call a Galveston specialist at (409) 632-2106, and we'll help you weigh the options and lock in the right one.",
    ],
  },
  {
    slug: "best-months-to-cruise-from-galveston",
    title: "The Best Months to Cruise from Galveston",
    date: "2026-06-08",
    category: "Galveston Tips",
    excerpt:
      "Summer crowds, fall value, holiday demand, spring break, and hurricane season — here's how the calendar shapes a Galveston cruise so you can pick the month that fits you.",
    readMins: 5,
    body: [
      "There's no single 'best' month to cruise from Galveston — the right time depends on whether you're chasing value, calm weather, smaller crowds, or a holiday at sea. What helps is understanding how the calendar behaves, because Galveston's cruise season has clear rhythms. Below is a plain-language guide to the trade-offs each part of the year brings, in general terms rather than specific prices.",
      "Summer is the peak. June through August is when families can travel, so ships are full, the kids' clubs are buzzing, and the energy onboard is high. The trade-off is that demand pushes fares toward their highest, and cabins on popular dates go early. If you need to sail in summer because of school schedules, book well ahead to protect both your price and your cabin choice.",
      "Fall — roughly late August through early November, outside the holidays — is often the sweet spot for value. With kids back in school, demand softens and fares tend to ease compared with summer. The weather is usually still warm and inviting in the Western Caribbean. The thing to keep in mind is hurricane season, which we'll come back to in a moment.",
      "The winter holidays are their own category. Thanksgiving, Christmas, and New Year's sailings are in high demand because they're a popular way for families to celebrate together, and they book up early. Expect a festive atmosphere onboard and firmer pricing. If a holiday cruise is your goal, treat it like a peak date and reserve far in advance.",
      "Spring brings spring break, a mini-peak in March that mirrors summer's family demand for a few concentrated weeks. Around it, the broader spring shoulder season can offer pleasant weather and softer demand. As always, the exact feel of any given week depends on how it lines up with school calendars across Texas and beyond.",
      "Now, hurricane season: the Atlantic season officially runs June through November, overlapping summer and fall. This isn't a reason to avoid cruising — itineraries are routinely and safely adjusted around weather, and cruise lines monitor storms closely. It does mean two things worth planning for: a port stop occasionally gets swapped, and many travelers feel better carrying travel protection during those months. We can explain how that works for your sailing.",
      "So which month is best? If you want value and don't have kids in school, look at fall. If you're traveling with a family, summer or spring break may be unavoidable — just book early. If you love the festive feel, holidays are worth the premium but demand the earliest booking of all. Tell us your priorities and we'll point you to the right window. Search sailings at /find or call a Galveston specialist at (409) 632-2106.",
    ],
  },
  {
    slug: "first-time-cruiser-guide-galveston",
    title: "First-Time Cruiser's Guide to Sailing from Galveston",
    date: "2026-06-04",
    category: "Guides",
    excerpt:
      "Never cruised before? Here's the whole journey — from booking and documents to arrival day, embarkation, packing, and what's included — written for first-timers sailing from Galveston.",
    readMins: 7,
    body: [
      "If you've never cruised, the first one can feel like a lot to figure out. The good news is that sailing from Galveston is about as beginner-friendly as cruising gets: it's a drive-in port for most Texans, the ships run well-worn Western Caribbean routes, and the lines we book — Carnival, Royal Caribbean, MSC, Norwegian, and Disney — are built to make first-timers comfortable. Here's the whole journey, start to finish.",
      "Start with booking. Pick a sailing that fits your dates, budget, and the vibe you want — a lively family ship, a more relaxed adults-leaning sailing, and so on. To hold a cabin you place a deposit, which locks in your price and room. We don't charge cards online; you either mail a check to our office at 3501 Winnie St, Galveston, TX 77550, or pay the cruise line directly. The balance is typically due around 120 days before you sail, and we'll give you the exact date in writing.",
      "Get your documents sorted early. For U.S. citizens on a round-trip Galveston cruise, you can usually sail with a certified birth certificate plus a government photo ID, though we recommend a passport for the flexibility it gives you in an emergency. Make sure names match exactly across your ID and your booking. If anyone in your party isn't a U.S. citizen, confirm their specific requirements well ahead of time — don't leave it to the last week.",
      "Decide how you'll get there. Most Galveston cruisers drive in and park, either at the official port lots or a nearby third-party lot with a shuttle. If you're flying, come into Houston — Bush Intercontinental (IAH) or Hobby (HOU) — and we'll arrange a transfer down to the port. Either way, consider arriving the day before and staying at a pre-cruise hotel; it removes the single biggest source of sail-day stress.",
      "Arrival day has a rhythm. You'll be assigned a check-in time window — stick to it, as it keeps the lines short. Bring your cruise documents, ID, and a credit card to register to your onboard account (everything aboard is cashless and charged to your room card). Hand your big bags to the porters outside the terminal; they'll deliver them to your stateroom later in the afternoon, so keep medications, documents, and anything you need right away in a carry-on.",
      "Embarkation is smoother than most people expect. You'll pass through security and check-in, get your room key card, and walk aboard — often straight into lunch at the buffet while your luggage catches up. Take a few minutes to learn the ship's layout and note where the muster station is for the required safety drill. Then the vacation actually begins: explore, grab a deck chair, and settle in.",
      "Packing comes down to a few essentials. Pack layers (ships run cold inside, warm on deck), swimwear, sunscreen, comfortable walking shoes, any required medications in original containers, and a few nicer outfits for the main dining room or an 'elegant' night. Check your specific line's dress guidance. Leave behind anything prohibited — irons, candles, and the like — which the cruise line will list for you.",
      "Finally, know what's included so you're not surprised. Your fare covers the cabin, most dining, the big shows and most entertainment, pools, and the gym. Extras typically include alcohol, specialty restaurants, shore excursions, spa, Wi-Fi, gratuities, and photos. A drink or Wi-Fi package can simplify the math for some travelers — ask us whether one makes sense for your trip.",
      "That's the whole arc of a first cruise from Galveston. It's normal to have questions, and walking through them once makes the whole thing click. Search sailings at /find, call a Galveston specialist at (409) 632-2106, or stop by our Experience Center at 3501 Winnie St — we love helping first-timers get it right.",
    ],
  },
  {
    slug: "holiday-cruises-from-galveston",
    title: "Thanksgiving & Holiday Cruises from Galveston: Why to Book Early",
    date: "2026-06-01",
    category: "Galveston Tips",
    excerpt:
      "Holiday sailings are some of the most in-demand dates of the year. Here's why Thanksgiving, Christmas, and New Year's cruises from Galveston fill up fast — and when to book.",
    readMins: 5,
    body: [
      "A cruise over the holidays has a particular magic to it: the ship is decked out, there's a festive buzz onboard, and instead of cooking and cleaning you're watching the Gulf roll by with the people you love. It's no surprise that Thanksgiving, Christmas, and New Year's sailings from Galveston are among the most sought-after dates on the calendar. The catch is simple — high demand means you have to plan ahead.",
      "Why do they fill so fast? The holidays are one of the few stretches when extended families can all get time off together, so multigenerational groups gravitate to them. A cruise solves the logistics of a big family gathering beautifully: one floating destination, meals handled, activities for every age, and grandparents and grandkids under one roof without anyone hosting. That combination makes holiday weeks a magnet for exactly the largest, hardest-to-coordinate bookings.",
      "Group and family travel is the heart of it. If you're trying to get several cabins near each other — say, three generations who want adjoining or nearby rooms — those blocks of cabins are the first to disappear on holiday sailings. The earlier you start, the better your odds of keeping everyone together rather than scattered across decks. This is one of the most common reasons people call us months and months ahead.",
      "Booking lead time matters more on holidays than on any other date. For peak weeks, we generally encourage cruisers to look as far out as they comfortably can, often most of a year ahead, especially for larger parties or specific cabin types like connecting rooms, suites, or balconies. Popular ships and the best categories sell through early, and waiting rarely pays off the way last-minute deals sometimes do on off-peak dates.",
      "There's a payment angle too. Booking early means placing your deposit to hold the cabins now, with the balance typically due around 120 days before sailing. For a holiday cruise that you book well in advance, that final-payment date can land comfortably ahead of the season, spreading the cost out instead of bunching it up against the holidays. We don't charge cards online — you'll mail a check to 3501 Winnie St, Galveston, TX 77550, or pay the cruise line directly.",
      "If you're coordinating a group, loop us in early and we'll do the heavy lifting — holding a block of cabins, keeping your party together, and tracking everyone's deposits and final payments so nobody falls through the cracks. Holiday group space is exactly the kind of thing that's easy to lock in early and stressful to chase late.",
      "Bottom line: if a holiday cruise from Galveston is on your wish list, the move is to start now rather than later. Search sailings at /find to see what's open for the upcoming holidays, or call a Galveston specialist at (409) 632-2106 and we'll help you reserve the right cabins before they're gone.",
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
