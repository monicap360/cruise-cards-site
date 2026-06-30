"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Surfaces "requested vs booked" mismatches in a group: where a member's roster
// category differs from the category of the cabin actually booked/held for them
// (matched by name to a group_rooms row). Lets the agent reconcile in one click,
// so the group view visibly shows what's being fixed.

type M = { id: string; name: string; cabin_type: string; cabin_number: string; fare: number };
type R = { label: string; cabin_type: string; booked_by: string };
type Issue = { mem: M; room: R };

const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z]/g, "");

export default function GroupDiscrepancies({ groupId }: { groupId: string }) {
  const [members, setMembers] = useState<M[]>([]);
  const [rooms, setRooms] = useState<R[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  async function load() {
    setLoading(true);
    const mm = await supabase.from("group_members").select("id,name,cabin_type,cabin_number,fare").eq("group_id", groupId);
    const rr = await supabase.from("group_rooms").select("label,cabin_type,booked_by").eq("group_id", groupId);
    setMembers((mm.data as M[]) || []);
    setRooms((rr.data as R[]) || []);
    setLoading(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [groupId]);

  const issues: Issue[] = members
    .map((mem) => {
      const room = rooms.find((rm) => rm.booked_by && norm(rm.booked_by) === norm(mem.name));
      if (!room || !mem.cabin_type || !room.cabin_type) return null;
      if (norm(mem.cabin_type) === norm(room.cabin_type)) return null;
      return { mem, room };
    })
    .filter((x): x is Issue => x !== null);

  async function reconcile(mem: M, booked: string) {
    setBusy(mem.id);
    await supabase.from("group_members").update({ cabin_type: booked }).eq("id", mem.id);
    await load();
    setBusy("");
  }

  if (loading) return <div className="mb-4 text-white/40 text-sm">Checking for discrepancies…</div>;

  return (
    <div className="mb-4 rounded-xl border border-white/10 bg-[#0b1020] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider text-sky-300/80 font-bold">🔧 Requested vs Booked — Reconciliation</span>
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${issues.length ? "bg-amber-400/15 text-amber-300" : "bg-green-500/15 text-green-300"}`}>
          {issues.length ? `${issues.length} fixing` : "all matched ✓"}
        </span>
      </div>
      {issues.length === 0 ? (
        <p className="text-white/45 text-sm">Every guest&rsquo;s roster category matches the cabin booked for them. Nothing to reconcile.</p>
      ) : (
        <>
          <p className="text-white/45 text-xs mb-3">These cabins were <strong className="text-white/70">requested</strong> as one category but <strong className="text-white/70">booked</strong> as another. Reconcile the roster to the booked cabin, or leave it flagged while you work it.</p>
          <div className="space-y-2">
            {issues.map(({ mem, room }) => (
              <div key={mem.id} className="flex items-center gap-3 flex-wrap rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2">
                <span className="font-semibold text-sm flex-1 min-w-0">{mem.name}</span>
                <span className="text-xs text-white/60">
                  requested <span className="text-amber-300 font-semibold">{mem.cabin_type}</span>
                  <span className="text-white/30"> → </span>
                  booked <span className="text-sky-300 font-semibold">{room.cabin_type}</span>
                  <span className="text-white/30"> ({room.label.split(" ")[0]})</span>
                </span>
                <button onClick={() => reconcile(mem, room.cabin_type)} disabled={busy === mem.id}
                  className="text-green-300 hover:text-green-200 disabled:opacity-50 text-xs font-bold">
                  {busy === mem.id ? "…" : `Set roster → ${room.cabin_type}`}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
