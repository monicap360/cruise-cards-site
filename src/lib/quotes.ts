import { supabase } from "@/lib/supabase";

export type QuoteLine = { label: string; amount: number };

export type Quote = {
  id: string;
  type: "quote" | "invoice";
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  ship: string;
  cruiseLine: string;
  sailDate: string;
  nights: number;
  itinerary: string;
  destSlug: string; // for the hero photo, e.g. "cozumel"
  lines: QuoteLine[];
  deposit: number;
  notes: string;
  expiresOn: string;
  agentName: string;
  status: "draft" | "sent" | "accepted" | "paid";
  createdAt?: string;
};

export function newQuoteId(): string {
  return "q-" + Math.random().toString(36).slice(2, 9);
}

export function quoteTotal(q: Quote): number {
  return q.lines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
}

export function quoteBalance(q: Quote): number {
  return Math.max(0, quoteTotal(q) - (Number(q.deposit) || 0));
}

export function blankQuote(): Quote {
  return {
    id: newQuoteId(),
    type: "quote",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    ship: "",
    cruiseLine: "",
    sailDate: "",
    nights: 0,
    itinerary: "",
    destSlug: "cozumel",
    lines: [{ label: "", amount: 0 }],
    deposit: 0,
    notes: "",
    expiresOn: "",
    agentName: "",
    status: "draft",
  };
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function toQuote(row: Record<string, unknown>): Quote {
  return {
    id: row.id as string,
    type: (row.type as Quote["type"]) ?? "quote",
    clientName: (row.client_name as string) ?? "",
    clientEmail: (row.client_email as string) ?? "",
    clientPhone: (row.client_phone as string) ?? "",
    ship: (row.ship as string) ?? "",
    cruiseLine: (row.cruise_line as string) ?? "",
    sailDate: (row.sail_date as string) ?? "",
    nights: (row.nights as number) ?? 0,
    itinerary: (row.itinerary as string) ?? "",
    destSlug: (row.dest_slug as string) ?? "",
    lines: (row.lines as QuoteLine[]) ?? [],
    deposit: (row.deposit as number) ?? 0,
    notes: (row.notes as string) ?? "",
    expiresOn: (row.expires_on as string) ?? "",
    agentName: (row.agent_name as string) ?? "",
    status: (row.status as Quote["status"]) ?? "draft",
    createdAt: row.created_at as string | undefined,
  };
}

function quoteRow(q: Quote): Record<string, unknown> {
  return {
    id: q.id,
    type: q.type,
    client_name: q.clientName,
    client_email: q.clientEmail,
    client_phone: q.clientPhone,
    ship: q.ship,
    cruise_line: q.cruiseLine,
    sail_date: q.sailDate,
    nights: q.nights,
    itinerary: q.itinerary,
    dest_slug: q.destSlug,
    lines: q.lines,
    deposit: q.deposit,
    notes: q.notes,
    expires_on: q.expiresOn,
    agent_name: q.agentName,
    status: q.status,
  };
}

// ── Supabase data layer ─────────────────────────────────────────────────────

export async function getAllQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toQuote);
}

export async function getQuote(id: string): Promise<Quote | null> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return toQuote(data);
}

export async function saveQuote(q: Quote): Promise<boolean> {
  const { error } = await supabase.from("quotes").upsert(quoteRow(q));
  return !error;
}

export async function deleteQuote(id: string): Promise<void> {
  await supabase.from("quotes").delete().eq("id", id);
}
