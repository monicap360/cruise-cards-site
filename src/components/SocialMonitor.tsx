import { FB_PAGE_URL } from "@/lib/social";

// Live social monitor for the admin dashboard — your Facebook page feed + quick
// links to every channel. Handy for keeping an eye on comments/mentions.
const FB_GROUP = "https://www.facebook.com/groups/cruisesfromgalveston";
const IG_URL = process.env.NEXT_PUBLIC_IG_URL || "https://www.instagram.com/";
const TIKTOK_URL = process.env.NEXT_PUBLIC_TIKTOK_URL || "https://www.tiktok.com/";
const X_URL = process.env.NEXT_PUBLIC_X_URL || "https://twitter.com/";
const GOOGLE_URL = "https://www.google.com/search?q=Cruises+from+Galveston+reviews";

export default function SocialMonitor() {
  const plugin =
    `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FB_PAGE_URL)}` +
    `&tabs=timeline&width=360&height=620&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`;

  const links = [
    { label: "📘 Facebook Page", href: FB_PAGE_URL },
    { label: "👥 Facebook Group", href: FB_GROUP },
    { label: "📷 Instagram", href: IG_URL },
    { label: "🎵 TikTok", href: TIKTOK_URL },
    { label: "🐦 Twitter / X", href: X_URL },
    { label: "⭐ Google Reviews", href: GOOGLE_URL },
  ];

  return (
    <div>
      <div className="label-mono text-[11px] uppercase tracking-[0.18em] text-sky-400/70 mb-3">Social Monitor</div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-4">
          <div className="text-white/60 text-sm mb-3">Jump to your channels — keep an eye on comments &amp; mentions.</div>
          <div className="flex flex-wrap gap-2">
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 text-white/80 hover:text-white font-semibold px-4 py-2.5 rounded-full text-[13px]">
                {l.label}
              </a>
            ))}
          </div>
          <p className="text-white/35 text-xs mt-4">Tip: report false/harassing content to the platform and hide (don&rsquo;t delete) defamatory comments. Set your IG link with <code className="text-sky-300/80">NEXT_PUBLIC_IG_URL</code>.</p>
        </div>
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-white min-h-[620px]">
          <iframe src={plugin} title="Facebook feed" width="380" height="620" style={{ border: "none", width: "100%" }} scrolling="no" allow="encrypted-media" />
        </div>
      </div>
    </div>
  );
}
