// Destination data for the /destinations pages. Kept in its own module
// because Next.js page files may only export route fields (not arbitrary data).

export type Destination = {
  id: string;
  name: string;
  dealKey?: string;
  country: string;
  flag: string;
  region: string;
  color: string;
  nights: string;
  icon: string;
  tagline: string;
  description: string;
  activities: { icon: string; text: string }[];
  cruiseLines: string[];
  bestFor: string[];
  highlight: string;
};

export const destinations: Destination[] = [
  // ── Mexico ──────────────────────────────────────────────────────────────
  {
    id: "cozumel",
    name: "Cozumel",
    country: "Mexico",
    flag: "🇲🇽",
    region: "mexico",
    color: "from-cyan-400 to-blue-600",
    nights: "4–7 nights",
    icon: "🤿",
    tagline: "The Caribbean's #1 Snorkeling & Diving Destination",
    description:
      "Cozumel is the most visited cruise port from Galveston — and for good reason. This stunning Mexican island sits on the world's second-largest coral reef system, making it a snorkeling and diving paradise unlike any other. Crystal-clear turquoise water, vibrant marine life, and a lively town square make Cozumel a destination guests return to again and again.",
    activities: [
      { icon: "🤿", text: "Snorkel Palancar Reef — one of the most beautiful reefs on Earth" },
      { icon: "🚢", text: "Glass-bottom boat tour through the coral gardens" },
      { icon: "🏛️", text: "Explore the ancient Mayan ruins at San Gervasio" },
      { icon: "🏖️", text: "Relax at Playa Mia or Mr. Sancho's all-inclusive beach club" },
    ],
    cruiseLines: ["Carnival", "Royal Caribbean", "Norwegian", "Princess", "MSC", "Disney"],
    bestFor: ["Snorkeling & Diving", "Families", "First-Timers", "Beach Lovers"],
    highlight: "Most visited port from Galveston",
  },
  {
    id: "costa-maya",
    name: "Costa Maya",
    country: "Mexico",
    flag: "🇲🇽",
    region: "mexico",
    color: "from-emerald-400 to-teal-700",
    nights: "7 nights",
    icon: "🏛️",
    tagline: "Ancient Ruins & Untouched Caribbean Beauty",
    description:
      "Costa Maya is Cozumel's quieter, more adventurous neighbor. This southern Yucatán port gives you access to some of Mexico's most impressive Mayan ruins — including Chacchoben, a rarely-visited jungle site — alongside uncrowded beaches and a relaxed Mexican village atmosphere that feels a world away from the tourist crowds.",
    activities: [
      { icon: "🏺", text: "Tour the Chacchoben Mayan ruins deep in the jungle" },
      { icon: "💧", text: "Swim in crystal-clear natural cenotes" },
      { icon: "♾️", text: "Lounge at the pier's infinity pools and beach clubs" },
      { icon: "🚣", text: "Kayak through mangrove lagoons teeming with wildlife" },
    ],
    cruiseLines: ["Carnival", "Royal Caribbean", "Norwegian", "Princess"],
    bestFor: ["History Buffs", "Adventure Seekers", "Couples", "Off-the-Beaten-Path"],
    highlight: "Best Mayan ruins access from Galveston",
  },
  {
    id: "progreso",
    name: "Progreso",
    country: "Mexico",
    flag: "🇲🇽",
    region: "mexico",
    color: "from-yellow-400 to-orange-500",
    nights: "4 nights",
    icon: "🏺",
    tagline: "Gateway to Chichen Itzá & the Colonial City of Mérida",
    description:
      "Progreso is the only cruise port in the Western Caribbean with easy access to Chichen Itzá — one of the Seven Wonders of the World. Shore excursions also take you into Mérida, Mexico's stunning colonial capital and cultural heartbeat of the Yucatán Peninsula. A short 4-night itinerary makes this a great add-on with Cozumel.",
    activities: [
      { icon: "🗿", text: "Visit Chichen Itzá and the iconic El Castillo pyramid" },
      { icon: "🏙️", text: "Explore the colonial streets and markets of downtown Mérida" },
      { icon: "💧", text: "Swim in a traditional cenote — underground freshwater caves" },
      { icon: "🍽️", text: "Sample Yucatecan cuisine: cochinita pibil, marquesitas & more" },
    ],
    cruiseLines: ["Carnival", "Norwegian"],
    bestFor: ["Culture & History", "Foodies", "First-Time Mexico Visitors"],
    highlight: "Only port with Chichen Itzá access",
  },
  // ── Central America ──────────────────────────────────────────────────────
  {
    id: "roatan",
    name: "Roatán",
    country: "Honduras",
    flag: "🇭🇳",
    region: "central-america",
    color: "from-green-400 to-emerald-700",
    nights: "7 nights",
    icon: "🌴",
    tagline: "World-Class Diving & Lush Tropical Paradise",
    description:
      "Roatán is Honduras's crown jewel — a lush tropical island perched on the Mesoamerican Barrier Reef, the second-largest reef system on Earth. Increasingly recognized as one of the Caribbean's best destinations for diving, snorkeling, and adventure, Roatán's natural beauty and warm, welcoming atmosphere make it a standout port of call that keeps cruisers coming back.",
    activities: [
      { icon: "🤿", text: "Scuba dive the Mesoamerican Barrier Reef — 2nd largest in the world" },
      { icon: "🪂", text: "Zip-line through the jungle canopy at Gumbalimba Park" },
      { icon: "🦥", text: "Visit a sloth sanctuary and monkey wildlife reserve" },
      { icon: "🏖️", text: "Snorkel directly off the beach at West Bay" },
    ],
    cruiseLines: ["Carnival", "Royal Caribbean", "Norwegian", "Princess"],
    bestFor: ["Diving & Snorkeling", "Adventure Seekers", "Nature Lovers", "Couples"],
    highlight: "Top diving port in the Western Caribbean",
  },
  {
    id: "belize",
    name: "Belize City",
    dealKey: "Belize",
    country: "Belize",
    flag: "🇧🇿",
    region: "central-america",
    color: "from-lime-500 to-green-800",
    nights: "7 nights",
    icon: "🦜",
    tagline: "Jungle Adventures, Mayan Ruins & the World's Best Barrier Reef",
    description:
      "Belize packs more adventure per square mile than almost any destination in the Caribbean. The world's second-largest barrier reef lies just offshore, while the jungle interior hides ancient Mayan temples, cave-tubing rivers, and exotic wildlife. Ships tender into Belize City — and from there the possibilities are endless, whether you crave underwater exploration or deep jungle adventure.",
    activities: [
      { icon: "🛟", text: "Cave tube through ancient Mayan cave systems on an inner tube" },
      { icon: "🐠", text: "Snorkel the Belize Barrier Reef at Hol Chan Marine Reserve" },
      { icon: "🏛️", text: "Visit the Altun Ha Mayan ruins (featured on the Belize dollar)" },
      { icon: "🐒", text: "Zip-line through the jungle and spot howler monkeys and toucans" },
    ],
    cruiseLines: ["Carnival", "Royal Caribbean", "Norwegian", "Princess"],
    bestFor: ["Adventure Seekers", "Nature Lovers", "Divers", "History Buffs"],
    highlight: "Best cave tubing experience in the world",
  },
  // ── Caribbean ─────────────────────────────────────────────────────────────
  {
    id: "grand-cayman",
    name: "Grand Cayman",
    country: "Cayman Islands",
    flag: "🇰🇾",
    region: "caribbean",
    color: "from-sky-300 to-blue-700",
    nights: "7 nights",
    icon: "🐠",
    tagline: "Stingray City, Seven Mile Beach & Crystal-Clear Waters",
    description:
      "Grand Cayman is one of the most beloved cruise destinations in the Caribbean and a perennial favorite for Galveston travelers. Famous for the legendary Stingray City sandbar — where you can swim with and feed wild stingrays in waist-deep water — and the powder-white sands of Seven Mile Beach, Grand Cayman consistently ranks among the Caribbean's most beautiful ports.",
    activities: [
      { icon: "🐟", text: "Swim with wild stingrays at Stingray City — a bucket-list experience" },
      { icon: "🏖️", text: "Relax on Seven Mile Beach, one of the Caribbean's most stunning" },
      { icon: "🚢", text: "Snorkel the Kittiwake shipwreck just off the coast" },
      { icon: "🐢", text: "Visit the Cayman Turtle Centre marine conservation park" },
    ],
    cruiseLines: ["Carnival", "Royal Caribbean", "Disney"],
    bestFor: ["Families", "Beach Lovers", "Snorkelers", "First-Time Cruisers"],
    highlight: "Home of the legendary Stingray City",
  },
  {
    id: "nassau",
    name: "Nassau",
    country: "The Bahamas",
    flag: "🇧🇸",
    region: "bahamas",
    color: "from-pink-400 to-rose-700",
    nights: "5 nights",
    icon: "🏖️",
    tagline: "Vibrant Capital City with Atlantis, Beaches & Colonial Charm",
    description:
      "Nassau is the vibrant capital of the Bahamas and one of the most recognizable cruise ports in the world. Colorful colonial architecture, the legendary Atlantis resort on Paradise Island, and the lively Straw Market create an energy unlike anywhere else in the Caribbean. Nassau is equally perfect for first-timers and seasoned travelers who return for the beaches and culture.",
    activities: [
      { icon: "🌊", text: "Spend the day at Atlantis's incredible water park on Paradise Island" },
      { icon: "🏰", text: "Explore 18th-century Fort Charlotte and its stunning harbor views" },
      { icon: "🏖️", text: "Swim at Cable Beach or the famous Cabbage Beach on Paradise Island" },
      { icon: "🛍️", text: "Shop for handmade crafts and souvenirs at the Nassau Straw Market" },
    ],
    cruiseLines: ["Royal Caribbean", "Disney", "MSC"],
    bestFor: ["First-Time Caribbean Cruisers", "Families", "Shoppers", "Beach Lovers"],
    highlight: "Gateway to the iconic Atlantis resort",
  },
  {
    id: "key-west",
    name: "Key West",
    country: "Florida, USA",
    flag: "🇺🇸",
    region: "caribbean",
    color: "from-sky-700 to-blue-900",
    nights: "5–7 nights",
    icon: "🌅",
    tagline: "Sunsets, Hemingway & America's Southernmost Point",
    description:
      "Key West is unlike any other port of call — a quirky, colorful island city at the very tip of Florida with a personality all its own. Famous for its breathtaking sunsets at Mallory Square, its deep ties to Ernest Hemingway, and Duval Street's legendary bar scene, Key West is a destination that feels like a true escape. Best of all: no passport required for US citizens.",
    activities: [
      { icon: "🌇", text: "Watch the famous sunset celebration at Mallory Square with street performers" },
      { icon: "🐱", text: "Tour Ernest Hemingway's historic home and meet his famous 6-toed cats" },
      { icon: "🚲", text: "Rent a bicycle and explore the island's charming Victorian streets" },
      { icon: "🤿", text: "Snorkel at the Florida Keys National Marine Sanctuary" },
    ],
    cruiseLines: ["Disney"],
    bestFor: ["History Buffs", "Couples", "Culture Lovers", "US Citizens (No Passport)"],
    highlight: "No passport required for US citizens",
  },
  {
    id: "san-juan",
    name: "San Juan",
    country: "Puerto Rico",
    flag: "🇵🇷",
    region: "caribbean",
    color: "from-purple-400 to-indigo-700",
    nights: "7+ nights",
    icon: "🏰",
    tagline: "500-Year-Old Fortresses, Colorful Streets & Perfect Beaches",
    description:
      "San Juan is one of the most culturally rich ports in the entire Caribbean. Old San Juan's cobblestone streets, brilliantly painted colonial buildings, and massive 16th-century fortresses — El Morro and San Cristóbal — transport you back centuries. Step outside the old city walls and discover world-class beaches, a thriving food scene, and the lush El Yunque rainforest.",
    activities: [
      { icon: "🏰", text: "Explore El Morro fortress and its iconic candy-striped lighthouse" },
      { icon: "🎨", text: "Wander the colorful cobblestone streets of Old San Juan" },
      { icon: "🌿", text: "Hike El Yunque — the only tropical rainforest in the US National Forest system" },
      { icon: "🏖️", text: "Relax at Condado or Isla Verde beach, both minutes from the port" },
    ],
    cruiseLines: ["Royal Caribbean"],
    bestFor: ["History Buffs", "Culture Lovers", "Foodies", "Beach Lovers"],
    highlight: "Best colonial history in the Caribbean",
  },
  {
    id: "st-thomas",
    name: "St. Thomas",
    country: "U.S. Virgin Islands",
    flag: "🇻🇮",
    region: "caribbean",
    color: "from-violet-400 to-blue-700",
    nights: "7+ nights",
    icon: "💎",
    tagline: "Duty-Free Shopping, World-Class Beaches & Spectacular Snorkeling",
    description:
      "St. Thomas is the crown jewel of the U.S. Virgin Islands and one of the most popular ports in the Eastern Caribbean. Famous for Charlotte Amalie's duty-free shopping district, the achingly beautiful Magens Bay Beach (ranked one of the world's best), and incredible snorkeling, St. Thomas has something for every type of traveler. No passport required for US citizens.",
    activities: [
      { icon: "💍", text: "Shop duty-free jewelry, liquor & luxury goods in Charlotte Amalie" },
      { icon: "🏖️", text: "Swim at Magens Bay — one of the world's most beautiful beaches" },
      { icon: "🚡", text: "Ride the Paradise Point Tramway for jaw-dropping panoramic views" },
      { icon: "🤿", text: "Snorkel at Buck Island or pristine Trunk Bay on nearby St. John" },
    ],
    cruiseLines: ["Royal Caribbean"],
    bestFor: ["Shoppers", "Beach Lovers", "Snorkelers", "US Citizens (No Passport)"],
    highlight: "Duty-free shopping capital of the Caribbean",
  },
  // ── Private Islands ───────────────────────────────────────────────────────
  {
    id: "cococay",
    name: "Perfect Day at CocoCay",
    dealKey: "CocoCay",
    country: "Royal Caribbean Private Island • Bahamas",
    flag: "👑",
    region: "private-islands",
    color: "from-blue-400 to-blue-900",
    nights: "5–7 nights",
    icon: "🎢",
    tagline: "Royal Caribbean's $250 Million Island Paradise",
    description:
      "Perfect Day at CocoCay is Royal Caribbean's extraordinary private island in the Bahamas — and it's in a class entirely its own. A $250 million investment transformed this Bahamian island into the ultimate beach destination with a massive water park, the tallest waterslide in North America, a helium balloon ride 450 feet in the air, and multiple pristine beaches included with your cruise.",
    activities: [
      { icon: "🛝", text: "Ride Daredevil's Peak — the tallest waterslide in North America" },
      { icon: "🏊", text: "Float in Oasis Lagoon, the largest freshwater pool in the Bahamas" },
      { icon: "🎈", text: "Soar 450 feet up in the Up, Up & Away helium balloon" },
      { icon: "🤿", text: "Enjoy Chill Island's pristine beach with complimentary snorkeling" },
    ],
    cruiseLines: ["Royal Caribbean"],
    bestFor: ["Thrill-Seekers", "Families", "Kids & Teens", "Beach Lovers"],
    highlight: "Tallest waterslide in North America",
  },
  {
    id: "celebration-key",
    name: "Celebration Key",
    country: "Carnival Private Island • Bahamas",
    flag: "🎉",
    region: "private-islands",
    color: "from-blue-600 to-blue-900",
    nights: "5–7 nights",
    icon: "🎊",
    tagline: "Carnival's Brand-New Private Island Paradise — Opened 2025",
    description:
      "Celebration Key is Carnival's newest and most ambitious private island destination, opening in 2025 on Grand Bahama Island in the Bahamas. Designed from the ground up with every type of traveler in mind, it features multiple distinct beach zones including the exclusive adults-only Pearl Cove Beach Club, the family-friendly Calypso Lagoon water park, and calm Starfish Lagoon for swimming and snorkeling. It's the freshest private island experience in the Caribbean — and it sails directly from Galveston.",
    activities: [
      { icon: "🍹", text: "Relax at Pearl Cove — the adults-only beach club with a swim-up bar" },
      { icon: "🌊", text: "Ride the slides and river at Calypso Lagoon family water park" },
      { icon: "🐠", text: "Snorkel the calm reef-protected waters of Starfish Lagoon" },
      { icon: "🏔️", text: "Climb Captain's Chair observation tower for sweeping Bahamian views" },
    ],
    cruiseLines: ["Carnival"],
    bestFor: ["Families", "Beach Lovers", "Couples", "Adults-Only Escape"],
    highlight: "Carnival's newest private island — opened 2025",
  },
  {
    id: "half-moon-cay",
    name: "Half Moon Cay",
    country: "Carnival Private Island • Bahamas",
    flag: "🎉",
    region: "private-islands",
    color: "from-blue-700 to-[#0a1f44]",
    nights: "5–7 nights",
    icon: "🌙",
    tagline: "Carnival's Pristine Private Island Hideaway",
    description:
      "Half Moon Cay is Carnival's private island in the Bahamas and one of the most beautiful in the Caribbean. With over a mile of pristine white sand beach, calm turquoise water, and a relaxed atmosphere, Half Moon Cay feels like a genuine escape. Horseback riding in the surf, stingray encounters, a kids' water park, and private cabanas make it perfect for every traveler.",
    activities: [
      { icon: "🐴", text: "Ride horses through the surf along the beach — unforgettable" },
      { icon: "🐟", text: "Swim with stingrays in the island's calm, protected lagoon" },
      { icon: "🛝", text: "Splash around at the island's dedicated kids' water park" },
      { icon: "🏠", text: "Rent a private overwater cabana overlooking the turquoise sea" },
    ],
    cruiseLines: ["Carnival"],
    bestFor: ["Families", "Beach Lovers", "Couples", "Relaxation"],
    highlight: "Over a mile of pristine white sand beach",
  },
  {
    id: "ocean-cay",
    name: "Ocean Cay Marine Reserve",
    country: "MSC Private Island • Bahamas",
    flag: "⚓",
    region: "private-islands",
    color: "from-slate-500 to-slate-900",
    nights: "7 nights",
    icon: "🪸",
    tagline: "A Former Industrial Site Reborn as a Marine Sanctuary",
    description:
      "Ocean Cay is the most unique private island experience in the Caribbean — a former dredging site transformed by MSC Cruises into a stunning marine reserve and beach retreat. Six distinct beaches, restored coral reefs for snorkeling, limited guest capacity for an exclusive feel, and spectacular nightly sunset concerts under the stars make this a one-of-a-kind island day.",
    activities: [
      { icon: "🪸", text: "Snorkel through actively restored coral reefs in the lagoon" },
      { icon: "🏖️", text: "Choose from six different beaches, each with its own distinct vibe" },
      { icon: "🎵", text: "Attend the nightly sunset concert from the island's amphitheater" },
      { icon: "🚣", text: "Kayak and paddleboard through crystal-clear Bahamian waters" },
    ],
    cruiseLines: ["MSC"],
    bestFor: ["Nature Lovers", "Snorkelers", "Couples", "Eco-Conscious Travelers"],
    highlight: "An active marine conservation reserve",
  },
  {
    id: "castaway-cay",
    name: "Castaway Cay",
    country: "Disney Private Island • Bahamas",
    flag: "✨",
    region: "private-islands",
    color: "from-yellow-400 to-orange-600",
    nights: "5 nights",
    icon: "🏰",
    tagline: "The Most Magical Private Island Experience at Sea",
    description:
      "Castaway Cay is Disney's legendary private island in the Bahamas — and it's everything you'd expect from Disney: impeccably maintained, thoughtfully designed for families, and absolutely magical. Dedicated beach areas for families, teens, and adults mean everyone gets their perfect beach day. Disney characters roam the island for photos, and the snorkel trail is one of the best in the Bahamas.",
    activities: [
      { icon: "🤿", text: "Snorkel the Castaway Cay underwater trail with hidden treasures" },
      { icon: "🏰", text: "Meet Disney characters on the beach for photos and memories" },
      { icon: "🧘", text: "Relax at Serenity Bay, the serene adults-only beach area" },
      { icon: "🚲", text: "Rent bikes and explore the island's scenic nature paths" },
    ],
    cruiseLines: ["Disney"],
    bestFor: ["Families with Kids", "Disney Fans", "Snorkelers", "All Ages"],
    highlight: "The most family-perfect island experience at sea",
  },
  {
    id: "princess-cays",
    name: "Princess Cays",
    country: "Princess Private Island • Bahamas",
    flag: "👸",
    region: "private-islands",
    color: "from-purple-500 to-purple-900",
    nights: "5–7 nights",
    icon: "🌺",
    tagline: "Princess Cruises' Exclusive 40-Acre Bahamian Retreat",
    description:
      "Princess Cays is Princess Cruises' private beach destination on the southern tip of Eleuthera island in the Bahamas. With over 40 acres of tropical beach grounds, reef-protected waters perfect for snorkeling, and that signature Princess elegance carried ashore, Princess Cays offers a serene, uncrowded island escape with water sports, beach cabanas, and all-day Caribbean bliss.",
    activities: [
      { icon: "🤿", text: "Snorkel in the calm, reef-protected turquoise cove" },
      { icon: "🌴", text: "Relax in a beachside hammock with a rum punch in hand" },
      { icon: "🏄", text: "Try kayaking, paddleboarding, and banana boats" },
      { icon: "🏠", text: "Rent a private beach cabana for the ultimate VIP island day" },
    ],
    cruiseLines: ["Princess"],
    bestFor: ["Couples", "Relaxation", "Water Sports", "Beach Lovers"],
    highlight: "40+ acres of private Bahamian beach",
  },
];

