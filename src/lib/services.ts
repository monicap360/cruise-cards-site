// In-house services offered at the Cruise Experience Center.
// `free: true` = included / no charge. Paid services carry a price.
// NOTE: paid prices below are PLACEHOLDERS — confirm & adjust to your real rates.

export type InHouseService = {
  name: string;
  free: boolean;
  price?: number; // for paid services
  unit?: string; // e.g. "per day", "per bag", "per page"
  note?: string;
  category: "Documents & Check-In" | "Mobility & Accessibility" | "Comfort & Convenience" | "Embark-Day Extras";
};

export const IN_HOUSE_SERVICES: InHouseService[] = [
  // ── Free / included ──
  { name: "Boarding pass printing", free: true, category: "Documents & Check-In" },
  { name: "Luggage tag printing", free: true, category: "Documents & Check-In" },
  { name: "Online check-in help", free: true, category: "Documents & Check-In" },
  { name: "Travel-document review", free: true, category: "Documents & Check-In" },
  { name: "Cruise planning consultation", free: true, category: "Documents & Check-In" },
  { name: "Balance & payment assistance", free: true, category: "Documents & Check-In" },
  { name: "Wi-Fi & charging stations", free: true, category: "Comfort & Convenience" },
  { name: "Waiting lounge & ship videos", free: true, category: "Comfort & Convenience" },

  // ── Paid (placeholder prices — update these) ──
  { name: "Mobility scooter rental", free: false, price: 45, unit: "per day", category: "Mobility & Accessibility" },
  { name: "Wheelchair rental", free: false, price: 25, unit: "per day", category: "Mobility & Accessibility" },
  { name: "Luggage storage (Bag Drop & Stow)", free: false, price: 10, unit: "per bag", category: "Comfort & Convenience" },
  { name: "Passport photos", free: false, price: 15, category: "Documents & Check-In" },
  { name: "Printing & copies", free: false, price: 1, unit: "per page", category: "Documents & Check-In" },
  { name: "Custom luggage tags & lamination", free: false, price: 5, category: "Documents & Check-In" },
  { name: "Notary service", free: false, price: 10, category: "Documents & Check-In" },
  { name: "Port shuttle / transfer", free: false, price: 8, unit: "per person", category: "Comfort & Convenience" },
  { name: "Anchors Essentials (sundries)", free: false, note: "priced per item", category: "Embark-Day Extras" },
  { name: "Travel SIM / eSIM", free: false, note: "priced per plan", category: "Embark-Day Extras" },
];

export const SERVICE_CATEGORIES = [
  "Documents & Check-In",
  "Mobility & Accessibility",
  "Comfort & Convenience",
  "Embark-Day Extras",
] as const;
