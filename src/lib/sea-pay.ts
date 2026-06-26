export type BookingStatus = "pending" | "confirmed" | "paid" | "cancelled";

export type PaymentInstallment = {
  id: string;
  dueDate: string;
  amount: number;
  paid: boolean;
  paidDate?: string;
  paymentMethod?: string;
  note?: string;
};

// ── Payments ledger (manual — no processor) ───────────────────────────────────
export type PaymentMethod = "check" | "in-person" | "cruise-line-direct" | "other";
export type PaymentStatus = "pending" | "cleared" | "bounced";

export type Payment = {
  id: string;
  receivedDate: string; // date the payment was taken in
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus; // checks start "pending" until they clear the bank
  clearedDate?: string;
  reference?: string; // check #, confirmation #, etc.
  payerName?: string; // name of the passenger / person who paid
  cardLast4?: string; // last 4 digits only — NEVER the full card number
  note?: string;
};

export type Booking = {
  id: string;
  bookingNumber: string;
  createdAt: string;

  // Customer
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;

  // Cruise
  cruiseLine: string;
  ship: string;
  sailingDate: string;
  returnDate: string;
  nights: number;
  itinerary: string;
  cabinType: string;
  cabinNumber?: string;
  numberOfGuests: number;
  guestNames: string;
  confirmationNumber?: string;

  // Pricing
  totalPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  depositPaidDate?: string;
  depositPaymentMethod?: string;

  // Sea Pay plan (schedule) + actual payments received (ledger)
  paymentPlan: PaymentInstallment[];
  payments: Payment[];

  status: BookingStatus;

  // Contract
  contractSigned: boolean;
  contractSignedDate?: string;
  contractSignedName?: string;

  // Chargeback evidence — proof the customer accepted terms (NO card data here)
  contractSignedAt?: string; // full ISO timestamp
  contractSignedIp?: string; // captured client IP at signing
  termsVersion?: string; // version of the Terms accepted

  // Cruise-line credit-card authorization ON FILE — reference only.
  // We NEVER store the full card number, CVV, or card images.
  ccAuthOnFile?: boolean;
  ccAuthLast4?: string;
  ccAuthCruiseLine?: string;
  ccAuthDate?: string;

  agentName?: string;
  notes?: string;
};

// Bump when the Terms & Conditions change. Stored on each signed contract so
// you can prove which version a customer agreed to.
export const TERMS_VERSION = "2026-06-24";
export const TERMS_EFFECTIVE_DATE = "June 24, 2026";

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function generateBookingNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `CFG-${year}-${rand}`;
}

export function calculatePaymentPlan(
  totalPrice: number,
  depositAmount: number,
  sailingDate: string
): PaymentInstallment[] {
  const balance = Math.max(0, totalPrice - depositAmount);
  if (balance === 0) return [];

  const sailing = new Date(sailingDate + "T12:00:00");
  // Final payment due 60 days before sailing
  const finalDue = new Date(sailing);
  finalDue.setDate(finalDue.getDate() - 60);

  // Start from 1st of next month
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const dates: Date[] = [];
  const cur = new Date(start);
  while (cur <= finalDue) {
    dates.push(new Date(cur));
    cur.setMonth(cur.getMonth() + 1);
  }

  if (dates.length === 0) {
    // Sailing too close — one lump payment on final due date
    return [
      {
        id: generateId(),
        dueDate: finalDue.toISOString().split("T")[0],
        amount: balance,
        paid: false,
      },
    ];
  }

  const base = Math.floor((balance / dates.length) * 100) / 100;
  const last =
    Math.round((balance - base * (dates.length - 1)) * 100) / 100;

  return dates.map((d, i) => ({
    id: generateId(),
    dueDate: d.toISOString().split("T")[0],
    amount: i === dates.length - 1 ? last : base,
    paid: false,
  }));
}

// Cleared money from the payments ledger (a mailed check counts only once cleared).
export function getClearedLedger(b: Booking): number {
  return (b.payments ?? [])
    .filter((p) => p.status === "cleared")
    .reduce((s, p) => s + p.amount, 0);
}

// Money received but not yet posted (uncleared checks). Excluded from the balance.
export function getPendingPayments(b: Booking): number {
  return (b.payments ?? [])
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);
}

