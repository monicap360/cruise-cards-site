"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { fmt$, fmtDateDow } from "@/lib/sea-pay";
import Photo from "@/components/Photo";
import { destinationFor, portsFromItinerary } from "@/lib/destinations";
import { getSailingBlock, type SailingBlock } from "@/lib/room-blocks";

function shipSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const DEPOSIT_PP = 50;
const HOTEL_PER_NIGHT = 139; // estimated pre/post-cruise hotel rate per room/night

// ── Add-ons (NOT inventory — estimated, confirmed by a specialist) ─────────────
type AddonId =
  | "gratuities"
  | "protection"
  | "shuttle"
  | "airHou"
  | "airIah";

type Addon = {
  id: AddonId;
  label: string;
  note: string;
  // Compute the price for the whole party.
  price: (guests: number, nights: number) => number;
};

const ADDONS: Addon[] = [
  {
    id: "gratuities",
    label: "Gratuities / tips",
    note: "$16.50 per person, per night",
    price: (guests, nights) => 16.5 * guests * nights,
  },
  {
    id: "protection",
    label: "Vacation protection",
    note: "$79 per person",
    price: (guests) => 79 * guests,
  },
  {
    id: "shuttle",
    label: "Hotel → terminal shuttle",
    note: "$8 per person",
    price: (guests) => 8 * guests,
  },
  {
    id: "airHou",
    label: "Airport transfer (HOU — Hobby)",
    note: "$65 per person",
    price: (guests) => 65 * guests,
  },
  {
    id: "airIah",
    label: "Airport transfer (IAH — Bush)",
    note: "$89 per person",
    price: (guests) => 89 * guests,
  },
];

// ── Discounts — selecting any applies a single 5% cruise-fare discount ─────────
const DISCOUNTS: { id: string; label: string }[] = [
  { id: "military", label: "Military (active or veteran)" },
  { id: "firstResponder", label: "First responder (police / fire / EMS)" },
  { id: "senior", label: "Senior (55+)" },
  { id: "teacher", label: "Teacher / educator" },
];
const DISCOUNT_RATE = 0.05;

const ACKS: { id: string; label: string }[] = [
  {
    id: "extras",
    label:
      "I understand vacation protection and gratuities (tips) are not included in the cruise price.",
  },
  {
    id: "deposit",
    label:
      "I understand a deposit is required to confirm this cabin, and that deposits on non-refundable fares are non-refundable.",
  },
  {
    id: "final",
    label:
      "I understand I must pay my balance in full by my final payment date (roughly 90 days before the sail date) — if I do not, the cruise line's system will automatically cancel my reservation.",
  },
  {
    id: "latepayment",
    label:
      "I understand that if I pass my final payment date, the cruise line will automatically cancel my reservation, and that cancellation penalties imposed by the cruise line will apply — these can include loss of deposit and additional charges depending on how close to the sail date it is (cruise-line rules, not ours). Re-booking depends on the cabin and sailing still being available, and is subject to the cruise line's current price and any cruise-line rebooking fees, plus a $250 service fee for us to rebuild the booking — if it can still be put back the way it was.",
  },
  {
    id: "authorize",
    label:
      "I authorize Cruises from Galveston to hold this cabin and contact me to arrange my deposit. No card is charged on this website.",
  },
];

function confirmNumber() {
  return "CFG-" + Math.random().toString(36).toUpperCase().substring(2, 8);
}

// One guest's editable details.
type GuestForm = {
  first: string;
  last: string;
  dob: string;
  email: string;
  phone: string;
  loyalty: string;
};

function emptyGuest(): GuestForm {
  return { first: "", last: "", dob: "", email: "", phone: "", loyalty: "" };
}

// A selectable cabin tier built from live inventory (or the query fallback).
type Tier = {
  category: string;
  fromPrice: number;
  available: number;
};

