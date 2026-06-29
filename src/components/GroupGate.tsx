"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// PIN gate for the group portal. The portal page renders this (and NOT the
// roster/DOB/payment data) until the correct PIN is supplied, so sensitive
// info never reaches the browser without it.
export default function GroupGate({ groupName }: { groupName: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  function submit() {
    const p = pin.trim();
    if (p.length < 3) { setErr("Enter your 4-digit group PIN."); return; }
    router.push(`${pathname}?pin=${encodeURIComponent(p)}`);
  }

  return (
    <div className="bg-[#05070d] text-white min-h-screen flex items-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="rounded-2xl border border-white/10 bg-[#0b1020] p-8 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1">{"// Private Group Portal"}</div>
          <h1 className="text-2xl font-extrabold">{groupName || "Your Group"}</h1>
          <p className="text-white/55 text-sm mt-2">
            This page has your roster and payment details, so it&rsquo;s protected. Enter your group PIN to continue.
          </p>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            inputMode="numeric"
            placeholder="4-digit PIN"
            className="w-full mt-5 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.4em] text-white placeholder-white/30 focus:outline-none focus:border-sky-400/60"
          />
          {err && <div className="text-amber-300 text-sm mt-2">{err}</div>}
          <button
            onClick={submit}
            className="w-full mt-4 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3.5 rounded-full"
          >
            Unlock my group
          </button>
          <p className="text-white/35 text-xs mt-4">
            Your PIN is your sail‑away date — month + day (MMDD). Don&rsquo;t have it? Call (409) 632‑2106.
          </p>
        </div>
      </div>
    </div>
  );
}
