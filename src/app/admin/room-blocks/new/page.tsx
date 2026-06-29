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

  async function handleSave() {
    if (!sailing.ship || !sailing.sailingDate || cabins.length === 0) return;
    await saveSailingBlock({
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
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center gap-4">
          <a href="/admin/room-blocks" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">
            ← Room Blocks
          </a>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">New Sailing Room Block</h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Sailing Info */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h2 className="font-extrabold text-white text-lg mb-5">Sailing Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Cruise Line <span className="text-red-400">*</span></label>
              <select value={sailing.cruiseLine} onChange={(e) => setS("cruiseLine", e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400/60">
                <option value="" className="bg-[#0b1020]">Select…</option>
                {CRUISE_LINES.map((l) => <option key={l} value={l} className="bg-[#0b1020]">{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Ship Name <span className="text-red-400">*</span></label>
              <input value={sailing.ship} onChange={(e) => setS("ship", e.target.value)}
                placeholder="e.g. Carnival Jubilee"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
            </div>
            <div>
              <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Sailing Date <span className="text-red-400">*</span></label>
              <input type="date" value={sailing.sailingDate} onChange={(e) => setS("sailingDate", e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
            </div>
            <div>
              <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Return Date</label>
              <input type="date" value={sailing.returnDate} onChange={(e) => setS("returnDate", e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
            </div>
            <div>
              <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Nights</label>
              <input type="number" value={sailing.nights} onChange={(e) => setS("nights", e.target.value)}
                placeholder="7" className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
            </div>
            <div>
              <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Itinerary</label>
              <input value={sailing.itinerary} onChange={(e) => setS("itinerary", e.target.value)}
                placeholder="Cozumel, Roatán, Belize"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
            </div>
            <div className="col-span-2">
              <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Internal Notes</label>
              <textarea value={sailing.notes} onChange={(e) => setS("notes", e.target.value)}
                rows={2} className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60 resize-none" />
            </div>
          </div>
        </div>

        {/* Cabin Inventory */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold text-white text-lg">
              Cabin Inventory
              {cabins.length > 0 && <span className="ml-2 text-sm text-white/40 font-normal">({cabins.length} rooms)</span>}
            </h2>
            {!addingCabin && (
              <button onClick={() => setAddingCabin(true)}
                className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-4 py-2 rounded-full text-sm transition-all">
                + Add Room
              </button>
            )}
          </div>

          {byType.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {byType.map(({ type, count }) => (
                <span key={type} className="bg-sky-500/15 text-sky-300 border border-sky-400/25 text-xs font-bold px-3 py-1.5 rounded-full">{count} {type}</span>
              ))}
            </div>
          )}

          {addingCabin && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4">
              <div className="font-bold text-white text-sm mb-3">New Room</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Room # *</label>
                  <input value={cabinForm.roomNumber} onChange={(e) => setC("roomNumber", e.target.value)}
                    placeholder="4121" className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
                </div>
                <div>
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Deck *</label>
                  <input type="number" value={cabinForm.deck} onChange={(e) => setC("deck", e.target.value)}
                    placeholder="4" min="1" max="25" className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
                </div>
                <div>
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Type</label>
                  <select value={cabinForm.type} onChange={(e) => setC("type", e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400/60">
                    {CABIN_CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0b1020]">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">$/person *</label>
                  <input type="number" value={cabinForm.price} onChange={(e) => setC("price", e.target.value)}
                    placeholder="649" min="0" className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
                </div>
                <div>
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Location</label>
                  <select value={cabinForm.location} onChange={(e) => setC("location", e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400/60">
                    {CABIN_LOCATIONS.map((l) => <option key={l} value={l} className="bg-[#0b1020]">{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Side</label>
                  <select value={cabinForm.side} onChange={(e) => setC("side", e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400/60">
                    {CABIN_SIDES.map((s) => <option key={s} value={s} className="bg-[#0b1020]">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Max Guests</label>
                  <select value={cabinForm.maxGuests} onChange={(e) => setC("maxGuests", e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400/60">
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n} className="bg-[#0b1020]">{n} guest{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Sq Ft</label>
                  <input type="number" value={cabinForm.sqft} onChange={(e) => setC("sqft", e.target.value)}
                    placeholder="185" min="0" className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
                </div>
                <div className="col-span-2 sm:col-span-4">
                  <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Notes</label>
                  <input value={cabinForm.notes} onChange={(e) => setC("notes", e.target.value)}
                    placeholder="Connecting, accessible, obstructed view…"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={addCabin} disabled={!cabinForm.roomNumber || !cabinForm.deck || !cabinForm.price}
                  className="bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold uppercase tracking-wider px-5 py-2 rounded-full text-sm">
                  Add Room
                </button>
                <button onClick={() => { setAddingCabin(false); setCabinForm(blankCabin); }}
                  className="border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 font-semibold px-5 py-2 rounded-full text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {cabins.length > 0 ? (
            <div className="space-y-2">
              {cabins.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/10 flex-wrap gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-extrabold text-white font-mono text-sm">Rm {c.roomNumber}</span>
                    <span className="text-white/55 text-sm">Deck {c.deck} · {c.location} · {c.side}</span>
                    <span className="text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-400/25 px-2 py-0.5 rounded-full">{c.type}</span>
                    <span className="text-xs text-white/40">Sleeps {c.maxGuests}</span>
                    {c.sqft > 0 && <span className="text-xs text-white/40">{c.sqft} sq ft</span>}
                    {c.notes && <span className="text-white/40 text-xs italic">{c.notes}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">${c.price}/pp</span>
                    <button onClick={() => removeCabin(c.id)} className="text-red-300 hover:text-red-200 text-xs font-bold">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/40">
              <div className="text-4xl mb-2">🛏️</div>
              <p className="font-semibold">No rooms added yet</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end">
          <a href="/admin/room-blocks" className="px-6 py-3 rounded-full border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 font-semibold text-sm">Cancel</a>
          <button onClick={handleSave} disabled={!sailing.ship || !sailing.sailingDate || cabins.length === 0}
            className="bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold uppercase tracking-wider px-8 py-3 rounded-full text-sm transition-all">
            Save Room Block ({cabins.length} rooms) →
          </button>
        </div>
      </div>
    </div>
  );
}
