import { supabase } from "@/lib/supabase";

// RFP = an outside travel agent requesting group space we host. They put a
// deposit to hold the block, host their own travelers in it, and we earn a
// flat fee per room. An accepted RFP spins up a hosted Group (see lib/groups).
export type RFPStatus = "new" | "reviewing" | "quoted" | "accepted" | "declined";

export type RFPRequest = {
  id: string;
  agencyName: string;
  agentName: string;
  agentEmail: string;
  agentPhone: string;
  credential: string; // CLIA / IATA / ARC number
  ship: string;
  cruiseLine: string;
  sailDate: string;
  cabins: number; // number of cabins requested
  cabinTypes: string; // free text, e.g. "8 balcony, 4 interior"
  notes: string;
  status: RFPStatus;
  quoteRatePP: number; // group rate per person we quote back
  feePerRoom: number; // our flat host fee per room
  depositAmount: number; // deposit to hold the block
  holdUntil: string; // block hold expiration (date)
  quoteNotes: string;
  groupCode: string; // code of the hosted group once accepted
  createdAt?: string;
};

export function newRfpId() {
  return "rfp-" + Math.random().toString(36).slice(2, 9);
}

export function blankRFP(): RFPRequest {
  return {
    id: newRfpId(),
    agencyName: "",
    agentName: "",
    agentEmail: "",
    agentPhone: "",
    credential: "",
    ship: "",
    cruiseLine: "",
    sailDate: "",
    cabins: 0,
    cabinTypes: "",
    notes: "",
    status: "new",
    quoteRatePP: 0,
    feePerRoom: 0,
    depositAmount: 0,
    holdUntil: "",
    quoteNotes: "",
    groupCode: "",
  };
}

function toRfp(r: Record<string, unknown>): RFPRequest {
  return {
    id: r.id as string,
    agencyName: (r.agency_name as string) ?? "",
    agentName: (r.agent_name as string) ?? "",
    agentEmail: (r.agent_email as string) ?? "",
    agentPhone: (r.agent_phone as string) ?? "",
    credential: (r.credential as string) ?? "",
    ship: (r.ship as string) ?? "",
    cruiseLine: (r.cruise_line as string) ?? "",
    sailDate: (r.sail_date as string) ?? "",
    cabins: (r.cabins as number) ?? 0,
    cabinTypes: (r.cabin_types as string) ?? "",
    notes: (r.notes as string) ?? "",
    status: ((r.status as string) as RFPStatus) ?? "new",
    quoteRatePP: Number(r.quote_rate_pp) || 0,
    feePerRoom: Number(r.fee_per_room) || 0,
    depositAmount: Number(r.deposit_amount) || 0,
    holdUntil: (r.hold_until as string) ?? "",
    quoteNotes: (r.quote_notes as string) ?? "",
    groupCode: (r.group_code as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  };
}

function rfpRow(r: RFPRequest): Record<string, unknown> {
  return {
    id: r.id,
    agency_name: r.agencyName,
    agent_name: r.agentName,
    agent_email: r.agentEmail || null,
    agent_phone: r.agentPhone || null,
    credential: r.credential || null,
    ship: r.ship || null,
    cruise_line: r.cruiseLine || null,
    sail_date: r.sailDate || null,
    cabins: r.cabins || 0,
    cabin_types: r.cabinTypes || null,
    notes: r.notes || null,
    status: r.status,
    quote_rate_pp: r.quoteRatePP || 0,
    fee_per_room: r.feePerRoom || 0,
    deposit_amount: r.depositAmount || 0,
    hold_until: r.holdUntil || null,
    quote_notes: r.quoteNotes || null,
    group_code: r.groupCode || null,
  };
}

export async function getAllRFPs(): Promise<RFPRequest[]> {
  const { data, error } = await supabase
    .from("rfp_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toRfp);
}

export async function saveRFP(r: RFPRequest): Promise<boolean> {
  const { error } = await supabase.from("rfp_requests").upsert(rfpRow(r));
  return !error;
}

export async function deleteRFP(id: string): Promise<void> {
  await supabase.from("rfp_requests").delete().eq("id", id);
}
