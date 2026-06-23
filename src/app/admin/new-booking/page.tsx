"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  generateId,
  generateBookingNumber,
  calculatePaymentPlan,
  saveBooking,
  fmt$,
  fmtDate,
  CRUISE_LINES,
  CABIN_TYPES,
  type Booking,
} from "@/lib/sea-pay";

const blank = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  cruiseLine: "",
  ship: "",
  sailingDate: "",
  returnDate: "",
  nights: "",
  itinerary: "",
  cabinType: "",
  cabinNumber: "",
  numberOfGuests: "2",
  guestNames: "",
  totalPrice: "",
  depositAmount: "",
  confirmationNumber: "",
  agentName: "",
  notes: "",
};

export default function NewBookingPage() {
  const router = useRouter();
  const [form, setForm] = useState(blank);

  const set = (k: keyof typeof blank, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const total = parseFloat(form.totalPrice) || 0;
  const deposit = parseFloat(form.depositAmount) || 0;
  const plan =
    total > 0 && deposit >= 0 && form.sailingDate
      ? calculatePaymentPlan(total, deposit, form.sailingDate)
      : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const booking: Booking = {
      id: generateId(),
      bookingNumber: generateBookingNumber(),
      createdAt: new Date().toISOString(),
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      customerAddress: form.customerAddress,
      cruiseLine: form.cruiseLine,
      ship: form.ship,
      sailingDate: form.sailingDate,
      returnDate: form.returnDate,
      nights: parseInt(form.nights) || 0,
      itinerary: form.itinerary,
      cabinType: form.cabinType,
      cabinNumber: form.cabinNumber,
      numberOfGuests: parseInt(form.numberOfGuests) || 2,
      guestNames: form.guestNames,
      totalPrice: total,
      depositAmount: deposit,
      depositPaid: false,
      paymentPlan: plan,
      status: "pending",
      contractSigned: false,
      confirmationNumber: form.confirmationNumber,
      agentName: form.agentName,
      notes: form.notes,
    };
    await saveBooking(booking);
    router.push(`/admin/bookings/${booking.id}`);
  }

  const Field = ({
    label,
    name,
    type = "text",
    placeholder = "",
    required = false,
    half = false,
  }: {
    label: string;
    name: keyof typeof blank;
    type?: string;
    placeholder?: string;
    required?: boolean;
    half?: boolean;
  }) => (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => set(name, e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const Select = ({
    label,
    name,
    options,
    required = false,
    half = false,
  }: {
    label: string;
    name: keyof typeof blank;
    options: string[];
    required?: boolean;
    half?: boolean;
  }) => (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={form[name]}
        onChange={(e) => set(name, e.target.value)}
        required={required}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <a href="/admin" className="text-blue-300 hover:text-white text-sm font-semibold">
            ← Admin
          </a>
          <h1 className="text-2xl font-extrabold">New Sea Pay Booking</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-blue-900 text-lg mb-5">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" name="customerName" required half />
              <Field label="Email" name="customerEmail" type="email" required half />
              <Field label="Phone" name="customerPhone" type="tel" required half />
              <Field label="Address" name="customerAddress" placeholder="City, State" half />
            </div>
          </div>

          {/* Cruise Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-blue-900 text-lg mb-5">Cruise Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Cruise Line" name="cruiseLine" options={CRUISE_LINES} required half />
              <Field label="Ship Name" name="ship" required half />
              <Field label="Sailing Date" name="sailingDate" type="date" required half />
              <Field label="Return Date" name="returnDate" type="date" required half />
              <Field label="Number of Nights" name="nights" type="number" placeholder="7" half />
              <Field label="Cruise Line Confirmation #" name="confirmationNumber" placeholder="Optional" half />
              <Field label="Itinerary (ports of call)" name="itinerary" placeholder="Cozumel, Roatán, Belize" />
              <Select label="Cabin Type" name="cabinType" options={CABIN_TYPES} required half />
              <Field label="Cabin Number" name="cabinNumber" placeholder="Optional" half />
              <Field label="Number of Guests" name="numberOfGuests" type="number" required half />
              <Field label="Guest Names" name="guestNames" placeholder="Full names of all guests" />
            </div>
          </div>

          {/* Sea Pay Pricing */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-blue-900 text-lg mb-5">Sea Pay Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Total Cruise Price ($)" name="totalPrice" type="number" placeholder="2498.00" required half />
              <Field label="Deposit Amount ($)" name="depositAmount" type="number" placeholder="500.00" required half />
            </div>

            {/* Payment Plan Preview */}
            {plan.length > 0 && (
              <div className="mt-6 bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide">
                    Sea Pay Plan Preview
                  </h3>
                  <span className="text-xs text-blue-600 font-semibold">
                    {plan.length} installment{plan.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Deposit (due now)</span>
                    <span className="font-bold text-blue-900">{fmt$(deposit)}</span>
                  </div>
                  {plan.map((p, i) => (
                    <div key={p.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Payment {i + 1} — {fmtDate(p.dueDate)}
                      </span>
                      <span className="font-bold text-blue-900">{fmt$(p.amount)}</span>
                    </div>
                  ))}
                  <div className="border-t border-blue-200 pt-2 flex justify-between font-extrabold text-blue-900">
                    <span>Total</span>
                    <span>{fmt$(total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Agent & Notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-blue-900 text-lg mb-5">Agent & Notes</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Agent Name" name="agentName" placeholder="Your name" half />
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Internal Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={3}
                  placeholder="Preferences, special requests, follow-up notes…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <a
              href="/admin"
              className="px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full text-sm transition-all shadow-lg"
            >
              Create Booking & Generate Sea Pay Plan →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
