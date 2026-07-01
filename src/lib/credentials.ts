// Trust & credential signals shown across the site. Edit here to update.
// (Add your CLIA member # once you have it handy and it can be shown too.)

export type Credential = { icon: string; title: string; blurb: string; href?: string };

export const PRESS_URL =
  "https://www.yahoo.com/lifestyle/articles/harrowing-cruise-experiences-could-avoided-231511000.html";

export const CREDENTIALS: Credential[] = [
  {
    icon: "📰",
    title: "Featured in the Houston Chronicle",
    blurb: "Monica was interviewed as a cruise expert on why travel protection matters. Read the feature →",
    href: PRESS_URL,
  },
  {
    icon: "⚓",
    title: "CLIA Member Agency",
    blurb: "Accredited by Cruise Lines International Association — the cruise industry's trade authority.",
  },
  {
    icon: "🔒",
    title: "No card charged online",
    blurb: "Pay by check, PayPal, or the cruise line directly. We never store card numbers.",
  },
  {
    icon: "🛡️",
    title: "Your info stays private",
    blurb: "Used only to book and manage your cruise — never sold or shared.",
  },
  {
    icon: "📍",
    title: "A real Galveston presence",
    blurb: "A physical Cruise Experience Center on the island — a place you can walk into.",
  },
];
