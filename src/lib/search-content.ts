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
  image?: string; // /public path; falls back to a gradient if missing
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents (Roatán → roatan)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const ships: SearchItem[] = GALVESTON_FLEET.map((s) => ({
  type: "Ship",
  title: s.ship,
  subtitle: `${s.cruiseLine} · ${s.durationLabel} · ${s.itinerary}`,
  // Link to the ship's own page ("all about the ship" + its sailings) rather
  // than a bare sailings query, so a ship search always lands somewhere useful.
  href: `/ships-from-galveston/${slugify(s.ship)}`,
  keywords:
    `${s.ship} ${s.cruiseLine} ${s.itinerary} ${s.durationLabel}`.toLowerCase(),
  image: `/ships/${slugify(s.ship)}.jpg`,
}));

const destinations: SearchItem[] = (
  [
    ["Cozumel", "Mexico — snorkeling, reefs & beaches", "/deals?to=Cozumel", "/destinations/cozumel.jpg"],
    ["Costa Maya", "Mexico — Mayan ruins & beach clubs", "/deals?to=Costa%20Maya", "/destinations/costa-maya.jpg"],
    ["Progreso", "Mexico — Chichén Itzá & Mérida", "/deals?to=Progreso", "/destinations/progreso.jpg"],
    ["Roatán", "Honduras — world-class diving", "/deals?to=Roat%C3%A1n", "/destinations/roatan.jpg"],
    ["Belize", "Belize — cave tubing & barrier reef", "/deals?to=Belize", "/destinations/belize.jpg"],
    ["Grand Cayman", "Cayman Islands — Stingray City", "/deals?to=Grand%20Cayman", "/destinations/grand-cayman.jpg"],
    ["Nassau", "Bahamas — Atlantis & beaches", "/deals?to=Nassau", "/destinations/nassau.jpg"],
    ["Key West", "Florida — sunsets & Hemingway", "/deals?to=Key%20West", "/destinations/key-west.jpg"],
    ["Western Caribbean", "Cozumel · Roatán · Belize · Costa Maya", "/destinations", "/destinations/cozumel.jpg"],
    ["Bahamas", "Nassau · Perfect Day at CocoCay", "/destinations", "/destinations/nassau.jpg"],
  ] as const
).map(([title, subtitle, href, image]) => ({
  type: "Destination" as const,
  title,
  subtitle,
  href,
  image,
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
    ["Ship Deck Plans", "Official deck plans for every ship", "/deck-plans"],
    ["Group Cabins", "Block cabins for your group", "/group-blocks"],
    ["Vacation Protection", "Protect your trip investment", "/vacation-protection"],
    ["Protect Your Booking", "Cancellation policies — before you book or cancel", "/cancellation-policy"],
    ["Reserve a Visit", "Book time at the Experience Center", "/reserve"],
    ["Sea You on Deck", "See who's on your sailing", "/sea-you-on-deck"],
  ] as const
).map(([title, subtitle, href]) => ({
  type: "Page" as const,
  title,
  subtitle,
  href,
  keywords: `${title} ${subtitle}`.toLowerCase(),
}));

export const SEARCH_CONTENT: SearchItem[] = [...ships, ...destinations, ...pages];
