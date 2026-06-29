export type Destination = {
  slug: string;
  name: string;
  country: string;
  blurb: string;
  gradient: string;
  highlights: string[];
};

// Matched against itinerary port text. Order matters (first match wins).
const TABLE: { match: RegExp; d: Destination }[] = [
  {
    match: /cozumel/i,
    d: {
      slug: "cozumel",
      name: "Cozumel",
      country: "Mexico",
      blurb:
        "Crystal-clear Caribbean water, world-class coral reefs, and laid-back beach clubs just off the pier.",
      gradient: "from-cyan-400 to-teal-700",
      highlights: [
        "Snorkel the Mesoamerican Reef",
        "Beach clubs & swim-up bars",
        "Day trip to Tulum ruins",
      ],
    },
  },
  {
    match: /costa\s*maya/i,
    d: {
      slug: "costa-maya",
      name: "Costa Maya",
      country: "Mexico",
      blurb:
        "A pristine stretch of jungle coastline — turquoise lagoons, Mayan ruins, and a buzzing beachfront village.",
      gradient: "from-emerald-400 to-teal-800",
      highlights: [
        "Chacchoben Mayan ruins",
        "Lagoon & beach breaks",
        "Tequila & local culture",
      ],
    },
  },
  {
    match: /progreso/i,
    d: {
      slug: "progreso",
      name: "Progreso",
      country: "Mexico · Yucatán",
      blurb:
        "Gateway to the Yucatán — golden Gulf beaches, cenotes, and the wonder of Chichén Itzá.",
      gradient: "from-amber-300 to-orange-700",
      highlights: [
        "Chichén Itzá day trip",
        "Swim in a cenote",
        "Wide sandy malecón",
      ],
    },
  },
  {
    match: /roat[aá]n|mahogany/i,
    d: {
      slug: "roatan",
      name: "Roatán",
      country: "Honduras",
      blurb:
        "An island paradise on the world's second-largest barrier reef — vivid water and lush green hills.",
      gradient: "from-sky-400 to-cyan-800",
      highlights: [
        "Reef snorkeling & diving",
        "West Bay Beach",
        "Zip-line through the jungle",
      ],
    },
  },
  {
    match: /belize/i,
    d: {
      slug: "belize",
      name: "Belize",
      country: "Belize",
      blurb:
        "Rainforest rivers, ancient Mayan temples, and the famous Great Blue Hole offshore.",
      gradient: "from-teal-400 to-emerald-800",
      highlights: [
        "Cave tubing & jungle",
        "Altun Ha ruins",
        "Barrier-reef snorkeling",
      ],
    },
  },
  {
    match: /grand\s*cayman|george\s*town/i,
    d: {
      slug: "grand-cayman",
      name: "Grand Cayman",
      country: "Cayman Islands",
      blurb:
        "Powder-soft Seven Mile Beach and the unforgettable swim with the rays at Stingray City.",
      gradient: "from-cyan-300 to-blue-700",
      highlights: [
        "Stingray City sandbar",
        "Seven Mile Beach",
        "Turtle Centre",
      ],
    },
  },
  {
    match: /cococay|coco\s*cay/i,
    d: {
      slug: "cococay",
      name: "Perfect Day at CocoCay",
      country: "Bahamas · Private Island",
      blurb:
        "Royal Caribbean's private island — waterpark thrills, a zero-entry beach, and an over-water cabana life.",
      gradient: "from-pink-400 to-cyan-600",
      highlights: [
        "Thrill Waterpark",
        "Coco Beach Club",
        "Up, Up & Away balloon",
      ],
    },
  },
  {
    match: /key\s*west/i,
    d: {
      slug: "key-west",
      name: "Key West",
      country: "Florida, USA",
      blurb:
        "America's southernmost city — pastel streets, Duval Street nightlife, sunset celebrations, and reef snorkeling.",
      gradient: "from-amber-300 to-rose-600",
      highlights: ["Mallory Square sunset", "Duval Street", "Reef & glass-bottom boats"],
    },
  },
  {
    match: /montego|jamaica|ocho\s*rios|falmouth/i,
    d: {
      slug: "montego-bay",
      name: "Montego Bay",
      country: "Jamaica",
      blurb:
        "Jamaica's vibrant north coast — reggae rhythm, Dunn's River Falls, jerk cuisine, and warm turquoise bays.",
      gradient: "from-green-400 to-emerald-800",
      highlights: ["Dunn's River Falls", "Doctor's Cave Beach", "Bamboo rafting"],
    },
  },
  {
    match: /puerto\s*rico|san\s*juan/i,
    d: {
      slug: "puerto-rico",
      name: "San Juan, Puerto Rico",
      country: "Puerto Rico",
      blurb:
        "Old San Juan's blue-cobblestone streets, historic forts, rainforest, and lively Caribbean culture.",
      gradient: "from-sky-400 to-indigo-800",
      highlights: ["El Morro fort", "Old San Juan", "El Yunque rainforest"],
    },
  },
  {
    match: /st\.?\s*thomas|charlotte\s*amalie|virgin\s*islands/i,
    d: {
      slug: "st-thomas",
      name: "St. Thomas",
      country: "U.S. Virgin Islands",
      blurb:
        "Powder-white Magens Bay, duty-free shopping, and some of the clearest snorkeling water in the Caribbean.",
      gradient: "from-cyan-400 to-blue-700",
      highlights: ["Magens Bay beach", "Skyride to Paradise Point", "Duty-free shopping"],
    },
  },
  {
    match: /nassau/i,
    d: {
      slug: "nassau",
      name: "Nassau",
      country: "Bahamas",
      blurb:
        "Colonial colors, conch shacks, and easy turquoise beaches in the heart of the Bahamas.",
      gradient: "from-blue-400 to-indigo-800",
      highlights: ["Paradise Island", "Queen's Staircase", "Snorkel & swim"],
    },
  },
  {
    match: /bimini/i,
    d: {
      slug: "bimini",
      name: "Bimini",
      country: "Bahamas",
      blurb:
        "The Bahamas' closest island — clear shallows, a beach club, and classic island calm.",
      gradient: "from-sky-300 to-blue-700",
      highlights: ["Beach club day", "Crystal shallows", "Island hopping"],
    },
  },
  {
    match: /harvest\s*caye/i,
    d: {
      slug: "harvest-caye",
      name: "Harvest Caye",
      country: "Belize · Norwegian Private Island",
      blurb:
        "Norwegian's 75-acre island resort off southern Belize — a huge lagoon pool, a long sandy beach, and real adventure.",
      gradient: "from-emerald-400 to-teal-700",
      highlights: ["Lagoon pool & beach", "Zip line & ropes course", "Barrier-reef snorkeling"],
    },
  },
  {
    match: /great\s*stirrup/i,
    d: {
      slug: "great-stirrup-cay",
      name: "Great Stirrup Cay",
      country: "Bahamas · Norwegian Private Island",
      blurb:
        "Norwegian's private Bahamian island — powdery beaches, cabanas, snorkeling, and a new water park.",
      gradient: "from-cyan-400 to-blue-700",
      highlights: ["Private beaches & cabanas", "Vibe Beach Club", "Snorkeling & water park"],
    },
  },
];

