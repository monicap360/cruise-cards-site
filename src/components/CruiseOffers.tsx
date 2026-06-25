import Link from "next/link";
import type { Offer } from "@/lib/offers";

export default function CruiseOffers({
  offers,
  contextHref = "/contact",
}: {
  offers: Offer[];
  contextHref?: string;
}) {
  if (!offers || offers.length === 0) return null;
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((o) => (
          <Link
            key={o.id}
            href={`${contextHref}${contextHref.includes("?") ? "&" : "?"}offer=${encodeURIComponent(
              o.title
            )}`}
            className="group relative bg-[#0b1020] border border-white/10 rounded-2xl p-5 hover:border-sky-400/40 transition-colors flex flex-col"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-2xl">{o.icon}</span>
              {o.badge && (
                <span className="label-mono text-[9px] uppercase tracking-wider text-sky-400/80 bg-sky-500/10 border border-sky-400/20 rounded-full px-2.5 py-1">
                  {o.badge}
                </span>
              )}
            </div>
            <h3 className="font-extrabold uppercase tracking-tight text-white text-base leading-tight">
              {o.title}
            </h3>
            <p className="text-white/55 text-sm leading-relaxed mt-1.5 flex-1">
              {o.description}
            </p>
            <span className="label-mono text-[10px] uppercase tracking-wider text-sky-400/70 group-hover:text-sky-300 transition-colors mt-4">
              Add to my quote →
            </span>
          </Link>
        ))}
      </div>
      <p className="text-white/40 text-xs mt-4">
        Offers and promotions vary by cruise line, sail date, and fare type. Tell
        us which you&rsquo;d like and we&rsquo;ll confirm what&rsquo;s available
        on your sailing and apply it to your quote.
      </p>
    </div>
  );
}
