import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Galveston Cruise Specialists",
  description:
    "Talk to a local Galveston cruise specialist — book a cruise, ask about parking, hotels, transfers, or last-minute deals. Visit the Cruise Experience Center or reach out anytime.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
