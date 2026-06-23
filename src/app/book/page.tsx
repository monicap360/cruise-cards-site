"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const OFFICE_EMAIL = "cruisesfromgalveston.texas@gmail.com";
const OFFICE_PHONE = "(409) 555-CRUISE";

// Mon=1 Tue=2 Wed=3 Thu=4 Fri=5 Sat=6 Sun=0
const CLOSED_DAYS = [2, 3]; // Tuesday and Wednesday
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const OPEN_HOURS = "9:00 AM – 6:00 PM CST";

function isOfficeOpen(): { open: boolean; reason: string } {
  const now = new Date();
  const day = now.getDay();
  if (CLOSED_DAYS.includes(day)) {
    return { open: false, reason: `We're closed on Tuesdays and Wednesdays. We'll be back ${DAY_NAMES[(day + 1) % 7] === "Wednesday" ? "Thursday" : DAY_NAMES[(day + 1) % 7]}.` };
  }
  const h = now.getHours();
  if (h < 9 || h >= 18) {
    return { open: false, reason: `Our office is currently closed (hours: ${OPEN_HOURS}). Leave a message and we'll reply the next business day.` };
  }
  return { open: true, reason: `We're open right now! ${OPEN_HOURS}` };
}

function getNextOpenDay(): string {
  const now = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (!CLOSED_DAYS.includes(d.getDay())) {
      return DAY_NAMES[d.getDay()] + " " + d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  }
  return "next available business day";
}

// Appointment slots — Mon, Thu, Fri, Sat, Sun
const SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

