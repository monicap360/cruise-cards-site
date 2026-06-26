// Practical, cruise-focused port info for each destination — what happens when
// you step off the ship, how to get around, taxis, and insider tips.

export type PortGuide = {
  arrival: string; // where the ship docks/tenders and what's right there
  gettingAround: string; // taxis, shuttles, walking — with rough costs
  tips: string[];
};

export const PORT_GUIDES: Record<string, PortGuide> = {
  cozumel: {
    arrival:
      "Ships dock at one of three piers on the island's west side — Punta Langosta (walkable to downtown San Miguel), or Puerta Maya / International piers about 3 miles south. Each pier opens into a shopping and restaurant plaza right off the gangway.",
    gettingAround:
      "Official taxis line up just outside the pier gates. Rates are government-set by zone (no meters, no Uber) — confirm the price before you get in. Expect about $15–25 to the popular beach clubs. Many guests simply walk into town from Punta Langosta.",
    tips: [
      "Agree on the taxi fare out loud before getting in — rates are fixed by zone.",
      "Beach clubs like Mr. Sancho's, Playa Mia, and Paradise Beach include chairs, pools, and food/drink for a day pass.",
      "Bring reef-safe sunscreen — regular sunscreen is restricted at the reef parks.",
      "US dollars are accepted everywhere; you don't need pesos.",
    ],
  },
  "costa-maya": {
    arrival:
      "Costa Maya is a purpose-built cruise port — you walk straight off the ship into a large complex with pools, shops, bars, and a swim-up area, all within the secure port zone.",
    gettingAround:
      "Taxis and tour vans wait just outside the port entrance. The fishing village of Mahahual is about 10 minutes away (~$5–8 by taxi or the port shuttle). Mayan ruins like Chacchoben are 1–1.5 hours inland — best done as a booked excursion.",
    tips: [
      "You can have a great day without leaving the port complex — pool, beach, and food are all right there.",
      "Mahahual's malecón beach is calmer and more local than the port; well worth the short ride.",
      "Cell signal is weak — agree on a meet-up time/place with your group before splitting up.",
      "Last tender/all-aboard comes early — watch the time if you head inland to ruins.",
    ],
  },
  progreso: {
    arrival:
      "Progreso has one of the longest piers in the world (about 4 miles). A free shuttle bus carries you from the ship down the pier to the terminal, which has shops, bars, and a beach right alongside.",
    gettingAround:
      "Taxis wait at the terminal. The town malecón (beachfront promenade) is a short walk or quick taxi. Chichén Itzá is roughly 2 hours each way — only do it as a ship-sponsored excursion so the ship waits for you if traffic is bad.",
    tips: [
      "The town beach and malecón are an easy, cheap walk — great for a relaxed local day.",
      "Chichén Itzá is incredible but a very long day; Dzibilchaltún or a cenote is a shorter ruins+swim alternative.",
      "Vendors are friendly but persistent — a polite 'no, gracias' works fine.",
      "Bring cash in small bills for beach chairs, drinks, and tips.",
    ],
  },
  roatan: {
    arrival:
      "Two cruise ports: Mahogany Bay (Carnival's port, with its own beach and a chairlift) and Coxen Hole / Town Center. Both have shopping villages right at the gangway.",
    gettingAround:
      "Taxis wait just outside the port gate — negotiate and confirm the fare first (about $20–30 to West Bay Beach for the car, not per person). The island's best beach, West Bay, is 20–30 minutes away.",
    tips: [
      "West Bay Beach has the famous off-the-beach snorkeling right over the reef.",
      "Settle taxi prices before leaving and agree on a return pickup time.",
      "Mahogany Bay's beach (Mahogany Beach) is included if you don't want to travel.",
      "Roatán drives on the right; roads are winding — allow extra time to get back.",
    ],
  },
  belize: {
    arrival:
      "Belize is a tender port — ships anchor offshore and you ride a tender boat (about 20–30 minutes) into the Fort Street Tourism Village, a gated shopping/dining area at the dock.",
    gettingAround:
      "Taxis and tour operators are right at the tender dock. Because Belize's best sights (cave tubing, Mayan ruins, the reef) are far from the city, most guests book a ship excursion or a reputable local tour rather than wandering the city.",
    tips: [
      "Take an early tender — lines build, and excursions leave from shore on a schedule.",
      "Cave tubing + zip-line and the Altun Ha ruins are the signature Belize days.",
      "For the reef, Hol Chan / Shark Ray Alley snorkeling is world-class.",
      "Stick with organized tours; the tender ride means you don't want to risk missing the last boat.",
    ],
  },
  "grand-cayman": {
    arrival:
      "Grand Cayman is a tender port — ships anchor off George Town and tender you to the downtown waterfront, steps from shops, restaurants, and the dive operators.",
    gettingAround:
      "Taxis are right at the dock. Seven Mile Beach is about 10 minutes (~$15–20 by taxi, or a few dollars on the public mini-buses). Stingray City is reached only by boat — book a tour.",
    tips: [
      "Stingray City (swim with wild rays on a sandbar) is the bucket-list Cayman excursion.",
      "Seven Mile Beach has free public access points — Governor's Beach is an easy taxi drop.",
      "The Cayman dollar is worth more than the US dollar, but USD is accepted everywhere.",
      "Tender lines can be long at peak — go early or mid-afternoon.",
    ],
  },
  nassau: {
    arrival:
      "Ships dock right downtown at Prince George Wharf, and you walk off into the brand-new Nassau Cruise Port — shops, food, and a welcome plaza — with Bay Street and the Straw Market just steps away.",
    gettingAround:
      "Taxis line up outside the port. Fares are per-person to set zones — roughly $4–5pp to Cable Beach or to Paradise Island/Atlantis. The water taxi to Paradise Island is a fun, cheap alternative.",
    tips: [
      "You can buy a day pass to Atlantis's Aquaventure water park (book ahead — it sells out).",
      "Junkanoo Beach is a free public beach within walking distance of the port.",
      "Agree on the per-person taxi fare before riding; confirm it's to your exact beach.",
      "Bay Street shopping and the Straw Market are an easy walk — no taxi needed.",
    ],
  },
  "key-west": {
    arrival:
      "Ships dock at Mallory Square, Pier B, or the Navy Mole — all in or beside Old Town. From Mallory Square and Pier B you can walk straight onto Duval Street and the historic district.",
    gettingAround:
      "Key West is wonderfully walkable. The Conch Train and Old Town Trolley hop-on tours leave right from the piers, and pedicabs, bikes, and scooters are easy to rent. Taxis are available but rarely needed.",
    tips: [
      "Catch the sunset celebration at Mallory Square — street performers, music, and the famous Key West sunset.",
      "Hemingway Home, the Southernmost Point buoy, and Duval Street are all walkable.",
      "No passport needed for US citizens — it's domestic.",
      "From the Navy Mole you must take the shuttle into town (it's a secure base).",
    ],
  },
  "san-juan": {
    arrival:
      "Ships dock at the Old San Juan piers — you step off right into the 500-year-old historic district, with blue-cobblestone streets, forts, and plazas within walking distance.",
    gettingAround:
      "Old San Juan is best on foot — El Morro fort is a scenic 15-minute walk. For beaches, use the white 'Taxi Turístico' cabs at the pier (fixed zone rates, about $12–15 to Condado beach).",
    tips: [
      "El Morro and Castillo San Cristóbal are walkable and worth the (small) entry fee.",
      "It's US territory — no passport needed for US citizens and the currency is the US dollar.",
      "The free Old San Juan trolley loops the historic sights if the hills tire you out.",
      "El Yunque rainforest is a booked excursion — too far to do on your own quickly.",
    ],
  },
  "st-thomas": {
    arrival:
      "Ships dock at Havensight (the WICO pier, with the Havensight Mall) or Crown Bay. Charlotte Amalie's shopping district is a short taxi or 15–20 minute walk from Havensight.",
    gettingAround:
      "Open-air 'safari' taxi trucks wait outside the pier and run set per-person rates — about $10–12pp to Magens Bay, $4–5pp to Charlotte Amalie. Share the ride with other cruisers.",
    tips: [
      "Magens Bay is regularly ranked one of the world's most beautiful beaches — small entry fee.",
      "The Skyride/Paradise Point tramway by Havensight has the postcard harbor view.",
      "US Virgin Islands — no passport needed for US citizens, USD currency.",
      "Duty-free jewelry and liquor in Charlotte Amalie are a genuine bargain.",
    ],
  },
};

// Private islands share the same simple, all-inclusive arrival experience.
export const PRIVATE_ISLAND_GUIDE: PortGuide = {
  arrival:
    "This is a cruise line's own private island, so the day is effortless — your ship either docks at a pier or tenders you a short ride to the beach, and you step right onto the sand. There's no town, no customs line, and nothing else to navigate.",
  gettingAround:
    "Everything is within an easy walk, with trams or paths connecting the beach zones. You don't need taxis or local currency — meals are included and any extras (drinks, cabanas, excursions) are simply charged to your room key.",
  tips: [
    "Grab a lounge chair early — the prime shaded and beachfront spots go fast.",
    "Lunch and beach loungers are included; cabanas, premium activities, and drinks cost extra.",
    "Bring your ship card (SeaPass/room key) — it's all you need to pay for anything.",
    "Watch the all-aboard time; the last tender or gangway closes well before departure.",
  ],
};

export function getPortGuide(id: string, isPrivateIsland: boolean): PortGuide {
  return PORT_GUIDES[id] ?? (isPrivateIsland ? PRIVATE_ISLAND_GUIDE : PRIVATE_ISLAND_GUIDE);
}
