import { supabase } from "@/lib/supabase";

// Individual (non-group) client cruise bookings — track sail date, booking #,
// and online check-in status so nobody sails un-checked-in.

export type Passenger = { name: string; dob: string; vifp: string };

export type IndividualBooking = {
  id: string;
  guestName: string;
  cruiseLine: string;
  ship: string;
  sailDate: string; // YYYY-MM-DD
  itinerary: string;
  bookingNumber: string;
  contact: string;
  checkinStatus: string; // "Completed" | "Available" | "Not open" | ...
  notes: string;
  passengers: Passenger[];
  token: string;
  cabinType: string;
  grossAmount: number;
  createdAt?: string;
};

export const newIBId = () => "ib-" + Math.random().toString(36).slice(2, 9);
export const newResToken = () =>
  (Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 8)).toLowerCase();

function toIB(r: Record<string, unknown>): IndividualBooking {
  let passengers: Passenger[] = [];
  try {
    const p = r.passengers;
    passengers = Array.isArray(p) ? (p as Passenger[]) : typeof p === "string" ? JSON.parse(p) : [];
  } catch { passengers = []; }
  return {
    id: r.id as string,
    guestName: (r.guest_name as string) ?? "",
    cruiseLine: (r.cruise_line as string) ?? "",
    ship: (r.ship as string) ?? "",
    sailDate: (r.sail_date as string) ?? "",
    itinerary: (r.itinerary as string) ?? "",
    bookingNumber: (r.booking_number as string) ?? "",
    contact: (r.contact as string) ?? "",
    checkinStatus: (r.checkin_status as string) ?? "",
    notes: (r.notes as string) ?? "",
    passengers,
    token: (r.token as string) ?? "",
    cabinType: (r.cabin_type as string) ?? "",
    grossAmount: Number(r.gross_amount) || 0,
    createdAt: (r.created_at as string) ?? "",
  };
}

export async function getIndividualBookings(): Promise<IndividualBooking[]> {
  const { data, error } = await supabase.from("individual_bookings").select("*").order("sail_date", { ascending: true });
  if (error || !data) return [];
  return data.map(toIB);
}

export async function getBookingByToken(token: string): Promise<IndividualBooking | null> {
  const { data, error } = await supabase.from("individual_bookings").select("*").eq("token", token).single();
  if (error || !data) return null;
  return toIB(data);
}

export async function saveIndividualBooking(b: IndividualBooking): Promise<boolean> {
  const { error } = await supabase.from("individual_bookings").upsert({
    id: b.id, guest_name: b.guestName, cruise_line: b.cruiseLine || null, ship: b.ship, sail_date: b.sailDate || null,
    itinerary: b.itinerary || null, booking_number: b.bookingNumber, contact: b.contact,
    checkin_status: b.checkinStatus, notes: b.notes || null,
    passengers: b.passengers ?? [], token: b.token || null, cabin_type: b.cabinType || null,
    gross_amount: b.grossAmount || 0,
  });
  return !error;
}

// Guests can update their own passenger details from the reservation portal.
export async function updatePassengers(token: string, passengers: Passenger[]): Promise<boolean> {
  const { error } = await supabase.from("individual_bookings").update({ passengers }).eq("token", token);
  return !error;
}

export async function deleteIndividualBooking(id: string): Promise<void> {
  await supabase.from("individual_bookings").delete().eq("id", id);
}

// True when the booking still needs online check-in done.
export function needsCheckin(b: IndividualBooking): boolean {
  return !/complete/i.test(b.checkinStatus);
}
