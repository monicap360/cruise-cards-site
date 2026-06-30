"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Per-cabin bed configuration (king vs twins, + extra berth for 3rd/4th guests).
// Keyed by member_id. Editable in the group portal so guests set their own
// preference; the agent confirms it with the cruise line.

const OPTIONS = [
  { v: "", l: "Bed setup — choose…" },
  { v: "king", l: "🛏️ One king (beds together)" },
  { v: "twin", l: "🛏️🛏️ Two twins (apart)" },
  { v: "king-extra", l: "King + extra berth (3rd/4th guest)" },
  { v: "twin-extra", l: "Twins + extra berth (3rd/4th guest)" },
];

export default function BedConfig({ memberId, editable = true }: { memberId: string; editable?: boolean }) {
  const [val, setVal] = useState("");
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await supabase.from("cabin_beds").select("config").eq("member_id", memberId).limit(1);
      if (r.error) { setMissing(true); return; }
      if (r.data && r.data[0]) setVal((r.data[0].config as string) || "");
    })();
  }, [memberId]);

  async function save(v: string) {
    setVal(v);
    await supabase.from("cabin_beds").upsert({ member_id: memberId, config: v });
  }

  if (missing) return null; // table not set up yet — stay invisible
  const label = OPTIONS.find((o) => o.v === val)?.l || "Bed: not set";

  if (!editable) return <span className="text-white/50 text-xs">🛏️ {val ? label : "not set"}</span>;

  return (
    <select value={val} onChange={(e) => save(e.target.value)}
      className="bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-xs text-white/80 focus:outline-none focus:border-sky-400/60 max-w-[220px]">
      {OPTIONS.map((o) => <option key={o.v} value={o.v} className="bg-[#0b1020]">{o.l}</option>)}
    </select>
  );
}
