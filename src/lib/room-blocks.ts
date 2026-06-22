export type CabinStatus = "available" | "held" | "booked";
export type CabinLocation = "Forward" | "Midship" | "Aft";
export type CabinSide = "Port" | "Starboard" | "Both";
export type CabinCategory =
  | "Interior"
  | "Ocean View"
  | "Balcony"
  | "Mini-Suite"
  | "Suite";

export type Cabin = {
  id: string;
  roomNumber: string;
  deck: number;
  location: CabinLocation;
  side: CabinSide;
  type: CabinCategory;
  maxGuests: number;
  sqft: number;
  price: number;
  status: CabinStatus;
  guestName?: string;
  guestEmail?: string;
  bookingId?: string;
  heldUntil?: string;
  notes?: string;
};

export type SailingBlock = {
  id: string;
  createdAt: string;
  ship: string;
  cruiseLine: string;
  sailingDate: string;
  returnDate: string;
  nights: number;
  itinerary: string;
  cabins: Cabin[];
  notes?: string;
};

export const CABIN_CATEGORIES: CabinCategory[] = [
  "Interior",
  "Ocean View",
  "Balcony",
  "Mini-Suite",
  "Suite",
];

export const CABIN_LOCATIONS: CabinLocation[] = ["Forward", "Midship", "Aft"];
export const CABIN_SIDES: CabinSide[] = ["Port", "Starboard", "Both"];

export const CATEGORY_ICON: Record<CabinCategory, string> = {
  Interior: "🛏️",
  "Ocean View": "🌊",
  Balcony: "🏖️",
  "Mini-Suite": "✨",
  Suite: "👑",
};

export const CATEGORY_INFO: Record<
  CabinCategory,
  { gradient: string; sqftRange: string; desc: string; features: string[] }
> = {
  Interior: {
    gradient: "from-slate-600 to-slate-800",
    sqftRange: "150–185 sq ft",
    desc: "A comfortable private retreat with everything you need for a great cruise. No natural light, but you'll spend most of your time at sea exploring the ship or ports.",
    features: [
      "Queen or twin beds",
      "Full private bathroom",
      "Climate control",
      "Interactive TV & movies",
      "In-room safe & mini-fridge",
      "Ample closet storage",
    ],
  },
  "Ocean View": {
    gradient: "from-blue-500 to-blue-800",
    sqftRange: "170–210 sq ft",
    desc: "Wake up to natural daylight and a view of the open ocean. All the comfort of an interior cabin plus a porthole or large picture window.",
    features: [
      "Porthole or large window",
      "Natural light & ocean views",
      "Queen or twin beds",
      "Full private bathroom",
      "Extra square footage",
      "In-room safe & mini-fridge",
    ],
  },
  Balcony: {
    gradient: "from-teal-500 to-blue-700",
    sqftRange: "185–230 sq ft + balcony",
    desc: "The most popular cabin category at sea. Step outside to your private balcony and watch the ocean go by — ideal for watching sunrises, sunsets, and port arrivals.",
    features: [
      "Private outdoor balcony",
      "Floor-to-ceiling sliding door",
      "Balcony chairs & table",
      "Stunning ocean views",
      "Queen or twin beds",
      "Full bathroom with tub/shower",
    ],
  },
  "Mini-Suite": {
    gradient: "from-purple-500 to-purple-800",
    sqftRange: "270–360 sq ft + balcony",
    desc: "More space, more luxury, and more features than a standard balcony. A separate sitting area makes it perfect for families or anyone who wants room to spread out.",
    features: [
      "Separate living & sleeping areas",
      "Sofa with pull-out bed",
      "Larger private balcony",
      "Enhanced bathroom with whirlpool",
      "Priority boarding",
      "Mini-bar & premium amenities",
    ],
  },
  Suite: {
    gradient: "from-yellow-500 to-orange-700",
    sqftRange: "400–800+ sq ft",
    desc: "The ultimate cruise experience. Full butler service, concierge access, expansive living spaces, and exclusive perks that make every moment of your cruise feel like a five-star resort.",
    features: [
      "Full living room & dining area",
      "Dedicated butler service",
      "Concierge & priority access",
      "Whirlpool tub on balcony",
      "Premium bar setup",
      "Exclusive lounge access",
    ],
  },
};

export const STATUS_COLOR: Record<CabinStatus, string> = {
  available: "bg-green-100 text-green-700",
  held: "bg-yellow-100 text-yellow-700",
  booked: "bg-red-100 text-red-700",
};

export function generateBlockId(): string {
  return "blk-" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function generateCabinId(): string {
  return "cab-" + Math.random().toString(36).substring(2, 9);
}

// ── localStorage data layer ───────────────────────────────────────────────────

export function getSailingBlocks(): SailingBlock[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("cfg-room-blocks") ?? "[]");
  } catch {
    return [];
  }
}

export function getSailingBlock(id: string): SailingBlock | null {
  return getSailingBlocks().find((b) => b.id === id) ?? null;
}

export function saveSailingBlock(block: SailingBlock): void {
  const all = getSailingBlocks();
  const idx = all.findIndex((b) => b.id === block.id);
  if (idx >= 0) all[idx] = block;
  else all.unshift(block);
  localStorage.setItem("cfg-room-blocks", JSON.stringify(all));
}

export function deleteSailingBlock(id: string): void {
  const all = getSailingBlocks().filter((b) => b.id !== id);
  localStorage.setItem("cfg-room-blocks", JSON.stringify(all));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function countByStatus(cabins: Cabin[]): Record<CabinStatus, number> {
  return cabins.reduce(
    (acc, c) => { acc[c.status] = (acc[c.status] ?? 0) + 1; return acc; },
    { available: 0, held: 0, booked: 0 } as Record<CabinStatus, number>
  );
}

export function groupByType(cabins: Cabin[]): Record<string, Cabin[]> {
  return cabins.reduce<Record<string, Cabin[]>>((acc, c) => {
    (acc[c.type] = acc[c.type] ?? []).push(c);
    return acc;
  }, {});
}
