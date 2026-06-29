"use client";

import Link from "next/link";
import { useState } from "react";
import {
  type SignupEntry,
  getSignupsByGroup,
  signupTotals,
} from "@/lib/signups";
import { getGroupSailing, getGroupByPin } from "@/lib/group-sailings";

export default function GroupLeaderPage() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [group, setGroup] = useState("");
  const [rows, setRows] = useState<SignupEntry[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function login() {
    if (!pin.trim()) return;
    setLoading(true);
    setError("");
    const g = getGroupByPin(pin);
    if (!g) {
      setLoading(false);
      setError("That group PIN isn't recognized. Check with your specialist or call (409) 632-2106.");
      return;
    }
    setGroup(g.label);
    setRows(await getSignupsByGroup(g.label));
    setLoggedIn(true);
    setLoading(false);
  }

  const sailing = group ? getGroupSailing(group) : null;
  const t = signupTotals(rows);
  const yes = (v: string) => v.toUpperCase().startsWith("Y");

  function share() {
    const url = `${window.location.origin}/group-signup`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const input =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";

  // ── Login screen ──
  if (!loggedIn) {
    return (
      <div className="bg-[#05070d] text-white min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-2 text-center">
            {"// Group Leader Portal"}
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-center mb-2">
            Manage Your Group
          </h1>
          <p className="text-white/55 text-center text-sm mb-6">
            Organizing a group cruise? Enter your group PIN to see who&rsquo;s in, track
            cabins and deposits, and invite more families. Your specialist gives you the PIN.
          </p>
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 space-y-3">
            <input
              className={`${input} text-center tracking-[0.4em] text-lg`}
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Group PIN"
            />
            {error && <p className="text-red-300 text-sm">{error}</p>}
            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-sm px-6 py-3.5 rounded-full transition-all"
            >
              {loading ? "Checking…" : "View my group"}
            </button>
          </div>
          <p className="text-center text-white/35 text-xs mt-4">
            Not started a group yet?{" "}
            <Link href="/group-signup" className="text-sky-400 hover:text-sky-300">Sign up here</Link> or call (409) 632-2106.
          </p>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      <section className="relative overflow-hidden border-b border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/destinations/${sailing?.destSlug ?? "cozumel"}.jpg`} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/85 to-[#05070d]/60" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-2">{"// Your Group"}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.02em] leading-tight">
            {sailing?.ship ?? group}
          </h1>
          <p className="text-white/60 mt-1">{sailing?.blurb ?? group}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Totals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Families", value: t.families },
            { label: "Total guests", value: t.guests },
            { label: "Confirmed", value: t.confirmed },
            { label: "Deposits paid", value: t.depositsPaid },
          ].map((c) => (
            <div key={c.label} className="bg-[#0b1020] border border-white/10 rounded-2xl px-4 py-4">
              <div className="text-2xl font-extrabold text-holo">{c.value}</div>
              <div className="text-white/45 label-mono text-[10px] uppercase tracking-wider mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Invite */}
        <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-bold text-white">Invite more families</div>
            <div className="text-white/55 text-sm">Share your group signup link so everyone joins the same sailing.</div>
          </div>
          <button onClick={share} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-full whitespace-nowrap">
            {copied ? "✓ Link copied" : "Copy signup link"}
          </button>
        </div>

        {/* Roster */}
        <div>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-4">
            {`// Roster — ${rows.length} famil${rows.length === 1 ? "y" : "ies"}`}
          </div>
          {rows.length === 0 ? (
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center text-white/45">
              No families have signed up yet. Share your link to get started!
            </div>
          ) : (
            <div className="space-y-2">
              {rows.map((r) => (
                <div key={r.id} className="bg-[#0b1020] rounded-xl border border-white/10 p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{r.leadName || "Guest"}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${yes(r.confirmed) ? "bg-green-500/15 text-green-300 border-green-400/25" : "bg-yellow-400/15 text-yellow-300 border-yellow-400/25"}`}>
                        {yes(r.confirmed) ? "Confirmed" : "Interested"}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${yes(r.depositStatus) ? "bg-green-500/15 text-green-300 border-green-400/25" : "bg-white/5 text-white/45 border-white/15"}`}>
                        {yes(r.depositStatus) ? "Deposit paid" : "Deposit due"}
                      </span>
                    </div>
                    <div className="text-white/50 text-sm mt-0.5">
                      {r.totalGuests} guest{r.totalGuests === 1 ? "" : "s"} ({r.adults}A / {r.kids}K) · {r.cabins}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center text-white/40 text-sm">
          Questions about your group? Call <a href="tel:+14096322106" className="text-sky-400">(409) 632-2106</a> or your specialist will reach out.
          <div className="mt-3">
            <button onClick={() => { setLoggedIn(false); setPin(""); setRows([]); }} className="text-white/45 hover:text-white text-xs font-bold uppercase tracking-wider">Sign out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
