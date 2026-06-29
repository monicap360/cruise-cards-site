/**
 * "Cruises from Galveston" brand logo — a crisp SVG (red ship, blue speed swoosh,
 * white star) with the wordmark. Renders sharp on screen and in print (invoices,
 * receipts) with no external file, so it never shows a broken image. Pass `dark`
 * for light text on a dark background.
 */
export default function BrandLogo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const navy = dark ? "#ffffff" : "#16357e";
  const red = "#e1232f";
  const blue = dark ? "#9cc2ff" : "#1f4fb0";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 80 54" className="h-12 w-auto flex-shrink-0" fill="none" aria-hidden="true">
        {/* ship hull */}
        <path d="M12 24h50l-7 9c-13 4-26 4-39 0l-4-9z" fill={red} />
        {/* superstructure */}
        <path d="M26 24l3-8h13l5 8H26z" fill={red} />
        {/* funnel sweep */}
        <path d="M44 16l8-5-1.5 6-3 .8h-3.5z" fill={red} opacity="0.85" />
        {/* blue speed swoosh */}
        <path d="M6 37c18 8 44 8 62-2l-3 7c-18 8-42 7-57 0l-2-5z" fill={blue} />
        {/* star */}
        <path d="M33 18.5l1.4 2.9 3.2.4-2.3 2.2.6 3.1-2.9-1.5-2.8 1.5.5-3.1-2.3-2.2 3.2-.4 1.4-2.9z" fill="#ffffff" />
      </svg>
      <span className="leading-none">
        <span className="block font-extrabold uppercase tracking-tight text-[1.4rem] leading-none italic" style={{ color: navy }}>Cruises</span>
        <span className="block font-bold uppercase tracking-[0.2em] text-[0.68rem] mt-1" style={{ color: red }}>From Galveston</span>
      </span>
    </span>
  );
}
