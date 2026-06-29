// ── Last-Minute Sailings — agency-mediated cruise resale ─────────────────────
// Guests who can no longer sail can list their cabin. Our agency verifies
// transfer eligibility with the cruise line, takes the booking into inventory,
// and offers it to last-minute travelers. The buyer pays the cruise line's
// name-change fee plus our admin fee; the seller is refunded per policy.
//
// SECURITY: we intentionally DO NOT collect or store a booking PIN here. A
// specialist collects transfer credentials by phone once eligibility is
// confirmed. Only non-sensitive listing details live in this table.

import { supabase } from "./supabase";

export type ListingStatus =
  | "pending" // seller submitted, awaiting eligibility review
  | "verifying" // agency confirming transfer eligibility with the line
  | "listed" // live on the public last-minute board
  | "claimed" // a buyer is in the name-change process
  | "sold" // transfer completed
  | "declined" // not eligible / not accepted
  | "withdrawn"; // seller pulled it

export type Listing = {
  id: string;
  createdAt: string;
  status: ListingStatus;

  // Seller (kept private — never shown on the public board)
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;

  // Cruise
  cruiseLine: string;
  ship: string;
  sailDate: string; // YYYY-MM-DD
  nights: number;
  itinerary: string;
  cabinType: string;
  guests: number;

  // Reference (booking number only — NO PIN)
  bookingRef: string;

  // Transfer details (the agency needs these to move the booking)
  cabinNumber?: string;
  paidInFull?: boolean;
  passengers?: { name: string; dob: string }[]; // exact names + DOB for name change

  // Money
  pricePaid: number; // what the seller originally paid
  penaltyAmount?: number; // cruise line / booking-agent cancellation penalty
  desiredBack?: number; // how much the seller would like to recover (USD)
  desiredRefundPct?: number; // legacy
  buyerPrice: number; // set by the agency when listed (0 until listed)
  sellerRefund: number; // set by the agency when listed (0 until listed)

  notes: string;
  sample?: boolean; // illustrative card, not a real booking
};

// Flat agency admin fee charged to the buyer on top of the cruise line's
// name-change fee. (The name-change fee itself varies by line and is collected
// at transfer.)
export const ADMIN_FEE = 99;

export const CRUISE_LINES = [
  "Carnival Cruise Line",
  "Royal Caribbean",
  "Norwegian Cruise Line",
  "Disney Cruise Line",
  "MSC Cruises",
] as const;

export const STATUS_LABEL: Record<ListingStatus, string> = {
  pending: "Pending review",
  verifying: "Verifying eligibility",
  listed: "Listed",
  claimed: "Claim in progress",
  sold: "Sold",
  declined: "Declined",
  withdrawn: "Withdrawn",
};

// Illustrative cards so the board never looks empty during launch. These are
// clearly tagged as samples in the UI and are never treated as real bookings.
export const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "sample-1",
    createdAt: "",
    status: "listed",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
    cruiseLine: "Carnival Cruise Line",
    ship: "Carnival Breeze",
    sailDate: "",
    nights: 7,
    itinerary: "Cozumel · Roatán · Belize",
    cabinType: "Balcony (Deck 8)",
    guests: 2,
    bookingRef: "",
    pricePaid: 1180,
    desiredRefundPct: 70,
    buyerPrice: 829,
    sellerRefund: 730,
    notes: "",
    sample: true,
  },
  {
    id: "sample-2",
    createdAt: "",
    status: "listed",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
    cruiseLine: "Royal Caribbean",
    ship: "Liberty of the Seas",
    sailDate: "",
    nights: 5,
    itinerary: "Nassau · Perfect Day CocoCay",
    cabinType: "Interior (Deck 6)",
    guests: 2,
    bookingRef: "",
    pricePaid: 740,
    desiredRefundPct: 80,
    buyerPrice: 559,
    sellerRefund: 560,
    notes: "",
    sample: true,
  },
  {
    id: "sample-3",
    createdAt: "",
    status: "listed",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
    cruiseLine: "Norwegian Cruise Line",
    ship: "Norwegian Breakaway",
    sailDate: "",
    nights: 4,
    itinerary: "Cozumel · Progreso",
    cabinType: "Oceanview (Deck 9)",
    guests: 2,
    bookingRef: "",
    pricePaid: 690,
    desiredRefundPct: 65,
    buyerPrice: 489,
    sellerRefund: 449,
    notes: "",
    sample: true,
  },
];