export function getTotalPaid(b: Booking): number {
  const deposited = b.depositPaid ? b.depositAmount : 0;
  const installmentsPaid = b.paymentPlan
    .filter((p) => p.paid)
    .reduce((s, p) => s + p.amount, 0);
  return deposited + installmentsPaid + getClearedLedger(b);
}

export function getBookingBalance(b: Booking): number {
  return Math.max(0, b.totalPrice - getTotalPaid(b));
}

export const CHECK_PAYABLE_TO = "Cruises from Galveston";
export const CHECK_MAILING_ADDRESS = "3501 Winnie, Galveston, TX 77550";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "check", label: "Check (mailed)" },
  { value: "in-person", label: "In person" },
  { value: "cruise-line-direct", label: "Paid direct to cruise line" },
  { value: "other", label: "Other" },
];

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  check: "Check (mailed)",
  "in-person": "In person",
  "cruise-line-direct": "Paid direct to cruise line",
  other: "Other",
};

export function getNextPayment(b: Booking): PaymentInstallment | null {
  return b.paymentPlan.find((p) => !p.paid) ?? null;
}

export function isOverdue(inst: PaymentInstallment): boolean {
  if (inst.paid) return false;
  return new Date(inst.dueDate + "T12:00:00") < new Date();
}

// ── Supabase data layer ───────────────────────────────────────────────────────

import { supabase } from "./supabase";

function toBooking(row: Record<string, unknown>): Booking {
  return {
    id: row.id as string,
    bookingNumber: row.booking_number as string,
    createdAt: row.created_at as string,
    customerName: row.customer_name as string,
    customerEmail: (row.customer_email as string) ?? "",
    customerPhone: (row.customer_phone as string) ?? "",
    cruiseLine: (row.cruise_line as string) ?? "",
    ship: row.ship as string,
    sailingDate: row.sailing_date as string,
    returnDate: (row.return_date as string) ?? "",
    nights: (row.nights as number) ?? 0,
    itinerary: (row.itinerary as string) ?? "",
    cabinType: (row.cabin_type as string) ?? "",
    numberOfGuests: (row.guests as number) ?? 2,
    guestNames: (row.guest_names as string) ?? "",
    totalPrice: (row.total_price as number) ?? 0,
    depositAmount: (row.deposit_amount as number) ?? 0,
    depositPaid: (row.deposit_paid as boolean) ?? false,
    paymentPlan: (row.payment_plan as PaymentInstallment[]) ?? [],
    payments: (row.payments as Payment[]) ?? [],
    status: (row.status as BookingStatus) ?? "pending",
    contractSigned: (row.contract_signed as boolean) ?? false,
    contractSignedDate: row.contract_signed_date as string | undefined,
    contractSignedName: row.contract_signed_name as string | undefined,
    contractSignedAt: row.contract_signed_at as string | undefined,
    contractSignedIp: row.contract_signed_ip as string | undefined,
    termsVersion: row.terms_version as string | undefined,
    ccAuthOnFile: (row.cc_auth_on_file as boolean) ?? false,
    ccAuthLast4: row.cc_auth_last4 as string | undefined,
    ccAuthCruiseLine: row.cc_auth_cruise_line as string | undefined,
    ccAuthDate: row.cc_auth_date as string | undefined,
    agentName: row.agent_name as string | undefined,
    notes: row.notes as string | undefined,
  };
}

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toBooking);
}

export async function getBooking(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return toBooking(data);
}

