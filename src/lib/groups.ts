import { supabase } from "@/lib/supabase";

export type GroupMember = {
  id: string;
  groupId: string;
  name: string;
  email: string;
  phone: string;
  cabinType: string;
  cabinNumber: string;
  guests: number;
  fare: number; // total cabin fare
  depositPaid: number; // amount paid toward deposit
  paidInFull: boolean;
  confirmationNumber: string;
  notes: string;
};

export type Group = {
  id: string;
  code: string; // shareable access code for the portal
  name: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  ship: string;
  cruiseLine: string;
  sailingDate: string;
  returnDate: string;
  nights: number;
  depositDueDate: string;
  finalPaymentDate: string;
  blockSize: number; // total rooms held in the group block
  releaseDate: string; // when unbooked rooms release into inventory (date/time)
  groupRate: number; // group rate per person (double occupancy)
  contract: string; // free-text contract terms / status
  contractUrl: string; // uploaded group-contract PDF (Storage URL)
  contractName: string; // original file name
  notes: string;
  createdAt?: string;
};

// A single held room in the group block, with its own hold expiration.
export type GroupRoom = {
  id: string;
  groupId: string;
  cabinType: string;
  label: string; // friendly label or cabin number, e.g. "Balcony #1"
  ratePP: number; // per-person rate; 0 = fall back to the group rate
  holdUntil: string; // hold expiration (datetime-local string); past = released
  status: "available" | "booked" | "released";
  bookedBy: string;
  notes: string;
  createdAt?: string;
};

// A room counts as released if explicitly released OR its hold lapsed unbooked.
export function isRoomReleased(r: GroupRoom, nowMs: number): boolean {
  if (r.status === "released") return true;
  if (r.status === "available" && r.holdUntil) {
    const t = new Date(r.holdUntil).getTime();
    if (!Number.isNaN(t) && t < nowMs) return true;
  }
  return false;
}

export function newRoomId() {
  return "rm-" + Math.random().toString(36).slice(2, 9);
}

export function newGroupId() {
  return "grp-" + Math.random().toString(36).slice(2, 9);
}
export function newMemberId() {
  return "gm-" + Math.random().toString(36).slice(2, 9);
}
export function newGroupCode() {
  return (
    "G-" +
    Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)
  );
}

// Computed balance for a member.
export function memberBalance(m: GroupMember): number {
  if (m.paidInFull) return 0;
  return Math.max(0, m.fare - m.depositPaid);
}

function toGroup(r: Record<string, unknown>): Group {
  return {
    id: r.id as string,
    code: (r.code as string) ?? "",
    name: (r.name as string) ?? "",
    leaderName: (r.leader_name as string) ?? "",
    leaderEmail: (r.leader_email as string) ?? "",
    leaderPhone: (r.leader_phone as string) ?? "",
    ship: (r.ship as string) ?? "",
    cruiseLine: (r.cruise_line as string) ?? "",
    sailingDate: (r.sailing_date as string) ?? "",
    returnDate: (r.return_date as string) ?? "",
    nights: (r.nights as number) ?? 0,
    depositDueDate: (r.deposit_due_date as string) ?? "",
    finalPaymentDate: (r.final_payment_date as string) ?? "",
    blockSize: (r.block_size as number) ?? 0,
    releaseDate: (r.release_date as string) ?? "",
    groupRate: Number(r.group_rate) || 0,
    contract: (r.contract as string) ?? "",
    contractUrl: (r.contract_url as string) ?? "",
    contractName: (r.contract_name as string) ?? "",
    notes: (r.notes as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  };
}
function groupRow(g: Group): Record<string, unknown> {
  return {
    id: g.id,
    code: g.code,
    name: g.name,
    leader_name: g.leaderName,
    leader_email: g.leaderEmail,
    leader_phone: g.leaderPhone,
    ship: g.ship,
    cruise_line: g.cruiseLine,
    sailing_date: g.sailingDate || null,
    return_date: g.returnDate || null,
    nights: g.nights || 0,
    deposit_due_date: g.depositDueDate || null,
    final_payment_date: g.finalPaymentDate || null,
    block_size: g.blockSize || 0,
    release_date: g.releaseDate || null,
    group_rate: g.groupRate || 0,
    contract: g.contract || null,
    contract_url: g.contractUrl || null,
    contract_name: g.contractName || null,
    notes: g.notes || null,
  };
}
function toMember(r: Record<string, unknown>): GroupMember {
  return {
    id: r.id as string,
    groupId: (r.group_id as string) ?? "",
    name: (r.name as string) ?? "",
    email: (r.email as string) ?? "",
    phone: (r.phone as string) ?? "",
    cabinType: (r.cabin_type as string) ?? "",
    cabinNumber: (r.cabin_number as string) ?? "",
    guests: (r.guests as number) ?? 2,
    fare: Number(r.fare) || 0,
    depositPaid: Number(r.deposit_paid) || 0,
    paidInFull: (r.paid_in_full as boolean) ?? false,
    confirmationNumber: (r.confirmation_number as string) ?? "",
    notes: (r.notes as string) ?? "",
  };
}
function memberRow(m: GroupMember): Record<string, unknown> {
  return {
    id: m.id,
    group_id: m.groupId,
    name: m.name,
    email: m.email || null,
    phone: m.phone || null,
    cabin_type: m.cabinType || null,
    cabin_number: m.cabinNumber || null,
    guests: m.guests || 2,
    fare: m.fare || 0,
    deposit_paid: m.depositPaid || 0,
    paid_in_full: m.paidInFull,
    confirmation_number: m.confirmationNumber || null,
    notes: m.notes || null,
  };
}

export async function getAllGroups(): Promise<Group[]> {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toGroup);
}

