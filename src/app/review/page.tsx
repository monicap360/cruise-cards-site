import { GOOGLE_REVIEW_LINK } from "@/lib/reviews";

export const metadata = {
  title: "Leave a Review — Cruises from Galveston",
  description: "Loved your cruise? Leave us a quick Google review.",
};

export default function ReviewPage() {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(GOOGLE_REVIEW_LINK)}`;
  return (
    <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="text-4xl mb-3 tracking-widest text-amber-300">★★★★★</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.01em]">Loved your cruise?</h1>
        <p className="text-white/60 mt-3 leading-relaxed">
          A quick Google review means the world to a small Galveston business — and it helps other cruisers find us. It only takes a minute, and we&rsquo;re so grateful. 💙
        </p>
        <a href={GOOGLE_REVIEW_LINK} target="_blank" rel="noopener noreferrer"
          className="mt-7 inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all">
          ⭐ Leave a Google Review →
        </a>
        <div className="mt-10">
          <div className="label-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">or scan with your phone</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="Scan to leave a review" width={180} height={180} className="mx-auto rounded-xl bg-white p-2" />
        </div>
        <p className="text-white/35 text-xs mt-10">Cruises from Galveston · (409) 632‑2106</p>
      </div>
    </div>
  );
}
