import { REVIEWS, GOOGLE_REVIEWS_URL, GOOGLE_REVIEW_LINK, GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from "@/lib/reviews";

// Showcase your Google reviews. Shows a rating badge + featured review cards +
// "read all" / "leave a review" buttons. Populate REVIEWS in lib/reviews.ts.
export default function Reviews() {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="label-mono text-base uppercase text-sky-400/80 font-bold">{"// What our cruisers say"}</div>
        <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-sky-200 text-sm font-bold">
          {GOOGLE_RATING ? `⭐ ${GOOGLE_RATING} on Google${GOOGLE_REVIEW_COUNT ? ` · ${GOOGLE_REVIEW_COUNT} reviews` : ""}` : "⭐ Read our Google reviews"} →
        </a>
      </div>

      {REVIEWS.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-[#0b1020] p-4">
              <div className="text-amber-300 text-sm tracking-widest">{"★".repeat(r.stars || 5)}</div>
              <p className="text-white/70 text-sm mt-1.5 italic leading-relaxed">&ldquo;{r.text}&rdquo;</p>
              <div className="text-white/45 text-xs mt-2">— {r.name} · <span className="text-sky-300/70">Verified Google review</span></div>
            </div>
          ))}
        </div>
      )}

      <a href={GOOGLE_REVIEW_LINK} target="_blank" rel="noopener noreferrer"
        className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">
        ⭐ Leave us a Google review
      </a>
    </div>
  );
}
