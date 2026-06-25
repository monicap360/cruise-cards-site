"use client";

import {
  type Cabin,
  type CabinLocation,
  type CabinSide,
  CABIN_LOCATIONS,
  CATEGORY_ICON,
} from "@/lib/room-blocks";

// Schematic deck plan: Forward → Aft (left→right), Port (top) / Starboard (bottom).
// Cabins are placed by their location + side; guarantee (GTY) cabins have no
// physical position and are not shown here.

type Props = {
  cabins: Cabin[];
  deck: number;
  selectedId?: string;
  onSelectCabin: (cabin: Cabin) => void;
  onAddAt?: (location: CabinLocation, side: CabinSide) => void;
};

const ROWS: { side: CabinSide; label: string }[] = [
  { side: "Port", label: "PORT" },
  { side: "Both", label: "INSIDE / BOTH" },
  { side: "Starboard", label: "STARBOARD" },
];

const STATUS_CELL: Record<string, string> = {
  available: "bg-green-100 border-green-300 text-green-800 hover:bg-green-200",
  held: "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200",
  booked: "bg-red-100 border-red-300 text-red-800 hover:bg-red-200",
};

export default function ShipDeckMap({
  cabins,
  deck,
  selectedId,
  onSelectCabin,
  onAddAt,
}: Props) {
  const deckCabins = cabins.filter((c) => c.deck === deck && !c.isGuarantee);

  const at = (location: CabinLocation, side: CabinSide) =>
    deckCabins
      .filter((c) => c.location === location && c.side === side)
      .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));

  return (
    <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 overflow-x-auto">
      {/* Column headers */}
      <div className="flex items-stretch gap-2 min-w-[640px]">
        {/* Bow */}
        <div className="flex items-center justify-center w-10 flex-shrink-0">
          <div className="text-blue-400 text-xs font-bold -rotate-90 whitespace-nowrap tracking-widest">
            ◀ BOW
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {CABIN_LOCATIONS.map((loc) => (
              <div
                key={loc}
                className="text-center text-xs font-extrabold text-blue-700 uppercase tracking-wide"
              >
                {loc}
              </div>
            ))}
          </div>

          {/* Rows: Port / Both / Starboard */}
          <div className="space-y-2">
            {ROWS.map((row) => (
              <div key={row.side}>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {row.label}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {CABIN_LOCATIONS.map((loc) => {
                    const zone = at(loc, row.side);
                    return (
                      <div
                        key={loc}
                        className="min-h-[56px] rounded-xl border border-dashed border-blue-200 bg-white/60 p-1.5 flex flex-wrap gap-1.5 content-start"
                      >
                        {zone.map((cabin) => {
                          const selected = cabin.id === selectedId;
                          return (
                            <button
                              key={cabin.id}
                              onClick={() => onSelectCabin(cabin)}
                              title={`Room ${cabin.roomNumber} · ${cabin.type} · ${cabin.status}`}
                              className={`text-[11px] font-bold font-mono px-1.5 py-1 rounded-lg border transition-all ${
                                STATUS_CELL[cabin.status] ?? STATUS_CELL.available
                              } ${selected ? "ring-2 ring-blue-600 ring-offset-1" : ""}`}
                            >
                              <span className="mr-0.5">
                                {CATEGORY_ICON[cabin.type]}
                              </span>
                              {cabin.roomNumber}
                            </button>
                          );
                        })}
                        {onAddAt && (
                          <button
                            onClick={() => onAddAt(loc, row.side)}
                            title={`Add a room here (${loc}, ${row.side}, Deck ${deck})`}
                            className="text-[11px] font-bold px-1.5 py-1 rounded-lg border border-blue-200 text-blue-400 hover:bg-blue-100 hover:text-blue-700 transition-all"
                          >
                            +
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stern */}
        <div className="flex items-center justify-center w-10 flex-shrink-0">
          <div className="text-blue-400 text-xs font-bold rotate-90 whitespace-nowrap tracking-widest">
            STERN ▶
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-blue-100 text-[11px] font-semibold text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-200 border border-green-400" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-yellow-200 border border-yellow-400" />
          Held
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-200 border border-red-400" />
          Booked
        </span>
        {onAddAt && (
          <span className="text-gray-400">· Tap “+” in a zone to add a room there</span>
        )}
      </div>
    </div>
  );
}
