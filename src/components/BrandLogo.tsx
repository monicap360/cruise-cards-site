/**
 * Modernized "Cruises from Galveston" brand logo — crisp SVG ship mark plus a
 * clean wordmark. Scales perfectly and prints sharp on invoices/receipts.
 * Pass `dark` for light text on a dark background.
 */
export default function BrandLogo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const navy = dark ? "#ffffff" : "#0a1f44";
  const red = "#d1182b";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 48"
        className="h-11 w-auto flex-shrink-0"
        fill="none"
        aria-hidden="true"
      >
        {/* speed wave */}
        <path
          d="M5 39c14 8 40 8 54 0"
          stroke="#38bdf8"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* hull */}
        <path
          d="M9 27h46l-6 10c-11 4-23 4-34 0L9 27z"
          fill={navy}
        />
        {/* superstructure */}
        <path d="M22 27l3-9h14l5 9H22z" fill={red} />
        {/* funnel sweep */}
        <path
          d="M40 18l9-6-2 7-4 1h-3z"
          fill={red}
          opacity="0.9"
        />
        {/* star */}
        <path
          d="M32 19.5l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4 1.3-2.7z"
          fill="#ffffff"
        />
      </svg>
      <span className="leading-none">
        <span
          className="block font-extrabold uppercase tracking-tight text-[1.35rem] leading-none italic"
          style={{ color: navy }}
        >
          Cruises
        </span>
        <span
          className="block font-bold uppercase tracking-[0.18em] text-[0.7rem] mt-1"
          style={{ color: red }}
        >
          From Galveston
        </span>
      </span>
    </span>
  );
}
