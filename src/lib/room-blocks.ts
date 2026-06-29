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
  isGuarantee?: boolean; // GTY — guaranteed category, specific room assigned by cruise line
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
  contractUrl?: string; // link to the uploaded group contract (PDF)
  contractName?: string; // original file name, for display
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

// ── Supabase data layer ───────────────────────────────────────────────────────

import { supabase } from "./supabase";

function toCabin(row: Record<string, unknown>): Cabin {
  return {
    id: row.id as string,
    roomNumber: row.room_number as string,
    deck: (row.deck as number) ?? 1,
    location: (row.location as CabinLocation) ?? "Midship",
    side: (row.side as CabinSide) ?? "Port",
    type: (row.type as CabinCategory) ?? "Interior",
    maxGuests: (row.max_guests as number) ?? 2,
    sqft: (row.sqft as number) ?? 0,
    price: (row.price as number) ?? 0,
    status: (row.status as CabinStatus) ?? "available",
    isGuarantee: (row.is_guarantee as boolean) ?? false,
    guestName: row.guest_name as string | undefined,
    guestEmail: row.guest_email as string | undefined,
    bookingId: row.booking_id as string | undefined,
    heldUntil: row.held_until as string | undefined,
    notes: row.notes as string | undefined,
  };
}

function toBlock(row: Record<string, unknown>, cabins: Cabin[] = []): SailingBlock {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    ship: row.ship as string,
    cruiseLine: (row.cruise_line as string) ?? "",
    sailingDate: row.sailing_date as string,
    returnDate: (row.return_date as string) ?? "",
    nights: (row.nights as number) ?? 0,
    itinerary: (row.itinerary as string) ?? "",
    cabins,
    notes: row.notes as string | undefined,
    contractUrl: row.contract_url as string | undefined,
    contractName: row.contract_name as string | undefined,
  };
}

export async function getSailingBlocks(): Promise<SailingBlock[]> {
  const { data: blocks, error } = await supabase
    .from("sailing_blocks")
    .select("*, cabins(*)")
    .order("sailing_date", { ascending: true });
  if (error || !blocks) return [];
  return blocks.map((b) => toBlock(b, (b.cabins as Record<string, unknown>[]).map(toCabin)));
}

export async function getSailingBlock(id: string): Promise<SailingBlock | null> {
  const { data, error } = await supabase
    .from("sailing_blocks")
    .select("*, cabins(*)")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return toBlock(data, (data.cabins as Record<string, unknown>[]).map(toCabin));
}

export async function saveSailingBlock(block: SailingBlock): Promise<void> {
  const blockRow: Record<string, unknown> = {
    id: block.id,
    ship: block.ship,
    cruise_line: block.cruiseLine,
    sailing_date: block.sailingDate,
    return_date: block.returnDate,
    nights: block.nights,
    itinerary: block.itinerary,
    notes: block.notes,
  };
  // Only send contract fields once a contract is attached — avoids errors on
  // databases that don't have the contract_url/contract_name columns yet.
  if (block.contractUrl) blockRow.contract_url = block.contractUrl;
  if (block.contractName) blockRow.contract_name = block.contractName;
  await supabase.from("sailing_blocks").upsert(blockRow);
  // Upsert all cabins
  if (block.cabins.length > 0) {
    await supabase.from("cabins").upsert(
      block.cabins.map((c) => ({
        id: c.id,
        block_id: block.id,
        room_number: c.roomNumber,
        deck: c.deck,
        location: c.location,
        side: c.side,
        type: c.type,
        max_guests: c.maxGuests,
        sqft: c.sqft,
        price: c.price,
        status: c.status,
        is_guarantee: c.isGuarantee ?? false,
        guest_name: c.guestName,
        guest_email: c.guestEmail,
        booking_id: c.bookingId,
        held_until: c.heldUntil,
        notes: c.notes,
      }))
    );
  }
}

export async function deleteSailingBlock(id: string): Promise<void> {
  // Cabins cascade-delete via FK
  await supabase.from("sailing_blocks").delete().eq("id", id);
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
