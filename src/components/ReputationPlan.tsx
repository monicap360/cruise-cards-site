"use client";

import { useEffect, useState } from "react";

// Reputation / crisis action plan — a trackable checklist in Elaria. Device-local.
const GROUPS: { title: string; items: { id: string; label: string }[] }[] = [
  {
    title: "🔴 Legal — get counsel moving",
    items: [
      { id: "attorney", label: "Retain a Texas defamation/harassment attorney" },
      { id: "cd-posters", label: "Have attorney send a cease-and-desist to the original posters" },
      { id: "cd-admins", label: "Have attorney send a formal removal notice to the group admins (name the defamatory posts)" },
      { id: "suit", label: "Discuss a defamation suit + (if any threats) a protective/restraining order" },
    ],
  },
  {
    title: "📸 Build your evidence file (do continuously)",
    items: [
      { id: "screens", label: "Screenshot every post, photo, comment, profile, URL, date + admin/group names" },
      { id: "censorship", label: "Screenshot your & your customers' comments BEFORE and AFTER they're deleted (proves one-sided censorship)" },
      { id: "timeline", label: "Keep a running timeline log: date · platform · what happened · action taken" },
      { id: "offsite", label: "Save copies off-platform — they can delete anytime" },
    ],
  },
  {
    title: "🚩 Report the content — over the admins' heads",
    items: [
      { id: "fb-posts", label: "Report defamatory posts to Facebook directly (Harassment / Bullying)" },
      { id: "photos", label: "Report your personal photos as privacy/harassment — 'that's me, posted without consent'" },
      { id: "ip", label: "File IP/copyright takedown for any photo YOU own (fastest removal)" },
      { id: "yelp", label: "Flag Yelp reviews: 'not a genuine consumer experience' + false/defamatory" },
    ],
  },
  {
    title: "👮 File harassment — against the admins & ringleaders",
    items: [
      { id: "coord", label: "Document the coordinated one-sided moderation (deleting defenders, amplifying attackers)" },
      { id: "report-group", label: "Report the group + admins to Facebook for coordinated harassment" },
      { id: "police", label: "File a police non-emergency report for harassment (esp. personal photos / doxxing)" },
      { id: "ic3", label: "If there are threats or it crosses state lines → file with FBI IC3 (ic3.gov)" },
      { id: "name-admins", label: "Give admin names + evidence to your attorney — they can be named parties" },
    ],
  },
  {
    title: "🌐 Reposts / gossip / scam sites",
    items: [
      { id: "find", label: "Search your name + business to find everywhere it's been reposted" },
      { id: "dmca", label: "Send DMCA / IP takedowns to any site hosting your photos (you own them)" },
      { id: "google-remove", label: "Use Google 'Results about you' to request removal of personal info / doxxing" },
      { id: "host", label: "Contact the site's host/registrar to report defamatory & harassing content" },
    ],
  },
  {
    title: "🤐 Don't feed it",
    items: [
      { id: "no-argue", label: "Do NOT argue in the group/comments — you'll be blocked anyway" },
      { id: "one-statement", label: "One calm statement on YOUR OWN page only, pin it, then stop" },
    ],
  },
  {
    title: "📈 Positive offense (bury the noise)",
    items: [
      { id: "reassure", label: "Send the reassurance message to every booked client (stops cancellations)" },
      { id: "google-blast", label: "Send the /review link to happy clients for Google reviews" },
      { id: "move-support", label: "Move supporters to YOUR page/group/Google — where admins can't delete" },
      { id: "content", label: "Post steady positive content + 'Cruise Cancellation 101'" },
    ],
  },
  {
    title: "🛡️ Protect yourself",
    items: [
      { id: "lock", label: "Make personal profiles private; separate personal from business" },
      { id: "peace", label: "Limit how often you check it — protect your peace" },
      { id: "support", label: "Talk to people who know the truth; get support" },
      { id: "chapter", label: "Remember: this is a chapter, not the story. It passes." },
    ],
  },
];

const RESOURCES: { label: string; href: string }[] = [
  { label: "Facebook — report harassment/bullying", href: "https://www.facebook.com/help/263149623790594" },
  { label: "Facebook — report a photo/privacy", href: "https://www.facebook.com/help/428478523862899" },
  { label: "Google — Results about you (remove personal info)", href: "https://myactivity.google.com/results-about-you" },
  { label: "FBI IC3 — online harassment/threats", href: "https://www.ic3.gov" },
  { label: "Send happy clients here → /review", href: "/review" },
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
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-300/70 mb-1.5">🔗 Quick links</div>
            <div className="flex flex-wrap gap-2">
              {RESOURCES.map((r) => (
                <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] font-semibold bg-white/5 border border-white/15 hover:border-sky-400/40 text-sky-200/90 rounded-full px-3 py-1.5">{r.label} ↗</a>
              ))}
            </div>
          </div>
          <p className="text-white/30 text-[10px] label-mono">▮ private · saved on this device · not legal advice — confirm steps with your attorney</p>
        </div>
      )}
    </div>
  );
}
