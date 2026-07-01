import { CREDENTIALS } from "@/lib/credentials";

// Trust / credential badges (Houston Chronicle, CLIA, no card charged, privacy…).
export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {CREDENTIALS.map((c) => {
        const inner = (
          <>
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className="font-bold text-white text-sm">{c.title}</div>
            <div className="text-white/50 text-xs mt-1 leading-relaxed">{c.blurb}</div>
          </>
        );
        return c.href ? (
          <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer"
            className="rounded-xl border border-sky-400/30 bg-[#0b1020] p-4 text-center hover:border-sky-400/60 transition-colors">
            {inner}
          </a>
        ) : (
          <div key={c.title} className="rounded-xl border border-white/10 bg-[#0b1020] p-4 text-center">
            {inner}
          </div>
        );
      })}
    </div>
  );
}
