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
  getPendingPayments,
  PAYMENT_METHOD_LABEL,
  CHECK_PAYABLE_TO,
  CHECK_MAILING_ADDRESS,
} from "@/lib/sea-pay";

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    getBooking(id).then((b) => setBooking(b));
  }, [id]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚢</div>
          <p className="text-gray-500 font-bold">Receipt not found.</p>
        </div>
      </div>
    );
  }

  const balance = getBookingBalance(booking);
  const collected = getTotalPaid(booking);
  const pending = getPendingPayments(booking);
  const payments = [...booking.payments].sort((a, b) =>
    a.receivedDate.localeCompare(b.receivedDate)
  );

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Print controls — hidden when printing */}
      <div className="print:hidden bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <a
          href={`/admin/bookings/${booking.id}`}
          className="text-blue-300 hover:text-white text-sm font-semibold"
        >
          ← Back to Booking
        </a>
        <button
          onClick={() => window.print()}
          className="bg-white text-blue-900 font-bold px-5 py-2 rounded-full text-sm hover:bg-blue-50"
        >
          🖨️ Print / Save PDF
        </button>
      </div>

      <div className="max-w-3xl mx-auto my-8 print:my-0 bg-white shadow-xl print:shadow-none rounded-2xl print:rounded-none overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 text-white px-10 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-black tracking-tight">
                Cruises from Galveston
              </div>
              <div className="text-blue-200 text-xs font-semibold mt-0.5">
                Cruise Experience Center
              </div>
              <div className="text-blue-300 text-xs mt-3">
                {CHECK_MAILING_ADDRESS}
              </div>
              <div className="text-blue-300 text-xs">
                cruisesfromgalveston.texas@gmail.com
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-white">RECEIPT</div>
              <div className="text-blue-200 text-sm font-mono mt-1">
                {booking.bookingNumber}
              </div>
              <div className="text-blue-300 text-xs mt-2">
                Issued: {fmtDateShort(new Date().toISOString().split("T")[0])}
              </div>
              <div
                className={`mt-2 text-xs font-bold px-3 py-1 rounded-full inline-block ${
                  balance === 0
                    ? "bg-green-500 text-white"
                    : "bg-yellow-400 text-yellow-900"
                }`}
              >
                {balance === 0 ? "PAID IN FULL" : "BALANCE DUE"}
              </div>
            </div>
          </div>
        </div>

        {/* Bill to + cruise */}
        <div className="grid grid-cols-2 gap-0 border-b border-gray-100">
          <div className="px-10 py-6 border-r border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Received From
            </div>
            <div className="font-extrabold text-blue-900 text-lg">
              {booking.customerName}
            </div>
            <div className="text-gray-500 text-sm">{booking.customerEmail}</div>
            <div className="text-gray-500 text-sm">{booking.customerPhone}</div>
          </div>
          <div className="px-10 py-6">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Cruise
            </div>
            <div className="font-extrabold text-blue-900">{booking.ship}</div>
            <div className="text-gray-500 text-sm">{booking.cruiseLine}</div>
            <div className="text-gray-500 text-sm mt-1">
              {fmtDate(booking.sailingDate)}
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="px-10 py-6">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
            Payments Received
          </div>
          {payments.length === 0 ? (
            <p className="text-gray-400 text-sm">No payments recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-2 text-gray-400 font-semibold">Date</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Method</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Ref</th>
                  <th className="text-right pb-2 text-gray-400 font-semibold">Amount</th>
                  <th className="text-right pb-2 text-gray-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-600">
                      {fmtDateShort(p.receivedDate)}
                    </td>
                    <td className="py-3 font-semibold text-blue-900">
                      {PAYMENT_METHOD_LABEL[p.method]}
                      {p.cardLast4 ? (
                        <span className="text-gray-400 font-mono text-xs"> ••••{p.cardLast4}</span>
                      ) : null}
                      {p.payerName ? (
                        <div className="text-gray-400 font-normal text-xs">{p.payerName}</div>
                      ) : null}
                    </td>
                    <td className="py-3 text-gray-400 font-mono text-xs">
                      {p.reference ? `#${p.reference}` : "—"}
                    </td>
                    <td className="py-3 text-right font-bold text-blue-900">
                      {fmt$(p.amount)}
                    </td>
                    <td className="py-3 text-right">
                      {p.status === "cleared" ? (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          ✅ Posted
                        </span>
                      ) : p.status === "pending" ? (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          Pending clearance
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          Bounced
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Totals */}
          <div className="mt-6 border-t-2 border-blue-900 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Cruise Price</span>
              <span className="font-bold text-blue-900">{fmt$(booking.totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Posted (cleared)</span>
              <span className="font-bold text-green-600">{fmt$(collected)}</span>
            </div>
            {pending > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pending clearance (not yet posted)</span>
                <span className="font-bold text-amber-600">{fmt$(pending)}</span>
              </div>
            )}
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

        {/* Consent on file — dispute evidence */}
        {(booking.contractSigned || booking.ccAuthOnFile) && (
          <div className="px-10 py-5 border-t border-gray-100 text-xs text-gray-500">
            <div className="font-extrabold text-blue-900 text-sm mb-1">
              Consent on File
            </div>
            {booking.contractSigned && (
              <div>
                Terms &amp; Cruise Booking Agreement accepted by{" "}
                <strong>{booking.contractSignedName}</strong>
                {booking.contractSignedAt
                  ? ` on ${new Date(booking.contractSignedAt).toLocaleString("en-US")}`
                  : booking.contractSignedDate
                    ? ` on ${fmtDateShort(booking.contractSignedDate)}`
                    : ""}
                {booking.contractSignedIp ? ` · IP ${booking.contractSignedIp}` : ""}
                {booking.termsVersion ? ` · Terms ${booking.termsVersion}` : ""}.
              </div>
            )}
            {booking.ccAuthOnFile && (
              <div>
                Cruise-line card authorization on file
                {booking.ccAuthCruiseLine ? ` (${booking.ccAuthCruiseLine}` : ""}
                {booking.ccAuthLast4 ? ` ••••${booking.ccAuthLast4}` : ""}
                {booking.ccAuthCruiseLine ? ")" : ""}
                {booking.ccAuthDate ? ` · ${fmtDateShort(booking.ccAuthDate)}` : ""}.
              </div>
            )}
          </div>
        )}

        {/* Footer — payment instructions */}
        <div className="bg-gray-50 px-10 py-6 border-t border-gray-100 text-xs text-gray-500 space-y-1">
          <div className="font-extrabold text-blue-900 text-sm mb-1">
            How to pay
          </div>
          <div>
            • By check: make payable to <strong>{CHECK_PAYABLE_TO}</strong> and mail to{" "}
            <strong>{CHECK_MAILING_ADDRESS}</strong>.
          </div>
          <div>• In person at the Cruise Experience Center, or pay the cruise line directly.</div>
          <div className="text-amber-700 font-semibold mt-1">
            Note: mailed checks post to your booking only after they clear the bank.
          </div>
          <div className="text-gray-400 mt-2">
            Vacation protection and gratuities are never included in the cruise price.
          </div>
        </div>
      </div>
    </div>
  );
}
