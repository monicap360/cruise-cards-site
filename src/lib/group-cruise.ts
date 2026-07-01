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
  itineraryDays?: { day: number; date: string; port: string; note?: string; photo?: string }[];
  staterooms?: { number: string; guests: string; detail?: string }[];
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
    stateroom: "4132 & 4220",
    cabinDetail: "Obstructed View Window · Cat 4K (Interior)",
    paidInFull: true,
    // Typical Carnival Miracle 7-day Alaska (Seattle round-trip). Confirm exact
    // ports & times on your cruise documents.
    itineraryDays: [
      { day: 1, date: "Thu, Jul 30", port: "Seattle, WA", note: "Depart", photo: "/destinations/seattle.jpg" },
      { day: 2, date: "Fri, Jul 31", port: "Cruising the Inside Passage", note: "Scenic sea day", photo: "/destinations/alaska.jpg" },
      { day: 3, date: "Sat, Aug 1", port: "Juneau, AK", photo: "/destinations/juneau.jpg" },
      { day: 4, date: "Sun, Aug 2", port: "Skagway, AK", photo: "/destinations/skagway.jpg" },
      { day: 5, date: "Mon, Aug 3", port: "Tracy Arm / Endicott Arm — Dawes Glacier", note: "Scenic glacier cruising", photo: "/destinations/tracy-arm.jpg" },
      { day: 6, date: "Tue, Aug 4", port: "Ketchikan, AK", photo: "/destinations/ketchikan.jpg" },
      { day: 7, date: "Wed, Aug 5", port: "Victoria, BC (Canada)", photo: "/destinations/victoria-bc.jpg" },
      { day: 8, date: "Thu, Aug 6", port: "Seattle, WA", note: "Return", photo: "/destinations/seattle.jpg" },
    ],
  },
};

export function cruiseForGroup(code: string): GroupCruise | null {
  return GROUP_CRUISE[code] ?? null;
}
