// Brochures, deck plans & planning resources shown on each sailing. Combines
// your own internal pages with each cruise line's official ship/brochure pages.
//
// To add your OWN brochure PDFs: drop a file in /public/brochures (e.g.
// /public/brochures/carnival-jubilee.pdf) and add an entry to LINE_RESOURCES
// (or SHIP_PDFS) below — it will appear as a download on that sailing.

export type Brochure = { label: string; href: string; icon: string; external?: boolean };

// Official cruise-line resources (stable official domains — ships, deck plans,
// what's-included, dining). Safe to extend with real brochure PDFs when you have them.
const LINE_RESOURCES: Record<string, Brochure[]> = {
  "Carnival Cruise Line": [
    { label: "Carnival ships & deck plans", href: "https://www.carnival.com/cruise-ships", icon: "🛳️", external: true },
    { label: "What's included & FAQs", href: "https://www.carnival.com/help", icon: "❓", external: true },
  ],
  "Royal Caribbean": [
    { label: "Royal Caribbean ships & deck plans", href: "https://www.royalcaribbean.com/cruise-ships", icon: "🛳️", external: true },
    { label: "Dining & onboard experiences", href: "https://www.royalcaribbean.com/cruise-dining", icon: "🍽️", external: true },
  ],
  "Norwegian Cruise Line": [
    { label: "Norwegian ships & deck plans", href: "https://www.ncl.com/cruise-ship", icon: "🛳️", external: true },
    { label: "Freestyle dining & inclusions", href: "https://www.ncl.com/experience/freestyle-cruising", icon: "🍽️", external: true },
  ],
  "MSC Cruises": [
    { label: "MSC fleet & deck plans", href: "https://www.msccruisesusa.com/discover-msc/our-fleet", icon: "🛳️", external: true },
    { label: "MSC experiences & dining", href: "https://www.msccruisesusa.com/discover-msc/cruise-services", icon: "🍽️", external: true },
  ],
  "Disney Cruise Line": [
    { label: "Disney ships & deck plans", href: "https://disneycruise.disney.go.com/ships/", icon: "🛳️", external: true },
    { label: "Onboard activities & dining", href: "https://disneycruise.disney.go.com/onboard-activities/", icon: "🍽️", external: true },
  ],
};

function shipSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Your own brochure PDFs by ship (drop the file in /public/brochures). Add the
// exact ship name here once the PDF exists so it shows as a download.
const SHIP_PDFS: Record<string, string> = {
  // "Carnival Jubilee": "/brochures/carnival-jubilee.pdf",
};

// Everything to show for a given sailing: your internal guides first, then any
// ship brochure PDF you've added, then the cruise line's official resources.
export function brochuresFor(cruiseLine: string, ship: string, sailingId?: string): Brochure[] {
  const list: Brochure[] = [
    { label: `${ship} deck plans`, href: "/deck-plans", icon: "🗺️" },
    { label: "Cruise line app & check-in", href: "/cruise-line-apps", icon: "📱" },
    { label: "What's included in your cruise", href: "/booking-options", icon: "✅" },
  ];
  if (sailingId) {
    list.push({ label: "Print / save this sailing (PDF)", href: `/sailings/${sailingId}/sheet`, icon: "🖨️" });
  }
  const pdf = SHIP_PDFS[ship] ?? SHIP_PDFS[shipSlug(ship)];
  if (pdf) list.push({ label: `${ship} brochure (PDF)`, href: pdf, icon: "📄" });
  return [...list, ...(LINE_RESOURCES[cruiseLine] ?? [])];
}
