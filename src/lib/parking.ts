import { supabase } from "@/lib/supabase";

// Park & Ride scheduling — one car per 30-minute slot (transport runs one at a
// time). Slots are reserved per group sail day; uniqueness on (group_code, time)
// enforces one car per slot.

export type ParkingSlot = {
  id: string;
  groupCode: string;
  sailDate: string;
  time: string; // "HH:MM" 24h
  cabin: string;
  name: string;
  phone: string;
  createdAt?: string;
};

export const newSlotId = () => "pk-" + Math.random().toString(36).slice(2, 9);

// Generate every 30-min slot across the transport window (default 8:00a–2:30p).
export function genSlots(startHour = 8, endHour = 15, stepMin = 30): string[] {
  const out: string[] = [];
  for (let m = startHour * 60; m < endHour * 60; m += stepMin) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    out.push(`${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }
  return out;
}

export function fmtTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ap}`;
}

function toSlot(r: Record<string, unknown>): ParkingSlot {
  return {
    id: r.id as string,
    groupCode: (r.group_code as string) ?? "",
    sailDate: (r.sail_date as string) ?? "",
    time: (r.time as string) ?? "",
    cabin: (r.cabin as string) ?? "",
    name: (r.name as string) ?? "",
    phone: (r.phone as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  };
}

export async function getParkingSlots(groupCode: string): Promise<ParkingSlot[]> {
  const { data, error } = await supabase
    .from("parking_slots")
    .select("*")
    .eq("group_code", groupCode)
    .order("time");
  if (error || !data) return [];
  return data.map(toSlot);
}

export async function bookParkingSlot(s: ParkingSlot): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("parking_slots").insert({
    id: s.id,
    group_code: s.groupCode,
    sail_date: s.sailDate,
    time: s.time,
    cabin: s.cabin || null,
    name: s.name || null,
    phone: s.phone || null,
  });
  if (error) {
    // 23505 = unique violation → that slot was just taken
    if (error.code === "23505") return { ok: false, error: "That time was just taken — please pick another." };
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function cancelParkingSlot(id: string): Promise<void> {
  await supabase.from("parking_slots").delete().eq("id", id);
}
