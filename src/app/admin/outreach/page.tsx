"use client";

import Link from "next/link";
import { useState } from "react";

type Target = {
  name: string;
  category: string;
  why: string;
  website?: string;
};

// Curated Galveston partnership targets (real businesses; add contact emails as
// you reach out). Status tracking lives in Admin → Partners.
const TARGETS: Target[] = [
  // Hotels — Park, Stay & Cruise
  { name: "Hilton Galveston Island Resort", category: "Hotels (Park-Stay-Cruise)", why: "Beachfront park-stay-cruise package — refer guests, earn commission." },
  { name: "Holiday Inn Resort Galveston", category: "Hotels (Park-Stay-Cruise)", why: "Family-friendly, 2.7 mi, parking+shuttle+breakfast." },
  { name: "Comfort Suites Galveston", category: "Hotels (Park-Stay-Cruise)", why: "Park & cruise package, free breakfast." },
  { name: "SpringHill Suites Galveston", category: "Hotels (Park-Stay-Cruise)", why: "Suites + parking & shuttle." },
  { name: "Moody Gardens Hotel", category: "Hotels (Park-Stay-Cruise)", why: "Resort + 103k sq ft convention space — hotels & corporate.", website: "https://www.moodygardens.com" },
  { name: "Grand Galvez", category: "Hotels (Park-Stay-Cruise)", why: "Historic landmark resort — premium pre-cruise stays & weddings." },
  { name: "The San Luis Resort", category: "Hotels (Park-Stay-Cruise)", why: "Upscale resort — honeymoon & celebration stays." },

  // Cruise parking
  { name: "Lighthouse Parking", category: "Cruise Parking", why: "Secure lots + shuttle — refer cruisers who drive in.", website: "https://www.lighthouseparking.org" },
  { name: "Patriot Cruise Parking", category: "Cruise Parking", why: "Indoor parking blocks from terminal.", website: "https://www.patriotcruiseparking.com" },
  { name: "Port Parking", category: "Cruise Parking", why: "Indoor & outdoor parking.", website: "https://www.portparking.com" },
  { name: "Discount Cruise Parking", category: "Cruise Parking", why: "Free shuttles every 12-15 min.", website: "https://www.discountcruiseparking.net" },
  { name: "Park 2 Cruise", category: "Cruise Parking", why: "Across from Piers 10 & 16, walk-to-ship.", website: "https://www.park2cruisegalveston.com" },
  { name: "Galveston VIP Cruise Parking", category: "Cruise Parking", why: "Indoor secure parking across from Terminals 1 & 2.", website: "https://www.galvestonvipcruiseparking.com" },

  // Wedding & event venues
  { name: "Carr Mansion", category: "Wedding & Event Venues", why: "Historic venue — weddings & corporate retreats.", website: "https://carrmansion.com" },
  { name: "Bayside Event Center", category: "Wedding & Event Venues", why: "Waterfront wedding venue — pair with wedding cruises." },
  { name: "Galveston Island Palms", category: "Wedding & Event Venues", why: "Outdoor events + pavilion." },
  { name: "Galveston Historical Foundation Venues", category: "Wedding & Event Venues", why: "Ashton Villa / Menard House — events & receptions.", website: "https://www.galvestonhistory.org" },
  { name: "Pleasure Pier — Group Events", category: "Wedding & Event Venues", why: "Banquets & company events.", website: "https://www.pleasurepier.com" },

  // Corporate & groups
  { name: "Moody Gardens Convention Center", category: "Corporate & Groups", why: "Conferences & trade shows — pitch corporate retreat cruises.", website: "https://www.moodygardens.com" },
  { name: "Visit Galveston (CVB)", category: "Corporate & Groups", why: "Convention & visitors bureau — co-marketing & referrals.", website: "https://www.visitgalveston.com" },

  // Local partners
  { name: "Galveston restaurants near the port", category: "Local Partners", why: "Pre/post-cruise dining referrals & cross-promo." },
  { name: "Local & corporate travel agents", category: "Local Partners", why: "Agent group RFPs — they bring groups, you host the space." },
];

const CATEGORIES = Array.from(new Set(TARGETS.map((t) => t.category)));

const DEFAULT_SUBJECT = "Partnership with Cruises from Galveston — referrals & co-marketing";
const DEFAULT_BODY = `Hi {{business}} team,

I'm with Cruises from Galveston (the Cruise Experience Center at 3501 Winnie St). We book cruises for hundreds of travelers sailing from the Port of Galveston, and we send those guests to local hotels, parking, venues, and services.

I'd love to set up a simple referral / co-marketing partnership — we recommend you to our cruisers, you take great care of them, and we cross-promote each other. With the volume coming through Galveston, it's an easy win for both of us.

Could we set up a quick 10-minute call this week?

Thanks,
[Your Name]
Cruises from Galveston
(409) 632-2106 · cruisesfromgalveston.net`;

export default function OutreachPage() {
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [filter, setFilter] = useState<string>("all");

  function mailto(name: string) {
    const b = body.replace(/\{\{business\}\}/g, name);
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(b)}`;
  }

  const shown = filter === "all" ? TARGETS : TARGETS.filter((t) => t.category === filter);
  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1 mt-2">{"// Partner Outreach"}</div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Outreach</h1>
          <p className="text-white/55 text-sm max-w-2xl mt-1">
            A ready-to-send pitch + a list of Galveston businesses to partner with for referrals &
            co-marketing. Edit the email, then hit Email on any target (uses <code className="text-sky-300">{"{{business}}"}</code> for the name). Track replies in Partners.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Email template */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h2 className="font-extrabold text-lg mb-4">Your pitch email</h2>
          <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Subject</label>
          <input className={input} value={subject} onChange={(e) => setSubject(e.target.value)} />
          <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1 mt-4">Body</label>
          <textarea className={`${input} font-mono text-xs`} rows={14} value={body} onChange={(e) => setBody(e.target.value)} />
          <p className="text-white/40 text-xs mt-2">Tip: keep <code className="text-sky-300">{"{{business}}"}</code> — it&rsquo;s replaced with each business name when you click Email.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === "all" ? "bg-white text-black" : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"}`}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === c ? "bg-white text-black" : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"}`}>{c}</button>
          ))}
        </div>

        {/* Targets */}
        <div className="space-y-2">
          {shown.map((t) => (
            <div key={t.name} className="bg-[#0b1020] rounded-xl border border-white/10 p-4 flex items-start gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white">{t.name}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/25">{t.category}</span>
                </div>
                <div className="text-white/55 text-sm mt-0.5">{t.why}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {t.website && (
                  <a href={t.website} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs px-4 py-2 rounded-full">Website</a>
                )}
                <a href={mailto(t.name)} className="bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs px-4 py-2 rounded-full">📧 Email</a>
                <Link href="/admin/partners" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs px-4 py-2 rounded-full">+ Partner</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
