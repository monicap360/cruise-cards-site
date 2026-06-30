"use client";

import { useEffect, useState } from "react";

// A friendly "days until you sail" countdown for the group portal. Builds
// anticipation and is the kind of thing guests screenshot and share.
export default function SailCountdown({ sailingDate, ship }: { sailingDate: string; ship?: string }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    if (!sailingDate) return;
    const target = new Date(sailingDate + "T00:00:00").getTime();
    setDays(Math.ceil((target - Date.now()) / 86400000));
  }, [sailingDate]);

  if (days === null) return null;

  let line: React.ReactNode;
  if (days > 1) line = <>🚢 <span className="text-holo">{days}</span> days until you set sail!</>;
  else if (days === 1) line = <>🎉 Just <span className="text-holo">1 day</span> to go — pack your bags!</>;
  else if (days === 0) line = <>🌊 Today&rsquo;s the day — bon voyage!</>;
  else line = <>⚓ We hope you had an amazing cruise!</>;

  return (
    <div className="rounded-2xl border border-sky-400/30 bg-gradient-to-r from-sky-500/10 via-transparent to-indigo-500/10 p-5 sm:p-6 text-center">
      <div className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{line}</div>
      {ship && days >= 0 && (
        <div className="text-white/55 text-sm mt-1.5">aboard the {ship}</div>
      )}
    </div>
  );
}
