// ── Front Desk Reservations — Cruise Experience Center ────────────────────────
// Walk-in & scheduled reservations for on-site services, managed by front desk agents.

export type ReservationStatus =
  | "requested"
  | "reserved"
  | "checked-in"
  | "in-service"
  | "completed"
  | "no-show"
  | "cancelled";

export type Reservation = {
  id: string;
  reservationNumber: string;
  createdAt: string;

  // Guest
  guestName: string; // display name (combined)
  legalFirstName: string; // legal name exactly as on travel documents
  legalLastName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: number;

  // Service
  serviceType: string;

  // Related cruise (optional)
  ship: string;
  sailDate: string;
  bookingRef: string;
  loyaltyNumber: string; // VIFP, Crown & Anchor, Latitudes, Captain's Circle, etc.

  // Scheduling
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:MM (24h)

  agentName: string;
  status: ReservationStatus;

  // Guest's own description of what they need + AI-generated prep brief
  requestSummary: string;
  aiBrief: string;

  // Staff confirmed a physical photo ID at the desk (no image is ever stored)
  idVerified: boolean;

  notes: string;
};

// Services offered at the Experience Center front desk
export const SERVICE_TYPES = [
  "Phone Call / Callback",
  "Arrival Check-In",
  "Cruise Planning Consultation",
  "Boarding Pass Printing",
  "Luggage Tag Printing",
  "Check-In & Document Help",
  "Scooter Rental",
  "Wheelchair Rental",
  "Hotel Reservation Assistance",
  "Transportation / Port Shuttle",
  "Restaurant Reservation",
  "Shore Excursion Booking",
  "Payment / Balance Assistance",
  "Lounge Access",
  "Gifts & Merchandise",
  "Other",
] as const;

export const SERVICE_ICON: Record<string, string> = {
  "Phone Call / Callback": "☎️",
  "Arrival Check-In": "🛬",
  "Cruise Planning Consultation": "🚢",
  "Boarding Pass Printing": "🖨️",
  "Luggage Tag Printing": "🏷️",
  "Check-In & Document Help": "📋",
  "Scooter Rental": "🛵",
  "Wheelchair Rental": "♿",
  "Hotel Reservation Assistance": "🏨",
  "Transportation / Port Shuttle": "🚐",
  "Restaurant Reservation": "🍽️",
  "Shore Excursion Booking": "🏝️",
  "Payment / Balance Assistance": "💳",
  "Lounge Access": "☕",
  "Gifts & Merchandise": "🎁",
  Other: "⚓",
};

// ── Public online booking: curated bookable services ──────────────────────────
// Friendly, plain-language options so first-timers and seasoned cruisers both
// know exactly what they're reserving.

export type BookableService = {
  name: string; // must match a SERVICE_TYPES value
  icon: string;
  tagline: string;
  blurb: string;
  duration: string; // human-readable expected length
  firstTimer?: boolean; // surfaced as a friendly starting point
  byPhone?: boolean; // appointment happens over the phone, not in person
};

export const BOOKABLE_SERVICES: BookableService[] = [
  {
    name: "Phone Call / Callback",
    icon: "☎️",
    tagline: "Prefer to talk? Book a call.",
    blurb:
      "Pick a time and a cruise specialist will call you — perfect for quick questions, first-time jitters, or planning from home. No need to come in.",
    duration: "About 20 min",
    firstTimer: true,
    byPhone: true,
  },
  {
    name: "Arrival Check-In",
    icon: "🛬",
    tagline: "Let us know you're on the way.",
    blurb:
      "Pre-register your arrival so the team is expecting you and check-in is quick. Please bring a valid photo ID — our staff verify it at the desk when you arrive.",
    duration: "About 10 min",
  },
  {
    name: "Cruise Planning Consultation",
    icon: "🚢",
    tagline: "Not sure where to start? Start here.",
    blurb:
      "Sit down with a cruise specialist who'll match you to the right ship, cabin, and sailing date — no pressure, no fees. Perfect for first-time cruisers.",
    duration: "About 45 min",
    firstTimer: true,
  },
  {
    name: "Check-In & Document Help",
    icon: "📋",
    tagline: "We'll get you boarding-ready.",
    blurb:
      "Online check-in, boarding passes, luggage tags, and travel-document review — done with you, side by side, so nothing's missed before sail day.",
    duration: "About 30 min",
    firstTimer: true,
  },
  {
    name: "Scooter Rental",
    icon: "🛵",
    tagline: "Reserve your mobility scooter.",
    blurb:
      "Reserve a mobility scooter for your sailing and we'll have it ready and fitted before you board.",
    duration: "About 20 min",
  },
  {
    name: "Wheelchair Rental",
    icon: "♿",
    tagline: "Reserve your wheelchair.",
    blurb:
      "Reserve a wheelchair for the terminal and onboard, with accessibility coordination handled for you.",
    duration: "About 20 min",
  },
  {
    name: "Transportation / Port Shuttle",
    icon: "🚐",
    tagline: "Rides to the port, sorted.",
    blurb:
      "Arrange airport, hotel, and port transportation so you arrive relaxed and on time on sail day.",
    duration: "About 20 min",
  },
];

export function getBookableService(name: string): BookableService | undefined {
  return BOOKABLE_SERVICES.find((s) => s.name === name);
}

export const RESERVATION_STATUSES: ReservationStatus[] = [
  "requested",
  "reserved",
  "checked-in",
  "in-service",
  "completed",
  "no-show",
  "cancelled",
];

