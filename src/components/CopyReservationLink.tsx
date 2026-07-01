"use client";

import { useState } from "react";

// One-click shareable customer link for an individual reservation portal, with
// the PIN (sail-date MMDD) built in. Mirrors CopyGroupLink but for /r/<token>.
export default function CopyReservationLink({ token, sailDate }: { token: string; sailDate: string }) {
  const [copied, setCopied] = useState(false);
  const pin = sailDate ? sailDate.slice(5, 7) + sailDate.slice(8, 10) : "";

  function buildUrl(): string {
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://www.cruisesfromgalveston.net";
    return `${origin}/r/${token}${pin ? `?pin=${pin}` : ""}`;
  }

  async function copy() {
    const url = buildUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const t = document.createElement("textarea");
      t.value = url; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!token) return <span className="text-white/30 text-[10px] uppercase">save to get link</span>;

  return (
    <button
      onClick={copy}
      title={pin ? `Copies the reservation link with PIN ${pin}` : "Set a sail date to include the PIN"}
      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
        copied ? "bg-green-500/15 text-green-300 border-green-400/30" : "bg-sky-500/10 text-sky-300 border-sky-400/30 hover:bg-sky-500/20"
      }`}
    >
      {copied ? "✓ Copied!" : "🔗 Copy customer link"}
    </button>
  );
}
