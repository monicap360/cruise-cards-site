"use client";

import { useState } from "react";
import { type QuoteCabin, acceptQuote } from "@/lib/quotes";
import { fmt$ } from "@/lib/sea-pay";

export default function QuoteAccept({
  quoteId,
  cabinOptions,
}: {
  quoteId: string;
  cabinOptions: QuoteCabin[];
}) {
  const preselected =
    cabinOptions.find((c) => c.recommended)?.id ?? cabinOptions[0]?.id ?? "";
  const [optionId, setOptionId] = useState<string>(preselected);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleAccept() {
    if (!name.trim()) {
      setError("Please type your name to accept.");
      return;
    }
    if (cabinOptions.length > 0 && !optionId) {
      setError("Please choose a cabin option.");
      return;
    }
    setBusy(true);
    setError("");
    const ok = await acceptQuote(quoteId, optionId, name.trim());
    setBusy(false);
    if (ok) {
      setDone(true);
    } else {
      setError("Something went wrong. Please call us at (409) 632-2106.");
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border-2 border-green-600 bg-green-50 p-5 print:border print:border-gray-300">
        <div className="text-base font-extrabold text-green-800">
          ✓ Quote accepted — thank you{name ? `, ${name}` : ""}!
        </div>
        <div className="mt-2 text-sm text-gray-700">
          No card was charged online. We&apos;ll call to confirm your booking and
          walk you through the next steps. Pay by mailed check to{" "}
          <span className="font-semibold">
            3501 Winnie St, Galveston, TX 77550
          </span>
          , or directly with the cruise line. Questions? Call{" "}
          <a href="tel:+14096322106" className="font-semibold underline">
            (409) 632-2106
          </a>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="print:hidden rounded-xl border-2 border-gray-900 p-5 space-y-4">
      <div>
        <div className="text-base font-extrabold text-gray-900">
          Accept this quote
        </div>
        <p className="text-sm text-gray-600">
          Choose your cabin and add your name. No card is charged online.
        </p>
      </div>

      {cabinOptions.length > 0 && (
        <div className="space-y-2">
          {cabinOptions.map((c) => (
            <label
              key={c.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer ${
                optionId === c.id
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="cabin-choice"
                checked={optionId === c.id}
                onChange={() => setOptionId(c.id)}
                className="accent-gray-900"
              />
              <span className="flex-1 text-sm font-semibold text-gray-900">
                {c.category || "Cabin"}
                {c.recommended && (
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-sky-700">
                    Recommended
                  </span>
                )}
                {c.perks && (
                  <span className="block text-xs font-normal text-gray-500">
                    {c.perks}
                  </span>
                )}
              </span>
              <span className="text-sm font-extrabold tabular-nums text-gray-900">
                {fmt$(c.perPerson)}
                <span className="text-xs font-normal text-gray-500"> /person</span>
              </span>
            </label>
          ))}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
          Your name
        </label>
        <input
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-900"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
        />
      </div>

      {error && <div className="text-sm font-semibold text-red-600">{error}</div>}

      <button
        onClick={handleAccept}
        disabled={busy}
        className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full"
      >
        {busy ? "Submitting…" : "Accept this quote"}
      </button>
    </div>
  );
}
