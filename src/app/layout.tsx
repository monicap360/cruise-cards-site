import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import Analytics from "@/components/Analytics";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const SITE_URL = "https://galvestoncruiseagency.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Cruises from Galveston | Cruise Experience Center — Galveston, TX",
    template: "%s | Cruises from Galveston",
  },
  description:
    "Galveston's local cruise specialists with a real walk-in Cruise Experience Center. Book Carnival, Royal Caribbean, MSC, Norwegian & Disney cruises from the Port of Galveston — plus parking, hotels, transfers, luggage storage & last-minute deals.",
  keywords: [
    "cruises from Galveston",
    "Galveston cruise deals",
    "Galveston cruise agency",
    "Cruise Experience Center Galveston",
    "Galveston cruise parking",
    "last minute cruises from Galveston",
    "Carnival cruises from Galveston",
    "Galveston pre-cruise hotel",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Cruises from Galveston | Cruise Experience Center",
    description:
      "Book cruises from the Port of Galveston with local specialists — plus parking, hotels, transfers, luggage storage, and last-minute deals.",
    url: SITE_URL,
    siteName: "Cruises from Galveston™",
    type: "website",
    locale: "en_US",
  },
  other: {
    copyright: `© ${new Date().getFullYear()} Cruises from Galveston™. All Rights Reserved.`,
  },
};

// LocalBusiness / TravelAgency structured data — lets the physical Experience
// Center rank in the Google Map Pack (where online-only OTAs can't appear).
// NOTE: confirm street address / hours / phone are correct for the storefront.
const BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Cruises from Galveston — Cruise Experience Center",
  url: SITE_URL,
  image: `${SITE_URL}/logo.png`,
  telephone: "+1-409-632-2106",
  email: "info@galvestoncruiseagency.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3501 Winnie St",
    addressLocality: "Galveston",
    addressRegion: "TX",
    postalCode: "77550",
    addressCountry: "US",
  },
  areaServed: "Port of Galveston, Galveston Island, Greater Houston",
  // Walk-in storefront opens on cruise days only, 8:30 AM–5:00 PM (set the real
  // varying hours in Google Business Profile). Online & phone support is daily.
  openingHours: "Mo-Su 08:30-17:00",
  description:
    "Walk-in Cruise Experience Center open on Port of Galveston cruise days, 8:30 AM–5:00 PM (closed non-cruise days). Online & phone support daily, 7:30 AM–9:00 PM.",
  slogan: "Cruises Start Here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${playfair.variable} antialiased bg-[#05070d] text-white`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS_JSONLD) }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingCTA />
        <Analytics />
      </body>
    </html>
  );
}
