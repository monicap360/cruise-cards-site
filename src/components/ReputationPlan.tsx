"use client";

import { useEffect, useState } from "react";

// Reputation / crisis action plan — a trackable checklist in Elaria. Device-local.
const GROUPS: { title: string; items: { id: string; label: string }[] }[] = [
  {
    title: "🔴 Legal (do first)",
    items: [
      { id: "attorney", label: "Contact a Texas defamation/harassment attorney" },
      { id: "evidence", label: "Screenshot EVERYTHING — posts, photos, reviews, profiles, URLs, dates, names" },
    ],
  },
  {
    title: "🚩 Report the content (harassment/privacy angle — strongest)",
    items: [
      { id: "photos", label: "Report your personal photos as harassment/privacy on each platform (my face, no consent)" },
      { id: "ip", label: "File an IP/copyright takedown for any photo YOU own (fastest removal on FB/IG)" },
      { id: "fb-direct", label: "Report defamatory posts to Facebook directly — not just the group admins" },
      { id: "galv-talk", label: "Report the Galveston Talk posts to Facebook + the group; if coordinated, report the thread" },
      { id: "yelp", label: "Flag Yelp reviews: 'not a genuine consumer experience' + false/defamatory" },
    ],
  },
  {
    title: "🤐 Don't feed it",
    items: [
      { id: "no-argue", label: "Do NOT argue in the groups or comment threads" },
      { id: "one-statement", label: "One calm statement on YOUR OWN page only, pin it, then stop" },
    ],
  },
  {
    title: "📈 Positive offense (bury the noise)",
    items: [
      { id: "google-blast", label: "Send the /review link to happy clients for Google reviews" },
      { id: "content", label: "Post 'Cruise Cancellation 101' + steady positive content" },
      { id: "advocates", label: "Ask a few happy clients for supportive Google reviews/comments" },
    ],
  },
  {
    title: "🛡️ Protect yourself",
    items: [
      { id: "lock", label: "Make personal social profiles private; separate personal from business" },
      { id: "log", label: "Keep a running log (date · platform · what happened)" },
      { id: "safety", label: "If it feels threatening → police report / ask attorney about a protective order" },
      { id: "peace", label: "Limit how often you check it — protect your peace. This passes." },
    ],
  },
];

export default function ReputationPlan() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(true);

  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem("elaria-reputation") || "{}")); } catch { /* ignore */ } }, []);
  const toggle = (id: string) => setDone((d) => { const n = { ...d, [id]: !d[id] }; localStorage.setItem("elaria-reputation", JSON.stringify(n)); return n; });

  const all = GROUPS.flatMap((g) => g.items);
  const count = all.filter((i) => done[i.id]).length;

  return (
    <div className="bg-[#0b1020] border border-amber-400/25 rounded-2xl p-5">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-3">
        <span className="font-extrabold text-white">🛟 Reputation Action Plan <span className="text-white/40 font-normal">— {count}/{all.length} done</span></span>
        <span className="text-white/40 text-sm">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="mt-4 space-y-4">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-300/70 mb-1.5">{g.title}</div>
              <div className="space-y-1">
                {g.items.map((i) => (
                  <label key={i.id} className="flex items-start gap-3 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-white/[0.03]">
                    <input type="checkbox" checked={!!done[i.id]} onChange={() => toggle(i.id)} className="mt-0.5 accent-sky-500 w-4 h-4 shrink-0" />
                    <span className={`text-sm ${done[i.id] ? "line-through text-white/35" : "text-white/80"}`}>{i.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <p className="text-white/30 text-[10px] label-mono">▮ private · saved on this device</p>
        </div>
      )}
    </div>
  );
}
