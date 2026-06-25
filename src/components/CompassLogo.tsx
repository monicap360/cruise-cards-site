/**
 * Futuristic compass mark + wordmark for the Cruise Experience Center.
 * Pure SVG — scales crisply and matches the site's sky/holo accent.
 */
export default function CompassLogo({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10 flex-shrink-0 drop-shadow-[0_0_10px_rgba(56,189,248,0.45)]"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="compass-n"
            x1="24"
            y1="9"
            x2="24"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {/* rings */}
        <circle cx="24" cy="24" r="21" stroke="rgba(125,211,252,0.55)" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="15" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        {/* cardinal ticks */}
        <g stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round">
          <line x1="24" y1="3.5" x2="24" y2="8" />
          <line x1="44.5" y1="24" x2="40" y2="24" />
          <line x1="24" y1="44.5" x2="24" y2="40" />
          <line x1="3.5" y1="24" x2="8" y2="24" />
        </g>
        {/* needle */}
        <path d="M24 9 L27.5 24 L20.5 24 Z" fill="url(#compass-n)" />
        <path d="M24 39 L20.5 24 L27.5 24 Z" fill="rgba(255,255,255,0.32)" />
        <circle cx="24" cy="24" r="2.6" fill="#0b1020" stroke="#ffffff" strokeWidth="1.2" />
      </svg>

      {showText && (
        <span className="leading-none">
          <span className="block font-extrabold uppercase tracking-tight text-white text-base sm:text-lg leading-none">
            Cruise Experience
          </span>
          <span className="block label-mono text-[9px] uppercase tracking-[0.32em] text-sky-400/80 mt-1">
            Center
          </span>
        </span>
      )}
    </span>
  );
}
