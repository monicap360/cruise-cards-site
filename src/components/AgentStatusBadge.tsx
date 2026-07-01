"use client";

import { useEffect, useState } from "react";
import { getAgentStatus, presenceMeta, type AgentStatus } from "@/lib/agent-status";

// Live presence badge shown on an agent's profile. Refreshes every ~45s.
export default function AgentStatusBadge({ slug }: { slug: string }) {
  const [st, setSt] = useState<AgentStatus | null>(null);

  useEffect(() => {
    let stop = false;
    async function load() { const s = await getAgentStatus(slug); if (!stop) setSt(s); }
    load();
    const iv = setInterval(load, 45000);
    return () => { stop = true; clearInterval(iv); };
  }, [slug]);

  const status = st?.status || "available";
  const meta = presenceMeta(status);

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${meta.badge}`}>
      <span className={`w-2 h-2 rounded-full ${meta.dot} ${status === "available" ? "animate-pulse" : ""}`} />
      {meta.icon} {meta.label}{st?.message ? ` · ${st.message}` : ""}
    </div>
  );
}
