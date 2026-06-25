"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  getMembersForSailing,
  groupMembersByCrews,
  type CommunityMember,
} from "@/lib/sea-you-on-deck";

function fmtDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function MemberCard({ member }: { member: CommunityMember }) {
  return (
    <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-5 flex items-start gap-4">
      <div className="text-4xl flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full">
        {member.emoji ?? "⚓"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-extrabold uppercase tracking-[-0.01em] text-white text-base">{member.displayName}</div>
        {member.hometown && (
          <div className="text-xs text-white/45 mt-0.5">{member.hometown}</div>
        )}
        {member.bio && (
          <p className="text-sm text-white/55 mt-1.5 leading-relaxed">{member.bio}</p>
        )}
        {member.crews.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {member.crews.map((c) => (
              <span key={c} className="bg-white/5 text-sky-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CommunityPageContent() {
  const params = useSearchParams();
  const [ship, setShip] = useState(params.get("ship") ?? "");
  const [date, setDate] = useState(params.get("date") ?? "");
  const [searched, setSearched] = useState(false);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "byCrew">("all");

  useEffect(() => {
    const s = params.get("ship");
    const d = params.get("date");
    if (s && d) {
      setShip(s);
      setDate(d);
      getMembersForSailing(s, d).then((data) => setMembers(data));
      setSearched(true);
    }
  }, [params]);

  function handleSearch() {
    if (!ship || !date) return;
    getMembersForSailing(ship, date).then((data) => setMembers(data));
    setSearched(true);
    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set("ship", ship);
    url.searchParams.set("date", date);
    window.history.replaceState({}, "", url.toString());
  }

  const byCrews = groupMembersByCrews(members);
  const crewNames = Object.keys(byCrews).sort();

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Header */}
      <div className="bg-[#05070d] relative overflow-hidden grid-bg text-white px-6 py-12">
        <div className="aurora bg-sky-500 w-[500px] h-[500px] -top-40 left-1/3 opacity-[0.14]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">{"// Sea You On Deck Crews™ · Powered by Cruise Experience Center"}</div>
          <h1 className="text-4xl font-extrabold uppercase tracking-[-0.01em] mb-2">Who&apos;s on Your Sailing?</h1>
          <p className="text-white/55 max-w-xl">
            Already booked? Find cruisers on the same ship and sail date who have opted in to the community. Say hi, see who&apos;s on deck, and connect before you board.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-4">Find a Sailing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-white/70 text-sm font-medium mb-1">Ship Name</label>
              <input
                value={ship}
                onChange={(e) => setShip(e.target.value)}
                placeholder="e.g. Carnival Jubilee"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1">Sail Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <button
              onClick={handleSearch}
              disabled={!ship || !date}
              className="bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Find My Crew
            </button>
            <Link
              href={`/sea-you-on-deck/join?ship=${encodeURIComponent(ship)}&date=${date}`}
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              + Join This Sailing
            </Link>
          </div>
        </div>

        {searched && (
          <>
            {members.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-extrabold uppercase tracking-[-0.01em] text-white mb-2">No crew members yet</h3>
                <p className="text-white/45 mb-6 max-w-md mx-auto">
                  Nobody has joined the community for <strong>{ship}</strong> on <strong>{fmtDate(date)}</strong> yet. Be the first!
                </p>
                <Link
                  href={`/sea-you-on-deck/join?ship=${encodeURIComponent(ship)}&date=${date}`}
                  className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
                >
                  Be the First to Join →
                </Link>
              </div>
            ) : (
              <>
                {/* Sailing header */}
                <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold uppercase tracking-[-0.01em] text-white">{ship}</h2>
                    <p className="text-white/45 text-sm">{fmtDate(date)} · Departing from Galveston, TX</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-white/5 text-sky-400 border border-white/10 font-extrabold text-sm px-4 py-1.5 rounded-full">
                      {members.length} crew member{members.length !== 1 ? "s" : ""} visible
                    </span>
                    <Link
                      href={`/sea-you-on-deck/join?ship=${encodeURIComponent(ship)}&date=${date}`}
                      className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-5 py-1.5 rounded-full transition-all"
                    >
                      + Join
                    </Link>
                  </div>
                </div>

                {/* View toggle */}
                <div className="flex gap-2 mb-5">
                  <button
                    onClick={() => setViewMode("all")}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${viewMode === "all" ? "bg-white text-black border-white" : "bg-white/5 text-white/55 border-white/15 hover:border-white/40"}`}
                  >
                    All Members ({members.length})
                  </button>
                  <button
                    onClick={() => setViewMode("byCrew")}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${viewMode === "byCrew" ? "bg-white text-black border-white" : "bg-white/5 text-white/55 border-white/15 hover:border-white/40"}`}
                  >
                    Browse by Crew ({crewNames.length})
                  </button>
                </div>

                {viewMode === "all" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {members.map((m) => <MemberCard key={m.id} member={m} />)}
                  </div>
                )}

                {viewMode === "byCrew" && (
                  <div className="space-y-8">
                    {crewNames.map((crew) => (
                      <div key={crew}>
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-lg">{crew}</h3>
                          <span className="text-xs font-bold text-white/55 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                            {byCrews[crew].length} member{byCrews[crew].length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {byCrews[crew].map((m) => <MemberCard key={m.id} member={m} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 bg-[#0b1020] border border-white/10 rounded-2xl p-5 text-sm text-white/55">
                  <strong className="text-white">Privacy note:</strong> Only members who chose &quot;Public&quot; when joining are shown here. Real names, email addresses, and phone numbers are never displayed. To connect with a crewmate, reach out through our office.
                </div>
              </>
            )}
          </>
        )}

        {!searched && (
          <div className="text-center py-16 text-white/45">
            <p className="font-semibold text-white/55">Enter a ship name and sail date to see your sailing community.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense>
      <CommunityPageContent />
    </Suspense>
  );
}
