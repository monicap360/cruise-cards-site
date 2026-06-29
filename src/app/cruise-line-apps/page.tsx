import type { Metadata } from "next";
import Link from "next/link";
import CruiseLineLogo from "@/components/CruiseLineLogo";

export const metadata: Metadata = {
  title: "Cruise Line Apps & Booking Portals | Cruises from Galveston",
  description:
    "Step-by-step guide to downloading each cruise line's app (Carnival HUB, Royal Caribbean, NCL, MSC for Me, Disney Navigator) and adding your booking number to do online check-in.",
};

type LineGuide = {
  line: string;
  app: string;
  appNote: string;
  portal: string; // what the website manage area is called
  portalUrl: string;
  steps: string[];
};

const appSearch = (q: string, store: "ios" | "android") =>
  store === "ios"
    ? `https://apps.apple.com/us/search?term=${encodeURIComponent(q)}`
    : `https://play.google.com/store/search?q=${encodeURIComponent(q)}&c=apps`;

const GUIDES: LineGuide[] = [
  {
    line: "Carnival Cruise Line",
    app: "Carnival HUB App",
    appNote: "Daily schedule, chat, and your account onboard.",
    portal: "My Cruise Manager",
    portalUrl: "https://www.carnival.com",
    steps: [
      "Download the free Carnival HUB App from the App Store or Google Play.",
      "Go to carnival.com and choose Manage → My Cruise Manager.",
      "Create or log into your Carnival account, then add your cruise with your 6-character booking number, ship, sail date, and last name.",
      "Complete Online Check-In (opens 14 days before you sail) and pick your arrival appointment.",
      "Save your boarding pass to your phone — and use the HUB app once onboard.",
    ],
  },
  {
    line: "Royal Caribbean",
    app: "Royal Caribbean International App",
    appNote: "Check-in, SeaPass, and the onboard planner.",
    portal: "Cruise Planner",
    portalUrl: "https://www.royalcaribbean.com",
    steps: [
      "Download the Royal Caribbean International app from the App Store or Google Play.",
      "Open the app (or royalcaribbean.com) and sign in / create an account.",
      "Tap Add a cruise and enter your reservation by booking ID, last name, and sail date.",
      "Complete check-in in the app — add a photo, passport, and arrival time to get your digital SeaPass.",
      "Use Cruise Planner on the website to pre-book dining, drinks, and excursions.",
    ],
  },
  {
    line: "Norwegian Cruise Line",
    app: "Cruise Norwegian App",
    appNote: "Plan onboard and view your itinerary.",
    portal: "My NCL",
    portalUrl: "https://www.ncl.com",
    steps: [
      "Download the Cruise Norwegian app from the App Store or Google Play.",
      "Go to ncl.com and sign into (or create) your My NCL account.",
      "Choose Add a reservation and enter your booking number with your name and sail date.",
      "Complete Online Check-In and upload your documents to get your eDocs / boarding pass.",
      "Connect the app to your reservation to use it onboard.",
    ],
  },
  {
    line: "MSC Cruises",
    app: "MSC for Me",
    appNote: "Onboard map, planner, and reservations.",
    portal: "Web Check-in",
    portalUrl: "https://www.msccruises.com",
    steps: [
      "Download the MSC for Me app from the App Store or Google Play.",
      "Go to msccruises.com and open your MSC Account / Web Check-in.",
      "Link your cruise using your booking number and last name.",
      "Complete Web Check-in, add guest details and a photo, and download your boarding documents.",
      "Use MSC for Me onboard for the daily program and to find your way around.",
    ],
  },
  {
    line: "Disney Cruise Line",
    app: "Disney Cruise Line Navigator",
    appNote: "Onboard schedule, chat, and activities.",
    portal: "My Reservations / Online Check-In",
    portalUrl: "https://disneycruise.disney.go.com",
    steps: [
      "Download the Disney Cruise Line Navigator app from the App Store or Google Play.",
      "Go to disneycruise.disney.go.com and sign into your Disney account.",
      "Open My Reservations and link your cruise with your reservation number, name, and sail date.",
      "Complete Online Check-In (check your check-in window — it's based on Castaway Club status) and select your Port Arrival Time.",
      "Use the Navigator app onboard for the daily schedule and chat.",
    ],
  },
];

export default function CruiseLineAppsPage() {
  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 grid-bg">
        <div className="aurora bg-sky-500 w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Prepare for Your Cruise"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] mb-3">
            Cruise Line Apps &amp; Check-In
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Download your cruise line&rsquo;s app and add your booking number to
            do online check-in. Here&rsquo;s exactly how, step by step.
          </p>
        </div>
      </section>

      {/* Where do I find my booking number */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-[#0b1020] border border-sky-400/25 rounded-2xl p-6 flex items-start gap-3">
          <span className="text-2xl">🔑</span>
          <div>
            <h2 className="font-extrabold uppercase tracking-tight text-white mb-1">
              Where&rsquo;s my booking number?
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Once we finalize your reservation, we send you the cruise
              line&rsquo;s booking number (also called a reservation number or
              booking ID). You&rsquo;ll use that number — plus your name and sail
              date — to link your cruise in the app and on the website. Can&rsquo;t
              find it?{" "}
              <Link href="/contact" className="text-sky-400 hover:text-sky-300">
                Ask us
              </Link>{" "}
              and we&rsquo;ll resend it.
            </p>
          </div>
        </div>
      </section>

      {/* Per-line guides */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {GUIDES.map((g) => (
          <div
            key={g.line}
            className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <CruiseLineLogo line={g.line} className="h-7 w-auto" />
                <div>
                  <div className="font-extrabold uppercase tracking-tight text-white">
                    {g.app}
                  </div>
                  <div className="text-white/45 text-xs">{g.appNote}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={appSearch(g.app, "ios")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black hover:bg-white/90 font-semibold text-xs px-4 py-2.5 rounded-full transition-all"
                >
                   App Store
                </a>
                <a
                  href={appSearch(g.app, "android")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black hover:bg-white/90 font-semibold text-xs px-4 py-2.5 rounded-full transition-all"
                >
                  ▶ Google Play
                </a>
                <a
                  href={g.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/25 hover:border-white/60 text-white font-semibold text-xs px-4 py-2.5 rounded-full transition-all"
                >
                  {g.portal} ↗
                </a>
              </div>
            </div>

            <ol className="space-y-2.5">
              {g.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-400/15 text-sky-300 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-white/70 text-sm leading-relaxed">
                    {s}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}

        <p className="text-white/40 text-xs">
          Online check-in and app features vary by cruise line and open at
          different times before sailing (Carnival opens at 14 days; others vary).
          App and website layouts change — if a step looks different, look for
          &ldquo;Manage Booking,&rdquo; &ldquo;Add a Cruise,&rdquo; or
          &ldquo;Check-In,&rdquo; or just ask us for a hand.
        </p>
      </section>
    </div>
  );
}
