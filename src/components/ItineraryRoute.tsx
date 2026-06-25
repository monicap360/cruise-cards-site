/**
 * Visual closed-loop itinerary: Galveston → ports → Galveston, with stop dots
 * and dashed connectors. Galveston bookends are highlighted (depart / return).
 */
export default function ItineraryRoute({
  itinerary,
  fromPort = "Galveston",
}: {
  itinerary: string;
  fromPort?: string;
}) {
  const ports = itinerary
    .split(/[·,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const stops = [
    { name: fromPort, role: "Depart", home: true },
    ...ports.map((p) => ({ name: p, role: "Port", home: false })),
    { name: fromPort, role: "Return", home: true },
  ];

  return (
    <div className="flex items-start flex-wrap gap-y-4">
      {stops.map((s, i) => (
        <div key={i} className="flex items-start">
          <div className="flex flex-col items-center text-center w-24">
            <span
              className={`flex items-center justify-center w-9 h-9 rounded-full text-sm ${
                s.home
                  ? "bg-gradient-to-br from-sky-400 to-sky-600 text-[#05070d]"
                  : "bg-white/10 border border-sky-400/40 text-sky-300"
              }`}
            >
              {s.home ? "⚓" : i}
            </span>
            <span className="text-white font-bold text-xs mt-2 leading-tight">
              {s.name}
            </span>
            <span className="label-mono text-[9px] uppercase tracking-wider text-white/40 mt-0.5">
              {s.role}
            </span>
          </div>
          {i < stops.length - 1 && (
            <div className="hidden sm:block w-8 lg:w-12 border-t-2 border-dashed border-sky-400/30 mt-4" />
          )}
        </div>
      ))}
    </div>
  );
}
