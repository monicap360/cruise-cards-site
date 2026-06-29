import { supabase } from "@/lib/supabase";

export type LedgerType = "income" | "expense";

export type LedgerEntry = {
  id: string;
  date: string;
  type: LedgerType;
  category: string;
  client: string;
  description: string;
  amount: number;
  method: string;
  status: string;
  invoiceNumber: string;
  source: string;
  createdAt?: string;
};

export const INCOME_CATEGORIES = [
  "Commission",
  "Cruise payment",
  "Group deposit",
  "Service fee",
  "Add-on / package",
  "Other income",
];

export const EXPENSE_CATEGORIES = [
  "Marketing & advertising",
  "Software & subscriptions",
  "Office & supplies",
  "Payroll & contractors",
  "Travel & meals",
  "Bank & processing fees",
  "Refund",
  "Other expense",
];

export const METHODS = [
  "Check",
  "Cash",
  "Cruise line",
  "Card",
  "Bank transfer",
  "Other",
];

export const STATUSES = ["paid", "pending", "overdue"];

export function newLedgerId(): string {
  return "led-" + Math.random().toString(36).slice(2, 9);
}

export function blankEntry(): LedgerEntry {
  return {
    id: newLedgerId(),
    date: new Date().toISOString().slice(0, 10),
    type: "income",
    category: INCOME_CATEGORIES[0],
    client: "",
    description: "",
    amount: 0,
    method: METHODS[0],
    status: "paid",
    invoiceNumber: "",
    source: "manual",
  };
}

// ── Mappers ───────────────────────────────────────────────────────────────────
function toEntry(row: Record<string, unknown>): LedgerEntry {
  return {
    id: row.id as string,
    date: (row.date as string) ?? "",
    type: (row.type as LedgerType) ?? "income",
    category: (row.category as string) ?? "",
    client: (row.client as string) ?? "",
    description: (row.description as string) ?? "",
    amount: Number(row.amount) || 0,
    method: (row.method as string) ?? "",
    status: (row.status as string) ?? "paid",
    invoiceNumber: (row.invoice_number as string) ?? "",
    source: (row.source as string) ?? "manual",
    createdAt: (row.created_at as string) ?? "",
  };
}

function toRow(e: LedgerEntry): Record<string, unknown> {
  return {
    id: e.id,
    date: e.date || null,
    type: e.type,
    category: e.category || null,
    client: e.client || null,
    description: e.description || null,
    amount: e.amount,
    method: e.method || null,
    status: e.status || "paid",
    invoice_number: e.invoiceNumber || null,
    source: e.source || "manual",
  };
}

// ── CRUD ──────────────────────────────────────────────────────────────────────
export async function getLedger(): Promise<LedgerEntry[]> {
  const { data, error } = await supabase
    .from("ledger")
    .select("*")
    .order("date", { ascending: false });
  if (error || !data) return [];
  return data.map(toEntry);
}

export async function saveEntry(e: LedgerEntry): Promise<boolean> {
  const { error } = await supabase.from("ledger").upsert(toRow(e));
  return !error;
}

export async function saveEntries(arr: LedgerEntry[]): Promise<number> {
  if (arr.length === 0) return 0;
  const { error } = await supabase.from("ledger").upsert(arr.map(toRow));
  return error ? 0 : arr.length;
}

export async function deleteEntry(id: string): Promise<void> {
  await supabase.from("ledger").delete().eq("id", id);
}

// ── Summary helpers (pure) ─────────────────────────────────────────────────────
export function totals(entries: LedgerEntry[]): {
  income: number;
  expense: number;
  net: number;
} {
  let income = 0;
  let expense = 0;
  for (const e of entries) {
    if (e.type === "income") income += e.amount;
    else expense += e.amount;
  }
  return { income, expense, net: income - expense };
}

export function byMonth(
  entries: LedgerEntry[]
): { month: string; income: number; expense: number; net: number }[] {
  const map = new Map<string, { income: number; expense: number }>();
  for (const e of entries) {
    const month = (e.date || "").slice(0, 7);
    if (!month) continue;
    const cur = map.get(month) ?? { income: 0, expense: 0 };
    if (e.type === "income") cur.income += e.amount;
    else cur.expense += e.amount;
    map.set(month, cur);
  }
  return Array.from(map.entries())
    .map(([month, v]) => ({
      month,
      income: v.income,
      expense: v.expense,
      net: v.income - v.expense,
    }))
    .sort((a, b) => b.month.localeCompare(a.month));
}

export function byCategory(
  entries: LedgerEntry[],
  type: LedgerType
): { category: string; total: number }[] {
  const map = new Map<string, number>();
  for (const e of entries) {
    if (e.type !== type) continue;
    const cat = e.category || "Uncategorized";
    map.set(cat, (map.get(cat) ?? 0) + e.amount);
  }
  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

// ── CSV ─────────────────────────────────────────────────────────────────────
// Minimal but correct CSV parser. Handles quoted fields, escaped double-quotes
// (""), commas inside quotes, and \r\n / \n line breaks. First row = headers.
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const n = text.length;

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    pushField();
    rows.push(row);
    row = [];
  };

  while (i < n) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      pushField();
      i++;
      continue;
    }
    if (c === "\r") {
      // handle \r\n and lone \r
      if (text[i + 1] === "\n") i++;
      pushRow();
      i++;
      continue;
    }
    if (c === "\n") {
      pushRow();
      i++;
      continue;
    }
    field += c;
    i++;
  }
  // flush trailing field/row (unless file ended exactly on a newline)
  if (field.length > 0 || row.length > 0) {
    pushRow();
  }
  // drop fully-empty trailing rows
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

// Returns the index of the first header (case-insensitive, trimmed, substring
// match) matching any candidate, else -1.
export function guessColumn(headers: string[], candidates: string[]): number {
  const norm = headers.map((h) => (h ?? "").trim().toLowerCase());
  for (const cand of candidates) {
    const c = cand.trim().toLowerCase();
    const idx = norm.findIndex((h) => h.includes(c));
    if (idx !== -1) return idx;
  }
  return -1;
}
