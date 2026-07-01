import { supabase } from "@/lib/supabase";

// Per-passenger self-service info (VIFP #, email, phone) that guests can add and
// edit on the group manifest. Keyed by group code + passenger name.

export type PassengerInfo = { vifp: string; email: string; phone: string };

const keyId = (code: string, name: string) =>
  `${code}::${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

export async function getPassengerInfo(code: string): Promise<Record<string, PassengerInfo>> {
  const map: Record<string, PassengerInfo> = {};
  const { data, error } = await supabase.from("group_passenger_info").select("*").eq("group_code", code);
  if (error || !data) return map;
  for (const r of data as Record<string, unknown>[]) {
    map[(r.passenger_name as string) ?? ""] = {
      vifp: (r.vifp as string) ?? "",
      email: (r.email as string) ?? "",
      phone: (r.phone as string) ?? "",
    };
  }
  return map;
}

export async function savePassengerInfo(code: string, name: string, info: PassengerInfo): Promise<boolean> {
  const { error } = await supabase.from("group_passenger_info").upsert({
    id: keyId(code, name),
    group_code: code,
    passenger_name: name,
    vifp: info.vifp || null,
    email: info.email || null,
    phone: info.phone || null,
    updated_at: new Date().toISOString(),
  });
  return !error;
}
