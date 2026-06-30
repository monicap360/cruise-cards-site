"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Elaria — the owner's master command center. A single private hub with live
// numbers across the whole business + one-tap access to every tool, plus a
// device-local scratchpad. Sits behind the admin PIN like the rest of /admin.

type Stats = {
  groups: number; guests: number; owed: number; fare: number;
  openTickets: number; openRequests: number; sailings: number;
};
type Activity = { id: string; kind: "request" | "ticket"; title: string; sub: string; when: string };

const fmt$ = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const LINK_GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  { title: "Guests & Bookings", links: [
    { href: "/admin/inbox", label: "📥 Inbox / Requests" },
    { href: "/admin/groups", label: "👥 Groups" },
    { href: "/admin/customers", label: "📇 Customers (CRM)" },
    { href: "/admin/reservations", label: "🛎️ Front Desk" },
    { href: "/admin/quotes", label: "💬 Quotes" },
    { href: "/admin/tickets", label: "🎫 Support Tickets" },
  ]},
  { title: "Money", links: [
    { href: "/admin/accounting", label: "📊 Accounting" },
    { href: "/admin/group-deposits", label: "💵 Group Deposits" },
    { href: "/admin/orders", label: "🧾 Orders" },
    { href: "/admin/sales", label: "📈 Sales" },
  ]},
  { title: "Growth", links: [
    { href: "/admin/social", label: "📱 Social" },
    { href: "/admin/social-playbook", label: "📖 Growth Playbook" },
    { href: "/admin/outreach", label: "📣 Outreach" },
    { href: "/admin/deep-dive", label: "🔎 Deep-Dive" },
    { href: "/admin/departures", label: "🚢 Departures" },
  ]},
  { title: "Tools & Secure", links: [
    { href: "/admin/vault", label: "🔐 Password Vault" },
    { href: "/admin/hotel-rfp", label: "🏨 Hotel RFP" },
    { href: "/admin/documents", label: "📁 Documents" },
    { href: "/admin/rooming-list", label: "📋 Rooming Lists" },
  ]},
];

// Goes in Render (the live site uses these at runtime).
const RENDER_KEYS: { id: string; k: string; p: string; s: "live" | "todo" }[] = [
  { id: "sb-url", k: "NEXT_PUBLIC_SUPABASE_URL", p: "Database", s: "live" },
  { id: "sb-anon", k: "NEXT_PUBLIC_SUPABASE_ANON_KEY", p: "Database (public)", s: "live" },
  { id: "admin-pin", k: "ADMIN_PIN", p: "Admin login", s: "live" },
  { id: "anthropic", k: "ANTHROPIC_API_KEY", p: "Chatbot + AI PDF reading", s: "todo" },
  { id: "resend", k: "RESEND_API_KEY", p: "Booking emails", s: "todo" },
  { id: "owner-email", k: "OWNER_EMAIL", p: "Alert recipient", s: "todo" },
  { id: "booking-from", k: "BOOKING_FROM", p: "Email “from” address", s: "todo" },
  { id: "tw-sid", k: "TWILIO_ACCOUNT_SID", p: "Text + phone ring", s: "todo" },
  { id: "tw-token", k: "TWILIO_AUTH_TOKEN", p: "Text + phone ring", s: "todo" },
  { id: "tw-from", k: "TWILIO_FROM", p: "Your Twilio number", s: "todo" },
  { id: "tw-sms", k: "ALERT_SMS_TO", p: "Your # for the text", s: "todo" },
  { id: "tw-voice", k: "TWILIO_VOICE_TO", p: "Your # for the ring", s: "todo" },
  { id: "site-url", k: "NEXT_PUBLIC_SITE_URL", p: "Email links (optional)", s: "todo" },
];

// Store in the vault (your personal copies + human logins — not used by the app).
const VAULT_GROUPS: { group: string; items: string[] }[] = [
  { group: "Cruise line portals", items: ["Royal Caribbean — Cruising Power", "Carnival — GoCCL", "Norwegian (NCL)", "MSC", "Any others you sell"] },
  { group: "Infrastructure", items: ["Render login", "Supabase login", "GitHub login", "Domain registrar", "Gmail + app password"] },
  { group: "Service accounts", items: ["Ooma", "Twilio account", "Resend account", "Anthropic account"] },
  { group: "Tools & social", items: ["Facebook page", "Instagram", "Jotform", "Quo", "Calendly"] },
  { group: "Always store here", items: ["Backup copies of ALL Render keys", "2FA / MFA backup codes"] },
];

