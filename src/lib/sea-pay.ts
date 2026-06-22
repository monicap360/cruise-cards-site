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

  // Sea Pay plan
  paymentPlan: PaymentInstallment[];

  status: BookingStatus;

  // Contract
  contractSigned: boolean;
  contractSignedDate?: string;
  contractSignedName?: string;

  agentName?: string;
  notes?: string;
};

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

export function getBookingBalance(b: Booking): number {
  const deposited = b.depositPaid ? b.depositAmount : 0;
  const installmentsPaid = b.paymentPlan
    .filter((p) => p.paid)
    .reduce((s, p) => s + p.amount, 0);
  return Math.max(0, b.totalPrice - deposited - installmentsPaid);
}

export function getTotalPaid(b: Booking): number {
  const deposited = b.depositPaid ? b.depositAmount : 0;
  const installmentsPaid = b.paymentPlan
    .filter((p) => p.paid)
    .reduce((s, p) => s + p.amount, 0);
  return deposited + installmentsPaid;
}

export function getNextPayment(b: Booking): PaymentInstallment | null {
  return b.paymentPlan.find((p) => !p.paid) ?? null;
}

export function isOverdue(inst: PaymentInstallment): boolean {
  if (inst.paid) return false;
  return new Date(inst.dueDate + "T12:00:00") < new Date();
}

// ── localStorage data layer (replace with Supabase calls later) ──────────────

export function getBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("cfg-bookings") ?? "[]");
  } catch {
    return [];
  }
}

export function getBooking(id: string): Booking | null {
  return getBookings().find((b) => b.id === id) ?? null;
}

export function saveBooking(booking: Booking): void {
  const all = getBookings();
  const idx = all.findIndex((b) => b.id === booking.id);
  if (idx >= 0) all[idx] = booking;
  else all.unshift(booking);
  localStorage.setItem("cfg-bookings", JSON.stringify(all));
}

export function deleteBooking(id: string): void {
  const all = getBookings().filter((b) => b.id !== id);
  localStorage.setItem("cfg-bookings", JSON.stringify(all));
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
