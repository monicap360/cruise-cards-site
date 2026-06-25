"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type Booking,
  getBookings,
  fmt$,
  fmtDateShort,
  getTotalPaid,
  getBookingBalance,
} from "@/lib/sea-pay";

type Period = "month" | "quarter" | "year" | "all";

const UNASSIGNED = "Unassigned";

function startOfPeriod(period: Period): Date | null {
  if (period === "all") return null;
  const now = new Date();
  if (period === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === "quarter") {
    const q = Math.floor(now.getMonth() / 3) * 3;
    return new Date(now.getFullYear(), q, 1);
  }
  return new Date(now.getFullYear(), 0, 1); // year
}

type AgentStats = {
  agent: string;
  bookings: number;
  gross: number;
  collected: number;
  outstanding: number;
  cancelled: number;
  commission: number;
};

export default function SalesDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("month");
  const [commissionRate, setCommissionRate] = useState(10);

  useEffect(() => {
    getBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  const periodLabel: Record<Period, string> = {
    month: "This Month",
    quarter: "This Quarter",
    year: "This Year",
    all: "All Time",
  };

  const inPeriod = useMemo(() => {
    const start = startOfPeriod(period);
    if (!start) return bookings;
    return bookings.filter((b) => new Date(b.createdAt) >= start);
  }, [bookings, period]);

  // Active (revenue-counting) bookings exclude cancellations
  const active = useMemo(
    () => inPeriod.filter((b) => b.status !== "cancelled"),
    [inPeriod]
  );

  const totals = useMemo(() => {
    const gross = active.reduce((s, b) => s + b.totalPrice, 0);
    const collected = active.reduce((s, b) => s + getTotalPaid(b), 0);
    const outstanding = active.reduce((s, b) => s + getBookingBalance(b), 0);
    return {
      gross,
      collected,
      outstanding,
      count: active.length,
      avg: active.length ? gross / active.length : 0,
      commission: gross * (commissionRate / 100),
      cancelled: inPeriod.filter((b) => b.status === "cancelled").length,
    };
  }, [active, inPeriod, commissionRate]);

  const agentBoard = useMemo<AgentStats[]>(() => {
    const map = new Map<string, AgentStats>();
    for (const b of inPeriod) {
      const agent = b.agentName?.trim() || UNASSIGNED;
      const cur =
        map.get(agent) ??
        {
          agent,
          bookings: 0,
          gross: 0,
          collected: 0,
          outstanding: 0,
          cancelled: 0,
          commission: 0,
        };
      if (b.status === "cancelled") {
        cur.cancelled += 1;
      } else {
        cur.bookings += 1;
        cur.gross += b.totalPrice;
        cur.collected += getTotalPaid(b);
        cur.outstanding += getBookingBalance(b);
        cur.commission += b.totalPrice * (commissionRate / 100);
      }
      map.set(agent, cur);
    }
    return [...map.values()].sort((a, b) => b.gross - a.gross);
  }, [inPeriod, commissionRate]);

  const topGross = agentBoard[0]?.gross ?? 0;

  const recent = useMemo(
    () =>
      [...inPeriod]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 8),
    [inPeriod]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Link
                href="/admin"
                className="text-blue-300 hover:text-white text-sm font-semibold"
              >
                ← Admin
              </Link>
              <div className="text-blue-300 text-sm font-semibold uppercase tracking-wide mb-1 mt-2">
                Cruises from Galveston
              </div>
              <h1 className="text-3xl font-extrabold">Travel Agent Sales</h1>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["month", "quarter", "year", "all"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    period === p
                      ? "bg-white text-blue-900"
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {periodLabel[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Gross Sales", value: fmt$(totals.gross), icon: "💰" },
              { label: "Collected", value: fmt$(totals.collected), icon: "✅" },
              {
                label: "Outstanding",
                value: fmt$(totals.outstanding),
                icon: "⏳",
              },
              {
                label: `Est. Commission (${commissionRate}%)`,
                value: fmt$(totals.commission),
                icon: "🏆",
              },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-4 bg-white/10">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-extrabold">{stat.value}</div>
                <div className="text-blue-200 text-xs font-semibold mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Secondary stats + commission control */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Bookings" value={String(totals.count)} />
          <StatCard label="Avg Booking Value" value={fmt$(totals.avg)} />
          <StatCard label="Cancelled" value={String(totals.cancelled)} />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Commission Rate
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) =>
                  setCommissionRate(
                    Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                  )
                }
                className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500 font-bold">%</span>
            </div>
          </div>
        </div>

        {/* Agent leaderboard */}
        <div>
          <h2 className="font-extrabold text-blue-900 text-xl mb-4">
            Agent Leaderboard · {periodLabel[period]}
          </h2>
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400 font-bold">
              Loading…
            </div>
          ) : agentBoard.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400 font-bold">
              No bookings in this period.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <th className="text-left font-bold px-5 py-3">Agent</th>
                      <th className="text-right font-bold px-5 py-3">Bookings</th>
                      <th className="text-right font-bold px-5 py-3">Gross Sales</th>
                      <th className="text-right font-bold px-5 py-3">Collected</th>
                      <th className="text-right font-bold px-5 py-3">Outstanding</th>
                      <th className="text-right font-bold px-5 py-3">
                        Commission
                      </th>
                      <th className="px-5 py-3 w-32" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {agentBoard.map((a, i) => (
                      <tr key={a.agent} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "·"}
                            </span>
                            <span className="font-extrabold text-blue-900">
                              {a.agent}
                            </span>
                            {a.cancelled > 0 && (
                              <span className="text-xs text-red-500 font-semibold">
                                {a.cancelled} cancelled
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-gray-700">
                          {a.bookings}
                        </td>
                        <td className="px-5 py-4 text-right font-extrabold text-blue-900">
                          {fmt$(a.gross)}
                        </td>
                        <td className="px-5 py-4 text-right text-green-600 font-bold">
                          {fmt$(a.collected)}
                        </td>
                        <td className="px-5 py-4 text-right text-gray-500 font-semibold">
                          {fmt$(a.outstanding)}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-gray-700">
                          {fmt$(a.commission)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{
                                width: `${topGross ? (a.gross / topGross) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Recent sales */}
        <div>
          <h2 className="font-extrabold text-blue-900 text-xl mb-4">
            Recent Bookings
          </h2>
          {recent.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400 font-bold">
              No bookings yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/bookings/${b.id}`}
                  className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="font-extrabold text-blue-900">
                        {b.customerName}
                      </span>
                      <span className="text-gray-400 text-xs ml-2">
                        {b.agentName?.trim() || UNASSIGNED} ·{" "}
                        {fmtDateShort(b.createdAt.split("T")[0])}
                      </span>
                      <div className="text-gray-500 text-sm">
                        {b.ship} — {b.itinerary}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-blue-900">
                        {fmt$(b.totalPrice)}
                      </div>
                      <div
                        className={`text-xs font-bold capitalize ${
                          b.status === "cancelled"
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        {b.status}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-2xl font-extrabold text-blue-900 mt-1">{value}</div>
    </div>
  );
}
