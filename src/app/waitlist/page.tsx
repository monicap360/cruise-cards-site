"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WaitlistForm from "@/components/WaitlistForm";

function WaitlistInner() {
  const params = useSearchParams();
  const ship = params.get("ship") ?? "";
  const date = params.get("date") ?? "";

  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      <section className="relative overflow-hidden bg-[#05070d] py-16">
        <div className="absolute inset-0 grid-bg" />
        <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Sold out? Get on the list"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] mb-4">
            Join the <span className="text-holo">Waitlist</span>
          </h1>
          <p className="text-white/60 text-lg">
            Want a cabin on a sailing that&rsquo;s full{ship ? ` — like ${ship}` : ""}? Add
            yourself to the waitlist and we&rsquo;ll call you the moment a room opens up.
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-4">
        <WaitlistForm defaultShip={ship} defaultDate={date} />
      </section>
    </div>
  );
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={null}>
      <WaitlistInner />
    </Suspense>
  );
}
