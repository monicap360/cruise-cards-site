"use client";

import Link from "next/link";
import { useState } from "react";
import { FB_GROUP_URL } from "@/lib/social";

type Commenter = { name: string; comment: string };

export default function DeepDivePage() {
  const [topic, setTopic] = useState("");
  const [postText, setPostText] = useState("");
  const [commenters, setCommenters] = useState<Commenter[]>([
    { name: "", comment: "" },
    { name: "", comment: "" },
    { name: "", comment: "" },
  ]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");

  function setC(i: number, p: Partial<Commenter>) {
    setCommenters((cs) => cs.map((c, j) => (j === i ? { ...c, ...p } : c)));
  }
  function copy(key: string, val: string) {
    navigator.clipboard?.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  }

  async function generate() {
    if (!topic.trim()) {
      setErr("Add the topic of your most-engaged post.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/deep-dive", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic, postText, commenters }),
      });
      const d = await r.json();
      if (!r.ok) setErr(d.error || "Could not generate the article.");
      else {
        setTitle(d.title || "");
        setBody(d.body || "");
        setCaption(d.caption || "");
      }
    } catch {
      setErr("Could not generate the article.");
    }
    setBusy(false);
  }

  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1 mt-2">{"// Community Deep-Dive"}</div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Deep-Dive Builder</h1>
          <p className="text-white/55 text-sm max-w-2xl mt-1">
            Turn your most‑engaged Facebook post into a ~1,000‑word article that quotes your top
            commenters by name — proving you&rsquo;re the trusted local community voice. Generate it,
            tweak it, publish it, then share with the caption.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6 space-y-4">
          <div>
            <label className={lbl}>Topic of your most-engaged post *</label>
            <input className={input} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Is Galveston cruise parking worth it, or should you use a hotel?" />
          </div>
          <div>
            <label className={lbl}>Paste the original post text (optional)</label>
            <textarea className={input} rows={3} value={postText} onChange={(e) => setPostText(e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Top 3 commenters to quote (name + their comment)</label>
            <div className="space-y-2">
              {commenters.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input className={`${input} sm:w-44 flex-shrink-0`} value={c.name} onChange={(e) => setC(i, { name: e.target.value })} placeholder={`Commenter ${i + 1} name`} />
                  <input className={input} value={c.comment} onChange={(e) => setC(i, { comment: e.target.value })} placeholder="What they said" />
                </div>
              ))}
            </div>
          </div>
          {err && <p className="text-red-300 text-sm">{err}</p>}
          <button onClick={generate} disabled={busy} className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full">
            {busy ? "Writing the deep-dive…" : "✨ Generate deep-dive"}
          </button>
        </div>

        {(title || body) && (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6 space-y-4">
            <div>
              <label className={lbl}>Title</label>
              <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Article ({body.trim() ? body.trim().split(/\s+/).length : 0} words)</label>
              <textarea className={`${input} font-mono text-xs`} rows={20} value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Facebook caption</label>
              <textarea className={input} rows={2} value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => copy("title", title)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs px-4 py-2 rounded-full">{copied === "title" ? "Copied ✓" : "Copy title"}</button>
              <button onClick={() => copy("body", body)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs px-4 py-2 rounded-full">{copied === "body" ? "Copied ✓" : "Copy article"}</button>
              <button onClick={() => copy("caption", caption)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs px-4 py-2 rounded-full">{copied === "caption" ? "Copied ✓" : "Copy caption"}</button>
              <a href={FB_GROUP_URL} target="_blank" rel="noopener noreferrer" className="bg-[#1877F2] hover:bg-[#1466d6] text-white font-semibold text-xs px-4 py-2 rounded-full">Open Facebook</a>
            </div>
            <p className="text-white/40 text-xs">
              To publish on the site, send me the title + article and I&rsquo;ll add it to your blog (or paste it into your post editor). Then share on Facebook with the caption + link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
