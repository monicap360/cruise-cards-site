// Official cruise-line deck-plan pages, per ship.
// These open the cruise line's own deck plans for the exact ship — always the
// most current layout, nothing for us to host or update.
//
// If any link doesn't land on the right ship, just paste the correct URL here.
export const OFFICIAL_DECK_PLANS: Record<string, string> = {
  // Carnival Cruise Line — pattern: /cruise-ships/<ship>/deck-plans
  "Carnival Jubilee":
    "https://www.carnival.com/cruise-ships/carnival-jubilee/deck-plans",
  "Carnival Breeze":
    "https://www.carnival.com/cruise-ships/carnival-breeze/deck-plans",
  "Carnival Dream":
    "https://www.carnival.com/cruise-ships/carnival-dream/deck-plans",
  "Carnival Miracle":
    "https://www.carnival.com/cruise-ships/carnival-miracle/deck-plans",
  "Carnival Tropicale":
    "https://www.carnival.com/cruise-ships/carnival-tropicale/deck-plans",
  "Carnival Vista":
    "https://www.carnival.com/cruise-ships/carnival-vista/deck-plans",
  "Carnival Glory":
    "https://www.carnival.com/cruise-ships/carnival-glory/deck-plans",
  "Carnival Freedom":
    "https://www.carnival.com/cruise-ships/carnival-freedom/deck-plans",

  // Royal Caribbean — pattern: /cruise-ships/<ship>/deck-plans
  "Mariner of the Seas":
    "https://www.royalcaribbean.com/cruise-ships/mariner-of-the-seas/deck-plans",
  "Symphony of the Seas":
    "https://www.royalcaribbean.com/cruise-ships/symphony-of-the-seas/deck-plans",
  "Liberty of the Seas":
    "https://www.royalcaribbean.com/cruise-ships/liberty-of-the-seas/deck-plans",

  // MSC Cruises
  "MSC Seascape":
    "https://www.msccruises.com/int/our-cruises/ships/msc-seascape",

  // Norwegian Cruise Line
  "Norwegian Viva": "https://www.ncl.com/cruise-ships/norwegian-viva",

  // Disney Cruise Line
  "Disney Magic": "https://disneycruise.disney.go.com/ships/magic/",

  // Regent Seven Seas
  "Seven Seas Splendor":
    "https://www.rssc.com/ships/seven_seas_splendor/deckplans",
};

export function officialDeckPlanUrl(ship: string): string | undefined {
  return OFFICIAL_DECK_PLANS[ship];
}
