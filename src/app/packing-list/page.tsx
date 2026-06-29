import type { Metadata } from "next";
import Link from "next/link";
import CruisePackingList from "@/components/CruisePackingList";

export const metadata: Metadata = {
  title: "Cruise Packing List from Galveston — What to Bring & Not Bring | Cruises from Galveston",
  description:
    "Free cruise packing list for Galveston sailings: what to bring, what's NOT allowed onboard, and the travel-document rules — including birth certificates, photo IDs, and school IDs for minors 14 and up.",
  alternates: { canonical: "/packing-list" },
};

export default function PackingListPage() {
  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-2">{"// Before You Sail"}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.02em]">Cruise Packing List</h1>
          <p className="text-white/60 mt-2">
            Everything you need for a cruise from Galveston — and what to leave at home. Pack your documents in your carry-on.
          </p>
        </div>

        <div className="bg-[#0b1020]/40 border border-white/10 rounded-2xl p-6">
          <CruisePackingList />
        </div>

        <div className="text-center">
          <Link href="/find" className="inline-flex bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full">
            Find your cruise from Galveston →
          </Link>
        </div>
      </section>
    </div>
  );
}
