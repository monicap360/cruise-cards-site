import type { Metadata } from "next";
import { CC_AUTH_FORM_URL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Credit Card Authorization — Cruises from Galveston",
  description:
    "Securely authorize Cruises from Galveston to charge your card for your cruise reservation. Submitted directly through our secure form.",
  robots: { index: false, follow: false },
};

export default function CreditCardAuthPage() {
  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-6">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-2">{"// Secure Authorization"}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.02em]">Credit Card Authorization</h1>
          <p className="text-white/60 mt-2 max-w-xl mx-auto">
            Authorize us to charge your card for your cruise reservation. Your details go
            <span className="text-white"> directly to our secure form</span> — they are never stored on this website.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-white/45 mb-5">
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">🔒 Secure &amp; encrypted</span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">No card charged online</span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white">
          <iframe
            src={CC_AUTH_FORM_URL}
            title="Credit Card Authorization Form"
            className="w-full"
            style={{ height: "1100px", border: "0" }}
          />
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          Form not loading? <a href={CC_AUTH_FORM_URL} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 font-semibold">Open it in a new tab →</a> or call{" "}
          <a href={`tel:${CONTACT_PHONE}`} className="text-sky-400">{CONTACT_PHONE_DISPLAY}</a>.
        </p>
      </section>
    </div>
  );
}
