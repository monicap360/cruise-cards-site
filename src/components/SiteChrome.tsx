"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ConciergeLauncher from "@/components/ConciergeLauncher";
import SiteNotice from "@/components/SiteNotice";

// The admin dashboard is a separate surface from the public website: it gets
// NO public navbar, footer, floating CTA, or customer chatbot. Everything else
// (the customer-facing site) keeps the full chrome.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main>{children}</main>;
  }

  return (
    <>
      <SiteNotice />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingCTA />
      <ConciergeLauncher />
    </>
  );
}
