import { supabase } from "@/lib/supabase";

export type CustomerContact = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  channel: "call" | "email" | "text" | "in-person" | "voicemail" | "other";
  direction: "outbound" | "inbound";
  summary: string;
  staff: string;
  contactedOn: string; // YYYY-MM-DD
  createdAt?: string;
};

export function newContactId(): string {
  return "ct-" + Math.random().toString(36).slice(2, 9);
}

function toContact(row: Record<string, unknown>): CustomerContact {
  return {
    id: row.id as string,
    customerName: (row.customer_name as string) ?? "",
    email: (row.email as string) ?? "",
    phone: (row.phone as string) ?? "",
    channel: (row.channel as CustomerContact["channel"]) ?? "call",
    direction: (row.direction as CustomerContact["direction"]) ?? "outbound",
    summary: (row.summary as string) ?? "",
    staff: (row.staff as string) ?? "",
    contactedOn: (row.contacted_on as string) ?? "",
    createdAt: (row.created_at as string) ?? "",
  };
}

function toRow(c: CustomerContact): Record<string, unknown> {
  return {
    id: c.id,
    customer_name: c.customerName,
    email: c.email.trim().toLowerCase(),
    phone: c.phone || null,
    channel: c.channel,
    direction: c.direction,
    summary: c.summary || null,
    staff: c.staff || null,
    contacted_on: c.contactedOn || null,
  };
}

export async function getAllContacts(): Promise<CustomerContact[]> {
  const { data, error } = await supabase
    .from("customer_contacts")
    .select("*")
    .order("contacted_on", { ascending: false });
  if (error || !data) return [];
  return data.map(toContact);
}

export async function saveContact(c: CustomerContact): Promise<boolean> {
  const { error } = await supabase.from("customer_contacts").upsert(toRow(c));
  return !error;
}

export async function deleteContact(id: string): Promise<void> {
  await supabase.from("customer_contacts").delete().eq("id", id);
}

// Group contacts by customer email with a touch count, for the log overview.
export type ContactSummary = {
  email: string;
  name: string;
  count: number;
  last: string;
  contacts: CustomerContact[];
};

export function groupByCustomer(contacts: CustomerContact[]): ContactSummary[] {
  const map = new Map<string, ContactSummary>();
  for (const c of contacts) {
    const key = c.email || c.customerName;
    const cur =
      map.get(key) ??
      ({ email: c.email, name: c.customerName, count: 0, last: "", contacts: [] } as ContactSummary);
    cur.count += 1;
    cur.contacts.push(c);
    if (!cur.name && c.customerName) cur.name = c.customerName;
    if (c.contactedOn > cur.last) cur.last = c.contactedOn;
    map.set(key, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.last.localeCompare(a.last));
}
