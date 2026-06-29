// ── Galveston fleet → inventory seed ─────────────────────────────────────────
// Ships, lines, durations, and active windows are REAL (sourced from
// galvestoncruises.com, June 2026). Exact weekly departure DATES are estimated
// on a typical cadence and tagged DRAFT — staff confirm with the cruise line
// before publishing. Generates sailing_blocks (+ a few guarantee cabins each).

import {
  type SailingBlock,
  type Cabin,
  type CabinCategory,
  generateBlockId,
  generateCabinId,
} from "./room-blocks";
import { supabase } from "./supabase";

export const DRAFT_TAG = "DRAFT";
const DRAFT_NOTE =
  "DRAFT — auto-generated weekly estimate from the galvestoncruises.com fleet list. Confirm the exact date with the cruise line before publishing.";

export type FleetShip = {
  cruiseLine: string;
  ship: string;
  nights: number; // primary duration used for generated weekly sailings
  durationLabel: string; // the real range advertised
  departureDay: number; // 0=Sun … 6=Sat (estimated typical day)
  itinerary: string;
  start?: string; // YYYY-MM-DD window start (defaults to today)
  end?: string; // YYYY-MM-DD window end (defaults to horizon)
  cadenceDays?: number; // default 7
  seasonalNote?: string;
  published?: boolean; // real published schedule (not a draft estimate)
};

// Active / upcoming Galveston fleet (June 2026). Within a ~6-month horizon.
export const GALVESTON_FLEET: FleetShip[] = [
  // ── Carnival ──
  {
    cruiseLine: "Carnival Cruise Line",
    ship: "Carnival Jubilee",
    nights: 7,
    durationLabel: "7-night Western Caribbean",
    departureDay: 6, // Saturday — published weekly schedule
    itinerary: "Cozumel · Mahogany Bay (Roatán) · Costa Maya",
    published: true,
  },
  {
    cruiseLine: "Carnival Cruise Line",
    ship: "Carnival Breeze",
    nights: 5,
    durationLabel: "4 & 5-night",
    departureDay: 1, // Monday
    itinerary: "Cozumel · Progreso",
  },
  {
    cruiseLine: "Carnival Cruise Line",
    ship: "Carnival Dream",
    nights: 7,
    durationLabel: "6, 7, 8 & 14-day (thru 2027)",
    departureDay: 0, // Sunday
    itinerary: "Cozumel · Roatán · Belize City",
  },
  {
    cruiseLine: "Carnival Cruise Line",
    ship: "Carnival Miracle",
    nights: 5,
    durationLabel: "4, 5 & 10-night",
    departureDay: 4, // Thursday
    itinerary: "Cozumel · Progreso",
    start: "2026-09-01",
    end: "2027-03-31",
    seasonalNote: "Sep 2026 – Mar 2027",
  },
  {
    cruiseLine: "Carnival Cruise Line",
    ship: "Carnival Tropicale",
    nights: 7,
    durationLabel: "7-night (new Excel-class)",
    departureDay: 6, // Saturday
    itinerary: "Cozumel · Mahogany Bay (Roatán) · Costa Maya",
    start: "2028-01-01",
    seasonalNote:
      "NEW Excel-class ship — arrives Galveston 2028 year-round (dates ESTIMATED; Carnival releases official 2028 itineraries later in 2026)",
  },
  {
    cruiseLine: "Carnival Cruise Line",
    ship: "Carnival Vista",
    nights: 8,
    durationLabel: "6 & 8-night Western Caribbean",
    departureDay: 6, // Saturday
    itinerary: "Cozumel · Costa Maya · Mahogany Bay (Roatán)",
  },
  {
    cruiseLine: "Carnival Cruise Line",
    ship: "Carnival Glory",
    nights: 7,
    durationLabel: "7-night Western Caribbean",
    departureDay: 0, // Sunday
    itinerary: "Cozumel · Mahogany Bay (Roatán) · Costa Maya",
  },
  {
    cruiseLine: "Carnival Cruise Line",
    ship: "Carnival Freedom",
    nights: 5,
    durationLabel: "4 & 5-night Western Caribbean",
    departureDay: 1, // Monday
    itinerary: "Cozumel · Progreso",
  },
  // ── Royal Caribbean ──
  {
    cruiseLine: "Royal Caribbean",
    ship: "Mariner of the Seas",
    nights: 7,
    durationLabel: "4, 5, 7, 9 & 10-night (thru Oct 2026)",
    departureDay: 0, // Sunday
    itinerary: "Roatán · Costa Maya · Cozumel",
    end: "2026-10-31",
  },
  {
    cruiseLine: "Royal Caribbean",
    ship: "Symphony of the Seas",
    nights: 7,
    durationLabel: "6, 7 & 8-night",
    departureDay: 6, // Saturday
    itinerary: "Roatán · Costa Maya · Cozumel",
    end: "2027-12-31",
  },
  {
    cruiseLine: "Royal Caribbean",
    ship: "Liberty of the Seas",
    nights: 5,
    durationLabel: "4 & 5-night",
    departureDay: 1, // Monday
    itinerary: "Cozumel · Costa Maya",
    start: "2026-10-01",
    end: "2027-12-31",
    seasonalNote: "Begins Oct 2026",
  },
  // ── MSC ──
  {
    cruiseLine: "MSC Cruises",
    ship: "MSC Seascape",
    nights: 7,
    durationLabel: "7-night",
    departureDay: 6, // Saturday
    itinerary: "Ocean Cay · Costa Maya · Cozumel",
  },
  // ── Norwegian ──
  {
    cruiseLine: "Norwegian Cruise Line",
    ship: "Norwegian Viva",
    nights: 7,
    durationLabel: "7 & 14-night (seasonal)",
    departureDay: 0, // Sunday
    itinerary: "Cozumel · Harvest Caye · Roatán · Costa Maya",
    start: "2026-10-01",
    end: "2027-04-30",
    seasonalNote: "Returns Oct 2026 (winter season)",
  },
  // ── Disney ──
  {
    cruiseLine: "Disney Cruise Line",
    ship: "Disney Magic",
    nights: 5,
    durationLabel: "4, 5 & 7-night (seasonal)",
    departureDay: 5, // Friday
    itinerary: "Cozumel · Costa Maya",
    start: "2026-11-01",
    end: "2027-04-30",
    seasonalNote: "Returns Nov 2026 (winter season)",
  },
];