export function destinationFor(port: string): Destination {
  const hit = TABLE.find((x) => x.match.test(port));
  if (hit) return hit.d;
  // Generic fallback so every port still renders a clean card.
  return {
    slug: port
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    name: port,
    country: "Port of Call",
    blurb: "A scenic Caribbean port of call on your Galveston round-trip cruise.",
    gradient: "from-blue-600 to-[#0a1f44]",
    highlights: [],
  };
}

export function portsFromItinerary(itinerary: string): string[] {
  return itinerary
    .split(/[·,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((p) => !/galveston|sea day|at sea/i.test(p));
}

// Destination slugs we actually have a photo for in /public/destinations.
const PHOTO_SLUGS = new Set([
  "belize", "bimini", "castaway-cay", "celebration-key", "cococay",
  "costa-maya", "cozumel", "grand-cayman", "great-stirrup-cay", "half-moon-cay",
  "harvest-caye", "key-west", "montego-bay", "nassau", "ocean-cay",
  "progreso", "puerto-rico", "roatan", "san-juan", "st-thomas",
]);

// Pick the first port in an itinerary that has a real photo, so every sailing
// card shows an image (not a plain gradient). Falls back to a Cozumel beach.
export function destinationWithPhoto(itinerary: string): Destination {
  const ports = portsFromItinerary(itinerary);
  for (const p of ports) {
    const d = destinationFor(p);
    if (PHOTO_SLUGS.has(d.slug)) return d;
  }
  const first = destinationFor(ports[0] ?? "Cozumel");
  return PHOTO_SLUGS.has(first.slug) ? first : { ...first, slug: "cozumel" };
}

// Top destinations for marketing galleries (homepage, etc.).
export const FEATURED_DESTINATIONS: Destination[] = [
  "cozumel",
  "costa-maya",
  "roatan",
  "grand-cayman",
  "progreso",
  "belize",
].map((slug) => TABLE.find((x) => x.d.slug === slug)!.d);
