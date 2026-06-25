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
      <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center px-4 py-16">
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-10 max-w-lg w-full text-center">
          <div className="text-6xl mb-3">{form.emoji}</div>
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.01em] text-white mb-1">You&apos;re on deck!</h2>
          <p className="text-white/45 text-sm font-mono mb-4">Member ID: {savedId}</p>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-left mb-6">
            <div className="font-extrabold uppercase tracking-[-0.01em] text-white mb-2">{form.displayName}</div>
            <div className="text-sm text-white/55 space-y-1">
              <div><strong className="text-white">{form.ship}</strong> · {form.sailingDate}</div>
              {form.hometown && <div>{form.hometown}</div>}
              {form.privacy === "public"
                ? <div className="text-sky-400 font-semibold">Visible to other crew members on your sailing</div>
                : <div className="text-white/45">Private — not visible to others</div>}
              {form.selectedCrews.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.selectedCrews.map((c) => (
                    <span key={c} className="bg-white/5 text-sky-400 border border-white/10 text-xs font-bold px-2.5 py-1 rounded-full">{c}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => router.push(`/sea-you-on-deck/community?ship=${encodeURIComponent(form.ship)}&date=${form.sailingDate}`)}
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              See Who&apos;s on Your Sailing →
            </button>
            <button
              onClick={() => router.push("/sea-you-on-deck")}
              className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Back to Crews
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="bg-[#05070d] relative overflow-hidden grid-bg text-white px-6 py-12 text-center">
        <div className="aurora bg-sky-500 w-[500px] h-[500px] -top-40 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">{"// Sea You On Deck Crews™ · Powered by Cruise Experience Center"}</div>
          <h1 className="text-4xl font-extrabold uppercase tracking-[-0.01em] mb-2">Join Your Sailing Community</h1>
          <p className="text-white/55 max-w-xl mx-auto">Booked your cruise? Choose your display name, pick up to 3 crews, and decide if you want to be visible to the cruisers already on your sailing.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Avatar + Display Name */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-4">Your Crew Profile</h3>

          <div className="mb-5">
            <label className="block text-white/70 text-sm font-medium mb-2">Pick an Avatar</label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => set("emoji", e)}
                  className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
                    form.emoji === e ? "border-sky-400/60 bg-white/5 scale-110" : "border-white/15 hover:border-white/40"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-white/70 text-sm font-medium mb-1">Display Name * <span className="text-white/45 font-normal">(doesn&apos;t have to be your real name)</span></label>
              <input value={form.displayName} onChange={(e) => set("displayName", e.target.value)}
                placeholder="CruiserMonica, Galveston Gal, Duck Hunter #12…"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1">Hometown <span className="text-white/45 font-normal">(optional)</span></label>
              <input value={form.hometown} onChange={(e) => set("hometown", e.target.value)}
                placeholder="Houston, TX"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1">Privacy</label>
              <select value={form.privacy} onChange={(e) => set("privacy", e.target.value as MemberPrivacy)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60">
                <option value="public">Public — visible to my sailing crew</option>
                <option value="private">Private — don&apos;t show my name</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-white/70 text-sm font-medium mb-1">About You <span className="text-white/45 font-normal">(optional)</span></label>
              <input value={form.bio} onChange={(e) => set("bio", e.target.value)}
                placeholder="Traveling with family, love the casino, first cruise!"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
            </div>
          </div>
        </div>

        {/* Sailing Info */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base mb-4">Your Sailing *</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1">Ship Name</label>
              <input value={form.ship} onChange={(e) => set("ship", e.target.value)}
                placeholder="Carnival Jubilee"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1">Sail Date</label>
              <input type="date" value={form.sailingDate} onChange={(e) => set("sailingDate", e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60" />
            </div>
          </div>
        </div>

        {/* Crew Picker */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold uppercase tracking-[-0.01em] text-white text-base">Pick Your Crews</h3>
            <span className="text-xs font-bold text-white/45">{form.selectedCrews.length}/3 selected</span>
          </div>
          {form.selectedCrews.length === 3 && (
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-white/55 mb-4">
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
                      ? "bg-white text-black border-white"
                      : maxed
                      ? "bg-white/[0.02] text-white/25 border-white/10 cursor-not-allowed"
                      : "bg-white/5 text-white/70 border-white/15 hover:border-sky-400/60 hover:bg-white/[0.08]"
                  }`}
                >
                  {selected ? "✓ " : ""}{crew}
                </button>
              );
            })}
          </div>
        </div>

        {form.privacy === "public" && (
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-4 text-sm text-white/55">
            <strong className="text-white">You&apos;re going public!</strong> Other cruisers booked on the same ship and sail date will be able to see your display name, hometown, bio, and crews. Your real name, email, and phone are never shared.
          </div>
        )}

        <div className="flex gap-4 justify-end">
          <button onClick={() => router.back()} className="border border-white/25 hover:border-white/70 hover:bg-white/5 text-white font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!canSubmit}
            className="bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all">
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
