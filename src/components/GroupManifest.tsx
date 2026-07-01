"use client";

import { useEffect, useState } from "react";
import type { GroupPassenger } from "@/lib/group-passengers";
import { getPassengerInfo, savePassengerInfo, type PassengerInfo } from "@/lib/group-passenger-info";

// Guest manifest with editable VIFP / email / phone per passenger — each guest
// can input and save (or edit) their own details, stored in the group DB.
export default function GroupManifest({ passengers, groupCode }: { passengers: GroupPassenger[]; groupCode: string }) {
  const [info, setInfo] = useState<Record<string, PassengerInfo>>({});
  const [savedName, setSavedName] = useState("");
  const [busyName, setBusyName] = useState("");

  useEffect(() => {
    // seed from code defaults, then overlay any saved values from the DB
    const seed: Record<string, PassengerInfo> = {};
    passengers.forEach((p) => { seed[p.name] = { vifp: p.vifp || "", email: "", phone: "" }; });
    setInfo(seed);
    getPassengerInfo(groupCode)
      .then((saved) => setInfo((cur) => {
        const next = { ...cur };
        for (const [name, v] of Object.entries(saved)) next[name] = { ...next[name], ...v };
        return next;
      }))
      .catch(() => {});
  }, [passengers, groupCode]);

  const set = (name: string, patch: Partial<PassengerInfo>) =>
    setInfo((cur) => ({ ...cur, [name]: { ...cur[name], ...patch } }));

  async function save(name: string) {
    setBusyName(name);
    await savePassengerInfo(groupCode, name, info[name] ?? { vifp: "", email: "", phone: "" });
    setBusyName("");
    setSavedName(name);
    setTimeout(() => setSavedName(""), 2500);
  }

  const input = "w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-sky-400/60";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1020] overflow-hidden">
      <table className="w-full text-sm min-w-[720px]">
        <thead>
          <tr className="bg-white/5 text-white/50 label-mono text-[10px] uppercase tracking-wider">
            <th className="text-left font-bold px-4 py-3">Guest</th>
            <th className="text-left font-bold px-3 py-3">DOB</th>
            <th className="text-center font-bold px-3 py-3">Room</th>
            <th className="text-left font-bold px-3 py-3">VIFP #</th>
            <th className="text-left font-bold px-3 py-3">Email</th>
            <th className="text-left font-bold px-3 py-3">Phone</th>
            <th className="px-3 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((p) => {
            const v = info[p.name] ?? { vifp: "", email: "", phone: "" };
            return (
              <tr key={p.name} className="border-t border-white/10 align-top">
                <td className="px-4 py-3 font-bold text-white capitalize whitespace-nowrap">{p.name}</td>
                <td className="px-3 py-3 text-white/70 whitespace-nowrap">{p.dob || "—"}</td>
                <td className="px-3 py-3 text-center text-white/80 font-mono">#{p.stateroom}</td>
                <td className="px-3 py-3"><input className={input + " font-mono"} placeholder="VIFP #" value={v.vifp} onChange={(e) => set(p.name, { vifp: e.target.value })} /></td>
                <td className="px-3 py-3"><input className={input} type="email" placeholder="email" value={v.email} onChange={(e) => set(p.name, { email: e.target.value })} /></td>
                <td className="px-3 py-3"><input className={input} type="tel" placeholder="phone" value={v.phone} onChange={(e) => set(p.name, { phone: e.target.value })} /></td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <button onClick={() => save(p.name)} disabled={busyName === p.name}
                    className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold uppercase tracking-wider text-[10px] px-3 py-2 rounded-full">
                    {busyName === p.name ? "…" : savedName === p.name ? "Saved ✓" : "Save"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