// A real, specifically-published sailing worth showing exactly as advertised.
const KNOWN_SAILINGS: Array<{
  cruiseLine: string;
  ship: string;
  sailingDate: string;
  nights: number;
  itinerary: string;
}> = [
  {
    cruiseLine: "Carnival Cruise Line",
    ship: "Carnival Dream",
    sailingDate: "2026-10-17",
    nights: 14,
    itinerary:
      "Key West · Grand Turk · San Juan · St. Thomas · St. Kitts · St. Maarten · St. Croix · Ocho Rios",
  },
];

const HORIZON_END = "2028-12-31"; // extend inventory through 2028 (incl. Carnival Tropicale)

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return toISO(d);
}

// Representative guarantee (GTY) cabins so each sailing shows bookable inventory.
const CABIN_BASE: Record<CabinCategory, { perNight: number; sqft: number; maxGuests: number }> = {
  Interior: { perNight: 65, sqft: 170, maxGuests: 4 },
  "Ocean View": { perNight: 85, sqft: 190, maxGuests: 4 },
  Balcony: { perNight: 115, sqft: 210, maxGuests: 4 },
  "Mini-Suite": { perNight: 165, sqft: 300, maxGuests: 4 },
  Suite: { perNight: 240, sqft: 500, maxGuests: 5 },
};

function buildCabins(nights: number, idx: number): Cabin[] {
  const cats: CabinCategory[] = ["Interior", "Ocean View", "Balcony", "Suite"];
  return cats.map((type, i) => {
    const base = CABIN_BASE[type];
    return {
      id: generateCabinId() + "-" + idx + "-" + i,
      roomNumber: "GTY",
      deck: 0,
      location: "Midship",
      side: "Both",
      type,
      maxGuests: base.maxGuests,
      sqft: base.sqft,
      price: Math.round(base.perNight * nights),
      status: "available",
      isGuarantee: true,
      notes: DRAFT_TAG,
    };
  });
}

