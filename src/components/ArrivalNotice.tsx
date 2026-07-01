import { ARRIVAL_NOTICE } from "@/lib/arrival-notice";

// Temporary in-person arrival notice (side-gate entry while the door is fixed).
// Renders nothing when disabled. Drop <ArrivalNotice /> onto any in-person page.
export default function ArrivalNotice() {
  if (!ARRIVAL_NOTICE.enabled) return null;
  return (
    <div className="rounded-2xl border border-amber-400/30 bg-amber-500/[0.08] p-4 flex items-start gap-3">
      <span className="text-2xl leading-none">🚪</span>
      <div>
        <div className="text-amber-200 font-bold text-sm">{ARRIVAL_NOTICE.title}</div>
        <p className="text-white/70 text-sm mt-1 leading-relaxed">{ARRIVAL_NOTICE.message}</p>
      </div>
    </div>
  );
}
