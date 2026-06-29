"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Snippet = { label: string; text: string };
type Task = { id: string; do: string };
type Phase = {
  week: string;
  title: string;
  why: string;
  tasks: Task[];
  snippets: Snippet[];
};

// Cruise-adapted version of the Facebook growth playbook — premade, copy-paste.
const PHASES: Phase[] = [
  {
    week: "Weeks 1–2",
    title: "📊 Cruise Scorecards (native visual posts)",
    why: "Native images/videos get ~10x more shares than link posts. People share data, their friends see your page, you gain followers. Post the GRAPHIC natively — put the link in the FIRST COMMENT, never in the post.",
    tasks: [
      { id: "sc1", do: "Make a branded graphic in Canva (free) ranking/rating something cruise-related." },
      { id: "sc2", do: "Post it as a native image/video — NOT a link." },
      { id: "sc3", do: "Drop the article link in the first comment." },
    ],
    snippets: [
      { label: "Scorecard idea", text: "Top 5 Galveston Cruise Ports — Ranked by Our Cruisers 🏝️" },
      { label: "Scorecard idea", text: "Best Months to Cruise from Galveston: Our Cheat Sheet 📅" },
      { label: "Scorecard idea", text: "Interior vs. Ocean View vs. Balcony — What Galveston Cruisers Actually Book 🛏️" },
      { label: "Scorecard idea", text: "Galveston Cruise Parking Ranked: Closest, Cheapest & Best Shuttle 🅿️" },
      { label: "Caption", text: "Full breakdown with maps, prices & sources in the first comment 👇" },
    ],
  },
  {
    week: "Weeks 2–4",
    title: "🏷️ Tagging Storm (Local Hero posts)",
    why: "Tags are Facebook's highest-value 'Meaningful Social Interaction.' Tag 3–5 local pages per post (hotels, parking, venues, cruise lines, the CVB). Their followers see your post and follow you.",
    tasks: [
      { id: "tg1", do: "Each time you post about a business/partner, TAG their Facebook page." },
      { id: "tg2", do: "Tag 3–5 relevant local pages per post (keep it positive)." },
      { id: "tg3", do: "Put the article link in the first comment." },
    ],
    snippets: [
      { label: "Local Hero post", text: "Shoutout to @[Hotel] for taking amazing care of our cruisers before they sail! 🙌 Full spotlight on our site — link in comments." },
      { label: "Partner spotlight", text: "Sailing from Galveston? @[Parking Lot] makes park-and-cruise easy. We broke down every Galveston parking option — link in comments 🅿️" },
      { label: "Cruise-line tag", text: "Big week for Galveston! @[CarnivalCruiseLine] / @[RoyalCaribbean] sailings are filling fast — here's what's leaving the port this month 🚢 (details in comments)" },
    ],
  },
  {
    week: "Weeks 4–6",
    title: "🗳️ 'React to This' Polls → Data Report",
    why: "Facebook loves native polls — they drive massive reach and dwell time. After 24h, publish the results as an article. That's ORIGINAL DATA Google ranks above generic content. Use Admin → Deep-Dive / Social to write it up.",
    tasks: [
      { id: "pl1", do: "Post a native Facebook Poll on a fun cruise debate." },
      { id: "pl2", do: "After 24h, screenshot the results." },
      { id: "pl3", do: "Publish a 'X% of our community says ___' article + share with a unique summary." },
    ],
    snippets: [
      { label: "Poll", text: "Cozumel or Costa Maya? 🇲🇽 (Cozumel / Costa Maya / Love both)" },
      { label: "Poll", text: "Balcony or save money with an Interior? 🛏️ (Balcony all day / Interior, I'm barely in the room / Depends)" },
      { label: "Poll", text: "Getting to your Galveston cruise: Drive & park or fly into Houston? ✈️🚗" },
      { label: "Poll", text: "Best cruise line from Galveston? 🚢 (Carnival / Royal Caribbean / MSC / Norwegian / Disney)" },
      { label: "Results headline", text: "We Asked, You Voted: 64% of Galveston Cruisers Pick Balcony — Here's Why" },
    ],
  },
  {
    week: "Weeks 6–8",
    title: "🤝 Cross-Promotion Takeovers",
    why: "Tap audiences that already care about local/travel. Find 5 local pages with 2k–10k followers (community groups, Texas travel/mom blogs, Galveston pages) and swap a 24-hour 'takeover' post. Fastest way to 500–1,000 targeted followers in a week.",
    tasks: [
      { id: "cp1", do: "List 5 local pages (2k–10k followers) in travel/Galveston/community niches." },
      { id: "cp2", do: "DM them the takeover offer." },
      { id: "cp3", do: "Swap your most shareable Scorecard content for 24h, each with a clear 'Follow us' CTA." },
    ],
    snippets: [
      { label: "DM script", text: "Hey! We're Cruises from Galveston — a local cruise specialist with a really engaged following. Want to do a 24-hour Page Takeover? We each post one piece of content on the other's page with a 'follow us' shoutout. Easy win for both of us — our audiences overlap perfectly. Interested? 🚢" },
      { label: "Takeover CTA", text: "👋 Guest post from Cruises from Galveston! Sailing from Galveston (or thinking about it)? Follow @CruisesFromGalveston for cruise deals, port tips & local know-how." },
    ],
  },
  {
    week: "Do Tomorrow",
    title: "📸 'Caption This' (instant engagement)",
    why: "Post a fun/intriguing Galveston or cruise photo NATIVELY and ask for captions — engagement floods in and the algorithm pushes your page to new feeds. Next day, feature the best caption in a short article (credit the user) and share it back: fresh unique content + new followers.",
    tasks: [
      { id: "ct1", do: "Post a fun Galveston/cruise photo natively (not a link)." },
      { id: "ct2", do: "Ask: 'Caption this for a chance to be featured tomorrow!'" },
      { id: "ct3", do: "Next day: pick the best, credit the user, publish a short 'Best Caption' article, share it back." },
    ],
    snippets: [
      { label: "Prompt", text: "Caption this 👇 Best one gets featured on our site AND page tomorrow! 🚢" },
      { label: "Article title", text: "Our Cruise Community Has Jokes — Here's the Best Caption of the Week" },
    ],
  },
  {
    week: "Ongoing",
    title: "🔁 Publish → Share Loop (Instant Index)",
    why: "Publish on your site FIRST, then share to Facebook with a UNIQUE 50-word summary (never copy-paste). Your followers click within minutes; Google sees real-time interest from a reputable source and favors your URL. Doubles your indexed entries per story.",
    tasks: [
      { id: "ix1", do: "Publish the article on the site first." },
      { id: "ix2", do: "Generate a unique summary in Admin → Social, paste to Facebook, drop the link." },
      { id: "ix3", do: "Reply to every comment within the first hour to boost reach." },
    ],
    snippets: [
      { label: "Tool", text: "Admin → 📣 Social = one-click unique FB summaries for each article." },
      { label: "Tool", text: "Admin → 📰 Deep-Dive = turn your most-engaged post into a 1,000-word article quoting your top commenters." },
    ],
  },
];

