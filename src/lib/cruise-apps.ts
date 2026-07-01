// Cruise-line app + online check-in guides. Shared by /cruise-line-apps and the
// individual reservation portal so a guest sees the right steps for their line.

export type LineGuide = {
  line: string;
  app: string;
  appNote: string;
  portal: string; // what the website "manage" area is called
  portalUrl: string;
  steps: string[];
};

export const appSearch = (q: string, store: "ios" | "android") =>
  store === "ios"
    ? `https://apps.apple.com/us/search?term=${encodeURIComponent(q)}`
    : `https://play.google.com/store/search?q=${encodeURIComponent(q)}&c=apps`;

export const GUIDES: LineGuide[] = [
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

// Best-match guide for a cruise line name (loose contains match). Falls back to Carnival.
export function appGuideFor(cruiseLine: string): LineGuide {
  const q = (cruiseLine || "").toLowerCase();
  return (
    GUIDES.find((g) => q.includes(g.line.toLowerCase().split(" ")[0])) ??
    GUIDES.find((g) => g.line.toLowerCase().includes(q)) ??
    GUIDES[0]
  );
}
