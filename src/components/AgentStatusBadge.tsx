"use client";

import { useEffect, useState } from "react";
import { getAgentStatus, presenceMeta, type AgentStatus } from "@/lib/agent-status";

// Live presence badge shown on an agent's profile. Refreshes every ~45s.
// On the agent's scheduled off days it auto-shows "Off today" (overrides status).
export default function AgentStatusBadge({ slug, offDays = [] }: { slug: string; offDays?: number[] }) {
  const [st, setSt] = useState<AgentStatus | null>(null);
  const [off, setOff] = useState(false);

  useEffect(() => {
    setOff(offDays.includes(new Date().getDay()));
    let stop = false;
    async function load() { const s = await getAgentStatus(slug); if (!stop) setSt(s); }
    load();
    const iv = setInterval(load, 45000);
    return () => { stop = true; clearInterval(iv); };
  }, [slug, offDays]);

  const status = off ? "out" : (st?.status || "available");
  const meta = presenceMeta(status);
  const label = off ? "Off today" : meta.label;

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${meta.badge}`}>
      <span className={`w-2 h-2 rounded-full ${meta.dot} ${status === "available" ? "animate-pulse" : ""}`} />
      {meta.icon} {label}{!off && st?.message ? ` · ${st.message}` : ""}
    </div>
  );
}
