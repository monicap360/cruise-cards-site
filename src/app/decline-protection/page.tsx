"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const COMPANY = "Cruises from Galveston™";
const COMPANY_LEGAL = "Cruises from Galveston, operating as Cruise Experience Center™, Galveston, Texas";
const TODAY = () => new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

function generateWaiverId() {
  return "WVR-" + Math.random().toString(36).toUpperCase().substring(2, 9) + "-" + Date.now().toString(36).toUpperCase();
}

import { supabase } from "@/lib/supabase";

async function saveWaiver(waiver: Record<string, unknown>) {
  await supabase.from("waivers").insert({
    id: waiver.id,
    customer_name: waiver.customerName,
    email: waiver.email,
    phone: waiver.phone,
    booking_ref: waiver.bookingRef,
    ship: waiver.ship,
    sail_date: waiver.sailDate,
    signature: waiver.signature,
    acknowledgments: waiver.acknowledgments,
  });
}

const acknowledgments = [
  {
    id: "offered",
    text: "I was offered a Vacation Protection Plan by Cruises from Galveston™ and I have chosen to decline it.",
  },
  {
    id: "cancellation",
    text: "I understand that if I cancel my cruise, I may forfeit some or all of my cruise fare according to the Cancellation Policy, and I will not be entitled to a refund beyond what that policy allows.",
  },
  {
    id: "medical",
    text: "I understand that cruise ship medical facilities charge significant fees, and emergency medical evacuation can cost $50,000–$200,000 or more. These costs will not be covered and are my sole financial responsibility.",
  },
  {
    id: "delay",
    text: "I understand that travel delays, missed departures, and baggage loss or damage are not covered and any costs incurred are my sole financial responsibility.",
  },
  {
    id: "release",
    text: "I hereby release and discharge Cruises from Galveston™, its owners, agents, employees, and representatives from any and all claims, demands, actions, or causes of action arising from losses, costs, or damages that would have been covered under a Vacation Protection Plan had I elected to purchase one.",
  },
  {
    id: "nosuit",
    text: "I agree that I will not bring any legal claim, lawsuit, or demand for compensation against Cruises from Galveston™ for financial losses related to trip cancellation, trip interruption, medical expenses, travel delays, or baggage loss that a Vacation Protection Plan would have covered.",
  },
  {
    id: "voluntary",
    text: "I confirm that I am signing this declination and liability release voluntarily, that I have read and understood each statement above, and that no one has pressured me into signing.",
  },
];