function BookCabinContent() {
  const params = useSearchParams();

  // ── Sailing context (from query, then enriched by live block) ───────────────
  const [ship, setShip] = useState("");
  const [sailDate, setSailDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [nights, setNights] = useState(0);
  const [itinerary, setItinerary] = useState("");
  const [cruiseLine, setCruiseLine] = useState("");
  const [dest, setDest] = useState("");

  // Fallback (single cabin) coming straight from the query string.
  const [queryType, setQueryType] = useState("");
  const [queryPrice, setQueryPrice] = useState(0);

  // Live block (if we can resolve one).
  const [block, setBlock] = useState<SailingBlock | null>(null);

  // ── Selection state ─────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [discounts, setDiscounts] = useState<Record<string, boolean>>({});

  // Pre/post-cruise hotel + flights
  const [preHotel, setPreHotel] = useState(false);
  const [preNights, setPreNights] = useState(1);
  const [postHotel, setPostHotel] = useState(false);
  const [postNights, setPostNights] = useState(1);
  const [hotelRooms, setHotelRooms] = useState(1);
  const [flights, setFlights] = useState(false);
  const [flightCity, setFlightCity] = useState("");

  // ── Guests ──────────────────────────────────────────────────────────────────
  const [guests, setGuests] = useState("2");
  const numGuests = Number(guests) || 1;
  const [guestList, setGuestList] = useState<GuestForm[]>([
    emptyGuest(),
    emptyGuest(),
  ]);

  // ── Emergency contact ───────────────────────────────────────────────────────
  const [emName, setEmName] = useState("");
  const [emPhone, setEmPhone] = useState("");
  const [emRelation, setEmRelation] = useState("");

  const [notes, setNotes] = useState("");
  const [acks, setAcks] = useState<Record<string, boolean>>({});

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [confirm, setConfirm] = useState("");

  // ── Read query params on mount ──────────────────────────────────────────────
  useEffect(() => {
    setShip(params.get("ship") ?? "");
    setSailDate(params.get("date") ?? "");
    setCruiseLine(params.get("line") ?? "");
    setDest(params.get("dest") ?? "");
    setQueryType(params.get("type") ?? "");
    const p = Number(params.get("price"));
    if (!Number.isNaN(p) && p > 0) setQueryPrice(p);
    const g = params.get("guests");
    if (g && Number(g) > 0) setGuests(g);
  }, [params]);

  // ── Resolve the live sailing block ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const id = params.get("id");
      const qShip = params.get("ship") ?? "";
      const qDate = params.get("date") ?? "";
      let found: SailingBlock | null = null;
      if (id) {
        found = await getSailingBlock(id);
      } else if (qShip && qDate) {
        try {
          const res = await fetch("/api/sailings");
          if (res.ok) {
            const blocks = (await res.json()) as SailingBlock[];
            found =
              blocks.find(
                (b) => b.ship === qShip && b.sailingDate === qDate
              ) ?? null;
          }
        } catch {
          found = null;
        }
      }
      if (cancelled || !found) return;
      setBlock(found);
      setShip(found.ship);
      setSailDate(found.sailingDate);
      setReturnDate(found.returnDate);
      setNights(found.nights);
      setItinerary(found.itinerary);
      if (found.cruiseLine) setCruiseLine(found.cruiseLine);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params]);

  // ── Keep the guest list length in sync with the guest count ────────────────
  useEffect(() => {
    setGuestList((prev) => {
      if (prev.length === numGuests) return prev;
      const next = prev.slice(0, numGuests);
      while (next.length < numGuests) next.push(emptyGuest());
      return next;
    });
  }, [numGuests]);

  // ── Build selectable tiers from live inventory ──────────────────────────────
  const tiers = useMemo<Tier[]>(() => {
    if (!block) return [];
    const map = new Map<string, { from: number; available: number }>();
    for (const c of block.cabins) {
      if (c.status !== "available") continue;
      const entry = map.get(c.type) ?? { from: Infinity, available: 0 };
      entry.from = Math.min(entry.from, c.price);
      entry.available += 1;
      map.set(c.type, entry);
    }
    return Array.from(map.entries())
      .map(([category, v]) => ({
        category,
        fromPrice: v.from === Infinity ? 0 : v.from,
        available: v.available,
      }))
      .sort((a, b) => a.fromPrice - b.fromPrice);
  }, [block]);

  // Auto-select a sensible tier once data is known.
  useEffect(() => {
    if (selectedCategory) return;
    if (tiers.length > 0) {
      // Prefer the tier matching the query type, else cheapest.
      const match =
        (queryType && tiers.find((t) => t.category === queryType)) || tiers[0];
      setSelectedCategory(match.category);
      setSelectedPrice(match.fromPrice);
    } else if (queryType || queryPrice) {
      // No block → fall back to the single cabin from the query.
      setSelectedCategory(queryType);
      setSelectedPrice(queryPrice);
    }
  }, [tiers, queryType, queryPrice, selectedCategory]);

  function pickTier(t: Tier) {
    setSelectedCategory(t.category);
    setSelectedPrice(t.fromPrice);
  }

  function updateGuest(i: number, patch: Partial<GuestForm>) {
    setGuestList((prev) =>
      prev.map((g, idx) => (idx === i ? { ...g, ...patch } : g))
    );
  }

  // ── Photo ───────────────────────────────────────────────────────────────────
  const firstPort = itinerary ? portsFromItinerary(itinerary)[0] : "";
  const destInfo = firstPort
    ? destinationFor(firstPort)
    : dest
      ? destinationFor(dest)
      : null;
  const photoSrc = destInfo
    ? `/destinations/${destInfo.slug}.jpg`
    : ship
      ? `/ships/${shipSlug(ship)}.jpg`
      : "";
  const photoGradient = destInfo?.gradient ?? "from-blue-700 to-[#0a1f44]";

  // ── Pricing math ────────────────────────────────────────────────────────────
  const cruiseFare = selectedPrice > 0 ? selectedPrice * numGuests : 0;
  const effectiveNights = nights > 0 ? nights : 7; // for gratuities estimate

  const selectedAddons = ADDONS.filter((a) => addons[a.id]).map((a) => ({
    ...a,
    amount: a.price(numGuests, effectiveNights),
  }));
  const addonsTotal = selectedAddons.reduce((s, a) => s + a.amount, 0);

  const anyDiscount = DISCOUNTS.some((d) => discounts[d.id]);
  const discountAmount = anyDiscount ? cruiseFare * DISCOUNT_RATE : 0;

  const hotelNights = (preHotel ? preNights : 0) + (postHotel ? postNights : 0);
  const hotelTotal = hotelNights * HOTEL_PER_NIGHT * Math.max(1, hotelRooms);

  const estimatedTotal =
    Math.max(0, cruiseFare - discountAmount) + addonsTotal + hotelTotal;
  const depositTotal = DEPOSIT_PP * numGuests;

  const today = new Date().toISOString().slice(0, 10);

  // ── Validation ──────────────────────────────────────────────────────────────
  const allAcked = ACKS.every((a) => acks[a.id]);
  const guestsOk = guestList.every((g, i) => {
    const base = g.first && g.last && g.dob;
    if (i === 0) return base && g.email && g.phone;
    return base;
  });
  const emergencyOk = emName && emPhone;
  const tierOk = !!selectedCategory;
  const canSubmit =
    tierOk && guestsOk && emergencyOk && allAcked && !submitting;

  const lead = guestList[0] ?? emptyGuest();

  async function submit() {
    setSubmitting(true);
    const num = confirmNumber();

    const guestLines = guestList
      .map((g, i) => {
        const tag = i === 0 ? "Guest 1 (Lead)" : `Guest ${i + 1}`;
        const contact =
          i === 0 ? ` | ${g.email} | ${g.phone}` : "";
        const loy = g.loyalty ? ` | Loyalty #${g.loyalty}` : "";
        return `${tag}: ${g.first} ${g.last} | DOB ${g.dob}${contact}${loy}.`;
      })
      .join(" ");

    const addonLines =
      selectedAddons.length > 0
        ? " Add-ons (estimated): " +
          selectedAddons
            .map((a) => `${a.label} ${fmt$(a.amount)}`)
            .join(", ") +
          "."
        : " Add-ons: none.";

    const discountLine = anyDiscount
      ? ` Discount: ${DISCOUNTS.filter((d) => discounts[d.id])
          .map((d) => d.label)
          .join(", ")} → −${fmt$(discountAmount)} (5%).`
      : " Discount: none.";

    const hotelLine =
      hotelNights > 0
        ? ` Hotel: ${preHotel ? `${preNights} pre-cruise night(s)` : ""}${
            preHotel && postHotel ? " + " : ""
          }${postHotel ? `${postNights} post-cruise night(s)` : ""} × ${Math.max(
            1,
            hotelRooms
          )} room(s) ≈ ${fmt$(hotelTotal)} (est).`
        : "";
    const flightLine = flights
      ? ` Flights: please quote — flying from ${flightCity || "(city TBD)"}.`
      : "";

    const em = ` Emergency contact: ${emName}${
      emRelation ? ` (${emRelation})` : ""
    } | ${emPhone}.`;

    const message =
      `CABIN BOOKING REQUEST — ${selectedCategory || "cabin"} on ${ship} ${sailDate}` +
      `${nights ? ` (${nights} nights)` : ""}. ` +
      `From ${fmt$(selectedPrice)}/pp × ${numGuests} = ${fmt$(cruiseFare)} cruise fare.` +
      `${discountLine}${addonLines}${hotelLine}${flightLine}` +
      ` Estimated total ${fmt$(estimatedTotal)} · deposit ${fmt$(depositTotal)}.` +
      ` ${guestLines}${em}` +
      (notes ? ` Notes: ${notes}` : "") +
      " Acknowledged all booking terms.";

    const row: Record<string, unknown> = {
      confirm_number: num,
      first_name: lead.first,
      last_name: lead.last,
      email: lead.email,
      phone: lead.phone,
      ship,
      sail_date: sailDate,
      rate_type: anyDiscount ? "discounted" : "standard",
      guests,
      cabin_type: selectedCategory,
      crew: "",
      message,
      appt_date: "",
      appt_time: "",
      mode: "booking",
    };

    await supabase.from("inquiries").insert(row);
    setConfirm(num);
    setDone(true);
    setSubmitting(false);
  }

  const field =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block text-white/70 text-sm font-medium mb-1";

  // ── Confirmation screen ─────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-[#05070d] flex items-center justify-center px-4 py-16">
        <div className="bg-[#0b1020] rounded-3xl border border-white/10 p-10 max-w-lg w-full text-center">
          <div className="text-4xl mb-3 text-sky-400">✓</div>
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] text-white mb-2">
            Reservation Requested
          </h2>
          <div className="text-white/45 font-mono text-sm mb-6">
            Confirmation #{confirm}
          </div>
          <div className="bg-sky-400/10 border border-sky-400/20 rounded-2xl p-5 mb-6 text-left text-sm text-white/60 space-y-1">
            <div>
              <strong className="text-white/80">Ship:</strong> {ship}
            </div>
            {sailDate && (
              <div>
                <strong className="text-white/80">Sails:</strong>{" "}
                {fmtDateDow(sailDate)}
              </div>
            )}
            {selectedCategory && (
              <div>
                <strong className="text-white/80">Cabin:</strong>{" "}
                {selectedCategory}
              </div>
            )}
            {selectedPrice > 0 && (
              <div>
                <strong className="text-white/80">From:</strong>{" "}
                {fmt$(selectedPrice)}/person · est. total{" "}
                {fmt$(estimatedTotal)} · deposit {fmt$(depositTotal)}
              </div>
            )}
            <div>
              <strong className="text-white/80">Guest:</strong> {lead.first}{" "}
              {lead.last}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-left text-sm text-white/60 space-y-2">
            <div className="font-extrabold text-white">What happens next?</div>
            <div>
              We&rsquo;ll email your{" "}
              <strong className="text-white/80">
                cruise-line secure payment link
              </strong>{" "}
              to <strong className="text-white/80">{lead.email}</strong> and a
              specialist will confirm availability.{" "}
              <strong className="text-white/80">
                No card is charged on this website.
              </strong>
            </div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/sailings"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-6 py-3 rounded-full text-sm transition-all"
            >
              Browse More Sailings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#05070d]">
      {/* Hero */}
      <div className="relative">
        {(photoSrc || ship) && (
          <div className="relative h-56 sm:h-72">
            <Photo
              src={photoSrc}
              fallbackSrc={ship ? `/ships/${shipSlug(ship)}.jpg` : undefined}
              alt={destInfo ? `${destInfo.name}, ${destInfo.country}` : ship}
              gradient={photoGradient}
              overlay={false}
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/55 to-[#05070d]/20" />
            <div className="absolute inset-0 grid-bg opacity-20" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/90 mb-1">
              {"// Reserve your cabin"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.01em] text-white drop-shadow">
              {ship || "Reserve Your Cabin"}
            </h1>
            <div className="text-white/70 text-sm mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
              {cruiseLine && <span>{cruiseLine}</span>}
              {sailDate && (
                <span>
                  Sails {fmtDateDow(sailDate)}
                  {returnDate ? ` → returns ${fmtDateDow(returnDate)}` : ""}
                </span>
              )}
              {nights > 0 && <span>{nights} nights</span>}
            </div>
            {itinerary && (
              <div className="text-white/55 text-xs mt-1">{itinerary}</div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* ── LEFT: the form ── */}
          <div className="space-y-5">
            {/* Cabin tier selection */}
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
              <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/80 mb-1">
                {"// Choose your cabin"}
              </div>
              <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-4">
                Cabin Tier
              </h3>
              {tiers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tiers.map((t) => {
                    const active = selectedCategory === t.category;
                    const popular = /balcony/i.test(t.category);
                    return (
                      <button
                        key={t.category}
                        type="button"
                        onClick={() => pickTier(t)}
                        className={`relative text-left rounded-xl border p-4 transition-all ${
                          active
                            ? "border-sky-400/70 bg-sky-400/10 ring-1 ring-sky-400/40"
                            : "border-white/15 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        {popular && (
                          <span className="absolute top-3 right-3 text-[9px] uppercase tracking-wider font-bold text-sky-300 bg-sky-400/15 border border-sky-400/30 rounded-full px-2 py-0.5">
                            Most popular
                          </span>
                        )}
                        <div className="text-white font-extrabold">
                          {t.category}
                        </div>
                        <div className="text-holo font-bold mt-1">
                          from {fmt$(t.fromPrice)}{" "}
                          <span className="text-white/40 text-xs font-normal">
                            / person
                          </span>
                        </div>
                        <div className="text-white/45 text-xs mt-1">
                          {t.available} available
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : selectedCategory ? (
                <div className="rounded-xl border border-sky-400/50 bg-sky-400/10 p-4">
                  <div className="text-white font-extrabold">
                    {selectedCategory}
                  </div>
                  {selectedPrice > 0 && (
                    <div className="text-holo font-bold mt-1">
                      from {fmt$(selectedPrice)}{" "}
                      <span className="text-white/40 text-xs font-normal">
                        / person
                      </span>
                    </div>
                  )}
                  <div className="text-white/45 text-xs mt-1">
                    Availability confirmed by your specialist.
                  </div>
                </div>
              ) : (
                <div className="text-white/45 text-sm">
                  Loading live cabin availability…
                </div>
              )}
            </div>

            {/* Guests */}
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
              <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-4">
                Guests
              </h3>
              <div className="max-w-[200px] mb-5">
                <label className={lbl}>Number of Guests</label>
                <select
                  className={field}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} guest{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-6">
                {guestList.map((g, i) => (
                  <div
                    key={i}
                    className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0"
                  >
                    <div className="text-white font-bold text-sm mb-3">
                      Guest {i + 1}
                      {i === 0 && (
                        <span className="text-sky-400/80 font-normal">
                          {" "}
                          (Lead Guest)
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>First Name *</label>
                        <input
                          className={field}
                          value={g.first}
                          onChange={(e) =>
                            updateGuest(i, { first: e.target.value })
                          }
                          placeholder="Jane"
                        />
                      </div>
                      <div>
                        <label className={lbl}>Last Name *</label>
                        <input
                          className={field}
                          value={g.last}
                          onChange={(e) =>
                            updateGuest(i, { last: e.target.value })
                          }
                          placeholder="Smith"
                        />
                      </div>
                      <div>
                        <label className={lbl}>Date of Birth *</label>
                        <input
                          type="date"
                          max={today}
                          className={field}
                          value={g.dob}
                          onChange={(e) =>
                            updateGuest(i, { dob: e.target.value })
                          }
                        />
                      </div>
                      {i === 0 ? (
                        <div>
                          <label className={lbl}>Phone *</label>
                          <input
                            type="tel"
                            className={field}
                            value={g.phone}
                            onChange={(e) =>
                              updateGuest(i, { phone: e.target.value })
                            }
                            placeholder="(409) 555-0100"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className={lbl}>
                            Loyalty # (VIFP / Crown &amp; Anchor / Latitudes)
                          </label>
                          <input
                            className={field}
                            value={g.loyalty}
                            onChange={(e) =>
                              updateGuest(i, { loyalty: e.target.value })
                            }
                            placeholder="Optional"
                          />
                        </div>
                      )}
                      {i === 0 && (
                        <>
                          <div className="sm:col-span-2">
                            <label className={lbl}>Email *</label>
                            <input
                              type="email"
                              className={field}
                              value={g.email}
                              onChange={(e) =>
                                updateGuest(i, { email: e.target.value })
                              }
                              placeholder="you@example.com"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className={lbl}>
                              Loyalty # (VIFP / Crown &amp; Anchor / Latitudes)
                            </label>
                            <input
                              className={field}
                              value={g.loyalty}
                              onChange={(e) =>
                                updateGuest(i, { loyalty: e.target.value })
                              }
                              placeholder="Optional"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
              <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-1">
                Add-ons
              </h3>
              <p className="text-white/40 text-xs mb-4">
                Estimated — confirmed by your specialist.
              </p>
              <div className="space-y-2">
                {ADDONS.map((a) => {
                  const amount = a.price(numGuests, effectiveNights);
                  const on = !!addons[a.id];
                  return (
                    <label
                      key={a.id}
                      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                        on
                          ? "border-sky-400/60 bg-sky-400/10"
                          : "border-white/15 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={(e) =>
                          setAddons((s) => ({
                            ...s,
                            [a.id]: e.target.checked,
                          }))
                        }
                        className="accent-sky-500 w-4 h-4 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold">
                          {a.label}
                        </div>
                        <div className="text-white/40 text-xs">{a.note}</div>
                      </div>
                      <div className="text-holo font-bold text-sm whitespace-nowrap">
                        {fmt$(amount)}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Pre & Post-Cruise */}
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
              <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-1">
                Pre &amp; Post-Cruise
              </h3>
              <p className="text-white/40 text-xs mb-4">
                Make a trip of it — add hotel nights near the port and let us book your flights.
                Hotel is an estimate; flights are quoted by your specialist.
              </p>
              <div className="space-y-3">
                {/* Pre-cruise hotel */}
                <div className={`rounded-xl border p-3 transition-all ${preHotel ? "border-sky-400/60 bg-sky-400/10" : "border-white/15 bg-white/5"}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={preHotel} onChange={(e) => setPreHotel(e.target.checked)} className="accent-sky-500 w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-white text-sm font-semibold">Pre-cruise hotel (night before)</span>
                    <span className="text-white/40 text-xs">~{fmt$(HOTEL_PER_NIGHT)}/night/room</span>
                  </label>
                  {preHotel && (
                    <div className="mt-3 flex items-center gap-2 pl-7">
                      <span className="text-white/60 text-xs">Nights</span>
                      <input type="number" min={1} value={preNights} onChange={(e) => setPreNights(Math.max(1, Number(e.target.value)))} className="w-20 bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-sky-400/60" />
                    </div>
                  )}
                </div>
                {/* Post-cruise hotel */}
                <div className={`rounded-xl border p-3 transition-all ${postHotel ? "border-sky-400/60 bg-sky-400/10" : "border-white/15 bg-white/5"}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={postHotel} onChange={(e) => setPostHotel(e.target.checked)} className="accent-sky-500 w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-white text-sm font-semibold">Post-cruise hotel (night after)</span>
                    <span className="text-white/40 text-xs">~{fmt$(HOTEL_PER_NIGHT)}/night/room</span>
                  </label>
                  {postHotel && (
                    <div className="mt-3 flex items-center gap-2 pl-7">
                      <span className="text-white/60 text-xs">Nights</span>
                      <input type="number" min={1} value={postNights} onChange={(e) => setPostNights(Math.max(1, Number(e.target.value)))} className="w-20 bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-sky-400/60" />
                    </div>
                  )}
                </div>
                {(preHotel || postHotel) && (
                  <div className="flex items-center gap-2 pl-1">
                    <span className="text-white/60 text-xs">Hotel rooms</span>
                    <input type="number" min={1} value={hotelRooms} onChange={(e) => setHotelRooms(Math.max(1, Number(e.target.value)))} className="w-20 bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-sky-400/60" />
                  </div>
                )}
                {/* Flights */}
                <div className={`rounded-xl border p-3 transition-all ${flights ? "border-sky-400/60 bg-sky-400/10" : "border-white/15 bg-white/5"}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={flights} onChange={(e) => setFlights(e.target.checked)} className="accent-sky-500 w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-white text-sm font-semibold">Book my flights (into Houston IAH/HOU)</span>
                    <span className="text-white/40 text-xs">Quoted</span>
                  </label>
                  {flights && (
                    <div className="mt-3 pl-7">
                      <input value={flightCity} onChange={(e) => setFlightCity(e.target.value)} placeholder="Flying from? (city or airport)" className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Discounts */}
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
              <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-1">
                Discounts
              </h3>
              <p className="text-white/40 text-xs mb-4">
                Select any that apply — one 5% discount on your cruise fare.
                Proof may be required at booking.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DISCOUNTS.map((d) => (
                  <label
                    key={d.id}
                    className="flex items-center gap-3 text-sm text-white/70 cursor-pointer rounded-xl border border-white/15 bg-white/5 p-3 hover:border-white/30"
                  >
                    <input
                      type="checkbox"
                      checked={!!discounts[d.id]}
                      onChange={(e) =>
                        setDiscounts((s) => ({
                          ...s,
                          [d.id]: e.target.checked,
                        }))
                      }
                      className="accent-sky-500 w-4 h-4 flex-shrink-0"
                    />
                    {d.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Emergency contact */}
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
              <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-4">
                Emergency Contact{" "}
                <span className="text-white/45 text-sm font-normal">
                  (not sailing with you)
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Full Name *</label>
                  <input
                    className={field}
                    value={emName}
                    onChange={(e) => setEmName(e.target.value)}
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <label className={lbl}>Phone *</label>
                  <input
                    type="tel"
                    className={field}
                    value={emPhone}
                    onChange={(e) => setEmPhone(e.target.value)}
                    placeholder="(713) 555-0123"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Relationship</label>
                  <input
                    className={field}
                    value={emRelation}
                    onChange={(e) => setEmRelation(e.target.value)}
                    placeholder="Parent, sibling, friend…"
                  />
                </div>
              </div>
            </div>

            {/* Special requests */}
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
              <label className={lbl}>Special Requests</label>
              <textarea
                rows={3}
                className={`${field} resize-none`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Celebrating something? Accessibility needs? Bed configuration? Let us know."
              />
            </div>

            {/* Acknowledgments */}
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
              <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-4">
                Please Confirm
              </h3>
              <div className="space-y-3">
                {ACKS.map((a) => (
                  <label
                    key={a.id}
                    className="flex items-start gap-3 text-sm text-white/65 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={!!acks[a.id]}
                      onChange={(e) =>
                        setAcks((s) => ({ ...s, [a.id]: e.target.checked }))
                      }
                      className="mt-1 accent-sky-500 w-4 h-4 flex-shrink-0"
                    />
                    {a.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: live order summary ── */}
          <div className="lg:sticky lg:top-6 self-start">
            <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6 space-y-4">
              <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/80">
                {"// Order summary"}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>
                    Cruise fare
                    {selectedPrice > 0 && (
                      <span className="text-white/40">
                        {" "}
                        ({fmt$(selectedPrice)} × {numGuests})
                      </span>
                    )}
                  </span>
                  <span className="text-white">{fmt$(cruiseFare)}</span>
                </div>

                {selectedAddons.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between text-white/60 text-xs"
                  >
                    <span>{a.label}</span>
                    <span>{fmt$(a.amount)}</span>
                  </div>
                ))}

                {anyDiscount && (
                  <div className="flex justify-between text-sky-300 text-xs">
                    <span>Discount (5%)</span>
                    <span>−{fmt$(discountAmount)}</span>
                  </div>
                )}

                {hotelTotal > 0 && (
                  <div className="flex justify-between text-white/60 text-xs">
                    <span>Hotel ({hotelNights} night{hotelNights === 1 ? "" : "s"} × {Math.max(1, hotelRooms)} room{hotelRooms === 1 ? "" : "s"}, est)</span>
                    <span>{fmt$(hotelTotal)}</span>
                  </div>
                )}

                {flights && (
                  <div className="flex justify-between text-white/60 text-xs">
                    <span>Flights</span>
                    <span className="text-white/45">Quoted</span>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                  <span className="text-white/80 font-semibold">
                    Estimated total
                  </span>
                  <span className="text-holo font-extrabold text-lg">
                    {fmt$(estimatedTotal)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-white/80 font-semibold">
                    Deposit due
                  </span>
                  <span className="text-white font-bold">
                    {fmt$(depositTotal)}
                  </span>
                </div>
                <div className="text-white/35 text-[11px]">
                  ({fmt$(DEPOSIT_PP)} × {numGuests} guests)
                </div>
              </div>

              <p className="text-white/40 text-[11px] leading-relaxed border-t border-white/10 pt-3">
                Per person, double occupancy. Final price &amp; availability
                confirmed by your specialist. No card charged online.
              </p>

              <button
                onClick={submit}
                disabled={!canSubmit}
                className="w-full bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed font-semibold uppercase tracking-wider px-6 py-3 rounded-full text-sm transition-all"
              >
                {submitting ? "Submitting…" : "Request Reservation →"}
              </button>

              {!canSubmit && !submitting && (
                <p className="text-white/35 text-[11px] text-center">
                  Complete all guests, emergency contact &amp; acknowledgments
                  to submit.
                </p>
              )}

              <Link
                href="/sailings"
                className="block text-center text-white/45 hover:text-white/70 text-xs transition-colors"
              >
                Cancel
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-white/40 border-t border-white/10 pt-3">
                <span className="text-sky-400">🔒</span> Secure request · no card
                online
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookCabinPage() {
  return (
    <Suspense>
      <BookCabinContent />
    </Suspense>
  );
}
