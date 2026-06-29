import Link from "next/link";
import Photo from "@/components/Photo";
import BrandLogo from "@/components/BrandLogo";
import { fmt$, fmtDate } from "@/lib/sea-pay";

// Static SAMPLE of a customer-facing quote/proposal — so staff can preview the
// look without creating a real quote. The real page is /quote/[id].
export const metadata = { title: "Quote preview" };

const SAMPLE = {
  ship: "Carnival Jubilee",
  cruiseLine: "Carnival Cruise Line",
  nights: 7,
  sailDate: "2026-11-21",
  itinerary: "Cozumel · Costa Maya · Roatán",
  destSlug: "cozumel",
  clientName: "The Sample Family (2 guests)",
  agentName: "Your Galveston Specialist",
  expiresOn: "2026-08-15",
  cabins: [
    { category: "Interior", perPerson: 714, perks: "Cozy & great value", recommended: false },
    { category: "Ocean View", perPerson: 924, perks: "Watch the sea go by", recommended: false },
    { category: "Balcony", perPerson: 1218, perks: "Your own private balcony", recommended: true },
    { category: "Suite", perPerson: 2184, perks: "Top deck, extra space, priority", recommended: false },
  ],
  days: [
    { day: "Day 1", port: "Galveston, TX", note: "Board & set sail" },
    { day: "Day 2", port: "Fun day at sea", note: "" },
    { day: "Day 3", port: "Cozumel, Mexico", note: "Snorkel, beach clubs, Mayan ruins" },
    { day: "Day 4", port: "Costa Maya, Mexico", note: "Beach & ruins" },
    { day: "Day 5", port: "Roatán, Honduras", note: "World-class diving" },
    { day: "Day 6", port: "Fun day at sea", note: "" },
    { day: "Day 7", port: "Galveston, TX", note: "Return home" },
  ],
  includes: ["7-night cruise fare", "All main dining & buffets", "Onboard entertainment & pools", "Taxes & port fees"],
  excludes: ["Gratuities (~$16.50/pp/night)", "Vacation protection", "Shore excursions", "Specialty dining & drinks"],
  deposit: 100,
};

export default function QuotePreviewPage() {
  const recommended = SAMPLE.cabins.find((c) => c.recommended) ?? SAMPLE.cabins[0];
  return (
    <div className="bg-gray-200 min-h-screen py-8 print:bg-white print:py-0">
      <div className="print:hidden max-w-[8.5in] mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 px-4">
        <span className="bg-sky-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">Sample preview</span>
        <Link href="/admin/quotes" className="bg-gray-900 text-white hover:bg-gray-800 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">Build a real one →</Link>
      </div>

      <div className="bg-white text-gray-900 max-w-[8.5in] mx-auto border border-gray-300 print:border-0 overflow-hidden">
        {/* Hero */}
        <div className="relative h-52">
          <Photo src={`/destinations/${SAMPLE.destSlug}.jpg`} alt={SAMPLE.ship} overlay={false} className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
          <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
            <div>
              <BrandLogo dark className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]" />
              <div className="text-xs uppercase tracking-wider text-white/80 mt-1">Cruise Experience Center</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">Quote</div>
              <div className="text-2xl font-extrabold leading-tight">{SAMPLE.ship}</div>
              <div className="text-sm text-white/85">{SAMPLE.nights} nights · {SAMPLE.cruiseLine}</div>
            </div>
          </div>
        </div>

        <div className="p-7 space-y-7">
          {/* Client + dates */}
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Prepared for</div>
              <div className="text-lg font-bold">{SAMPLE.clientName}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Sailing</div>
              <div className="text-sm font-semibold">{fmtDate(SAMPLE.sailDate)}</div>
              <div className="text-sm text-gray-600">{SAMPLE.itinerary}</div>
            </div>
          </div>

          {/* Cabin options */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Choose your stateroom — per person, double occupancy</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {SAMPLE.cabins.map((c) => (
                <div key={c.category} className={`relative rounded-xl border p-4 ${c.recommended ? "border-sky-500 bg-sky-50" : "border-gray-300"}`}>
                  {c.recommended && <div className="absolute -top-2 left-3 bg-sky-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">Recommended</div>}
                  <div className="font-extrabold text-gray-900">{c.category}</div>
                  <div className="text-2xl font-extrabold text-sky-700 mt-1">{fmt$(c.perPerson)}</div>
                  <div className="text-[11px] text-gray-500">per person</div>
                  <div className="text-xs text-gray-600 mt-2">{c.perks}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Day by day</div>
            <div className="space-y-1.5">
              {SAMPLE.days.map((d) => (
                <div key={d.day} className="flex gap-3 text-sm border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-gray-900 w-16 flex-shrink-0">{d.day}</span>
                  <span className="font-semibold text-gray-800 w-44 flex-shrink-0">{d.port}</span>
                  <span className="text-gray-500">{d.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Includes / Excludes */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">What&rsquo;s included</div>
              <ul className="space-y-1 text-sm text-gray-700">{SAMPLE.includes.map((x) => <li key={x}>✓ {x}</li>)}</ul>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Not included</div>
              <ul className="space-y-1 text-sm text-gray-500">{SAMPLE.excludes.map((x) => <li key={x}>✕ {x}</li>)}</ul>
            </div>
          </div>

          {/* Acceptance (sample) */}
          <div className="rounded-xl bg-sky-50 border border-sky-200 p-5">
            <div className="font-extrabold text-gray-900 mb-1">Ready to book?</div>
            <div className="text-sm text-gray-600 mb-3">
              Your pick: <span className="font-semibold text-gray-900">{recommended.category} — {fmt$(recommended.perPerson)}/person</span>.
              Deposit just {fmt$(SAMPLE.deposit)}/person to hold it. No card charged online — we&rsquo;ll send your cruise-line secure payment link.
            </div>
            <span className="inline-block bg-gray-300 text-gray-600 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full cursor-not-allowed">Accept this quote (sample)</span>
            <div className="text-xs text-sky-700 mt-3 font-semibold">Valid until {fmtDate(SAMPLE.expiresOn)}</div>
          </div>

          <div className="border-2 border-gray-900 rounded-xl p-4 text-sm">
            <div className="font-extrabold">Questions? Call (409) 632-2106</div>
            <div className="text-gray-600">Cruise Experience Center · 3501 Winnie St, Galveston, TX 77550 · Plan. Book. Protect. Sail. Return.</div>
          </div>

          <div className="text-center text-gray-400 text-xs">Prepared by {SAMPLE.agentName}</div>
        </div>
      </div>
    </div>
  );
}
