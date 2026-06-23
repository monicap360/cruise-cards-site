"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  type Booking,
  type BookingStatus,
  getBooking,
  saveBooking,
  deleteBooking,
  fmt$,
  fmtDate,
  fmtDateShort,
  getBookingBalance,
  getTotalPaid,
  isOverdue,
  getNextPayment,
} from "@/lib/sea-pay";

const STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "paid", "cancelled"];

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  paid: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getBooking(id).then((b) => {
      if (!b) router.push("/admin");
      else setBooking(b);
    });
  }, [id, router]);

  async function update(patch: Partial<Booking>) {
    if (!booking) return;
    const updated = { ...booking, ...patch };
    await saveBooking(updated);
    setBooking(updated);
  }

  function markDepositPaid() {
    update({
      depositPaid: true,
      depositPaidDate: new Date().toISOString().split("T")[0],
      status: booking?.status === "pending" ? "confirmed" : booking?.status,
    });
  }

  function toggleInstallment(instId: string, paid: boolean) {
    if (!booking) return;
    const updated = booking.paymentPlan.map((p) =>
      p.id === instId
        ? { ...p, paid, paidDate: paid ? new Date().toISOString().split("T")[0] : undefined }
        : p
    );
    const balance = booking.totalPrice - (booking.depositPaid ? booking.depositAmount : 0) -
      updated.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0);
    update({
      paymentPlan: updated,
      status: balance <= 0 && booking.depositPaid ? "paid" : booking.status,
    });
  }

  async function handleDelete() {
    await deleteBooking(id);
    router.push("/admin");
  }

  if (!booking) return null;

  const balance = getBookingBalance(booking);
  const collected = getTotalPaid(booking);
  const nextPayment = getNextPayment(booking);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/admin" className="text-blue-300 hover:text-white text-sm font-semibold">
              ← All Bookings
            </Link>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold">{booking.customerName}</h1>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${statusColor[booking.status]}`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-blue-200 text-sm mt-1">
                {booking.bookingNumber} · {booking.ship} · Sailing {fmtDateShort(booking.sailingDate)}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                href={`/invoice/${booking.id}`}
                target="_blank"
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-4 py-2 rounded-full text-sm transition-all"
              >
                📄 Invoice
              </Link>
              <Link
                href={`/contract/${booking.id}`}
                target="_blank"
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-4 py-2 rounded-full text-sm transition-all"
              >
                📝 Contract
              </Link>
              <select
                value={booking.status}
                onChange={(e) => update({ status: e.target.value as BookingStatus })}
                className="bg-white/20 text-white font-bold px-4 py-2 rounded-full text-sm border border-white/30 focus:outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="text-blue-900">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Price", value: fmt$(booking.totalPrice), color: "text-blue-900" },
            { label: "Collected", value: fmt$(collected), color: "text-green-600" },
            { label: "Balance Due", value: fmt$(balance), color: balance > 0 ? "text-red-600" : "text-green-600" },
            { label: "Next Payment", value: nextPayment ? fmt$(nextPayment.amount) : "—", color: "text-blue-900" },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <div className={`text-2xl font-extrabold ${c.color}`}>{c.value}</div>
              <div className="text-gray-400 text-xs font-semibold mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cruise Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-blue-900 mb-4">Cruise Details</h2>
            <dl className="space-y-2 text-sm">
              {[
                ["Cruise Line", booking.cruiseLine],
                ["Ship", booking.ship],
                ["Sailing Date", fmtDate(booking.sailingDate)],
                ["Return Date", fmtDate(booking.returnDate)],
                ["Nights", `${booking.nights} nights`],
                ["Itinerary", booking.itinerary],
                ["Cabin Type", booking.cabinType],
                booking.cabinNumber ? ["Cabin #", booking.cabinNumber] : null,
                ["Guests", `${booking.numberOfGuests}`],
                ["Guest Names", booking.guestNames],
                booking.confirmationNumber ? ["Cruise Line Ref #", booking.confirmationNumber] : null,
              ]
                .filter((x): x is string[] => Array.isArray(x))
                .map((row) => (
                  <div key={row[0]} className="flex gap-2">
                    <dt className="text-gray-400 w-36 flex-shrink-0">{row[0]}</dt>
                    <dd className="font-semibold text-blue-900">{row[1]}</dd>
                  </div>
                ))}
            </dl>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-extrabold text-blue-900 mb-4">Customer</h2>
            <dl className="space-y-2 text-sm">
              {[
                ["Name", booking.customerName],
                ["Email", booking.customerEmail],
                ["Phone", booking.customerPhone],
                booking.customerAddress ? ["Address", booking.customerAddress] : null,
                booking.agentName ? ["Agent", booking.agentName] : null,
              ]
                .filter((x): x is string[] => Array.isArray(x))
                .map((row) => (
                  <div key={row[0]} className="flex gap-2">
                    <dt className="text-gray-400 w-24 flex-shrink-0">{row[0]}</dt>
                    <dd className="font-semibold text-blue-900">{row[1]}</dd>
                  </div>
                ))}
            </dl>

            {/* Contract status */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Contract</span>
                {booking.contractSigned ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    ✅ Signed by {booking.contractSignedName} on {booking.contractSignedDate && fmtDateShort(booking.contractSignedDate)}
                  </span>
                ) : (
                  <Link
                    href={`/contract/${booking.id}`}
                    target="_blank"
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100"
                  >
                    Send for Signature →
                  </Link>
                )}
              </div>
            </div>

            {booking.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-gray-600">{booking.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sea Pay Payment Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-extrabold text-blue-900 mb-5">Sea Pay Payment Schedule</h2>

          {/* Deposit row */}
          <div className={`flex items-center justify-between p-4 rounded-xl mb-3 border ${
            booking.depositPaid
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }`}>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={booking.depositPaid}
                onChange={() =>
                  booking.depositPaid
                    ? update({ depositPaid: false, depositPaidDate: undefined })
                    : markDepositPaid()
                }
                className="w-5 h-5 accent-green-600 cursor-pointer"
              />
              <div>
                <div className="font-bold text-blue-900 text-sm">Deposit</div>
                <div className="text-gray-400 text-xs">
                  {booking.depositPaid && booking.depositPaidDate
                    ? `Received ${fmtDateShort(booking.depositPaidDate)}`
                    : "Due at booking"}
                </div>
              </div>
            </div>
            <div className="font-extrabold text-blue-900 text-lg">{fmt$(booking.depositAmount)}</div>
          </div>

          {/* Installments */}
          {booking.paymentPlan.map((inst, i) => {
            const overdue = isOverdue(inst);
            return (
              <div
                key={inst.id}
                className={`flex items-center justify-between p-4 rounded-xl mb-2 border ${
                  inst.paid
                    ? "bg-green-50 border-green-200"
                    : overdue
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={inst.paid}
                    onChange={() => toggleInstallment(inst.id, !inst.paid)}
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-blue-900 text-sm">
                      Payment {i + 1}
                      {overdue && (
                        <span className="ml-2 text-xs text-red-600 font-bold">⚠️ Overdue</span>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Due {fmtDate(inst.dueDate)}
                      {inst.paid && inst.paidDate && ` · Received ${fmtDateShort(inst.paidDate)}`}
                    </div>
                  </div>
                </div>
                <div className="font-extrabold text-blue-900 text-lg">{fmt$(inst.amount)}</div>
              </div>
            );
          })}

          {/* Total row */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <div>
              <div className="font-extrabold text-blue-900">
                {balance === 0 ? "✅ Paid in Full" : `${fmt$(balance)} remaining`}
              </div>
              <div className="text-gray-400 text-xs">{fmt$(collected)} collected of {fmt$(booking.totalPrice)}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-blue-900">{fmt$(booking.totalPrice)}</div>
              <div className="text-gray-400 text-xs">Total</div>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
          <h2 className="font-extrabold text-red-700 mb-3">Danger Zone</h2>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 font-semibold"
            >
              Delete Booking
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm text-red-700 font-semibold">Are you sure? This cannot be undone.</p>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
