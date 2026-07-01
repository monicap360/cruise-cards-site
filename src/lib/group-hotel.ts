// Per-group pre/post-cruise hotel, shown on the group portal. Keyed by code.

export type GroupHotelRoom = { room: number; name: string; occupancy: string };

export type GroupHotel = {
  name: string;
  rating?: string;        // "7.8 Good"
  reviews?: string;       // "3,194 reviews"
  roomDescription: string; // "Standard Room, 1 King Bed, Balcony"
  roomCount: number;
  guests?: number;
  checkIn: string;        // "Wed, Jul 29, 2026"
  checkOut: string;       // "Thu, Jul 30, 2026"
  nights: number;
  roomsSubtotal: number;
  taxes: number;
  total: number;
  payNow: number;
  payAtProperty: number;
  address?: string;
  phone?: string;         // call to confirm
  amenities?: string[];
  rooms?: GroupHotelRoom[];
  checkInTime?: string;   // "3:00 PM"
  checkOutTime?: string;  // "Noon"
  minAge?: number;        // minimum check-in age
  freeCancelUntil?: string;
  cancelNote?: string;
  paid?: boolean;         // false → show "not yet paid / balance due"
  photos?: string[];      // /public paths, e.g. "/hotels/doubletree-seatac-1.jpg"
};

export const GROUP_HOTELS: Record<string, GroupHotel> = {
  "gabby-group": {
    name: "DoubleTree by Hilton Seattle Airport",
    rating: "7.8 Good",
    reviews: "3,194 reviews",
    roomDescription: "Standard Room · 1 King Bed · Balcony",
    roomCount: 3,
    guests: 4,
    checkIn: "Wed, Jul 29, 2026",
    checkOut: "Thu, Jul 30, 2026",
    nights: 1,
    roomsSubtotal: 597.0,
    taxes: 80.64,
    total: 677.64,
    payNow: 0,
    payAtProperty: 677.64,
    address: "18740 International Boulevard, SeaTac, WA 98188",
    phone: "(206) 246-8600",
    amenities: [
      "Free WiFi",
      "In-room climate control (A/C)",
      "Daily housekeeping",
      "Free airport transportation",
      "Meeting rooms",
    ],
    rooms: [
      { room: 1, name: "Gabriela Lopez", occupancy: "2 adults" },
      { room: 2, name: "Gabriela Lopez", occupancy: "1 adult" },
      { room: 3, name: "Gabriela Lopez", occupancy: "1 adult" },
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "Noon",
    minAge: 18,
    freeCancelUntil: "Jul 28, 2026 at 11:59 PM (hotel local time)",
    cancelNote: "After that, cancellations/changes are subject to a fee of up to 100% of the reservation (per room).",
    paid: false,
    // Drop the hotel photos in /public/hotels with these exact names to show them.
    photos: [
      "/hotels/doubletree-seatac-1.jpg",
      "/hotels/doubletree-seatac-2.jpg",
      "/hotels/doubletree-seatac-3.jpg",
    ],
  },
};

export function hotelForGroup(code: string): GroupHotel | null {
  return GROUP_HOTELS[code] ?? null;
}
