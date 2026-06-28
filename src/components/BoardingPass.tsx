import Link from "next/link";
import { fmt$ } from "@/lib/sea-pay";
import ShipImage from "@/components/ShipImage";
import Photo from "@/components/Photo";

// Map a cabin category to its room photo in /public/cabins.
function cabinPhoto(category: string): string {
  const c = (category || "").toLowerCase();
  if (c.includes("interior") || c.includes("inside")) return "interior";
  if (c.includes("ocean") || c.includes("view") || c.includes("window") || c.includes("porthole")) return "ocean-view";
  if (c.includes("suite")) return c.includes("mini") || c.includes("junior") ? "mini-suite" : "suite";
  if (c.includes("balcony") || c.includes("veranda")) return "balcony";
  return "interior";
}

export type BoardingPassProps = {
  nights: number;
  region: string; // headline route, e.g. "Western Caribbean"
  ship: string;
  cruiseLine: string;
  departLabel: string; // "30 Apr 2026" or "Departs soon"
  fromPort?: string;
  toPort: string;
  returnPort?: string;
  category: string; // "Balcony" / "JS Suite"
  total: number; // gross total for the cabin (all guests, all-in)
  guests?: number;
  deposit?: number;
  finalDueLabel?: string;
  perks?: string[];
  savings?: number;
  originalPrice?: number; // shown struck-through if higher than total
  badge?: string;
  href?: string;
  ctaLabel?: string;
  embarkStreet?: string; // Galveston entry street for this ship
  roomNumber?: string; // assigned stateroom number, if known
  deckLocation?: string; // e.g. "Deck 8 · Midship"
  mapHref?: string; // link to the ship deck map / room picker
  seaYouOnDeckHref?: string; // community link, defaults to /sea-you-on-deck
};

function Port({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="label-mono text-[10px] uppercase text-white/40 mb-0.5">
        {label}
      </div>
      <div className="font-bold text-white text-sm uppercase tracking-wide truncate">
        {value}
      </div>
    </div>
  );
}

function Dots() {
  return (
    <div className="flex-1 border-t border-dashed border-white/15 mx-1 mt-4" />
  );
}