// ── Supabase data layer ───────────────────────────────────────────────────────

function toListing(row: Record<string, unknown>): Listing {
  return {
    id: row.id as string,
    createdAt: (row.created_at as string) ?? "",
    status: (row.status as ListingStatus) ?? "pending",
    sellerName: (row.seller_name as string) ?? "",
    sellerEmail: (row.seller_email as string) ?? "",
    sellerPhone: (row.seller_phone as string) ?? "",
    cruiseLine: (row.cruise_line as string) ?? "",
    ship: (row.ship as string) ?? "",
    sailDate: (row.sail_date as string) ?? "",
    nights: (row.nights as number) ?? 0,
    itinerary: (row.itinerary as string) ?? "",
    cabinType: (row.cabin_type as string) ?? "",
    guests: (row.guests as number) ?? 2,
    bookingRef: (row.booking_ref as string) ?? "",
    cabinNumber: (row.cabin_number as string) ?? "",
    paidInFull: (row.paid_in_full as boolean) ?? false,
    passengers:
      (row.passengers as { name: string; dob: string }[] | null) ?? [],
    pricePaid: (row.price_paid as number) ?? 0,
    penaltyAmount: (row.penalty_amount as number) ?? 0,
    desiredBack: (row.desired_back as number) ?? 0,
    desiredRefundPct: (row.desired_refund_pct as number) ?? 0,
    buyerPrice: (row.buyer_price as number) ?? 0,
    sellerRefund: (row.seller_refund as number) ?? 0,
    notes: (row.notes as string) ?? "",
  };
}

function toRow(l: Listing): Record<string, unknown> {
  return {
    id: l.id,
    status: l.status,
    seller_name: l.sellerName,
    seller_email: l.sellerEmail,
    seller_phone: l.sellerPhone,
    cruise_line: l.cruiseLine,
    ship: l.ship,
    sail_date: l.sailDate,
    nights: l.nights,
    itinerary: l.itinerary,
    cabin_type: l.cabinType,
    guests: l.guests,
    booking_ref: l.bookingRef,
    cabin_number: l.cabinNumber ?? "",
    paid_in_full: l.paidInFull ?? false,
    passengers: l.passengers ?? [],
    price_paid: l.pricePaid,
    penalty_amount: l.penaltyAmount ?? 0,
    desired_back: l.desiredBack ?? 0,
    desired_refund_pct: l.desiredRefundPct ?? 0,
    buyer_price: l.buyerPrice,
    seller_refund: l.sellerRefund,
    notes: l.notes,
  };
}

/** All listings (admin). */
export async function getListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("last_minute_listings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toListing);
}

/** Publicly visible (live) listings for the buyer board. */
export async function getListedListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("last_minute_listings")
    .select("*")
    .eq("status", "listed")
    .order("sail_date", { ascending: true });
  if (error || !data) return [];
  return data.map(toListing);
}

export async function saveListing(l: Listing): Promise<boolean> {
  const { error } = await supabase.from("last_minute_listings").upsert(toRow(l));
  return !error;
}

export async function updateListing(
  id: string,
  patch: Partial<Record<string, unknown>>
): Promise<void> {
  await supabase.from("last_minute_listings").update(patch).eq("id", id);
}

export async function deleteListing(id: string): Promise<void> {
  await supabase.from("last_minute_listings").delete().eq("id", id);
}

export function generateId(): string {
  return (
    "lm-" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
  );
}
