"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Waiver = {
  id: string;
  submittedAt: string;
  customerName: string;
  email: string;
  phone: string;
  bookingRef?: string;
  ship?: string;
  sailDate?: string;
  signature: string;
  acknowledgments: string[];
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function WaiversPage() {
  const [waivers, setWaivers] = useState<Waiver[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("waivers")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setWaivers(data.map((r) => ({
          id: r.id,
          submittedAt: r.created_at,
          customerName: r.customer_name,
          email: r.email ?? "",
          phone: r.phone ?? "",
          bookingRef: r.booking_ref,
          ship: r.ship,
          sailDate: r.sail_date,
          signature: r.signature,
          acknowledgments: r.acknowledgments ?? [],
        })));
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
              <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mt-2">Signed Waivers</h1>
            </div>
            <span className="bg-white/5 border border-white/15 text-white text-sm font-bold px-4 py-1.5 rounded-full">
              {waivers.length} total
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {waivers.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 text-center py-16 text-white/45">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-semibold">No waivers signed yet.</p>
            <p className="text-sm mt-2">Waivers appear here when customers complete the Vacation Protection Declination form.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {waivers.map((w) => (
              <div key={w.id} className="bg-[#0b1020] rounded-2xl border border-white/10 overflow-hidden">
                <div
                  className="px-6 py-4 flex items-center justify-between flex-wrap gap-3 cursor-pointer hover:bg-white/5"
                  onClick={() => setExpanded(expanded === w.id ? null : w.id)}
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-extrabold text-white">{w.customerName}</span>
                    {w.ship && <span className="text-sm text-white/55">{w.ship}</span>}
                    {w.bookingRef && <span className="text-xs bg-sky-500/15 text-sky-300 border border-sky-400/25 font-bold px-2.5 py-0.5 rounded-full">{w.bookingRef}</span>}
                    <span className="text-xs bg-green-500/15 text-green-300 border border-green-400/25 font-bold px-2.5 py-0.5 rounded-full">
                      ✓ {w.acknowledgments.length}/7 confirmed
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40">{fmtDate(w.submittedAt)}</span>
                    <span className="text-white/40">{expanded === w.id ? "▲" : "▼"}</span>
                  </div>
                </div>

                {expanded === w.id && (
                  <div className="border-t border-white/10 px-6 py-5 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-white/40 text-xs font-bold uppercase">Waiver ID</span><div className="font-mono font-bold text-white">{w.id}</div></div>
                      <div><span className="text-white/40 text-xs font-bold uppercase">Email</span><div className="text-white/70">{w.email}</div></div>
                      <div><span className="text-white/40 text-xs font-bold uppercase">Phone</span><div className="text-white/70">{w.phone}</div></div>
                      {w.ship && <div><span className="text-white/40 text-xs font-bold uppercase">Ship</span><div className="text-white/70">{w.ship}</div></div>}
                      {w.sailDate && <div><span className="text-white/40 text-xs font-bold uppercase">Sail Date</span><div className="text-white/70">{w.sailDate}</div></div>}
                      <div><span className="text-white/40 text-xs font-bold uppercase">Signature</span><div className="font-bold text-white/70" style={{ fontFamily: "cursive, Georgia, serif" }}>{w.signature}</div></div>
                    </div>
                    <div className="bg-red-500/15 border border-red-400/30 rounded-xl px-4 py-3 text-xs text-red-300 font-semibold">
                      ⚖️ Liability release signed — this customer waived rights to pursue claims against Cruises from Galveston™ for uncovered losses. Waiver ID: {w.id}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
