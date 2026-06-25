// ── Static search index ──────────────────────────────────────────────────────
// Gives the /find search engine real content to return even before live
// inventory is seeded: ships, destinations, and key pages.

import { GALVESTON_FLEET } from "./seed-inventory";

export type SearchItem = {
  type: "Ship" | "Destination" | "Page";
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
};

const ships: SearchItem[] = GALVESTON_FLEET.map((s) => ({
  type: "Ship",
  title: s.ship,
  subtitle: `${s.cruiseLine} · ${s.durationLabel} · ${s.itinerary}`,
  href: `/sailings?ship=${encodeURIComponent(s.ship)}`,
  keywords:
    `${s.ship} ${s.cruiseLine} ${s.itinerary} ${s.durationLabel}`.toLowerCase(),
}));

const destinations: SearchItem[] = (
  [
    ["Cozumel", "Mexico — snorkeling, reefs & beaches", "/deals?to=Cozumel"],
    ["Costa Maya", "Mexico — Mayan ruins & beach clubs", "/deals?to=Costa%20Maya"],
    ["Progreso", "Mexico — Chichén Itzá & Mérida", "/deals?to=Progreso"],
    ["Roatán", "Honduras — world-class diving", "/deals?to=Roat%C3%A1n"],
    ["Belize", "Belize — cave tubing & barrier reef", "/deals?to=Belize"],
    ["Grand Cayman", "Cayman Islands — Stingray City", "/deals?to=Grand%20Cayman"],
    ["Nassau", "Bahamas — Atlantis & beaches", "/deals?to=Nassau"],
    ["Key West", "Florida — sunsets & Hemingway", "/deals?to=Key%20West"],
    [
      "Western Caribbean",
      "Cozumel · Roatán · Belize · Costa Maya",
      "/destinations",
    ],
    ["Bahamas", "Nassau · Perfect Day at CocoCay", "/destinations"],
  ] as const
).map(([title, subtitle, href]) => ({
  type: "Destination" as const,
  title,
  subtitle,
  href,
  keywords: `${title} ${subtitle} caribbean mexico`.toLowerCase(),
}));

const pages: SearchItem[] = (
  [
    ["Cruise Deals", "Current sailings & low deposits", "/deals"],
    ["Last-Minute Sailings", "Transferred cabins, sail soon", "/last-minute"],
    ["Cruise Experience Center", "Walk-in cruise help in Galveston", "/experience-center"],
    ["Sea Pay™", "Split your cruise into easy payments", "/sea-pay"],
    ["Hotels, Transfers & Add-Ons", "Build your whole trip", "/add-ons"],
    ["Galveston Cruise Tips", "Local insider tips", "/galveston-cruise-tips"],
    ["Cruise Countdown", "Count down to sail day", "/countdown"],
    ["Ships from Galveston", "Compare the fleet", "/ships-from-galveston"],
    ["Group Cabins", "Block cabins for your group", "/group-blocks"],
  ] as const
).map(([title, subtitle, href]) => ({
  type: "Page" as const,
  title,
  subtitle,
  href,
  keywords: `${title} ${subtitle}`.toLowerCase(),
}));

export const SEARCH_CONTENT: SearchItem[] = [...ships, ...destinations, ...pages];