/** Build all draft sailing blocks (runs client-side; uses the current date). */
export function generateDraftBlocks(): SailingBlock[] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const todayISO = toISO(today);
  const horizonEnd = HORIZON_END;

  const blocks: SailingBlock[] = [];
  let idx = 0;

  for (const ship of GALVESTON_FLEET) {
    const winStart = ship.start && ship.start > todayISO ? ship.start : todayISO;
    const winEnd = ship.end && ship.end < horizonEnd ? ship.end : horizonEnd;
    if (winStart > winEnd) continue;

    // first departure on/after winStart matching departureDay
    const cursor = new Date(winStart + "T12:00:00");
    while (cursor.getDay() !== ship.departureDay) {
      cursor.setDate(cursor.getDate() + 1);
    }
    const cadence = ship.cadenceDays ?? 7;

    while (toISO(cursor) <= winEnd) {
      const sailingDate = toISO(cursor);
      idx++;
      blocks.push({
        id: generateBlockId() + "-" + idx,
        createdAt: "",
        ship: ship.ship,
        cruiseLine: ship.cruiseLine,
        sailingDate,
        returnDate: addDays(sailingDate, ship.nights),
        nights: ship.nights,
        itinerary: ship.itinerary,
        cabins: buildCabins(ship.nights, idx),
        notes: ship.published
          ? "Published Carnival schedule — weekly Saturday departures from Galveston (galvestoncruises.com / Carnival)."
          : ship.seasonalNote
          ? `${DRAFT_NOTE} (${ship.seasonalNote})`
          : DRAFT_NOTE,
      });
      cursor.setDate(cursor.getDate() + cadence);
    }
  }

  // Add the specifically-published known sailings (real dates).
  for (const k of KNOWN_SAILINGS) {
    idx++;
    blocks.push({
      id: generateBlockId() + "-" + idx,
      createdAt: "",
      ship: k.ship,
      cruiseLine: k.cruiseLine,
      sailingDate: k.sailingDate,
      returnDate: addDays(k.sailingDate, k.nights),
      nights: k.nights,
      itinerary: k.itinerary,
      cabins: buildCabins(k.nights, idx),
      notes: "Published itinerary (galvestoncruises.com).",
    });
  }

  return blocks;
}

export function isDraftBlock(notes?: string): boolean {
  return !!notes && notes.startsWith(DRAFT_TAG);
}

/**
 * Seed the live inventory: batched upsert of all generated blocks + cabins.
 * Returns counts. Idempotent-ish (new ids each run; use the admin "clear drafts"
 * if you re-seed to avoid duplicates).
 */
export async function seedInventory(): Promise<{ blocks: number; cabins: number }> {
  const blocks = generateDraftBlocks();

  const blockRows = blocks.map((b) => ({
    id: b.id,
    ship: b.ship,
    cruise_line: b.cruiseLine,
    sailing_date: b.sailingDate,
    return_date: b.returnDate,
    nights: b.nights,
    itinerary: b.itinerary,
    notes: b.notes,
  }));

  const cabinRows = blocks.flatMap((b) =>
    b.cabins.map((c) => ({
      id: c.id,
      block_id: b.id,
      room_number: c.roomNumber,
      deck: c.deck,
      location: c.location,
      side: c.side,
      type: c.type,
      max_guests: c.maxGuests,
      sqft: c.sqft,
      price: c.price,
      status: c.status,
      is_guarantee: true,
      notes: c.notes,
    }))
  );

  const { error: be } = await supabase.from("sailing_blocks").upsert(blockRows);
  if (be) throw new Error(be.message);
  const { error: ce } = await supabase.from("cabins").upsert(cabinRows);
  if (ce) throw new Error(ce.message);

  return { blocks: blockRows.length, cabins: cabinRows.length };
}

/** Remove every draft block this seed created (and their cabins via cascade). */
export async function clearDraftInventory(): Promise<number> {
  const { data } = await supabase
    .from("sailing_blocks")
    .select("id, notes")
    .like("notes", `${DRAFT_TAG}%`);
  const ids = (data ?? []).map((r) => r.id as string);
  if (ids.length === 0) return 0;
  await supabase.from("sailing_blocks").delete().in("id", ids);
  return ids.length;
}
