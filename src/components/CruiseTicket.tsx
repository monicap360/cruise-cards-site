import { fmt$, fmtDateDow, durationWord } from "@/lib/sea-pay";

/**
 * Futuristic cruise ticket / boarding pass (dark HUD style). Purely
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
  const finalDue = (() => {
    const d = new Date(sailingDate + "T12:00:00");
    d.setDate(d.getDate() - 90);
    return d.toISOString().slice(0, 10);
  })();
  const balance =
    fromPrice && fromPrice > deposit ? fromPrice - deposit : undefined;

  return (
    <div className="relative flex flex-col sm:flex-row rounded-2xl overflow-hidden border border-white/10 bg-[#0b1020]">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />

      {/* Main */}
      <div className="relative z-10 flex-1 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 mb-5">
          <span className="label-mono text-[10px] uppercase tracking-[0.2em] text-sky-400/70">
            {"// Cruise Ticket · Boarding Pass"}
          </span>
          <span className="hud label-mono text-[10px] uppercase tracking-wider text-white px-2.5 py-1 rounded-full">
            {nights} {dur}
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.01em] text-white leading-none">
          {ship}
        </div>
        <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/80 mt-2">
          {cruiseLine}
        </div>

        {/* Route */}
        <div className="mt-7 flex items-start gap-4">
          <div className="text-left flex-shrink-0">
            <div className="label-mono text-[10px] uppercase tracking-wider text-white/40">
              Depart
            </div>
            <div className="font-extrabold text-sm uppercase text-white">
              {fromPort}
            </div>
            <div className="text-xs text-white/55">{fmtDateDow(sailingDate)}</div>
          </div>

          <div className="flex-1 flex flex-col items-center pt-1 min-w-0">
            <div className="text-sky-400 text-base leading-none">
              ⚓
              <span className="mx-1 text-white/25">— — —</span>🚢
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 mt-2.5">
              {ports.map((p) => (
                <span
                  key={p}
                  className="bg-white/5 border border-white/15 rounded-full px-2.5 py-1 text-[11px] font-semibold text-sky-300"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="label-mono text-[10px] uppercase tracking-wider text-white/40">
              Return
            </div>
            <div className="font-extrabold text-sm uppercase text-white">
              {fromPort}
            </div>
            <div className="text-xs text-white/55">{fmtDateDow(returnDate)}</div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-white/55">
          <span>
            <span className="font-semibold text-white/80">Round-trip</span> ·
            closed-loop sailing from {fromPort}
          </span>
          {embarkStreet && (
            <span>
              Enter at{" "}
              <span className="font-semibold text-white/80">{embarkStreet}</span>
            </span>
          )}
        </div>
      </div>

      {/* Perforated stub */}
      <div className="relative z-10 sm:w-64 flex-shrink-0 border-t sm:border-t-0 sm:border-l border-dashed border-white/20 bg-[#05070d] p-6 sm:p-7 flex flex-col">
        <span className="hidden sm:block absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full bg-[#0b1020]" />
        <span className="hidden sm:block absolute -left-2.5 -bottom-2.5 w-5 h-5 rounded-full bg-[#0b1020]" />

        {fromPrice && fromPrice > 0 ? (
          <>
            <div className="label-mono text-[10px] uppercase text-white/40">
              Fare from
            </div>
            <div className="text-holo text-3xl font-extrabold leading-none">
              {fmt$(fromPrice)}
            </div>
            <div className="text-[11px] text-white/50 mt-1 leading-snug">
              per person · double occupancy · taxes &amp; port fees included
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-[12px]">
              <div className="flex justify-between gap-2">
                <span className="text-white/45">Deposit today</span>
                <span className="font-bold text-white">
                  {fmt$(deposit)} / person
                </span>
              </div>
              {balance && (
                <div className="flex justify-between gap-2">
                  <span className="text-white/45">Balance after deposit</span>
                  <span className="font-bold text-white">
                    {fmt$(balance)} / person
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <span className="text-white/45">Final payment due</span>
                <span className="font-bold text-white">{fmtDateDow(finalDue)}</span>
              </div>
            </div>
            <div className="text-[10px] text-white/35 mt-2 leading-snug">
              Your deposit is applied to your fare — the balance is what remains.
            </div>
          </>
        ) : (
          <div className="label-mono text-[11px] uppercase tracking-wider text-white/60">
            Cruise Experience Center
          </div>
        )}

        {/* faux barcode */}
        <div className="mt-auto pt-4 flex items-end gap-[2px] h-8">
          {Array.from({ length: 38 }).map((_, i) => (
            <span
              key={i}
              className="bg-sky-400"
              style={{
                width: 2,
                height: `${[10, 26, 16, 30, 12, 22, 18, 28][i % 8]}px`,
                opacity: i % 3 === 0 ? 0.9 : 0.4,
              }}
            />
          ))}
        </div>
        <div className="label-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mt-1.5">
          Cruises from Galveston™
        </div>
      </div>
    </div>
  );
}
