// ── Cruise Countdown — the daily-return hook ─────────────────────────────────
// A personal countdown to sail day, with milestones that UNLOCK as the date
// approaches (final payment, check-in opens, luggage tags, etc.). Each unlock is
// a little reason to come back. Day offsets are general guides — exact windows
// vary by cruise line.

export type Milestone = {
  daysBefore: number;
  title: string;
  blurb: string;
  href?: string;
};

// Ordered far → near (sail day last).
export const MILESTONES: Milestone[] = [
  {
    daysBefore: 90,
    title: "Final Payment Due",
    blurb:
      "Your cruise balance is typically due around now — or split it into easy payments with Sea Pay™.",
    href: "/sea-pay",
  },
  {
    daysBefore: 60,
    title: "Plan Your Ports",
    blurb: "Scout the excursions and must-do adventures at every stop.",
    href: "/destinations",
  },
  {
    daysBefore: 45,
    title: "Get Documents Ready",
    blurb:
      "Passports, birth certificates, and IDs — make sure everyone in your party is set.",
  },
  {
    daysBefore: 30,
    title: "Reserve Dining & Excursions",
    blurb:
      "Lock specialty dining and the best shore excursions before they sell out.",
    href: "/add-ons#tours",
  },
  {
    daysBefore: 14,
    title: "Online Check-In Opens",
    blurb:
      "Check in, choose your arrival time, and download your boarding pass.",
  },
  {
    daysBefore: 7,
    title: "One Week Out",
    blurb:
      "Confirm parking, hotel, and transfers — and start your packing list.",
    href: "/add-ons",
  },
  {
    daysBefore: 3,
    title: "Print Luggage Tags",
    blurb: "Print your luggage tags + boarding passes and finish packing.",
  },
  {
    daysBefore: 2,
    title: "Last Call: Drinks & Wi-Fi",
    blurb:
      "Pre-purchase deadlines for beverage and Wi-Fi packages are coming up.",
  },
  {
    daysBefore: 1,
    title: "Eve of Sail",
    blurb:
      "Lay out your documents and get a good night's sleep — you sail tomorrow!",
  },
  {
    daysBefore: 0,
    title: "Set Sail Day",
    blurb: "Cruises Start Here. Head to the terminal — bon voyage!",
  },
];

const DAY = 86_400_000;

/** Sail "moment" — mid-afternoon local on the sail date. */
export function sailDateMs(sailDate: string): number {
  return new Date(sailDate + "T16:00:00").getTime();
}

export type ComputedMilestone = Milestone & {
  dateMs: number;
  unlocked: boolean;
  daysUntil: number; // to the milestone date; <= 0 once unlocked
};

export function computeMilestones(
  sailDate: string,
  nowMs: number
): ComputedMilestone[] {
  const sMs = sailDateMs(sailDate);
  return MILESTONES.map((m) => {
    const dateMs = sMs - m.daysBefore * DAY;
    const diff = dateMs - nowMs;
    return {
      ...m,
      dateMs,
      unlocked: diff <= 0,
      daysUntil: Math.ceil(diff / DAY),
    };
  });
}

/** The next milestone that hasn't unlocked yet — the "coming up" hook. */
export function nextMilestone(
  list: ComputedMilestone[]
): ComputedMilestone | undefined {
  return list.find((m) => !m.unlocked);
}

export type Countdown = {
  sailed: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function countdownTo(sailDate: string, nowMs: number): Countdown {
  const diff = sailDateMs(sailDate) - nowMs;
  if (diff <= 0) {
    return { sailed: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    sailed: false,
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}
