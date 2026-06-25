import { fmt$, fmtDate, durationWord } from "@/lib/sea-pay";

/**
 * White-background cruise ticket / boarding pass. Print-friendly. Purely
 * presentational so it can render in a server component.
 */
export default function CruiseTicket({
  ship,
  cruiseLine,
  sailingDate,
  returnDate,
  nights,
  itinerary,
  fromPrice,
  fromPort = "Galveston",
  embarkStreet,
  deposit = 100,
}: {
  ship: string;
  cruiseLine: string;
  sailingDate: string;
  returnDate: string;
  nights: number;
  itinerary: string;
  fromPrice?: number;
  fromPort?: string;
  embarkStreet?: string;
  deposit?: number;
}) {
  const dur = durationWord(cruiseLine);
  const ports = itinerary
    .split(/[·,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  // Cruise lines typically require final payment ~90 days before sailing.
  const finalDue = (() => {
    const d = new Date(sailingDate + "T12:00:00");
    d.setDate(d.getDate() - 90);
    return d.toISOString().slice(0, 10);
  })();
  const balance =
    fromPrice && fromPrice > deposit ? fromPrice - deposit : undefined;

  return (
    <div className="flex flex-col sm:flex-row rounded-2xl overflow-hidden bg-white text-[#0a1f44] shadow-xl ring-1 ring-[#0a1f44]/10">
      {/* Main */}
      <div className="flex-1 relative">
        {/* accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#0369a1] via-sky-400 to-[#0369a1]" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="label-mono text-[10px] uppercase tracking-[0.2em] text-[#0a1f44]/50">
              Cruise Ticket · Boarding Pass
            </div>
            <div className="label-mono text-[10px] uppercase tracking-wider bg-[#0a1f44] text-white px-2.5 py-1 rounded-full">
              {nights} {dur}
            </div>
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
            {ship}
          </div>
          <div className="text-sm font-bold text-[#0369a1] mt-1">
            {cruiseLine}
          </div>

          {/* Route */}
          <div className="mt-7 flex items-start gap-4">
            <div className="text-left flex-shrink-0">
              <div className="label-mono text-[10px] uppercase tracking-wider text-[#0a1f44]/45">
                Depart
              </div>
              <div className="font-extrabold text-sm uppercase">{fromPort}</div>
              <div className="text-xs text-[#0a1f44]/70">
                {fmtDate(sailingDate)}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center pt-1 min-w-0">
              <div className="text-[#0369a1] text-base leading-none">
                ⚓
                <span className="mx-1 text-[#0a1f44]/30">— — —</span>🚢
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {ports.map((p) => (
                  <span
                    key={p}
                    className="bg-[#0a1f44]/[0.05] border border-[#0a1f44]/15 rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#0a1f44]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="label-mono text-[10px] uppercase tracking-wider text-[#0a1f44]/45">
                Return
              </div>
              <div className="font-extrabold text-sm uppercase">{fromPort}</div>
              <div className="text-xs text-[#0a1f44]/70">
                {fmtDate(returnDate)}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#0a1f44]/10 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-[#0a1f44]/70">
            <span>
              <span className="font-semibold text-[#0a1f44]">Round-trip</span> ·
              closed-loop sailing from {fromPort}
            </span>
            {embarkStreet && (
              <span>
                Enter at{" "}
                <span className="font-semibold text-[#0a1f44]">
                  {embarkStreet}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Perforated stub */}
      <div className="relative sm:w-64 flex-shrink-0 border-t sm:border-t-0 sm:border-l border-dashed border-[#0a1f44]/25 bg-[#f4f7fb] p-6 sm:p-7 flex flex-col">
        <span className="hidden sm:block absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full bg-white" />
        <span className="hidden sm:block absolute -left-2.5 -bottom-2.5 w-5 h-5 rounded-full bg-white" />

        {fromPrice && fromPrice > 0 ? (
          <>
            <div className="label-mono text-[10px] uppercase text-[#0a1f44]/45">
              Fare from
            </div>
            <div className="text-3xl font-extrabold leading-none">
              {fmt$(fromPrice)}
            </div>
            <div className="text-[11px] text-[#0a1f44]/60 mt-0.5 leading-snug">
              per person · double occupancy · taxes &amp; port fees included
            </div>

            <div className="mt-4 pt-3 border-t border-[#0a1f44]/10 space-y-1.5 text-[12px]">
              <div className="flex justify-between gap-2">
                <span className="text-[#0a1f44]/55">Deposit today</span>
                <span className="font-bold">{fmt$(deposit)} / person</span>
              </div>
              {balance && (
                <div className="flex justify-between gap-2">
                  <span className="text-[#0a1f44]/55">Balance after deposit</span>
                  <span className="font-bold">{fmt$(balance)} / person</span>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <span className="text-[#0a1f44]/55">Final payment due</span>
                <span className="font-bold">{fmtDate(finalDue)}</span>
              </div>
            </div>
            <div className="text-[10px] text-[#0a1f44]/45 mt-2 leading-snug">
              Your deposit is applied to your fare — the balance is what remains.
            </div>
          </>
        ) : (
          <div className="label-mono text-[11px] uppercase tracking-wider text-[#0a1f44]/60">
            Cruise Experience Center
          </div>
        )}

        {/* faux barcode */}
        <div className="mt-auto pt-4 flex items-end gap-[2px] h-8">
          {Array.from({ length: 38 }).map((_, i) => (
            <span
              key={i}
              className="bg-[#0a1f44]"
              style={{
                width: 2,
                height: `${[10, 26, 16, 30, 12, 22, 18, 28][i % 8]}px`,
                opacity: i % 3 === 0 ? 0.85 : 0.5,
              }}
            />
          ))}
        </div>
        <div className="label-mono text-[9px] uppercase tracking-[0.2em] text-[#0a1f44]/40 mt-1.5">
          Cruises from Galveston™
        </div>
      </div>
    </div>
  );
}
