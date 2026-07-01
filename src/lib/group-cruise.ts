// Per-group cruise summary (ship, itinerary, group booking #) shown as a
// "Cruise Details" card on the group portal. Keyed by group code.

export type GroupCruise = {
  bookingNumber: string;
  ship: string;
  line: string;
  nights: number;
  itinerary: string;
  embarkPort: string;
  sailDate: string;   // display text
  returnDate: string; // display text
  stateroom?: string;
  cabinDetail?: string; // e.g. "Obstructed View Window · Cat 4K (Interior)"
  paidInFull?: boolean;
};

export const GROUP_CRUISE: Record<string, GroupCruise> = {
  "gabby-group": {
    bookingNumber: "PB01B5",
    ship: "Carnival Miracle",
    line: "Carnival Cruise Line",
    nights: 7,
    itinerary: "Inside Passage & Glacier",
    embarkPort: "Seattle",
    sailDate: "Thu, Jul 30, 2026",
    returnDate: "Thu, Aug 6, 2026",
    stateroom: "4132",
    cabinDetail: "Obstructed View Window · Cat 4K (Interior)",
    paidInFull: true,
  },
};

export function cruiseForGroup(code: string): GroupCruise | null {
  return GROUP_CRUISE[code] ?? null;
}
