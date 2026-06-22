"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  type Booking,
  getBooking,
  fmt$,
  fmtDate,
  fmtDateShort,
  getBookingBalance,
  getTotalPaid,
  isOverdue,
} from "@/lib/sea-pay";

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    setBooking(getBooking(id));
  }, [id]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚢</div>
          <p className="text-gray-500 font-bold">Invoice not found.</p>
        </div>
      </div>
    );
  }

  const balance = getBookingBalance(booking);
  const collected = getTotalPaid(booking);

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Print controls — hidden when printing */}
      <div className="print:hidden bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <a href={`/admin/bookings/${booking.id}`} className="text-blue-300 hover:text-white text-sm font-semibold">
          ← Back to Booking
        </a>
        <button
          onClick={() => window.print()}
          className="bg-white text-blue-900 font-bold px-5 py-2 rounded-full text-sm hover:bg-blue-50"
        >
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Invoice */}
      <div className="max-w-3xl mx-auto my-8 print:my-0 bg-white shadow-xl print:shadow-none rounded-2xl print:rounded-none overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 text-white px-10 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-black tracking-tight">
                Sea<span className="text-red-400">Pay</span>
              </div>
              <div className="text-blue-200 text-xs font-semibold mt-0.5">
                Powered by Cruises from Galveston
              </div>
              <div className="text-blue-300 text-xs mt-3">
                2502 Harborside Dr, Galveston, TX 77550
              </div>
              <div className="text-blue-300 text-xs">
                cruisesfromgalveston.texas@gmail.com
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-white">INVOICE</div>
              <div className="text-blue-200 text-sm font-mono mt-1">{booking.bookingNumber}</div>
              <div className="text-blue-300 text-xs mt-2">
                Issued: {fmtDateShort(booking.createdAt.split("T")[0])}
              </div>
              <div className={`mt-2 text-xs font-bold px-3 py-1 rounded-full inline-block ${
                balance === 0 ? "bg-green-500 text-white" : "bg-yellow-400 text-yellow-900"
              }`}>
                {balance === 0 ? "PAID IN FULL" : "BALANCE DUE"}
              </div>
            </div>
          </div>
        </div>

        {/* Bill to + Cruise info */}
        <div className="grid grid-cols-2 gap-0 border-b border-gray-100">
          <div className="px-10 py-6 border-r border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Bill To</div>
            <div className="font-extrabold text-blue-900 text-lg">{booking.customerName}</div>
            <div className="text-gray-500 text-sm">{booking.customerEmail}</div>
            <div className="text-gray-500 text-sm">{booking.customerPhone}</div>
            {booking.customerAddress && (
              <div className="text-gray-500 text-sm">{booking.customerAddress}</div>
            )}
          </div>
          <div className="px-10 py-6">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Cruise Details</div>
            <div className="font-extrabold text-blue-900">{booking.ship}</div>
            <div className="text-gray-500 text-sm">{booking.cruiseLine}</div>
            <div className="text-gray-500 text-sm mt-1">
              {fmtDate(booking.sailingDate)} → {fmtDate(booking.returnDate)}
            </div>
            <div className="text-gray-500 text-sm">{booking.nights} nights · {booking.itinerary}</div>
            {booking.confirmationNumber && (
              <div className="text-gray-400 text-xs mt-1">Ref: {booking.confirmationNumber}</div>
            )}
          </div>
        </div>

        {/* Passengers */}
        <div className="px-10 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex gap-8 text-sm">
            <div>
              <span className="text-gray-400 font-semibold">Guests: </span>
              <span className="font-bold text-blue-900">{booking.numberOfGuests}</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold">Cabin: </span>
              <span className="font-bold text-blue-900">
                {booking.cabinType}
                {booking.cabinNumber ? ` #${booking.cabinNumber}` : ""}
              </span>
            </div>
            {booking.guestNames && (
              <div>
                <span className="text-gray-400 font-semibold">Names: </span>
                <span className="font-bold text-blue-900">{booking.guestNames}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment schedule */}
        <div className="px-10 py-6">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
            Sea Pay Payment Schedule
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-2 text-gray-400 font-semibold">Payment</th>
                <th className="text-left pb-2 text-gray-400 font-semibold">Due Date</th>
                <th className="text-right pb-2 text-gray-400 font-semibold">Amount</th>
                <th className="text-right pb-2 text-gray-400 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Deposit */}
              <tr className="border-b border-gray-100">
                <td className="py-3 font-semibold text-blue-900">Deposit</td>
                <td className="py-3 text-gray-500">At Booking</td>
                <td className="py-3 text-right font-bold text-blue-900">{fmt$(booking.depositAmount)}</td>
                <td className="py-3 text-right">
                  {booking.depositPaid ? (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      ✅ Received {booking.depositPaidDate ? fmtDateShort(booking.depositPaidDate) : ""}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
              {/* Installments */}
              {booking.paymentPlan.map((inst, i) => (
                <tr key={inst.id} className="border-b border-gray-100">
                  <td className="py-3 font-semibold text-blue-900">Payment {i + 1}</td>
                  <td className="py-3 text-gray-500">{fmtDate(inst.dueDate)}</td>
                  <td className="py-3 text-right font-bold text-blue-900">{fmt$(inst.amount)}</td>
                  <td className="py-3 text-right">
                    {inst.paid ? (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        ✅ Received {inst.paidDate ? fmtDateShort(inst.paidDate) : ""}
                      </span>
                    ) : isOverdue(inst) ? (
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        ⚠️ Overdue
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
                        Due
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-6 border-t-2 border-blue-900 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Cruise Price</span>
              <span className="font-bold text-blue-900">{fmt$(booking.totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount Collected</span>
              <span className="font-bold text-green-600">{fmt$(collected)}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold">
              <span className={balance === 0 ? "text-green-600" : "text-red-600"}>
                {balance === 0 ? "✅ Paid in Full" : "Balance Due"}
              </span>
              <span className={balance === 0 ? "text-green-600" : "text-red-600"}>
                {fmt$(balance)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-10 py-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-blue-900 mb-1">
                SeaPay — Powered by Cruises from Galveston
              </div>
              <div className="text-gray-400 text-xs">
                Questions? cruisesfromgalveston.texas@gmail.com
              </div>
            </div>
            <div className="text-right text-xs text-gray-400">
              <div>No interest · No fees</div>
              <div>Final payment due 60 days before sailing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
