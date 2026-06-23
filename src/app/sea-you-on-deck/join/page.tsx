"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  saveMember,
  generateMemberId,
  AVATAR_EMOJIS,
  type MemberPrivacy,
} from "@/lib/sea-you-on-deck";

const ALL_CREWS = [
  "Cruise Crew", "DeckWalkers Crew",
  "Sea Duck Hunters™", "Sea Memories Crew", "SeaStrong Crew", "Singles At Sea Crew",
  "Family & Friends Crew", "Adults Only Crew", "Party Wake Crew", "Jackpot Crew",
  "First Time Cruisers Crew", "Photo Crew", "Legacy Crew",
  "Deck Runners & Walkers Crew", "Sunrise Walkers Crew", "Sports Deck & Pickleball Crew",
  "Pool & Water Games Crew", "Mindful Mornings Crew", "Zen at Sea", "Serenity at Sea",
  "Adult Serenity Crew", "Spa Loungers Crew", "Beauty & Spa Products Crew",
  "Mocktail & Chill Crew", "Motion Sickness Helpers Crew", "Family Cruisers Crew",
  "Teen Crew", "Scooter Crew", "Easy Waves Crew", "Seniors at Sea", "LGBTQ+ Crew",
];

function JoinPageContent() {
  const params = useSearchParams();
  const router = useRouter();

  const [form, setForm] = useState({
    displayName: "",
    hometown: "",
    bio: "",
    ship: params.get("ship") ?? "",
    sailingDate: params.get("date") ?? "",
    selectedCrews: [] as string[],
    privacy: "public" as MemberPrivacy,
    emoji: "🐚",
  });
  const [done, setDone] = useState(false);
  const [savedId, setSavedId] = useState("");

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  function toggleCrew(crew: string) {
    setForm((f) => {
      const has = f.selectedCrews.includes(crew);
      if (!has && f.selectedCrews.length >= 3) return f; // max 3
      return {
        ...f,
        selectedCrews: has
          ? f.selectedCrews.filter((c) => c !== crew)
          : [...f.selectedCrews, crew],
      };
    });
  }

  async function handleSubmit() {
    if (!form.displayName || !form.ship || !form.sailingDate) return;
    const id = generateMemberId();
    await saveMember({
      id,
      displayName: form.displayName,
      hometown: form.hometown || undefined,
      bio: form.bio || undefined,
      ship: form.ship,
      sailingDate: form.sailingDate,
      crews: form.selectedCrews,
      privacy: form.privacy,
      emoji: form.emoji,
      joinedAt: new Date().toISOString(),
    });
    setSavedId(id);
    setDone(true);
  }

  const canSubmit = form.displayName && form.ship && form.sailingDate;

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-lg w-full text-center">
          <div className="text-6xl mb-3">{form.emoji}</div>
          <h2 className="text-3xl font-extrabold text-blue-900 mb-1">You&apos;re on deck!</h2>
          <p className="text-gray-400 text-sm font-mono mb-4">Member ID: {savedId}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-left mb-6">
            <div className="font-extrabold text-blue-900 mb-2">{form.displayName}</div>
            <div className="text-sm text-gray-500 space-y-1">
              <div>🚢 <strong>{form.ship}</strong> · {form.sailingDate}</div>
              {form.hometown && <div>📍 {form.hometown}</div>}
              {form.privacy === "public"
                ? <div className="text-green-600 font-semibold">✓ Visible to other crew members on your sailing</div>
                : <div className="text-gray-400">🔒 Private — not visible to others</div>}
              {form.selectedCrews.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.selectedCrews.map((c) => (
                    <span key={c} className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{c}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => router.push(`/sea-you-on-deck/community?ship=${encodeURIComponent(form.ship)}&date=${form.sailingDate}`)}
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-full text-sm transition-all"
            >
              See Who&apos;s on Your Sailing →
            </button>
            <button
              onClick={() => router.push("/sea-you-on-deck")}
              className="border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-50"
            >
              Back to Crews
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-teal-700 text-white px-6 py-10 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2">Sea You On Deck Crews™ · Powered by Cruise Experience Center</div>
        <h1 className="text-4xl font-extrabold mb-2">Join Your Sailing Community</h1>
        <p className="text-blue-100 max-w-xl mx-auto">Choose your display name, pick up to 3 crews, and decide if you want to be visible to other cruisers on your sailing.</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Avatar + Display Name */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-extrabold text-blue-900 text-base mb-4">Your Crew Profile</h3>

          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Pick an Avatar</label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => set("emoji", e)}
                  className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
                    form.emoji === e ? "border-blue-500 bg-blue-50 scale-110" : "border-gray-100 hover:border-blue-200"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Display Name * <span className="text-gray-400 font-normal normal-case">(doesn&apos;t have to be your real name)</span></label>
              <input value={form.displayName} onChange={(e) => set("displayName", e.target.value)}
                placeholder="CruiserMonica, Galveston Gal, Duck Hunter #12…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Hometown <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
              <input value={form.hometown} onChange={(e) => set("hometown", e.target.value)}
                placeholder="Houston, TX"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Privacy</label>
              <select value={form.privacy} onChange={(e) => set("privacy", e.target.value as MemberPrivacy)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="public">Public — visible to my sailing crew</option>
                <option value="private">Private — don&apos;t show my name</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">About You <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
              <input value={form.bio} onChange={(e) => set("bio", e.target.value)}
                placeholder="Traveling with family, love the casino, first cruise!"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Sailing Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-extrabold text-blue-900 text-base mb-4">Your Sailing *</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Ship Name</label>
              <input value={form.ship} onChange={(e) => set("ship", e.target.value)}
                placeholder="Carnival Jubilee"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Sail Date</label>
              <input type="date" value={form.sailingDate} onChange={(e) => set("sailingDate", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Crew Picker */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-blue-900 text-base">Pick Your Crews</h3>
            <span className="text-xs font-bold text-gray-400">{form.selectedCrews.length}/3 selected</span>
          </div>
          {form.selectedCrews.length === 3 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 mb-4">
              Maximum 3 crews per sailing. Remove one to select another.
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {ALL_CREWS.map((crew) => {
              const selected = form.selectedCrews.includes(crew);
              const maxed = form.selectedCrews.length >= 3 && !selected;
              return (
                <button
                  key={crew}
                  onClick={() => toggleCrew(crew)}
                  disabled={maxed}
                  className={`text-sm font-bold px-3 py-1.5 rounded-full border transition-all ${
                    selected
                      ? "bg-blue-900 text-white border-blue-900"
                      : maxed
                      ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  {selected ? "✓ " : ""}{crew}
                </button>
              );
            })}
          </div>
        </div>

        {form.privacy === "public" && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800">
            🌊 <strong>You&apos;re going public!</strong> Other cruisers booked on the same ship and sail date will be able to see your display name, hometown, bio, and crews. Your real name, email, and phone are never shared.
          </div>
        )}

        <div className="flex gap-4 justify-end">
          <button onClick={() => router.back()} className="border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!canSubmit}
            className="bg-gradient-to-r from-blue-900 to-teal-700 hover:from-blue-800 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full text-sm transition-all shadow-lg">
            Join the Crew →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinPageContent />
    </Suspense>
  );
}
