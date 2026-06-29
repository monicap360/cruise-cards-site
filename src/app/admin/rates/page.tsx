"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllRates, saveRate, rateKey } from "@/lib/rates";
import { GALVESTON_FLEET } from "@/lib/seed-inventory";

const CABIN_TYPES = ["Interior", "Ocean View", "Balcony", "Mini-Suite", "Suite"];

const SHIPS = Array.from(
  new Map(GALVESTON_FLEET.map((s) => [s.ship, s.cruiseLine])).entries()
).map(([ship, cruiseLine]) => ({ ship, cruiseLine }));

export default function AdminRatesPage() {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState("");

  async function refresh() {
    const rates = await getAllRates();
    const m: Record<string, string> = {};
    for (const r of rates) m[rateKey(r.ship, r.cabinType)] = String(r.rate);
    setVals(m);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  const set = (ship: string, type: string, v: string) =>
    setVals((s) => ({ ...s, [rateKey(ship, type)]: v.replace(/[^0-9.]/g, "") }));

  async function saveAll() {
    setSaving(true);
    const jobs: Promise<unknown>[] = [];
    for (const { ship } of SHIPS) {
      for (const type of CABIN_TYPES) {
        const raw = vals[rateKey(ship, type)];
        const n = raw ? Number(raw) : 0;
        if (n > 0) jobs.push(saveRate(ship, type, n));
      }
    }
    await Promise.all(jobs);
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
    refresh();
  }

  const input =
    "w-24 bg-white/5 border border-white/15 rounded-xl px-2 py-1.5 text-sm text-right text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Cabin Rates</h1>
            <p className="text-white/55 text-sm max-w-2xl">
              Enter the cruise-line starting fare (per person, double occupancy)
              for each ship + cabin type. These override the seeded prices
              everywhere on the site. Leave blank to keep the existing price.
            </p>
          </div>
          <Link
            href="/admin"
            className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white"
          >
            ← Admin
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={saveAll}
            disabled={saving}
            className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold uppercase tracking-wider text-sm px-6 py-2.5 rounded-full"
          >
            {saving ? "Saving…" : "Save all rates"}
          </button>
          {savedAt && (
            <span className="text-green-300 text-sm font-semibold">
              Saved at {savedAt}
            </span>
          )}
        </div>

        {loading ? (
          <p className="text-white/45">Loading…</p>
        ) : (
          <div className="overflow-x-auto bg-[#0b1020] rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-white/45">
                  <th className="text-left font-bold px-4 py-3">Ship</th>
                  {CABIN_TYPES.map((t) => (
                    <th key={t} className="text-right font-bold px-3 py-3">
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHIPS.map(({ ship, cruiseLine }) => (
                  <tr
                    key={ship}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="px-4 py-2.5">
                      <div className="font-bold">{ship}</div>
                      <div className="text-white/40 text-xs">{cruiseLine}</div>
                    </td>
                    {CABIN_TYPES.map((type) => (
                      <td key={type} className="px-3 py-2.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <span className="text-white/40">$</span>
                          <input
                            className={input}
                            inputMode="decimal"
                            placeholder="—"
                            value={vals[rateKey(ship, type)] ?? ""}
                            onChange={(e) => set(ship, type, e.target.value)}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-white/40 text-xs mt-4">
          Tip: rates are per person at double occupancy — the same number the
          cruise line shows as “from” for that cabin. 3rd/4th-guest pricing is
          calculated automatically from this base.
        </p>
      </div>
    </div>
  );
}
