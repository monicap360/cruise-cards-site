import { supabase } from "@/lib/supabase";

// Group signup tracker — the agency's own roster of families signed up for a
// group sailing (e.g. "Thanksgiving 2026 — Liberty of the Seas"). ADMIN-ONLY:
// holds PII (DOB, phone, email, reservation #s). Never shown on the public site.
export type SignupGuest = { name: string; dob: string };

export type SignupEntry = {
  id: string;
  groupLabel: string; // which group sailing this family belongs to
  leadName: string; // family / lead contact
  dob: string;
  phone: string;
  email: string;
  adults: number;
  kids: number;
  totalGuests: number;
  cabins: string; // "1 Balcony", "1 Interior", "1 Ocean View", etc.
  reservationNumber: string;
  guestNames: string; // full names as on ID (multiline) — quick free-text
  guests: SignupGuest[]; // structured per-guest name + DOB (for the rooming list)
  confirmed: string; // "Y" | "N" | ""
  depositStatus: string; // free text, e.g. "N Sent Invoice", "Y Sent Invoice"
  notes: string;
  createdAt?: string;
};

// Guests for a room: prefer the structured list; otherwise split the free-text
// names (one per line or comma) and put the lead DOB on the first guest.
export function roomGuests(s: SignupEntry): SignupGuest[] {
  if (s.guests && s.guests.length) return s.guests;
  const names = s.guestNames
    .split(/[\n,]+/)
    .map((n) => n.trim())
    .filter(Boolean);
  return names.map((name, i) => ({ name, dob: i === 0 ? s.dob : "" }));
}

export function newSignupId() {
  return "sgn-" + Math.random().toString(36).slice(2, 9);
}

export function blankSignup(groupLabel = ""): SignupEntry {
  return {
    id: newSignupId(),
    groupLabel,
    leadName: "",
    dob: "",
    phone: "",
    email: "",
    adults: 0,
    kids: 0,
    totalGuests: 0,
    cabins: "",
    reservationNumber: "",
    guestNames: "",
    guests: [],
    confirmed: "Y",
    depositStatus: "",
    notes: "",
  };
}

function toSignup(r: Record<string, unknown>): SignupEntry {
  return {
    id: r.id as string,
    groupLabel: (r.group_label as string) ?? "",
    leadName: (r.lead_name as string) ?? "",
    dob: (r.dob as string) ?? "",
    phone: (r.phone as string) ?? "",
    email: (r.email as string) ?? "",
    adults: Number(r.adults ?? 0),
    kids: Number(r.kids ?? 0),
    totalGuests: Number(r.total_guests ?? 0),
    cabins: (r.cabins as string) ?? "",
    reservationNumber: (r.reservation_number as string) ?? "",
    guestNames: (r.guest_names as string) ?? "",
    guests: Array.isArray(r.guests) ? (r.guests as SignupGuest[]) : [],
    confirmed: (r.confirmed as string) ?? "",
    depositStatus: (r.deposit_status as string) ?? "",
    notes: (r.notes as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  };
}

function signupRow(s: SignupEntry): Record<string, unknown> {
  return {
    id: s.id,
    group_label: s.groupLabel || null,
    lead_name: s.leadName || null,
    dob: s.dob || null,
    phone: s.phone || null,
    email: s.email || null,
    adults: s.adults || 0,
    kids: s.kids || 0,
    total_guests: s.totalGuests || 0,
    cabins: s.cabins || null,
    reservation_number: s.reservationNumber || null,
    guest_names: s.guestNames || null,
    guests: s.guests ?? [],
    confirmed: s.confirmed || null,
    deposit_status: s.depositStatus || null,
    notes: s.notes || null,
  };
}

export async function getSignups(): Promise<SignupEntry[]> {
  const { data, error } = await supabase
    .from("signups")
    .select("*")
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map(toSignup);
}

export async function getSignupsByGroup(label: string): Promise<SignupEntry[]> {
  const { data, error } = await supabase
    .from("signups")
    .select("*")
    .eq("group_label", label)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map(toSignup);
}

// Find which group a leader belongs to, by the email on their signup row.
export async function findLeaderGroup(email: string): Promise<string | null> {
  const clean = email.trim().toLowerCase();
  if (!clean) return null;
  const { data } = await supabase
    .from("signups")
    .select("group_label,email")
    .ilike("email", clean)
    .limit(1);
  if (data && data.length) return (data[0].group_label as string) ?? null;
  return null;
}

export async function saveSignup(s: SignupEntry): Promise<boolean> {
  const { error } = await supabase.from("signups").upsert(signupRow(s));
  return !error;
}

export async function deleteSignup(id: string): Promise<void> {
  await supabase.from("signups").delete().eq("id", id);
}

// Roster totals for the summary strip.
export function signupTotals(rows: SignupEntry[]) {
  return {
    families: rows.length,
    guests: rows.reduce((n, r) => n + (r.totalGuests || 0), 0),
    adults: rows.reduce((n, r) => n + (r.adults || 0), 0),
    kids: rows.reduce((n, r) => n + (r.kids || 0), 0),
    confirmed: rows.filter((r) => r.confirmed.toUpperCase().startsWith("Y")).length,
    depositsPaid: rows.filter((r) => r.depositStatus.toUpperCase().startsWith("Y")).length,
  };
}
