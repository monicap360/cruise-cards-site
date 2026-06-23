"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  type Booking,
  getBooking,
  saveBooking,
  fmt$,
  fmtDate,
  fmtDateShort,
} from "@/lib/sea-pay";

export default function ContractPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [sigName, setSigName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    getBooking(id).then((b) => {
      if (b) {
        setBooking(b);
        if (b.contractSigned) setSigned(true);
      }
    });
  }, [id]);

  async function handleSign() {
    if (!booking || !sigName.trim() || !agreed) return;
    const updated: Booking = {
      ...booking,
      contractSigned: true,
      contractSignedDate: new Date().toISOString().split("T")[0],
      contractSignedName: sigName.trim(),
      status: booking.status === "pending" ? "confirmed" : booking.status,
    };
    await saveBooking(updated);
    setBooking(updated);
    setSigned(true);
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-500 font-bold">Contract not found.</p>
        </div>
      </div>
    );
  }

  const bookingRows: [string, string][] = [
    ["Client Name", booking.customerName],
    ["Email", booking.customerEmail],
    ["Phone", booking.customerPhone],
    ["Cruise Line", booking.cruiseLine],
    ["Ship", booking.ship],
    ["Sailing Date", fmtDate(booking.sailingDate)],
    ["Return Date", fmtDate(booking.returnDate)],
    ["Duration", `${booking.nights} nights`],
    ["Itinerary", booking.itinerary],
    ["Cabin Type", booking.cabinType],
    ...(booking.cabinNumber ? [["Cabin #", booking.cabinNumber] as [string, string]] : []),
    ["Number of Guests", `${booking.numberOfGuests}`],
    ["Guest Names", booking.guestNames],
    ...(booking.confirmationNumber ? [["Cruise Line Ref #", booking.confirmationNumber] as [string, string]] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Controls */}
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

      <div className="max-w-3xl mx-auto my-8 print:my-0 bg-white shadow-xl print:shadow-none rounded-2xl print:rounded-none overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 text-white px-10 py-8 text-center">
          <div className="text-2xl font-black mb-1">
            Sea<span className="text-red-400">Pay</span> Cruise Booking Agreement
          </div>
          <div className="text-blue-200 text-sm">Powered by Cruises from Galveston</div>
          <div className="text-blue-300 text-xs mt-2 font-mono">{booking.bookingNumber}</div>
          {booking.contractSigned && (
            <div className="mt-3 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full inline-block">
              ✅ SIGNED by {booking.contractSignedName} on {booking.contractSignedDate && fmtDateShort(booking.contractSignedDate)}
            </div>
          )}
        </div>

        <div className="px-10 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          {/* Booking Summary */}
          <section>
            <h2 className="font-extrabold text-blue-900 text-base border-b border-gray-200 pb-2 mb-4">
              1. BOOKING DETAILS
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {bookingRows.map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <span className="text-gray-400 w-36 flex-shrink-0 font-semibold">{label}:</span>
                  <span className="font-bold text-blue-900">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="font-extrabold text-blue-900 text-base border-b border-gray-200 pb-2 mb-4">
              2. SEA PAY PAYMENT TERMS
            </h2>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Cruise Price:</span>
                  <span className="font-extrabold text-blue-900">{fmt$(booking.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit (due at signing):</span>
                  <span className="font-bold text-blue-900">{fmt$(booking.depositAmount)}</span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="font-semibold text-gray-600 mb-2">Installment Schedule:</div>
                  {booking.paymentPlan.map((p, i) => (
                    <div key={p.id} className="flex justify-between text-sm">
                      <span className="text-gray-500">Payment {i + 1} — {fmtDate(p.dueDate)}</span>
                      <span className="font-bold text-blue-900">{fmt$(p.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-gray-600">
              <li>The deposit is due at time of booking to secure your cabin and rate.</li>
              <li>Monthly installments are due on the 1st of each month per the schedule above.</li>
              <li>Final payment must be received no later than <strong>60 days before sailing</strong>.</li>
              <li>Payments not received within 30 days of the due date may result in booking cancellation.</li>
              <li>Sea Pay carries no interest and no fees — you pay only the cruise price.</li>
            </ul>
          </section>

          {/* Cancellation */}
          <section>
            <h2 className="font-extrabold text-blue-900 text-base border-b border-gray-200 pb-2 mb-4">
              3. CANCELLATION POLICY
            </h2>
            <p className="mb-3 text-gray-600">
              The following cancellation penalties apply based on the number of days before the sailing date that written notice of cancellation is received:
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Days Before Sailing</th>
                    <th className="px-4 py-3 text-right font-semibold">Penalty</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["91+ days", "Deposit forfeited; remaining payments refunded minus $100 fee"],
                    ["61–90 days", "25% of total cruise cost forfeited"],
                    ["31–60 days", "50% of total cruise cost forfeited"],
                    ["0–30 days", "100% of total cruise cost forfeited — no refund"],
                    ["No-show", "100% of total cruise cost forfeited"],
                  ].map(([period, penalty], i) => (
                    <tr key={period} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-semibold text-blue-900">{period}</td>
                      <td className="px-4 py-3 text-gray-600 text-right">{penalty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Travel Insurance */}
          <section>
            <h2 className="font-extrabold text-blue-900 text-base border-b border-gray-200 pb-2 mb-4">
              4. TRAVEL INSURANCE
            </h2>
            <p>
              Travel insurance is <strong>strongly recommended</strong> for all cruise bookings. Cruises from Galveston is not responsible for losses resulting from trip cancellations, interruptions, medical emergencies, missed departures, lost luggage, or other unforeseen events. Client acknowledges they have been informed of the availability of travel insurance and accept all risk associated with declining coverage.
            </p>
          </section>

          {/* Agent Role */}
          <section>
            <h2 className="font-extrabold text-blue-900 text-base border-b border-gray-200 pb-2 mb-4">
              5. AGENCY ROLE & LIABILITY
            </h2>
            <p>
              Cruises from Galveston acts as an independent travel agent on behalf of the client. We are not responsible for changes to itineraries, port closures, ship mechanical issues, weather-related delays, or any modifications made by the cruise line. We are not liable for the acts or omissions of the cruise line, tour operators, or any third-party service provider.
            </p>
          </section>

          {/* Cruise Line Policies */}
          <section>
            <h2 className="font-extrabold text-blue-900 text-base border-b border-gray-200 pb-2 mb-4">
              6. CRUISE LINE POLICIES
            </h2>
            <p>
              Client agrees to comply with all cruise line policies including but not limited to: health documentation requirements, vaccination requirements (if any), age restrictions, onboard conduct policies, alcohol policies, and port entry requirements. Failure to comply may result in denial of boarding without refund.
            </p>
          </section>

          {/* Passport / Documents */}
          <section>
            <h2 className="font-extrabold text-blue-900 text-base border-b border-gray-200 pb-2 mb-4">
              7. TRAVEL DOCUMENTS
            </h2>
            <p>
              Client is solely responsible for ensuring all travelers hold valid travel documents required for the itinerary, including valid passports (recommended for all international cruises), visas (if required), and any health documentation. Cruises from Galveston strongly recommends all guests hold a valid passport regardless of itinerary.
            </p>
          </section>

          {/* Agreement */}
          <section>
            <h2 className="font-extrabold text-blue-900 text-base border-b border-gray-200 pb-2 mb-4">
              8. AGREEMENT & ELECTRONIC SIGNATURE
            </h2>
            <p className="mb-4">
              By signing below, Client confirms they have read, understood, and agree to all terms and conditions of this Cruise Booking Agreement. Client acknowledges that an electronic signature carries the same legal weight as a handwritten signature.
            </p>

            {signed || booking.contractSigned ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <div className="font-extrabold text-green-800 text-lg">Agreement Signed</div>
                <div className="text-green-600 text-sm mt-1">
                  Signed by <strong>{booking.contractSignedName}</strong> on{" "}
                  {booking.contractSignedDate && fmtDate(booking.contractSignedDate)}
                </div>
                <div className="mt-3 text-xs text-gray-400 font-mono">{booking.bookingNumber}</div>
              </div>
            ) : (
              <div className="print:hidden bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                    Type Your Full Legal Name to Sign *
                  </label>
                  <input
                    type="text"
                    value={sigName}
                    onChange={(e) => setSigName(e.target.value)}
                    placeholder="Full legal name"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-gray-600">
                    I have read and agree to all terms and conditions in this Cruise Booking Agreement, including the cancellation policy, payment schedule, and agency liability terms.
                  </span>
                </label>
                <button
                  onClick={handleSign}
                  disabled={!sigName.trim() || !agreed}
                  className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-extrabold py-4 rounded-xl text-base transition-all"
                >
                  ✍️ Sign Agreement
                </button>
              </div>
            )}
          </section>

          {/* Signature block for print */}
          {(signed || booking.contractSigned) && (
            <section className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="border-b border-gray-400 pb-1 mb-1 font-bold text-blue-900 text-lg" style={{ fontFamily: "cursive" }}>
                    {booking.contractSignedName}
                  </div>
                  <div className="text-xs text-gray-400">Client Signature</div>
                  <div className="text-xs text-gray-400">{booking.contractSignedDate && fmtDate(booking.contractSignedDate)}</div>
                </div>
                <div>
                  <div className="border-b border-gray-400 pb-1 mb-1 font-bold text-blue-900 text-lg" style={{ fontFamily: "cursive" }}>
                    Cruises from Galveston
                  </div>
                  <div className="text-xs text-gray-400">Travel Agent</div>
                  <div className="text-xs text-gray-400">{booking.agentName || "Cruises from Galveston"}</div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-10 py-5 border-t border-gray-100 text-center text-xs text-gray-400">
          SeaPay · Powered by Cruises from Galveston · 2502 Harborside Dr, Galveston, TX 77550 · cruisesfromgalveston.texas@gmail.com
        </div>
      </div>
    </div>
  );
}
