"use client";

import { useState } from "react";

// One-click shareable customer link for a group portal, with the PIN (sail-date
// MMDD) already built in — so staff can just copy and send it. Falls back to a
// relative URL during SSR; the real origin is used on click in the browser.
export default function CopyGroupLink({ code, sailingDate }: { code: string; sailingDate: string }) {
  const [copied, setCopied] = useState(false);
  const pin = sailingDate ? sailingDate.slice(5, 7) + sailingDate.slice(8, 10) : "";

  function buildUrl(): string {
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://www.cruisesfromgalveston.net";
    return `${origin}/groups/${code}${pin ? `?pin=${pin}` : ""}`;
  }

  async function copy() {
    const url = buildUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for older browsers / blocked clipboard.
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      title={pin ? `Copies the portal link with PIN ${pin}` : "Set a sail date to include the PIN"}
      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
        copied
          ? "bg-green-500/15 text-green-300 border-green-400/30"
          : "bg-sky-500/10 text-sky-300 border-sky-400/30 hover:bg-sky-500/20"
      }`}
    >
      {copied ? "✓ Copied!" : "🔗 Copy customer link"}
    </button>
  );
}
