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
import { fmtDateShort } from "@/lib/sea-pay";

export default function RoomBlocksAdminPage() {
  const [blocks, setBlocks] = useState<SailingBlock[]>([]);

  useEffect(() => {
    getSailingBlocks().then((data) => setBlocks(data));
  }, []);

  async function handleDelete(id: string, ship: string) {
    if (!confirm(`Delete the entire room block for ${ship}? This cannot be undone.`)) return;
    await deleteSailingBlock(id);
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link href="/admin" className="text-blue-300 hover:text-white text-sm font-semibold">
              ← Admin Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold mt-1">Room Blocks</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Manage your group cabin inventory by sailing
            </p>
          </div>
          <Link
            href="/admin/room-blocks/new"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg"
          >
            + New Sailing Block
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {blocks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">🛏️</div>
            <p className="text-gray-400 text-lg font-bold">No room blocks yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">
              Add a sailing and your cabin inventory to get started
            </p>
            <Link
              href="/admin/room-blocks/new"
              className="inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-full text-sm"
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
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-extrabold text-blue-900 text-xl">{block.ship}</h3>
                        <span className="text-blue-400 text-sm">{block.cruiseLine}</span>
                      </div>
                      <div className="text-gray-500 text-sm mt-0.5">
                        {fmtDateShort(block.sailingDate)} · {block.nights} nights · {block.itinerary}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                        {counts.available} Available
                      </span>
                      {counts.held > 0 && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full">
                          {counts.held} Held
                        </span>
                      )}
                      {counts.booked > 0 && (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full">
                          {counts.booked} Booked
                        </span>
                      )}
                      <Link
                        href={`/admin/room-blocks/block/${block.id}`}
                        className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-full text-sm transition-all"
                      >
                        Manage Rooms
                      </Link>
                      <button
                        onClick={() => handleDelete(block.id, block.ship)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-2 rounded-full border border-red-200 hover:bg-red-50 transition-all"
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
                        <div key={type} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                          <div className="text-xl mb-1">
                            {CATEGORY_ICON[type as keyof typeof CATEGORY_ICON] ?? "🛏️"}
                          </div>
                          <div className="font-bold text-blue-900 text-xs">{type}</div>
                          <div className="text-gray-400 text-xs">
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
