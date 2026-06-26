import { supabase } from "@/lib/supabase";

export type CustomerCredit = {
  id: string;
  customerName: string;
  email: string;
  bookingRef: string;
  amount: number; // dollars of agency / future-cruise credit
  reason: string;
  status: "active" | "used" | "expired";
  expiresOn: string; // YYYY-MM-DD or ""
  notes: string;
  createdAt?: string;
};

export function newCreditId(): string {
  return "cr-" + Math.random().toString(36).slice(2, 9);
}

function toCredit(row: Record<string, unknown>): CustomerCredit {
  return {
    id: row.id as string,
    customerName: (row.customer_name as string) ?? "",
    email: (row.email as string) ?? "",
    bookingRef: (row.booking_ref as string) ?? "",
    amount: Number(row.amount) || 0,
    reason: (row.reason as string) ?? "",
    status: (row.status as CustomerCredit["status"]) ?? "active",
    expiresOn: (row.expires_on as string) ?? "",
    notes: (row.notes as string) ?? "",
    createdAt: (row.created_at as string) ?? "",
  };
}

function toRow(c: CustomerCredit): Record<string, unknown> {
  return {
    id: c.id,
    customer_name: c.customerName,
    email: c.email.trim().toLowerCase(),
    booking_ref: c.bookingRef || null,
    amount: c.amount,
    reason: c.reason || null,
    status: c.status,
    expires_on: c.expiresOn || null,
    notes: c.notes || null,
  };
}

// Admin: all credits.
export async function getAllCredits(): Promise<CustomerCredit[]> {
  const { data, error } = await supabase
    .from("customer_credits")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toCredit);
}

export async function saveCredit(c: CustomerCredit): Promise<boolean> {
  const { error } = await supabase.from("customer_credits").upsert(toRow(c));
  return !error;
}

export async function deleteCredit(id: string): Promise<void> {
  await supabase.from("customer_credits").delete().eq("id", id);
}

// Public lookup: active credits matching this email (and booking ref, if given).
export async function lookupCredits(
  email: string,
  bookingRef?: string
): Promise<CustomerCredit[]> {
  const clean = email.trim().toLowerCase();
  if (!clean) return [];
  let q = supabase
    .from("customer_credits")
    .select("*")
    .eq("email", clean)
    .eq("status", "active");
  if (bookingRef && bookingRef.trim()) {
    q = q.ilike("booking_ref", bookingRef.trim());
  }
  const { data, error } = await q;
  if (error || !data) return [];
  return data.map(toCredit);
}
