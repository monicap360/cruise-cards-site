import { supabase } from "@/lib/supabase";

// Group add-on orders (soda, drink package, prepaid tips, protection, pre-cruise
// hotel). Saved to `group_orders`; the front desk works them like a queue.

export type GroupOrder = {
  id: string;
  groupCode: string;
  item: string; // slug, e.g. "tips"
  itemLabel: string;
  room: string;
  cabin: string;
  name: string;
  phone: string;
  qty: number;
  notes: string;
  status: string;
  createdAt?: string;
};

export const newOrderId = () => "ord-" + Math.random().toString(36).slice(2, 9);

// Cruise terminal parking, priced by cruise length (nights).
export function parkingPrice(nights: number): number {
  const table: Record<number, number> = { 4: 55, 5: 65, 6: 75, 7: 99, 8: 110 };
  if (nights <= 4) return 55;
  if (nights >= 8) return 110;
  return table[nights] ?? 0;
}

export type OrderItem = {
  label: string;
  emoji: string;
  desc: string;
  priceNote: string;
  qty?: boolean; // show a quantity field
  ack?: string; // if set, a required acknowledgment the guest must accept
  notePrompt?: string; // placeholder for the notes field
};

export const ORDER_ITEMS: Record<string, OrderItem> = {
  soda: {
    label: "Soda 12-pack",
    emoji: "🥤",
    desc: "A 12-pack of canned sodas — pick up at our Galveston Experience Center before you sail.",
    priceNote: "Confirmed at pickup",
    qty: true,
  },
  drink: {
    label: "Drink package",
    emoji: "🍹",
    desc: "Deluxe Beverage, Refreshment, or Classic Soda package — add before you sail and save.",
    priceNote: "We'll send daily price options to confirm",
  },
  tips: {
    label: "Prepay gratuities",
    emoji: "💵",
    desc: "Prepay your onboard gratuities so it's done before you board.",
    priceNote: "$18 per guest, per day",
  },
  protection: {
    label: "Vacation protection",
    emoji: "🛡️",
    desc: "Add travel protection for your cabin — covers cancellation per the plan terms.",
    priceNote: "Priced by cruise fare — we'll confirm",
  },
  hotel: {
    label: "Pre-cruise hotel (Harbor House)",
    emoji: "🏨",
    desc: "A night at the Harbor House Hotel & Marina (Pier 21) before you sail — steps from the terminal.",
    priceNote: "Group rates pending",
  },
  travel: {
    label: "How are you getting here?",
    emoji: "🧭",
    desc: "Let us know if you're flying or driving in (and your vehicle) so we can plan parking and transfers.",
    priceNote: "Helps us plan Park & Ride",
  },
  parking: {
    label: "Cruise parking",
    emoji: "🅿️",
    desc: "Reserve parking for your whole sailing — price is per vehicle, by cruise length.",
    priceNote: "Per vehicle · by cruise length",
  },
  move: {
    label: "Move / upgrade room",
    emoji: "🔀",
    desc: "Request to move or upgrade your stateroom, subject to availability.",
    priceNote: "Upgrade fee / rate difference may apply",
    notePrompt: "What you'd like (e.g. upgrade to balcony, move near another cabin)…",
    ack: "I understand any room move or upgrade is subject to availability and I'll pay the quoted rate difference or upgrade fee.",
  },
  namechange: {
    label: "Name change",
    emoji: "✏️",
    desc: "Request a guest name change on this reservation.",
    priceNote: "$150 name-change fee",
    notePrompt: "Name to remove → new name (exactly as on ID) and DOB…",
    ack: "I understand a $150 name-change fee applies (plus any airline fees for air bookings), and that name changes may affect fares or seat assignments.",
  },
  cancel: {
    label: "Cancel a passenger",
    emoji: "⚠️",
    desc: "Request to cancel a passenger on this reservation.",
    priceNote: "Cancellation penalties apply",
    notePrompt: "Which passenger to cancel, and the reason…",
    ack: "I understand cancellation penalties apply per the cruise line schedule — 25% (89–75 days before sailing), 50% (74–61), 75% (60–31), and 100% (30–0 days) — and I authorize this cancellation request.",
  },
  decline: {
    label: "Decline vacation protection",
    emoji: "🛡️",
    desc: "Decline travel protection for this cabin.",
    priceNote: "No coverage",
    ack: "I decline vacation protection and understand cancellation penalties will apply with no insurance reimbursement.",
  },
  cancelroom: {
    label: "Cancel a room",
    emoji: "❌",
    desc: "Request to cancel this entire stateroom.",
    priceNote: "Cancellation penalties apply",
    notePrompt: "Reason for cancelling this room…",
    ack: "I understand cancellation penalties apply per the cruise line schedule — 25% (89–75 days before sailing), 50% (74–61), 75% (60–31), and 100% (30–0 days) — and I authorize cancellation of this room.",
  },
  correction: {
    label: "Correct a name / DOB",
    emoji: "🪪",
    desc: "Fix a misspelled name or an incorrect date of birth on this reservation.",
    priceNote: "Typo corrections — usually no fee",
    notePrompt: "What needs correcting (current spelling/DOB → correct spelling/DOB)…",
    ack: "I confirm this is a correction of a spelling or date-of-birth error (not a different guest). I understand the cruise line must approve corrections, and if it's treated as a name change a $150 fee may apply.",
  },
  rebook: {
    label: "Rebook a room",
    emoji: "🔄",
    desc: "Cancel and rebook this stateroom for different dates, occupancy, or category.",
    priceNote: "Repriced at market rate + $250 fee",
    notePrompt: "What you'd like to rebook (dates, category, guests)…",
    ack: "I understand that rebooking requires the room to be repriced at the cruise line's market rates in effect at the time of rebooking — this is the cruise line's rule, not Cruises from Galveston's — and that a $250 rebooking fee applies.",
  },
};

function toOrder(r: Record<string, unknown>): GroupOrder {
  return {
    id: r.id as string,
    groupCode: (r.group_code as string) ?? "",
    item: (r.item as string) ?? "",
    itemLabel: (r.item_label as string) ?? "",
    room: (r.room as string) ?? "",
    cabin: (r.cabin as string) ?? "",
    name: (r.name as string) ?? "",
    phone: (r.phone as string) ?? "",
    qty: Number(r.qty) || 1,
    notes: (r.notes as string) ?? "",
    status: (r.status as string) ?? "New",
    createdAt: (r.created_at as string) ?? "",
  };
}

export async function getOrders(groupCode: string): Promise<GroupOrder[]> {
  const { data, error } = await supabase
    .from("group_orders")
    .select("*")
    .eq("group_code", groupCode)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toOrder);
}

export async function getAllOrders(): Promise<GroupOrder[]> {
  const { data, error } = await supabase
    .from("group_orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toOrder);
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await supabase.from("group_orders").update({ status }).eq("id", id);
}

export async function saveOrder(o: GroupOrder): Promise<boolean> {
  const { error } = await supabase.from("group_orders").insert({
    id: o.id,
    group_code: o.groupCode,
    item: o.item,
    item_label: o.itemLabel,
    room: o.room || null,
    cabin: o.cabin || null,
    name: o.name || null,
    phone: o.phone || null,
    qty: o.qty || 1,
    notes: o.notes || null,
    status: "New",
  });
  return !error;
}