export const STATUS_COLOR: Record<ReservationStatus, string> = {
  requested: "bg-orange-100 text-orange-700",
  reserved: "bg-blue-100 text-blue-700",
  "checked-in": "bg-amber-100 text-amber-700",
  "in-service": "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  "no-show": "bg-gray-200 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
};

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  requested: "Requested",
  reserved: "Reserved",
  "checked-in": "Checked In",
  "in-service": "In Service",
  completed: "Completed",
  "no-show": "No-Show",
  cancelled: "Cancelled",
};

const ACTIVE_STATUSES: ReservationStatus[] = [
  "requested",
  "reserved",
  "checked-in",
  "in-service",
];

export function isActive(r: Reservation): boolean {
  return ACTIVE_STATUSES.includes(r.status);
}

// Statuses that occupy a slot's capacity (i.e. block new online bookings).
const CAPACITY_STATUSES: ReservationStatus[] = [
  "requested",
  "reserved",
  "checked-in",
  "in-service",
];

export function generateId(): string {
  return "res-" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function generateReservationNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `RES-${year}-${rand}`;
}

export function todayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

// ── Availability: business hours, slots & capacity ────────────────────────────
// The Experience Center front desk is open daily; online guests can reserve a
// time slot up to this many days out. Each slot holds up to SLOT_CAPACITY guests.

export const OPEN_HOUR = 9; // 9:00 AM
export const CLOSE_HOUR = 18; // last slot ends by 6:00 PM
export const SLOT_MINUTES = 30;
export const SLOT_CAPACITY = 6; // max guests booked into one slot
export const BOOKING_WINDOW_DAYS = 60; // how far ahead guests can book

/** All bookable "HH:MM" start times for a day (24h). */
export function generateDaySlots(): string[] {
  const slots: string[] = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

export type SlotAvailability = {
  time: string; // "HH:MM"
  booked: number; // guests already reserved
  remaining: number; // guests still available
  isPast: boolean; // slot start is in the past (today only)
};

/**
 * Returns slot-by-slot availability for a date, counting guests from all
 * capacity-occupying reservations already in the system (front desk + online),
 * so both stay in sync automatically.
 */
export async function getDayAvailability(
  date: string
): Promise<SlotAvailability[]> {
  const { data } = await supabase
    .from("reservations")
    .select("reservation_time, party_size, status")
    .eq("reservation_date", date);

  const booked = new Map<string, number>();
  for (const row of data ?? []) {
    const status = row.status as ReservationStatus;
    const time = row.reservation_time as string | null;
    if (!time || !CAPACITY_STATUSES.includes(status)) continue;
    booked.set(time, (booked.get(time) ?? 0) + ((row.party_size as number) ?? 1));
  }

  const now = new Date();
  const isToday = date === todayStr();

  return generateDaySlots().map((time) => {
    const used = booked.get(time) ?? 0;
    const [h, m] = time.split(":").map(Number);
    const isPast =
      isToday && (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes()));
    return {
      time,
      booked: used,
      remaining: Math.max(0, SLOT_CAPACITY - used),
      isPast,
    };
  });
}

// ── Supabase data layer ───────────────────────────────────────────────────────

import { supabase } from "./supabase";

function toReservation(row: Record<string, unknown>): Reservation {
  return {
    id: row.id as string,
    reservationNumber: row.reservation_number as string,
    createdAt: row.created_at as string,
    guestName: row.guest_name as string,
    legalFirstName: (row.legal_first_name as string) ?? "",
    legalLastName: (row.legal_last_name as string) ?? "",
    guestEmail: (row.guest_email as string) ?? "",
    guestPhone: (row.guest_phone as string) ?? "",
    partySize: (row.party_size as number) ?? 1,
    serviceType: (row.service_type as string) ?? "",
    ship: (row.ship as string) ?? "",
    sailDate: (row.sail_date as string) ?? "",
    bookingRef: (row.booking_ref as string) ?? "",
    loyaltyNumber: (row.loyalty_number as string) ?? "",
    reservationDate: (row.reservation_date as string) ?? "",
    reservationTime: (row.reservation_time as string) ?? "",
    agentName: (row.agent_name as string) ?? "",
    status: (row.status as ReservationStatus) ?? "reserved",
    requestSummary: (row.request_summary as string) ?? "",
    aiBrief: (row.ai_brief as string) ?? "",
    idVerified: (row.id_verified as boolean) ?? false,
    notes: (row.notes as string) ?? "",
  };
}

export async function getReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("reservation_date", { ascending: false })
    .order("reservation_time", { ascending: true });
  if (error || !data) return [];
  return data.map(toReservation);
}

export async function getReservation(id: string): Promise<Reservation | null> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return toReservation(data);
}

export async function saveReservation(r: Reservation): Promise<void> {
  await supabase.from("reservations").upsert({
    id: r.id,
    reservation_number: r.reservationNumber,
    guest_name: r.guestName,
    legal_first_name: r.legalFirstName,
    legal_last_name: r.legalLastName,
    guest_email: r.guestEmail,
    guest_phone: r.guestPhone,
    party_size: r.partySize,
    service_type: r.serviceType,
    ship: r.ship,
    sail_date: r.sailDate,
    booking_ref: r.bookingRef,
    reservation_date: r.reservationDate,
    reservation_time: r.reservationTime,
    agent_name: r.agentName,
    status: r.status,
    request_summary: r.requestSummary,
    ai_brief: r.aiBrief,
    id_verified: r.idVerified,
    loyalty_number: r.loyaltyNumber,
    notes: r.notes,
  });
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
): Promise<void> {
  await supabase.from("reservations").update({ status }).eq("id", id);
}

export async function deleteReservation(id: string): Promise<void> {
  await supabase.from("reservations").delete().eq("id", id);
}

// ── Formatting helpers ────────────────────────────────────────────────────────

export function fmtDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtTime(timeStr: string): string {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":").map(Number);
  if (Number.isNaN(h)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m ?? 0).padStart(2, "0")} ${period}`;
}