export async function getGroupByCode(
  code: string
): Promise<{ group: Group; members: GroupMember[]; rooms: GroupRoom[] } | null> {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .ilike("code", code)
    .limit(1);
  if (error || !data || data.length === 0) return null;
  const group = toGroup(data[0]);
  const { data: mem } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", group.id)
    .order("name");
  // group_rooms is optional — if the table isn't set up yet this just returns [].
  const { data: rms } = await supabase
    .from("group_rooms")
    .select("*")
    .eq("group_id", group.id)
    .order("created_at");
  return {
    group,
    members: (mem ?? []).map(toMember),
    rooms: (rms ?? []).map(toRoom),
  };
}

function toRoom(r: Record<string, unknown>): GroupRoom {
  return {
    id: r.id as string,
    groupId: (r.group_id as string) ?? "",
    cabinType: (r.cabin_type as string) ?? "",
    label: (r.label as string) ?? "",
    ratePP: Number(r.rate_pp) || 0,
    holdUntil: (r.hold_until as string) ?? "",
    status: ((r.status as string) as GroupRoom["status"]) ?? "available",
    bookedBy: (r.booked_by as string) ?? "",
    notes: (r.notes as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  };
}
function roomRow(r: GroupRoom): Record<string, unknown> {
  return {
    id: r.id,
    group_id: r.groupId,
    cabin_type: r.cabinType || null,
    label: r.label || null,
    rate_pp: r.ratePP || 0,
    hold_until: r.holdUntil || null,
    status: r.status,
    booked_by: r.bookedBy || null,
    notes: r.notes || null,
  };
}

export async function getRooms(groupId: string): Promise<GroupRoom[]> {
  const { data } = await supabase
    .from("group_rooms")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at");
  return (data ?? []).map(toRoom);
}
export async function saveRoom(r: GroupRoom): Promise<boolean> {
  const { error } = await supabase.from("group_rooms").upsert(roomRow(r));
  return !error;
}
export async function deleteRoom(id: string): Promise<void> {
  await supabase.from("group_rooms").delete().eq("id", id);
}

export async function getMembers(groupId: string): Promise<GroupMember[]> {
  const { data } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .order("name");
  return (data ?? []).map(toMember);
}

export async function saveGroup(g: Group): Promise<boolean> {
  const { error } = await supabase.from("groups").upsert(groupRow(g));
  return !error;
}
export async function deleteGroup(id: string): Promise<void> {
  await supabase.from("group_members").delete().eq("group_id", id);
  await supabase.from("groups").delete().eq("id", id);
}
export async function saveMember(m: GroupMember): Promise<boolean> {
  const { error } = await supabase.from("group_members").upsert(memberRow(m));
  return !error;
}
export async function deleteMember(id: string): Promise<void> {
  await supabase.from("group_members").delete().eq("id", id);
}
