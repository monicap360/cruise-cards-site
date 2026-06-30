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

export default function ElariaPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [notes, setNotes] = useState("");
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    setNotes(localStorage.getItem("elaria-notes") || "");
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

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
          <div>
            <div className="label-mono text-[11px] uppercase tracking-[0.2em] text-sky-400/80">{"// Owner command center"}</div>
            <h1 className="text-4xl font-extrabold uppercase tracking-[-0.02em] bg-gradient-to-r from-sky-300 to-white bg-clip-text text-transparent">Elaria</h1>
            <p className="text-white/50 text-sm">Everything you run — one private view.</p>
          </div>
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/40 hover:text-white">Admin grid →</Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {!stats ? (
            <div className="col-span-full text-white/40 text-sm">Loading your numbers…</div>
          ) : KPIS.map((k) => (
            <Link key={k.label} href={k.href} className="bg-[#0b1020] border border-white/10 rounded-2xl p-4 hover:border-white/25 transition-colors">
              <div className={`text-2xl font-extrabold ${k.accent}`}>{k.value}</div>
              <div className="text-white/45 text-[11px] uppercase tracking-wider mt-1">{k.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Quick links */}
          <div className="space-y-6">
            {LINK_GROUPS.map((g) => (
              <div key={g.title}>
                <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/70 mb-2">{g.title}</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {g.links.map((l) => (
                    <Link key={l.href} href={l.href} className="bg-[#0b1020] border border-white/10 rounded-xl px-3 py-3 text-sm font-semibold hover:border-sky-400/40 hover:bg-white/[0.03] transition-colors">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: activity + scratchpad */}
          <div className="space-y-6">
            <div>
              <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/70 mb-2">Recent activity</div>
              <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-3 space-y-1">
                {activity.length === 0 ? (
                  <div className="text-white/40 text-sm p-2">Nothing yet.</div>
                ) : activity.map((a) => (
                  <Link key={a.kind + a.id} href={a.kind === "ticket" ? "/admin/tickets" : "/admin/inbox"} className="block rounded-lg px-2 py-1.5 hover:bg-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{a.kind === "ticket" ? "🎫" : "📥"}</span>
                      <span className="font-semibold text-sm truncate flex-1">{a.title}</span>
                      <span className="text-white/30 text-[10px] shrink-0">{when(a.when)}</span>
                    </div>
                    <div className="text-white/45 text-xs pl-6 truncate">{a.sub}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/70">My scratchpad</div>
                {savedAt && <span className="text-white/30 text-[10px]">saved {savedAt}</span>}
              </div>
              <textarea value={notes} onChange={(e) => saveNotes(e.target.value)} rows={10}
                placeholder="Private notes, to-dos, reminders… (stays on this device only)"
                className="w-full bg-[#0b1020] border border-white/10 rounded-2xl p-4 text-white/90 text-sm placeholder-white/30 resize-none focus:outline-none focus:border-sky-400/50" />
              <p className="text-white/30 text-[10px] mt-1">Saved locally in this browser — not in the database.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
