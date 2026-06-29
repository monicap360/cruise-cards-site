// Group store (Shopify) + contact email — shown on every group page.
// Set NEXT_PUBLIC_SHOPIFY_URL to your real Shopify store; the product paths
// below are the conventional Shopify collection/product handles — adjust to match.

export const SHOP_URL =
  process.env.NEXT_PUBLIC_SHOPIFY_URL || "https://shop.cruisesfromgalveston.net";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "cruisesfromgalveston.texas@gmail.com";

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
    title: "Cruise parking",
    desc: "Reserve your Galveston cruise terminal parking for the week.",
    emoji: "🅿️",
    tag: "Book it",
    href: `${SHOP_URL}/products/cruise-parking`,
  },
];
