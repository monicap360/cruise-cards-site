import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cruises from Galveston | Cruise Experience Center",
  description:
    "Galveston's #1 cruise specialists. Book Caribbean, Mexico, and Bahamas cruises departing from the Port of Galveston, Texas. No flying required!",
  other: {
    copyright: `© ${new Date().getFullYear()} Cruises from Galveston™. All Rights Reserved.`,
    "og:site_name": "Cruises from Galveston™",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased bg-white text-gray-900`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  );
}
