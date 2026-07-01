import type { Metadata } from "next";
import { BOOKING_CALENDAR_URL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/lib/shop";
import ArrivalNotice from "@/components/ArrivalNotice";

export const metadata: Metadata = {
  title: "Book a Call — Cruises from Galveston",
  description:
    "Schedule a free call with a Galveston cruise specialist. Pick a time that works for you — we'll handle the rest.",
  alternates: { canonical: "/book-a-call" },
};

export default function BookACallPage() {
  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8"><ArrivalNotice /></div>
        <div className="text-center mb-8">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-2">{"// Talk to a Specialist"}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.02em]">Book a Call</h1>
          <p className="text-white/60 mt-2 max-w-xl mx-auto">
            Pick a time below and we&rsquo;ll call you. Prefer to text? Message us at{" "}
            <a href={`sms:${CONTACT_PHONE}`} className="text-sky-400">{CONTACT_PHONE_DISPLAY}</a> — usually the fastest.
          </p>
        </div>

        {/* Calendly inline embed */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white">
          <iframe
            src={`${BOOKING_CALENDAR_URL}?hide_gdpr_banner=1&background_color=ffffff&primary_color=0ea5e9`}
            title="Book a call"
            className="w-full"
            style={{ height: "760px", border: "0" }}
          />
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          Calendar not loading? <a href={BOOKING_CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 font-semibold">Open the booking page →</a> or call{" "}
          <a href={`tel:${CONTACT_PHONE}`} className="text-sky-400">{CONTACT_PHONE_DISPLAY}</a>.
        </p>
      </section>
    </div>
  );
}
