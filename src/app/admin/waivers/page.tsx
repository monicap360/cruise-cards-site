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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-blue-300 hover:text-white text-sm font-semibold">← Admin</Link>
            <h1 className="text-2xl font-extrabold">Signed Waivers</h1>
          </div>
          <span className="bg-white/10 border border-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full">
            {waivers.length} total
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {waivers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-semibold">No waivers signed yet.</p>
            <p className="text-sm mt-2">Waivers appear here when customers complete the Vacation Protection Declination form.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {waivers.map((w) => (
              <div key={w.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div
                  className="px-6 py-4 flex items-center justify-between flex-wrap gap-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpanded(expanded === w.id ? null : w.id)}
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-extrabold text-blue-900">{w.customerName}</span>
                    {w.ship && <span className="text-sm text-gray-500">{w.ship}</span>}
                    {w.bookingRef && <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">{w.bookingRef}</span>}
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full">
                      ✓ {w.acknowledgments.length}/7 confirmed
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{fmtDate(w.submittedAt)}</span>
                    <span className="text-gray-400">{expanded === w.id ? "▲" : "▼"}</span>
                  </div>
                </div>

                {expanded === w.id && (
                  <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-gray-400 text-xs font-bold uppercase">Waiver ID</span><div className="font-mono font-bold text-blue-900">{w.id}</div></div>
                      <div><span className="text-gray-400 text-xs font-bold uppercase">Email</span><div className="text-gray-700">{w.email}</div></div>
                      <div><span className="text-gray-400 text-xs font-bold uppercase">Phone</span><div className="text-gray-700">{w.phone}</div></div>
                      {w.ship && <div><span className="text-gray-400 text-xs font-bold uppercase">Ship</span><div className="text-gray-700">{w.ship}</div></div>}
                      {w.sailDate && <div><span className="text-gray-400 text-xs font-bold uppercase">Sail Date</span><div className="text-gray-700">{w.sailDate}</div></div>}
                      <div><span className="text-gray-400 text-xs font-bold uppercase">Signature</span><div className="font-bold text-gray-700" style={{ fontFamily: "cursive, Georgia, serif" }}>{w.signature}</div></div>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs text-red-700 font-semibold">
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
