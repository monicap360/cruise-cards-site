// "Things to do before you sail" in the embarkation city, shown on each group
// portal. Keyed by city; each group maps to a city (default Galveston).

export type EmbarkGuide = {
  city: string;
  intro: string;
  things: { name: string; blurb: string }[];
  tip: string;
};

export const EMBARK_GUIDES: Record<string, EmbarkGuide> = {
  galveston: {
    city: "Galveston",
    intro: "Come in the day before and make a trip of it — Galveston is a fun little island, and you'll be minutes from the terminal on sail morning.",
    things: [
      { name: "The Strand Historic District", blurb: "Victorian shopping district full of boutiques, galleries, candy shops and restaurants — a perfect pre-cruise stroll." },
      { name: "Pleasure Pier", blurb: "Amusement rides and a Ferris wheel built right out over the Gulf on Seawall Blvd." },
      { name: "Moody Gardens", blurb: "Glass pyramids with a rainforest, aquarium, and 3D theater — great with kids." },
      { name: "The Seawall & Beaches", blurb: "10 miles of beachfront — rent a surrey bike along the Seawall, or hit Stewart Beach & East Beach." },
      { name: "Historic Mansions", blurb: "Tour the 1892 Bishop's Palace and Moody Mansion, Gilded-Age landmarks downtown." },
      { name: "Fresh Gulf Seafood", blurb: "Harbor institutions like Gaido's and Willie G's — go the night before you sail." },
    ],
    tip: "Staying near the Seawall or Strand keeps you close to dinner, the beach, and the terminal. Ask us about a pre-cruise hotel + parking package.",
  },
  seattle: {
    city: "Seattle",
    intro: "Fly in a day early — Seattle is worth it, and it protects your cruise from flight delays. The terminals are a short ride from downtown.",
    things: [
      { name: "Pike Place Market", blurb: "The legendary public market — flying fish, fresh flowers, food stalls, and the very first Starbucks." },
      { name: "Space Needle & Chihuly Garden", blurb: "Iconic 360° views, paired with the stunning Chihuly Garden and Glass right at its base." },
      { name: "The Waterfront & Great Wheel", blurb: "Stroll the revamped waterfront, ride the Seattle Great Wheel, and grab chowder with a harbor view." },
      { name: "Pioneer Square", blurb: "Historic district with cobblestone streets and the quirky Seattle Underground walking tour." },
      { name: "MoPOP", blurb: "The Museum of Pop Culture — music, sci-fi, and pop exhibits in a wild Frank Gehry building." },
      { name: "Ferry to Bainbridge Island", blurb: "A cheap, gorgeous 35-minute ferry across Puget Sound for skyline and mountain views." },
    ],
    tip: "Seattle's cruise terminals (Pier 91 / Pier 66) are a quick ride from downtown. Ask us about a pre-cruise hotel + airport transfer.",
  },
};

// Map a group code to its embark city. Default = Galveston.
const GROUP_EMBARK: Record<string, string> = {
  "gabby-group": "seattle",
};

export function embarkForGroup(code: string): EmbarkGuide | null {
  const key = GROUP_EMBARK[code] || "galveston";
  return EMBARK_GUIDES[key] || null;
}
