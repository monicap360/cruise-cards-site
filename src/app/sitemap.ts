import type { MetadataRoute } from "next";
import { GALVESTON_FLEET } from "@/lib/seed-inventory";
import { POSTS } from "@/lib/news";
import { allFeederSlugs } from "@/lib/feeder";
import { GROUP_CRUISES } from "@/lib/group-cruises";

const SITE_URL = "https://cruisesfromgalveston.net";

const shipSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Individual port / destination pages (/destinations/<slug>) — high-value
// long-tail SEO targets. Keep in sync with src/app/destinations/page.tsx ids.
const DESTINATION_SLUGS = [
  "cozumel",
  "costa-maya",
  "progreso",
  "roatan",
  "belize",
  "grand-cayman",
  "nassau",
  "key-west",
  "san-juan",
  "st-thomas",
  "cococay",
  "celebration-key",
  "half-moon-cay",
  "ocean-cay",
  "castaway-cay",
  "harvest-caye",
  "great-stirrup-cay",
];

const ROUTES = [
  "",
  "/find",
  "/deals",
  "/last-minute",
  "/list-your-cruise",
  "/destinations",
  "/ships-from-galveston",
  "/experience-center",
  "/add-ons",
  "/galveston-cruise-tips",
  "/webcams",
  "/news",
  "/guides",
  "/guides/passport-requirements",
  "/guides/cruise-terminals",
  "/guides/travel-insurance",
  "/transportation",
  "/galveston-cruise-hotels",
  "/group-cruises",
  ...GROUP_CRUISES.map((g) => `/group-cruises/${g.slug}`),
  "/cruise-line-apps",
  "/already-booked",
  "/free-cruise",
  "/countdown",
  "/group-blocks",
  "/specials",
  "/sea-pay",
  "/booking-options",
  "/hold",
  "/book",
  "/reserve",
  "/sea-you-on-deck",
  "/sea-you-on-deck/community",
  "/sea-you-on-deck/join",
  "/about",
  "/contact",
  "/vacation-protection",
  "/cancellation-policy",
  "/terms",
  "/legal",
  "/deck-plans",
  "/cruises-from",
  ...DESTINATION_SLUGS.map((s) => `/destinations/${s}`),
  ...POSTS.map((p) => `/news/${p.slug}`),
  ...GALVESTON_FLEET.map((f) => `/ships-from-galveston/${shipSlug(f.ship)}`),
  ...allFeederSlugs().map((slug) => `/cruises-from/${slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r}`,
    changeFrequency:
      r === "" || r === "/deals" || r === "/last-minute" ? "daily" : "weekly",
    priority:
      r === ""
        ? 1
        : r === "/deals" || r === "/last-minute"
        ? 0.9
        : r.startsWith("/ships-from-galveston/")
        ? 0.8
        : 0.7,
  }));
}
