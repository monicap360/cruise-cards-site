"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PrintButton from "@/components/PrintButton";
import {
  type SignupEntry,
  type SignupGuest,
  getSignups,
  saveSignup,
  roomGuests,
} from "@/lib/signups";
import { getGroupSailing } from "@/lib/group-sailings";

export default function RoomingListPage() {
  const [rows, setRows] = useState<SignupEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState("");
  // editable guests per signup id
  const [edited, setEdited] = useState<Record<string, SignupGuest[]>>({});
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    getSignups().then((data) => {
      setRows(data);
      if (data.length) setGroup(data[0].groupLabel);
      const map: Record<string, SignupGuest[]> = {};
      data.forEach((r) => {
        map[r.id] = roomGuests(r);
      });
      setEdited(map);
      setLoading(false);
    });
  }, []);

  const groups = useMemo(
    () => Array.from(new Set(rows.map((r) => r.groupLabel).filter(Boolean))),
    [rows]
  );
  const inGroup = rows.filter((r) => r.groupLabel === group);
  const sailing = group ? getGroupSailing(group) : null;

  function setGuest(id: string, i: number, p: Partial<SignupGuest>) {
    setEdited((m) => {
      const list = [...(m[id] ?? [])];
      list[i] = { ...list[i], ...p };
      return { ...m, [id]: list };
    });
  }
  function addGuest(id: string) {
    setEdited((m) => ({ ...m, [id]: [...(m[id] ?? []), { name: "", dob: "" }] }));
  }
  function removeGuest(id: string, i: number) {
    setEdited((m) => ({ ...m, [id]: (m[id] ?? []).filter((_, j) => j !== i) }));
  }

  async function saveAll() {
    setSavedMsg("Saving…");
    for (const r of inGroup) {
      const guests = (edited[r.id] ?? []).filter((g) => g.name.trim());
      await saveSignup({ ...r, guests });
    }
    setSavedMsg("✓ Saved");
    setTimeout(() => setSavedMsg(""), 2500);
  }

  const totalGuests = inGroup.reduce(
    (n, r) => n + (edited[r.id]?.filter((g) => g.name.trim()).length || 0),
    0
  );

  return (
    <div className="bg-gray-200 min-h-screen py-8 print:bg-white print:py-0">
      {/* Toolbar */}
      <div className="print:hidden max-w-[8.5in] mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 px-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/signups" className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 font-semibold uppercase tracking-wider text-xs px-4 py-2.5 rounded-full">← Signups</Link>
          {groups.length > 0 && (
            <select value={group} onChange={(e) => setGroup(e.target.value)} className="bg-white text-gray-900 border border-gray-300 rounded-full px-4 py-2.5 text-sm">
              {groups.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          )}
          <button onClick={saveAll} className="bg-sky-600 text-white hover:bg-sky-500 font-semibold uppercase tracking-wider text-xs px-4 py-2.5 rounded-full">Save DOBs</button>
          {savedMsg && <span className="text-sky-700 text-sm font-semibold">{savedMsg}</span>}
        </div>
        <PrintButton className="bg-gray-900 text-white hover:bg-gray-800 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full" />
      </div>

      {/* Sheet */}
      <div className="bg-white text-gray-900 max-w-[8.5in] mx-auto border border-gray-300 print:border-0 p-7">
        <div className="flex items-start justify-between border-b-2 border-gray-900 pb-3 mb-5">
          <div>
            <div className="text-xl font-extrabold uppercase tracking-tight">Rooming List</div>
            <div className="text-sm text-gray-600">{group || "—"}</div>
          </div>
          <div className="text-right text-sm text-gray-600">
            {sailing && (
              <>
                <div className="font-bold text-gray-900">{sailing.ship}</div>
                <div>{sailing.line}</div>
                <div>{sailing.blurb}</div>
              </>
            )}
            <div className="mt-1">{inGroup.length} rooms · {totalGuests} guests</div>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : inGroup.length === 0 ? (
          <p className="text-gray-500">No families in this group yet.</p>
        ) : (
          <div className="space-y-5">
            {inGroup.map((r, idx) => {
              const guests = edited[r.id] ?? [];
              return (
                <div key={r.id} className="border border-gray-300 rounded-lg overflow-hidden break-inside-avoid">
                  <div className="flex items-center justify-between gap-3 bg-gray-100 px-4 py-2 border-b border-gray-300">
                    <div className="font-bold">
                      Room {idx + 1} — {r.leadName || "—"}
                      <span className="text-gray-500 font-normal"> · {r.cabins || "cabin TBD"}</span>
                    </div>
                    <div className="text-sm text-gray-600 font-mono">{r.reservationNumber ? `#${r.reservationNumber}` : ""}</div>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-200">
                        <th className="px-4 py-1.5 font-bold">Guest name (as on ID)</th>
                        <th className="px-4 py-1.5 font-bold w-40">Date of birth</th>
                        <th className="px-2 py-1.5 print:hidden" />
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((g, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="px-4 py-1.5">
                            <input value={g.name} onChange={(e) => setGuest(r.id, i, { name: e.target.value })} className="w-full bg-transparent focus:outline-none focus:bg-sky-50 rounded px-1" placeholder="Full name" />
                          </td>
                          <td className="px-4 py-1.5">
                            <input value={g.dob} onChange={(e) => setGuest(r.id, i, { dob: e.target.value })} className="w-full bg-transparent focus:outline-none focus:bg-sky-50 rounded px-1" placeholder="MM/DD/YYYY" />
                          </td>
                          <td className="px-2 py-1.5 print:hidden text-right">
                            <button onClick={() => removeGuest(r.id, i)} className="text-red-500 hover:text-red-700 text-xs font-bold">✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="print:hidden px-4 py-2">
                    <button onClick={() => addGuest(r.id)} className="text-sky-600 hover:text-sky-800 text-xs font-bold">+ Add guest</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-[11px] text-gray-400">
          Generated by Cruises from Galveston · 3501 Winnie St, Galveston, TX 77550 · (409) 632-2106
        </div>
      </div>
    </div>
  );
}
