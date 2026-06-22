"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/deals", label: "Cruise Deals" },
  { href: "/ships-from-galveston", label: "Ships" },
  { href: "/destinations", label: "Destinations" },
  { href: "/sea-pay", label: "Sea Pay" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Cruises from Galveston"
              width={160}
              height={64}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-blue-900 hover:bg-blue-50 px-3 py-2 rounded-lg font-semibold text-sm transition-all"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-3 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-full text-sm transition-all shadow"
            >
              Book Now
            </Link>
          </div>

          <button
            className="md:hidden text-blue-900 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className="text-2xl">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-blue-900 px-4 pb-4 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:bg-white/20 px-3 py-2 rounded-lg font-semibold text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 bg-red-600 text-white font-bold px-4 py-2 rounded-full text-sm text-center"
            onClick={() => setOpen(false)}
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
}
