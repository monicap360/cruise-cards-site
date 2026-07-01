// Group air travel — shown on the group portal so members see the shared flight
// plan at a glance. Keyed by group code. Add a group's info here and the "Flight
// Schedule" section appears automatically on their portal.

export type FlightLeg = {
  label: string;        // "Outbound" / "Return"
  date: string;         // "Wed, Jul 29, 2026"
  from: string;         // "HOU"
  to: string;           // "SEA"
  departTime: string;   // "6:00 AM"
  arriveTime: string;   // "10:20 AM"
  arriveNote?: string;  // "Arrives Fri, Aug 7 (+1 day)"
  duration: string;     // "6h 20m"
  stop: string;         // "1h 0m stop in Dallas (DAL)"
  flights: string[];    // ["Southwest 1636 · HOU–DAL", ...]
};

export type GroupFlightInfo = {
  airline: string;
  confirmation: string;
  passengers?: number;
  legs: FlightLeg[];
  priceDisclaimer?: string;
  paidInFull?: boolean;
  statusNote?: string;
  // Per-traveler confirmation numbers (Southwest issues these per traveler set).
  // Blank confirmation = still being issued.
  travelerConfirmations?: { name: string; confirmation: string }[];
};

export const GROUP_FLIGHTS: Record<string, GroupFlightInfo> = {
  "gabby-group": {
    airline: "Southwest",
    confirmation: "",
    passengers: 5,
    paidInFull: true,
    statusNote:
      "Everyone is ticketed and paid in full. We're simply moving each traveler out of the group block into their own Southwest booking so you can view and manage your flights directly at southwest.com. Individual confirmation numbers appear in the table below as they're issued — same flights, same times, no action needed.",
    travelerConfirmations: [
      { name: "Gabriela Lopez & Ty Munsch", confirmation: "CGEGLG" },
      { name: "Peter Von Marensdorff", confirmation: "" },
      { name: "Kristin Munsch", confirmation: "" },
      { name: "Stacy Munsch", confirmation: "" },
    ],
    priceDisclaimer:
      "The total group price includes all government-imposed taxes and fees, including the September 11th Security Fee, and applicable international taxes and fees, effective as of the date of the Group Travel Agreement.",
    legs: [
      {
        label: "Outbound",
        date: "Wed, Jul 29, 2026",
        from: "HOU",
        to: "SEA",
        departTime: "6:00 AM",
        arriveTime: "10:20 AM",
        duration: "6h 20m",
        stop: "1h 0m stop in Dallas (DAL)",
        flights: ["Southwest 1636 · HOU–DAL", "Southwest 1396 · DAL–SEA"],
      },
      {
        label: "Return",
        date: "Thu, Aug 6, 2026",
        from: "SEA",
        to: "HOU",
        departTime: "2:35 PM",
        arriveTime: "1:15 AM",
        arriveNote: "Arrives Fri, Aug 7 (+1 day)",
        duration: "8h 40m",
        stop: "3h 0m stop in Las Vegas (LAS)",
        flights: ["Southwest 393 · SEA–LAS", "Southwest 2172 · LAS–HOU"],
      },
    ],
  },
};

export function groupFlightInfo(code: string): GroupFlightInfo | null {
  return GROUP_FLIGHTS[code] ?? null;
}
