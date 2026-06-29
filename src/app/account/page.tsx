"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { fmt$, fmtDateDow } from "@/lib/sea-pay";
import { STATUS_STAGES, type CustomerStatus } from "@/lib/account";
import type { CustomerCredit } from "@/lib/credits";
import ChatWidget from "@/components/ChatWidget";
import BookingRequestForm from "@/components/BookingRequestForm";
import { getDocumentsForEmail, type GuestDocument } from "@/lib/documents";

// Secure e-signature document (Jotform Sign). Change the id to swap documents.
const SIGN_URL = "https://www.jotform.com/sign/252315585270052";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [credits, setCredits] = useState<CustomerCredit[]>([]);
  const [status, setStatus] = useState<CustomerStatus | null>(null);
  const [requests, setRequests] = useState<
    { confirm: string; ship: string; sailDate: string; cabinType: string; mode: string }[]
  >([]);

  const [qText, setQText] = useState("");
  const [qSent, setQSent] = useState(false);
  const [documents, setDocuments] = useState<GuestDocument[]>([]);

  async function login() {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/account?email=${encodeURIComponent(email)}`);
      const d = await r.json();
      setCredits(Array.isArray(d.credits) ? d.credits : []);
      setStatus(d.status ?? null);
      setRequests(Array.isArray(d.requests) ? d.requests : []);
    } catch {
      setCredits([]);
      setStatus(null);
      setRequests([]);
    }
    try {
      setDocuments(await getDocumentsForEmail(email));
    } catch {
      setDocuments([]);
    }
    setLoggedIn(true);
    setLoading(false);
  }

  async function ask() {
    if (!qText.trim()) return;
    await supabase.from("inquiries").insert({
      confirm_number: "Q-" + Math.random().toString(36).toUpperCase().slice(2, 8),
      first_name: name || "Account",
      last_name: "",
      email,
      phone: "",
      ship: "",
      sail_date: "",
      rate_type: "",
      guests: "",
      cabin_type: "",
      crew: "",
      message: `CUSTOMER QUESTION (account): ${qText}`,
      appt_date: "",
      appt_time: "",
      mode: "question",
    });
    setQSent(true);
    setQText("");
    setTimeout(() => setQSent(false), 5000);
  }

  const field =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";

  // ── login screen ──
  if (!loggedIn) {
    return (
      <div className="bg-[#05070d] text-white min-h-screen">
        <section className="relative overflow-hidden grid-bg py-16">
          <div className="aurora bg-sky-500 w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 opacity-[0.12]" />
          <div className="relative z-10 max-w-md mx-auto px-4 text-center">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              {"// My Account"}
            </div>
            <h1 className="text-4xl font-extrabold uppercase tracking-[-0.02em] mb-2">
              Past customer?
            </h1>
            <p className="text-white/55 mb-7">
              Sign in with the email on your booking to see your status, credits,
              and ask your specialist a question.
            </p>
            <div className="space-y-3 text-left">
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" />
              <input
                className={field}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                placeholder="Email on your booking"
              />
              <button
                onClick={login}
                disabled={!email.trim() || loading}
                className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-sm py-3.5 rounded-full transition-all"
              >
                {loading ? "Signing in…" : "View my account →"}
              </button>
            </div>
            <p className="text-white/35 text-xs mt-4">
              No password needed — we match the email we have on file.
            </p>
          </div>
        </section>
      </div>
    );
  }

  const stageIdx = status ? STATUS_STAGES.indexOf(status.status) : -1;

  // ── dashboard ──
  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-1">
              {"// My Account"}
            </div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
              Hi{name ? `, ${name}` : ""}
            </h1>
            <div className="text-white/45 text-sm">{email}</div>
          </div>
          <button onClick={() => { setLoggedIn(false); setEmail(""); }} className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">
            Sign out
          </button>
        </div>

        {/* Booking status */}
        <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-6">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
            {"// Your Booking Status"}
          </div>
          {status ? (
            <>
              <div className="text-2xl font-extrabold uppercase tracking-tight text-white">
                {status.status}
              </div>
              {status.workingOn && (
                <p className="text-white/65 text-sm mt-1">
                  Currently working on: {status.workingOn}
                </p>
              )}
              {/* stepper */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {STATUS_STAGES.map((s, i) => (
                  <span
                    key={s}
                    className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 border ${
                      i <= stageIdx
                        ? "bg-sky-400/15 border-sky-400/40 text-sky-200"
                        : "bg-white/5 border-white/10 text-white/35"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
              {status.updatedAt && (
                <div className="text-white/35 text-xs mt-3">
                  Updated {new Date(status.updatedAt).toLocaleString("en-US")}
                </div>
              )}
            </>
          ) : (
            <p className="text-white/55 text-sm">
              No active booking status yet. If you just reached out, a specialist
              is reviewing your request — check back soon.
            </p>
          )}
        </div>

        {/* Credits */}
        {credits.length > 0 && (
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
              {"// Your Credits"}
            </div>
            {credits.map((c) => (
              <div key={c.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 last:border-0 py-2">
                <div>
                  <span className="text-holo font-extrabold text-xl">{fmt$(c.amount)}</span>
                  {c.reason && <span className="text-white/55 text-sm ml-2">{c.reason}</span>}
                </div>
                {c.expiresOn && (
                  <span className="text-amber-300/80 text-xs">Rebook by {fmtDateDow(c.expiresOn)}</span>
                )}
              </div>
            ))}
            <Link href="/already-booked" className="inline-block mt-3 text-sky-400 hover:text-sky-300 text-sm font-semibold">
              Manage / rebook with credit →
            </Link>
          </div>
        )}

        {/* Requests & services */}
        {requests.length > 0 && (
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
              {"// Your Requests & Services"}
            </div>
            <div className="space-y-2">
              {requests.map((q, i) => {
                const LABELS: Record<string, { l: string; icon: string }> = {
                  booking: { l: "Cabin booking", icon: "🛏️" },
                  hold: { l: "Room hold", icon: "⏳" },
                  transportation: { l: "Transportation / transfer", icon: "🚐" },
                  parking: { l: "Cruise parking", icon: "🅿️" },
                  "free-cruise": { l: "Free cruise response", icon: "🎁" },
                  rebook: { l: "Rebooking request", icon: "🔄" },
                  question: { l: "Question", icon: "💬" },
                  appointment: { l: "Appointment", icon: "📅" },
                  inquiry: { l: "Inquiry", icon: "✉️" },
                };
                const meta = LABELS[q.mode] ?? { l: q.mode, icon: "•" };
                return (
                  <div key={i} className="flex items-center gap-3 border-b border-white/5 last:border-0 py-2">
                    <span className="text-xl">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold">
                        {meta.l}
                        {q.ship ? ` · ${q.ship}` : ""}
                      </div>
                      <div className="text-white/40 text-xs">
                        {q.cabinType ? `${q.cabinType} · ` : ""}
                        {q.sailDate || ""}
                      </div>
                    </div>
                    {q.confirm && (
                      <span className="text-white/45 font-mono text-xs">#{q.confirm}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Your documents — confirmations & invoices */}
        {documents.length > 0 && (
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
              {"// Your Documents"}
            </div>
            <div className="space-y-1">
              {documents.map((d) => (
                <a
                  key={d.id}
                  href={d.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border-b border-white/5 last:border-0 py-2.5 group"
                >
                  <span className="text-xl">📄</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold group-hover:text-sky-300">
                      {d.label || d.fileName}
                    </div>
                    <div className="text-white/40 text-xs">
                      {d.type}
                      {d.confirmNumber ? ` · #${d.confirmNumber}` : ""}
                    </div>
                  </div>
                  <span className="text-sky-400 group-hover:text-sky-300 text-sm font-semibold whitespace-nowrap">
                    Download →
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Sign your documents — secure e-signature */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">
            {"// Sign Your Documents"}
          </div>
          <p className="text-white/55 text-sm mb-4">
            Review and securely e-sign your booking agreement. Signatures are collected through
            our encrypted e-signature partner with a legal audit trail — no card or payment here.
          </p>
          <a
            href={SIGN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full"
          >
            ✍️ Review &amp; e-sign
          </a>
          <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
            <iframe
              title="Sign your documents"
              src={SIGN_URL}
              className="w-full h-[640px] bg-white"
              loading="lazy"
            />
          </div>
          <p className="text-white/35 text-xs mt-2">
            If the document doesn&rsquo;t load above, use the &ldquo;Review &amp; e-sign&rdquo; button to open it securely.
          </p>
        </div>

        {/* Manage your booking — room moves & guest changes */}
        <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-6">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">
            {"// Manage Your Booking"}
          </div>
          <p className="text-white/55 text-sm mb-4">
            For your protection, <strong className="text-white/80">all room moves and guest
            changes must be submitted here in your portal</strong> so we have your request in
            writing and can track it. We&rsquo;ll confirm by email.
          </p>
          <BookingRequestForm email={email} name={name} />
        </div>

        {/* Ask a question */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
            {"// Ask Your Specialist"}
          </div>
          {qSent ? (
            <div className="text-sky-300 text-sm">
              Got it — your question was sent. We&rsquo;ll reply to {email} shortly.
            </div>
          ) : (
            <>
              <textarea
                className={`${field} resize-none`}
                rows={3}
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Ask us anything about your booking…"
              />
              <button
                onClick={ask}
                disabled={!qText.trim()}
                className="mt-3 bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
              >
                Send question
              </button>
            </>
          )}
        </div>

        {/* AI Guest Care — knows this guest's reservation */}
        <div>
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-3">
            {"// Guest Care — Cruises from Galveston"}
          </div>
          <ChatWidget
            agent="guestcare"
            variant="inline"
            email={email}
            title="Guest Care"
            subtitle="Cruises from Galveston"
            greeting={`Hi${name ? `, ${name}` : ""}! I'm Guest Care from Cruises from Galveston. I can see your booking on file — ask me about your status, payments, credits, documents, transportation, or what's next.`}
            placeholder="Ask about your booking…"
          />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/already-booked", label: "Credits & Rebooking", icon: "💳" },
            { href: "/free-cruise", label: "Free Cruise (VIFP)", icon: "🎁" },
            { href: "/cruise-line-apps", label: "App & Check-In", icon: "📱" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="bg-[#0b1020] border border-white/10 rounded-2xl p-5 hover:border-sky-400/40 transition-colors">
              <div className="text-2xl mb-2">{l.icon}</div>
              <div className="font-bold text-white text-sm">{l.label}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
