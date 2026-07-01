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
  itineraryDays?: { day: number; date: string; port: string; note?: string; photo?: string; things?: string[] }[];
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
      {
        day: 1, date: "Thu, Jul 30", port: "Seattle, WA", note: "Depart", photo: "/destinations/seattle.jpg",
        things: ["Board & settle into your cabin", "Explore the top decks as you sail", "Pike Place Market before boarding (if time)"],
      },
      {
        day: 2, date: "Fri, Jul 31", port: "Cruising the Inside Passage", note: "Scenic sea day", photo: "/destinations/alaska.jpg",
        things: ["Watch for whales, eagles & sea lions from deck", "Enjoy onboard shows, spa & dining", "Bundle up for glacier-country views"],
      },
      {
        day: 3, date: "Sat, Aug 1", port: "Juneau, AK", photo: "/destinations/juneau.jpg",
        things: ["Mendenhall Glacier & Nugget Falls", "Whale-watching boat tour", "Mount Roberts Tramway", "Alaskan salmon bake"],
      },
      {
        day: 4, date: "Sun, Aug 2", port: "Skagway, AK", photo: "/destinations/skagway.jpg",
        things: ["White Pass & Yukon Route scenic railroad", "Klondike Gold Rush history walk", "Red Onion Saloon", "Bike or hike the trails"],
      },
      {
        day: 5, date: "Mon, Aug 3", port: "Tracy Arm / Endicott Arm — Dawes Glacier", note: "Scenic glacier cruising", photo: "/destinations/tracy-arm.jpg",
        things: ["Stay on deck for the glacier approach", "Spot seals resting on icebergs", "Photograph Dawes Glacier calving"],
      },
      {
        day: 6, date: "Tue, Aug 4", port: "Ketchikan, AK", photo: "/destinations/ketchikan.jpg",
        things: ["Historic Creek Street", "Totem poles at Totem Bight", "Misty Fjords flightseeing", "Great Alaskan Lumberjack Show"],
      },
      {
        day: 7, date: "Wed, Aug 5", port: "Victoria, BC (Canada)", photo: "/destinations/victoria-bc.jpg",
        things: ["Butchart Gardens", "Inner Harbour & Fairmont Empress", "Afternoon high tea", "Whale-watching Zodiac tour"],
      },
      {
        day: 8, date: "Thu, Aug 6", port: "Seattle, WA", note: "Return", photo: "/destinations/seattle.jpg",
        things: ["Disembark & head home", "Space Needle or Pike Place if you stay", "Grab coffee at the original Starbucks"],
      },
    ],
  },
};

export function cruiseForGroup(code: string): GroupCruise | null {
  return GROUP_CRUISE[code] ?? null;
}
