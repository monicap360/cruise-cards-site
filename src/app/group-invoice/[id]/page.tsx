import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import PrintButton from "@/components/PrintButton";
import { fmt$, fmtDate } from "@/lib/sea-pay";
import { getMemberById, memberBalance } from "@/lib/groups";

export const dynamic = "force-dynamic";

export default async function GroupInvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ copy?: string }>;
}) {
  const { id } = await params;
  const { copy } = await searchParams;
  const isAgent = copy === "agent";
  const data = await getMemberById(id);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#05070d] text-white flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-extrabold">Invoice not found</h1>
        <Link href="/admin/groups" className="text-sky-400 hover:text-sky-300 font-semibold">← Back to Groups</Link>
      </div>
    );
  }

  const { member, group, cabinLabel } = data;
  const reqDeposit = 100 * (member.guests || 2);
  const balance = memberBalance(member);
  // Free-cruise (tour-conductor) credit — one berth's cruise fare comes off; the
  // free guest still pays port expenses, taxes & government fees.
  const COMM: Record<string, number> = { Balcony: 1139, "Ocean View": 716, Interior: 806 };
  const discount = member.freeCruise ? (COMM[member.cabinType] || 0) : 0;
  const grossFare = member.fare + discount;
  // Agent-copy estimates (commission ~10% of commissionable cruise fare).
  const nonComm = 272.28 * (member.guests || 2); // est. NCCF + taxes/fees per guest
  const commissionable = Math.max(0, member.fare - nonComm);
  const estCommission = Math.round(commissionable * 0.1 * 100) / 100;
  const invNo = "INV-" + id.slice(-6).toUpperCase();
  const status = member.paidInFull
    ? "Paid in full"
    : member.depositPaid > 0
    ? "Deposit received — balance due"
    : "Invoice sent — deposit due";

  const subject = `Invoice ${invNo} — ${group.name}`;
  const body =
    `Hi ${member.name.split(" ")[0] || "there"},\n\n` +
    `Here is your invoice (${invNo}) for the ${group.name} aboard ${group.ship}` +
    `${group.sailingDate ? `, sailing ${group.sailingDate}` : ""}.\n` +
    `${member.confirmationNumber ? `Reservation #${member.confirmationNumber}. ` : ""}` +
    `Cabin: ${member.cabinType}. Guests: ${member.guests}.\n` +
    (member.fare > 0 ? `Total: ${fmt$(member.fare)}. ` : "") +
    `Deposit due: ${fmt$(reqDeposit)} (paid ${fmt$(member.depositPaid)}). Balance: ${fmt$(balance)}.\n` +
    `${group.finalPaymentDate ? `Final payment due ${group.finalPaymentDate}. ` : ""}` +
    `Pay by mailed check to 3501 Winnie St, Galveston, TX 77550 or directly with the cruise line — no card charged online.\n\n` +
    `Cruises from Galveston · (409) 632-2106`;

  const Row = ({ label, value, strong = false, green = false }: { label: string; value: string; strong?: boolean; green?: boolean }) => (
    <tr className="border-b border-gray-200">
      <td className={`py-2 ${strong ? "font-bold" : "text-gray-500"}`}>{label}</td>
      <td className={`py-2 text-right ${green ? "text-green-700 font-extrabold" : strong ? "font-extrabold" : "font-semibold"}`}>{value}</td>
    </tr>
  );

  return (
    <div className="bg-gray-200 min-h-screen py-8 print:bg-white print:py-0">
      <div className="print:hidden max-w-[8.5in] mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 px-4">
        <Link href="/admin/groups" className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 font-semibold uppercase tracking-wider text-xs px-4 py-2.5 rounded-full">← Groups</Link>
        <div className="flex gap-2">
          {member.email && (
            <a href={`mailto:${encodeURIComponent(member.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
              className="bg-sky-600 text-white hover:bg-sky-500 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">📧 Email invoice</a>
          )}
          <PrintButton className="bg-gray-900 text-white hover:bg-gray-800 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full" />
        </div>
      </div>

      <div className="bg-white text-gray-900 max-w-[8.5in] mx-auto border border-gray-300 print:border-0 p-8">
        {isAgent && (
          <div className="mb-5 rounded-lg bg-red-600 text-white px-4 py-2 text-center text-sm font-extrabold uppercase tracking-wider">
            Agent Copy — internal records only · not for the guest
          </div>
        )}
        <div className="flex items-start justify-between border-b-2 border-gray-900 pb-4 mb-6">
          <div>
            <BrandLogo />
            <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Cruise Experience Center</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold uppercase tracking-tight">Invoice</div>
            <div className="text-sm text-gray-500">#{invNo}</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Bill to</div>
            <div className="font-bold">{member.name}</div>
            {member.email && <div className="text-sm text-gray-600">{member.email}</div>}
            {member.phone && <div className="text-sm text-gray-600">{member.phone}</div>}
          </div>
          <div className="sm:text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Reservation</div>
            <div className="font-bold">{group.name}</div>
            <div className="text-sm text-gray-600">{group.ship}{group.sailingDate ? ` · ${fmtDate(group.sailingDate)}` : ""}</div>
            {member.confirmationNumber && <div className="text-sm text-gray-600">Confirmation #{member.confirmationNumber}</div>}
          </div>
        </div>

        <table className="w-full text-sm mb-6">
          <tbody>
            <Row label="Cabin" value={`${member.cabinType || "—"}${cabinLabel ? ` · ${cabinLabel}` : ""}`} />
            <Row label="Guests" value={String(member.guests)} />
            {grossFare > 0 && <Row label={`Cruise fare${member.freeCruise ? "" : " (incl. taxes & fees)"}`} value={fmt$(grossFare)} />}
            {discount > 0 && <Row label="Free cruise credit (tour conductor)" value={`– ${fmt$(discount)}`} green />}
            {member.fare > 0 && member.freeCruise && <Row label="Total (incl. port, taxes & gov fees)" value={fmt$(member.fare)} strong />}
            <Row label="Deposit due" value={fmt$(reqDeposit)} />
            <Row label="Deposit received" value={fmt$(member.depositPaid)} green />
            <Row label="Balance remaining" value={fmt$(balance)} strong />
          </tbody>
        </table>

        {member.freeCruise && (
          <div className="rounded-xl bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm font-semibold mb-6">
            ✦ Free cruise applied (tour-conductor credit). The free guest still pays port expenses, taxes &amp; government fees.
          </div>
        )}

        <div className={`rounded-xl px-4 py-3 text-sm font-semibold mb-6 border ${member.paidInFull ? "bg-green-50 border-green-200 text-green-800" : member.depositPaid > 0 ? "bg-sky-50 border-sky-200 text-sky-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
          {member.paidInFull ? "✓ Paid in full — you're all set." : member.depositPaid > 0 ? "✓ Deposit received — balance due ~120 days before sailing." : "📄 Invoice sent — secure your cabin with your deposit."}
          {group.finalPaymentDate && !member.paidInFull && <span> Final payment due {fmtDate(group.finalPaymentDate)}.</span>}
        </div>

        {isAgent && (
          <div className="mb-6 rounded-xl border-2 border-red-300 bg-red-50 p-4 text-sm">
            <div className="font-extrabold text-red-700 uppercase tracking-wider text-xs mb-2">Agent details (confidential)</div>
            <table className="w-full text-sm">
              <tbody>
                {member.confirmationNumber && <tr className="border-b border-red-100"><td className="py-1 text-gray-500">Reservation #</td><td className="py-1 text-right font-semibold">{member.confirmationNumber}</td></tr>}
                <tr className="border-b border-red-100"><td className="py-1 text-gray-500">Est. commissionable fare</td><td className="py-1 text-right font-semibold">{fmt$(commissionable)}</td></tr>
                <tr className="border-b border-red-100"><td className="py-1 text-gray-500">Est. commission (10%)</td><td className="py-1 text-right font-extrabold text-green-700">{fmt$(estCommission)}</td></tr>
                <tr><td className="py-1 text-gray-500">Guests</td><td className="py-1 text-right font-semibold">{member.guests}</td></tr>
              </tbody>
            </table>
            {member.adminNotes && <div className="mt-2 text-gray-600 text-xs whitespace-pre-wrap"><span className="font-bold">Notes:</span> {member.adminNotes}</div>}
            <div className="text-[10px] text-gray-400 mt-2">Estimates only — confirm commission against the cruise-line group quote.</div>
          </div>
        )}

        <div className="border-2 border-gray-900 rounded-xl p-4 text-sm">
          <div className="font-extrabold">No card is charged online.</div>
          <div className="text-gray-600">Pay by mailed check to 3501 Winnie St, Galveston, TX 77550, or directly with the cruise line. Questions? (409) 632-2106 · Cruises from Galveston.</div>
        </div>
        <div className="text-center text-[11px] text-gray-400 mt-3 uppercase tracking-wider">{status}</div>
      </div>
    </div>
  );
}
