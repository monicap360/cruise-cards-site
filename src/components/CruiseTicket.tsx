import Photo from "@/components/Photo";
import { fmt$, fmtDateDow, durationWord } from "@/lib/sea-pay";

export type TicketSpecial = {
  icon?: string;
  badge?: string;
  title: string;
  description?: string;
};

/**
 * Futuristic cruise ticket / boarding pass (dark HUD style). Purely
 * presentational so it can render in a server component. The photo band + the
 * special fill the ticket's dead space (the left panel next to the price stub).
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
  deposit = 50,
  destName,
  destSlug,
  destGradient,
  cabinType,
  cabinSlug,
  cabinGradient,
  shipSlug,
  special,
}: {
  ship: string;
  cruiseLine: string;
  sailingDate: string;
  returnDate: string;
  nights: number;
  itinerary: string;
  fromPrice?: number;
  fromPort?: string;
  deposit?: number;
  // Destination + cabin photos and the featured special (fill the dead space).
  destName?: string;
  destSlug?: string;
  destGradient?: string;
  cabinType?: string;
  cabinSlug?: string;
  cabinGradient?: string;
  shipSlug?: string;
  special?: TicketSpecial;
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
  const today = new Date().toISOString().slice(0, 10);
  const balance =
    fromPrice && fromPrice > deposit ? fromPrice - deposit : undefined;
  const stops = [
    { name: fromPort, sub: fmtDateDow(sailingDate), role: "Depart", home: true },
    ...ports.map((p) => ({ name: p, sub: "", role: "Port", home: false })),
    { name: fromPort, sub: fmtDateDow(returnDate), role: "Return", home: true },
  ];

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

        {/* Route timeline */}
        <div className="mt-7 overflow-x-auto pb-1">
          <div className="flex items-start min-w-max">
            {stops.map((s, i) => (
              <div key={i} className="flex items-start">
                <div className="flex flex-col items-center text-center px-1 w-[5.5rem]">
                  <span
                    className={
                      s.home
                        ? "w-3.5 h-3.5 rounded-full bg-gradient-to-br from-sky-300 to-sky-600 ring-2 ring-sky-400/25"
                        : "w-2.5 h-2.5 rounded-full bg-sky-400/70 mt-0.5"
                    }
                  />
                  <span className="text-white text-[11px] font-bold mt-2 leading-tight">
                    {s.name}
                  </span>
                  {s.sub ? (
                    <span className="text-white/55 text-[10px] mt-0.5">
                      {s.sub}
                    </span>
                  ) : (
                    <span className="label-mono text-[9px] uppercase tracking-wider text-white/35 mt-0.5">
                      {s.role}
                    </span>
                  )}
                </div>
                {i < stops.length - 1 && (
                  <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-sky-400/50 to-sky-400/50 mt-[7px] flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-white/55">
          <span>
            <span className="font-semibold text-white/80">Round-trip</span> ·
            closed-loop sailing from {fromPort}
          </span>
        </div>

        {/* Photo band — destination + cabin (fills the dead space) */}
        {(destSlug || cabinSlug) && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {destSlug && (
              <div className="relative h-28 rounded-xl overflow-hidden border border-white/10">
                <Photo
                  src={`/destinations/${destSlug}.jpg`}
                  alt={destName ?? "Your destination"}
                  gradient={destGradient}
                  overlay={false}
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/90 via-[#05070d]/20 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <div className="label-mono text-[9px] uppercase tracking-wider text-sky-300">
                    Your destination
                  </div>
                  <div className="text-white font-extrabold uppercase tracking-tight text-sm leading-tight">
                    {destName}
                  </div>
                </div>
              </div>
            )}
            {cabinSlug && (
              <div className="relative h-28 rounded-xl overflow-hidden border border-white/10">
                <Photo
                  src={`/cabins/${cabinSlug}.jpg`}
                  fallbackSrc={shipSlug ? `/ships/${shipSlug}.jpg` : undefined}
                  alt={cabinType ?? "Your cabin"}
                  gradient={cabinGradient}
                  overlay={false}
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/90 via-[#05070d]/20 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <div className="label-mono text-[9px] uppercase tracking-wider text-sky-300">
                    From this cabin
                  </div>
                  <div className="text-white font-extrabold uppercase tracking-tight text-sm leading-tight">
                    {cabinType}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Featured special */}
        {special && (
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-sky-400/30 bg-sky-500/10 p-3.5">
            <span className="text-xl leading-none flex-shrink-0">
              {special.icon ?? "🎁"}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {special.badge && (
                  <span className="label-mono text-[9px] uppercase tracking-wider text-sky-200 bg-sky-400/20 px-2 py-0.5 rounded-full">
                    {special.badge}
                  </span>
                )}
                <span className="text-white font-bold text-sm">
                  {special.title}
                </span>
              </div>
              {special.description && (
                <p className="text-white/60 text-xs mt-1 leading-snug">
                  {special.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Perforated stub */}
      <div className="relative z-10 sm:w-64 flex-shrink-0 border-t sm:border-t-0 sm:border-l border-dashed border-white/20 bg-[#05070d] p-6 sm:p-7 flex flex-col">
        <span className="hidden sm:block absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full bg-[#0b1020]" />
        <span className="hidden sm:block absolute -left-2.5 -bottom-2.5 w-5 h-5 rounded-full bg-[#0b1020]" />

        {fromPrice && fromPrice > 0 ? (
          <>
            <div className="label-mono text-[10px] uppercase text-white/40">
              Starting Rate
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-white/50 text-xs">from</span>
              <span className="text-holo text-3xl font-extrabold leading-none">
                {fmt$(fromPrice)}
              </span>
              <span className="text-white/50 text-xs">/ person</span>
            </div>
            <div className="text-[11px] text-white/50 mt-1 leading-snug">
              lowest cabin · double occupancy · taxes &amp; port fees included
            </div>
            <div className="text-[10px] text-sky-300/70 mt-1.5">
              ↓ See room types below for every cabin&rsquo;s price
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-[12px]">
              <div className="label-mono text-[9px] uppercase tracking-wider text-white/35">
                Per person
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-white/45">Fare</span>
                <span className="font-bold text-white">{fmt$(fromPrice)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-white/45">
                  − Deposit (due {fmtDateDow(today)})
                </span>
                <span className="font-bold text-white">{fmt$(deposit)}</span>
              </div>
              {balance && (
                <div className="flex justify-between gap-2 border-t border-white/10 pt-1.5 mt-1">
                  <span className="text-white/60">Balance once deposit paid</span>
                  <span className="font-extrabold text-sky-300">
                    {fmt$(balance)}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <span className="text-white/45">Final payment due</span>
                <span className="font-bold text-white">{fmtDateDow(finalDue)}</span>
              </div>
            </div>
            <div className="text-[10px] text-white/35 mt-2 leading-snug">
              {fmt$(fromPrice)} − {fmt$(deposit)} deposit = {balance ? fmt$(balance) : "—"}{" "}
              balance per person, due once your deposit is paid.
            </div>
          </>
        ) : (
          <div className="label-mono text-[11px] uppercase tracking-wider text-white/60">
            Cruise Experience Center
          </div>
        )}

        <div className="label-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mt-auto pt-4">
          Cruises from Galveston™
        </div>
      </div>
    </div>
  );
}
