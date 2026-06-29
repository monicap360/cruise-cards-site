"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  type Booking,
  type BookingStatus,
  type Payment,
  type PaymentMethod,
  type PaymentStatus,
  getBooking,
  saveBooking,
  deleteBooking,
  generateId,
  fmt$,
  fmtDate,
  fmtDateShort,
  getBookingBalance,
  getTotalPaid,
  getPendingPayments,
  isOverdue,
  getNextPayment,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABEL,
  CHECK_MAILING_ADDRESS,
  CHECK_PAYABLE_TO,
} from "@/lib/sea-pay";

const todayISO = () => new Date().toISOString().split("T")[0];

const blankPayment = {
  amount: "",
  method: "check" as PaymentMethod,
  reference: "",
  payerName: "",
  cardLast4: "",
  receivedDate: todayISO(),
  note: "",
};

const PAY_STATUS_BADGE: Record<PaymentStatus, string> = {
  pending: "bg-amber-500/15 text-amber-300 border border-amber-400/25",
  cleared: "bg-green-500/15 text-green-300 border border-green-400/25",
  bounced: "bg-red-500/15 text-red-300 border border-red-400/25",
};

const STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "paid", "cancelled"];

const statusColor: Record<string, string> = {
  pending: "bg-yellow-400/15 text-yellow-300 border-yellow-400/25",
  confirmed: "bg-sky-500/15 text-sky-300 border-sky-400/25",
  paid: "bg-green-500/15 text-green-300 border-green-400/25",
  cancelled: "bg-red-500/15 text-red-300 border-red-400/25",
};

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [recording, setRecording] = useState(false);
  const [payForm, setPayForm] = useState(blankPayment);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [imported, setImported] = useState<Payment[] | null>(null);
  const [authForm, setAuthForm] = useState({
    cruiseLine: "",
    last4: "",
    date: "",
  });

  useEffect(() => {
    getBooking(id).then((b) => {
      if (!b) router.push("/admin");
      else {
        setBooking(b);
        setAuthForm({
          cruiseLine: b.ccAuthCruiseLine ?? "",
          last4: b.ccAuthLast4 ?? "",
          date: b.ccAuthDate ?? "",
        });
      }
    });
  }, [id, router]);

  async function update(patch: Partial<Booking>) {
    if (!booking) return;
    const updated = { ...booking, ...patch };
    await saveBooking(updated);
    setBooking(updated);
  }

  function markDepositPaid() {
    update({
      depositPaid: true,
      depositPaidDate: new Date().toISOString().split("T")[0],
      status: booking?.status === "pending" ? "confirmed" : booking?.status,
    });
  }

  function toggleInstallment(instId: string, paid: boolean) {
    if (!booking) return;
    const updated = booking.paymentPlan.map((p) =>
      p.id === instId
        ? { ...p, paid, paidDate: paid ? new Date().toISOString().split("T")[0] : undefined }
        : p
    );
    const balance = booking.totalPrice - (booking.depositPaid ? booking.depositAmount : 0) -
      updated.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0);
    update({
      paymentPlan: updated,
      status: balance <= 0 && booking.depositPaid ? "paid" : booking.status,
    });
  }

  async function handleDelete() {
    await deleteBooking(id);
    router.push("/admin");
  }

  function recordPayment() {
    if (!booking) return;
    const amt = parseFloat(payForm.amount);
    if (!amt || amt <= 0) return;
    // Mailed checks don't post until they clear the bank.
    const status: PaymentStatus = payForm.method === "check" ? "pending" : "cleared";
    const payment: Payment = {
      id: generateId(),
      receivedDate: payForm.receivedDate || todayISO(),
      amount: amt,
      method: payForm.method,
      status,
      clearedDate: status === "cleared" ? payForm.receivedDate || todayISO() : undefined,
      reference: payForm.reference.trim() || undefined,
      payerName: payForm.payerName.trim() || undefined,
      cardLast4: payForm.cardLast4.trim() || undefined,
      note: payForm.note.trim() || undefined,
    };
    update({ payments: [...booking.payments, payment] });
    setPayForm(blankPayment);
    setRecording(false);
  }

  function setPaymentStatus(pid: string, status: PaymentStatus) {
    if (!booking) return;
    const payments = booking.payments.map((p) =>
      p.id === pid
        ? {
            ...p,
            status,
            clearedDate: status === "cleared" ? todayISO() : undefined,
          }
        : p
    );
    const updated = { ...booking, payments };
    // Auto-mark paid in full when the cleared total covers the price.
    const fullyPaid = getBookingBalance(updated) <= 0;
    update({
      payments,
      status: fullyPaid && booking.status !== "cancelled" ? "paid" : booking.status,
    });
  }

  function removePayment(pid: string) {
    if (!booking) return;
    if (!confirm("Remove this payment record?")) return;
    update({ payments: booking.payments.filter((p) => p.id !== pid) });
  }

  async function handleImportFile(file: File) {
    setImporting(true);
    setImportError("");
    setImported(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/payment-import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setImportError(data.error || "Import failed.");
      } else {
        const items: Payment[] = (data.payments || []).map(
          (p: Record<string, unknown>) => {
            const status = (p.status as PaymentStatus) || "cleared";
            const receivedDate = (p.receivedDate as string) || todayISO();
            return {
              id: generateId(),
              receivedDate,
              amount: Number(p.amount) || 0,
              method: (p.method as PaymentMethod) || "other",
              status,
              clearedDate: status === "cleared" ? receivedDate : undefined,
              payerName: (p.payerName as string) || undefined,
              cardLast4:
                String(p.cardLast4 ?? "").replace(/\D/g, "").slice(0, 4) || undefined,
              reference: (p.reference as string) || undefined,
              note: (p.note as string) || undefined,
            };
          }
        );
        if (items.length === 0) setImportError("No payments found in that document.");
        else setImported(items);
      }
    } catch {
      setImportError("Import failed. Please try again.");
    } finally {
      setImporting(false);
    }
  }

  function addImported() {
    if (!booking || !imported) return;
    update({ payments: [...booking.payments, ...imported] });
    setImported(null);
  }

  if (!booking) return null;

  const balance = getBookingBalance(booking);
  const collected = getTotalPaid(booking);
  const pending = getPendingPayments(booking);
  const nextPayment = getNextPayment(booking);

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">
              ← All Bookings
            </Link>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">{booking.customerName}</h1>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${statusColor[booking.status]}`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-white/55 text-sm mt-1">
                {booking.bookingNumber} · {booking.ship} · Sailing {fmtDateShort(booking.sailingDate)}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                href={`/invoice/${booking.id}`}
                target="_blank"
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 text-white/80 hover:text-white font-semibold px-4 py-2 rounded-full text-sm transition-all"
              >
                📄 Invoice
              </Link>
              <Link
                href={`/admin/documents?scope=individual&email=${encodeURIComponent(booking.customerEmail)}`}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 text-white/80 hover:text-white font-semibold px-4 py-2 rounded-full text-sm transition-all"
              >
                📎 Upload Doc
              </Link>
              <Link
                href={`/receipt/${booking.id}`}
                target="_blank"
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 text-white/80 hover:text-white font-semibold px-4 py-2 rounded-full text-sm transition-all"
              >
                🧾 Receipt
              </Link>
              <Link
                href={`/contract/${booking.id}`}
                target="_blank"
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 text-white/80 hover:text-white font-semibold px-4 py-2 rounded-full text-sm transition-all"
              >
                📝 Contract
              </Link>
              <select
                value={booking.status}
                onChange={(e) => update({ status: e.target.value as BookingStatus })}
                className="bg-white/5 text-white font-bold px-4 py-2 rounded-full text-sm border border-white/15 focus:outline-none focus:border-sky-400/60"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-[#0b1020]">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Price", value: fmt$(booking.totalPrice), color: "text-holo" },
            { label: "Collected", value: fmt$(collected), color: "text-green-300" },
            { label: "Balance Due", value: fmt$(balance), color: balance > 0 ? "text-red-300" : "text-green-300" },
            { label: "Next Payment", value: nextPayment ? fmt$(nextPayment.amount) : "—", color: "text-holo" },
          ].map((c) => (
            <div key={c.label} className="bg-[#0b1020] border border-white/10 rounded-2xl p-4 text-center">
              <div className={`text-2xl font-extrabold ${c.color}`}>{c.value}</div>
              <div className="text-white/45 label-mono text-[10px] uppercase tracking-wider mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cruise Details */}
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <h2 className="font-extrabold text-white mb-4">Cruise Details</h2>
            <dl className="space-y-2 text-sm">
              {[
                ["Cruise Line", booking.cruiseLine],
                ["Ship", booking.ship],
                ["Sailing Date", fmtDate(booking.sailingDate)],
                ["Return Date", fmtDate(booking.returnDate)],
                ["Nights", `${booking.nights} nights`],
                ["Itinerary", booking.itinerary],
                ["Cabin Type", booking.cabinType],
                booking.cabinNumber ? ["Cabin #", booking.cabinNumber] : null,
                ["Guests", `${booking.numberOfGuests}`],
                ["Guest Names", booking.guestNames],
                booking.confirmationNumber ? ["Cruise Line Ref #", booking.confirmationNumber] : null,
              ]
                .filter((x): x is string[] => Array.isArray(x))
                .map((row) => (
                  <div key={row[0]} className="flex gap-2">
                    <dt className="text-white/45 w-36 flex-shrink-0">{row[0]}</dt>
                    <dd className="font-semibold text-white">{row[1]}</dd>
                  </div>
                ))}
            </dl>
          </div>

          {/* Customer Info */}
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <h2 className="font-extrabold text-white mb-4">Customer</h2>
            <dl className="space-y-2 text-sm">
              {[
                ["Name", booking.customerName],
                ["Email", booking.customerEmail],
                ["Phone", booking.customerPhone],
                booking.customerAddress ? ["Address", booking.customerAddress] : null,
                booking.agentName ? ["Agent", booking.agentName] : null,
              ]
                .filter((x): x is string[] => Array.isArray(x))
                .map((row) => (
                  <div key={row[0]} className="flex gap-2">
                    <dt className="text-white/45 w-24 flex-shrink-0">{row[0]}</dt>
                    <dd className="font-semibold text-white">{row[1]}</dd>
                  </div>
                ))}
            </dl>

            {/* Contract status */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white/55">Contract</span>
                {booking.contractSigned ? (
                  <span className="text-xs font-bold text-green-300 bg-green-500/15 border border-green-400/25 px-2 py-1 rounded-full">
                    ✅ Signed by {booking.contractSignedName} on {booking.contractSignedDate && fmtDateShort(booking.contractSignedDate)}
                  </span>
                ) : (
                  <Link
                    href={`/contract/${booking.id}`}
                    target="_blank"
                    className="text-xs font-bold text-sky-300 bg-sky-500/15 border border-sky-400/25 px-3 py-1 rounded-full hover:bg-sky-500/25"
                  >
                    Send for Signature →
                  </Link>
                )}
              </div>
            </div>

            {booking.notes && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-white/45 label-mono uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-white/55">{booking.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sea Pay Payment Schedule */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <h2 className="font-extrabold text-white mb-5">Sea Pay Payment Schedule</h2>

          {/* Deposit row */}
          <div className={`flex items-center justify-between p-4 rounded-xl mb-3 border ${
            booking.depositPaid
              ? "bg-green-500/15 border-green-400/25"
              : "bg-yellow-400/15 border-yellow-400/25"
          }`}>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={booking.depositPaid}
                onChange={() =>
                  booking.depositPaid
                    ? update({ depositPaid: false, depositPaidDate: undefined })
                    : markDepositPaid()
                }
                className="w-5 h-5 accent-green-600 cursor-pointer"
              />
              <div>
                <div className="font-bold text-white text-sm">Deposit</div>
                <div className="text-white/45 text-xs">
                  {booking.depositPaid && booking.depositPaidDate
                    ? `Received ${fmtDateShort(booking.depositPaidDate)}`
                    : "Due at booking"}
                </div>
              </div>
            </div>
            <div className="font-extrabold text-white text-lg">{fmt$(booking.depositAmount)}</div>
          </div>

          {/* Installments */}
          {booking.paymentPlan.map((inst, i) => {
            const overdue = isOverdue(inst);
            return (
              <div
                key={inst.id}
                className={`flex items-center justify-between p-4 rounded-xl mb-2 border ${
                  inst.paid
                    ? "bg-green-500/15 border-green-400/25"
                    : overdue
                    ? "bg-red-500/15 border-red-400/25"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={inst.paid}
                    onChange={() => toggleInstallment(inst.id, !inst.paid)}
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-white text-sm">
                      Payment {i + 1}
                      {overdue && (
                        <span className="ml-2 text-xs text-red-300 font-bold">⚠️ Overdue</span>
                      )}
                    </div>
                    <div className="text-white/45 text-xs">
                      Due {fmtDate(inst.dueDate)}
                      {inst.paid && inst.paidDate && ` · Received ${fmtDateShort(inst.paidDate)}`}
                    </div>
                  </div>
                </div>
                <div className="font-extrabold text-white text-lg">{fmt$(inst.amount)}</div>
              </div>
            );
          })}

          {/* Total row */}
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
            <div>
              <div className="font-extrabold text-white">
                {balance === 0 ? "✅ Paid in Full" : `${fmt$(balance)} remaining`}
              </div>
              <div className="text-white/45 text-xs">{fmt$(collected)} collected of {fmt$(booking.totalPrice)}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-holo">{fmt$(booking.totalPrice)}</div>
              <div className="text-white/45 text-xs">Total</div>
            </div>
          </div>
        </div>

        {/* Payments ledger */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="font-extrabold text-white">Payments Received</h2>
              <p className="text-white/45 text-xs">
                Record checks, in-person, or cruise-line-direct payments. Mailed
                checks post only after they clear the bank.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/receipt/${booking.id}`}
                target="_blank"
                className="border border-white/15 text-white/80 font-semibold px-4 py-2 rounded-full text-sm hover:border-white/40 hover:bg-white/5"
              >
                🧾 Receipt
              </Link>
              <label className="border border-sky-400/25 text-sky-300 font-bold px-4 py-2 rounded-full text-sm hover:bg-sky-500/15 cursor-pointer">
                {importing ? "🤖 Reading…" : "🤖 Import from Doc"}
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  className="hidden"
                  disabled={importing}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImportFile(f);
                    e.target.value = "";
                  }}
                />
              </label>
              <button
                onClick={() => setRecording((v) => !v)}
                className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-4 py-2 rounded-full text-sm"
              >
                {recording ? "Cancel" : "+ Record Payment"}
              </button>
            </div>
          </div>

          {importError && (
            <div className="bg-red-500/15 border border-red-400/30 rounded-xl px-4 py-3 text-sm text-red-300 mb-4">
              {importError}
            </div>
          )}

          {/* AI import preview */}
          {imported && (
            <div className="bg-sky-500/10 border border-sky-400/25 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="text-sm font-bold text-white">
                  ✨ Found {imported.length} payment{imported.length !== 1 ? "s" : ""} — review before adding
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setImported(null)}
                    className="border border-white/15 text-white/80 font-semibold px-4 py-1.5 rounded-full text-xs hover:border-white/40 hover:bg-white/5"
                  >
                    Discard
                  </button>
                  <button
                    onClick={addImported}
                    className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full text-xs"
                  >
                    Add {imported.length} to Ledger
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                {imported.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 flex-wrap text-xs bg-white/5 rounded-lg px-3 py-2 border border-white/10"
                  >
                    <span className="font-extrabold text-white">{fmt$(p.amount)}</span>
                    <span className="text-white/55">{PAYMENT_METHOD_LABEL[p.method]}</span>
                    {p.cardLast4 && <span className="text-white/40 font-mono">••••{p.cardLast4}</span>}
                    {p.payerName && <span className="text-white/55">{p.payerName}</span>}
                    <span className="text-white/40">{fmtDateShort(p.receivedDate)}</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${PAY_STATUS_BADGE[p.status]}`}>
                      {p.status === "pending" ? "Pending" : p.status}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-white/40 mt-2">
                AI-extracted from your document — double-check amounts and dates before adding.
              </p>
            </div>
          )}

          {/* Totals */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-500/15 border border-green-400/25 rounded-xl p-3 text-center">
              <div className="text-lg font-extrabold text-green-300">{fmt$(collected)}</div>
              <div className="text-green-300/70 text-xs font-semibold">Posted (cleared)</div>
            </div>
            <div className="bg-amber-500/15 border border-amber-400/25 rounded-xl p-3 text-center">
              <div className="text-lg font-extrabold text-amber-300">{fmt$(pending)}</div>
              <div className="text-amber-300/70 text-xs font-semibold">Pending clearance</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className={`text-lg font-extrabold ${balance > 0 ? "text-red-300" : "text-green-300"}`}>
                {fmt$(balance)}
              </div>
              <div className="text-white/45 text-xs font-semibold">Balance due</div>
            </div>
          </div>

          {/* Record form */}
          {recording && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Amount *</label>
                  <input
                    type="number"
                    value={payForm.amount}
                    onChange={(e) => setPayForm((f) => ({ ...f, amount: e.target.value }))}
                    placeholder="500.00"
                    min="0"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                </div>
                <div>
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Method</label>
                  <select
                    value={payForm.method}
                    onChange={(e) => setPayForm((f) => ({ ...f, method: e.target.value as PaymentMethod }))}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400/60"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m.value} value={m.value} className="bg-[#0b1020]">{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">
                    {payForm.method === "check" ? "Check #" : "Reference"}
                  </label>
                  <input
                    value={payForm.reference}
                    onChange={(e) => setPayForm((f) => ({ ...f, reference: e.target.value }))}
                    placeholder="Optional"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                </div>
                <div>
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Date received</label>
                  <input
                    type="date"
                    value={payForm.receivedDate}
                    onChange={(e) => setPayForm((f) => ({ ...f, receivedDate: e.target.value }))}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Passenger / payer name</label>
                  <input
                    value={payForm.payerName}
                    onChange={(e) => setPayForm((f) => ({ ...f, payerName: e.target.value }))}
                    placeholder="Who paid"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Card last 4 (if card)</label>
                  <input
                    value={payForm.cardLast4}
                    maxLength={4}
                    onChange={(e) =>
                      setPayForm((f) => ({
                        ...f,
                        cardLast4: e.target.value.replace(/\D/g, "").slice(0, 4),
                      }))
                    }
                    placeholder="1234"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                </div>
              </div>

              {payForm.method === "check" && (
                <div className="mt-3 bg-amber-500/15 border border-amber-400/25 rounded-xl px-4 py-3 text-xs text-amber-200">
                  ⚠️ This check will be logged as <strong>Pending</strong> and will{" "}
                  <strong>not post to the balance until you mark it cleared</strong>{" "}
                  after it clears the bank. Checks payable to{" "}
                  <strong>{CHECK_PAYABLE_TO}</strong>, mailed to{" "}
                  <strong>{CHECK_MAILING_ADDRESS}</strong>.
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={recordPayment}
                  disabled={!payForm.amount}
                  className="bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 font-semibold uppercase tracking-wider px-5 py-2 rounded-full text-sm"
                >
                  {payForm.method === "check" ? "Log Pending Check" : "Record Payment"}
                </button>
              </div>
            </div>
          )}

          {/* Payment list */}
          {booking.payments.length === 0 ? (
            <p className="text-white/45 text-sm text-center py-4">
              No payments recorded yet.
            </p>
          ) : (
            <div className="space-y-2">
              {[...booking.payments]
                .sort((a, b) => b.receivedDate.localeCompare(a.receivedDate))
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-xl border border-white/10 bg-white/5"
                  >
                    <div className="flex items-center gap-3 flex-wrap text-sm">
                      <span className="font-extrabold text-white text-base">{fmt$(p.amount)}</span>
                      <span className="text-white/55">{PAYMENT_METHOD_LABEL[p.method]}</span>
                      {p.cardLast4 && (
                        <span className="text-white/40 font-mono text-xs">••••{p.cardLast4}</span>
                      )}
                      {p.payerName && (
                        <span className="text-white/55 text-xs">{p.payerName}</span>
                      )}
                      {p.reference && (
                        <span className="text-white/40 font-mono text-xs">#{p.reference}</span>
                      )}
                      <span className="text-white/40 text-xs">
                        Received {fmtDateShort(p.receivedDate)}
                        {p.status === "cleared" && p.clearedDate
                          ? ` · Cleared ${fmtDateShort(p.clearedDate)}`
                          : ""}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${PAY_STATUS_BADGE[p.status]}`}>
                        {p.status === "pending" ? "Pending clearance" : p.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.status === "pending" && (
                        <>
                          <button
                            onClick={() => setPaymentStatus(p.id, "cleared")}
                            className="bg-green-500/15 border border-green-400/25 hover:bg-green-500/25 text-green-300 text-xs font-bold px-3 py-1.5 rounded-full"
                          >
                            Mark Cleared
                          </button>
                          <button
                            onClick={() => setPaymentStatus(p.id, "bounced")}
                            className="bg-red-500/15 border border-red-400/25 hover:bg-red-500/25 text-red-300 text-xs font-bold px-3 py-1.5 rounded-full"
                          >
                            Bounced
                          </button>
                        </>
                      )}
                      {p.status === "bounced" && (
                        <button
                          onClick={() => setPaymentStatus(p.id, "pending")}
                          className="bg-amber-500/15 border border-amber-400/25 hover:bg-amber-500/25 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full"
                        >
                          Reopen
                        </button>
                      )}
                      <button
                        onClick={() => removePayment(p.id)}
                        className="text-red-300 hover:text-red-200 text-xs font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Consent & Authorization (chargeback evidence — no card data stored) */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="font-extrabold text-white">Consent &amp; Authorization</h2>
            <p className="text-white/45 text-xs">
              Dispute evidence. We never store card numbers, security codes, or
              card images.
            </p>
          </div>

          {/* Terms acceptance evidence */}
          <div className="rounded-xl border border-white/10 p-4 bg-white/5">
            <div className="text-xs font-bold text-white/45 uppercase tracking-wide mb-2">
              Terms acceptance
            </div>
            {booking.contractSigned ? (
              <div className="text-sm text-white/70">
                <span className="inline-block bg-green-500/15 text-green-300 border border-green-400/25 text-xs font-bold px-2 py-0.5 rounded-full mr-2">
                  ✅ Accepted
                </span>
                <span className="font-bold text-white">
                  {booking.contractSignedName}
                </span>
                <div className="text-white/55 text-xs mt-1">
                  {booking.contractSignedAt
                    ? new Date(booking.contractSignedAt).toLocaleString("en-US")
                    : booking.contractSignedDate
                      ? fmtDateShort(booking.contractSignedDate)
                      : ""}
                  {booking.contractSignedIp ? ` · IP ${booking.contractSignedIp}` : ""}
                  {booking.termsVersion ? ` · Terms ${booking.termsVersion}` : ""}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-white/55">
                  Not yet accepted — have the customer e-sign the agreement.
                </span>
                <Link
                  href={`/contract/${booking.id}`}
                  target="_blank"
                  className="text-xs font-bold text-sky-300 bg-sky-500/15 border border-sky-400/25 px-3 py-1.5 rounded-full hover:bg-sky-500/25"
                >
                  Open Agreement →
                </Link>
              </div>
            )}
          </div>

          {/* Cruise-line card authorization on file (reference only) */}
          <div className="rounded-xl border border-white/10 p-4">
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={booking.ccAuthOnFile ?? false}
                onChange={(e) => update({ ccAuthOnFile: e.target.checked })}
                className="w-5 h-5 accent-sky-500"
              />
              <span className="font-bold text-white text-sm">
                Cruise-line card authorization on file
              </span>
            </label>
            {booking.ccAuthOnFile && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">
                      Cruise line
                    </label>
                    <input
                      value={authForm.cruiseLine}
                      onChange={(e) =>
                        setAuthForm((f) => ({ ...f, cruiseLine: e.target.value }))
                      }
                      placeholder="Carnival"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                    />
                  </div>
                  <div>
                    <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">
                      Card last 4
                    </label>
                    <input
                      value={authForm.last4}
                      maxLength={4}
                      onChange={(e) =>
                        setAuthForm((f) => ({
                          ...f,
                          last4: e.target.value.replace(/\D/g, "").slice(0, 4),
                        }))
                      }
                      placeholder="1234"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                    />
                  </div>
                  <div>
                    <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">
                      Auth date
                    </label>
                    <input
                      type="date"
                      value={authForm.date}
                      onChange={(e) =>
                        setAuthForm((f) => ({ ...f, date: e.target.value }))
                      }
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-[11px] text-amber-300">
                    ⚠️ Reference only — never enter the full card number, security
                    code, or card photos.
                  </p>
                  <button
                    onClick={() =>
                      update({
                        ccAuthCruiseLine: authForm.cruiseLine.trim(),
                        ccAuthLast4: authForm.last4.trim(),
                        ccAuthDate: authForm.date,
                      })
                    }
                    className="bg-white text-black hover:bg-white/90 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-[#0b1020] border border-red-400/20 rounded-2xl p-6">
          <h2 className="font-extrabold text-red-300 mb-3">Danger Zone</h2>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-sm text-red-300 border border-red-400/25 px-4 py-2 rounded-xl hover:bg-red-500/15 font-semibold"
            >
              Delete Booking
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm text-red-300 font-semibold">Are you sure? This cannot be undone.</p>
              <button
                onClick={handleDelete}
                className="bg-red-500/15 border border-red-400/30 text-red-300 hover:bg-red-500/25 font-bold px-4 py-2 rounded-xl text-sm"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 font-semibold px-4 py-2 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
