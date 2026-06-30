"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function TicketGate({ subject }: { subject: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  function submit() {
    if (pin.trim().length < 4) { setErr("Enter your 4-digit PIN."); return; }
    router.push(`${pathname}?pin=${encodeURIComponent(pin.trim())}`);
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 text-center text-gray-900">
      <div className="text-4xl mb-3">🔒</div>
      <div className="text-[11px] font-bold uppercase tracking-widest text-sky-600">Your Support Ticket</div>
      <h1 className="text-xl font-extrabold mt-1">{subject || "Your question"}</h1>
      <p className="text-gray-500 text-sm mt-2">Enter the PIN we gave you to view your ticket and reply.</p>
      <input value={pin} onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
        inputMode="numeric" placeholder="4-digit PIN"
        className="w-full mt-5 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.4em] text-gray-900 focus:outline-none focus:border-sky-500" />
      {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
      <button onClick={submit} className="w-full mt-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3.5 rounded-full">Open my ticket</button>
      <p className="text-gray-400 text-xs mt-4">Don&rsquo;t have your PIN? Call (409) 632‑2106.</p>
    </div>
  );
}
