import { supabase } from "@/lib/supabase";

export type Offer = {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: string;
  active: boolean;
  sortOrder: number;
  // Optional targeting rules. Empty/blank = applies to all sailings.
  cruiseLine?: string; // exact cruise line, or "" for any
  nights?: number | null; // exact length, or null for any
  dateStart?: string; // YYYY-MM-DD sail-date window start, or ""
  dateEnd?: string; // YYYY-MM-DD window end, or ""
};

export function newOfferId(): string {
  return "off-" + Math.random().toString(36).slice(2, 9);
}

// Shown when no offers are configured yet (or the table isn't reachable).
export const DEFAULT_OFFERS: Offer[] = [
  { id: "def-nonref", icon: "🔒", badge: "Lowest Fare", title: "Prepaid Non-Refundable Rate", description: "Lock the lowest available fare with a non-refundable deposit — the best price when your plans are set.", active: true, sortOrder: 1 },
  { id: "def-tips", icon: "🤝", badge: "No Surprises", title: "Prepaid Gratuities", description: "Prepay crew appreciation now at today's rate — nothing left to settle onboard.", active: true, sortOrder: 2 },
  { id: "def-obc", icon: "💳", badge: "Spend Onboard", title: "Onboard Credit", description: "Add onboard credit to use for specialty dining, drinks, excursions, the spa, or the shops.", active: true, sortOrder: 3 },
  { id: "def-drinks", icon: "🍹", badge: "Cheers", title: "Drink Package Deal", description: "Bundle a beverage package at a preferred rate — unlimited sips at sea, one easy price.", active: true, sortOrder: 4 },
  { id: "def-wifi", icon: "📶", badge: "Stay Connected", title: "Wi-Fi Package", description: "Add an internet plan so you can share the trip and stay reachable in port and at sea.", active: true, sortOrder: 5 },
  { id: "def-guests", icon: "👨‍👩‍👧‍👦", badge: "Bring The Crew", title: "3rd & 4th Guest Savings", description: "Add friends or kids to the same stateroom at reduced add-a-guest rates.", active: true, sortOrder: 6 },
];

function toOffer(row: Record<string, unknown>): Offer {
  return {
    id: row.id as string,
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    badge: (row.badge as string) ?? "",
    icon: (row.icon as string) ?? "🎁",
    active: (row.active as boolean) ?? true,
    sortOrder: (row.sort_order as number) ?? 0,
    cruiseLine: (row.cruise_line as string) ?? "",
    nights: (row.nights as number) ?? null,
    dateStart: (row.date_start as string) ?? "",
    dateEnd: (row.date_end as string) ?? "",
  };
}

function toRow(o: Offer): Record<string, unknown> {
  return {
    id: o.id,
    title: o.title,
    description: o.description,
    badge: o.badge,
    icon: o.icon,
    active: o.active,
    sort_order: o.sortOrder,
    cruise_line: o.cruiseLine || null,
    nights: o.nights ?? null,
    date_start: o.dateStart || null,
    date_end: o.dateEnd || null,
  };
}

// All offers (active + inactive) for the admin manager.
export async function getAllOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data.map(toOffer);
}

// Active offers for the public site. Falls back to DEFAULT_OFFERS when the
// table is empty or unreachable, so the section always has content.
export async function getActiveOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) return DEFAULT_OFFERS;
  if (!data || data.length === 0) return DEFAULT_OFFERS;
  return data.map(toOffer);
}

export function matchesSailing(
  o: Offer,
  s: { cruiseLine: string; sailingDate: string; nights: number }
): boolean {
  if (o.cruiseLine && o.cruiseLine !== s.cruiseLine) return false;
  if (o.nights && o.nights !== s.nights) return false;
  if (o.dateStart && s.sailingDate < o.dateStart) return false;
  if (o.dateEnd && s.sailingDate > o.dateEnd) return false;
  return true;
}

export async function getOffersForSailing(s: {
  cruiseLine: string;
  sailingDate: string;
  nights: number;
}): Promise<Offer[]> {
  const all = await getActiveOffers();
  return all.filter((o) => matchesSailing(o, s));
}

export async function saveOffer(o: Offer): Promise<boolean> {
  const { error } = await supabase.from("offers").upsert(toRow(o));
  return !error;
}

export async function deleteOffer(id: string): Promise<void> {
  await supabase.from("offers").delete().eq("id", id);
}

export async function setOfferActive(
  id: string,
  active: boolean
): Promise<void> {
  await supabase.from("offers").update({ active }).eq("id", id);
}
