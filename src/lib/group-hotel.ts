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
};

export const GROUP_HOTELS: Record<string, GroupHotel> = {
  // (Gabby's pre-cruise hotel removed per request. Add a group's hotel here to
  // show the "Pre-Cruise Hotel" section on their portal.)
};

export function hotelForGroup(code: string): GroupHotel | null {
  return GROUP_HOTELS[code] ?? null;
}
