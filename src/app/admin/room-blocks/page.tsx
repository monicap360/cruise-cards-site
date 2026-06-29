"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type SailingBlock,
  getSailingBlocks,
  deleteSailingBlock,
  countByStatus,
  CATEGORY_ICON,
  groupByType,
} from "@/lib/room-blocks";
import { seedInventory, clearDraftInventory, isDraftBlock } from "@/lib/seed-inventory";
import { fmtDateShort } from "@/lib/sea-pay";

export default function RoomBlocksAdminPage() {
  const [blocks, setBlocks] = useState<SailingBlock[]>([]);
  const [seeding, setSeeding] = useState(false);

  async function refresh() {
    setBlocks(await getSailingBlocks());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSeed() {
    if (
      !confirm(
        "Seed the live inventory with the current Galveston fleet?\n\nShips, lines, durations and active months are real (galvestoncruises.com). Exact weekly dates are DRAFT estimates you can edit. You can remove them anytime with “Clear drafts.”"
      )
    )
      return;
    setSeeding(true);
    try {
      const { blocks: b, cabins: c } = await seedInventory();
      await refresh();
      alert(`Added ${b} draft sailings and ${c} cabins.`);
    } catch (e) {
      alert("Seed failed: " + (e as Error).message);
    } finally {
      setSeeding(false);
    }
  }

  async function handleClearDrafts() {
    if (!confirm("Delete all DRAFT sailings created by the seed?")) return;
    setSeeding(true);
    try {
      const n = await clearDraftInventory();
      await refresh();
      alert(`Removed ${n} draft sailings.`);
    } finally {
      setSeeding(false);
    }
  }

  async function handleDelete(id: string, ship: string) {
    if (!confirm(`Delete the entire room block for ${ship}? This cannot be undone.`)) return;
    await deleteSailingBlock(id);
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">
              ← Admin Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mt-2">Room Blocks</h1>
            <p className="text-white/55 text-sm mt-0.5">
              Manage your group cabin inventory by sailing
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 text-white/80 hover:text-white disabled:opacity-50 font-semibold px-5 py-3 rounded-full transition-all"
            >
              {seeding ? "Working…" : "⚓ Seed Galveston Fleet"}
            </button>
            <button
              onClick={handleClearDrafts}
              disabled={seeding}
              className="border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 disabled:opacity-50 font-semibold px-4 py-3 rounded-full transition-all text-sm"
            >
              Clear drafts
            </button>
            <Link
              href="/admin/room-blocks/new"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-6 py-3 rounded-full transition-all"
            >
              + New Sailing Block
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {blocks.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-16 text-center">
            <div className="text-6xl mb-4">🛏️</div>
            <p className="text-white/45 text-lg font-bold">No room blocks yet</p>
            <p className="text-white/45 text-sm mt-1 mb-6">
              Add a sailing and your cabin inventory to get started
            </p>
            <Link
              href="/admin/room-blocks/new"
              className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-6 py-3 rounded-full text-sm"
            >
              Create First Room Block
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block) => {
              const counts = countByStatus(block.cabins);
              const byType = groupByType(block.cabins);
              return (
                <div
                  key={block.id}
                  className="bg-[#0b1020] rounded-2xl border border-white/10 p-6"
                >
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-extrabold text-white text-xl">{block.ship}</h3>
                        <span className="text-sky-400 text-sm">{block.cruiseLine}</span>
                        {isDraftBlock(block.notes) && (
                          <span className="bg-amber-500/15 text-amber-300 border border-amber-400/25 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                            Draft date
                          </span>
                        )}
                      </div>
                      <div className="text-white/55 text-sm mt-0.5">
                        {fmtDateShort(block.sailingDate)} · {block.nights} nights · {block.itinerary}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="bg-green-500/15 text-green-300 border border-green-400/25 text-xs font-bold px-3 py-1.5 rounded-full">
                        {counts.available} Available
                      </span>
                      {counts.held > 0 && (
                        <span className="bg-yellow-400/15 text-yellow-300 border border-yellow-400/25 text-xs font-bold px-3 py-1.5 rounded-full">
                          {counts.held} Held
                        </span>
                      )}
                      {counts.booked > 0 && (
                        <span className="bg-red-500/15 text-red-300 border border-red-400/25 text-xs font-bold px-3 py-1.5 rounded-full">
                          {counts.booked} Booked
                        </span>
                      )}
                      <Link
                        href={`/admin/room-blocks/block/${block.id}`}
                        className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-4 py-2 rounded-full text-sm transition-all"
                      >
                        Manage Rooms
                      </Link>
                      <button
                        onClick={() => handleDelete(block.id, block.ship)}
                        className="text-red-300 hover:text-red-200 text-xs font-bold px-3 py-2 rounded-full border border-red-400/30 hover:bg-red-500/10 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Cabin type summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Object.entries(byType).map(([type, cabins]) => {
                      const available = cabins.filter((c) => c.status === "available").length;
                      return (
                        <div key={type} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                          <div className="text-xl mb-1">
                            {CATEGORY_ICON[type as keyof typeof CATEGORY_ICON] ?? "🛏️"}
                          </div>
                          <div className="font-bold text-white text-xs">{type}</div>
                          <div className="text-white/40 text-xs">
                            {available} of {cabins.length} avail
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
