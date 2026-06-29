"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  type SignupEntry,
  getSignupsByGroup,
  signupTotals,
  roomGuests,
} from "@/lib/signups";
import { getGroupSailing, getGroupByPin, GROUP_SAILINGS, pinFor } from "@/lib/group-sailings";
import {
  type GroupDeposit,
  getGroupDeposit,
  totalDue,
  paidToDate,
  nextDue,
} from "@/lib/group-deposits";
import {
  type GroupAnnouncement,
  type GroupRequest,
  REQUEST_TYPES,
  newReqId,
  getAnnouncements,
  getRequests,
  saveRequest,
} from "@/lib/group-hub";

function GroupLeaderInner() {
  const params = useSearchParams();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [group, setGroup] = useState("");
  const [groupKey, setGroupKey] = useState("");
  const [rows, setRows] = useState<SignupEntry[]>([]);
  const [dep, setDep] = useState<GroupDeposit | null>(null);
  const [anns, setAnns] = useState<GroupAnnouncement[]>([]);
  const [reqs, setReqs] = useState<GroupRequest[]>([]);
  const [reqType, setReqType] = useState(REQUEST_TYPES[0]);
  const [reqDetails, setReqDetails] = useState("");
  const [reqName, setReqName] = useState("");
  const [reqMsg, setReqMsg] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function login(pinArg?: string) {
    const p = (pinArg ?? pin).trim();
    if (!p) return;
    setLoading(true);
    setError("");
    const g = getGroupByPin(p);
    if (!g) {
      setLoading(false);
      setError("That group PIN isn't recognized. Check with your specialist or call (409) 632-2106.");
      return;
    }
    setPin(p);
    setGroup(g.label);
    setGroupKey(g.key);
    setRows(await getSignupsByGroup(g.label));
    if (g.depositId) {
      try { setDep(await getGroupDeposit(g.depositId)); } catch { setDep(null); }
    }
    try { setAnns(await getAnnouncements(g.key)); } catch { setAnns([]); }
    try { setReqs(await getRequests(g.key)); } catch { setReqs([]); }
    setLoggedIn(true);
    setLoading(false);
  }

  // Direct link: /group-leader?pin=1123  OR  ?g=thanksgiving-2026
  useEffect(() => {
    const qp = params.get("pin");
    const qg = params.get("g");
    if (qp) { login(qp); return; }
    if (qg) {
      const s = GROUP_SAILINGS.find((x) => x.key === qg);
      if (s) login(pinFor(s));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  async function submitRequest() {
    if (!reqDetails.trim()) { setReqMsg("Add a few details for your request."); return; }
    const r: GroupRequest = {
      id: newReqId(), groupKey, type: reqType, details: reqDetails,
      requester: reqName, status: "Submitted", response: "",
    };
    const ok = await saveRequest(r);
    if (ok) {
      setReqs(await getRequests(groupKey));
      setReqDetails(""); setReqName("");
      setReqMsg("✓ Request sent — we'll update the status here.");
      setTimeout(() => setReqMsg(""), 3000);
    } else {
      setReqMsg("Couldn't send — please call (409) 632-2106.");
    }
  }

  const sailing = group ? getGroupSailing(group) : null;
  const t = signupTotals(rows);
  const yes = (v: string) => v.toUpperCase().startsWith("Y");
  const usd = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  // Countdown to sail day
  const daysToSail = sailing?.sailDate
    ? Math.max(0, Math.ceil((new Date(sailing.sailDate + "T00:00:00").getTime() - Date.now()) / 86400000))
    : null;

  // Deposit summary (from the linked group_deposits tracker, if any)
  const depTotal = dep ? totalDue(dep) : 0;
  const depPaid = dep ? paidToDate(dep) : 0;
  const depBalance = Math.max(0, depTotal - depPaid);
  const depNext = dep ? nextDue(dep) : null;

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
              onClick={() => login()}
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
            {sailing?.displayName ?? sailing?.ship ?? group}
          </h1>
          <p className="text-white/60 mt-1">
            {sailing ? `${sailing.ship} · ${sailing.blurb}` : group}
          </p>
          {daysToSail !== null && (
            <div className="mt-4 inline-flex items-baseline gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
              <span className="text-3xl font-extrabold text-holo">{daysToSail}</span>
              <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">days until sail away</span>
            </div>
          )}
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

        {/* Deposit summary (only if a deposit tracker is linked) */}
        {dep && depTotal > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#0b1020] border border-green-400/25 rounded-2xl px-4 py-4">
              <div className="text-2xl font-extrabold text-green-300">{usd(depPaid)}</div>
              <div className="text-white/45 label-mono text-[10px] uppercase tracking-wider mt-1">Deposits collected</div>
            </div>
            <div className="bg-[#0b1020] border border-white/10 rounded-2xl px-4 py-4">
              <div className="text-2xl font-extrabold text-holo">{usd(depBalance)}</div>
              <div className="text-white/45 label-mono text-[10px] uppercase tracking-wider mt-1">Balance remaining</div>
            </div>
            <div className="bg-[#0b1020] border border-white/10 rounded-2xl px-4 py-4">
              <div className="text-lg font-extrabold text-white">{depNext ? depNext.dueDate : "—"}</div>
              <div className="text-white/45 label-mono text-[10px] uppercase tracking-wider mt-1">
                {depNext ? `Next payment · ${usd(depNext.depositRequired)}` : "Next payment"}
              </div>
            </div>
          </div>
        )}

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

        {/* Deposit progress */}
        {rows.length > 0 && (
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-bold text-white">Deposit progress</span>
              <span className="text-white/55">{t.depositsPaid} of {t.families} families paid</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-green-400" style={{ width: `${t.families ? Math.round((t.depositsPaid / t.families) * 100) : 0}%` }} />
            </div>
          </div>
        )}

        {/* Roster */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">
              {`// Roster — ${rows.length} famil${rows.length === 1 ? "y" : "ies"} · ${t.guests} guests`}
            </div>
            {rows.length > 0 && (
              <button onClick={() => window.print()} className="print:hidden bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold uppercase tracking-wider text-xs px-4 py-2 rounded-full">
                🖨️ Print roster
              </button>
            )}
          </div>
          {rows.length === 0 ? (
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center text-white/45">
              No families have signed up yet. Share your link to get started!
            </div>
          ) : (
            <div className="space-y-2">
              {rows.map((r) => {
                const guests = roomGuests(r);
                return (
                  <div key={r.id} className="bg-[#0b1020] rounded-xl border border-white/10 p-4">
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
                    {guests.length > 0 && (
                      <div className="text-white/65 text-sm mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {guests.map((g, i) => (
                          <span key={i}>👤 {g.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Group updates feed */}
        <div>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-4">{"// Group Updates"}</div>
          {anns.length === 0 ? (
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-5 text-white/45 text-sm">No updates yet — check back here for announcements from Cruises from Galveston.</div>
          ) : (
            <div className="space-y-2">
              {anns.map((a) => (
                <div key={a.id} className={`bg-[#0b1020] rounded-xl border p-4 ${a.pinned ? "border-sky-400/40" : "border-white/10"}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    {a.pinned && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/25">📌 Pinned</span>}
                    <span className="font-bold text-white">{a.title}</span>
                    <span className="text-white/35 text-xs">{a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-US") : ""}</span>
                  </div>
                  {a.body && <div className="text-white/65 text-sm mt-1 whitespace-pre-wrap">{a.body}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Send a request */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-3">{"// Send a Request"}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select className={input} value={reqType} onChange={(e) => setReqType(e.target.value)}>
              {REQUEST_TYPES.map((t) => <option key={t} value={t} className="bg-[#0b1020]">{t}</option>)}
            </select>
            <input className={input} value={reqName} onChange={(e) => setReqName(e.target.value)} placeholder="Your name (optional)" />
            <textarea className={`${input} sm:col-span-2`} rows={3} value={reqDetails} onChange={(e) => setReqDetails(e.target.value)} placeholder="Tell us what you need — e.g. 'Three families want cabins close together.'" />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <button onClick={submitRequest} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full">Send request</button>
            {reqMsg && <span className="text-sky-300 text-sm">{reqMsg}</span>}
          </div>
        </div>

        {/* Your requests */}
        {reqs.length > 0 && (
          <div>
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-4">{"// Your Requests"}</div>
            <div className="space-y-2">
              {reqs.map((r) => (
                <div key={r.id} className="bg-[#0b1020] rounded-xl border border-white/10 p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white">{r.type}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/25">{r.status}</span>
                    <span className="text-white/35 text-xs">{r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US") : ""}</span>
                  </div>
                  {r.details && <div className="text-white/60 text-sm mt-1">{r.details}</div>}
                  {r.response && <div className="text-green-300/90 text-sm mt-1.5">↳ {r.response}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

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

export default function GroupLeaderPage() {
  return (
    <Suspense fallback={null}>
      <GroupLeaderInner />
    </Suspense>
  );
}
