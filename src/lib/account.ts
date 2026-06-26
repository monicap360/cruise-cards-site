import { supabase } from "@/lib/supabase";

export type CustomerStatus = {
  email: string;
  status: string; // e.g. "Working on your booking"
  workingOn: string; // what we're currently doing
  updatedAt?: string;
};

const STAGES = [
  "Request received",
  "Working on your booking",
  "Holding your cabin",
  "Awaiting your deposit",
  "Booked — awaiting final payment",
  "Paid in full",
  "Ready to sail",
];
export const STATUS_STAGES = STAGES;

export async function getStatus(email: string): Promise<CustomerStatus | null> {
  const clean = email.trim().toLowerCase();
  if (!clean) return null;
  const { data, error } = await supabase
    .from("customer_status")
    .select("*")
    .eq("email", clean)
    .limit(1);
  if (error || !data || data.length === 0) return null;
  const r = data[0];
  return {
    email: r.email as string,
    status: (r.status as string) ?? "",
    workingOn: (r.working_on as string) ?? "",
    updatedAt: (r.updated_at as string) ?? "",
  };
}

export async function getAllStatuses(): Promise<CustomerStatus[]> {
  const { data, error } = await supabase
    .from("customer_status")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => ({
    email: r.email as string,
    status: (r.status as string) ?? "",
    workingOn: (r.working_on as string) ?? "",
    updatedAt: (r.updated_at as string) ?? "",
  }));
}

export async function setStatus(
  email: string,
  status: string,
  workingOn: string
): Promise<boolean> {
  const { error } = await supabase.from("customer_status").upsert({
    email: email.trim().toLowerCase(),
    status,
    working_on: workingOn || null,
    updated_at: new Date().toISOString(),
  });
  return !error;
}
