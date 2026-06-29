import Photo from "@/components/Photo";
import { fmt$, fmtDate, durationWord } from "@/lib/sea-pay";

/**
 * Print-friendly, upgraded one-page cruise sheet — designed to be printed or
 * saved as PDF and brought into the Cruise Experience Center.
 *
 * Two modes:
 *  - Full sheet: destination hero + a table of every cabin price.
 *  - Single-room sheet (pass `selectedCabin`): destination hero + a featured
 *    room card with the cabin photo and that cabin's price — so a guest can
 *    print the exact offer/room they want.
 */
export default function CruiseSheet({
  ship,
  cruiseLine,
  sailingDate,
  returnDate,
  nights,
  itinerary,
  fromPort = "Galveston",
  cabins,
  selectedCabin,
  destImage,
  destName,
  destGradient = "from-sky-700 to-[#0a1f44]",
  roomImage,
  deposit = 100,
  sailingId,
}: {
  ship: string;
  cruiseLine: string;
  sailingDate: string;
  returnDate: string;
  nights: number;
  itinerary: string;
  fromPort?: string;
  cabins: { type: string; price: number }[];
  selectedCabin?: { type: string; price: number };
  destImage: string;
  destName: string;
  destGradient?: string;
  roomImage?: string;
  deposit?: number;
  sailingId?: string;
}) {
  const dur = durationWord(cruiseLine);
  const ports = itinerary
    .split(/[·,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const route = [fromPort, ...ports, fromPort].join("  →  ");

  return (
    <div className="bg-white text-gray-900 max-w-[8.5in] mx-auto border border-gray-300 print:border-0 overflow-hidden">
      {/* Destination hero */}
      <div className="relative h-52 print:h-44">
        <Photo
          src={destImage}
          alt={destName}
          gradient={destGradient}
          overlay={false}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
        {/* brand top */}
        <div className="absolute top-0 inset-x-0 flex items-start justify-between p-5 text-white">
          <div>
            <div className="text-lg font-extrabold uppercase tracking-tight leading-none drop-shadow">
              Cruises from Galveston
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/80">
              Cruise Experience Center
            </div>
          </div>
          <div className="text-right text-[11px] text-white/90 leading-snug drop-shadow">
            (409) 632-2106
            <br />
            cruisesfromgalveston.net
          </div>
        </div>
        {/* ship + nights bottom */}
        <div className="absolute bottom-0 inset-x-0 p-5 text-white">
          <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-bold mb-2">
            {nights} {dur} · {destName}
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight leading-none drop-shadow">
            {ship}
          </h1>
          <div className="text-sm text-white/85 drop-shadow">{cruiseLine}</div>
        </div>
      </div>

      <div className="p-7 print:p-6">
        {/* Dates + route */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-300 rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wider text-gray-500">Departs</div>
            <div className="font-bold">{fmtDate(sailingDate)}</div>
          </div>
          <div className="border border-gray-300 rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wider text-gray-500">Returns</div>
            <div className="font-bold">{fmtDate(returnDate)}</div>
          </div>
        </div>
        <div className="mt-3 border border-gray-300 rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Itinerary</div>
          <div className="font-semibold text-sm">{route}</div>
        </div>

        {/* Single featured room OR full price table */}
        {selectedCabin ? (
          <div className="mt-5 border-2 border-gray-900 rounded-xl overflow-hidden flex flex-col sm:flex-row">
            {roomImage && (
              <div className="relative sm:w-56 h-40 sm:h-auto flex-shrink-0">
                <Photo
                  src={roomImage}
                  alt={`${selectedCabin.type} stateroom`}
                  overlay={false}
                  className="absolute inset-0"
                />
              </div>
            )}
            <div className="flex-1 p-5">
              <div className="text-[10px] uppercase tracking-wider text-gray-500">
                Your selected cabin
              </div>
              <div className="text-2xl font-extrabold uppercase tracking-tight">
                {selectedCabin.type}
              </div>
              <div className="flex items-end gap-6 mt-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-500">From / person</div>
                  <div className="text-3xl font-extrabold leading-none">{fmt$(selectedCabin.price)}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">double occupancy</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-500">Deposit / person</div>
                  <div className="text-xl font-bold leading-none">{fmt$(deposit)}</div>
                </div>
              </div>
              <div className="text-[11px] text-gray-500 mt-3">
                Taxes, port charges &amp; government fees included. Final payment due ~90 days
                before sailing. Subject to availability.
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">
              Cabin pricing — per person, double occupancy
            </div>
            <table className="w-full text-sm border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-bold">Cabin type</th>
                  <th className="px-3 py-2 font-bold text-right">From / person</th>
                  <th className="px-3 py-2 font-bold text-right">Deposit / person</th>
                </tr>
              </thead>
              <tbody>
                {cabins.map((c) => (
                  <tr key={c.type} className="border-t border-gray-200">
                    <td className="px-3 py-2 font-semibold">{c.type}</td>
                    <td className="px-3 py-2 text-right">{fmt$(c.price)}</td>
                    <td className="px-3 py-2 text-right">{fmt$(deposit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-[11px] text-gray-500 mt-2">
              Taxes, port charges &amp; government fees included. Final payment due ~90 days
              before sailing. Prices subject to availability and may change.
            </div>
          </div>
        )}

        {/* Bring-it-in footer */}
        <div className="mt-6 border-2 border-gray-900 rounded-lg p-4">
          <div className="font-extrabold uppercase tracking-tight">
            Ready to book? Mention this sheet
          </div>
          <div className="text-sm text-gray-700 mt-1">
            Call <strong>(409) 632-2106</strong> and mention this sailing — we&rsquo;ll hold
            your cabin. No card is charged online. Two ways to take care of it:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm">
            <div className="border border-gray-300 rounded-lg p-3">
              <div className="font-bold">✉️ Mail a check</div>
              <div className="text-gray-600">3501 Winnie St, Galveston, TX 77550</div>
            </div>
            <div className="border border-gray-300 rounded-lg p-3">
              <div className="font-bold">🏢 Come in person</div>
              <div className="text-gray-600">By appointment at the Cruise Experience Center</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-4 text-sm">
            <div>
              <div className="border-b border-gray-400 h-6" />
              <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Your name</div>
            </div>
            <div>
              <div className="border-b border-gray-400 h-6" />
              <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Phone</div>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-gray-400 mt-4 flex justify-between">
          <span>Plan. Book. Protect. Sail. Return.</span>
          {sailingId && <span>Ref: {sailingId}</span>}
        </div>
      </div>
    </div>
  );
}