// 90-day follower + SEO tracker.
const TRACKER = [
  { id: "t12", week: "1–2", action: "Post 3 Cruise Scorecard visual assets", target: "+500", seo: "Social signals boost domain trust" },
  { id: "t34", week: "3–4", action: "Tag 5 local businesses/officials per post", target: "+1,000", seo: "Backlinks from tagged businesses" },
  { id: "t56", week: "5–6", action: "Run 2 Facebook Polls → convert to site articles", target: "+1,500", seo: "'Original Data' ranking boost" },
  { id: "t78", week: "7–8", action: "Execute 3 Cross-Promotion Takeovers", target: "+2,000", seo: "New audience → traffic, lower bounce" },
  { id: "t912", week: "9–12", action: "Launch a 'Galveston Cruise Alerts' Group; promote weekly", target: "+2,500", seo: "More brand searches on Google" },
];

// 10 high-viral templates for the Galveston cruise niche.
const VIRAL_TEMPLATES: Snippet[] = [
  { label: "Caption This", text: "Caption this 👇 Best one gets featured on our site + page tomorrow! 🚢" },
  { label: "Tag", text: "Tag your cruise crew 👇 Who are you dragging on your next Galveston sailing? 🍹" },
  { label: "This or That", text: "This or That: Balcony 🛏️ or Suite 👑? Cozumel 🇲🇽 or Roatán 🇭🇳? Drop your combo below!" },
  { label: "Fill in the blank", text: "Fill in the blank: My favorite thing about cruising from Galveston is ______." },
  { label: "Hot take", text: "Unpopular cruise opinion: the buffet beats the dining room. Agree or disagree? 👇" },
  { label: "POV", text: "POV: it's 7am and you're pulling into Cozumel 🌅 Drop a 🌴 if you're ready to sail." },
  { label: "Countdown", text: "Who's got a Galveston cruise booked?! 🚢 Tell us your ship + month and let's count down together ⬇️" },
  { label: "First vs 10th", text: "First cruise 😅 vs. 10th cruise 😎 — which are you? Tell us in the comments." },
  { label: "Rate it", text: "Rate this cabin 1–10 🛏️ Be honest 👇 (full cabin guide in comments)" },
  { label: "Hidden gem", text: "Galveston cruise tip most people miss: ______ 📌 Save this for your next sailing (full guide in comments)." },
];

