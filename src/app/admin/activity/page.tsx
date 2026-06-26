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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900">Activity Feed</h1>
            <p className="text-gray-500 text-sm">
              Everything across the site — calls, emails, bookings, holds,
              transportation, questions, and portal messages — newest first.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={load} className="text-sm font-bold text-blue-700 hover:underline">↻ Refresh</button>
            <Link href="/admin" className="text-sm font-bold text-blue-700 hover:underline">← Admin</Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {kinds.map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`text-xs font-bold uppercase rounded-full px-3 py-1.5 border ${
                filter === k ? "bg-blue-700 text-white border-blue-700" : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : shown.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
            No activity yet for this filter.
          </div>
        ) : (
          <div className="space-y-2">
            {shown.map((it, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                <span className="text-xl">{it.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold">{it.who}</span>
                    {it.contact && <span className="text-gray-400 text-xs">{it.contact}</span>}
                  </div>
                  <div className="text-gray-600 text-sm">{it.detail}</div>
                </div>
                <div className="text-gray-400 text-xs whitespace-nowrap">
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
