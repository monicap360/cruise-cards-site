"use client";

import { useState } from "react";

// Shareable customer link for a group portal (with PIN built in), plus a one-click
// email that sends a "Welcome to the Cruise Experience Center" message.
export default function CopyGroupLink({
  code, sailingDate, name, email,
}: { code: string; sailingDate: string; name?: string; email?: string }) {
  const [copied, setCopied] = useState(false);
  const [emailState, setEmailState] = useState<"" | "sending" | "sent" | "err">("");
  const pin = sailingDate ? sailingDate.slice(5, 7) + sailingDate.slice(8, 10) : "";

  function buildUrl(): string {
    const origin =
      typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://www.cruisesfromgalveston.net";
    return `${origin}/groups/${code}${pin ? `?pin=${pin}` : ""}`;
  }

  async function copy() {
    const url = buildUrl();
    try { await navigator.clipboard.writeText(url); } catch {
      const t = document.createElement("textarea"); t.value = url; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch { /* ignore */ } document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  async function sendEmail() {
    const to = (email || "").trim() || window.prompt("Send the welcome + portal link to which email?", "") || "";
    if (!to) return;
    setEmailState("sending");
    try {
      const res = await fetch("/api/send-portal-link", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, name, link: buildUrl(), pin, kind: "group" }),
      });
      const d = await res.json();
      setEmailState(d.ok ? "sent" : "err");
    } catch { setEmailState("err"); }
    setTimeout(() => setEmailState(""), 3000);
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-end">
      {pin && (
        <span className="label-mono text-[10px] uppercase tracking-wider text-sky-300 bg-sky-500/10 border border-sky-400/25 rounded-full px-2.5 py-1">PIN {pin}</span>
      )}
      <button onClick={copy}
        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${copied ? "bg-green-500/15 text-green-300 border-green-400/30" : "bg-white/5 text-white/80 border-white/15 hover:border-sky-400/50"}`}>
        {copied ? "✓ Copied!" : "🔗 Copy link"}
      </button>
      <button onClick={sendEmail} disabled={emailState === "sending"}
        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${emailState === "sent" ? "bg-green-500/15 text-green-300 border-green-400/30" : emailState === "err" ? "bg-red-500/15 text-red-300 border-red-400/30" : "bg-sky-500/10 text-sky-300 border-sky-400/30 hover:bg-sky-500/20"}`}>
        {emailState === "sending" ? "Sending…" : emailState === "sent" ? "✓ Emailed" : emailState === "err" ? "Failed" : "✉️ Email link"}
      </button>
    </div>
  );
}
