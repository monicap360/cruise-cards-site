"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fmt$ } from "@/lib/sea-pay";
import {
  type GroupDeposit,
  type DepositMilestone,
  type DepositCabin,
  blankGroupDeposit,
  getGroupDeposits,
  saveGroupDeposit,
  deleteGroupDeposit,
  totalDue,
  paidToDate,
  nextDue,
  cabinCount,
} from "@/lib/group-deposits";

const input =
  "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
const lbl =
  "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";
const card = "bg-[#0b1020] rounded-2xl border border-white/10 p-6";
const primaryBtn =
  "bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full";
const ghostBtn =
  "bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-full";

const STATUSES: GroupDeposit["status"][] = ["active", "secured", "released"];

const statusBadge: Record<GroupDeposit["status"], string> = {
  active: "bg-sky-500/15 text-sky-300 border border-sky-400/25",
  secured: "bg-green-500/15 text-green-300 border border-green-400/25",
  released: "bg-white/10 text-white/50 border border-white/15",
};

function blankMilestone(): DepositMilestone {
  return { dueDate: "", depositRequired: 0, cumulativeDue: 0, paidToDate: 0 };
}

function blankCabin(): DepositCabin {
  return {
    cabinNumber: "",
    bookingId: "",
    category: "",
    occupancy: "",
    deposit: 0,
    paid: 0,
  };
}

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function GroupDepositsPage() {
  const [list, setList] = useState<GroupDeposit[]>([]);
  const [g, setG] = useState<GroupDeposit>(() => blankGroupDeposit());
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setList(await getGroupDeposits());
  }

  useEffect(() => {
    refresh();
  }, []);

  function set<K extends keyof GroupDeposit>(key: K, value: GroupDeposit[K]) {
    setG((prev) => ({ ...prev, [key]: value }));
  }

  function resetEditor() {
    setG(blankGroupDeposit());
    setEditing(false);
  }

  function loadForEdit(d: GroupDeposit) {
    setG({ ...d, schedule: [...d.schedule], cabins: [...d.cabins] });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Start a new group with the cruise-line + contact block prefilled — these
  // repeat across a partner's groups, so it speeds up entering the next one.
  function duplicate(d: GroupDeposit) {
    setG({
      ...blankGroupDeposit(),
      cruiseLine: d.cruiseLine,
      ship: d.ship,
      partnerAdvocate: d.partnerAdvocate,
      advocateExt: d.advocateExt,
      rep: d.rep,
      groupEmail: d.groupEmail,
    });
    setEditing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save() {
    setSaving(true);
    const ok = await saveGroupDeposit(g);
    setSaving(false);
    if (!ok) {
      alert("Could not save — check Supabase connection.");
      return;
    }
    await refresh();
    resetEditor();
  }

  async function remove(id: string) {
    if (!confirm("Delete this group deposit? This cannot be undone.")) return;
    await deleteGroupDeposit(id);
    await refresh();
    if (g.id === id) resetEditor();
  }

  // ── Schedule editing ──────────────────────────────────────────────────────
  function setMilestone<K extends keyof DepositMilestone>(
    i: number,
    key: K,
    value: DepositMilestone[K]
  ) {
    setG((prev) => {
      const schedule = prev.schedule.map((m, idx) =>
        idx === i ? { ...m, [key]: value } : m
      );
      return { ...prev, schedule };
    });
  }
  function addMilestone() {
    setG((prev) => ({ ...prev, schedule: [...prev.schedule, blankMilestone()] }));
  }
  function removeMilestone(i: number) {
    setG((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, idx) => idx !== i),
    }));
  }

  // ── Cabin editing ─────────────────────────────────────────────────────────
  function setCabin<K extends keyof DepositCabin>(
    i: number,
    key: K,
    value: DepositCabin[K]
  ) {
    setG((prev) => {
      const cabins = prev.cabins.map((c, idx) =>
        idx === i ? { ...c, [key]: value } : c
      );
      return { ...prev, cabins };
    });
  }
  function addCabin() {
    setG((prev) => ({ ...prev, cabins: [...prev.cabins, blankCabin()] }));
  }
  function removeCabin(i: number) {
    setG((prev) => ({
      ...prev,
      cabins: prev.cabins.filter((_, idx) => idx !== i),
    }));
  }

  const due = nextDue(g);
  const taskHref = due
    ? `/admin/tasks?title=${encodeURIComponent(
        `Pay ${g.cruiseLine || "cruise"} group deposit ${fmt$(
          due.depositRequired
        )} — ${g.groupName || "group"}`
      )}&name=${encodeURIComponent(g.groupName)}&contact=${encodeURIComponent(
        g.groupEmail
      )}&due=${encodeURIComponent(due.dueDate)}`
    : "";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white"
            >
              ← Admin
            </Link>
            <Link
              href="/admin/signups"
              className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 hover:text-sky-300"
            >
              📝 Group Signups →
            </Link>
          </div>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mt-3 mb-1">
            {"// Group Deposits"}
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">
            Group Deposits
          </h1>
          <p className="mt-3 text-[12px] text-red-300/90 font-semibold">
            🔒 Admin only — contains cruise-line group IDs, booking IDs, and
            partner contacts. Never shown to customers.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Group details ───────────────────────────────────────────────── */}
        <div className={card}>
          <h2 className="text-lg font-extrabold uppercase tracking-wider mb-5">
            {editing ? "Edit group deposit" : "New group deposit"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className={lbl}>Group name</label>
              <input
                className={input}
                value={g.groupName}
                onChange={(e) => set("groupName", e.target.value)}
                placeholder="Smith Family Reunion 2026"
              />
            </div>
            <div>
              <label className={lbl}>Cruise line</label>
              <input
                className={input}
                value={g.cruiseLine}
                onChange={(e) => set("cruiseLine", e.target.value)}
                placeholder="Royal Caribbean"
              />
            </div>
            <div>
              <label className={lbl}>Ship</label>
              <input
                className={input}
                value={g.ship}
                onChange={(e) => set("ship", e.target.value)}
                placeholder="Harmony of the Seas"
              />
            </div>
            <div>
              <label className={lbl}>Sailing date</label>
              <input
                type="date"
                className={input}
                value={g.sailingDate}
                onChange={(e) => set("sailingDate", e.target.value)}
              />
            </div>
            <div>
              <label className={lbl}>Itinerary</label>
              <input
                className={input}
                value={g.itinerary}
                onChange={(e) => set("itinerary", e.target.value)}
                placeholder="7-Night Western Caribbean"
              />
            </div>
            <div>
              <label className={lbl}>Issue date</label>
              <input
                type="date"
                className={input}
                value={g.issueDate}
                onChange={(e) => set("issueDate", e.target.value)}
              />
            </div>
            <div>
              <label className={lbl}>Cruise-line group ID</label>
              <input
                className={input}
                value={g.cruiseGroupId}
                onChange={(e) => set("cruiseGroupId", e.target.value)}
                placeholder="GRP-1234567"
              />
            </div>
            <div>
              <label className={lbl}>Status</label>
              <select
                className={input}
                value={g.status}
                onChange={(e) =>
                  set("status", e.target.value as GroupDeposit["status"])
                }
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-[#0b1020]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sensitive contacts */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="label-mono text-[11px] uppercase tracking-wider text-red-300/80 mb-3">
              Cruise-line contact (sensitive)
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={lbl}>Partner advocate</label>
                <input
                  className={input}
                  value={g.partnerAdvocate}
                  onChange={(e) => set("partnerAdvocate", e.target.value)}
                />
              </div>
              <div>
                <label className={lbl}>Advocate ext.</label>
                <input
                  className={input}
                  value={g.advocateExt}
                  onChange={(e) => set("advocateExt", e.target.value)}
                />
              </div>
              <div>
                <label className={lbl}>Rep</label>
                <input
                  className={input}
                  value={g.rep}
                  onChange={(e) => set("rep", e.target.value)}
                />
              </div>
              <div>
                <label className={lbl}>Group email</label>
                <input
                  className={input}
                  value={g.groupEmail}
                  onChange={(e) => set("groupEmail", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className={lbl}>Notes</label>
            <textarea
              className={input + " min-h-24"}
              value={g.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Internal notes about this group hold…"
            />
          </div>
        </div>

        {/* ── Deposit schedule ────────────────────────────────────────────── */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold uppercase tracking-wider">
              Deposit schedule
            </h2>
            <button onClick={addMilestone} className={ghostBtn}>
              + Add milestone
            </button>
          </div>

          {g.schedule.length === 0 ? (
            <p className="text-white/40 text-sm">No milestones yet.</p>
          ) : (
            <div className="space-y-3">
              <div className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-3 px-1">
                <span className={lbl}>Due date</span>
                <span className={lbl}>Deposit required</span>
                <span className={lbl}>Cumulative due</span>
                <span className={lbl}>Paid to date</span>
                <span className={lbl} />
              </div>
              {g.schedule.map((m, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 sm:grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-3 items-center"
                >
                  <input
                    type="date"
                    className={input}
                    value={m.dueDate}
                    onChange={(e) => setMilestone(i, "dueDate", e.target.value)}
                  />
                  <input
                    type="number"
                    className={input}
                    value={m.depositRequired}
                    onChange={(e) =>
                      setMilestone(i, "depositRequired", Number(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    className={input}
                    value={m.cumulativeDue}
                    onChange={(e) =>
                      setMilestone(i, "cumulativeDue", Number(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    className={input}
                    value={m.paidToDate}
                    onChange={(e) =>
                      setMilestone(i, "paidToDate", Number(e.target.value))
                    }
                  />
                  <div className="flex items-center gap-2 justify-self-end">
                    <button
                      onClick={() =>
                        setMilestone(
                          i,
                          "paidToDate",
                          m.paidToDate >= m.cumulativeDue && m.cumulativeDue > 0 ? 0 : m.cumulativeDue
                        )
                      }
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border whitespace-nowrap ${
                        m.paidToDate >= m.cumulativeDue && m.cumulativeDue > 0
                          ? "bg-green-500/15 text-green-300 border-green-400/30"
                          : "bg-white/5 text-white/60 border-white/15 hover:border-white/30"
                      }`}
                      title="Mark this milestone paid (sets paid-to-date to the cumulative due)"
                    >
                      {m.paidToDate >= m.cumulativeDue && m.cumulativeDue > 0 ? "✓ Paid" : "Mark paid"}
                    </button>
                    <button
                      onClick={() => removeMilestone(i)}
                      className="text-white/40 hover:text-red-300 text-lg px-1"
                      aria-label="Remove milestone"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-sm text-white/70">
            Total due{" "}
            <span className="font-bold text-white">{fmt$(totalDue(g))}</span> ·
            Paid{" "}
            <span className="font-bold text-white">{fmt$(paidToDate(g))}</span> ·
            Next due{" "}
            <span className="font-bold text-white">{due?.dueDate ?? "—"}</span>
          </div>

          {due && (
            <a
              href={taskHref}
              className="mt-3 inline-block text-sm text-sky-300 hover:text-sky-200 font-semibold"
            >
              📌 Create follow-up task for next due date
            </a>
          )}
        </div>

        {/* ── Cabin inventory ─────────────────────────────────────────────── */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold uppercase tracking-wider">
              Cabin inventory ({cabinCount(g)})
            </h2>
            <button onClick={addCabin} className={ghostBtn}>
              + Add cabin
            </button>
          </div>

          {g.cabins.length === 0 ? (
            <p className="text-white/40 text-sm">No cabins held yet.</p>
          ) : (
            <div className="space-y-3">
              <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-3 px-1">
                <span className={lbl}>Cabin #</span>
                <span className={lbl}>Booking ID</span>
                <span className={lbl}>Category</span>
                <span className={lbl}>Occupancy</span>
                <span className={lbl}>Deposit</span>
                <span className={lbl}>Paid</span>
                <span className={lbl} />
              </div>
              {g.cabins.map((c, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-3 items-center"
                >
                  <input
                    className={input}
                    placeholder="Cabin #"
                    value={c.cabinNumber}
                    onChange={(e) => setCabin(i, "cabinNumber", e.target.value)}
                  />
                  <input
                    className={input}
                    placeholder="Booking ID"
                    value={c.bookingId}
                    onChange={(e) => setCabin(i, "bookingId", e.target.value)}
                  />
                  <input
                    className={input}
                    placeholder="Category"
                    value={c.category}
                    onChange={(e) => setCabin(i, "category", e.target.value)}
                  />
                  <input
                    className={input}
                    placeholder="Occupancy"
                    value={c.occupancy}
                    onChange={(e) => setCabin(i, "occupancy", e.target.value)}
                  />
                  <input
                    type="number"
                    className={input}
                    placeholder="Deposit"
                    value={c.deposit}
                    onChange={(e) =>
                      setCabin(i, "deposit", Number(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    className={input}
                    placeholder="Paid"
                    value={c.paid}
                    onChange={(e) => setCabin(i, "paid", Number(e.target.value))}
                  />
                  <button
                    onClick={() => removeCabin(i)}
                    className="text-white/40 hover:text-red-300 text-lg px-2 justify-self-end"
                    aria-label="Remove cabin"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className={primaryBtn}>
            {saving ? "Saving…" : "Save group"}
          </button>
          {editing && (
            <button onClick={resetEditor} className={ghostBtn}>
              Cancel
            </button>
          )}
        </div>

        {/* ── Saved list ──────────────────────────────────────────────────── */}
        <div className={card}>
          <h2 className="text-lg font-extrabold uppercase tracking-wider mb-5">
            Saved group deposits
          </h2>
          {list.length === 0 ? (
            <p className="text-white/40 text-sm">No group deposits saved yet.</p>
          ) : (
            <div className="space-y-3">
              {list.map((d) => {
                const dDue = nextDue(d);
                const overdue = dDue ? dDue.dueDate <= todayStr() : false;
                return (
                  <div
                    key={d.id}
                    className="flex items-center justify-between flex-wrap gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white">
                          {d.groupName || "(untitled group)"}
                        </span>
                        <span className="text-white/50 text-sm">
                          {d.ship}
                          {d.sailingDate ? ` · ${d.sailingDate}` : ""}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusBadge[d.status]}`}
                        >
                          {d.status}
                        </span>
                      </div>
                      <div className="text-sm mt-1">
                        {dDue ? (
                          <span
                            className={
                              overdue ? "text-red-300 font-semibold" : "text-white/60"
                            }
                          >
                            Next due {dDue.dueDate} ·{" "}
                            {fmt$(dDue.depositRequired)}
                          </span>
                        ) : (
                          <span className="text-white/40">No upcoming due date</span>
                        )}
                      </div>
                      <div className="text-white/40 text-xs mt-0.5">
                        Total {fmt$(totalDue(d))} · Paid {fmt$(paidToDate(d))} ·{" "}
                        {cabinCount(d)} cabins
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadForEdit(d)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs px-4 py-2 rounded-full"
                      >
                        Edit
                      </button>
                      <Link
                        href={`/admin/documents?scope=group&group=${encodeURIComponent(d.groupName)}&groupId=${encodeURIComponent(d.id)}`}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs px-4 py-2 rounded-full"
                      >
                        📎 Upload Doc
                      </Link>
                      <button
                        onClick={() => duplicate(d)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-xs px-4 py-2 rounded-full"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => remove(d.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-400/25 text-red-300 font-semibold text-xs px-4 py-2 rounded-full"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
