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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className="text-4xl flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100 rounded-full">
        {member.emoji ?? "⚓"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-extrabold text-blue-900 text-base">{member.displayName}</div>
        {member.hometown && (
          <div className="text-xs text-gray-400 mt-0.5">📍 {member.hometown}</div>
        )}
        {member.bio && (
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{member.bio}</p>
        )}
        {member.crews.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {member.crews.map((c) => (
              <span key={c} className="bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-100">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-teal-700 text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2">Sea You On Deck Crews™ · Powered by Cruise Experience Center</div>
          <h1 className="text-4xl font-extrabold mb-2">Who&apos;s on Your Sailing?</h1>
          <p className="text-blue-100 max-w-xl">
            Find cruisers going on the same ship and sail date who have opted in to the community. Say hi, find your crew, and meet before you board.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="font-extrabold text-blue-900 text-base mb-4">Find a Sailing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Ship Name</label>
              <input
                value={ship}
                onChange={(e) => setShip(e.target.value)}
                placeholder="e.g. Carnival Jubilee"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Sail Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <button
              onClick={handleSearch}
              disabled={!ship || !date}
              className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all"
            >
              Find My Crew
            </button>
            <Link
              href={`/sea-you-on-deck/join?ship=${encodeURIComponent(ship)}&date=${date}`}
              className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-6 py-2.5 rounded-full text-sm transition-all"
            >
              + Join This Sailing
            </Link>
          </div>
        </div>

        {searched && (
          <>
            {members.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🌊</div>
                <h3 className="text-2xl font-extrabold text-blue-900 mb-2">No crew members yet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Nobody has joined the community for <strong>{ship}</strong> on <strong>{fmtDate(date)}</strong> yet. Be the first!
                </p>
                <Link
                  href={`/sea-you-on-deck/join?ship=${encodeURIComponent(ship)}&date=${date}`}
                  className="inline-block bg-gradient-to-r from-blue-900 to-teal-700 text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg"
                >
                  Be the First to Join →
                </Link>
              </div>
            ) : (
              <>
                {/* Sailing header */}
                <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-blue-900">{ship}</h2>
                    <p className="text-gray-400 text-sm">{fmtDate(date)} · Departing from Galveston, TX</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-green-100 text-green-700 font-extrabold text-sm px-4 py-1.5 rounded-full">
                      {members.length} crew member{members.length !== 1 ? "s" : ""} visible
                    </span>
                    <Link
                      href={`/sea-you-on-deck/join?ship=${encodeURIComponent(ship)}&date=${date}`}
                      className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-5 py-1.5 rounded-full text-sm transition-all"
                    >
                      + Join
                    </Link>
                  </div>
                </div>

                {/* View toggle */}
                <div className="flex gap-2 mb-5">
                  <button
                    onClick={() => setViewMode("all")}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${viewMode === "all" ? "bg-blue-900 text-white border-blue-900" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
                  >
                    All Members ({members.length})
                  </button>
                  <button
                    onClick={() => setViewMode("byCrew")}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${viewMode === "byCrew" ? "bg-blue-900 text-white border-blue-900" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
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
                          <h3 className="font-extrabold text-blue-900 text-lg">{crew}</h3>
                          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
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

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-800">
                  🔒 <strong>Privacy note:</strong> Only members who chose &quot;Public&quot; when joining are shown here. Real names, email addresses, and phone numbers are never displayed. To connect with a crewmate, reach out through our office.
                </div>
              </>
            )}
          </>
        )}

        {!searched && (
          <div className="text-center py-16 text-gray-300">
            <div className="text-6xl mb-4">⚓</div>
            <p className="font-semibold text-gray-400">Enter a ship name and sail date to see your sailing community.</p>
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
