"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Guest = { name: string; dob: string; contact: string };
type Room = { id: string; guests: Guest[] };

const newGuest = (): Guest => ({ name: "", dob: "", contact: "" });
const rid = () => "r" + Math.random().toString(36).slice(2, 7);

export default function RoomingListForm({
  groupCode,
  groupName,
  ship,
}: {
  groupCode: string;
  groupName: string;
  ship: string;
}) {
  const [byName, setByName] = useState("");
  const [byEmail, setByEmail] = useState("");
  const [byPhone, setByPhone] = useState("");
  const [rooms, setRooms] = useState<Room[]>([
    { id: rid(), guests: [newGuest(), newGuest()] },
    { id: rid(), guests: [newGuest(), newGuest()] },
  ]);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  function setGuest(ri: number, gi: number, p: Partial<Guest>) {
    setRooms((rs) =>
      rs.map((r, i) =>
        i === ri
          ? { ...r, guests: r.guests.map((g, j) => (j === gi ? { ...g, ...p } : g)) }
          : r
      )
    );
  }
  const addGuest = (ri: number) =>
    setRooms((rs) => rs.map((r, i) => (i === ri ? { ...r, guests: [...r.guests, newGuest()] } : r)));
  const removeGuest = (ri: number, gi: number) =>
    setRooms((rs) =>
      rs.map((r, i) => (i === ri ? { ...r, guests: r.guests.filter((_, j) => j !== gi) } : r))
    );
  const addRoom = () => setRooms((rs) => [...rs, { id: rid(), guests: [newGuest(), newGuest()] }]);
  const removeRoom = (ri: number) => setRooms((rs) => rs.filter((_, i) => i !== ri));

  async function submit() {
    if (!byName.trim() || !byEmail.trim()) {
      alert("Please add your name and email so we can match this to your group.");
      return;
    }
    const filledRooms = rooms
      .map((r) => r.guests.filter((g) => g.name.trim()))
      .filter((gs) => gs.length > 0);
    if (filledRooms.length === 0) {
      alert("Add at least one guest with a name.");
      return;
    }

    const lines = filledRooms
      .map((gs, i) => {
        const guestLines = gs
          .map(
            (g) =>
              `   - ${g.name}${g.dob ? ` · DOB ${g.dob}` : ""}${g.contact ? ` · ${g.contact}` : ""}`
          )
          .join("\n");
        return `Room ${i + 1}:\n${guestLines}`;
      })
      .join("\n\n");

    const message =
      `ROOMING LIST — ${groupName || "Group"} (${ship || "ship TBD"}) · code ${groupCode}\n` +
      `Submitted by ${byName} · ${byEmail}${byPhone ? ` · ${byPhone}` : ""}\n\n${lines}`;

    setBusy(true);
    await supabase.from("inquiries").insert({
      confirm_number: "RL-" + Math.random().toString(36).toUpperCase().slice(2, 8),
      first_name: byName,
      last_name: `(${groupName || groupCode})`,
      email: byEmail,
      phone: byPhone,
      ship,
      sail_date: "",
      rate_type: "",
      guests: String(filledRooms.reduce((s, gs) => s + gs.length, 0)),
      cabin_type: `${filledRooms.length} rooms`,
      crew: groupCode,
      message,
      appt_date: "",
      appt_time: "",
      mode: "rooming-list",
    });
    setBusy(false);
    setSent(true);
  }

  const field =
    "w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[9px] uppercase tracking-wider text-white/45 mb-1";

  if (sent) {
    return (
      <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-6">
        <div className="text-2xl mb-2">✅</div>
        <div className="font-extrabold text-white text-lg mb-1">Rooming list submitted</div>
        <p className="text-white/60 text-sm">
          Thanks, {byName.split(" ")[0] || "there"} — your specialist has your rooming list and
          will confirm each cabin. We&rsquo;ll reach out at {byEmail} with anything we need.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
      <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-1">
        {"// Submit Your Rooming List"}
      </div>
      <p className="text-white/55 text-sm mb-5">
        Tell us who&rsquo;s in each cabin — full name, date of birth, and a contact for each guest.
        Add a room for every cabin in your group.
      </p>

      {/* Submitter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div>
          <label className={lbl}>Your name *</label>
          <input className={field} value={byName} onChange={(e) => setByName(e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Your email *</label>
          <input type="email" className={field} value={byEmail} onChange={(e) => setByEmail(e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Your phone</label>
          <input className={field} value={byPhone} onChange={(e) => setByPhone(e.target.value)} />
        </div>
      </div>

      {/* Rooms */}
      <div className="space-y-5">
        {rooms.map((room, ri) => (
          <div key={room.id} className="border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-extrabold text-white uppercase tracking-tight">Room {ri + 1}</div>
              {rooms.length > 1 && (
                <button onClick={() => removeRoom(ri)} className="text-red-400/80 hover:text-red-300 text-xs font-bold">
                  Remove room
                </button>
              )}
            </div>
            <div className="space-y-2">
              {room.guests.map((g, gi) => (
                <div key={gi} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto] gap-2 items-end">
                  <div>
                    {gi === 0 && <label className={lbl}>Full name</label>}
                    <input className={field} value={g.name} onChange={(e) => setGuest(ri, gi, { name: e.target.value })} placeholder="Guest name" />
                  </div>
                  <div>
                    {gi === 0 && <label className={lbl}>Date of birth</label>}
                    <input type="date" className={field} value={g.dob} onChange={(e) => setGuest(ri, gi, { dob: e.target.value })} />
                  </div>
                  <div>
                    {gi === 0 && <label className={lbl}>Contact (phone/email)</label>}
                    <input className={field} value={g.contact} onChange={(e) => setGuest(ri, gi, { contact: e.target.value })} placeholder="optional" />
                  </div>
                  <button
                    onClick={() => removeGuest(ri, gi)}
                    disabled={room.guests.length <= 1}
                    className="text-white/40 hover:text-white disabled:opacity-30 text-lg px-2 pb-1"
                    aria-label="Remove guest"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => addGuest(ri)} className="mt-3 text-sky-400 hover:text-sky-300 text-xs font-bold">
              + Add guest to this room
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button onClick={addRoom} className="border border-white/25 hover:border-white/60 text-white font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-full transition-all">
          + Add another room
        </button>
        <button
          onClick={submit}
          disabled={busy}
          className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
        >
          {busy ? "Submitting…" : "Submit rooming list →"}
        </button>
      </div>
    </div>
  );
}
