import { type EmbarkGuide as Guide } from "@/lib/embark-guides";

// "Before you sail — things to do" in the embark city. Pure render (server-safe).
export default function EmbarkGuide({ guide }: { guide: Guide }) {
  return (
    <div>
      <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-2">{`// Before You Sail — ${guide.city}`}</div>
      <p className="text-white/60 text-sm mb-4 max-w-2xl">{guide.intro}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {guide.things.map((t) => (
          <div key={t.name} className="rounded-xl border border-white/10 bg-[#0b1020] p-4">
            <div className="font-bold text-white text-sm">{t.name}</div>
            <div className="text-white/55 text-xs mt-1 leading-relaxed">{t.blurb}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-sky-400/20 bg-sky-500/5 p-3 text-sm text-white/65">
        <span className="text-sky-300 font-semibold">Tip — </span>{guide.tip}
      </div>
    </div>
  );
}
