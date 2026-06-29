import Link from "next/link";
import Image from "next/image";

const SOCIALS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/cruisesfromgalveston",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M14 9h3l.5-3H14V4.5c0-.9.3-1.5 1.6-1.5H17V.2C16.7.1 15.8 0 14.7 0 12.3 0 10.7 1.5 10.7 4.2V6H8v3h2.7v9H14V9z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/cruisesfromgalveston",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@cruisesfromgalveston",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M16 3c.3 2 1.6 3.5 3.5 3.8v2.6c-1.3 0-2.5-.4-3.5-1.1v5.3a5.3 5.3 0 1 1-5.3-5.3c.3 0 .6 0 .9.1v2.7a2.6 2.6 0 1 0 1.8 2.5V3H16z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@cruisesfromgalveston",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M23 12s0-3-.4-4.4a2.5 2.5 0 0 0-1.8-1.8C19.4 5.4 12 5.4 12 5.4s-7.4 0-8.8.4A2.5 2.5 0 0 0 1.4 7.6C1 9 1 12 1 12s0 3 .4 4.4a2.5 2.5 0 0 0 1.8 1.8c1.4.4 8.8.4 8.8.4s7.4 0 8.8-.4a2.5 2.5 0 0 0 1.8-1.8C23 15 23 12 23 12zM10 15V9l5 3-5 3z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#05070d] text-white border-t border-white/10 print:hidden">
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

            {/* Social media */}
            <div className="mt-5">
              <div className="label-mono text-[10px] uppercase tracking-wider text-white/40 mb-2">
                Follow Us
              </div>
              <div className="flex items-center gap-2.5">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className="w-9 h-9 rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white hover:border-sky-400/60 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="label-mono text-sky-400/80 mb-4 uppercase text-[11px]">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/account", label: "My Account / Login" },
                { href: "/whats-next", label: "You're Booked — What's Next" },
                { href: "/already-booked", label: "Already Booked?" },
                { href: "/cruise-line-apps", label: "Cruise Line Apps & Check-In" },
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
                { href: "/transportation", label: "Transportation & Parking" },
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
              <li>
                <a href="tel:+14096322106" className="hover:text-white transition-colors">
                  (409) 632-2106
                </a>
              </li>
              <li>
                <a href="mailto:info@cruisesfromgalveston.net" className="hover:text-white transition-colors">
                  info@cruisesfromgalveston.net
                </a>
              </li>
              <li className="pt-2 font-semibold text-white">
                Walk-in: cruise days 8:30am – 5pm
              </li>
              <li className="text-white/45">Online & phone: daily 7:30am – 9pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-5 flex items-center justify-between flex-wrap gap-2 text-white/40 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© {new Date().getFullYear()} Cruise Experience Center / Cruises From Galveston. All rights reserved. Portside Priority™ and Cruise Ready Concierge™ are proprietary service programs.</span>
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
