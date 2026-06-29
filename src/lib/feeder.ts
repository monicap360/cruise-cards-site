// Feeder-market data + helpers for /cruises-from SEO pages.
// Targets people traveling to Galveston, TX cruises from feeder cities and
// states around Texas. Miles/drive times are one-way to the Port of Galveston
// and intentionally approximate — the live map embed gives exact routing.

export type FeederMode = "drive" | "fly-or-drive" | "fly";

export type FeederCity = {
  slug: string;
  city: string;
  stateAbbr: string;
  state: string;
  miles: number;
  driveTime: string;
  mode: FeederMode;
  route: string;
  originAirport?: string;
};

export type FeederState = {
  slug: string;
  state: string;
  stateAbbr: string;
  intro: string;
};

export const FEEDER_CITIES: FeederCity[] = [
  {
    slug: "houston-tx",
    city: "Houston",
    stateAbbr: "TX",
    state: "Texas",
    miles: 50,
    driveTime: "about 1 hour",
    mode: "drive",
    route: "I-45 South",
  },
  {
    slug: "san-antonio-tx",
    city: "San Antonio",
    stateAbbr: "TX",
    state: "Texas",
    miles: 250,
    driveTime: "about 3.5–4 hours",
    mode: "drive",
    route: "I-10 E to I-45 S",
  },
  {
    slug: "austin-tx",
    city: "Austin",
    stateAbbr: "TX",
    state: "Texas",
    miles: 200,
    driveTime: "about 3.5 hours",
    mode: "drive",
    route: "US-290/TX-71 to I-45 S",
  },
  {
    slug: "dallas-tx",
    city: "Dallas",
    stateAbbr: "TX",
    state: "Texas",
    miles: 290,
    driveTime: "about 4.5–5 hours",
    mode: "drive",
    route: "I-45 South",
  },
  {
    slug: "fort-worth-tx",
    city: "Fort Worth",
    stateAbbr: "TX",
    state: "Texas",
    miles: 310,
    driveTime: "about 5 hours",
    mode: "drive",
    route: "I-45 S via Dallas",
  },
  {
    slug: "corpus-christi-tx",
    city: "Corpus Christi",
    stateAbbr: "TX",
    state: "Texas",
    miles: 210,
    driveTime: "about 3.5 hours",
    mode: "drive",
    route: "TX-35 to I-69E",
  },
  {
    slug: "waco-tx",
    city: "Waco",
    stateAbbr: "TX",
    state: "Texas",
    miles: 215,
    driveTime: "about 3.5 hours",
    mode: "drive",
    route: "I-35 S to I-45 S",
  },
  {
    slug: "college-station-tx",
    city: "College Station",
    stateAbbr: "TX",
    state: "Texas",
    miles: 120,
    driveTime: "about 2 hours",
    mode: "drive",
    route: "TX-6 South",
  },
  {
    slug: "beaumont-tx",
    city: "Beaumont",
    stateAbbr: "TX",
    state: "Texas",
    miles: 75,
    driveTime: "about 1.5 hours",
    mode: "drive",
    route: "I-10 W to I-45 S",
  },
  {
    slug: "killeen-tx",
    city: "Killeen",
    stateAbbr: "TX",
    state: "Texas",
    miles: 215,
    driveTime: "about 3.5 hours",
    mode: "drive",
    route: "I-35 S to TX-6",
  },
  {
    slug: "tyler-tx",
    city: "Tyler",
    stateAbbr: "TX",
    state: "Texas",
    miles: 250,
    driveTime: "about 4 hours",
    mode: "drive",
    route: "US-69 to I-45 S",
  },
  {
    slug: "el-paso-tx",
    city: "El Paso",
    stateAbbr: "TX",
    state: "Texas",
    miles: 750,
    driveTime: "about 11 hours",
    mode: "fly",
    route: "I-10 East",
    originAirport: "ELP",
  },
  {
    slug: "lubbock-tx",
    city: "Lubbock",
    stateAbbr: "TX",
    state: "Texas",
    miles: 565,
    driveTime: "about 8.5 hours",
    mode: "fly-or-drive",
    route: "US-84 to I-45 S",
    originAirport: "LBB",
  },
  {
    slug: "amarillo-tx",
    city: "Amarillo",
    stateAbbr: "TX",
    state: "Texas",
    miles: 650,
    driveTime: "about 10 hours",
    mode: "fly",
    route: "I-27/US-287 to I-45 S",
    originAirport: "AMA",
  },
  {
    slug: "midland-tx",
    city: "Midland",
    stateAbbr: "TX",
    state: "Texas",
    miles: 540,
    driveTime: "about 8 hours",
    mode: "fly-or-drive",
    route: "I-20 E to I-45 S",
    originAirport: "MAF",
  },
  {
    slug: "mcallen-tx",
    city: "McAllen",
    stateAbbr: "TX",
    state: "Texas",
    miles: 360,
    driveTime: "about 5.5 hours",
    mode: "fly-or-drive",
    route: "US-281 to I-37 to I-45 S",
    originAirport: "MFE",
  },
  {
    slug: "laredo-tx",
    city: "Laredo",
    stateAbbr: "TX",
    state: "Texas",
    miles: 365,
    driveTime: "about 5.5 hours",
    mode: "fly-or-drive",
    route: "I-35 to I-10 E to I-45 S",
    originAirport: "LRD",
  },
  {
    slug: "oklahoma-city-ok",
    city: "Oklahoma City",
    stateAbbr: "OK",
    state: "Oklahoma",
    miles: 520,
    driveTime: "about 7.5–8 hours",
    mode: "fly-or-drive",
    route: "I-35 S to I-45 S",
    originAirport: "OKC",
  },
  {
    slug: "tulsa-ok",
    city: "Tulsa",
    stateAbbr: "OK",
    state: "Oklahoma",
    miles: 565,
    driveTime: "about 8.5 hours",
    mode: "fly-or-drive",
    route: "US-75 to I-45 S",
    originAirport: "TUL",
  },
  {
    slug: "new-orleans-la",
    city: "New Orleans",
    stateAbbr: "LA",
    state: "Louisiana",
    miles: 350,
    driveTime: "about 5.5 hours",
    mode: "drive",
    route: "I-10 West",
  },
  {
    slug: "baton-rouge-la",
    city: "Baton Rouge",
    stateAbbr: "LA",
    state: "Louisiana",
    miles: 270,
    driveTime: "about 4.5 hours",
    mode: "drive",
    route: "I-10 West",
  },
  {
    slug: "shreveport-la",
    city: "Shreveport",
    stateAbbr: "LA",
    state: "Louisiana",
    miles: 310,
    driveTime: "about 5 hours",
    mode: "drive",
    route: "I-49 S to I-10 W",
  },
  {
    slug: "lafayette-la",
    city: "Lafayette",
    stateAbbr: "LA",
    state: "Louisiana",
    miles: 270,
    driveTime: "about 4.5 hours",
    mode: "drive",
    route: "I-10 West",
  },
  {
    slug: "lake-charles-la",
    city: "Lake Charles",
    stateAbbr: "LA",
    state: "Louisiana",
    miles: 165,
    driveTime: "about 2.75 hours",
    mode: "drive",
    route: "I-10 West",
  },
  {
    slug: "little-rock-ar",
    city: "Little Rock",
    stateAbbr: "AR",
    state: "Arkansas",
    miles: 520,
    driveTime: "about 7.5 hours",
    mode: "fly-or-drive",
    route: "I-30 S to I-45 S",
    originAirport: "LIT",
  },
  {
    slug: "fayetteville-ar",
    city: "Fayetteville",
    stateAbbr: "AR",
    state: "Arkansas",
    miles: 560,
    driveTime: "about 8.5 hours",
    mode: "fly-or-drive",
    route: "I-49 S to I-30 to I-45 S",
    originAirport: "XNA",
  },
  {
    slug: "jackson-ms",
    city: "Jackson",
    stateAbbr: "MS",
    state: "Mississippi",
    miles: 440,
    driveTime: "about 6.5 hours",
    mode: "fly-or-drive",
    route: "I-55 S to I-10 W",
    originAirport: "JAN",
  },
  {
    slug: "kansas-city-mo",
    city: "Kansas City",
    stateAbbr: "MO",
    state: "Missouri",
    miles: 750,
    driveTime: "about 11 hours",
    mode: "fly",
    route: "I-49 S to I-45 S",
    originAirport: "MCI",
  },
  {
    slug: "st-louis-mo",
    city: "St. Louis",
    stateAbbr: "MO",
    state: "Missouri",
    miles: 780,
    driveTime: "about 11.5 hours",
    mode: "fly",
    route: "I-44 to US-69 to I-45 S",
    originAirport: "STL",
  },
  {
    slug: "springfield-mo",
    city: "Springfield",
    stateAbbr: "MO",
    state: "Missouri",
    miles: 620,
    driveTime: "about 9.5 hours",
    mode: "fly-or-drive",
    route: "US-65 to I-45 S",
    originAirport: "SGF",
  },
  {
    slug: "wichita-ks",
    city: "Wichita",
    stateAbbr: "KS",
    state: "Kansas",
    miles: 590,
    driveTime: "about 9 hours",
    mode: "fly-or-drive",
    route: "I-35 S to I-45 S",
    originAirport: "ICT",
  },
  {
    slug: "memphis-tn",
    city: "Memphis",
    stateAbbr: "TN",
    state: "Tennessee",
    miles: 640,
    driveTime: "about 9.5 hours",
    mode: "fly",
    route: "I-55 S to I-10 W",
    originAirport: "MEM",
  },
  {
    slug: "nashville-tn",
    city: "Nashville",
    stateAbbr: "TN",
    state: "Tennessee",
    miles: 780,
    driveTime: "about 11.5 hours",
    mode: "fly",
    route: "I-40 to I-55 S to I-10 W",
    originAirport: "BNA",
  },
  {
    slug: "albuquerque-nm",
    city: "Albuquerque",
    stateAbbr: "NM",
    state: "New Mexico",
    miles: 880,
    driveTime: "about 13 hours",
    mode: "fly",
    route: "I-25 to I-10 E to I-45 S",
    originAirport: "ABQ",
  },
  {
    slug: "denver-co",
    city: "Denver",
    stateAbbr: "CO",
    state: "Colorado",
    miles: 1030,
    driveTime: "about 15 hours",
    mode: "fly",
    route: "I-25 S to I-45 S",
    originAirport: "DEN",
  },
];

