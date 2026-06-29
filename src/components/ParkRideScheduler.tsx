"use client";

import { useEffect, useState } from "react";
import {
  type ParkingSlot,
  genSlots,
  fmtTime,
  newSlotId,
  getParkingSlots,
  bookParkingSlot,
} from "@/lib/parking";

export default function ParkRideScheduler({
  groupCode,
  sailDate,
}: {
  groupCode: string;
  sailDate: string;
}) {
  const [booked, setBooked] = useState<ParkingSlot[]>([]);
  const [time, setTime] = useState("");
  const [cabin, setCabin] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const slots = genSlots(8, 15, 30); // 8:00 AM – 2:30 PM, every 30 min
  const takenBy = new Map(booked.map((b) => [b.time, b]));

  async function load() {
    try { setBooked(await getParkingSlots(groupCode)); } catch { /* table may not exist yet */ }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [groupCode]);

  async function book() {
    if (!time) { setMsg("Pick a 30-minute time slot."); return; }
    if (!name.trim()) { setMsg("Add the name on the reservation."); return; }
    setBusy(true); setMsg("");
    const res = await bookParkingSlot({
      id: newSlotId(), groupCode, sailDate, time, cabin, name, phone,
    });
    setBusy(false);
    if (res.ok) {
      setTime(""); setCabin(""); setName(""); setPhone("");
      setMsg("✓ Park & Ride time reserved — see you at the lot!");
      load();
      setTimeout(() => setMsg(""), 3500);
    } else {
      setMsg(res.error || "Couldn't reserve — please call (409) 632-2106.");
      load();
    }
  }

  return (
    <div>
      <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">{"// Park & Ride — Schedule Your Drop-off"}</div>
      <p className="text-white/55 text-sm mb-4">
        Our shuttle takes <span className="text-white/80 font-semibold">one car at a time</span>, every 30 minutes on sail day.
        Pick an open time below to reserve your transport.
      </p>

      {/* Slot grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {slots.map((s) => {
          const t = takenBy.get(s);
          const isTaken = !!t;
          const selected = time === s;
          return (
            <button
              key={s}
              type="button"
              disabled={isTaken}
              onClick={() => setTime(s)}
              className={`rounded-xl px-3 py-3 text-sm font-semibold border text-left transition-all ${
                isTaken
                  ? "bg-white/5 border-white/5 text-white/30 cursor-not-allowed"
                  : selected
                  ? "bg-sky-500/20 border-sky-400/60 text-white"
                  : "bg-[#0b1020] border-white/10 text-white/80 hover:border-sky-400/40"
              }`}
            >
              <div>{fmtTime(s)}</div>
              <div className="text-[11px] font-normal mt-0.5">
                {isTaken ? `Taken${t?.cabin ? ` · ${t.cabin}` : ""}` : "Open"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Booking form */}
      <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-5">
        <div className="text-white/70 text-sm mb-3">
          {time ? <>Reserving <span className="text-sky-300 font-bold">{fmtTime(time)}</span></> : "Select a time above, then add your details:"}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name on reservation"
            className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
          <input value={cabin} onChange={(e) => setCabin(e.target.value)} placeholder="Cabin # (if known)"
            className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Cell phone"
            className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button onClick={book} disabled={busy}
            className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full">
            {busy ? "Reserving…" : "Reserve my time"}
          </button>
          {msg && <span className="text-sky-300 text-sm">{msg}</span>}
        </div>
      </div>

      {/* Who's scheduled */}
      {booked.length > 0 && (
        <div className="mt-5">
          <div className="text-white/45 text-xs uppercase tracking-wider font-bold mb-2">Scheduled drop-offs</div>
          <div className="flex flex-wrap gap-2">
            {booked.map((b) => (
              <span key={b.id} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/65">
                {fmtTime(b.time)} · {b.name}{b.cabin ? ` (${b.cabin})` : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
