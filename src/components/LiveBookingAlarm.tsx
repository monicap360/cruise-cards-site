"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

// Rings the office computer the moment a new booking/request lands. Polls the
// inquiries table; on a new row it plays a repeating chime, fires a desktop
// notification, and shows a banner. Mounted on every admin page.

type NewRow = { id: string; first_name: string; last_name: string; mode: string; ship: string; created_at: string };

const SEEN_KEY = "cfg-alarm-seen";
const POLL_MS = 15000;

export default function LiveBookingAlarm() {
  const [enabled, setEnabled] = useState(false);
  const [ringing, setRinging] = useState<NewRow | null>(null);
  const acRef = useRef<AudioContext | null>(null);
  const ringTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const seenRef = useRef<string>("");

  // Enable on a user gesture (needed for audio + notifications).
  async function enable() {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      acRef.current = new AC();
      await acRef.current.resume();
    } catch { /* no audio */ }
    try { if ("Notification" in window && Notification.permission === "default") await Notification.requestPermission(); } catch { /* ignore */ }
    setEnabled(true);
    localStorage.setItem("cfg-alarm-on", "1");
  }

  useEffect(() => {
    if (localStorage.getItem("cfg-alarm-on") === "1") setEnabled(true);
    seenRef.current = localStorage.getItem(SEEN_KEY) || "";
  }, []);

  // One ring = a short two-tone chime.
  function chime() {
    const ac = acRef.current;
    if (!ac) return;
    [880, 1320].forEach((freq, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.frequency.value = freq;
      o.type = "sine";
      const t = ac.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.start(t); o.stop(t + 0.18);
    });
  }

  function startRinging(row: NewRow) {
    setRinging(row);
    chime();
    if (ringTimer.current) clearInterval(ringTimer.current);
    ringTimer.current = setInterval(chime, 1600); // keep ringing until acknowledged
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🚢 New booking!", { body: `${row.first_name} ${row.last_name} · ${row.ship || "website"}`, tag: row.id });
      }
    } catch { /* ignore */ }
  }

  function acknowledge() {
    if (ringTimer.current) { clearInterval(ringTimer.current); ringTimer.current = null; }
    if (ringing) { seenRef.current = ringing.created_at; localStorage.setItem(SEEN_KEY, ringing.created_at); }
    setRinging(null);
  }

  // Poll loop
  useEffect(() => {
    if (!enabled) return;
    let stop = false;
    async function poll() {
      const { data } = await supabase
        .from("inquiries")
        .select("id,first_name,last_name,mode,ship,created_at")
        .in("mode", ["booking", "inquiry", "room-move", "guest-change", "name-correction", "cancellation", "booking-change"])
        .order("created_at", { ascending: false })
        .limit(1);
      if (stop || !data || !data[0]) return;
      const newest = data[0] as NewRow;
      if (!seenRef.current) { // baseline — don't ring on first load
        seenRef.current = newest.created_at;
        localStorage.setItem(SEEN_KEY, newest.created_at);
        return;
      }
      if (newest.created_at > seenRef.current && !ringing) startRinging(newest);
    }
    poll();
    const iv = setInterval(poll, POLL_MS);
    return () => { stop = true; clearInterval(iv); };
  }, [enabled, ringing]);

  if (!enabled) {
    return (
      <button onClick={enable} className="fixed bottom-4 right-4 z-50 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full shadow-lg">
        🔔 Enable booking alerts
      </button>
    );
  }

  if (ringing) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 p-4">
        <div className="max-w-md mx-auto bg-sky-600 text-white rounded-2xl shadow-2xl p-5 animate-pulse">
          <div className="text-[11px] uppercase tracking-widest text-sky-100">🚢 New booking just came in</div>
          <div className="text-xl font-extrabold mt-1">{ringing.first_name} {ringing.last_name}</div>
          <div className="text-sky-100 text-sm">{ringing.ship || "Website request"} · {ringing.mode}</div>
          <div className="flex gap-2 mt-4">
            <a href="/admin/inbox" onClick={acknowledge} className="flex-1 bg-white text-sky-700 text-center font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-full">Open inbox →</a>
            <button onClick={acknowledge} className="bg-sky-700 hover:bg-sky-800 text-white font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-full">Dismiss</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 bg-[#0b1020]/90 border border-white/10 text-green-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Alerts on
    </div>
  );
}
