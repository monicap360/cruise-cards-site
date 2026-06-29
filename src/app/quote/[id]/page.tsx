import Link from "next/link";
import Photo from "@/components/Photo";
import BrandLogo from "@/components/BrandLogo";
import PrintButton from "@/components/PrintButton";
import { fmt$, fmtDate } from "@/lib/sea-pay";
import { getQuote, quoteTotal, quoteBalance } from "@/lib/quotes";

export const dynamic = "force-dynamic";

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const q = await getQuote(id);

  if (!q) {
    return (
      <div className="min-h-screen bg-[#05070d] text-white flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-extrabold">Quote not found</h1>
        <p className="text-white/50">
          This link may have expired or been removed.
        </p>
        <Link href="/" className="text-sky-400 hover:text-sky-300 font-semibold">
          ← Back to Cruises from Galveston
        </Link>
      </div>
    );
  }

  const total = quoteTotal(q);
  const balance = quoteBalance(q);
  const isInvoice = q.type === "invoice";
  const docLabel = isInvoice ? "INVOICE" : "QUOTE";
  const balanceLabel = isInvoice ? "Amount due" : "Balance due";

  return (
    <div className="bg-gray-200 min-h-screen py-8 print:bg-white print:py-0">
      {/* Action bar */}
      <div className="print:hidden max-w-[8.5in] mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 px-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/reserve"
            className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-300 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full"
          >
            📅 Book appointment
          </Link>
          <a
            href="tel:+14096322106"
            className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-300 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full"
          >
            Call (409) 632-2106
          </a>
        </div>
        <PrintButton className="bg-gray-900 text-white hover:bg-gray-800 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full" />
      </div>

      {/* Sheet */}
      <div className="bg-white text-gray-900 max-w-[8.5in] mx-auto border border-gray-300 print:border-0 overflow-hidden">
        {/* Hero */}
        <div className="relative h-52">
          <Photo
            src={`/destinations/${q.destSlug || "cozumel"}.jpg`}
            alt={q.ship}
            overlay={false}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
          <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
            <div>
              <BrandLogo dark className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]" />
              <div className="text-xs uppercase tracking-wider text-white/80 mt-1">
                Cruise Experience Center
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
                {docLabel}
              </div>
              <div className="text-2xl font-extrabold leading-tight">
                {q.ship || "Your Cruise"}
              </div>
              <div className="text-sm text-white/85">
                {q.nights ? `${q.nights} nights` : ""}
                {q.nights && q.cruiseLine ? " · " : ""}
                {q.cruiseLine}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-7 space-y-7">
          {/* Client */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Prepared for
            </div>
            <div className="text-lg font-bold">{q.clientName || "—"}</div>
            {q.clientEmail && (
              <div className="text-sm text-gray-600">{q.clientEmail}</div>
            )}
            {q.clientPhone && (
              <div className="text-sm text-gray-600">{q.clientPhone}</div>
            )}
          </div>

          {/* Dates + itinerary */}
          {(q.sailDate || q.itinerary || q.nights > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-gray-200 py-4">
              {q.sailDate && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                    Sail date
                  </div>
                  <div className="text-sm font-semibold">
                    {fmtDate(q.sailDate)}
                  </div>
                </div>
              )}
              {q.nights > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                    Length
                  </div>
                  <div className="text-sm font-semibold">{q.nights} nights</div>
                </div>
              )}
              {q.itinerary && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                    Itinerary
                  </div>
                  <div className="text-sm font-semibold">{q.itinerary}</div>
                </div>
              )}
            </div>
          )}

          {/* Line items */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left text-[10px] uppercase tracking-wider text-gray-400">
                <th className="pb-2 font-bold">Description</th>
                <th className="pb-2 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {q.lines.map((line, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2.5">{line.label || "—"}</td>
                  <td className="py-2.5 text-right tabular-nums">
                    {fmt$(line.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold tabular-nums">{fmt$(total)}</span>
              </div>
              {q.deposit > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Deposit</span>
                  <span className="font-semibold tabular-nums">
                    −{fmt$(q.deposit)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t-2 border-gray-900 pt-2 text-base">
                <span className="font-extrabold">{balanceLabel}</span>
                <span className="font-extrabold tabular-nums">
                  {fmt$(balance)}
                </span>
              </div>
            </div>
          </div>

          {/* Valid until (quotes only) */}
          {!isInvoice && q.expiresOn && (
            <div className="rounded-xl bg-sky-50 border border-sky-200 text-sky-800 px-4 py-3 text-sm font-semibold">
              Valid until {fmtDate(q.expiresOn)}
            </div>
          )}

          {/* Agent */}
          {q.agentName && (
            <div className="text-sm text-gray-500">
              Prepared by {q.agentName}
            </div>
          )}

          {/* Notes */}
          {q.notes && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Notes
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {q.notes}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-2 border-gray-900 rounded-xl p-5 text-center space-y-2">
            <div className="text-sm font-semibold text-gray-900">
              Ready to book? Call (409) 632-2106 or visit 3501 Winnie St,
              Galveston, TX. No card is charged online — pay by mailed check or
              directly with the cruise line.
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Plan. Book. Protect. Sail. Return.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
