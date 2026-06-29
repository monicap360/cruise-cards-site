"use client";

import { useState } from "react";
import { type HotelRfp, submitRfpRate } from "@/lib/hotel-rfp";

export default function HotelRateForm({ rfp }: { rfp: HotelRfp }) {
  const [nightlyRate, setNightlyRate] = useState(rfp.nightlyRate || 0);
  const [roomType, setRoomType] = useState(rfp.roomType || "");
  const [parkStayCruise, setPark] = useState(rfp.parkStayCruise || false);
  const [parkingDays, setParkingDays] = useState(rfp.parkingDays || 0);
  const [shuttle, setShuttle] = useState(rfp.shuttle || false);
  const [terms, setTerms] = useState(rfp.terms || "");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(rfp.status === "Submitted" || rfp.status === "Selected");
  const [err, setErr] = useState("");

  async function submit() {
    if (!nightlyRate) { setErr("Please enter a nightly rate."); return; }
    setBusy(true); setErr("");
    const ok = await submitRfpRate(rfp.token, { nightlyRate, roomType, parkStayCruise, parkingDays, shuttle, terms });
    setBusy(false);
    if (ok) setDone(true);
    else setErr("Couldn't submit — please try again or email cruisesfromgalveston.texas@gmail.com.");
  }

  const input = "w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-sky-500";
  const lbl = "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1";

  if (done) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 text-green-800 px-6 py-6 text-center">
        <div className="text-3xl mb-2">✓</div>
        <div className="font-extrabold text-lg">Rate submitted — thank you!</div>
        <div className="text-sm mt-1">Cruises from Galveston has your group rate for {rfp.groupName}. We&rsquo;ll be in touch. You can resubmit anytime from this link.</div>
        <button onClick={() => setDone(false)} className="mt-4 text-green-700 underline text-sm">Edit / resubmit</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Nightly rate (USD) *</label>
          <input type="number" className={input} value={nightlyRate || ""} onChange={(e) => setNightlyRate(Number(e.target.value))} placeholder="159" />
        </div>
        <div>
          <label className={lbl}>Room type</label>
          <input className={input} value={roomType} onChange={(e) => setRoomType(e.target.value)} placeholder="King / 2 Queens / Harborview…" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={parkStayCruise} onChange={(e) => setPark(e.target.checked)} className="h-4 w-4 accent-sky-600" />
        Park‑Stay‑Cruise — includes parking during the sailing
      </label>
      {parkStayCruise && (
        <div className="grid sm:grid-cols-2 gap-4 pl-6">
          <div>
            <label className={lbl}>Parking nights included</label>
            <input type="number" className={input} value={parkingDays || ""} onChange={(e) => setParkingDays(Number(e.target.value))} placeholder="5" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 sm:mt-6">
            <input type="checkbox" checked={shuttle} onChange={(e) => setShuttle(e.target.checked)} className="h-4 w-4 accent-sky-600" />
            Round‑trip port shuttle included
          </label>
        </div>
      )}

      <div>
        <label className={lbl}>Terms / notes (cutoff date, deposit, comp rooms, breakfast…)</label>
        <textarea className={input} rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="e.g. Rate held until Sep 1; 1 comp room per 25; breakfast included; deposit policy…" />
      </div>

      {err && <div className="text-red-600 text-sm">{err}</div>}
      <button onClick={submit} disabled={busy} className="w-full bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-50 font-bold uppercase tracking-wider text-sm py-4 rounded-xl">
        {busy ? "Submitting…" : "Submit our group rate"}
      </button>
    </div>
  );
}
