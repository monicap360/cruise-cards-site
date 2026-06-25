import type { MetadataRoute } from "next";
import { GALVESTON_FLEET } from "@/lib/seed-inventory";

const SITE_URL = "https://galvestoncruiseagency.com";

const shipSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ROUTES = [
  "",
  "/deals",
  "/last-minute",
  "/list-your-cruise",
  "/destinations",
  "/ships-from-galveston",
  "/experience-center",
  "/add-ons",
  "/galveston-cruise-tips",
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
  ...GALVESTON_FLEET.map((f) => `/ships-from-galveston/${shipSlug(f.ship)}`),
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
