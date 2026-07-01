import type { IndividualBooking } from "@/lib/individual-bookings";

// Hand-created individual bookings that get an instant shareable portal link
// (/r/<token>?pin=MMDD) without needing a database row. Add an entry here and the
// reservation portal renders it. Guest self-edits/receipt uploads persist only
// for DB-backed bookings — these are best for sharing the summary/invoice/app steps.
export const STATIC_BOOKINGS: IndividualBooking[] = [
  {
    id: "ib-ZN88D6",
    guestName: "Samantha Morton",
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
    statusNote:
      "We're updating your reservation right now — this is your live link, so keep it handy. As we finalize your details (cabin, pricing, check-in, and any changes), the latest will always show right here. We'll keep you posted every step of the way. Questions? Call us at (409) 632-2106.",
    protectionNote:
      "One of your two travelers' cruise-line vacation protection was accidentally dropped from the booking — this was not your fault. The cruise line won't refund that adult protection, so we're making it right: we're refunding you $119, and we're securing stronger coverage for you through Travel Defenders (a better plan than the cruise line's). We'll confirm here once your new protection is in place.",
    protectionUrl: "https://www.traveldefenders.com/",
  },
];

export function staticBookingByToken(token: string): IndividualBooking | null {
  return STATIC_BOOKINGS.find((b) => b.token === token) ?? null;
}
