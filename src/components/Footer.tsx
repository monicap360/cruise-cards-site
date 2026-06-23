import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src="/logo.png"
              alt="Cruises from Galveston"
              width={160}
              height={64}
              className="h-14 w-auto object-contain mb-3 brightness-0 invert"
            />
            <p className="text-blue-200 text-sm leading-relaxed">
              Your trusted partner for unforgettable cruise vacations departing
              from the Port of Galveston, Texas.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-red-400 mb-3 uppercase tracking-wide text-sm">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/deals", label: "Cruise Deals" },
                { href: "/ships-from-galveston", label: "Ships from Galveston" },
                { href: "/destinations", label: "Destinations" },
                { href: "/group-blocks", label: "Group Cabin Blocks" },
                { href: "/specials", label: "Cruise Specials" },
                { href: "/sea-you-on-deck", label: "Sea You on Deck" },
                { href: "/sea-pay", label: "Sea Pay" },
                { href: "/hold", label: "Hold a Room" },
                { href: "/booking-options", label: "Booking Options" },
                { href: "/experience-center", label: "Experience Center" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-red-400 mb-3 uppercase tracking-wide text-sm">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>📍 Galveston, Texas</li>
              <li>📞 (409) 555-CRUISE</li>
              <li>✉️ cruisesfromgalveston.texas@gmail.com</li>
              <li className="pt-2 font-semibold text-white">
                Mon–Fri: 9am – 6pm CST
              </li>
            </ul>
          </div>
        </div>

        {/* Trademark strip */}
        <div className="border-t border-blue-700 mt-8 pt-5 pb-2 text-blue-400 text-xs leading-relaxed">
          Cruises from Galveston™ · Cruise Experience Center™ · Sea You On Deck Crews™ · Sea Duck Hunters™ · Sea Pay™ · &ldquo;Cruises Start Here.&rdquo;™ · &ldquo;Plan. Book. Sail.&rdquo;™ are trademarks of Cruises from Galveston™. All crew names, programs, and community systems are proprietary. Unauthorized use is prohibited.
        </div>

        <div className="pt-3 flex items-center justify-between flex-wrap gap-2 text-blue-300 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© {new Date().getFullYear()} Cruises from Galveston™. All Rights Reserved. | Galveston, Texas</span>
            <Link href="/legal" className="text-blue-400 hover:text-white transition-colors underline">
              Legal &amp; IP Notice
            </Link>
          </div>
          <Link href="/admin" className="text-blue-500 hover:text-blue-300 transition-colors">
            Agent Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
