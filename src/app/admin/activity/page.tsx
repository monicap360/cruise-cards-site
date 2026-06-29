"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Item = {
  ts: string;
  kind: string; // call | email | sms | message | booking | hold | …
  icon: string;
  who: string;
  contact: string;
  detail: string;
};

const MODE_META: Record<string, { label: string; icon: string }> = {
  booking: { label: "Cabin booking", icon: "🛏️" },
  hold: { label: "Room hold", icon: "⏳" },
  transportation: { label: "Transportation", icon: "🚐" },
  parking: { label: "Cruise parking", icon: "🅿️" },
  "free-cruise": { label: "Free cruise", icon: "🎁" },
  "driver-application": { label: "Driver application", icon: "🪪" },
  rebook: { label: "Rebooking", icon: "🔄" },
  question: { label: "Question", icon: "💬" },
  appointment: { label: "Appointment", icon: "📅" },
  inquiry: { label: "Inquiry", icon: "✉️" },
  rfp: { label: "Agent group RFP", icon: "📩" },
  "rooming-list": { label: "Rooming list", icon: "🧾" },
  waitlist: { label: "Waitlist request", icon: "📋" },
  "room-move": { label: "Room move request", icon: "🛏️" },
  "guest-change": { label: "Guest change request", icon: "👤" },
  "name-correction": { label: "Name correction", icon: "✏️" },
  cancellation: { label: "Cancellation request", icon: "🚫" },
  "booking-change": { label: "Booking change", icon: "🔧" },
};

export default function AdminActivityPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function load() {
    const out: Item[] = [];

    const inq = await supabase
      .from("inquiries")
      .select("first_name,last_name,email,phone,ship,mode,message,created_at,confirm_number")
      .order("created_at", { ascending: false })
      .limit(100);
    for (const r of inq.data ?? []) {
      const meta = MODE_META[(r.mode as string) ?? "inquiry"] ?? MODE_META.inquiry;
      out.push({
        ts: (r.created_at as string) ?? "",
        kind: (r.mode as string) ?? "inquiry",
        icon: meta.icon,
        who: `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || "—",
        contact: (r.email as string) || (r.phone as string) || "",
        detail: `${meta.label}${r.ship ? ` · ${r.ship}` : ""} — ${(r.message as string) ?? ""}`.slice(0, 160),
      });
    }

    const con = await supabase
      .from("customer_contacts")
      .select("customer_name,email,phone,channel,direction,summary,created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    for (const r of con.data ?? []) {
      const ch = (r.channel as string) ?? "other";
      out.push({
        ts: (r.created_at as string) ?? "",
        kind: ch,
        icon: ch === "call" ? "📞" : ch === "email" ? "✉️" : ch === "sms" ? "💬" : ch === "voicemail" ? "📩" : "•",
        who: (r.customer_name as string) || "—",
        contact: (r.email as string) || (r.phone as string) || "",
        detail: `${r.direction ?? ""} ${ch} — ${(r.summary as string) ?? ""}`.slice(0, 160),
      });
    }

    const msg = await supabase
      .from("messages")
      .select("email,sender,body,created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    for (const r of msg.data ?? []) {
      out.push({
        ts: (r.created_at as string) ?? "",
        kind: "message",
        icon: "🗨️",
        who: (r.email as string) || "—",
        contact: (r.email as string) || "",
        detail: `Portal message (${r.sender}) — ${(r.body as string) ?? ""}`.slice(0, 160),
      });
    }

    out.sort((a, b) => (b.ts || "").localeCompare(a.ts || ""));
    setItems(out);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const kinds = ["all", "call", "email", "sms", "message", "booking", "hold", "transportation", "free-cruise", "question"];
  const shown = filter === "all" ? items : items.filter((i) => i.kind === filter);

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Activity Feed</h1>
            <p className="text-white/55 text-sm">
              Everything across the site — calls, emails, bookings, holds,
              transportation, questions, and portal messages — newest first.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={load} className="text-sm font-bold text-sky-400 hover:text-sky-300">↻ Refresh</button>
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {kinds.map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`text-xs font-bold uppercase rounded-full px-3 py-1.5 border transition-all ${
                filter === k ? "bg-white text-black border-white" : "bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-white/45">Loading…</p>
        ) : shown.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center text-white/45">
            No activity yet for this filter.
          </div>
        ) : (
          <div className="space-y-2">
            {shown.map((it, i) => (
              <div key={i} className="bg-[#0b1020] rounded-xl border border-white/10 p-4 flex items-start gap-3">
                <span className="text-xl">{it.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white">{it.who}</span>
                    {it.contact && <span className="text-white/40 text-xs">{it.contact}</span>}
                  </div>
                  <div className="text-white/55 text-sm">{it.detail}</div>
                </div>
                <div className="text-white/40 text-xs whitespace-nowrap">
                  {it.ts ? new Date(it.ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
