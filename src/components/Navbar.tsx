"use client";
import Link from "next/link";
import CompassLogo from "@/components/CompassLogo";
import { useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/find", label: "Find a Cruise" },
  { href: "/deals", label: "Cruise Deals" },
  { href: "/last-minute", label: "Last-Minute" },
  { href: "/ships-from-galveston", label: "Ships" },
  { href: "/destinations", label: "Destinations" },
  { href: "/webcams", label: "Live Cams" },
  { href: "/guides", label: "Guides" },
  { href: "/news", label: "News" },
  { href: "/group-blocks", label: "Group Cabins" },
  { href: "/request-group-space", label: "Travel Agents" },
  { href: "/specials", label: "Specials" },
  { href: "/sea-you-on-deck", label: "Sea You on Deck" },
  { href: "/countdown", label: "Countdown" },
  { href: "/sea-pay", label: "Sea Pay" },
  { href: "/hold", label: "Hold a Room" },
  { href: "/booking-options", label: "Booking Options" },
  { href: "/experience-center", label: "Experience Center" },
  { href: "/reserve", label: "Reserve a Visit" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  function doSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/find?q=${encodeURIComponent(q)}` : "/find");
    setSearch("");
    setOpen(false);
  }

  return (
    <nav className="bg-[#05070d]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center" aria-label="Cruise Experience Center — home">
            <CompassLogo className="scale-125 origin-left" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/65 hover:text-white px-2.5 py-2 rounded-lg font-medium text-[13px] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <form onSubmit={doSearch} className="hidden lg:block ml-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cruises…"
                aria-label="Search cruises"
                className="bg-white/5 border border-white/15 rounded-full px-4 py-1.5 text-[13px] text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60 w-32 focus:w-44 transition-all"
              />
            </form>
            <Link
              href="/select"
              className="ml-2 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full text-xs transition-all"
            >
              Select Cruise
            </Link>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className="text-2xl">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#0b1020] border-t border-white/10 px-4 pb-4 flex flex-col gap-1">
          <form onSubmit={doSearch} className="py-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cruises…"
              aria-label="Search cruises"
              className="w-full bg-white/5 border border-white/15 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
            />
          </form>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/80 hover:bg-white/10 px-3 py-2 rounded-lg font-medium text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/select"
            className="mt-2 bg-white text-black font-semibold uppercase tracking-wider px-4 py-2 rounded-full text-xs text-center"
            onClick={() => setOpen(false)}
          >
            Select Cruise
          </Link>
        </div>
      )}
    </nav>
  );
}
