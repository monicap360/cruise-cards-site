import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import HotelRateForm from "@/components/HotelRateForm";
import { fmtDate } from "@/lib/sea-pay";
import { getRfpByToken } from "@/lib/hotel-rfp";

export const dynamic = "force-dynamic";

export default async function HotelRfpPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const rfp = await getRfpByToken(token);

  if (!rfp) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900">Request not found</h1>
        <p className="text-gray-500">This link may have expired. Email cruisesfromgalveston.texas@gmail.com.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-center mb-5"><span className="bg-white rounded-xl px-4 py-3 shadow-sm inline-flex"><BrandLogo /></span></div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-sky-600 to-blue-800 text-white p-6">
            <div className="text-[11px] font-bold uppercase tracking-widest text-sky-200">Group Rate Request</div>
            <h1 className="text-2xl font-extrabold mt-1">{rfp.hotelName}</h1>
            <p className="text-sky-100 text-sm mt-1">Please submit your best group rate for the booking below.</p>
          </div>

          <div className="p-6 space-y-5 text-gray-900">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Group" value={rfp.groupName} />
              {rfp.ship && <Info label="Cruise" value={rfp.ship} />}
              {rfp.sailDate && <Info label="Sail date" value={fmtDate(rfp.sailDate)} />}
              {rfp.roomsNeeded > 0 && <Info label="Rooms needed" value={String(rfp.roomsNeeded)} />}
              <Info label="Pre-cruise nights" value={String(rfp.nightsBefore)} />
            </div>

            <div className="rounded-xl bg-sky-50 border border-sky-100 px-4 py-3 text-sm text-sky-900">
              Guests will park at your hotel for the sailing if you offer <strong>park‑stay‑cruise</strong>. Include your shuttle and cutoff terms below.
            </div>

            <HotelRateForm rfp={rfp} />
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-5">
          Cruises from Galveston · (409) 632-2106 · <Link href="/" className="underline">cruisesfromgalveston.net</Link>
        </p>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  );
}
