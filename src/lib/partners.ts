import { supabase } from "@/lib/supabase";

export type Partner = {
  id: string;
  name: string;
  type: "Hotel" | "Parking" | "Travel Agent" | "Restaurant" | "Other";
  contactName: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  dealTerms: string; // co-marketing / commission / cross-link arrangement
  crossLinkUrl: string; // the URL we link to / they link back
  status: "prospect" | "active" | "paused";
  notes: string;
  createdAt?: string;
};

export function newPartnerId(): string {
  return "pt-" + Math.random().toString(36).slice(2, 9);
}

export function blankPartner(): Partner {
  return {
    id: newPartnerId(),
    name: "",
    type: "Hotel",
    contactName: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    dealTerms: "",
    crossLinkUrl: "",
    status: "prospect",
    notes: "",
  };
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function toPartner(row: Record<string, unknown>): Partner {
  return {
    id: row.id as string,
    name: (row.name as string) ?? "",
    type: (row.type as Partner["type"]) ?? "Other",
    contactName: (row.contact_name as string) ?? "",
    phone: (row.phone as string) ?? "",
    email: (row.email as string) ?? "",
    website: (row.website as string) ?? "",
    address: (row.address as string) ?? "",
    dealTerms: (row.deal_terms as string) ?? "",
    crossLinkUrl: (row.cross_link_url as string) ?? "",
    status: (row.status as Partner["status"]) ?? "prospect",
    notes: (row.notes as string) ?? "",
    createdAt: row.created_at as string | undefined,
  };
}

function toRow(p: Partner): Record<string, unknown> {
  return {
    id: p.id,
    name: p.name,
    type: p.type,
    contact_name: p.contactName,
    phone: p.phone,
    email: p.email,
    website: p.website,
    address: p.address,
    deal_terms: p.dealTerms,
    cross_link_url: p.crossLinkUrl,
    status: p.status,
    notes: p.notes,
  };
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toPartner);
}

export async function savePartner(p: Partner): Promise<boolean> {
  const { error } = await supabase.from("partners").upsert(toRow(p));
  return !error;
}

export async function deletePartner(id: string): Promise<void> {
  await supabase.from("partners").delete().eq("id", id);
}
