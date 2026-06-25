import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#05070d] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src="/logo.png"
              alt="Cruises from Galveston"
              width={160}
              height={64}
              className="h-14 w-auto object-contain mb-3 brightness-0 invert"
            />
            <p className="text-white/55 text-sm leading-relaxed">
              Your trusted partner for unforgettable cruise vacations departing
              from the Port of Galveston, Texas.
            </p>
            <p className="text-white/40 text-xs mt-3">
              The Cruise Experience Center™ is powered by Cruises from Galveston™.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
              <span className="label-mono text-[10px] uppercase tracking-wider text-sky-400/80">
                BBB
              </span>
              <span className="text-white/55 text-xs">
                Accredited Business · Local Galveston experts
              </span>
            </div>
          </div>

          <div>
            <h3 className="label-mono text-sky-400/80 mb-4 uppercase text-[11px]">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/deals", label: "Cruise Deals" },
                { href: "/last-minute", label: "Last-Minute Sailings" },
                { href: "/list-your-cruise", label: "List Your Cruise" },
                { href: "/ships-from-galveston", label: "Ships from Galveston" },
                { href: "/deck-plans", label: "Ship Deck Plans" },
                { href: "/destinations", label: "Destinations" },
                { href: "/galveston-cruise-tips", label: "Galveston Cruise Tips" },
                { href: "/group-blocks", label: "Group Cabin Blocks" },
                { href: "/specials", label: "Cruise Specials" },
                { href: "/sea-you-on-deck", label: "Sea You on Deck" },
                { href: "/countdown", label: "Cruise Countdown" },
                { href: "/sea-pay", label: "Sea Pay" },
                { href: "/hold", label: "Hold a Room" },
                { href: "/booking-options", label: "Booking Options" },
                { href: "/add-ons", label: "Hotels, Transfers & Extras" },
                { href: "/cancellation-policy", label: "Cancellation Policy" },
                { href: "/terms", label: "Terms & Conditions" },
                { href: "/vacation-protection", label: "Vacation Protection" },
                { href: "/experience-center", label: "Experience Center" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/55 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label-mono text-sky-400/80 mb-4 uppercase text-[11px]">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-white/55">
              <li>3501 Winnie St, Galveston, TX 77550</li>
              <li>(409) 632-2106</li>
              <li>info@galvestoncruiseagency.com</li>
              <li className="pt-2 font-semibold text-white">
                Walk-in: cruise days 8:30am – 5pm
              </li>
              <li className="text-white/45">Online & phone: daily 7:30am – 9pm</li>
            </ul>
          </div>
        </div>

        {/* Trademark strip */}
        <div className="border-t border-white/10 mt-10 pt-5 pb-2 text-white/35 text-xs leading-relaxed">
          Cruises from Galveston™ · Cruise Experience Center™ · Sea You On Deck Crews™ · Sea Duck Hunters™ · Sea Pay™ · &ldquo;Cruises Start Here.&rdquo;™ · &ldquo;Plan. Book. Sail.&rdquo;™ are trademarks of Cruises from Galveston™. All crew names, programs, and community systems are proprietary. Unauthorized use is prohibited.
        </div>

        <div className="pt-3 flex items-center justify-between flex-wrap gap-2 text-white/40 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© {new Date().getFullYear()} Cruises from Galveston™. All Rights Reserved. | Galveston, Texas</span>
            <Link href="/legal" className="text-sky-400/80 hover:text-white transition-colors underline">
              Legal &amp; IP Notice
            </Link>
          </div>
          <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
            Agent Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
