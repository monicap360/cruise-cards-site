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
  itineraryDays?: { day: number; date: string; port: string; note?: string }[];
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
    // Typical Carnival Miracle 7-day Alaska (Seattle round-trip). Confirm exact
    // ports & times on your cruise documents.
    itineraryDays: [
      { day: 1, date: "Thu, Jul 30", port: "Seattle, WA", note: "Depart" },
      { day: 2, date: "Fri, Jul 31", port: "Cruising the Inside Passage", note: "Scenic sea day" },
      { day: 3, date: "Sat, Aug 1", port: "Juneau, AK" },
      { day: 4, date: "Sun, Aug 2", port: "Skagway, AK" },
      { day: 5, date: "Mon, Aug 3", port: "Tracy Arm / Endicott Arm — Dawes Glacier", note: "Scenic glacier cruising" },
      { day: 6, date: "Tue, Aug 4", port: "Ketchikan, AK" },
      { day: 7, date: "Wed, Aug 5", port: "Victoria, BC (Canada)" },
      { day: 8, date: "Thu, Aug 6", port: "Seattle, WA", note: "Return" },
    ],
  },
};

export function cruiseForGroup(code: string): GroupCruise | null {
  return GROUP_CRUISE[code] ?? null;
}
