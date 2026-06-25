const INCLUDED = [
  "Your stateroom / cabin for the whole cruise",
  "All main dining rooms & buffet meals",
  "Onboard entertainment, shows & activities",
  "Pools, hot tubs & water features",
  "Fitness center & most onboard venues",
  "Kids & teen clubs",
  "Taxes, port charges & government fees",
];

const NOT_INCLUDED = [
  "Gratuities / crew appreciation (unless prepaid)",
  "Specialty & à la carte dining",
  "Alcohol, soda & specialty coffee packages",
  "Shore excursions in port",
  "Spa, salon & thermal suites",
  "Wi-Fi / internet packages",
  "Casino, arcade, photos & shopping",
  "Airfare, hotel, parking & transfers",
  "Travel protection (highly recommended)",
];

export default function CruiseInclusions() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Included */}
        <div className="bg-[#0b1020] border border-sky-400/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-sky-400/20 text-sky-300 flex items-center justify-center text-sm">
              ✓
            </span>
            <h3 className="font-extrabold uppercase tracking-tight text-white">
              Included in your fare
            </h3>
          </div>
          <ul className="space-y-2">
            {INCLUDED.map((x) => (
              <li
                key={x}
                className="flex items-start gap-2 text-white/70 text-sm"
              >
                <span className="text-sky-400 flex-shrink-0 mt-0.5">✓</span>
                {x}
              </li>
            ))}
          </ul>
        </div>

        {/* Not included */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-amber-400/15 text-amber-300 flex items-center justify-center text-sm">
              +
            </span>
            <h3 className="font-extrabold uppercase tracking-tight text-white">
              Not included (extra)
            </h3>
          </div>
          <ul className="space-y-2">
            {NOT_INCLUDED.map((x) => (
              <li
                key={x}
                className="flex items-start gap-2 text-white/60 text-sm"
              >
                <span className="text-amber-400/70 flex-shrink-0 mt-0.5">+</span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-white/40 text-xs mt-4">
        Inclusions vary slightly by cruise line and fare type. Ask us and
        we&apos;ll confirm exactly what&apos;s included on your sailing — and
        bundle the extras (drinks, excursions, Wi-Fi) at the best rate.
      </p>
    </div>
  );
}
