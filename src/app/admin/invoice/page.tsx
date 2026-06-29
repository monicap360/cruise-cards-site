"use client";

import Link from "next/link";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";

type Line = { desc: string; amount: number };

function fmt$(n: number) {
  return "$" + (n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const AGENCY = {
  name: "Cruises from Galveston",
  addr: "3501 Winnie St, Galveston, TX 77550",
  phone: "(409) 632-2106",
  email: "cruisesfromgalveston.texas@gmail.com",
};

export default function AdminInvoicePage() {
  const [docType, setDocType] = useState("Invoice");
  const [number, setNumber] = useState("CFG-" + Math.random().toString(36).toUpperCase().slice(2, 8));
  const [date, setDate] = useState("");
  const [cust, setCust] = useState({ name: "", email: "", phone: "" });
  const [cruise, setCruise] = useState({ ship: "", sailDate: "", cabin: "", guests: "", conf: "" });
  const [lines, setLines] = useState<Line[]>([
    { desc: "Cruise fare", amount: 0 },
    { desc: "Taxes & port fees", amount: 0 },
  ]);
  const [paid, setPaid] = useState(0);
  const [finalDue, setFinalDue] = useState("");
  const [notes, setNotes] = useState("");

  const subtotal = lines.reduce((s, l) => s + (l.amount || 0), 0);
  const balance = Math.max(0, subtotal - paid);

  const setC = (p: Partial<typeof cust>) => setCust((s) => ({ ...s, ...p }));
  const setCr = (p: Partial<typeof cruise>) => setCruise((s) => ({ ...s, ...p }));
  const setLine = (i: number, p: Partial<Line>) =>
    setLines((s) => s.map((l, idx) => (idx === i ? { ...l, ...p } : l)));

  function emailHref() {
    const body = [
      `${docType} ${number} — ${AGENCY.name}`,
      "",
      `Guest: ${cust.name}`,
      cruise.ship ? `Cruise: ${cruise.ship}${cruise.sailDate ? ` · sails ${cruise.sailDate}` : ""}` : "",
      cruise.conf ? `Confirmation: ${cruise.conf}` : "",
      "",
      ...lines.filter((l) => l.desc).map((l) => `  ${l.desc}: ${fmt$(l.amount)}`),
      `  Total: ${fmt$(subtotal)}`,
      `  Paid: ${fmt$(paid)}`,
      `  Balance due: ${fmt$(balance)}`,
      finalDue ? `  Final payment due: ${finalDue}` : "",
      "",
      `Questions? Call ${AGENCY.phone}.`,
      `— ${AGENCY.name}`,
    ].filter(Boolean).join("\n");
    return `mailto:${encodeURIComponent(cust.email)}?subject=${encodeURIComponent(
      `${docType} ${number} — ${AGENCY.name}`
    )}&body=${encodeURIComponent(body)}`;
  }

  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls (not printed) */}
        <div className="print:hidden">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Invoice / Receipt</h1>
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
          </div>

          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6 mb-6 grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="sm:col-span-2"><label className={lbl}>Document</label><select className={input} value={docType} onChange={(e) => setDocType(e.target.value)}><option className="bg-[#0b1020]">Invoice</option><option className="bg-[#0b1020]">Booking Confirmation</option><option className="bg-[#0b1020]">Receipt</option></select></div>
            <div className="sm:col-span-2"><label className={lbl}>Number</label><input className={input} value={number} onChange={(e) => setNumber(e.target.value)} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Date</label><input type="date" className={input} value={date} onChange={(e) => setDate(e.target.value)} /></div>

            <div className="sm:col-span-2"><label className={lbl}>Customer name</label><input className={input} value={cust.name} onChange={(e) => setC({ name: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Email</label><input className={input} value={cust.email} onChange={(e) => setC({ email: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Phone</label><input className={input} value={cust.phone} onChange={(e) => setC({ phone: e.target.value })} /></div>

            <div className="sm:col-span-2"><label className={lbl}>Ship</label><input className={input} value={cruise.ship} onChange={(e) => setCr({ ship: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Sail date</label><input type="date" className={input} value={cruise.sailDate} onChange={(e) => setCr({ sailDate: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Confirmation #</label><input className={input} value={cruise.conf} onChange={(e) => setCr({ conf: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Cabin</label><input className={input} value={cruise.cabin} onChange={(e) => setCr({ cabin: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Guests</label><input className={input} value={cruise.guests} onChange={(e) => setCr({ guests: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Final payment due</label><input type="date" className={input} value={finalDue} onChange={(e) => setFinalDue(e.target.value)} /></div>

            <div className="sm:col-span-6">
              <label className={lbl}>Charges</label>
              {lines.map((l, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className={input} value={l.desc} onChange={(e) => setLine(i, { desc: e.target.value })} placeholder="Description" />
                  <input type="number" className={`${input} w-40`} value={l.amount || ""} onChange={(e) => setLine(i, { amount: Number(e.target.value) })} placeholder="0.00" />
                  <button onClick={() => setLines((s) => s.filter((_, idx) => idx !== i))} className="text-red-300 font-bold px-2 hover:text-red-200">×</button>
                </div>
              ))}
              <button onClick={() => setLines((s) => [...s, { desc: "", amount: 0 }])} className="text-sky-400 font-bold text-sm hover:text-sky-300">+ Add line</button>
            </div>
            <div className="sm:col-span-2"><label className={lbl}>Amount paid ($)</label><input type="number" className={input} value={paid || ""} onChange={(e) => setPaid(Number(e.target.value))} /></div>
            <div className="sm:col-span-4"><label className={lbl}>Notes</label><input className={input} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Deposit received, thank you!" /></div>
          </div>

          <div className="flex gap-3 mb-8">
            <button onClick={() => window.print()} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-6 py-2.5 rounded-full">🖨 Print / Save PDF</button>
            <a href={emailHref()} className="border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 font-semibold text-sm px-6 py-2.5 rounded-full">✉ Email customer</a>
          </div>
        </div>

        {/* ── Printable invoice ── */}
        <div id="invoice" className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 print:border-0 print:rounded-none print:p-0">
          <div className="flex items-start justify-between flex-wrap gap-4 border-b border-gray-200 pb-6">
            <div>
              <BrandLogo />
              <div className="text-gray-500 text-xs mt-3 leading-relaxed">
                {AGENCY.addr}<br />
                {AGENCY.phone} · {AGENCY.email}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold uppercase tracking-tight text-[#0a1f44]">{docType}</div>
              <div className="text-gray-500 text-sm mt-1">#{number}</div>
              {date && <div className="text-gray-500 text-sm">{date}</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
            <div>
              <div className="text-[11px] font-bold uppercase text-gray-400 mb-1">Bill to</div>
              <div className="font-bold text-gray-900">{cust.name || "—"}</div>
              <div className="text-gray-500 text-sm">{cust.email}</div>
              <div className="text-gray-500 text-sm">{cust.phone}</div>
            </div>
            <div className="sm:text-right">
              <div className="text-[11px] font-bold uppercase text-gray-400 mb-1">Cruise</div>
              <div className="font-bold text-gray-900">{cruise.ship || "—"}</div>
              <div className="text-gray-500 text-sm">{cruise.sailDate && `Sails ${cruise.sailDate}`}</div>
              <div className="text-gray-500 text-sm">{cruise.cabin}{cruise.guests ? ` · ${cruise.guests} guests` : ""}</div>
              {cruise.conf && <div className="text-gray-500 text-sm">Conf #{cruise.conf}</div>}
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-gray-200 text-gray-400 text-[11px] uppercase">
                <th className="text-left py-2 font-bold">Description</th>
                <th className="text-right py-2 font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.filter((l) => l.desc || l.amount).map((l, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2.5 text-gray-700">{l.desc}</td>
                  <td className="py-2.5 text-right text-gray-900">{fmt$(l.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-5">
            <div className="w-full sm:w-72 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-gray-900">{fmt$(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Paid</span><span className="font-bold text-green-700">−{fmt$(paid)}</span></div>
              <div className="flex justify-between border-t border-gray-300 pt-2 text-base">
                <span className="font-extrabold text-[#0a1f44]">Balance due</span>
                <span className="font-extrabold text-[#0a1f44]">{fmt$(balance)}</span>
              </div>
              {finalDue && <div className="text-gray-500 text-xs text-right pt-1">Final payment due {finalDue}</div>}
            </div>
          </div>

          {notes && <div className="mt-6 text-gray-500 text-sm border-t border-gray-200 pt-4">{notes}</div>}

          <div className="mt-8 text-center text-gray-400 text-xs">
            Thank you for booking with {AGENCY.name}. {AGENCY.phone}
          </div>
        </div>
      </div>
    </div>
  );
}
