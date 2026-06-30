// PayPal.Me payment links. Set NEXT_PUBLIC_PAYPAL_ME to your handle — e.g. if
// your link is paypal.me/cruisesfromgalveston, set it to "cruisesfromgalveston".
// paypalLink(amount) builds a link that opens PayPal with the amount pre-filled;
// the customer can pay with their PayPal balance or a card. No merchant account.

export const PAYPAL_ME = process.env.NEXT_PUBLIC_PAYPAL_ME || "";

export function paypalLink(amount: number): string {
  if (!PAYPAL_ME) return "";
  const amt = amount > 0 ? `/${amount.toFixed(2)}` : "";
  return `https://paypal.me/${PAYPAL_ME}${amt}`;
}
