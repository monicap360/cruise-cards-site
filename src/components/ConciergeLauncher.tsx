"use client";

import { usePathname } from "next/navigation";
import ChatWidget from "@/components/ChatWidget";

// The public sales Concierge bubble. Hidden on /admin (staff) and /account
// (where the Guest Care agent lives instead) so the two bots never overlap.
export default function ConciergeLauncher() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin") || pathname.startsWith("/account")) {
    return null;
  }

  return (
    <ChatWidget
      agent="concierge"
      title="Cruise Concierge"
      subtitle="Cruise Experience Center"
      greeting="Hi! 👋 I'm your Cruise Concierge. Ask me anything about cruises from Galveston — destinations, parking, what's included, or how to book. How can I help?"
      placeholder="Ask about cruises from Galveston…"
    />
  );
}
