"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  type Reservation,
  getReservation,
  saveReservation,
  deleteReservation,
  fmtDate,
  fmtTime,
  SERVICE_ICON,
  STATUS_COLOR,
  STATUS_LABEL,
  RESERVATION_STATUSES,
} from "@/lib/reservations";

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [r, setR] = useState<Reservation | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getReservation(id).then((data) => {
      if (!data) router.push("/admin/reservations");
      else setR(data);
    });
  }, [id, router]);

  async function update(patch: Partial<Reservation>) {
    if (!r) return;
    const updated = { ...r, ...patch };
    setR(updated);
    await saveReservation(updated);
  }

  async function handleDelete() {
    if (!r) return;
    await deleteReservation(r.id);
    router.push("/admin/reservations");
  }

  if (!r) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 font-bold">
        Loading…
      </div>
    );
  }

  const labelCls =
    "block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1";
  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/admin/reservations"
            className="text-blue-300 hover:text-white text-sm font-semibold"
          >
            ← Reservations
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
                {SERVICE_ICON[r.serviceType] ?? "⚓"}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold">{r.guestName}</h1>
                <div className="text-blue-300 text-sm font-mono">
                  {r.reservationNumber}
                </div>
              </div>
            </div>
            <span
              className={`text-sm font-bold px-4 py-1.5 rounded-full ${STATUS_COLOR[r.status]}`}
            >
              {STATUS_LABEL[r.status]}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Status workflow */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-extrabold text-blue-900 text-lg mb-4">Status</h2>
          <div className="flex flex-wrap gap-2">
            {RESERVATION_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => update({ status: s })}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  r.status === s
                    ? "bg-blue-900 text-white"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Identity check (physical ID verified at the desk — no image stored) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-extrabold text-blue-900 text-lg mb-1">
            Identity Check
          </h2>
          <p className="text-gray-400 text-xs mb-4">
            Staff safety — verify the guest&apos;s physical government photo ID in
            person at check-in. No ID image is ever stored.
          </p>
          <button
            onClick={() => update({ idVerified: !r.idVerified })}
            className={`flex items-center gap-3 px-5 py-3 rounded-full font-bold text-sm transition-all ${
              r.idVerified
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{r.idVerified ? "✅" : "🪪"}</span>
            {r.idVerified
              ? "Photo ID verified at desk"
              : "Mark photo ID verified"}
          </button>
        </div>

        {/* Guest request + AI prep brief */}
        {(r.requestSummary || r.aiBrief) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            {r.requestSummary && (
              <div>
                <h2 className="font-extrabold text-blue-900 text-lg mb-2">
                  What the guest asked for
                </h2>
                <p className="text-gray-700 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4 whitespace-pre-wrap">
                  {r.requestSummary}
                </p>
              </div>
            )}
            {r.aiBrief && (
              <div>
                <h2 className="font-extrabold text-blue-900 text-lg mb-2 flex items-center gap-2">
                  <span>✨</span> AI prep brief
                </h2>
                <p className="text-gray-700 text-sm bg-blue-50 border border-blue-100 rounded-xl p-4 whitespace-pre-wrap">
                  {r.aiBrief}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold text-blue-900 text-lg">Details</h2>
            <button
              onClick={() => setEditing((v) => !v)}
              className="text-blue-600 hover:text-blue-800 text-sm font-bold"
            >
              {editing ? "Done" : "Edit"}
            </button>
          </div>

          {editing ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Guest Name</label>
                <input
                  value={r.guestName}
                  onChange={(e) => update({ guestName: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Phone</label>
                <input
                  value={r.guestPhone}
                  onChange={(e) => update({ guestPhone: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Email</label>
                <input
                  value={r.guestEmail}
                  onChange={(e) => update({ guestEmail: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Party Size</label>
                <input
                  type="number"
                  min="1"
                  value={r.partySize}
                  onChange={(e) =>
                    update({ partySize: parseInt(e.target.value) || 1 })
                  }
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Date</label>
                <input
                  type="date"
                  value={r.reservationDate}
                  onChange={(e) => update({ reservationDate: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Time</label>
                <input
                  type="time"
                  value={r.reservationTime}
                  onChange={(e) => update({ reservationTime: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Ship</label>
                <input
                  value={r.ship}
                  onChange={(e) => update({ ship: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Agent</label>
                <input
                  value={r.agentName}
                  onChange={(e) => update({ agentName: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          ) : (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <Detail label="Service" value={r.serviceType} />
              <Detail label="Party Size" value={String(r.partySize)} />
              <Detail label="Date" value={fmtDate(r.reservationDate)} />
              <Detail label="Time" value={fmtTime(r.reservationTime)} />
              <Detail label="Phone" value={r.guestPhone || "—"} />
              <Detail label="Email" value={r.guestEmail || "—"} />
              <Detail label="Ship" value={r.ship || "—"} />
              <Detail
                label="Sail Date"
                value={r.sailDate ? fmtDate(r.sailDate) : "—"}
              />
              <Detail
                label="Legal Name (on documents)"
                value={
                  [r.legalFirstName, r.legalLastName].filter(Boolean).join(" ") ||
                  "—"
                }
              />
              <Detail label="Past Guest / Loyalty #" value={r.loyaltyNumber || "—"} />
              <Detail label="Booking Ref" value={r.bookingRef || "—"} />
              <Detail label="Front Desk Agent" value={r.agentName || "—"} />
            </dl>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-extrabold text-blue-900 text-lg mb-4">Notes</h2>
          <textarea
            value={r.notes}
            onChange={(e) => update({ notes: e.target.value })}
            rows={4}
            placeholder="Special requests, accessibility needs, follow-up…"
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {confirmDelete ? (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-sm font-bold text-red-600">
                Delete this reservation permanently?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-red-600 hover:text-red-700 text-sm font-bold"
            >
              Delete reservation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold text-gray-400 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-gray-800 font-semibold mt-0.5">{value}</dd>
    </div>
  );
}
