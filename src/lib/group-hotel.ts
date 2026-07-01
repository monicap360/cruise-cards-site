// Per-group pre/post-cruise hotel, shown on the group portal. Keyed by code.

export type GroupHotel = {
  name: string;
  rating?: string;        // "7.8 Good"
  reviews?: string;       // "3,194 reviews"
  roomDescription: string; // "Standard Room, 1 King Bed, Balcony"
  roomCount: number;
  checkIn: string;        // "Wed, Jul 29, 2026"
  checkOut: string;       // "Thu, Jul 30, 2026"
  nights: number;
  roomsSubtotal: number;
  taxes: number;
  total: number;
  payNow: number;
  payAtProperty: number;
};

export const GROUP_HOTELS: Record<string, GroupHotel> = {
  "gabby-group": {
    name: "DoubleTree by Hilton Seattle Airport",
    rating: "7.8 Good",
    reviews: "3,194 reviews",
    roomDescription: "Standard Room · 1 King Bed · Balcony",
    roomCount: 3,
    checkIn: "Wed, Jul 29, 2026",
    checkOut: "Thu, Jul 30, 2026",
    nights: 1,
    roomsSubtotal: 597.0,
    taxes: 80.64,
    total: 677.64,
    payNow: 0,
    payAtProperty: 677.64,
  },
};

export function hotelForGroup(code: string): GroupHotel | null {
  return GROUP_HOTELS[code] ?? null;
}
