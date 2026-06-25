"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  buildCustomPlan,
  SEA_PAY_ENROLLMENT_FEE,
  SEA_PAY_LATE_FEE,
  fmt$,
  fmtDate,
  type PlanFrequency,
} from "@/lib/sea-pay";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const FREQ_OPTIONS: { value: PlanFrequency; label: string; sub: string }[] = [
  { value: "weekly", label: "Weekly", sub: "Every 7 days" },
  { value: "biweekly", label: "Bi-Weekly", sub: "Every 14 days" },
  { value: "monthly", label: "Monthly", sub: "Once a month" },
  { value: "custom", label: "Custom Dates", sub: "You pick each date" },
];

function nextWeekday(dayIndex: number): string {
  const d = new Date();
  d.setDate(d.getDate() + ((dayIndex - d.getDay() + 7) % 7 || 7));
  return d.toISOString().split("T")[0];
}

function PlanBuilder() {
  const params = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    ship: params.get("ship") ?? "",
    sailingDate: "",
    totalPrice: "",
    depositAmount: "",
    frequency: "biweekly" as PlanFrequency,
    startDate: "",
    preferredDay: 5, // Friday
    monthlyDay: 1,
    customDates: [] as string[],
    newCustomDate: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const total = parseFloat(form.totalPrice) || 0;
  const deposit = parseFloat(form.depositAmount) || 0;

  const firstPaymentDate =
    form.frequency === "weekly" || form.frequency === "biweekly"
      ? nextWeekday(form.preferredDay)
      : form.frequency === "monthly"
      ? form.startDate
      : "";

  const plan =
    total > 0 && deposit >= 0 && form.sailingDate && (firstPaymentDate || form.frequency === "custom")
      ? buildCustomPlan(
          total,
          deposit,
          form.sailingDate,
          form.frequency,
          firstPaymentDate,
          form.frequency === "custom" ? form.customDates : undefined
        )
      : [];

  const totalWithFee = total + SEA_PAY_ENROLLMENT_FEE;

  useEffect(() => {
    if (form.frequency === "monthly" && !form.startDate) {
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      d.setDate(form.monthlyDay);
      set("startDate", d.toISOString().split("T")[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.frequency]);

  function addCustomDate() {
    if (!form.newCustomDate || form.customDates.includes(form.newCustomDate)) return;
    set("customDates", [...form.customDates, form.newCustomDate].sort());
    set("newCustomDate", "");
  }

  function removeCustomDate(d: string) {
    set("customDates", form.customDates.filter((x) => x !== d));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("sea_pay_requests").insert({
      id: Math.random().toString(36).substring(2),
      customer_name: form.name,
      customer_email: form.email,
      ship: form.ship,
      sailing_date: form.sailingDate,
      total_price: total,
      deposit_amount: deposit,
      frequency: form.frequency,
      payment_schedule: plan,
      enrollment_fee: SEA_PAY_ENROLLMENT_FEE,
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#05070d] flex items-center justify-center px-4">
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-10 max-w-md w-full text-center">
          <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] text-white mb-2">Sea Pay Plan Requested</h2>
          <p className="text-white/55 mb-4">
            Your custom payment plan for <span className="font-bold text-white">{form.ship}</span> has been submitted.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-sm text-left">
            <div className="text-white font-bold mb-1">What happens next:</div>
            <ul className="text-white/55 space-y-1 list-disc list-inside">
              <li>A specialist will review your plan within 24 hours</li>
              <li>You&apos;ll receive a contract to sign</li>
              <li>Pay your deposit to lock in your cabin</li>
              <li>The {fmt$(SEA_PAY_ENROLLMENT_FEE)} Sea Pay fee is added to your first installment</li>
            </ul>
          </div>
          <Link href="/" className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-3 rounded-full transition-all inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d]">
      {/* Header */}
      <div className="bg-[#05070d] text-white relative overflow-hidden grid-bg py-14">
        <div className="aurora bg-sky-500 opacity-[0.14]" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">{"// Sea Pay Plan Builder"}</div>
          <h1 className="text-4xl font-extrabold uppercase tracking-[-0.01em] mb-3">Build Your Own Payment Plan</h1>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            Choose your schedule — weekly, bi-weekly, or pick your own dates. You set the pace.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs font-bold">
            <span className="bg-white/5 border border-white/15 px-3 py-1.5 rounded-full text-white/70">
              {fmt$(SEA_PAY_ENROLLMENT_FEE)} one-time Sea Pay fee
            </span>
            <span className="bg-white/5 border border-white/15 px-3 py-1.5 rounded-full text-white/70">
              {fmt$(SEA_PAY_LATE_FEE)} late fee if you miss a payment
            </span>
            <span className="bg-white/5 border border-white/15 px-3 py-1.5 rounded-full text-white/70">
              Final payment due 60 days before sailing
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Cruise details */}
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <h2 className="font-extrabold uppercase tracking-[-0.01em] text-white text-lg mb-4">Your Cruise</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  Ship / Cruise Line <span className="text-sky-400">*</span>
                </label>
                <input
                  value={form.ship}
                  onChange={(e) => set("ship", e.target.value)}
                  required
                  placeholder="e.g. Carnival Jubilee"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">
                    Sailing Date <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.sailingDate}
                    onChange={(e) => set("sailingDate", e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">
                    Estimated Total Price <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.totalPrice}
                    onChange={(e) => set("totalPrice", e.target.value)}
                    required
                    placeholder="2498.00"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  Deposit Amount <span className="text-sky-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.depositAmount}
                  onChange={(e) => set("depositAmount", e.target.value)}
                  required
                  placeholder="500.00"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                />
              </div>
            </div>
          </div>

          {/* Frequency picker */}
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <h2 className="font-extrabold uppercase tracking-[-0.01em] text-white text-lg mb-4">How Often Do You Want to Pay?</h2>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {FREQ_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("frequency", opt.value)}
                  className={`rounded-xl border p-4 text-left font-bold transition-all ${
                    form.frequency === opt.value
                      ? "border-sky-400/70 bg-sky-400/10 text-white"
                      : "border-white/15 hover:border-white/40 bg-white/5 text-white/70"
                  }`}
                >
                  <div className="font-extrabold">{opt.label}</div>
                  <div className="text-xs mt-0.5 opacity-75">{opt.sub}</div>
                </button>
              ))}
            </div>

            {/* Day picker for weekly / biweekly */}
            {(form.frequency === "weekly" || form.frequency === "biweekly") && (
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Which day of the week?
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day, i) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => set("preferredDay", i)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        form.preferredDay === i
                          ? "bg-sky-400/10 border-sky-400/70 text-white"
                          : "bg-white/5 border-white/15 text-white/70 hover:border-white/40"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-white/45 text-xs mt-2">
                  First payment: {nextWeekday(form.preferredDay) ? fmtDate(nextWeekday(form.preferredDay)) : "—"}
                </p>
              </div>
            )}

            {/* Monthly date picker */}
            {form.frequency === "monthly" && (
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Which day of the month?
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        set("monthlyDay", d);
                        const next = new Date();
                        next.setMonth(next.getMonth() + 1);
                        next.setDate(d);
                        set("startDate", next.toISOString().split("T")[0]);
                      }}
                      className={`w-9 h-9 rounded-full text-xs font-bold transition-all border ${
                        form.monthlyDay === d
                          ? "bg-sky-400/10 border-sky-400/70 text-white"
                          : "bg-white/5 border-white/15 text-white/70 hover:border-white/40"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom dates */}
            {form.frequency === "custom" && (
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Add your payment dates
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="date"
                    value={form.newCustomDate}
                    onChange={(e) => set("newCustomDate", e.target.value)}
                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                  <button
                    type="button"
                    onClick={addCustomDate}
                    disabled={!form.newCustomDate}
                    className="bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 font-semibold uppercase tracking-wider text-sm px-4 py-2 rounded-xl transition-all"
                  >
                    + Add
                  </button>
                </div>
                {form.customDates.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {form.customDates.map((d) => (
                      <span key={d} className="flex items-center gap-1 bg-sky-400/10 border border-sky-400/20 text-sky-300 text-xs font-bold px-3 py-1.5 rounded-full">
                        {fmtDate(d)}
                        <button type="button" onClick={() => removeCustomDate(d)} className="ml-1 text-sky-400 hover:text-white">✕</button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/45 text-xs">No dates added yet. Pick dates above.</p>
                )}
              </div>
            )}
          </div>

          {/* Live schedule preview */}
          {plan.length > 0 && total > 0 && (
            <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white">Your Payment Schedule</h3>
                <span className="text-xs font-bold text-sky-300 bg-sky-400/10 border border-sky-400/20 px-3 py-1 rounded-full">
                  {plan.length} payment{plan.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                <div className="flex justify-between text-sm py-1.5 border-b border-white/10">
                  <span className="text-white/55">Deposit (at booking)</span>
                  <span className="font-bold text-white">{fmt$(deposit)}</span>
                </div>
                {plan.map((p, i) => (
                  <div key={p.id} className="flex justify-between text-sm py-1.5 border-b border-white/10">
                    <span className="text-white/55">Payment {i + 1} — {fmtDate(p.dueDate)}</span>
                    <span className="font-bold text-white">{fmt$(p.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/55">Cruise Total</span>
                  <span className="font-bold text-white">{fmt$(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/55">Sea Pay Enrollment Fee</span>
                  <span className="font-bold text-white">{fmt$(SEA_PAY_ENROLLMENT_FEE)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-1 border-t border-white/10">
                  <span>Total with Sea Pay</span>
                  <span>{fmt$(totalWithFee)}</span>
                </div>
              </div>
              <p className="text-xs text-white/45 mt-3">
                A {fmt$(SEA_PAY_LATE_FEE)} late fee applies to any missed payment. Final payment due 60 days before sailing.
              </p>
            </div>
          )}

          {/* Contact info */}
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <h2 className="font-extrabold uppercase tracking-[-0.01em] text-white text-lg mb-4">Your Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">
                  Full Name <span className="text-sky-400">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">
                    Email <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">
                    Phone <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={plan.length === 0 || !form.name || !form.email || !form.phone}
            className="w-full bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed font-semibold uppercase tracking-wider text-sm py-4 rounded-full transition-all"
          >
            Submit My Sea Pay Plan
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SeaPayPlanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070d] flex items-center justify-center"><div className="text-white/45 font-bold">Loading…</div></div>}>
      <PlanBuilder />
    </Suspense>
  );
}
