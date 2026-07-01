// Group air travel — shown on the group portal so members see the shared flight
// plan at a glance. Keyed by group code. Add a group's legs here and the "Flight
// Schedule" section appears automatically on their portal.

export type FlightLeg = {
  label: string;   // "Outbound" / "Return"
  date: string;    // "Tue, July 29, 2026"
  airline: string; // "Southwest"
  depart: string;  // "6:25 AM"
  arrive: string;  // "11:15 AM" (blank if unknown)
  stops: string;   // "Nonstop" or "1 stop — change in Denver (DEN)"
};

export const GROUP_FLIGHTS: Record<string, FlightLeg[]> = {
  "gabby-group": [
    {
      label: "Outbound",
      date: "Tue, July 29, 2026",
      airline: "Southwest",
      depart: "6:25 AM",
      arrive: "11:15 AM",
      stops: "Nonstop",
    },
    {
      label: "Return",
      date: "Thu, Aug 6, 2026",
      airline: "Southwest",
      depart: "3:45 PM",
      arrive: "",
      stops: "1 stop — change of planes in Denver (DEN)",
    },
  ],
};

export function flightsForGroup(code: string): FlightLeg[] {
  return GROUP_FLIGHTS[code] ?? [];
}
