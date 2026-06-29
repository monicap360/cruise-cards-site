// Featured group sailings — shared by the public signup form (/group-signup)
// and the group-leader portal (/group-leader). Add an entry to run another group.
export type GroupSailing = {
  key: string;
  label: string; // must match the group_label stored on signups rows
  displayName?: string; // friendly group name shown in the portal header
  depositId?: string; // links to a group_deposits row for live deposit/balance
  ship: string;
  line: string;
  sailDate: string; // YYYY-MM-DD
  returnDate: string;
  nights: number;
  port: string;
  itinerary: string;
  destSlug: string; // hero photo
  blurb: string;
};

export const GROUP_SAILINGS: GroupSailing[] = [
  {
    key: "thanksgiving-2026",
    label: "Thanksgiving 2026 — Liberty of the Seas",
    displayName: "Alston Family Group",
    depositId: "gd-yenalston",
    ship: "Liberty of the Seas",
    line: "Royal Caribbean",
    sailDate: "2026-11-23",
    returnDate: "2026-11-28",
    nights: 5,
    port: "Galveston",
    itinerary: "Western Caribbean",
    destSlug: "cozumel",
    blurb: "5 nights round-trip from Galveston · Nov 23–28, 2026",
  },
];

export function getGroupSailing(label: string): GroupSailing | null {
  return GROUP_SAILINGS.find((g) => g.label === label) ?? null;
}

// A group's leader-portal PIN = 2-digit departure month + 2-digit day (MMDD).
// e.g. sailDate "2026-11-23" → "1123".
export function pinFor(g: GroupSailing): string {
  const p = g.sailDate.split("-"); // [yyyy, mm, dd]
  return p.length === 3 ? p[1] + p[2] : "";
}

export function getGroupByPin(pin: string): GroupSailing | null {
  const clean = pin.trim();
  if (!clean) return null;
  return GROUP_SAILINGS.find((g) => pinFor(g) === clean) ?? null;
}

export const FEATURED_GROUP = GROUP_SAILINGS[0];
