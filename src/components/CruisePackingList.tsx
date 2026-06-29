// Cruise packing list — what to bring, what NOT to bring, and the all-important
// travel-document rules for Galveston closed-loop sailings (incl. minors).

const BRING = [
  "Carry-on bag with meds, swimsuit & a change of clothes (checked bags arrive later)",
  "Medications in their original labeled bottles",
  "Sunscreen, sunglasses & a hat",
  "Casual outfits + 1–2 dressy outfits for formal night",
  "Comfortable walking shoes + sandals",
  "Light jacket or sweater (ship A/C runs cold)",
  "Phone charger & a power bank",
  "Lanyard for your SeaPass card",
  "Cash for tips and port shopping",
  "Motion-sickness remedy (just in case)",
  "Refillable water bottle",
];

const DONT_BRING = [
  "Surge protectors or extension cords with surge protection (not allowed)",
  "Candles, incense, irons or clothing steamers",
  "Hard liquor — only 1 bottle of wine per adult is allowed at embarkation",
  "Illegal drugs, marijuana or CBD (banned even where legal on land)",
  "Weapons, large knives or scissors",
  "Hoverboards & drones",
  "Large coolers",
  "Any heating elements or hot plates",
];

export default function CruisePackingList() {
  return (
    <div>
      <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">{"// Don't Forget — Cruise Packing List"}</div>
      <p className="text-white/55 text-sm mb-5">Print this and check it off before sail day. Pack documents in your carry-on — never in a checked bag.</p>

      {/* Travel documents — most important */}
      <div className="rounded-2xl border border-sky-400/30 bg-sky-500/5 p-5 mb-5">
        <div className="font-bold text-white flex items-center gap-2">🪪 Travel documents (read this first)</div>
        <ul className="mt-3 space-y-2 text-sm text-white/75">
          <li>✅ <span className="font-semibold text-white">Best option:</span> a valid <span className="font-semibold">passport</span> for every guest.</li>
          <li>✅ <span className="font-semibold text-white">Galveston round-trip (closed-loop):</span> U.S. citizens may instead bring an <span className="font-semibold">original or certified birth certificate</span> plus a <span className="font-semibold">government photo ID for guests 16 and older</span>.</li>
          <li>✅ <span className="font-semibold text-white">Minors 14 and up:</span> bring a <span className="font-semibold">school photo ID</span> (and the birth certificate). Every guest under 18 needs a birth certificate.</li>
          <li>✅ <span className="font-semibold text-white">A minor not sailing with both parents?</span> Bring a notarized parental consent letter.</li>
          <li>✅ Printed <span className="font-semibold">SetSail pass / boarding documents</span> and luggage tags.</li>
          <li>✅ A <span className="font-semibold">credit or debit card</span> to set up your onboard account.</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#0b1020] p-5">
          <div className="font-bold text-green-300 mb-3">✅ What to bring</div>
          <ul className="space-y-2 text-sm text-white/75">
            {BRING.map((b) => <li key={b} className="flex gap-2"><span className="text-green-400">•</span><span>{b}</span></li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0b1020] p-5">
          <div className="font-bold text-red-300 mb-3">🚫 What NOT to bring</div>
          <ul className="space-y-2 text-sm text-white/75">
            {DONT_BRING.map((b) => <li key={b} className="flex gap-2"><span className="text-red-400">•</span><span>{b}</span></li>)}
          </ul>
        </div>
      </div>

      <p className="text-white/40 text-xs mt-4">
        Document rules follow Royal Caribbean / U.S. CBP closed-loop sailing policy and can change — when in doubt, a passport is always accepted. Questions? Call (409) 632-2106.
      </p>
    </div>
  );
}
