// Group store (Shopify) + contact email — shown on every group page.
// Set NEXT_PUBLIC_SHOPIFY_URL to your real Shopify store; the product paths
// below are the conventional Shopify collection/product handles — adjust to match.

export const SHOP_URL =
  process.env.NEXT_PUBLIC_SHOPIFY_URL || "https://shop.cruisesfromgalveston.net";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "cruisesfromgalveston.texas@gmail.com";

export const CONTACT_PHONE = "+14096322106";
export const CONTACT_PHONE_DISPLAY = "(409) 632-2106";

// Online scheduling link (Calendly). Connected to Google Calendar so it can't
// double-book. The "Book a call" button opens the on-site /book-a-call page,
// which embeds this.
export const BOOKING_CALENDAR_URL =
  process.env.NEXT_PUBLIC_BOOKING_CALENDAR_URL || "https://calendly.com/cruisesfromgalveston-texas/book-a-call";

// Jotform Credit Card Authorization form — card data goes directly to Jotform
// (PCI-handled there), never to our server/database. Swap the URL to your own form.
export const CC_AUTH_FORM_URL =
  process.env.NEXT_PUBLIC_CC_AUTH_FORM_URL || "https://form.jotform.com/261796516689073";

export type ShopItem = { title: string; desc: string; emoji: string; href: string; tag?: string };

export const SHOP_ITEMS: ShopItem[] = [
  {
    title: "Group cruise shirts",
    desc: "Matching tees for the whole group — choose your color and sizes.",
    emoji: "👕",
    href: `${SHOP_URL}/collections/group-shirts`,
  },
  {
    title: "Soda 12-pack (canned)",
    desc: "Pre-order a 12-pack of canned sodas — pick up at our Galveston Experience Center before you sail.",
    emoji: "🥤",
    tag: "Pickup here",
    href: `${SHOP_URL}/products/soda-12-pack`,
  },
  {
    title: "Drink packages",
    desc: "Deluxe Beverage, Refreshment or Classic Soda packages — add before you sail and save.",
    emoji: "🍹",
    href: `${SHOP_URL}/products/drink-package`,
  },
  {
    title: "Park & Ride",
    desc: "Reserve Galveston park-and-ride cruise parking for the week.",
    emoji: "🅿️",
    tag: "Book it",
    href: `${SHOP_URL}/products/park-and-ride`,
  },
];

// Per-room add-ons that can be ordered for each cabin (emailed to the agency
// until the Shopify store URL is set).
export const ROOM_EXTRAS = [
  { emoji: "🅿️", label: "Park & Ride", item: "Park & Ride cruise parking" },
  { emoji: "🥤", label: "Soda 12-pack", item: "12-pack of canned sodas (pickup at the Experience Center)" },
];
