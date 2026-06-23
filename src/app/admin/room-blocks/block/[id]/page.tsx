"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  type SailingBlock,
  type Cabin,
  type CabinStatus,
  type CabinCategory,
  type CabinLocation,
  type CabinSide,
  getSailingBlock,
  saveSailingBlock,
  generateCabinId,
  CABIN_CATEGORIES,
  CABIN_LOCATIONS,
  CABIN_SIDES,
  CATEGORY_ICON,
  STATUS_COLOR,
  groupByType,
  countByStatus,
} from "@/lib/room-blocks";
import { fmtDateShort, fmt$ } from "@/lib/sea-pay";

const blankCabin = {
  roomNumber: "",
  deck: "",
  location: "Midship" as CabinLocation,
  side: "Port" as CabinSide,
  type: "Interior" as CabinCategory,
  maxGuests: "2",
  sqft: "",
  price: "",
  notes: "",
};

export default function BlockDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [block, setBlock] = useState<SailingBlock | null>(null);
  const [addingCabin, setAddingCabin] = useState(false);
  const [cabinForm, setCabinForm] = useState(blankCabin);

  useEffect(() => {
    getSailingBlock(id).then((b) => setBlock(b));
  }, [id]);

  async function persist(updated: SailingBlock) {
    await saveSailingBlock(updated);
    setBlock({ ...updated });
  }

  function setC(k: keyof typeof blankCabin, v: string) {
    setCabinForm((f) => ({ ...f, [k]: v }));
  }

  function addCabin() {
    if (!block || !cabinForm.roomNumber || !cabinForm.deck || !cabinForm.price) return;
    const cabin: Cabin = {
      id: generateCabinId(),
      roomNumber: cabinForm.roomNumber,
      deck: parseInt(cabinForm.deck),
      location: cabinForm.location,
      side: cabinForm.side,
      type: cabinForm.type,
      maxGuests: parseInt(cabinForm.maxGuests) || 2,
      sqft: parseInt(cabinForm.sqft) || 0,
      price: parseFloat(cabinForm.price),
      status: "available",
      notes: cabinForm.notes,
    };
    persist({ ...block, cabins: [...block.cabins, cabin] });
    setCabinForm(blankCabin);
    setAddingCabin(false);
  }

  function updateStatus(cabinId: string, status: CabinStatus, extra?: Partial<Cabin>) {
    if (!block) return;
    persist({
      ...block,
      cabins: block.cabins.map((c) =>
        c.id === cabinId ? { ...c, status, ...extra } : c
      ),
    });
  }

  function removeCabin(cabinId: string) {
    if (!block) return;
    if (!confirm("Remove this room from the block?")) return;
    persist({ ...block, cabins: block.cabins.filter((c) => c.id !== cabinId) });
  }

  if (!block) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <div className="text-5xl mb-3">🚢</div>
          <p className="font-bold">Room block not found.</p>
          <Link href="/admin/room-blocks" className="text-blue-500 text-sm mt-2 inline-block">← Back to Room Blocks</Link>
        </div>
      </div>
    );
  }

  const counts = countByStatus(block.cabins);
  const byType = groupByType(block.cabins);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/admin/room-blocks" className="text-blue-300 hover:text-white text-sm font-semibold">
            ← Room Blocks
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4 mt-2">
            <div>
              <h1 className="text-3xl font-extrabold">{block.ship}</h1>
              <p className="text-blue-200 text-sm mt-0.5">
                {block.cruiseLine} · {fmtDateShort(block.sailingDate)} · {block.nights} nights · {block.itinerary}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-green-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                {counts.available} Available
              </span>
              {counts.held > 0 && (
                <span className="bg-yellow-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                  {counts.held} Held
                </span>
              )}
              {counts.booked > 0 && (
                <span className="bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                  {counts.booked} Booked
                </span>
              )}
              <button
                onClick={() => setAddingCabin(true)}
                className="bg-white text-blue-900 font-bold px-4 py-2 rounded-full text-sm hover:bg-blue-50 transition-all"
              >
                + Add Room
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Add cabin form */}
        {addingCabin && (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6">
            <h3 className="font-extrabold text-blue-900 mb-4">Add New Room</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Room # *</label>
                <input value={cabinForm.roomNumber} onChange={(e) => setC("roomNumber", e.target.value)}
                  placeholder="4121" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Deck *</label>
                <input type="number" value={cabinForm.deck} onChange={(e) => setC("deck", e.target.value)}
                  placeholder="4" min="1" max="25" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Type</label>
                <select value={cabinForm.type} onChange={(e) => setC("type", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {CABIN_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">$/person *</label>
                <input type="number" value={cabinForm.price} onChange={(e) => setC("price", e.target.value)}
                  placeholder="649" min="0" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Location</label>
                <select value={cabinForm.location} onChange={(e) => setC("location", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {CABIN_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Side</label>
                <select value={cabinForm.side} onChange={(e) => setC("side", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {CABIN_SIDES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Max Guests</label>
                <select value={cabinForm.maxGuests} onChange={(e) => setC("maxGuests", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Sq Ft</label>
                <input type="number" value={cabinForm.sqft} onChange={(e) => setC("sqft", e.target.value)}
                  placeholder="185" min="0" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Notes</label>
                <input
                  value={cabinForm.notes}
                  onChange={(e) => setC("notes", e.target.value)}
                  placeholder="Connecting…"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addCabin}
                disabled={!cabinForm.roomNumber || !cabinForm.deck || !cabinForm.price}
                className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold px-5 py-2 rounded-full text-sm"
              >
                Add Room
              </button>
              <button
                onClick={() => { setAddingCabin(false); setCabinForm(blankCabin); }}
                className="border border-gray-200 text-gray-600 font-bold px-5 py-2 rounded-full text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Rooms grouped by type */}
        {CABIN_CATEGORIES.filter((t) => byType[t]?.length > 0).map((type) => {
          const cabins = byType[type];
          const avail = cabins.filter((c) => c.status === "available").length;
          return (
            <div key={type} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{CATEGORY_ICON[type as CabinCategory]}</span>
                  <h3 className="font-extrabold text-blue-900 text-lg">{type}</h3>
                  <span className="text-sm text-gray-400">{cabins.length} room{cabins.length !== 1 ? "s" : ""}</span>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${avail > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {avail} of {cabins.length} available
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {cabins.sort((a, b) => a.deck - b.deck || a.roomNumber.localeCompare(b.roomNumber)).map((cabin) => (
                  <div key={cabin.id} className="px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="font-extrabold text-blue-900 font-mono text-base">
                        Room {cabin.roomNumber}
                      </span>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <span className="font-semibold">Deck {cabin.deck}</span>
                        <span>·</span>
                        <span>{cabin.location}</span>
                        <span>·</span>
                        <span>{cabin.side}</span>
                      </div>
                      <span className="text-xs text-gray-400">Sleeps {cabin.maxGuests}</span>
                      {cabin.sqft > 0 && <span className="text-xs text-gray-400">{cabin.sqft} sq ft</span>}
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[cabin.status]}`}>
                        {cabin.status}
                      </span>
                      {cabin.notes && (
                        <span className="text-xs text-gray-400 italic">{cabin.notes}</span>
                      )}
                      {cabin.guestName && (
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                          {cabin.guestName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-blue-900">{fmt$(cabin.price)}<span className="text-gray-400 text-xs font-normal">/pp</span></span>

                      {/* Status controls */}
                      {cabin.status === "available" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const guest = prompt("Guest name for hold (optional):");
                              updateStatus(cabin.id, "held", { guestName: guest ?? undefined, heldUntil: new Date(Date.now() + 48 * 3600000).toISOString() });
                            }}
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                          >
                            Hold
                          </button>
                          <button
                            onClick={() => {
                              const guest = prompt("Guest name:");
                              if (!guest) return;
                              updateStatus(cabin.id, "booked", { guestName: guest });
                            }}
                            className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                          >
                            Book
                          </button>
                        </div>
                      )}
                      {(cabin.status === "held" || cabin.status === "booked") && (
                        <button
                          onClick={() => updateStatus(cabin.id, "available", { guestName: undefined })}
                          className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                        >
                          Release
                        </button>
                      )}
                      <button
                        onClick={() => removeCabin(cabin.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {block.cabins.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-400">
            <div className="text-5xl mb-3">🛏️</div>
            <p className="font-bold">No rooms in this block yet</p>
            <button onClick={() => setAddingCabin(true)} className="mt-4 bg-blue-900 text-white font-bold px-6 py-2 rounded-full text-sm">
              Add First Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