function getAvailableDates(): { date: string; label: string; dayName: string }[] {
  const result = [];
  const now = new Date();
  const d = new Date(now);
  d.setDate(now.getDate() + 1); // start tomorrow
  while (result.length < 10) {
    if (!CLOSED_DAYS.includes(d.getDay())) {
      result.push({
        date: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        dayName: DAY_NAMES[d.getDay()],
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return result;
}

type BookingStep = "choose" | "inquiry" | "appointment" | "confirm";
type BookingMode = "inquiry" | "appointment";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ship: string;
  sailDate: string;
  rateType: string;
  guests: string;
  cabinType: string;
  crew: string;
  message: string;
  apptDate: string;
  apptTime: string;
  mode: BookingMode;
}

const blank: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  ship: "", sailDate: "", rateType: "flexible", guests: "2", cabinType: "", crew: "",
  message: "", apptDate: "", apptTime: "", mode: "inquiry",
};

function generateConfirmNumber() {
  return "CFG-" + Math.random().toString(36).toUpperCase().substring(2, 8);
}

async function saveInquiry(data: FormData & { confirmNumber: string; submittedAt: string }) {
  await supabase.from("inquiries").insert({
    confirm_number: data.confirmNumber,
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    ship: data.ship,
    sail_date: data.sailDate,
    rate_type: data.rateType,
    guests: data.guests,
    cabin_type: data.cabinType,
    crew: data.crew,
    message: data.message,
    appt_date: data.apptDate,
    appt_time: data.apptTime,
    mode: data.apptDate ? "appointment" : "inquiry",
  });
}

function BookPageContent() {
  const params = useSearchParams();
  const [step, setStep] = useState<BookingStep>("choose");
  const [form, setForm] = useState<FormData>({ ...blank });
  const [confirmNumber, setConfirmNumber] = useState("");
  const [availableDates] = useState(getAvailableDates());
  const [officeStatus] = useState(isOfficeOpen());
  const [nextOpen] = useState(getNextOpenDay());

  const set = (k: keyof FormData, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const ship = params.get("ship") ?? "";
    const sailDate = params.get("date") ?? "";
    const cabinType = params.get("type") ?? "";
    const crew = params.get("crew") ?? "";
    const rate = params.get("rate") ?? "";
    if (ship || sailDate || cabinType || crew || rate) {
      setForm((f) => ({
        ...f,
        ship: ship || f.ship,
        sailDate: sailDate || f.sailDate,
        cabinType: cabinType || f.cabinType,
        crew: crew || f.crew,
        rateType: rate || f.rateType,
      }));
    }
  }, [params]);

  async function handleSubmit() {
    const num = generateConfirmNumber();
    setConfirmNumber(num);
    await saveInquiry({ ...form, confirmNumber: num, submittedAt: new Date().toISOString() });
    setStep("confirm");
  }

  const canSubmit = form.firstName && form.lastName && form.email && form.phone &&
    (form.mode === "inquiry" ? form.message || form.ship : form.apptDate && form.apptTime);

  if (step === "choose") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14 text-center">
          <h1 className="text-4xl font-extrabold mb-2">Book Your Cruise</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            See the same live inventory our staff sees. Chat, ask questions, or schedule a time to come in.
          </p>
          <div className={`mt-5 inline-flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-full ${officeStatus.open ? "bg-green-500" : "bg-gray-600"} text-white`}>
            <span className={`w-2 h-2 rounded-full ${officeStatus.open ? "bg-white animate-pulse" : "bg-gray-400"}`} />
            {officeStatus.open ? "Office Open Now" : "Office Currently Closed"}
          </div>
          {!officeStatus.open && (
            <p className="text-blue-200 text-xs mt-2">{officeStatus.reason}</p>
          )}
        </div>

        <div className="max-w-3xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-extrabold text-blue-900 text-center mb-8">How would you like to connect?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Send an Inquiry */}
            <button
              onClick={() => { set("mode", "inquiry"); setStep("inquiry"); }}
              className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 text-left hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-extrabold text-blue-900 text-xl mb-2 group-hover:text-blue-700">Send an Inquiry</h3>
              <p className="text-gray-500 text-sm mb-4">Tell us what you&apos;re looking for. We&apos;ll reply with a custom quote, inventory options, and next steps.</p>
              <div className="text-xs text-gray-400">Auto confirmation + receipt sent immediately</div>
            </button>

            {/* Schedule an Appointment */}
            <button
              onClick={() => { set("mode", "appointment"); setStep("appointment"); }}
              className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 text-left hover:border-red-300 hover:shadow-lg transition-all group"
            >
              <div className="text-4xl mb-4">📅</div>
              <h3 className="font-extrabold text-blue-900 text-xl mb-2 group-hover:text-red-700">Book an Appointment</h3>
              <p className="text-gray-500 text-sm mb-4">Come in to the Cruise Experience Center and work with a specialist to pick your cabin, review inventory, and book live.</p>
              <div className="text-xs text-gray-400">Open Mon, Thu, Fri, Sat, Sun · Closed Tue &amp; Wed</div>
            </button>
          </div>

          {/* Office hours callout */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-3xl">🏢</div>
            <div className="flex-1">
              <div className="font-extrabold text-blue-900 mb-0.5">Cruise Experience Center — Galveston, Texas</div>
              <div className="text-sm text-gray-500">
                Open Mon, Thu–Sun · {OPEN_HOURS}<br />
                <span className="text-red-500 font-semibold">Closed Tuesday &amp; Wednesday</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <a href={`tel:+14095551-cruise`} className="text-blue-600 font-bold hover:underline">{OFFICE_PHONE}</a>
              <a href={`mailto:${OFFICE_EMAIL}`} className="text-blue-600 font-bold hover:underline truncate">{OFFICE_EMAIL}</a>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">Next available appointment day: <strong className="text-blue-900">{nextOpen}</strong></p>
          </div>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    const isAppt = form.mode === "appointment";
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-lg w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2">You&apos;re all set!</h2>
          <div className="text-gray-400 font-mono text-sm mb-4">Confirmation #{confirmNumber}</div>

          {isAppt ? (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 text-left">
              <div className="font-extrabold text-blue-900 mb-2">Your Appointment</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Date:</strong> {form.apptDate}</div>
                <div><strong>Time:</strong> {form.apptTime}</div>
                <div><strong>Location:</strong> Cruise Experience Center, Galveston, TX</div>
                <div><strong>Name:</strong> {form.firstName} {form.lastName}</div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 text-left">
              <div className="font-extrabold text-green-800 mb-2">Inquiry Received</div>
              <div className="text-sm text-gray-600 space-y-1">
                {form.ship && <div><strong>Ship:</strong> {form.ship}</div>}
                {form.sailDate && <div><strong>Sail Date:</strong> {form.sailDate}</div>}
                {form.cabinType && <div><strong>Cabin Type:</strong> {form.cabinType}</div>}
                <div><strong>Name:</strong> {form.firstName} {form.lastName}</div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left space-y-2 text-sm">
            <div className="font-extrabold text-gray-700 mb-2">What happens next?</div>
            <div className="flex items-start gap-2 text-gray-600">
              <span className="text-blue-500 font-bold">1.</span>
              A confirmation has been logged with reference #{confirmNumber}.
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <span className="text-blue-500 font-bold">2.</span>
              We&apos;ll contact you at <strong>{form.email}</strong> {isAppt ? "with your appointment confirmation." : "with cruise options and pricing."}
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <span className="text-blue-500 font-bold">3.</span>
              {isAppt ? "Bring a photo ID and any cruise paperwork to your appointment." : "Our specialist will review live inventory for your requested dates."}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800 mb-6">
            ⚠️ <strong>Please note:</strong> Office is closed Tuesday &amp; Wednesday. If you submitted outside business hours, we&apos;ll reply the next business day.
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/deals" className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-full text-sm transition-all">
              Browse More Deals
            </Link>
            <button onClick={() => { setForm({ ...blank }); setStep("choose"); }} className="border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-50">
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Shared contact info section
  const contactSection = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-extrabold text-blue-900 text-base mb-4">Your Contact Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">First Name *</label>
          <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Monica"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Last Name *</label>
          <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Pena"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email *</label>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone *</label>
          <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(409) 555-0100"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    </div>
  );

  // Cruise details
  const cruiseDetails = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-extrabold text-blue-900 text-base mb-4">Cruise Details <span className="text-gray-400 font-normal text-sm">(optional — helps us pull the right inventory)</span></h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Ship or Cruise Line</label>
          <input value={form.ship} onChange={(e) => set("ship", e.target.value)} placeholder="Carnival Jubilee"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Sail Date</label>
          <input type="date" value={form.sailDate} onChange={(e) => set("sailDate", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cabin Type</label>
          <select value={form.cabinType} onChange={(e) => set("cabinType", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Any / Not sure</option>
            {["Interior", "Ocean View", "Balcony", "Mini-Suite", "Suite"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Number of Guests</label>
          <select value={form.guests} onChange={(e) => set("guests", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Rate Preference</label>
          <select value={form.rateType} onChange={(e) => set("rateType", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="flexible">Flexible (refundable)</option>
            <option value="semiflex">Semi-Flex (partial refund)</option>
            <option value="nonrefundable">Non-Refundable (best price)</option>
            <option value="nontransferable">Non-Transferable</option>
          </select>
        </div>
        {form.crew && (
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Sea You on Deck Crew</label>
            <input value={form.crew} readOnly className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-blue-800 font-semibold" />
          </div>
        )}
      </div>
    </div>
  );

  if (step === "inquiry") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-900 text-white px-6 py-6">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <button onClick={() => setStep("choose")} className="text-blue-300 hover:text-white text-sm font-semibold">← Back</button>
            <div>
              <h1 className="text-2xl font-extrabold">Send an Inquiry</h1>
              <p className="text-blue-300 text-sm">We&apos;ll check live inventory and reply with options.</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
          {!officeStatus.open && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
              ⚠️ <strong>Office closed:</strong> {officeStatus.reason} Your inquiry is still saved and will be reviewed.
            </div>
          )}

          {contactSection}
          {cruiseDetails}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Your Message *</label>
            <textarea value={form.message} onChange={(e) => set("message", e.target.value)}
              rows={4} placeholder="Tell us what you're looking for — dates, budget, number of guests, special occasions, or any questions."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800">
            📋 <strong>What happens next:</strong> You&apos;ll get a confirmation number immediately. Our specialist will review live cabin inventory and reply to <strong>{form.email || "your email"}</strong> with cruise options, pricing, and availability.
          </div>

          <div className="flex gap-4 justify-end">
            <button onClick={() => setStep("choose")} className="border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!canSubmit}
              className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full text-sm transition-all shadow-lg">
              Submit Inquiry →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "appointment") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-red-700 text-white px-6 py-6">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <button onClick={() => setStep("choose")} className="text-red-200 hover:text-white text-sm font-semibold">← Back</button>
            <div>
              <h1 className="text-2xl font-extrabold">Book an Appointment</h1>
              <p className="text-red-200 text-sm">Cruise Experience Center · Open Mon, Thu–Sun · Closed Tue &amp; Wed</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
          {contactSection}
          {cruiseDetails}

          {/* Date picker */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-extrabold text-blue-900 text-base mb-4">Choose an Appointment Date *</h3>
            <div className="grid grid-cols-5 gap-2 mb-5">
              {availableDates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => set("apptDate", d.date)}
                  className={`rounded-xl py-3 text-center text-xs font-bold transition-all border ${
                    form.apptDate === d.date
                      ? "bg-blue-900 text-white border-blue-900"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="opacity-70">{d.dayName.slice(0, 3)}</div>
                  <div className="text-sm font-extrabold">{d.label}</div>
                </button>
              ))}
            </div>

            {form.apptDate && (
              <>
                <h3 className="font-extrabold text-blue-900 text-base mb-3">Choose a Time *</h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => set("apptTime", slot)}
                      className={`rounded-xl py-2.5 text-sm font-bold transition-all border ${
                        form.apptTime === slot
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-red-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Anything we should know before your appointment?</label>
            <textarea value={form.message} onChange={(e) => set("message", e.target.value)}
              rows={3} placeholder="Special occasion, specific ship you're interested in, group size, accessibility needs…"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-800">
            📍 <strong>Location:</strong> Cruise Experience Center · Galveston, Texas<br/>
            Bring a photo ID and any cruise quotes or paperwork you already have. Our staff will have your inquiry on file and live inventory ready to review.
          </div>

          <div className="flex gap-4 justify-end">
            <button onClick={() => setStep("choose")} className="border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!canSubmit}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full text-sm transition-all shadow-lg">
              Book Appointment →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function BookPage() {
  return (
    <Suspense>
      <BookPageContent />
    </Suspense>
  );
}
