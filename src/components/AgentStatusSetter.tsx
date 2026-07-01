"use client";

import { useEffect, useState } from "react";
import { PRESENCE, getAgentStatus, setAgentStatus } from "@/lib/agent-status";

// Admin widget: set your live presence (guests see it on your profile).
export default function AgentStatusSetter({ slug = "monica" }: { slug?: string }) {
  const [current, setCurrent] = useState("available");
  const [msg, setMsg] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => { getAgentStatus(slug).then((s) => { if (s) { setCurrent(s.status); setMsg(s.message || ""); } }); }, [slug]);

  async function pick(status: string) {
    setCurrent(status); setSaved(false);
    await setAgentStatus(slug, status, msg);
    setSaved(true);
  }
  async function saveMsg() { await setAgentStatus(slug, current, msg); setSaved(true); }

  return (
    <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-sm">📍 My status <span className="text-white/40 font-normal">— guests see this on your profile</span></span>
        {saved && <span className="text-green-300 text-[10px] uppercase tracking-wider">saved ✓</span>}
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {PRESENCE.map((p) => (
          <button key={p.key} onClick={() => pick(p.key)} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${current === p.key ? p.badge : "bg-white/5 text-white/50 border-white/10 hover:text-white"}`}>
            {p.icon} {p.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={msg} onChange={(e) => { setMsg(e.target.value); setSaved(false); }} onBlur={saveMsg}
          placeholder="Optional note (e.g. back at 1pm, sailing Liberty this week)…"
          className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/35 focus:outline-none focus:border-sky-400/60" />
      </div>
    </div>
  );
}