function DeclinePageContent() {
  const params = useSearchParams();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bookingRef: params.get("booking") ?? "",
    ship: params.get("ship") ?? "",
    sailDate: params.get("date") ?? "",
    signature: "",
    dateConfirm: "",
  });
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [waiverId, setWaiverId] = useState("");

  const setF = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggleCheck = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const allChecked = acknowledgments.every((a) => checked[a.id]);
  const signatureMatch = form.signature.trim().toLowerCase() === `${form.firstName} ${form.lastName}`.trim().toLowerCase() && form.signature.trim().length > 2;
  const canSubmit = allChecked && signatureMatch && form.firstName && form.lastName && form.email && form.phone;

  async function handleSubmit() {
    if (!canSubmit) return;
    const id = generateWaiverId();
    const waiver = {
      id,
      submittedAt: new Date().toISOString(),
      customerName: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone,
      bookingRef: form.bookingRef,
      ship: form.ship,
      sailDate: form.sailDate,
      signature: form.signature,
      acknowledgments: Object.keys(checked).filter((k) => checked[k]),
    };
    await saveWaiver(waiver);
    setWaiverId(id);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-lg w-full text-center">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-2xl font-extrabold text-blue-900 mb-1">Declination Recorded</h2>
          <p className="text-gray-400 text-sm font-mono mb-5">Waiver ID: {waiverId}</p>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left text-sm space-y-2 mb-6">
            <div><strong>Name:</strong> {form.firstName} {form.lastName}</div>
            <div><strong>Email:</strong> {form.email}</div>
            {form.ship && <div><strong>Ship:</strong> {form.ship}</div>}
            {form.sailDate && <div><strong>Sail Date:</strong> {form.sailDate}</div>}
            {form.bookingRef && <div><strong>Booking Ref:</strong> {form.bookingRef}</div>}
            <div><strong>Signed:</strong> {form.signature}</div>
            <div><strong>Date:</strong> {TODAY()}</div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-xs text-yellow-800 text-left mb-6">
            <strong>Important:</strong> This declination has been saved to our records with waiver ID {waiverId}. A copy has been logged with your booking. By completing this form you have released Cruises from Galveston™ from liability for losses this plan would have covered. This release is binding.
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/book" className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-full text-sm transition-all">
              Continue Booking
            </Link>
            <Link href="/vacation-protection" className="border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-50">
              Reconsider Protection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2">Legal Document</div>
          <h1 className="text-3xl font-extrabold mb-2">Vacation Protection Declination &amp; Liability Release</h1>
          <p className="text-blue-200 text-sm max-w-xl">
            Read each statement carefully and check each box before signing. This is a binding legal release.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* Reconsider banner */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5 flex items-start gap-4">
          <span className="text-3xl flex-shrink-0">🛡️</span>
          <div>
            <div className="font-extrabold text-yellow-900 mb-1">Have you considered Vacation Protection?</div>
            <p className="text-sm text-yellow-800 leading-relaxed mb-3">
              For as little as 6% of your trip cost, you can protect your entire fare against cancellation, medical emergencies, travel delays, and more. Skipping coverage to save $150 on a $2,500 trip puts the entire $2,500 at risk.
            </p>
            <Link href="/vacation-protection" className="text-sm font-extrabold text-yellow-700 underline hover:no-underline">
              Review plan options before signing →
            </Link>
          </div>
        </div>

        {/* Customer info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-extrabold text-blue-900 text-base mb-4">Your Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">First Name *</label>
              <input value={form.firstName} onChange={(e) => setF("firstName", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Last Name *</label>
              <input value={form.lastName} onChange={(e) => setF("lastName", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setF("email", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone *</label>
              <input type="tel" value={form.phone} onChange={(e) => setF("phone", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Booking Reference</label>
              <input value={form.bookingRef} onChange={(e) => setF("bookingRef", e.target.value)}
                placeholder="e.g. CFG-ABC123"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Ship / Sail Date</label>
              <input value={form.ship} onChange={(e) => setF("ship", e.target.value)}
                placeholder="Carnival Jubilee · Jan 15, 2027"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Legal acknowledgments */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">⚖️</span>
            <div>
              <h3 className="font-extrabold text-red-900 text-base">Liability Release — Read Each Statement</h3>
              <p className="text-xs text-gray-400 mt-0.5">You must check every box before you can sign. This is a binding legal document.</p>
            </div>
          </div>

          <div className="space-y-4">
            {acknowledgments.map((ack, i) => (
              <label key={ack.id} className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checked[ack.id] ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200 hover:border-gray-300"}`}>
                <div className="flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={!!checked[ack.id]}
                    onChange={() => toggleCheck(ack.id)}
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                </div>
                <div className="text-sm leading-relaxed">
                  <span className="font-extrabold text-gray-400 mr-2">{i + 1}.</span>
                  <span className={checked[ack.id] ? "text-green-800" : "text-gray-700"}>{ack.text}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Full waiver text */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 className="font-extrabold text-gray-700 text-sm uppercase tracking-wide mb-3">Full Waiver Text</h3>
          <div className="text-xs text-gray-500 leading-relaxed space-y-3">
            <p>
              I, the undersigned, acknowledge that I was offered and have voluntarily declined a Vacation Protection Plan in connection with my cruise booking through {COMPANY_LEGAL}.
            </p>
            <p>
              I understand the financial risks of traveling without protection, including but not limited to: forfeiture of cruise fare upon cancellation, emergency medical expenses, medical evacuation costs, travel delay expenses, and baggage loss or damage.
            </p>
            <p>
              In consideration of the opportunity to purchase Vacation Protection having been offered to me, I hereby <strong>release, waive, and forever discharge</strong> {COMPANY_LEGAL}, its owners, officers, employees, agents, and authorized representatives from any and all claims, demands, liabilities, causes of action, lawsuits, and judgments — whether known or unknown — that arise from or relate to losses, costs, expenses, or damages that would have been covered under the Vacation Protection Plan I declined.
            </p>
            <p>
              I expressly agree that I will not initiate or pursue any legal proceeding, arbitration, or administrative claim against {COMPANY} or any of its affiliated persons or entities for recovery of losses covered or coverable under a standard Vacation Protection Plan.
            </p>
            <p>
              This release is governed by the laws of the State of Texas. I acknowledge that I have had the opportunity to read this document, ask questions, and seek legal counsel before signing. My signature below is voluntary and constitutes my legally binding agreement to all of the above.
            </p>
          </div>
        </div>

        {/* Signature */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-extrabold text-blue-900 text-base mb-1">Digital Signature</h3>
          <p className="text-xs text-gray-400 mb-4">
            Type your full legal name exactly as entered above ({form.firstName || "First"} {form.lastName || "Last"}) to sign this document. Your typed name constitutes a legal electronic signature under the Electronic Signatures in Global and National Commerce Act (E-SIGN Act).
          </p>
          <input
            value={form.signature}
            onChange={(e) => setF("signature", e.target.value)}
            placeholder={`${form.firstName || "First"} ${form.lastName || "Last"}`}
            className={`w-full border rounded-xl px-5 py-4 text-lg font-bold focus:outline-none focus:ring-2 ${
              form.signature && !signatureMatch
                ? "border-red-300 focus:ring-red-400 bg-red-50"
                : form.signature && signatureMatch
                ? "border-green-400 focus:ring-green-400 bg-green-50 text-green-800"
                : "border-gray-200 focus:ring-blue-500"
            }`}
            style={{ fontFamily: "cursive, Georgia, serif" }}
          />
          {form.signature && !signatureMatch && (
            <p className="text-xs text-red-500 mt-2">Signature must match your name exactly: &quot;{form.firstName} {form.lastName}&quot;</p>
          )}
          {signatureMatch && (
            <p className="text-xs text-green-600 mt-2 font-semibold">✓ Signature matched</p>
          )}
          <p className="text-xs text-gray-400 mt-3">Date: {TODAY()} · IP and timestamp are recorded with this submission.</p>
        </div>

        {!allChecked && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800 text-center">
            Please check all {acknowledgments.length} boxes above before signing.
          </div>
        )}

        <div className="flex gap-4 justify-between items-center flex-wrap">
          <Link href="/vacation-protection" className="text-sm font-semibold text-blue-600 hover:underline">
            ← Reconsider Vacation Protection
          </Link>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-extrabold px-10 py-4 rounded-full text-base transition-all shadow-lg"
          >
            I Decline Protection — Sign &amp; Submit
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center pb-4">
          This document is stored securely with a unique waiver ID and timestamp. A copy is maintained in our booking records. By submitting, you confirm your agreement to the liability release above.
        </p>
      </div>
    </div>
  );
}

export default function DeclineProtectionPage() {
  return (
    <Suspense>
      <DeclinePageContent />
    </Suspense>
  );
}
