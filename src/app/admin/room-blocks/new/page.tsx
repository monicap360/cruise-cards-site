"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  generateBlockId,
  generateCabinId,
  saveSailingBlock,
  CABIN_CATEGORIES,
  CABIN_LOCATIONS,
  CABIN_SIDES,
  type CabinCategory,
  type CabinLocation,
  type CabinSide,
  type Cabin,
} from "@/lib/room-blocks";
import { CRUISE_LINES } from "@/lib/sea-pay";

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

export default function NewRoomBlockPage() {
  const router = useRouter();
  const [sailing, setSailing] = useState({
    ship: "",
    cruiseLine: "",
    sailingDate: "",
    returnDate: "",
    nights: "",
    itinerary: "",
    notes: "",
  });
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [cabinForm, setCabinForm] = useState(blankCabin);
  const [addingCabin, setAddingCabin] = useState(false);

  const setS = (k: keyof typeof sailing, v: string) =>
    setSailing((f) => ({ ...f, [k]: v }));
  const setC = (k: keyof typeof blankCabin, v: string) =>
    setCabinForm((f) => ({ ...f, [k]: v }));

  function addCabin() {
    if (!cabinForm.roomNumber || !cabinForm.deck || !cabinForm.price) return;
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
    setCabins((prev) => [...prev, cabin]);
    setCabinForm({ ...blankCabin });
    setAddingCabin(false);
  }

  function removeCabin(id: string) {
    setCabins((prev) => prev.filter((c) => c.id !== id));
  }

  function handleSave() {
    if (!sailing.ship || !sailing.sailingDate || cabins.length === 0) return;
    saveSailingBlock({
      id: generateBlockId(),
      createdAt: new Date().toISOString(),
      ship: sailing.ship,
      cruiseLine: sailing.cruiseLine,
      sailingDate: sailing.sailingDate,
      returnDate: sailing.returnDate,
      nights: parseInt(sailing.nights) || 0,
      itinerary: sailing.itinerary,
      cabins,
      notes: sailing.notes,
    });
    router.push("/admin/room-blocks");
  }

  const byType = CABIN_CATEGORIES.map((t) => ({
    type: t,
    count: cabins.filter((c) => c.type === t).length,
  })).filter((x) => x.count > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <a href="/admin/room-blocks" className="text-blue-300 hover:text-white text-sm font-semibold">
            ← Room Blocks
          </a>
          <h1 className="text-2xl font-extrabold">New Sailing Room Block</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Sailing Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-extrabold text-blue-900 text-lg mb-5">Sailing Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Cruise Line <span className="text-red-500">*</span></label>
              <select value={sailing.cruiseLine} onChange={(e) => setS("cruiseLine", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Select…</option>
                {CRUISE_LINES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Ship Name <span className="text-red-500">*</span></label>
              <input value={sailing.ship} onChange={(e) => setS("ship", e.target.value)}
                placeholder="e.g. Carnival Jubilee"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Sailing Date <span className="text-red-500">*</span></label>
              <input type="date" value={sailing.sailingDate} onChange={(e) => setS("sailingDate", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Return Date</label>
              <input type="date" value={sailing.returnDate} onChange={(e) => setS("returnDate", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Nights</label>
              <input type="number" value={sailing.nights} onChange={(e) => setS("nights", e.target.value)}
                placeholder="7" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Itinerary</label>
              <input value={sailing.itinerary} onChange={(e) => setS("itinerary", e.target.value)}
                placeholder="Cozumel, Roatán, Belize"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Internal Notes</label>
              <textarea value={sailing.notes} onChange={(e) => setS("notes", e.target.value)}
                rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
        </div>

        {/* Cabin Inventory */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold text-blue-900 text-lg">
              Cabin Inventory
              {cabins.length > 0 && <span className="ml-2 text-sm text-gray-400 font-normal">({cabins.length} rooms)</span>}
            </h2>
            {!addingCabin && (
              <button onClick={() => setAddingCabin(true)}
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-full text-sm transition-all">
                + Add Room
              </button>
            )}
          </div>

          {byType.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {byType.map(({ type, count }) => (
                <span key={type} className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">{count} {type}</span>
              ))}
            </div>
          )}

          {addingCabin && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4">
              <div className="font-bold text-blue-900 text-sm mb-3">New Room</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
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
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Sq Ft</label>
                  <input type="number" value={cabinForm.sqft} onChange={(e) => setC("sqft", e.target.value)}
                    placeholder="185" min="0" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2 sm:col-span-4">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Notes</label>
                  <input value={cabinForm.notes} onChange={(e) => setC("notes", e.target.value)}
                    placeholder="Connecting, accessible, obstructed view…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={addCabin} disabled={!cabinForm.roomNumber || !cabinForm.deck || !cabinForm.price}
                  className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold px-5 py-2 rounded-full text-sm">
                  Add Room
                </button>
                <button onClick={() => { setAddingCabin(false); setCabinForm(blankCabin); }}
                  className="border border-gray-200 text-gray-600 font-bold px-5 py-2 rounded-full text-sm hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {cabins.length > 0 ? (
            <div className="space-y-2">
              {cabins.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex-wrap gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-extrabold text-blue-900 font-mono text-sm">Rm {c.roomNumber}</span>
                    <span className="text-gray-500 text-sm">Deck {c.deck} · {c.location} · {c.side}</span>
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{c.type}</span>
                    <span className="text-xs text-gray-400">Sleeps {c.maxGuests}</span>
                    {c.sqft > 0 && <span className="text-xs text-gray-400">{c.sqft} sq ft</span>}
                    {c.notes && <span className="text-gray-400 text-xs italic">{c.notes}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-blue-900 text-sm">${c.price}/pp</span>
                    <button onClick={() => removeCabin(c.id)} className="text-red-400 hover:text-red-600 text-xs font-bold">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🛏️</div>
              <p className="font-semibold">No rooms added yet</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end">
          <a href="/admin/room-blocks" className="px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50">Cancel</a>
          <button onClick={handleSave} disabled={!sailing.ship || !sailing.sailingDate || cabins.length === 0}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full text-sm transition-all shadow-lg">
            Save Room Block ({cabins.length} rooms) →
          </button>
        </div>
      </div>
    </div>
  );
}
