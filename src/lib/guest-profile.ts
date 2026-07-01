import { supabase } from "@/lib/supabase";

// A guest's self-service cruise profile — the details we need from them that we
// can't fill in ourselves: their booking confirmation #, cabin/deck, and their
// cruise-line loyalty number (Carnival VIFP, Royal Crown & Anchor, etc.). Guests
// enter this in /account; the admin Cabin Board reads it and updates live.

export type GuestProfile = {
  email: string;
  name: string;
  confirmationNumber: string;
  ship: string;
  cabinType: string;
  deck: string;
  loyaltyProgram: string;
  loyaltyNumber: string;
  updatedAt?: string;
};

// Loyalty programs by cruise line (shown in the dropdown).
export const LOYALTY_PROGRAMS = [
  "VIFP (Carnival)",
  "Crown & Anchor (Royal Caribbean)",
  "Latitudes Rewards (Norwegian)",
  "MSC Voyagers Club",
  "Castaway Club (Disney)",
];

function toProfile(r: Record<string, unknown>): GuestProfile {
  return {
    email: (r.email as string) ?? "",
    name: (r.name as string) ?? "",
    confirmationNumber: (r.confirmation_number as string) ?? "",
    ship: (r.ship as string) ?? "",
    cabinType: (r.cabin_type as string) ?? "",
    deck: (r.deck as string) ?? "",
    loyaltyProgram: (r.loyalty_program as string) ?? "",
    loyaltyNumber: (r.loyalty_number as string) ?? "",
    updatedAt: (r.updated_at as string) ?? "",
  };
}

export async function getGuestProfile(email: string): Promise<GuestProfile | null> {
  const { data, error } = await supabase
    .from("guest_profiles")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .single();
  if (error || !data) return null;
  return toProfile(data);
}

export async function saveGuestProfile(p: GuestProfile): Promise<boolean> {
  const { error } = await supabase.from("guest_profiles").upsert({
    email: p.email.trim().toLowerCase(),
    name: p.name,
    confirmation_number: p.confirmationNumber,
    ship: p.ship,
    cabin_type: p.cabinType,
    deck: p.deck,
    loyalty_program: p.loyaltyProgram,
    loyalty_number: p.loyaltyNumber,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

export async function getAllGuestProfiles(): Promise<GuestProfile[]> {
  const { data, error } = await supabase
    .from("guest_profiles")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toProfile);
}