const slug = (s: string) => "v-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function ElariaPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [notes, setNotes] = useState("");
  const [savedAt, setSavedAt] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});

  function toggleDone(id: string) {
    setDone((d) => {
      const next = { ...d, [id]: !d[id] };
      localStorage.setItem("elaria-checklist", JSON.stringify(next));
      return next;
    });
  }

  useEffect(() => {
    setNotes(localStorage.getItem("elaria-notes") || "");
    try { setDone(JSON.parse(localStorage.getItem("elaria-checklist") || "{}")); } catch { /* ignore */ }
    (async () => {
      const s: Stats = { groups: 0, guests: 0, owed: 0, fare: 0, openTickets: 0, openRequests: 0, sailings: 0 };
      try {
        const gm = await supabase.from("group_members").select("group_id,fare,deposit_paid,paid_in_full,guests");
        const ids = new Set<string>();
        (gm.data || []).forEach((m: Record<string, unknown>) => {
          ids.add(m.group_id as string);
          const fare = Number(m.fare) || 0, paid = Number(m.deposit_paid) || 0;
          s.fare += fare; s.guests += Number(m.guests) || 0;
          s.owed += m.paid_in_full ? 0 : Math.max(0, fare - paid);
        });
        s.groups = ids.size;
      } catch { /* ignore */ }
      try {
        const tk = await supabase.from("tickets").select("status");
        s.openTickets = (tk.data || []).filter((t: Record<string, unknown>) => t.status === "Open").length;
      } catch { /* table may not exist */ }
      try {
        const sb = await supabase.from("sailing_blocks").select("id", { count: "exact", head: true });
        s.sailings = sb.count || 0;
      } catch { /* ignore */ }
      const acts: Activity[] = [];
      try {
        const inq = await supabase.from("inquiries").select("id,first_name,last_name,mode,status,created_at,ship").order("created_at", { ascending: false }).limit(6);
        (inq.data || []).forEach((r: Record<string, unknown>) => {
          if ((r.status as string) !== "closed" && (r.status as string) !== "done") s.openRequests++;
          acts.push({ id: r.id as string, kind: "request",
            title: `${(r.first_name as string) || ""} ${(r.last_name as string) || ""}`.trim() || "Website",
            sub: `${r.mode || "inquiry"}${r.ship ? " · " + r.ship : ""}`, when: (r.created_at as string) || "" });
        });
      } catch { /* ignore */ }
      try {
        const tks = await supabase.from("tickets").select("id,subject,customer_name,status,created_at").order("created_at", { ascending: false }).limit(4);
        (tks.data || []).forEach((r: Record<string, unknown>) => acts.push({
          id: r.id as string, kind: "ticket", title: (r.subject as string) || "Ticket",
          sub: `${r.customer_name || ""} · ${r.status || ""}`, when: (r.created_at as string) || "" }));
      } catch { /* ignore */ }
      acts.sort((a, b) => (b.when || "").localeCompare(a.when || ""));
      setActivity(acts.slice(0, 8));
      setStats(s);
    })();
  }, []);

  function saveNotes(v: string) {
    setNotes(v);
    localStorage.setItem("elaria-notes", v);
    setSavedAt(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
  }
  const when = (t: string) => (t ? new Date(t).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "");

  const KPIS = stats ? [
    { label: "Groups", value: String(stats.groups), href: "/admin/groups", accent: "text-sky-300" },
    { label: "Guests booked", value: String(stats.guests), href: "/admin/groups", accent: "text-white" },
    { label: "Balance owed", value: fmt$(stats.owed), href: "/admin/group-deposits", accent: "text-amber-300" },
    { label: "Booked fare", value: fmt$(stats.fare), href: "/admin/accounting", accent: "text-green-300" },
    { label: "Open requests", value: String(stats.openRequests), href: "/admin/inbox", accent: "text-sky-300" },
    { label: "Open tickets", value: String(stats.openTickets), href: "/admin/tickets", accent: "text-white" },
    { label: "Sailings live", value: String(stats.sailings), href: "/admin/departures", accent: "text-white" },
  ] : [];

  const allIds = [...RENDER_KEYS.map((r) => r.id), ...VAULT_GROUPS.flatMap((g) => g.items.map((i) => slug(g.group + i)))];
  const doneCount = allIds.filter((id) => done[id]).length;
  const pct = Math.round((doneCount / allIds.length) * 100);

  return (
    <div className="relative min-h-screen bg-[#02040a] text-white overflow-hidden">
      {/* Deep-space backdrop */}
      <div className="pointer-events-none absolute inset-0 starfield opacity-70" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="aurora bg-sky-500 -top-40 -left-32 w-[36rem] h-[36rem] animate-drift-slow opacity-[0.16]" />
      <div className="aurora bg-indigo-600 top-1/3 -right-40 w-[34rem] h-[34rem] animate-drift opacity-[0.14]" />
      <div className="aurora bg-cyan-400 bottom-0 left-1/3 w-[28rem] h-[28rem] animate-float opacity-[0.10]" />
      <div className="scanline" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(56,189,248,.12), transparent 60%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Hero ── */}
        <div className="relative neon-edge neon-pulse rounded-3xl bg-[#060b18]/70 backdrop-blur-md p-6 sm:p-8 mb-8 overflow-hidden">
          <div className="tech-rule absolute top-0 left-8 right-8" />
          {/* Radar emblem */}
          <div className="hidden sm:block absolute -right-6 -top-6 w-44 h-44 opacity-40">
            <div className="absolute inset-0 rounded-full border border-sky-400/30 orbit-spin" />
            <div className="absolute inset-4 rounded-full border border-sky-400/20 orbit-spin-rev" />
            <div className="absolute inset-8 rounded-full border border-sky-400/10" />
            <div className="absolute inset-0 orbit-spin" style={{ background: "conic-gradient(from 0deg, rgba(56,189,248,.35), transparent 28%)", borderRadius: "9999px", WebkitMask: "radial-gradient(circle, transparent 30%, #000 31%)", mask: "radial-gradient(circle, transparent 30%, #000 31%)" }} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="label-mono text-[10px] uppercase tracking-[0.3em] text-sky-300/80">// systems online · owner command center</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold uppercase tracking-[-0.03em] text-holo text-glow leading-none">Elaria</h1>
          <p className="text-white/50 text-sm mt-2 max-w-md">Mission control for everything you run — guests, money, growth, and your secure keys.</p>
          <div className="mt-4 flex items-center gap-4 flex-wrap label-mono text-[10px] uppercase tracking-widest text-white/40">
            <span>◇ {stats ? stats.groups : "—"} active groups</span>
            <span className="text-sky-400/60">●</span>
            <span>◇ {stats ? stats.sailings : "—"} sailings tracked</span>
            <span className="text-sky-400/60">●</span>
            <Link href="/admin" className="hover:text-white">◇ admin grid →</Link>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-9">
          {!stats ? (
            <div className="col-span-full label-mono text-sky-300/60 text-sm uppercase tracking-widest animate-pulse">▮ acquiring telemetry…</div>
          ) : KPIS.map((k, i) => (
            <Link key={k.label} href={k.href}
              className="group relative bg-[#060b18]/70 backdrop-blur-sm rounded-2xl p-4 neon-edge hover:neon-pulse transition-all overflow-hidden">
              <span className="absolute top-1.5 left-1.5 w-2 h-2 border-l border-t border-sky-400/40" />
              <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-r border-b border-sky-400/40" />
              <div className={`text-2xl font-extrabold ${k.accent} group-hover:text-glow transition-all`}>{k.value}</div>
              <div className="text-white/40 text-[10px] uppercase tracking-wider mt-1 label-mono">{k.label}</div>
              <div className="text-white/20 text-[9px] label-mono mt-0.5">{String(i + 1).padStart(2, "0")}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-6">
          {/* Quick links */}
          <div className="space-y-6">
            {LINK_GROUPS.map((g) => (
              <div key={g.title}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="label-mono text-[11px] uppercase tracking-[0.2em] text-sky-300/70">{g.title}</div>
                  <div className="tech-rule flex-1 opacity-60" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {g.links.map((l) => (
                    <Link key={l.href} href={l.href}
                      className="group relative bg-[#060b18]/60 backdrop-blur-sm border border-sky-400/15 rounded-xl px-3 py-3 text-sm font-semibold hover:border-sky-400/50 hover:bg-sky-400/[0.06] transition-all">
                      <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: activity console + log */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="label-mono text-[11px] uppercase tracking-[0.2em] text-sky-300/70">Live feed</div>
                <div className="tech-rule flex-1 opacity-60" />
              </div>
              <div className="bg-[#060b18]/70 backdrop-blur-sm neon-edge rounded-2xl p-3 space-y-1 font-mono">
                {activity.length === 0 ? (
                  <div className="text-sky-300/40 text-xs p-2 label-mono">▮ no signals yet</div>
                ) : activity.map((a) => (
                  <Link key={a.kind + a.id} href={a.kind === "ticket" ? "/admin/tickets" : "/admin/inbox"} className="block rounded-lg px-2 py-1.5 hover:bg-sky-400/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className="text-sky-400/70 text-[10px]">{a.kind === "ticket" ? "▸" : "◂"}</span>
                      <span className="font-semibold text-sm truncate flex-1">{a.title}</span>
                      <span className="text-white/25 text-[10px] shrink-0">{when(a.when)}</span>
                    </div>
                    <div className="text-sky-200/40 text-xs pl-4 truncate">{a.sub}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="label-mono text-[11px] uppercase tracking-[0.2em] text-sky-300/70">Captain&rsquo;s log</div>
                {savedAt && <span className="text-sky-300/40 text-[10px] label-mono">saved {savedAt}</span>}
              </div>
              <textarea value={notes} onChange={(e) => saveNotes(e.target.value)} rows={10}
                placeholder="Private notes, to-dos, reminders… (stays on this device only)"
                className="w-full bg-[#060b18]/70 backdrop-blur-sm border border-sky-400/15 rounded-2xl p-4 text-sky-100/90 text-sm font-mono placeholder-sky-300/25 resize-none focus:outline-none focus:border-sky-400/50" />
              <p className="text-sky-300/25 text-[10px] mt-1 label-mono">▮ stored locally · not in database</p>
            </div>
          </div>
        </div>

        {/* ── Keys & Setup mission checklist ── */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="label-mono text-[11px] uppercase tracking-[0.2em] text-sky-300/70">// Keys &amp; Setup</div>
            <div className="tech-rule flex-1 min-w-[40px] opacity-60" />
            <span className="label-mono text-[10px] uppercase tracking-widest text-sky-300/60">{doneCount}/{allIds.length} secured · {pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-5">
            <div className="h-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all" style={{ width: `${pct}%` }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Render */}
            <div className="bg-[#060b18]/70 backdrop-blur-sm neon-edge rounded-2xl p-5">
              <div className="font-bold text-sm flex items-center gap-2 mb-1">⚙️ Render — engine keys</div>
              <p className="text-white/40 text-xs mb-3">The live site uses these. Add at Render → Environment.</p>
              <div className="space-y-1.5">
                {RENDER_KEYS.map((r) => (
                  <label key={r.id} className="flex items-center gap-3 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-white/[0.04]">
                    <input type="checkbox" checked={!!done[r.id]} onChange={() => toggleDone(r.id)} className="accent-sky-500 w-4 h-4 shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className={`font-mono text-xs ${done[r.id] ? "line-through text-white/35" : "text-sky-200/90"}`}>{r.k}</span>
                      <span className="block text-white/35 text-[10px]">{r.p}</span>
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${r.s === "live" ? "bg-green-500/15 text-green-300" : "bg-amber-400/15 text-amber-300"}`}>{r.s === "live" ? "live" : "add"}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vault */}
            <div className="bg-[#060b18]/70 backdrop-blur-sm neon-edge rounded-2xl p-5">
              <div className="font-bold text-sm flex items-center gap-2 mb-1">🔐 Vault — your records</div>
              <p className="text-white/40 text-xs mb-3">Store in the <Link href="/admin/vault" className="text-sky-400 hover:text-sky-300">Password Vault</Link>. Logins + backup copies of every key.</p>
              <div className="space-y-3">
                {VAULT_GROUPS.map((g) => (
                  <div key={g.group}>
                    <div className="label-mono text-[10px] uppercase tracking-wider text-sky-300/50 mb-1">{g.group}</div>
                    <div className="space-y-1">
                      {g.items.map((it) => {
                        const id = slug(g.group + it);
                        return (
                          <label key={id} className="flex items-center gap-3 cursor-pointer rounded-lg px-2 py-1 hover:bg-white/[0.04]">
                            <input type="checkbox" checked={!!done[id]} onChange={() => toggleDone(id)} className="accent-sky-500 w-4 h-4 shrink-0" />
                            <span className={`text-xs ${done[id] ? "line-through text-white/35" : "text-white/80"}`}>{it}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sky-300/25 text-[10px] mt-3 label-mono">▮ checklist stored locally on this device</p>
        </div>
      </div>
    </div>
  );
}
