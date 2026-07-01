// Agent / Cruise Director of Sales profiles — bio, specialties, schedule, booking.
// Matched to a group by the director's name. Edit here to update a profile.

export type Agent = {
  slug: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  specialties: string[];
  schedule: { day: string; hours: string }[];
  offDays: number[]; // 0=Sun … 6=Sat — status auto-shows "Off today" on these days
  bookingUrl: string;
  phone: string;
  email: string;
};

export const AGENTS: Agent[] = [
  {
    slug: "monica",
    name: "Monica",
    title: "Cruise Director of Sales",
    tagline: "Your dedicated Galveston cruise specialist",
    bio:
      "Monica is the heart of Cruises from Galveston — a Galveston-based specialist who's helped hundreds of families, friends, and reunion groups set sail from the island. She knows every ship at the Port of Galveston, loves matching first-time cruisers to their perfect cabin, and personally handles your group from the first quote all the way to sail day.",
    specialties: [
      "Group & family cruises",
      "Galveston departures",
      "First-time cruisers",
      "Payment plans (Sea Pay)",
      "Shore excursions & add-ons",
      "Accessibility & special needs",
    ],
    schedule: [
      { day: "Mon – Wed", hours: "7:30 AM – 7:00 PM CT" },
      { day: "Thu – Fri", hours: "Off" },
      { day: "Saturday", hours: "By appointment" },
      { day: "Sunday", hours: "7:30 AM – 2:30 PM CT" },
    ],
    offDays: [4, 5], // Thursday & Friday
    bookingUrl: "/book-a-call",
    phone: "(409) 632-2106",
    email: "cruisesfromgalveston.texas@gmail.com",
  },
];

export function agentByName(name: string): Agent | undefined {
  const n = (name || "").trim().toLowerCase();
  if (!n) return undefined;
  return AGENTS.find((a) => a.name.toLowerCase() === n || a.slug === n);
}

export function agentBySlug(slug: string): Agent | undefined {
  return AGENTS.find((a) => a.slug === (slug || "").toLowerCase());
}
