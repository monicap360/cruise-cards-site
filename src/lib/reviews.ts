// Customer reviews shown across the site (homepage, Experience Center, portals).
// Feature your real Google reviews here so they're front-and-center everywhere.

export const GOOGLE_REVIEWS_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL ||
  "https://www.google.com/search?q=Cruises+from+Galveston+reviews";

// Direct "write a review" link from your Google Business Profile (Share → Get more
// reviews). Falls back to the reviews URL until you set NEXT_PUBLIC_GOOGLE_REVIEW_LINK.
export const GOOGLE_REVIEW_LINK =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_LINK ||
  "https://www.google.com/search?q=Cruises+from+Galveston+reviews";

// Set these once you have them (from your Google Business Profile).
export const GOOGLE_RATING = process.env.NEXT_PUBLIC_GOOGLE_RATING || ""; // e.g. "4.9"
export const GOOGLE_REVIEW_COUNT = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_COUNT || ""; // e.g. "120"

export type Review = { name: string; text: string; stars?: number };

// Paste your real Google reviews here (first name + the review text). Leave the
// array empty and only the "Read our Google reviews" button shows.
export const REVIEWS: Review[] = [
  // { name: "Sarah M.", text: "Monica planned our whole family reunion cruise flawlessly…", stars: 5 },
];
