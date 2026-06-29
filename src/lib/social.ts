// Public social links. Set the real URLs here (or via env vars). The Facebook
// GROUP powers the "Sea You on Deck" community connection; the PAGE is for the
// page plugin / share targets.
export const FB_GROUP_URL =
  process.env.NEXT_PUBLIC_FB_GROUP_URL ||
  "https://www.facebook.com/groups/cruisesfromgalveston";
export const FB_PAGE_URL =
  process.env.NEXT_PUBLIC_FB_PAGE_URL ||
  "https://www.facebook.com/cruisesfromgalveston";

// Article-schema "social proof": links the author/publisher to your verified
// Facebook entity (sameAs) and, if set to your REAL number, reports engagement.
export const AUTHOR_NAME = "Cruises from Galveston";
// Set this to your ACTUAL Facebook engagement/comment count. Leave 0 to omit —
// do NOT publish a fake number (Google penalizes inaccurate structured data).
export const FB_ENGAGEMENT = Number(process.env.NEXT_PUBLIC_FB_ENGAGEMENT || 0);
