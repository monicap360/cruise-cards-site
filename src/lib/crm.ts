import { supabase } from "@/lib/supabase";

// Customer database + cruise offers. Offers get a public token so a customer can
// open them from an emailed link and Approve / Deny / Book — no login.

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  notes: string;
  createdAt?: string;
};

export type OfferStatus = "Sent" | "Viewed" | "Approved" | "Denied" | "Booked";

export type Offer = {
  id: string;
  token: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  title: string;
  ship: string;
  cruiseLine: string;
  sailDate: string;
  nights: number;
  cabinType: string;
  pricePP: number;
  total: number;
  notes: string;
  status: OfferStatus;
  createdAt?: string;
};

export const newCustomerId = () => "cust-" + Math.random().toString(36).slice(2, 9);
export const newOfferId = () => "offer-" + Math.random().toString(36).slice(2, 9);
export const newOfferToken = () =>
  Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);

// ── Customers ──
function toCustomer(r: Record<string, unknown>): Customer {
  return {
    id: r.id as string,
    name: (r.name as string) ?? "",
    email: (r.email as string) ?? "",
    phone: (r.phone as string) ?? "",
    source: (r.source as string) ?? "",
    notes: (r.notes as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  };
}

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase.from("customers").select("*").order("name");
  if (error || !data) return [];
  return data.map(toCustomer);
}

export async function saveCustomer(c: Customer): Promise<boolean> {
  const { error } = await supabase.from("customers").upsert({
    id: c.id, name: c.name, email: c.email || null, phone: c.phone || null,
    source: c.source || null, notes: c.notes || null,
  });
  return !error;
}

export async function deleteCustomer(id: string): Promise<void> {
  await supabase.from("customers").delete().eq("id", id);
}

// ── Offers ──
function toOffer(r: Record<string, unknown>): Offer {
  return {
    id: r.id as string,
    token: (r.token as string) ?? "",
    customerId: (r.customer_id as string) ?? "",
    customerName: (r.customer_name as string) ?? "",
    customerEmail: (r.customer_email as string) ?? "",
    title: (r.title as string) ?? "",
    ship: (r.ship as string) ?? "",
    cruiseLine: (r.cruise_line as string) ?? "",
    sailDate: (r.sail_date as string) ?? "",
    nights: Number(r.nights) || 0,
    cabinType: (r.cabin_type as string) ?? "",
    pricePP: Number(r.price_pp) || 0,
    total: Number(r.total) || 0,
    notes: (r.notes as string) ?? "",
    status: ((r.status as string) as OfferStatus) ?? "Sent",
    createdAt: (r.created_at as string) ?? "",
  };
}

function offerRow(o: Offer): Record<string, unknown> {
  return {
    id: o.id, token: o.token, customer_id: o.customerId || null,
    customer_name: o.customerName, customer_email: o.customerEmail || null,
    title: o.title, ship: o.ship || null, cruise_line: o.cruiseLine || null,
    sail_date: o.sailDate || null, nights: o.nights || 0, cabin_type: o.cabinType || null,
    price_pp: o.pricePP || 0, total: o.total || 0, notes: o.notes || null, status: o.status,
  };
}

export async function getOffers(): Promise<Offer[]> {
  const { data, error } = await supabase.from("offers").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toOffer);
}

export async function getOffersByCustomer(customerId: string): Promise<Offer[]> {
  const { data } = await supabase.from("offers").select("*").eq("customer_id", customerId).order("created_at", { ascending: false });
  return (data ?? []).map(toOffer);
}

export async function getOfferByToken(token: string): Promise<Offer | null> {
  const { data } = await supabase.from("offers").select("*").eq("token", token).limit(1);
  if (!data || !data[0]) return null;
  return toOffer(data[0]);
}

export async function saveOffer(o: Offer): Promise<boolean> {
  const { error } = await supabase.from("offers").upsert(offerRow(o));
  return !error;
}

export async function setOfferStatus(token: string, status: OfferStatus): Promise<boolean> {
  const { error } = await supabase.from("offers").update({ status }).eq("token", token);
  return !error;
}

export async function deleteOffer(id: string): Promise<void> {
  await supabase.from("offers").delete().eq("id", id);
}