export async function saveBooking(booking: Booking): Promise<void> {
  await supabase.from("bookings").upsert({
    id: booking.id,
    booking_number: booking.bookingNumber,
    customer_name: booking.customerName,
    customer_email: booking.customerEmail,
    customer_phone: booking.customerPhone,
    cruise_line: booking.cruiseLine,
    ship: booking.ship,
    sailing_date: booking.sailingDate,
    return_date: booking.returnDate,
    nights: booking.nights,
    itinerary: booking.itinerary,
    cabin_type: booking.cabinType,
    guests: booking.numberOfGuests,
    guest_names: booking.guestNames,
    total_price: booking.totalPrice,
    deposit_amount: booking.depositAmount,
    deposit_paid: booking.depositPaid,
    payment_plan: booking.paymentPlan,
    payments: booking.payments,
    status: booking.status,
    contract_signed: booking.contractSigned,
    contract_signed_date: booking.contractSignedDate,
    contract_signed_name: booking.contractSignedName,
    contract_signed_at: booking.contractSignedAt,
    contract_signed_ip: booking.contractSignedIp,
    terms_version: booking.termsVersion,
    cc_auth_on_file: booking.ccAuthOnFile ?? false,
    cc_auth_last4: booking.ccAuthLast4,
    cc_auth_cruise_line: booking.ccAuthCruiseLine,
    cc_auth_date: booking.ccAuthDate,
    agent_name: booking.agentName,
    notes: booking.notes,
  });
}

export async function deleteBooking(id: string): Promise<void> {
  await supabase.from("bookings").delete().eq("id", id);
}

// ── Formatting helpers ────────────────────────────────────────────────────────

export function fmt$(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function fmtDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtDateShort(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Date with day of week, e.g. "Sat, June 27, 2026".
export function fmtDateDow(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ── Sea Pay fee structure ─────────────────────────────────────────────────────

export const SEA_PAY_ENROLLMENT_FEE = 49.99;
export const SEA_PAY_LATE_FEE = 35.0;

export type PlanFrequency = "weekly" | "biweekly" | "monthly" | "custom";

export function buildCustomPlan(
  totalPrice: number,
  depositAmount: number,
  sailingDate: string,
  frequency: PlanFrequency,
  firstPaymentDate: string,
  customDates?: string[]
): PaymentInstallment[] {
  const balance = Math.max(0, totalPrice - depositAmount);
  if (balance === 0) return [];

  const sailing = new Date(sailingDate + "T12:00:00");
  const cutoff = new Date(sailing);
  cutoff.setDate(cutoff.getDate() - 60);

  let dates: Date[] = [];

  if (frequency === "custom" && customDates && customDates.length > 0) {
    dates = customDates
      .map((d) => new Date(d + "T12:00:00"))
      .filter((d) => d <= cutoff)
      .sort((a, b) => a.getTime() - b.getTime());
  } else {
    const stepDays =
      frequency === "weekly" ? 7 : frequency === "biweekly" ? 14 : 30;
    const cur = new Date(firstPaymentDate + "T12:00:00");
    while (cur <= cutoff) {
      dates.push(new Date(cur));
      if (frequency === "monthly") {
        cur.setMonth(cur.getMonth() + 1);
      } else {
        cur.setDate(cur.getDate() + stepDays);
      }
    }
  }

  if (dates.length === 0) {
    return [
      {
        id: generateId(),
        dueDate: cutoff.toISOString().split("T")[0],
        amount: balance,
        paid: false,
      },
    ];
  }

  const base = Math.floor((balance / dates.length) * 100) / 100;
  const last = Math.round((balance - base * (dates.length - 1)) * 100) / 100;

  return dates.map((d, i) => ({
    id: generateId(),
    dueDate: d.toISOString().split("T")[0],
    amount: i === dates.length - 1 ? last : base,
    paid: false,
  }));
}

export const CRUISE_LINES = [
  "Carnival Cruise Line",
  "Royal Caribbean",
  "Norwegian Cruise Line",
  "Princess Cruises",
  "MSC Cruises",
  "Disney Cruise Line",
];

export const CABIN_TYPES = [
  "Interior",
  "Ocean View",
  "Balcony",
  "Mini-Suite",
  "Suite",
  "Family Suite",
  "Haven Suite",
];

// Carnival markets its sailings in "days" (a 5-night cruise = "5-Day").
// Other lines use "nights". Same number, different word.
export function durationWord(cruiseLine?: string): string {
  return cruiseLine && /carnival/i.test(cruiseLine) ? "days" : "nights";
}

export function durationLabel(nights: number, cruiseLine?: string): string {
  return `${nights} ${durationWord(cruiseLine)}`;
}

// Capitalized "Days"/"Nights" for badges and headings.
export function durationWordCap(cruiseLine?: string): string {
  const w = durationWord(cruiseLine);
  return w.charAt(0).toUpperCase() + w.slice(1);
}
