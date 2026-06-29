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
import ShipDeckMap from "@/components/ShipDeckMap";

const blankGty = {
  type: "Interior" as CabinCategory,
  price: "",
  maxGuests: "2",
  qty: "1",
};

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
  const [selectedDeck, setSelectedDeck] = useState<number | null>(null);
  const [selectedCabinId, setSelectedCabinId] = useState<string | null>(null);
  const [gtyForm, setGtyForm] = useState(blankGty);
  const [addingGty, setAddingGty] = useState(false);

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
    if (selectedCabinId === cabinId) setSelectedCabinId(null);
  }

  // Open the add form pre-filled for a spot tapped on the deck map.
  function openAddAt(deck: number, location: CabinLocation, side: CabinSide) {
    setCabinForm({ ...blankCabin, deck: String(deck), location, side });
    setAddingCabin(true);
  }

  // Add N guarantee (GTY) units — guaranteed category, room assigned by cruise line.
  function addGuarantee() {
    if (!block || !gtyForm.price) return;
    const qty = Math.max(1, parseInt(gtyForm.qty) || 1);
    const units: Cabin[] = Array.from({ length: qty }, () => ({
      id: generateCabinId(),
      roomNumber: "GTY",
      deck: 0,
      location: "Midship" as CabinLocation,
      side: "Both" as CabinSide,
      type: gtyForm.type,
      maxGuests: parseInt(gtyForm.maxGuests) || 2,
      sqft: 0,
      price: parseFloat(gtyForm.price),
      status: "available",
      isGuarantee: true,
    }));
    persist({ ...block, cabins: [...block.cabins, ...units] });
    setGtyForm(blankGty);
    setAddingGty(false);
  }

  if (!block) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05070d] text-white">
        <div className="text-center text-white/45">
          <div className="text-5xl mb-3">🚢</div>
          <p className="font-bold">Room block not found.</p>
          <Link href="/admin/room-blocks" className="text-sky-400 hover:text-sky-300 text-sm mt-2 inline-block">← Back to Room Blocks</Link>
        </div>
      </div>
    );
  }

  const counts = countByStatus(block.cabins);
  const physicalCabins = block.cabins.filter((c) => !c.isGuarantee);
  const guaranteeCabins = block.cabins.filter((c) => c.isGuarantee);
  const byType = groupByType(physicalCabins);

  const decksPresent = [...new Set(physicalCabins.map((c) => c.deck))].sort(
    (a, b) => a - b
  );
  const currentDeck = selectedDeck ?? decksPresent[0] ?? 1;
  const selectedCabin = selectedCabinId
    ? block.cabins.find((c) => c.id === selectedCabinId) ?? null
    : null;

  // Guarantee inventory grouped by category
  const gtyByType = guaranteeCabins.reduce<Record<string, Cabin[]>>((acc, c) => {
    (acc[c.type] = acc[c.type] ?? []).push(c);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/admin/room-blocks" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">
            ← Room Blocks
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4 mt-2">
            <div>
              <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">{block.ship}</h1>
              <p className="text-white/55 text-sm mt-0.5">
                {block.cruiseLine} · {fmtDateShort(block.sailingDate)} · {block.nights} nights · {block.itinerary}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-green-500/15 text-green-300 border border-green-400/25 text-sm font-bold px-4 py-1.5 rounded-full">
                {counts.available} Available
              </span>
              {counts.held > 0 && (
                <span className="bg-yellow-400/15 text-yellow-300 border border-yellow-400/25 text-sm font-bold px-4 py-1.5 rounded-full">
                  {counts.held} Held
                </span>
              )}
              {counts.booked > 0 && (
                <span className="bg-red-500/15 text-red-300 border border-red-400/25 text-sm font-bold px-4 py-1.5 rounded-full">
                  {counts.booked} Booked
                </span>
              )}
              <button
                onClick={() => setAddingCabin(true)}
                className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-4 py-2 rounded-full text-sm transition-all"
              >
                + Add Room
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Add cabin form */}
        {addingCabin && (
          <div className="bg-[#0b1020] rounded-2xl border border-sky-400/30 p-6">
            <h3 className="font-extrabold text-white mb-4">Add New Room</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
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
                  {[1,2,3,4,5,6].map((n) => <option key={n} value={n} className="bg-[#0b1020]">{n} guest{n > 1 ? "s" : ""}</option>)}
                </select>
              </div>
              <div>
                <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Sq Ft</label>
                <input type="number" value={cabinForm.sqft} onChange={(e) => setC("sqft", e.target.value)}
                  placeholder="185" min="0" className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
              </div>
              <div>
                <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">Notes</label>
                <input
                  value={cabinForm.notes}
                  onChange={(e) => setC("notes", e.target.value)}
                  placeholder="Connecting…"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addCabin}
                disabled={!cabinForm.roomNumber || !cabinForm.deck || !cabinForm.price}
                className="bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold uppercase tracking-wider px-5 py-2 rounded-full text-sm"
              >
                Add Room
              </button>
              <button
                onClick={() => { setAddingCabin(false); setCabinForm(blankCabin); }}
                className="border border-white/15 text-white/80 hover:border-white/40 hover:bg-white/5 font-semibold px-5 py-2 rounded-full text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Ship deck map ─────────────────────────────────────────────── */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h3 className="font-extrabold text-white text-lg">🗺️ Ship Map</h3>
              <p className="text-white/40 text-xs">
                Pick staterooms on the deck plan. Tap a room to manage it, or “+”
                in a zone to add one there.
              </p>
            </div>
            <button
              onClick={() => setAddingCabin(true)}
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-4 py-2 rounded-full text-sm"
            >
              + Add Room
            </button>
          </div>

          {/* Deck tabs */}
          {decksPresent.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {decksPresent.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDeck(d);
                    setSelectedCabinId(null);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                    currentDeck === d
                      ? "bg-white text-black"
                      : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  Deck {d}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-sm mb-4">
              No physical rooms yet — add one to start mapping the deck.
            </p>
          )}

          <ShipDeckMap
            cabins={physicalCabins}
            deck={currentDeck}
            selectedId={selectedCabinId ?? undefined}
            onSelectCabin={(c) => setSelectedCabinId(c.id)}
            onAddAt={(loc, side) => openAddAt(currentDeck, loc, side)}
          />

          {/* Selected cabin actions */}
          {selectedCabin && !selectedCabin.isGuarantee && (
            <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap text-sm">
                <span className="text-xl">{CATEGORY_ICON[selectedCabin.type]}</span>
                <span className="font-extrabold text-white font-mono">
                  Room {selectedCabin.roomNumber}
                </span>
                <span className="text-white/55">
                  Deck {selectedCabin.deck} · {selectedCabin.location} ·{" "}
                  {selectedCabin.side} · {selectedCabin.type}
                </span>
                <span className="font-bold text-white">
                  {fmt$(selectedCabin.price)}
                  <span className="text-white/40 text-xs font-normal">/pp</span>
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[selectedCabin.status]}`}
                >
                  {selectedCabin.status}
                  {selectedCabin.guestName ? ` · ${selectedCabin.guestName}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedCabin.status === "available" && (
                  <>
                    <button
                      onClick={() => {
                        const guest = prompt("Guest name for hold (optional):");
                        updateStatus(selectedCabin.id, "held", {
                          guestName: guest ?? undefined,
                          heldUntil: new Date(Date.now() + 48 * 3600000).toISOString(),
                        });
                      }}
                      className="bg-yellow-400/15 hover:bg-yellow-400/25 text-yellow-300 border border-yellow-400/25 text-xs font-bold px-3 py-1.5 rounded-full"
                    >
                      Hold
                    </button>
                    <button
                      onClick={() => {
                        const guest = prompt("Guest name:");
                        if (!guest) return;
                        updateStatus(selectedCabin.id, "booked", { guestName: guest });
                      }}
                      className="bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-400/25 text-xs font-bold px-3 py-1.5 rounded-full"
                    >
                      Book
                    </button>
                  </>
                )}
                {(selectedCabin.status === "held" ||
                  selectedCabin.status === "booked") && (
                  <button
                    onClick={() =>
                      updateStatus(selectedCabin.id, "available", {
                        guestName: undefined,
                      })
                    }
                    className="bg-green-500/15 hover:bg-green-500/25 text-green-300 border border-green-400/25 text-xs font-bold px-3 py-1.5 rounded-full"
                  >
                    Release
                  </button>
                )}
                <button
                  onClick={() => removeCabin(selectedCabin.id)}
                  className="text-red-300 hover:text-red-200 text-xs font-bold px-2"
                >
                  Remove ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Guarantee (GTY) inventory ─────────────────────────────────── */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <div>
              <h3 className="font-extrabold text-white text-lg">
                🎟️ Guarantee (GTY) Inventory
              </h3>
              <p className="text-white/40 text-xs">
                Sell a guaranteed category without a specific room — the cruise
                line assigns the exact cabin later. Great for “available anywhere
                on the ship.”
              </p>
            </div>
            <button
              onClick={() => setAddingGty((v) => !v)}
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-4 py-2 rounded-full text-sm"
            >
              {addingGty ? "Cancel" : "+ Add GTY"}
            </button>
          </div>

          {addingGty && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end mt-3 mb-4 bg-white/5 border border-white/10 rounded-xl p-4">
              <div>
                <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">
                  Category
                </label>
                <select
                  value={gtyForm.type}
                  onChange={(e) =>
                    setGtyForm((f) => ({ ...f, type: e.target.value as CabinCategory }))
                  }
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400/60"
                >
                  {CABIN_CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0b1020]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">
                  $/person *
                </label>
                <input
                  type="number"
                  value={gtyForm.price}
                  onChange={(e) =>
                    setGtyForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="599"
                  min="0"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                />
              </div>
              <div>
                <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">
                  Max Guests
                </label>
                <select
                  value={gtyForm.maxGuests}
                  onChange={(e) =>
                    setGtyForm((f) => ({ ...f, maxGuests: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400/60"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n} className="bg-[#0b1020]">
                      {n} guest{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1">
                  How many?
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={gtyForm.qty}
                    onChange={(e) =>
                      setGtyForm((f) => ({ ...f, qty: e.target.value }))
                    }
                    min="1"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
                  />
                  <button
                    onClick={addGuarantee}
                    disabled={!gtyForm.price}
                    className="bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold uppercase tracking-wider px-4 py-2 rounded-full text-sm whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {guaranteeCabins.length === 0 ? (
            <p className="text-white/40 text-sm mt-2">No guarantee inventory yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3 mt-3">
              {CABIN_CATEGORIES.filter((t) => gtyByType[t]?.length).map((type) => {
                const units = gtyByType[type];
                const avail = units.filter((u) => u.status === "available").length;
                const minPrice = Math.min(...units.map((u) => u.price));
                return (
                  <div
                    key={type}
                    className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3"
                  >
                    <span className="text-2xl">{CATEGORY_ICON[type]}</span>
                    <div>
                      <div className="font-extrabold text-white text-sm">
                        {type} GTY
                      </div>
                      <div className="text-white/55 text-xs">
                        {avail} of {units.length} available · from {fmt$(minPrice)}/pp
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const last = units[units.length - 1];
                        if (last) removeCabin(last.id);
                      }}
                      className="text-red-300 hover:text-red-200 text-xs font-bold ml-1"
                      title="Remove one unit"
                    >
                      −1
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rooms grouped by type */}
        {CABIN_CATEGORIES.filter((t) => byType[t]?.length > 0).map((type) => {
          const cabins = byType[type];
          const avail = cabins.filter((c) => c.status === "available").length;
          return (
            <div key={type} className="bg-[#0b1020] rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{CATEGORY_ICON[type as CabinCategory]}</span>
                  <h3 className="font-extrabold text-white text-lg">{type}</h3>
                  <span className="text-sm text-white/40">{cabins.length} room{cabins.length !== 1 ? "s" : ""}</span>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${avail > 0 ? "bg-green-500/15 text-green-300 border border-green-400/25" : "bg-red-500/15 text-red-300 border border-red-400/25"}`}>
                  {avail} of {cabins.length} available
                </span>
              </div>

              <div className="divide-y divide-white/10">
                {cabins.sort((a, b) => a.deck - b.deck || a.roomNumber.localeCompare(b.roomNumber)).map((cabin) => (
                  <div key={cabin.id} className="px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="font-extrabold text-white font-mono text-base">
                        Room {cabin.roomNumber}
                      </span>
                      <div className="flex items-center gap-1.5 text-sm text-white/55">
                        <span className="font-semibold">Deck {cabin.deck}</span>
                        <span>·</span>
                        <span>{cabin.location}</span>
                        <span>·</span>
                        <span>{cabin.side}</span>
                      </div>
                      <span className="text-xs text-white/40">Sleeps {cabin.maxGuests}</span>
                      {cabin.sqft > 0 && <span className="text-xs text-white/40">{cabin.sqft} sq ft</span>}
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[cabin.status]}`}>
                        {cabin.status}
                      </span>
                      {cabin.notes && (
                        <span className="text-xs text-white/40 italic">{cabin.notes}</span>
                      )}
                      {cabin.guestName && (
                        <span className="text-xs font-bold text-sky-300 bg-sky-500/15 border border-sky-400/25 px-2 py-0.5 rounded-full">
                          {cabin.guestName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-white">{fmt$(cabin.price)}<span className="text-white/40 text-xs font-normal">/pp</span></span>

                      {/* Status controls */}
                      {cabin.status === "available" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const guest = prompt("Guest name for hold (optional):");
                              updateStatus(cabin.id, "held", { guestName: guest ?? undefined, heldUntil: new Date(Date.now() + 48 * 3600000).toISOString() });
                            }}
                            className="bg-yellow-400/15 hover:bg-yellow-400/25 text-yellow-300 border border-yellow-400/25 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                          >
                            Hold
                          </button>
                          <button
                            onClick={() => {
                              const guest = prompt("Guest name:");
                              if (!guest) return;
                              updateStatus(cabin.id, "booked", { guestName: guest });
                            }}
                            className="bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-400/25 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                          >
                            Book
                          </button>
                        </div>
                      )}
                      {(cabin.status === "held" || cabin.status === "booked") && (
                        <button
                          onClick={() => updateStatus(cabin.id, "available", { guestName: undefined })}
                          className="bg-green-500/15 hover:bg-green-500/25 text-green-300 border border-green-400/25 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                        >
                          Release
                        </button>
                      )}
                      <button
                        onClick={() => removeCabin(cabin.id)}
                        className="text-red-300 hover:text-red-200 text-xs font-bold"
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
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-16 text-center text-white/40">
            <div className="text-5xl mb-3">🛏️</div>
            <p className="font-bold">No rooms in this block yet</p>
            <button onClick={() => setAddingCabin(true)} className="mt-4 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-6 py-2 rounded-full text-sm">
              Add First Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