export default function SocialPlaybookPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("social-playbook-done");
      if (saved) setDone(JSON.parse(saved));
    } catch {}
  }, []);

  function toggle(id: string) {
    setDone((d) => {
      const next = { ...d, [id]: !d[id] };
      try {
        localStorage.setItem("social-playbook-done", JSON.stringify(next));
      } catch {}
      return next;
    });
  }
  function copy(key: string, text: string) {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1800);
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1 mt-2">{"// Growth Playbook"}</div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Social Media Playbook</h1>
          <p className="text-white/55 text-sm max-w-2xl mt-1">
            Your Facebook‑fueled growth plan — with premade, copy‑paste content. Check off tasks as you
            go (saved on this device). Pair with <Link href="/admin/social" className="text-sky-400">📣 Social</Link>,
            {" "}<Link href="/admin/deep-dive" className="text-sky-400">📰 Deep‑Dive</Link>, and
            {" "}<Link href="/admin/outreach" className="text-sky-400">🤝 Outreach</Link>.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 90-day tracker */}
        <div className="bg-[#0b1020] rounded-2xl border border-sky-400/25 p-6">
          <h2 className="text-lg font-extrabold mb-1">90-Day Growth &amp; SEO Tracker</h2>
          <p className="text-white/50 text-sm mb-4">
            Goal: <span className="text-holo font-bold">15,000+ followers</span> · top‑3 rankings for 5+ local keywords. Check off each phase.
          </p>
          <div className="space-y-2">
            {TRACKER.map((r) => (
              <label key={r.id} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer">
                <input type="checkbox" checked={!!done[r.id]} onChange={() => toggle(r.id)} className="mt-1 accent-sky-500 w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/25">Wk {r.week}</span>
                    <span className={`font-semibold text-sm ${done[r.id] ? "text-white/40 line-through" : "text-white"}`}>{r.action}</span>
                    <span className="text-holo font-bold text-sm">{r.target}</span>
                  </div>
                  <div className="text-white/45 text-xs mt-0.5">SEO: {r.seo}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {PHASES.map((p) => (
          <div key={p.title} className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/25">{p.week}</span>
              <h2 className="text-lg font-extrabold">{p.title}</h2>
            </div>
            <p className="text-white/55 text-sm mb-4">{p.why}</p>

            <div className="space-y-2 mb-4">
              {p.tasks.map((t) => (
                <label key={t.id} className="flex items-start gap-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={!!done[t.id]} onChange={() => toggle(t.id)} className="mt-1 accent-sky-500 w-4 h-4 flex-shrink-0" />
                  <span className={done[t.id] ? "text-white/40 line-through" : "text-white/80"}>{t.do}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              {p.snippets.map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="label-mono text-[9px] uppercase tracking-wider text-sky-400/70 mb-1">{s.label}</div>
                    <div className="text-white/80 text-sm">{s.text}</div>
                  </div>
                  <button onClick={() => copy(p.title + i, s.text)} className="flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {copied === p.title + i ? "✓" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Viral templates */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-extrabold mb-1">🔥 10 High-Viral Post Templates</h2>
          <p className="text-white/50 text-sm mb-4">Your niche: hyper‑local Galveston cruise travel. Copy, tweak the blank, post natively.</p>
          <div className="space-y-2">
            {VIRAL_TEMPLATES.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="label-mono text-[9px] uppercase tracking-wider text-sky-400/70 mb-1">{s.label}</div>
                  <div className="text-white/80 text-sm">{s.text}</div>
                </div>
                <button onClick={() => copy("vt" + i, s.text)} className="flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {copied === "vt" + i ? "✓" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
