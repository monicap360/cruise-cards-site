// ── Celebrations — sell the moment, not the boat ─────────────────────────────
// Occasion-led landing experiences. Each one is written in second person so the
// guest pictures THEMSELVES there, then shows exactly what's included so the
// feeling becomes a bookable package.

export type Occasion = {
  slug: string;
  name: string; // "Birthday at Sea"
  kicker: string; // mono eyebrow
  emoji?: string; // intentionally unused in UI; kept for reference
  headline: string; // big emotional statement
  imagine: string; // "picture yourself" paragraph
  glow: string; // tailwind color for the hero glow, e.g. "amber-500"
  heroGradient: string; // subtle band behind the headline
  moments: string[]; // short evocative beats
  included: { title: string; desc: string }[]; // the celebration package
  crewSlug?: string; // optional Sea You on Deck tie-in label
  ctaLabel: string;
};

export const OCCASIONS: Occasion[] = [
  {
    slug: "birthday",
    name: "Birthday at Sea",
    kicker: "// Make a Wish",
    headline: "Wake up to a stateroom full of balloons.",
    imagine:
      "It's your day, and the ocean is the backdrop. Picture the door opening to a deck of balloons, a banner with your name, and a cake at dinner while the whole table sings. No cooking, no cleanup, no ordinary Tuesday — just you, celebrated from sunrise to the late-night party deck.",
    glow: "amber-500",
    heroGradient: "from-amber-600/30 via-transparent to-transparent",
    moments: [
      "Balloons and a banner waiting in your cabin",
      "A birthday cake and the whole dining room singing",
      "Sailaway cocktails as the city skyline shrinks behind you",
      "A late-night deck party with your name on the list",
    ],
    included: [
      { title: "Stateroom Decoration", desc: "Balloons, a personalized banner, and a door sign waiting when you arrive." },
      { title: "Birthday Cake & Dinner", desc: "A celebration cake delivered to your table with a candlelit dinner." },
      { title: "Photo Session", desc: "A pro photographer captures the moment — prints to take home." },
      { title: "Spa or Bar Credit", desc: "A little extra to treat yourself however you like." },
    ],
    crewSlug: "Party Wake Crew™",
    ctaLabel: "Plan My Birthday Cruise",
  },
  {
    slug: "honeymoon",
    name: "Honeymoon",
    kicker: "// Just the Two of You",
    headline: "Your first sunrise as newlyweds, from your own balcony.",
    imagine:
      "The wedding's over — now it's just the two of you. Picture rose petals and chilled champagne when you open the door, a private dinner under the stars, and mornings with nowhere to be but in each other's company. Every detail handled, so the only thing on your itinerary is each other.",
    glow: "rose-500",
    heroGradient: "from-rose-600/30 via-transparent to-transparent",
    moments: [
      "Rose petals and champagne on arrival",
      "A candlelit dinner for two, just for you",
      "A couples' spa afternoon",
      "Sunset on your private balcony, every night",
    ],
    included: [
      { title: "Romance Arrival", desc: "Rose petals, sparkling wine, and chocolate-covered strawberries in the cabin." },
      { title: "Private Dinner for Two", desc: "A reserved candlelit table with a dedicated server." },
      { title: "Couples' Spa", desc: "A side-by-side massage with ocean views." },
      { title: "Balcony Upgrade", desc: "We help you secure a balcony cabin for those private sunsets." },
    ],
    ctaLabel: "Plan Our Honeymoon",
  },
  {
    slug: "anniversary",
    name: "Anniversary",
    kicker: "// Still the One",
    headline: "Toast the years — and the ocean — together.",
    imagine:
      "Whether it's the first or the fiftieth, picture raising a glass at sunset, a cake that says the number out loud, and a dinner that feels like the night you met. Some couples even renew their vows at sea, with the horizon as their witness.",
    glow: "amber-400",
    heroGradient: "from-amber-500/25 via-transparent to-transparent",
    moments: [
      "Champagne toast at sunset",
      "An anniversary cake and a dinner to remember",
      "A keepsake photo session, dressed up",
      "Optional vow renewal with the horizon as your witness",
    ],
    included: [
      { title: "Champagne & Cake", desc: "A bottle on ice and a personalized anniversary cake." },
      { title: "Celebration Dinner", desc: "A reserved table for a special night out at sea." },
      { title: "Photo Session", desc: "Dressed-up portraits to mark the milestone." },
      { title: "Vow Renewal (Optional)", desc: "We can arrange an onboard ceremony — ask us." },
    ],
    ctaLabel: "Plan Our Anniversary",
  },
  {
    slug: "bachelorette",
    name: "Bride Squad",
    kicker: "// Last Sail Before the Veil",
    headline: "Get the crew together for the sendoff she deserves.",
    imagine:
      "Matching outfits on the lido deck, a reserved cabana, and a sailaway toast with your favorite people. Picture the whole squad dancing till late, brunch the next morning, and not one person checking a watch. It's the bachelorette that doesn't end at 2am — it docks back in Galveston.",
    glow: "fuchsia-500",
    heroGradient: "from-fuchsia-600/30 via-transparent to-transparent",
    moments: [
      "Sailaway toast with the whole squad",
      "A reserved beach cabana on the island day",
      "Matching swag and a 'bride' door sign",
      "The party night you'll be telling stories about",
    ],
    included: [
      { title: "Group Cabin Block", desc: "We hold cabins together so the whole crew is on the same hall." },
      { title: "Reserved Cabana", desc: "A private spot on the beach day, drinks included." },
      { title: "Bride Swag", desc: "Sashes, a cabin banner, and a sailaway champagne toast." },
      { title: "Party Night Setup", desc: "A reserved table and bottle service for the big night." },
    ],
    crewSlug: "Party Wake Crew™",
    ctaLabel: "Plan the Bachelorette",
  },
  {
    slug: "proposal",
    name: "The Proposal",
    kicker: "// Pop the Question",
    headline: "The perfect spot is already picked. Just bring the ring.",
    imagine:
      "Picture the deck at golden hour, champagne chilling, a photographer hidden just out of frame to catch the exact second. We help you plan the moment down to the minute — where, when, and how — so all you have to do is get down on one knee and remember to breathe.",
    glow: "sky-500",
    heroGradient: "from-sky-600/30 via-transparent to-transparent",
    moments: [
      "A private, perfectly-timed setup at golden hour",
      "A photographer hidden to catch the 'yes'",
      "Champagne ready the moment she says it",
      "A celebration dinner to make it official",
    ],
    included: [
      { title: "The Setup", desc: "We arrange a private, scenic spot and the perfect time of day." },
      { title: "Hidden Photographer", desc: "Someone to capture the moment as it happens — candid and real." },
      { title: "Champagne on Standby", desc: "Chilled and ready for the toast." },
      { title: "Celebration Dinner", desc: "A reserved table to mark the night you got engaged." },
    ],
    ctaLabel: "Plan the Proposal",
  },
  {
    slug: "family-reunion",
    name: "Family Reunion",
    kicker: "// Everyone, Finally, Together",
    headline: "One ship. The whole family. Zero logistics.",
    imagine:
      "Picture three generations at one long dinner table every night, the kids off making friends at the club, the grandparents on the easy pace they love, and not a single 'whose house are we doing it at this year?' For once, everyone's together — and nobody's hosting.",
    glow: "teal-500",
    heroGradient: "from-teal-600/30 via-transparent to-transparent",
    moments: [
      "Connecting cabins so everyone's close",
      "One big table together, every night",
      "Kids' clubs, so the grown-ups get grown-up time",
      "A group excursion the whole family will retell for years",
    ],
    included: [
      { title: "Group Cabin Block", desc: "Connecting and nearby cabins held together for the whole family." },
      { title: "Group Dining", desc: "A reserved big table so you're all together at dinner." },
      { title: "Kids' Club Coordination", desc: "Ages and activities sorted so parents get a break too." },
      { title: "Group Excursion", desc: "One shore day planned for everyone, no herding required." },
    ],
    ctaLabel: "Plan the Reunion",
  },
];

export function getOccasion(slug: string): Occasion | undefined {
  return OCCASIONS.find((o) => o.slug === slug);
}
