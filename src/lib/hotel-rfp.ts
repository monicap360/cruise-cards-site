import { supabase } from "@/lib/supabase";

// Hotel RFP — send a Galveston hotel's GM/DOS a link to submit their group rate.
// Submitted rates flow back into the group / individual reservation portals.

export const GALVESTON_HOTELS = [
  "Harbor House Hotel & Marina (Pier 21)",
  "Gaido's Seaside Inn",
  "Hilton Galveston Island Resort",
  "Holiday Inn Resort Galveston on the Beach",
  "The San Luis Resort",
  "Grand Galvez (Hotel Galvez & Spa)",
  "DoubleTree by Hilton Galveston",
  "SpringHill Suites Galveston Island",
  "Courtyard by Marriott Galveston Island",
  "Comfort Suites Galveston",
  "Moody Gardens Hotel",
  "Tremont House",
];

export type RfpStatus = "Sent" | "Submitted" | "Selected" | "Declined";

export type HotelRfp = {
  id: string;
  token: string;
  groupCode: string; // group code OR individual reservation code
  groupName: string;
  ship: string;
  sailDate: string;
  roomsNeeded: number;
  nightsBefore: number; // pre-cruise nights
  hotelName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: RfpStatus;
  // Submitted by the hotel:
  nightlyRate: number;
  roomType: string;
  parkStayCruise: boolean; // includes parking for the sailing
  parkingDays: number;
  shuttle: boolean;
  terms: string;
  submittedAt?: string;
  createdAt?: string;
};

export const newRfpId = () => "rfp-" + Math.random().toString(36).slice(2, 9);
export const newRfpToken = () => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);

function toRfp(r: Record<string, unknown>): HotelRfp {
  return {
    id: r.id as string,
    token: (r.token as string) ?? "",
    groupCode: (r.group_code as string) ?? "",
    groupName: (r.group_name as string) ?? "",
    ship: (r.ship as string) ?? "",
    sailDate: (r.sail_date as string) ?? "",
    roomsNeeded: Number(r.rooms_needed) || 0,
    nightsBefore: Number(r.nights_before) || 1,
    hotelName: (r.hotel_name as string) ?? "",
    contactName: (r.contact_name as string) ?? "",
    contactEmail: (r.contact_email as string) ?? "",
    contactPhone: (r.contact_phone as string) ?? "",
    status: ((r.status as string) as RfpStatus) ?? "Sent",
    nightlyRate: Number(r.nightly_rate) || 0,
    roomType: (r.room_type as string) ?? "",
    parkStayCruise: Boolean(r.park_stay_cruise),
    parkingDays: Number(r.parking_days) || 0,
    shuttle: Boolean(r.shuttle),
    terms: (r.terms as string) ?? "",
    submittedAt: (r.submitted_at as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  };
}

function rfpRow(r: HotelRfp): Record<string, unknown> {
  return {
    id: r.id, token: r.token, group_code: r.groupCode, group_name: r.groupName,
    ship: r.ship || null, sail_date: r.sailDate || null, rooms_needed: r.roomsNeeded || 0,
    nights_before: r.nightsBefore || 1, hotel_name: r.hotelName, contact_name: r.contactName || null,
    contact_email: r.contactEmail || null, contact_phone: r.contactPhone || null, status: r.status,
    nightly_rate: r.nightlyRate || 0, room_type: r.roomType || null, park_stay_cruise: r.parkStayCruise,
    parking_days: r.parkingDays || 0, shuttle: r.shuttle, terms: r.terms || null,
  };
}

export async function getRfps(): Promise<HotelRfp[]> {
  const { data, error } = await supabase.from("hotel_rfps").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toRfp);
}

export async function getRfpsForGroup(groupCode: string): Promise<HotelRfp[]> {
  const { data } = await supabase.from("hotel_rfps").select("*").eq("group_code", groupCode).order("nightly_rate");
  return (data ?? []).map(toRfp);
}

export async function getRfpByToken(token: string): Promise<HotelRfp | null> {
  const { data } = await supabase.from("hotel_rfps").select("*").eq("token", token).limit(1);
  if (!data || !data[0]) return null;
  return toRfp(data[0]);
}

export async function saveRfp(r: HotelRfp): Promise<boolean> {
  const { error } = await supabase.from("hotel_rfps").upsert(rfpRow(r));
  return !error;
}

// The hotel submits its rate (sets status + submitted fields).
export async function submitRfpRate(
  token: string,
  patch: { nightlyRate: number; roomType: string; parkStayCruise: boolean; parkingDays: number; shuttle: boolean; terms: string }
): Promise<boolean> {
  const { error } = await supabase.from("hotel_rfps").update({
    status: "Submitted",
    nightly_rate: patch.nightlyRate,
    room_type: patch.roomType || null,
    park_stay_cruise: patch.parkStayCruise,
    parking_days: patch.parkingDays || 0,
    shuttle: patch.shuttle,
    terms: patch.terms || null,
    submitted_at: new Date().toISOString(),
  }).eq("token", token);
  return !error;
}

export async function deleteRfp(id: string): Promise<void> {
  await supabase.from("hotel_rfps").delete().eq("id", id);
}
