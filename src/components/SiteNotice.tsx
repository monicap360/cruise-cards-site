import { SITE_NOTICE } from "@/lib/site-notice";

// Thin site-wide banner (e.g. phone outage). Controlled by lib/site-notice.ts.
export default function SiteNotice() {
  if (!SITE_NOTICE.enabled) return null;
  return (
    <div className="bg-amber-400 text-black text-center text-sm font-semibold px-4 py-2 leading-snug">
      {SITE_NOTICE.message}{" "}
      {SITE_NOTICE.email && (
        <>Email <a href={`mailto:${SITE_NOTICE.email}`} className="underline font-bold">{SITE_NOTICE.email}</a> or </>
      )}
      <a href={SITE_NOTICE.ctaHref} className="underline font-bold">{SITE_NOTICE.ctaLabel} →</a>
    </div>
  );
}
