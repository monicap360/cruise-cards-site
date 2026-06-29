import { supabase } from "@/lib/supabase";

export type QuoteLine = { label: string; amount: number };

export type QuoteCabin = {
  id: string;
  category: string;
  perPerson: number;
  perks: string;
  recommended: boolean;
};

export type QuoteDay = { day: string; port: string; note: string };

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
  // ── Proposal extensions (Travel-Joy style) ──
  cabinOptions: QuoteCabin[];
  days: QuoteDay[];
  includes: string[];
  excludes: string[];
  acceptedOption: string; // QuoteCabin.id the client chose
  acceptedName: string; // who accepted
  acceptedAt: string; // ISO timestamp ("" if not accepted)
};

export function newQuoteId(): string {
  return "q-" + Math.random().toString(36).slice(2, 9);
}

export function newCabinId(): string {
  return "cab-" + Math.random().toString(36).slice(2, 8);
}

/** The accepted cabin, or the recommended one, or the cheapest by perPerson (or null). */
export function cabinFrom(q: Quote): QuoteCabin | null {
  const opts = q.cabinOptions ?? [];
  if (opts.length === 0) return null;
  if (q.acceptedOption) {
    const chosen = opts.find((c) => c.id === q.acceptedOption);
    if (chosen) return chosen;
  }
  const recommended = opts.find((c) => c.recommended);
  if (recommended) return recommended;
  return opts.reduce((cheapest, c) =>
    (Number(c.perPerson) || 0) < (Number(cheapest.perPerson) || 0) ? c : cheapest,
  );
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
    cabinOptions: [],
    days: [],
    includes: [],
    excludes: [],
    acceptedOption: "",
    acceptedName: "",
    acceptedAt: "",
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
    cabinOptions: (row.cabin_options as QuoteCabin[]) ?? [],
    days: (row.days as QuoteDay[]) ?? [],
    includes: (row.includes as string[]) ?? [],
    excludes: (row.excludes as string[]) ?? [],
    acceptedOption: (row.accepted_option as string) ?? "",
    acceptedName: (row.accepted_name as string) ?? "",
    acceptedAt: (row.accepted_at as string) ?? "",
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
    cabin_options: q.cabinOptions,
    days: q.days,
    includes: q.includes,
    excludes: q.excludes,
    accepted_option: q.acceptedOption,
    accepted_name: q.acceptedName,
    accepted_at: q.acceptedAt,
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

/** Client-facing online acceptance: marks the quote accepted with the chosen cabin. */
export async function acceptQuote(
  id: string,
  optionId: string,
  name: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("quotes")
    .update({
      status: "accepted",
      accepted_option: optionId,
      accepted_name: name,
      accepted_at: new Date().toISOString(),
    })
    .eq("id", id);
  return !error;
}
