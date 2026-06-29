import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import PrintButton from "@/components/PrintButton";
import { fmt$, fmtDate } from "@/lib/sea-pay";
import { getMemberById, memberBalance } from "@/lib/groups";

export const dynamic = "force-dynamic";

export default async function GroupReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getMemberById(id);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#05070d] text-white flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-extrabold">Receipt not found</h1>
        <Link href="/admin/groups" className="text-sky-400 hover:text-sky-300 font-semibold">← Back to Groups</Link>
      </div>
    );
  }

  const { member, group, cabinLabel } = data;
  const balance = memberBalance(member);
  const receiptNo = "RCPT-" + id.slice(-6).toUpperCase();
  const subject = `Your deposit receipt — ${group.name}`;
  const body =
    `Hi ${member.name.split(" ")[0] || "there"},\n\n` +
    `Thank you! We've applied your deposit of ${fmt$(member.depositPaid)} for the ${group.name} ` +
    `(${group.ship}${group.sailingDate ? `, sailing ${group.sailingDate}` : ""}).\n` +
    `Receipt #${receiptNo}. ${member.confirmationNumber ? `Confirmation #${member.confirmationNumber}. ` : ""}` +
    `Your balance is due about 120 days before sailing — pay by mailed check to 3501 Winnie St, Galveston, TX 77550 or directly with the cruise line.\n\n` +
    `Cruises from Galveston · (409) 632-2106`;

  return (
    <div className="bg-gray-200 min-h-screen py-8 print:bg-white print:py-0">
      {/* Action bar */}
      <div className="print:hidden max-w-[8.5in] mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 px-4">
        <Link href="/admin/groups" className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 font-semibold uppercase tracking-wider text-xs px-4 py-2.5 rounded-full">← Groups</Link>
        <div className="flex gap-2">
          {member.email && (
            <a
              href={`mailto:${encodeURIComponent(member.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
              className="bg-sky-600 text-white hover:bg-sky-500 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full"
            >
              📧 Email receipt
            </a>
          )}
          <PrintButton className="bg-gray-900 text-white hover:bg-gray-800 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full" />
        </div>
      </div>

      {/* Receipt sheet */}
      <div className="bg-white text-gray-900 max-w-[8.5in] mx-auto border border-gray-300 print:border-0 p-8">
        <div className="flex items-start justify-between border-b-2 border-gray-900 pb-4 mb-6">
          <div>
            <BrandLogo />
            <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Cruise Experience Center</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold uppercase tracking-tight">Receipt</div>
            <div className="text-sm text-gray-500">#{receiptNo}</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Received from</div>
            <div className="font-bold">{member.name}</div>
            {member.email && <div className="text-sm text-gray-600">{member.email}</div>}
            {member.phone && <div className="text-sm text-gray-600">{member.phone}</div>}
          </div>
          <div className="sm:text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Group</div>
            <div className="font-bold">{group.name}</div>
            <div className="text-sm text-gray-600">{group.ship}</div>
            {group.sailingDate && <div className="text-sm text-gray-600">Sails {fmtDate(group.sailingDate)}</div>}
          </div>
        </div>

        <table className="w-full text-sm mb-6">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-500">Cabin</td>
              <td className="py-2 text-right font-semibold">{member.cabinType || "—"}{cabinLabel ? ` · ${cabinLabel}` : ""}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-500">Guests</td>
              <td className="py-2 text-right font-semibold">{member.guests}</td>
            </tr>
            {member.confirmationNumber && (
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-500">Confirmation #</td>
                <td className="py-2 text-right font-semibold">{member.confirmationNumber}</td>
              </tr>
            )}
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-500">Deposit received</td>
              <td className="py-2 text-right font-extrabold text-green-700">{fmt$(member.depositPaid)}</td>
            </tr>
            {member.fare > 0 && (
              <tr className="border-b-2 border-gray-900">
                <td className="py-2 font-bold">Balance remaining</td>
                <td className="py-2 text-right font-extrabold">{fmt$(balance)}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="rounded-xl bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm font-semibold mb-4">
          ✓ Deposit received — your cabin is held. {member.paidInFull ? "Paid in full." : "Balance due ~120 days before sailing."}
        </div>

        {member.notes && (
          <div className="mb-6 text-xs text-gray-500 border border-gray-200 rounded-xl px-4 py-3">
            <span className="font-bold uppercase tracking-wider text-gray-400">Payment detail</span>
            <div className="mt-1 text-gray-600">{member.notes}</div>
          </div>
        )}

        <div className="border-2 border-gray-900 rounded-xl p-4 text-sm">
          <div className="font-extrabold">No card is charged online.</div>
          <div className="text-gray-600">Pay your balance by mailed check to 3501 Winnie St, Galveston, TX 77550, or directly with the cruise line. Questions? (409) 632-2106 · Cruises from Galveston.</div>
        </div>
      </div>
    </div>
  );
}
