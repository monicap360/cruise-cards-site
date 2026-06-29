import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import OfferActions from "@/components/OfferActions";
import { fmt$, fmtDate } from "@/lib/sea-pay";
import { getOfferByToken, setOfferStatus } from "@/lib/crm";

export const dynamic = "force-dynamic";

export default async function OfferPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const offer = await getOfferByToken(token);

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900">Offer not found</h1>
        <p className="text-gray-500">This link may have expired. Call (409) 632-2106 and we&rsquo;ll help.</p>
        <Link href="/" className="text-sky-600 font-semibold">cruisesfromgalveston.net →</Link>
      </div>
    );
  }

  // Mark as viewed (only if still "Sent")
  if (offer.status === "Sent") {
    try { await setOfferStatus(token, "Viewed"); } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-center mb-5">
          <span className="bg-white rounded-xl px-4 py-3 inline-flex shadow-sm"><BrandLogo /></span>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-sky-600 to-blue-800 text-white p-6">
            <div className="text-[11px] font-bold uppercase tracking-widest text-sky-200">Your exclusive cruise offer</div>
            <h1 className="text-2xl font-extrabold mt-1">{offer.title || "Your Cruise Offer"}</h1>
            {offer.customerName && <div className="text-sky-100 text-sm mt-1">Prepared for {offer.customerName}</div>}
          </div>

          <div className="p-6 space-y-4 text-gray-900">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {offer.ship && <Info label="Ship" value={offer.ship} />}
              {offer.cruiseLine && <Info label="Cruise line" value={offer.cruiseLine} />}
              {offer.sailDate && <Info label="Sail date" value={fmtDate(offer.sailDate)} />}
              {offer.nights > 0 && <Info label="Length" value={`${offer.nights} nights`} />}
              {offer.cabinType && <Info label="Cabin" value={offer.cabinType} />}
            </div>

            {(offer.pricePP > 0 || offer.total > 0) && (
              <div className="rounded-2xl bg-sky-50 border border-sky-100 p-5 text-center">
                {offer.pricePP > 0 && (
                  <>
                    <div className="text-4xl font-extrabold text-sky-700">{fmt$(offer.pricePP)}</div>
                    <div className="text-gray-500 text-sm">per person</div>
                  </>
                )}
                {offer.total > 0 && <div className="text-gray-700 text-sm mt-2">Total: <span className="font-bold">{fmt$(offer.total)}</span></div>}
                <div className="text-gray-400 text-xs mt-1">Taxes &amp; fees included</div>
              </div>
            )}

            {offer.notes && (
              <div className="text-gray-600 text-sm whitespace-pre-wrap border-t border-gray-100 pt-4">{offer.notes}</div>
            )}

            <OfferActions token={token} initialStatus={offer.status} />
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-5">
          Cruises from Galveston · (409) 632-2106 · 2727 Broadway Ave J, Galveston, TX 77550
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
