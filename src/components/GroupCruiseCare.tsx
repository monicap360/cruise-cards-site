"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Per-cabin Cruise Care (travel protection) tracker for a group. Every cabin
// defaults to "needed" so it shows as an alert until the agent marks it Added or
// Declined. A group banner counts how many cabins still need Cruise Care added.

type M = { id: string; name: string; cabin_number: string; cabin_type: string };
type Status = "needed" | "added" | "declined";

export default function GroupCruiseCare({ groupId }: { groupId: string }) {
  const [members, setMembers] = useState<M[]>([]);
  const [care, setCare] = useState<Record<string, Status>>({});
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  async function load() {
    setLoading(true);
    const mm = await supabase.from("group_members").select("id,name,cabin_number,cabin_type").eq("group_id", groupId);
    const list = (mm.data as M[]) || [];
    setMembers(list);
    const ids = list.map((x) => x.id);
    if (ids.length) {
      const cc = await supabase.from("cabin_care").select("member_id,status").in("member_id", ids);
      if (cc.error) setMissing(true);
      else {
        const map: Record<string, Status> = {};
        (cc.data || []).forEach((r: Record<string, unknown>) => { map[r.member_id as string] = r.status as Status; });
        setCare(map);
      }
    }
    setLoading(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [groupId]);

  async function setStatus(id: string, status: Status) {
    setCare((c) => ({ ...c, [id]: status }));
    await supabase.from("cabin_care").upsert({ member_id: id, status });
  }

  const statusOf = (id: string): Status => care[id] || "needed";
  const needed = members.filter((m) => statusOf(m.id) === "needed").length;

  if (loading) return <div className="mb-4 text-white/40 text-sm">Loading Cruise Care…</div>;

  return (
    <div className="mb-4 rounded-xl border border-white/10 bg-[#0b1020] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider text-sky-300/80 font-bold">🛟 Cruise Care — by cabin</span>
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${needed ? "bg-amber-400/15 text-amber-300" : "bg-green-500/15 text-green-300"}`}>
          {needed ? `${needed} need it` : "all handled ✓"}
        </span>
      </div>
      {missing ? (
        <p className="text-amber-300/80 text-xs">Run the <code className="text-amber-200">cabin_care</code> table SQL to turn this on (see chat).</p>
      ) : members.length === 0 ? (
        <p className="text-white/45 text-sm">No cabins yet.</p>
      ) : (
        <>
          <p className="text-white/45 text-xs mb-3">Add Royal&rsquo;s Cruise Care (travel protection) to each cabin. Mark <strong className="text-white/70">Added</strong> or <strong className="text-white/70">Declined</strong> so the alert clears.</p>
          <div className="space-y-1.5">
            {members.map((m) => {
              const st = statusOf(m.id);
              return (
                <div key={m.id} className="flex items-center gap-3 flex-wrap rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2">
                  <span className="flex-1 min-w-0 text-sm">
                    {st === "needed" && <span className="text-amber-300 mr-1">⚠️</span>}
                    {st === "added" && <span className="text-green-300 mr-1">✅</span>}
                    <span className="font-semibold">{m.name}</span>
                    <span className="text-white/40"> · {m.cabin_type}{m.cabin_number ? ` ${m.cabin_number}` : ""}</span>
                  </span>
                  <div className="flex gap-1 shrink-0">
                    {(["needed", "added", "declined"] as Status[]).map((s) => (
                      <button key={s} onClick={() => setStatus(m.id, s)}
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${st === s
                          ? s === "added" ? "bg-green-500/20 text-green-200" : s === "declined" ? "bg-white/15 text-white/70" : "bg-amber-400/20 text-amber-200"
                          : "bg-white/5 text-white/40 hover:text-white"}`}>
                        {s === "needed" ? "Need" : s === "added" ? "Added" : "Declined"}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
