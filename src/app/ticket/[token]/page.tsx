import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import TicketGate from "@/components/TicketGate";
import TicketThread from "@/components/TicketThread";
import { getTicketByToken } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export default async function TicketPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ pin?: string }>;
}) {
  const { token } = await params;
  const { pin } = await searchParams;
  const ticket = await getTicketByToken(token);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900">Ticket not found</h1>
        <p className="text-gray-500">This link may have expired. Call (409) 632-2106.</p>
      </div>
    );
  }

  const authed = (pin || "").trim() === ticket.pin;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-center mb-5"><span className="bg-white rounded-xl px-4 py-3 shadow-sm inline-flex"><BrandLogo /></span></div>

        {!authed ? (
          <TicketGate subject={ticket.subject} />
        ) : (
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden text-gray-900">
            <div className="bg-gradient-to-br from-sky-600 to-blue-800 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-widest text-sky-200">Support Ticket</div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${ticket.status === "Open" ? "bg-green-400/20 text-green-100" : "bg-white/20 text-white"}`}>{ticket.status}</span>
              </div>
              <h1 className="text-2xl font-extrabold mt-1">{ticket.subject}</h1>
              {ticket.customerName && <div className="text-sky-100 text-sm mt-1">{ticket.customerName}</div>}
            </div>
            <div className="p-6">
              <TicketThread ticketId={ticket.id} sender="guest" light disabled={ticket.status === "Closed"} />
            </div>
          </div>
        )}

        <p className="text-center text-gray-400 text-xs mt-5">
          Cruises from Galveston · (409) 632-2106 · <Link href="/" className="underline">cruisesfromgalveston.net</Link>
        </p>
      </div>
    </div>
  );
}
