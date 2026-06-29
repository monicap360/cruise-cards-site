import { supabase } from "@/lib/supabase";

export type DepositMilestone = {
  dueDate: string;
  depositRequired: number;
  cumulativeDue: number;
  paidToDate: number;
};

export type DepositCabin = {
  cabinNumber: string;
  bookingId: string;
  category: string;
  occupancy: string;
  deposit: number;
  paid: number;
};

export type GroupDeposit = {
  id: string;
  groupName: string;
  cruiseGroupId: string;
  cruiseLine: string;
  ship: string;
  sailingDate: string;
  itinerary: string;
  issueDate: string;
  partnerAdvocate: string;
  advocateExt: string;
  rep: string;
  groupEmail: string;
  notes: string;
  schedule: DepositMilestone[];
  cabins: DepositCabin[];
  status: "active" | "secured" | "released";
  createdAt?: string;
};

export function newGroupDepositId(): string {
  return "gd-" + Math.random().toString(36).slice(2, 9);
}

export function blankGroupDeposit(): GroupDeposit {
  return {
    id: newGroupDepositId(),
    groupName: "",
    cruiseGroupId: "",
    cruiseLine: "",
    ship: "",
    sailingDate: "",
    itinerary: "",
    issueDate: "",
    partnerAdvocate: "",
    advocateExt: "",
    rep: "",
    groupEmail: "",
    notes: "",
    schedule: [],
    cabins: [],
    status: "active",
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function totalDue(g: GroupDeposit): number {
  if (g.schedule.length === 0) return 0;
  return g.schedule.reduce((m, s) => Math.max(m, s.cumulativeDue), 0);
}

export function paidToDate(g: GroupDeposit): number {
  if (g.schedule.length === 0) return 0;
  return g.schedule.reduce((m, s) => Math.max(m, s.paidToDate), 0);
}

export function nextDue(g: GroupDeposit): DepositMilestone | null {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = g.schedule
    .filter((s) => s.dueDate && s.dueDate >= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return upcoming[0] ?? null;
}

export function cabinCount(g: GroupDeposit): number {
  return g.cabins.length;
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function toGroupDeposit(row: Record<string, unknown>): GroupDeposit {
  return {
    id: row.id as string,
    groupName: (row.group_name as string) ?? "",
    cruiseGroupId: (row.cruise_group_id as string) ?? "",
    cruiseLine: (row.cruise_line as string) ?? "",
    ship: (row.ship as string) ?? "",
    sailingDate: (row.sailing_date as string) ?? "",
    itinerary: (row.itinerary as string) ?? "",
    issueDate: (row.issue_date as string) ?? "",
    partnerAdvocate: (row.partner_advocate as string) ?? "",
    advocateExt: (row.advocate_ext as string) ?? "",
    rep: (row.rep as string) ?? "",
    groupEmail: (row.group_email as string) ?? "",
    notes: (row.notes as string) ?? "",
    schedule: (row.schedule as DepositMilestone[]) ?? [],
    cabins: (row.cabins as DepositCabin[]) ?? [],
    status: (row.status as GroupDeposit["status"]) ?? "active",
    createdAt: row.created_at as string | undefined,
  };
}

function toRow(g: GroupDeposit): Record<string, unknown> {
  return {
    id: g.id,
    group_name: g.groupName,
    cruise_group_id: g.cruiseGroupId,
    cruise_line: g.cruiseLine,
    ship: g.ship,
    sailing_date: g.sailingDate,
    itinerary: g.itinerary,
    issue_date: g.issueDate,
    partner_advocate: g.partnerAdvocate,
    advocate_ext: g.advocateExt,
    rep: g.rep,
    group_email: g.groupEmail,
    notes: g.notes,
    schedule: g.schedule ?? [],
    cabins: g.cabins ?? [],
    status: g.status,
  };
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function getGroupDeposits(): Promise<GroupDeposit[]> {
  const { data, error } = await supabase
    .from("group_deposits")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toGroupDeposit);
}

export async function getGroupDeposit(id: string): Promise<GroupDeposit | null> {
  const { data, error } = await supabase
    .from("group_deposits")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return toGroupDeposit(data);
}

export async function saveGroupDeposit(g: GroupDeposit): Promise<boolean> {
  const { error } = await supabase.from("group_deposits").upsert(toRow(g));
  return !error;
}

export async function deleteGroupDeposit(id: string): Promise<void> {
  await supabase.from("group_deposits").delete().eq("id", id);
}
