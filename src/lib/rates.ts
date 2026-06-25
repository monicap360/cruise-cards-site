import { supabase } from "@/lib/supabase";

export type CabinRate = {
  ship: string;
  cabinType: string;
  rate: number; // per person, double occupancy (the cruise-line starting fare)
};

export function rateKey(ship: string, cabinType: string): string {
  return `${ship}||${cabinType}`;
}

function toRate(row: Record<string, unknown>): CabinRate {
  return {
    ship: row.ship as string,
    cabinType: row.cabin_type as string,
    rate: Number(row.rate) || 0,
  };
}

export async function getAllRates(): Promise<CabinRate[]> {
  const { data, error } = await supabase.from("cabin_rates").select("*");
  if (error || !data) return [];
  return data.map(toRate);
}

// Map of "ship||cabinType" -> rate, for fast lookups when rendering sailings.
export async function getRateMap(): Promise<Record<string, number>> {
  const rates = await getAllRates();
  const map: Record<string, number> = {};
  for (const r of rates) {
    if (r.rate > 0) map[rateKey(r.ship, r.cabinType)] = r.rate;
  }
  return map;
}

export async function saveRate(
  ship: string,
  cabinType: string,
  rate: number
): Promise<boolean> {
  const { error } = await supabase
    .from("cabin_rates")
    .upsert({ ship, cabin_type: cabinType, rate });
  return !error;
}

export async function deleteRate(
  ship: string,
  cabinType: string
): Promise<void> {
  await supabase
    .from("cabin_rates")
    .delete()
    .eq("ship", ship)
    .eq("cabin_type", cabinType);
}
