"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type Listing,
  type ListingStatus,
  getListings,
  updateListing,
  deleteListing,
  STATUS_LABEL,
} from "@/lib/last-minute";
import { fmt$ } from "@/lib/sea-pay";

const STATUSES: ListingStatus[] = [
  "pending",
  "verifying",
  "listed",
  "claimed",
  "sold",
  "declined",
  "withdrawn",
];

export default function AdminLastMinutePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setListings(await getListings());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function patch(id: string, patch: Record<string, unknown>) {
    await updateListing(id, patch);
    refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this listing?")) return;
    await deleteListing(id);
    refresh();
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
              Last-Minute Listings
            </h1>
            <p className="text-white/55 text-sm">
              Seller submissions. Set the buyer price + seller refund, then mark{" "}
              <strong>Listed</strong> to publish on the public board.
            </p>
          </div>
          <Link
            href="/admin"
            className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white"
          >
            ← Admin
          </Link>
        </div>

        {loading ? (
          <p className="text-white/45">Loading…</p>
        ) : listings.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-10 text-center text-white/55">
            No listings yet. Submissions from{" "}
            <Link href="/list-your-cruise" className="text-sky-400 hover:text-sky-300 underline">
              /list-your-cruise
            </Link>{" "}
            appear here.
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((l) => (
              <ListingCard key={l.id} l={l} onPatch={patch} onDelete={remove} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ListingCard({
  l,
  onPatch,
  onDelete,
}: {
  l: Listing;
  onPatch: (id: string, patch: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const [buyerPrice, setBuyerPrice] = useState(String(l.buyerPrice || ""));
  const [sellerRefund, setSellerRefund] = useState(String(l.sellerRefund || ""));

  return (
    <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-extrabold text-white">
              {l.ship || "—"}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/25">
              {STATUS_LABEL[l.status]}
            </span>
          </div>
          <div className="text-sm text-white/55">
            {l.cruiseLine} · {l.itinerary || "—"} · {l.nights} nights ·{" "}
            {l.cabinType || "—"} · up to {l.guests} guests
          </div>
          <div className="text-sm text-white/55 mt-1">
            Sails {l.sailDate || "—"} · Cabin #{l.cabinNumber || "—"} · Booking #
            {l.bookingRef || "—"} ·{" "}
            {l.paidInFull ? "Paid in full" : "Balance owed"}
          </div>
          <div className="text-sm text-white/70 mt-2">
            <strong>{l.sellerName}</strong> · {l.sellerPhone} · {l.sellerEmail}
          </div>
          <div className="text-sm text-white/55 mt-1">
            Paid {fmt$(l.pricePaid)} · penalty {fmt$(l.penaltyAmount ?? 0)} · wants{" "}
            {fmt$(l.desiredBack ?? 0)} back
          </div>
          {l.passengers && l.passengers.length > 0 && (
            <div className="text-sm text-white/55 mt-1">
              Guests:{" "}
              {l.passengers
                .map((p) => `${p.name || "—"}${p.dob ? ` (${p.dob})` : ""}`)
                .join(", ")}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2">
            <label className="text-xs text-white/55">
              Buyer price
              <input
                type="number"
                value={buyerPrice}
                onChange={(e) => setBuyerPrice(e.target.value)}
                className="block w-28 mt-1 bg-white/5 border border-white/15 rounded-xl px-2 py-1 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
              />
            </label>
            <label className="text-xs text-white/55">
              Seller refund
              <input
                type="number"
                value={sellerRefund}
                onChange={(e) => setSellerRefund(e.target.value)}
                className="block w-28 mt-1 bg-white/5 border border-white/15 rounded-xl px-2 py-1 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
              />
            </label>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <select
              value={l.status}
              onChange={(e) =>
                onPatch(l.id, { status: e.target.value as ListingStatus })
              }
              className="bg-white/5 border border-white/15 rounded-xl px-2 py-1.5 text-sm text-white focus:outline-none focus:border-sky-400/60"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[#0b1020]">
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                onPatch(l.id, {
                  buyer_price: parseFloat(buyerPrice) || 0,
                  seller_refund: parseFloat(sellerRefund) || 0,
                })
              }
              className="bg-white text-black hover:bg-white/90 text-sm font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full"
            >
              Save
            </button>
            <button
              onClick={() => onPatch(l.id, { status: "listed" })}
              className="bg-green-500/15 text-green-300 border border-green-400/25 hover:bg-green-500/25 text-sm font-bold px-4 py-1.5 rounded-full"
            >
              Publish
            </button>
            <button
              onClick={() => onDelete(l.id)}
              className="text-red-300 hover:text-red-200 text-sm font-bold px-3 py-1.5 rounded-full hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
