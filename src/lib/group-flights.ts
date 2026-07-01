// Group air travel — shown on the group portal so members see the shared flight
// plan at a glance. Keyed by group code. Add a group's info here and the "Flight
// Schedule" section appears automatically on their portal.

export type FlightSegment = {
  flightNo: string;   // "WN 2062"
  from: string;       // "HOU"
  to: string;         // "PHX"
  departTime: string; // "6:25 AM"
  arriveTime: string; // "7:00 AM"
};

export type FlightLeg = {
  label: string;        // "Outbound" / "Return"
  date: string;         // "Tue, Jul 29, 2026"
  segments: FlightSegment[];
  note?: string;        // e.g. "Arrives next day"
  summary?: string;     // shown when detailed segments aren't in yet
};

export type GroupFlightInfo = {
  airline: string;
  confirmation: string;
  passengers?: number;
  legs: FlightLeg[];
  priceDisclaimer?: string;
};

export const GROUP_FLIGHTS: Record<string, GroupFlightInfo> = {
  "gabby-group": {
    airline: "Southwest",
    confirmation: "401417",
    passengers: 10,
    priceDisclaimer:
      "The total group price includes all government-imposed taxes and fees, including the September 11th Security Fee, and applicable international taxes and fees, effective as of the date of the Group Travel Agreement.",
    legs: [
      {
        label: "Outbound",
        date: "Tue, Jul 29, 2026",
        segments: [
          { flightNo: "WN 2062", from: "HOU", to: "PHX", departTime: "6:25 AM", arriveTime: "7:00 AM" },
          { flightNo: "WN 3330", from: "PHX", to: "SEA", departTime: "8:10 AM", arriveTime: "11:15 AM" },
        ],
      },
      {
        label: "Return",
        date: "Thu, Aug 6, 2026",
        note: "Overnight connection — arrives Houston Fri, Aug 7 at 12:15 AM.",
        segments: [
          { flightNo: "WN 4697", from: "SEA", to: "DEN", departTime: "3:45 PM", arriveTime: "7:30 PM" },
          { flightNo: "WN 3273", from: "DEN", to: "HOU", departTime: "8:50 PM", arriveTime: "12:15 AM +1" },
        ],
      },
    ],
  },
};

export function groupFlightInfo(code: string): GroupFlightInfo | null {
  return GROUP_FLIGHTS[code] ?? null;
}
