"use client";

import { useState } from "react";
import { setOfferStatus, type OfferStatus } from "@/lib/crm";

export default function OfferActions({
  token,
  initialStatus,
}: {
  token: string;
  initialStatus: OfferStatus;
}) {
  const [status, setStatus] = useState<OfferStatus>(initialStatus);
  const [busy, setBusy] = useState("");

  async function act(next: OfferStatus) {
    setBusy(next);
    const ok = await setOfferStatus(token, next);
    setBusy("");
    if (ok) setStatus(next);
    else alert("Sorry — something went wrong. Please call (409) 632-2106.");
  }

  if (status === "Booked") {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 text-green-800 px-6 py-5 text-center">
        <div className="text-3xl mb-1">🎉</div>
        <div className="font-extrabold text-lg">You booked it!</div>
        <div className="text-sm mt-1">A specialist will call you to finalize your cruise and arrange payment. Thank you!</div>
      </div>
    );
  }
  if (status === "Denied") {
    return (
      <div className="rounded-2xl bg-gray-100 border border-gray-300 text-gray-700 px-6 py-5 text-center">
        <div className="font-bold">No problem — this offer was declined.</div>
        <div className="text-sm mt-1">Changed your mind? Call (409) 632-2106 and we&rsquo;ll help.</div>
        <button onClick={() => act("Approved")} className="mt-3 text-sky-600 underline text-sm">Actually, I&rsquo;m interested →</button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {status === "Approved" && (
        <div className="rounded-xl bg-sky-50 border border-sky-200 text-sky-800 px-4 py-3 text-sm font-semibold text-center">
          ✓ You marked this offer as interested — book below to lock it in, and we&rsquo;ll call to finalize.
        </div>
      )}
      <button onClick={() => act("Booked")} disabled={busy !== ""}
        className="w-full bg-green-600 hover:bg-green-500 text-white disabled:opacity-50 font-bold uppercase tracking-wider text-sm px-6 py-4 rounded-xl transition-all">
        {busy === "Booked" ? "Booking…" : "✓ Book this offer"}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => act("Approved")} disabled={busy !== ""}
          className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-300 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-4 py-3 rounded-xl">
          {busy === "Approved" ? "…" : "👍 I'm interested"}
        </button>
        <button onClick={() => act("Denied")} disabled={busy !== ""}
          className="bg-white text-gray-500 hover:bg-gray-50 border border-gray-300 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-4 py-3 rounded-xl">
          {busy === "Denied" ? "…" : "👎 No thanks"}
        </button>
      </div>
      <p className="text-center text-gray-400 text-xs">No card charged here — booking just tells us to call you and finalize.</p>
    </div>
  );
}
