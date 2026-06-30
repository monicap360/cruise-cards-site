import { supabase } from "@/lib/supabase";

// Individual (non-group) client cruise bookings — track sail date, booking #,
// and online check-in status so nobody sails un-checked-in.

export type IndividualBooking = {
  id: string;
  guestName: string;
  ship: string;
  sailDate: string; // YYYY-MM-DD
  itinerary: string;
  bookingNumber: string;
  contact: string;
  checkinStatus: string; // "Completed" | "Available" | "Not open" | ...
  notes: string;
  createdAt?: string;
};

export const newIBId = () => "ib-" + Math.random().toString(36).slice(2, 9);

function toIB(r: Record<string, unknown>): IndividualBooking {
  return {
    id: r.id as string,
    guestName: (r.guest_name as string) ?? "",
    ship: (r.ship as string) ?? "",
    sailDate: (r.sail_date as string) ?? "",
    itinerary: (r.itinerary as string) ?? "",
    bookingNumber: (r.booking_number as string) ?? "",
    contact: (r.contact as string) ?? "",
    checkinStatus: (r.checkin_status as string) ?? "",
    notes: (r.notes as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  };
}

export async function getIndividualBookings(): Promise<IndividualBooking[]> {
  const { data, error } = await supabase.from("individual_bookings").select("*").order("sail_date", { ascending: true });
  if (error || !data) return [];
  return data.map(toIB);
}

export async function saveIndividualBooking(b: IndividualBooking): Promise<boolean> {
  const { error } = await supabase.from("individual_bookings").upsert({
    id: b.id, guest_name: b.guestName, ship: b.ship, sail_date: b.sailDate || null,
    itinerary: b.itinerary || null, booking_number: b.bookingNumber, contact: b.contact,
    checkin_status: b.checkinStatus, notes: b.notes || null,
  });
  return !error;
}

export async function deleteIndividualBooking(id: string): Promise<void> {
  await supabase.from("individual_bookings").delete().eq("id", id);
}

// True when the booking still needs online check-in done.
export function needsCheckin(b: IndividualBooking): boolean {
  return !/complete/i.test(b.checkinStatus);
}
