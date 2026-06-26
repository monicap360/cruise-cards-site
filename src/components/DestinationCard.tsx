import Link from "next/link";
import Photo from "@/components/Photo";
import type { Destination } from "@/lib/destinations";

/**
 * Immersive destination / port-of-call card. Drop a real photo at
 * /public/destinations/<slug>.jpg; until then a tropical gradient stands in.
 *
 * Pass `href` to make the whole card a clickable link (e.g. the home-page
 * gallery linking to /destinations/<slug>). Omit it to render a static card.
 */
export default function DestinationCard({
  d,
  compact = false,
  href,
}: {
  d: Destination;
  compact?: boolean;
  href?: string;
}) {
  const Wrapper = href
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={href} className="block">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <Wrapper>
    <div className={`relative rounded-2xl overflow-hidden border border-white/10 group hover:border-white/25 transition-colors ${href ? "cursor-pointer" : ""}`}>
      <Photo
        src={`/destinations/${d.slug}.jpg`}
        alt={`${d.name}, ${d.country}`}
        gradient={d.gradient}
        overlay={false}
        className={`${compact ? "h-44" : "h-60"} w-full transition-transform duration-700 group-hover:scale-105`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/35 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="label-mono text-[10px] uppercase tracking-wider text-sky-300 mb-1">
          {d.country}
        </div>
        <div className="text-white font-extrabold text-2xl uppercase tracking-tight leading-none">
          {d.name}
        </div>
        {!compact && (
          <p className="text-white/65 text-sm mt-2 leading-relaxed">{d.blurb}</p>
        )}
        {!compact && d.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {d.highlights.map((h) => (
              <span
                key={h}
                className="bg-white/10 border border-white/15 text-white/75 text-[11px] rounded-full px-2.5 py-1"
              >
                {h}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
    </Wrapper>
  );
}
