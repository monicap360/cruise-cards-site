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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900">
              Last-Minute Listings
            </h1>
            <p className="text-gray-500 text-sm">
              Seller submissions. Set the buyer price + seller refund, then mark{" "}
              <strong>Listed</strong> to publish on the public board.
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm font-bold text-blue-700 hover:underline"
          >
            ← Admin
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading…</p>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">
            No listings yet. Submissions from{" "}
            <Link href="/list-your-cruise" className="text-blue-700 underline">
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
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-extrabold text-blue-900">
              {l.ship || "—"}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {STATUS_LABEL[l.status]}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {l.cruiseLine} · {l.itinerary || "—"} · {l.nights} nights ·{" "}
            {l.cabinType || "—"} · up to {l.guests} guests
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Sails {l.sailDate || "—"} · Cabin #{l.cabinNumber || "—"} · Booking #
            {l.bookingRef || "—"} ·{" "}
            {l.paidInFull ? "Paid in full" : "Balance owed"}
          </div>
          <div className="text-sm text-gray-700 mt-2">
            <strong>{l.sellerName}</strong> · {l.sellerPhone} · {l.sellerEmail}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Paid {fmt$(l.pricePaid)} · penalty {fmt$(l.penaltyAmount ?? 0)} · wants{" "}
            {fmt$(l.desiredBack ?? 0)} back
          </div>
          {l.passengers && l.passengers.length > 0 && (
            <div className="text-sm text-gray-500 mt-1">
              Guests:{" "}
              {l.passengers
                .map((p) => `${p.name || "—"}${p.dob ? ` (${p.dob})` : ""}`)
                .join(", ")}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2">
            <label className="text-xs text-gray-500">
              Buyer price
              <input
                type="number"
                value={buyerPrice}
                onChange={(e) => setBuyerPrice(e.target.value)}
                className="block w-28 mt-1 border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
            </label>
            <label className="text-xs text-gray-500">
              Seller refund
              <input
                type="number"
                value={sellerRefund}
                onChange={(e) => setSellerRefund(e.target.value)}
                className="block w-28 mt-1 border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
            </label>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <select
              value={l.status}
              onChange={(e) =>
                onPatch(l.id, { status: e.target.value as ListingStatus })
              }
              className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
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
              className="bg-blue-900 text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-blue-800"
            >
              Save
            </button>
            <button
              onClick={() => onPatch(l.id, { status: "listed" })}
              className="bg-green-600 text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-green-700"
            >
              Publish
            </button>
            <button
              onClick={() => onDelete(l.id)}
              className="text-red-600 text-sm font-bold px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
