"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { type GroupMember, type Group, getMemberById } from "@/lib/groups";
import { supabase } from "@/lib/supabase";
import { type Payment, getPayments, addPayment, deletePayment, newPaymentId } from "@/lib/payments";
import { PAYMENT_METHODS } from "@/lib/reservations";
import { PAYPAL_ME, paypalLink } from "@/lib/paypal";

const money = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const when = (t?: string) => (t ? new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "");

export default function FolioPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [member, setMember] = useState<GroupMember | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [cabin, setCabin] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [amt, setAmt] = useState("");
  const [method, setMethod] = useState<string>("Cash");
  const [note, setNote] = useState("");

  async function load() {
    const res = await getMemberById(id);
    if (res) { setMember(res.member); setGroup(res.group); setCabin(res.cabinLabel); }
    setPayments(await getPayments(id));
    setLoading(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  if (loading) return <div className="min-h-screen bg-[#05070d] text-white/50 flex items-center justify-center">Loading folio…</div>;
  if (!member || !group) return <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center">Reservation not found.</div>;

  const fare = member.fare || 0;
  const paid = member.depositPaid || 0;
  const balance = member.paidInFull ? 0 : Math.max(0, fare - paid);

  async function record() {
    const a = Number(amt);
    if (!a || a <= 0) return;
    await addPayment({ id: newPaymentId(), memberId: id, amount: a, method, note });
    const newPaid = paid + a;
    await supabase.from("group_members").update({ deposit_paid: newPaid, paid_in_full: newPaid >= fare }).eq("id", id);
    setAmt(""); setNote("");
    await load();
  }
  async function removePay(p: Payment) {
    if (!confirm("Remove this payment?")) return;
    await deletePayment(p.id);
    await supabase.from("group_members").update({ deposit_paid: Math.max(0, paid - p.amount), paid_in_full: false }).eq("id", id);
    await load();
  }

  const inp = "bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400/60";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-5">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">{"// Guest Folio"}</div>
          <Link href="/admin/groups" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Groups</Link>
        </div>

        {/* Header */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 mb-5">
          <h1 className="text-2xl font-extrabold">{member.name}</h1>
          <div className="text-white/55 text-sm mt-1">{group.name} · {group.ship}{group.sailingDate ? ` · ${group.sailingDate}` : ""}</div>
          <div className="text-white/40 text-xs mt-0.5">{member.cabinType}{cabin ? ` · ${cabin}` : ""}{member.confirmationNumber ? ` · #${member.confirmationNumber}` : ""} · {member.guests} guests</div>
        </div>

        {/* Statement */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 mb-5">
          <div className="flex justify-between text-sm mb-2"><span className="text-white/60">Cruise fare</span><span className="font-mono">{money(fare)}</span></div>
          <div className="flex justify-between text-sm mb-3"><span className="text-white/60">Total paid</span><span className="font-mono text-green-300">−{money(paid)}</span></div>
          <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
            <span className="font-bold">Balance due</span>
            <span className={`text-2xl font-extrabold ${balance > 0 ? "text-amber-300" : "text-green-300"}`}>{balance > 0 ? money(balance) : "Paid in full ✓"}</span>
          </div>
          {balance > 0 && PAYPAL_ME && (
            <a href={paypalLink(balance)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block bg-white text-[#0070ba] hover:bg-white/90 font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">💸 PayPal {money(balance)}</a>
          )}
        </div>

        {/* Payments ledger */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <div className="font-bold text-sm mb-3">Payments</div>
          {payments.length === 0 ? (
            <div className="text-white/40 text-sm mb-4">No itemized payments recorded yet{paid > 0 ? ` (total on file: ${money(paid)})` : ""}.</div>
          ) : (
            <div className="space-y-1.5 mb-4">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-white/50 text-xs">{when(p.createdAt)}</span>
                  <span className="flex-1 text-white/70">{p.method}{p.note ? ` · ${p.note}` : ""}</span>
                  <span className="font-mono text-green-300">{money(p.amount)}</span>
                  <button onClick={() => removePay(p)} className="text-red-300/60 hover:text-red-200 text-xs">×</button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 flex-wrap border-t border-white/10 pt-3">
            <input className={`${inp} w-28`} placeholder="$ amount" inputMode="decimal" value={amt} onChange={(e) => setAmt(e.target.value)} />
            <select className={inp} value={method} onChange={(e) => setMethod(e.target.value)}>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m} className="bg-[#0b1020]">{m}</option>)}
            </select>
            <input className={`${inp} flex-1 min-w-32`} placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            <button onClick={record} className="bg-sky-600 hover:bg-sky-500 text-white font-bold uppercase tracking-wider text-[11px] px-4 rounded-lg">Record payment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