export const FEEDER_STATES: FeederState[] = [
  {
    slug: "texas",
    state: "Texas",
    stateAbbr: "TX",
    intro:
      "Texas is Galveston's backyard — most Texans can drive straight to the port, skip the airport entirely, and park or grab a Park-Stay-Cruise hotel the night before.",
  },
  {
    slug: "oklahoma",
    state: "Oklahoma",
    stateAbbr: "OK",
    intro:
      "Oklahoma cruisers are within an easy fly-or-drive of Galveston — drive down I-35 or hop a quick flight into Houston and let us handle the transfer to the port.",
  },
  {
    slug: "louisiana",
    state: "Louisiana",
    stateAbbr: "LA",
    intro:
      "Louisiana sits right next door — a straight shot west on I-10 puts most of the state within a comfortable day's drive of the Port of Galveston.",
  },
  {
    slug: "arkansas",
    state: "Arkansas",
    stateAbbr: "AR",
    intro:
      "Arkansas travelers can drive down I-30 or fly into Houston — either way, Galveston is one of the closest and easiest cruise ports to reach from the Natural State.",
  },
  {
    slug: "mississippi",
    state: "Mississippi",
    stateAbbr: "MS",
    intro:
      "Mississippi cruisers have an easy fly-or-drive to Galveston — head west on I-10 or fly into Houston and we'll arrange your transfer to the terminal.",
  },
  {
    slug: "missouri",
    state: "Missouri",
    stateAbbr: "MO",
    intro:
      "Missouri travelers reach Galveston with a quick flight into Houston — we book the flights, the pre-cruise hotel, and the transfer so your trip is one smooth plan.",
  },
  {
    slug: "kansas",
    state: "Kansas",
    stateAbbr: "KS",
    intro:
      "Kansas cruisers can fly into Houston or make the drive down I-35 — Galveston is the closest warm-weather cruise port, with no coastal flight required.",
  },
  {
    slug: "tennessee",
    state: "Tennessee",
    stateAbbr: "TN",
    intro:
      "Tennessee travelers fly into Houston and we take it from there — pre-cruise hotel, port transfer, and a stress-free start to your Galveston sailing.",
  },
  {
    slug: "new-mexico",
    state: "New Mexico",
    stateAbbr: "NM",
    intro:
      "New Mexico cruisers fly into Houston for the easiest path to Galveston — we coordinate flights, hotel, and the transfer to the cruise terminal.",
  },
  {
    slug: "colorado",
    state: "Colorado",
    stateAbbr: "CO",
    intro:
      "Colorado travelers fly into Houston and let us handle the rest — Galveston gives you a warm-weather, drive-up cruise port without the East Coast airfare.",
  },
];

export function getFeederCity(slug: string): FeederCity | undefined {
  return FEEDER_CITIES.find((c) => c.slug === slug);
}

export function getFeederState(slug: string): FeederState | undefined {
  return FEEDER_STATES.find((s) => s.slug === slug);
}

export function citiesInState(stateName: string): FeederCity[] {
  return FEEDER_CITIES.filter((c) => c.state === stateName);
}

export function nearbyCities(city: FeederCity, n = 4): FeederCity[] {
  return FEEDER_CITIES.filter((c) => c.slug !== city.slug)
    .sort((a, b) => {
      const aSame = a.state === city.state ? 0 : 1;
      const bSame = b.state === city.state ? 0 : 1;
      if (aSame !== bSame) return aSame - bSame;
      return Math.abs(a.miles - city.miles) - Math.abs(b.miles - city.miles);
    })
    .slice(0, n);
}

export function allFeederSlugs(): string[] {
  return [...FEEDER_CITIES.map((c) => c.slug), ...FEEDER_STATES.map((s) => s.slug)];
}
