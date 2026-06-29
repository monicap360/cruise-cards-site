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

export type OrderItem = {
  label: string;
  emoji: string;
  desc: string;
  priceNote: string;
  qty?: boolean; // show a quantity field
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
