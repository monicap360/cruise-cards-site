"use client";

import Link from "next/link";
import { useState } from "react";
import { POSTS } from "@/lib/news";

const SITE = "https://cruisesfromgalveston.net";

export default function AdminSocialPage() {
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string>("");
  const [copied, setCopied] = useState<string>("");
  const [err, setErr] = useState<string>("");

  async function generate(slug: string, title: string, text: string) {
    setBusy(slug);
    setErr("");
    try {
      const r = await fetch("/api/fb-summary", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, text }),
      });
      const d = await r.json();
      if (!r.ok) {
        setErr(d.error || "Could not generate a summary.");
      } else {
        setSummaries((s) => ({ ...s, [slug]: d.summary || "" }));
      }
    } catch {
      setErr("Could not generate a summary.");
    }
    setBusy("");
  }

  function copy(slug: string, value: string) {
    navigator.clipboard?.writeText(value);
    setCopied(slug);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1 mt-2">{"// Social / Facebook"}</div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Facebook Summaries</h1>
          <p className="text-white/55 text-sm max-w-2xl mt-1">
            Publish on the site first, then share to Facebook with a <span className="text-white">unique</span> summary
            (not a copy-paste) so Google indexes both — doubling your first-page real estate. Generate one per article,
            tweak it, copy it, then drop the link.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {err && <p className="text-red-300 text-sm">{err}</p>}
        {POSTS.map((p) => {
          const url = `${SITE}/news/${p.slug}`;
          const text = Array.isArray(p.body) ? p.body.join(" ") : "";
          const summary = summaries[p.slug] ?? "";
          return (
            <div key={p.slug} className="bg-[#0b1020] rounded-2xl border border-white/10 p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="font-bold text-white">{p.title}</div>
                  <div className="text-white/40 text-xs mt-0.5">{p.category} · {p.date}</div>
                </div>
                <button
                  onClick={() => generate(p.slug, p.title, text)}
                  disabled={busy === p.slug}
                  className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-4 py-2 rounded-full whitespace-nowrap"
                >
                  {busy === p.slug ? "Writing…" : summary ? "Regenerate" : "✨ Generate FB summary"}
                </button>
              </div>

              {summary && (
                <div className="mt-4">
                  <textarea
                    value={summary}
                    onChange={(e) => setSummaries((s) => ({ ...s, [p.slug]: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400/60"
                  />
                  <div className="text-white/40 text-xs mt-1">{summary.trim().split(/\s+/).length} words</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button onClick={() => copy(p.slug, summary)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs px-4 py-2 rounded-full">
                      {copied === p.slug ? "Copied ✓" : "Copy summary"}
                    </button>
                    <button onClick={() => copy(p.slug + "-url", url)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs px-4 py-2 rounded-full">
                      {copied === p.slug + "-url" ? "Link copied ✓" : "Copy link"}
                    </button>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1877F2] hover:bg-[#1466d6] text-white font-semibold text-xs px-4 py-2 rounded-full"
                    >
                      Open Facebook share
                    </a>
                  </div>
                  <p className="text-white/35 text-[11px] mt-2">Paste the summary into Facebook, then drop the link.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
