import { CREDENTIALS } from "@/lib/credentials";

// Trust / credential badges (CLIA, no card charged, privacy, real presence).
export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {CREDENTIALS.map((c) => (
        <div key={c.title} className="rounded-xl border border-white/10 bg-[#0b1020] p-4 text-center">
          <div className="text-2xl mb-1">{c.icon}</div>
          <div className="font-bold text-white text-sm">{c.title}</div>
          <div className="text-white/50 text-xs mt-1 leading-relaxed">{c.blurb}</div>
        </div>
      ))}
    </div>
  );
}
