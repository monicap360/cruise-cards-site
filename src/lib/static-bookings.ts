import type { IndividualBooking } from "@/lib/individual-bookings";

// Hand-created individual bookings that get an instant shareable portal link
// (/r/<token>?pin=MMDD) without needing a database row. Add an entry here and the
// reservation portal renders it. Guest self-edits/receipt uploads persist only
// for DB-backed bookings — these are best for sharing the summary/invoice/app steps.
export const STATIC_BOOKINGS: IndividualBooking[] = [
  {
    id: "ib-ZN88D6",
    guestName: "Savannah Morton",
    cruiseLine: "Carnival Cruise Line",
    ship: "Carnival Jubilee",
    sailDate: "2026-07-04",
    itinerary: "7-Day Western Caribbean",
    bookingNumber: "ZN88D6",
    contact: "",
    checkinStatus: "Available",
    notes: "Stateroom 1 · Balcony (BL) · Cabin 11207 · 2 guests · $1,128.25 per person",
    passengers: [],
    token: "zn88d6",
    cabinType: "Balcony (BL) · Cabin 11207 · 2 guests",
    grossAmount: 2613.5,
  },
];

export function staticBookingByToken(token: string): IndividualBooking | null {
  return STATIC_BOOKINGS.find((b) => b.token === token) ?? null;
}