export default function BoardingPass(props: BoardingPassProps) {
  const guests = props.guests ?? 2;
  const fromPort = props.fromPort ?? "Galveston";
  const returnPort = props.returnPort ?? "Galveston";
  const deposit = props.deposit ?? 100;
  const perGuest = guests > 0 ? Math.round(props.total / guests) : props.total;
  const balance = Math.max(0, props.total - deposit);
  const href = props.href ?? "/contact";
  const seaYouHref = props.seaYouOnDeckHref ?? "/sea-you-on-deck";

  return (
    <div className="relative flex flex-col sm:flex-row rounded-2xl overflow-hidden border border-white/10 bg-[#0b1020] hover:border-white/25 transition-colors">
      {/* ── Main ── */}
      <div className="relative flex-1 p-6 overflow-hidden">
        <ShipImage ship={props.ship} overlay={false} className="absolute inset-0" />
        <div className="absolute inset-0 bg-[#0b1020]/82" />
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <span className="hud label-mono text-[11px] uppercase tracking-wider text-white px-3 py-1.5 rounded-full">
                {props.nights}{" "}
                {/carnival/i.test(props.cruiseLine) ? "Day" : "Night"}
                {props.nights === 1 ? "" : "s"}
              </span>
              {props.badge && (
                <span className="label-mono text-[10px] uppercase tracking-wider text-sky-400/80">
                  {props.badge}
                </span>
              )}
            </div>
            {props.savings ? (
              <span className="label-mono text-[10px] uppercase tracking-wider text-sky-400/80">
                Save {fmt$(props.savings)}
              </span>
            ) : null}
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.01em] text-white mb-6 leading-[0.95]">
            {props.region}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <div className="label-mono text-[10px] uppercase text-white/40 mb-1">
                Ship
              </div>
              <div className="font-bold text-white text-sm uppercase tracking-wide">
                {props.ship}
              </div>
              <div className="label-mono text-[10px] uppercase text-sky-400/70 mt-1">
                {props.cruiseLine}
              </div>
            </div>
            <div>
              <div className="label-mono text-[10px] uppercase text-white/40 mb-1">
                Departure
              </div>
              <div className="font-bold text-white text-lg leading-tight">
                {props.departLabel}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 border-t border-white/10 pt-4">
            <Port label="From" value={fromPort} />
            <Dots />
            <Port label="To" value={props.toPort} />
            <Dots />
            <Port label="Return" value={returnPort} />
          </div>

          {props.perks && props.perks.length > 0 && (
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4">
              {props.perks.map((p) => (
                <span
                  key={p}
                  className="text-white/55 text-xs flex items-center gap-1.5"
                >
                  <span className="text-sky-400">+</span>
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Perforation + stub ── */}
      <div className="relative sm:w-80 flex-shrink-0 border-t sm:border-t-0 sm:border-l border-dashed border-white/20 bg-[#05070d] p-6 flex flex-col">
        {/* ticket notches */}
        <span className="hidden sm:block absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full bg-[#05070d]" />
        <span className="hidden sm:block absolute -left-2.5 -bottom-2.5 w-5 h-5 rounded-full bg-[#05070d]" />

        {/* Room photo */}
        <div className="relative mb-4 h-24 rounded-lg overflow-hidden">
          <Photo
            src={`/cabins/${cabinPhoto(props.category)}.jpg`}
            alt={`${props.category} stateroom`}
            overlay={false}
            className="h-24 w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/70 to-transparent" />
        </div>

        {/* Cabin + room/deck */}
        <div className="label-mono text-[10px] uppercase text-white/40 mb-1">
          Your Cabin
        </div>
        <div className="font-bold text-white uppercase tracking-wide text-sm">
          {props.category}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <div className="label-mono text-[10px] uppercase text-white/40 mb-0.5">
              Room #
            </div>
            <div className="text-white font-bold font-mono text-sm">
              {props.roomNumber && props.roomNumber.trim()
                ? props.roomNumber
                : "Assigned at booking"}
            </div>
          </div>
          <div>
            <div className="label-mono text-[10px] uppercase text-white/40 mb-0.5">
              Deck / Location
            </div>
            <div className="text-white font-bold text-sm">
              {props.deckLocation && props.deckLocation.trim()
                ? props.deckLocation
                : "—"}
            </div>
          </div>
        </div>

        {/* Price — average rate per guest, all-in */}
        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="label-mono text-[10px] uppercase text-white/40 mb-0.5">
                Avg fare / guest
              </div>
              <div className="text-holo font-extrabold text-2xl leading-none">
                {fmt$(perGuest)}
              </div>
            </div>
            <div className="text-right">
              <div className="label-mono text-[10px] uppercase text-white/40 mb-0.5">
                Total · {guests} {guests === 1 ? "guest" : "guests"}
              </div>
              <div className="flex items-baseline justify-end gap-2">
                {props.originalPrice && props.originalPrice > props.total ? (
                  <span className="text-white/35 text-xs line-through">
                    {fmt$(props.originalPrice)}
                  </span>
                ) : null}
                <span className="text-white font-bold text-lg">
                  {fmt$(props.total)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-[10px] leading-snug text-sky-400/80">
            Taxes, port charges &amp; government fees included · USD
          </div>
        </div>

        {/* Deposit / balance */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <div className="label-mono text-[10px] uppercase text-white/40 mb-0.5">
              Deposit Today
            </div>
            <div className="text-white font-bold">{fmt$(deposit)}</div>
          </div>
          <div>
            <div className="label-mono text-[10px] uppercase text-white/40 mb-0.5">
              Balance
            </div>
            <div className="text-white/70 font-bold">{fmt$(balance)}</div>
          </div>
        </div>
        {props.finalDueLabel && (
          <div className="label-mono text-[10px] uppercase text-white/40 mt-2">
            Final payment due {props.finalDueLabel}
          </div>
        )}

        {/* Actions */}
        <Link
          href={href}
          className="mt-5 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs text-center px-5 py-3 rounded-full transition-all"
        >
          {props.ctaLabel ?? "Book Now"}
        </Link>

        <Link
          href={seaYouHref}
          className="mt-3 text-center text-[11px] text-sky-400/80 hover:text-sky-300 transition-colors"
        >
          See who&rsquo;s on your sailing → Sea You on Deck
        </Link>
      </div>
    </div>
  );
}
