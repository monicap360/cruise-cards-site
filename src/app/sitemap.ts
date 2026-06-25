import type { MetadataRoute } from "next";

const SITE_URL = "https://galvestoncruiseagency.com";

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
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r}`,
    changeFrequency: r === "" || r === "/deals" || r === "/last-minute" ? "daily" : "weekly",
    priority: r === "" ? 1 : r === "/deals" || r === "/last-minute" ? 0.9 : 0.7,
  }));
}
