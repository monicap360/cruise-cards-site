"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  computeMilestones,
  countdownTo,
  nextMilestone,
  type ComputedMilestone,
} from "@/lib/countdown";
import { getTerminal } from "@/lib/port-terminals";
import ShipImage from "@/components/ShipImage";

type SavedCruise = { name?: string; ship: string; sailDate: string };

const STORAGE_KEY = "myCruise";

const SHIPS = [
  "Carnival Jubilee",
  "Carnival Breeze",
  "Carnival Dream",
  "Carnival Miracle",
  "Carnival Tropicale",
  "Mariner of the Seas",
  "Symphony of the Seas",
  "Liberty of the Seas",
  "MSC Seascape",
  "Norwegian Viva",
  "Disney Magic",
];

function fmtSail(date: string): string {
  if (!date) return "";
  const d = new Date(date + "T12:00:00");
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function fmtShort(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Num({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-[#05070d] border border-white/10 rounded-2xl px-2 py-4 sm:px-4 sm:py-6 text-center min-w-[68px] sm:min-w-[96px]">
      <div className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <div className="label-mono text-[10px] uppercase text-white/45 mt-2">
        {label}
      </div>
    </div>
  );
}

export default function CountdownPage() {
  const [mounted, setMounted] = useState(false);
  const [cruise, setCruise] = useState<SavedCruise | null>(null);
  const [now, setNow] = useState(0);
  const [copied, setCopied] = useState(false);

  // form
  const [ship, setShip] = useState("");
  const [sailDate, setSailDate] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    // URL params take priority (deep links from a booking)
    const p = new URLSearchParams(window.location.search);
    const qShip = p.get("ship");
    const qDate = p.get("date");
    if (qShip && qDate) {
      const c = { ship: qShip, sailDate: qDate, name: p.get("name") ?? "" };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
      setCruise(c);
      return;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCruise(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!cruise) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [cruise]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!ship || !sailDate) return;
    const c = { ship, sailDate, name };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    setNow(Date.now());
    setCruise(c);
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setCruise(null);
    setShip("");
    setSailDate("");
    setName("");
  }

  function share() {
    if (!cruise) return;
    const url = `${window.location.origin}/countdown?ship=${encodeURIComponent(
      cruise.ship
    )}&date=${cruise.sailDate}${
      cruise.name ? `&name=${encodeURIComponent(cruise.name)}` : ""
    }`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const inputCls =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";

  // ── Loading / not-yet-set ──
  if (!mounted) {
    return <div className="bg-[#05070d] min-h-[60vh]" />;
  }

  // ── Setup form ──
  if (!cruise) {
    return (
      <div className="bg-[#05070d] text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 grid-bg" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
          </div>
          <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14 text-center">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-6">
              {"// Your Personal Countdown"}
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mb-5">
              Start Your Countdown
            </h1>
            <p className="text-white/55 text-lg">
              Add your sailing and we&apos;ll count down to the second — with
              milestones that unlock as the big day gets closer.
            </p>
          </div>
        </section>

        <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <form onSubmit={save} className="space-y-5">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1.5">
                Your ship *
              </label>
              <input
                list="ships"
                className={inputCls}
                value={ship}
                onChange={(e) => setShip(e.target.value)}
                placeholder="Start typing… e.g. Carnival Jubilee"
                required
              />
              <datalist id="ships">
                {SHIPS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1.5">
                Sail date *
              </label>
              <input
                type="date"
                className={inputCls}
                value={sailDate}
                onChange={(e) => setSailDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1.5">
                Name on the trip (optional)
              </label>
              <input
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Garcia Family"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Start the Countdown
            </button>
            <p className="text-white/35 text-xs text-center">
              Saved on this device — come back anytime to check your countdown.
            </p>
          </form>
        </section>
      </div>
    );
  }

  // ── Live dashboard ──
  const cd = countdownTo(cruise.sailDate, now);
  const milestones = computeMilestones(cruise.sailDate, now);
  const next = nextMilestone(milestones);
  const terminal = getTerminal(cruise.ship);
  const greeting = cruise.name ? cruise.name : "Your cruise";

  return (
    <div className="bg-[#05070d] text-white">
      {/* Hero countdown */}
      <section className="relative overflow-hidden border-b border-white/10">
        <ShipImage
          ship={cruise.ship}
          overlay={false}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-[#05070d]/80" />
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora bg-sky-500 w-[50rem] h-[50rem] -top-72 left-1/2 -translate-x-1/2 opacity-[0.16]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// "}
            {greeting} · {cruise.ship}
          </div>

          {cd.sailed ? (
            <>
              <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] mb-4">
                Bon Voyage! <span className="text-holo">You&apos;re Sailing.</span>
              </h1>
              <p className="text-white/55 text-lg">
                Cruises Start Here — and yours just did. Enjoy every minute.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.02em] mb-7">
                Until You <span className="text-holo">Set Sail</span>
              </h1>
              <div className="flex items-stretch justify-center gap-2 sm:gap-4 mb-7">
                <Num value={cd.days} label="Days" />
                <Num value={cd.hours} label="Hours" />
                <Num value={cd.minutes} label="Minutes" />
                <Num value={cd.seconds} label="Seconds" />
              </div>
            </>
          )}

          <p className="text-white/60 text-sm">
            {fmtSail(cruise.sailDate)} · departs Galveston
            {terminal ? ` · enter at ${terminal.entryStreet}` : ""}
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button
              onClick={share}
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
            >
              {copied ? "Link Copied!" : "Share Countdown"}
            </button>
            <button
              onClick={reset}
              className="border border-white/15 hover:bg-white/5 text-white/60 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
            >
              Change Cruise
            </button>
          </div>
        </div>
      </section>

      {/* Next milestone hook */}
      {!cd.sailed && next && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="bg-[#0b1020] border border-sky-400/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-1">
                Next unlock · in {next.daysUntil} day
                {next.daysUntil === 1 ? "" : "s"}
              </div>
              <div className="font-bold text-white text-xl uppercase tracking-wide">
                {next.title}
              </div>
              <p className="text-white/55 text-sm mt-1 max-w-xl">{next.blurb}</p>
            </div>
            {next.href && (
              <Link
                href={next.href}
                className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all whitespace-nowrap"
              >
                Get Ready
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Milestone timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-6">
          {"// Your Voyage Milestones"}
        </div>
        <div className="space-y-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {milestones.map((m: ComputedMilestone, i) => {
            const isNext = next && m.title === next.title;
            return (
              <div
                key={m.title}
                className={`flex items-start gap-4 p-5 ${
                  m.unlocked ? "bg-[#0b1020]" : "bg-[#05070d]"
                } ${isNext ? "ring-1 ring-inset ring-sky-400/40" : ""}`}
              >
                <div
                  className={`label-mono text-sm mt-0.5 ${
                    m.unlocked ? "text-sky-400" : "text-white/30"
                  }`}
                >
                  {m.unlocked ? "✓" : String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span
                      className={`font-bold uppercase tracking-wide text-sm ${
                        m.unlocked ? "text-white" : "text-white/55"
                      }`}
                    >
                      {m.title}
                    </span>
                    <span className="label-mono text-[10px] uppercase text-white/35">
                      {m.daysBefore === 0
                        ? "Sail day"
                        : `${m.daysBefore} days before · ${fmtShort(m.dateMs)}`}
                    </span>
                  </div>
                  <p className="text-white/45 text-sm mt-1">{m.blurb}</p>
                  {m.href && m.unlocked && (
                    <Link
                      href={m.href}
                      className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 hover:text-white transition-colors inline-block mt-2"
                    >
                      Open →
                    </Link>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`label-mono text-[10px] uppercase px-3 py-1 rounded-full ${
                      m.unlocked
                        ? "bg-sky-400/10 text-sky-300 border border-sky-400/20"
                        : "bg-white/5 text-white/40 border border-white/10"
                    }`}
                  >
                    {m.unlocked
                      ? "Unlocked"
                      : `in ${m.daysUntil}d`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-white/35 text-xs mt-5">
          Milestone timing is a general guide — exact windows (check-in, final
          payment, package deadlines) vary by cruise line. Your specialist confirms
          the real dates.
        </p>
      </section>
    </div>
  );
}
