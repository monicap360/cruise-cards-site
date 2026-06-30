import { supabase } from "@/lib/supabase";
import type { CheckoutItem } from "@/lib/reservations";

// Central place for EVERY guest order — front-desk checkout, group store, add-ons.
// One queue to fulfill, redeem, or refund from. Surfaced at /admin/fulfillment.

export type OrderStatus = "pending" | "fulfilled" | "redeemed" | "refunded" | "cancelled";
export type OrderSource = "front-desk" | "group" | "add-on" | "online";

export type Order = {
  id: string;
  source: OrderSource;
  reservationId: string;
  groupCode: string;
  customerName: string;
  customerContact: string;
  items: CheckoutItem[];
  total: number;
  method: string;
  paid: boolean;
  status: OrderStatus;
  notes: string;
  createdAt?: string;
};

export const ORDER_STATUSES: OrderStatus[] = ["pending", "fulfilled", "redeemed", "refunded", "cancelled"];

export const STATUS_BADGE: Record<OrderStatus, string> = {
  pending: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  fulfilled: "bg-green-500/15 text-green-300 border-green-400/30",
  redeemed: "bg-sky-500/15 text-sky-300 border-sky-400/30",
  refunded: "bg-red-500/15 text-red-300 border-red-400/30",
  cancelled: "bg-white/10 text-white/45 border-white/15",
};

export const newOrderId = () => "ord-" + Math.random().toString(36).slice(2, 10);

function toOrder(r: Record<string, unknown>): Order {
  return {
    id: r.id as string,
    source: (r.source as OrderSource) ?? "front-desk",
    reservationId: (r.reservation_id as string) ?? "",
    groupCode: (r.group_code as string) ?? "",
    customerName: (r.customer_name as string) ?? "",
    customerContact: (r.customer_contact as string) ?? "",
    items: (r.items as CheckoutItem[]) ?? [],
    total: Number(r.total) || 0,
    method: (r.method as string) ?? "",
    paid: (r.paid as boolean) ?? false,
    status: (r.status as OrderStatus) ?? "pending",
    notes: (r.notes as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  };
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toOrder);
}

export async function getOrderByReservation(reservationId: string): Promise<Order | null> {
  const { data } = await supabase.from("orders").select("*").eq("reservation_id", reservationId).limit(1);
  if (!data || !data[0]) return null;
  return toOrder(data[0]);
}

export async function saveOrder(o: Order): Promise<boolean> {
  const { error } = await supabase.from("orders").upsert({
    id: o.id, source: o.source, reservation_id: o.reservationId || null, group_code: o.groupCode || null,
    customer_name: o.customerName, customer_contact: o.customerContact || null,
    items: o.items, total: o.total, method: o.method, paid: o.paid, status: o.status, notes: o.notes || null,
  });
  return !error;
}

export async function setOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await supabase.from("orders").update({ status }).eq("id", id);
}

export async function setOrderPaid(id: string, paid: boolean): Promise<void> {
  await supabase.from("orders").update({ paid }).eq("id", id);
}

export async function deleteOrder(id: string): Promise<void> {
  await supabase.from("orders").delete().eq("id", id);
}
