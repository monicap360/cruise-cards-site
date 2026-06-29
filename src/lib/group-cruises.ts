// Occasion-based group cruise landing pages (SEO). Each renders at
// /group-cruises/[slug] with its own metadata, content, and FAQ schema.
export type GroupCruise = {
  slug: string;
  name: string; // short label, e.g. "Weddings"
  h1: string;
  emoji: string;
  destSlug: string; // hero photo from /public/destinations
  tagline: string;
  intro: string;
  highlights: { icon: string; title: string; text: string }[];
  included: string[];
  faq: { q: string; a: string }[];
};

const COMMON_FAQ = (occasion: string) => [
  {
    q: `How many cabins make a group for a ${occasion} cruise?`,
    a: "Most cruise lines treat 8 cabins (about 16 guests) as a group, which unlocks group rates, a shared deposit timeline, and perks. Smaller parties are welcome too — we'll still block your cabins together.",
  },
  {
    q: "Do we get any free or discounted berths?",
    a: "Group bookings typically earn a complimentary 'tour conductor' credit — often one free berth for every 8 cabins booked — which you can use toward the guest of honor's cabin or split across the group. We confirm the exact perk with the cruise line for your sailing.",
  },
  {
    q: "How do payments work?",
    a: "Each cabin holds with a deposit; guests pay their own balance by mailing a check to 3501 Winnie St, Galveston, TX 77550 (or directly with the cruise line). No cards are charged online. Final balances are due roughly 120 days before sailing.",
  },
];

// For couple/experience occasions (honeymoon, anniversary, retirement) where
// it's often just two people — not a group block.
const COUPLE_FAQ = [
  {
    q: "Do we have to travel with a group?",
    a: "Not at all — these are perfect for just the two of you. We'll book your cabin and arrange the celebration touches. If you'd like to bring friends or family, we can block a group too.",
  },
  {
    q: "Which stateroom should we pick?",
    a: "For a celebration we recommend an Ocean View, Balcony, or Suite — a private balcony for sunrises at sea is the favorite. We'll match it to your budget.",
  },
  {
    q: "How do payments work?",
    a: "Your cabin holds with a deposit; pay the balance by mailing a check to 3501 Winnie St, Galveston, TX 77550, or directly with the cruise line — no card is charged online. Balance is due about 120 days before sailing.",
  },
];

export const GROUP_CRUISES: GroupCruise[] = [
  {
    slug: "weddings",
    name: "Weddings",
    h1: "Wedding & Honeymoon Cruises from Galveston",
    emoji: "💍",
    destSlug: "cozumel",
    tagline: "Say 'I do' at sea — then sail straight into your honeymoon.",
    intro:
      "A cruise wedding is the all-in-one venue: ceremony, reception, honeymoon, and a vacation for every guest — all on one ship sailing round-trip from Galveston. Your guests get a getaway, you get a stress-free celebration, and nobody has to fly.",
    highlights: [
      { icon: "⛪", title: "Ceremony your way", text: "Marry onboard before you sail, on a sea day, or on a beach in port." },
      { icon: "🥂", title: "Reception included", text: "Dining, entertainment, and a built-in party for your whole group." },
      { icon: "🏝️", title: "Honeymoon built in", text: "Stay aboard after guests debark — your honeymoon starts at the dock." },
      { icon: "💰", title: "Group rates for guests", text: "Block cabins together at group pricing, with a shared payment timeline." },
    ],
    included: [
      "Dedicated group coordinator from first idea to sail day",
      "A blocked group of cabins held together at group rates",
      "Help with the onboard wedding package & timing",
      "A shareable signup link so guests book their own cabin",
      "Pre-cruise hotel + parking + transfers for out-of-town guests",
    ],
    faq: [
      {
        q: "Can we actually get married on the ship?",
        a: "Yes — cruise lines offer onboard wedding packages (ceremony, officiant, photos, cake, and a reception). We coordinate the package and timing with the line for your Galveston sailing.",
      },
      ...COMMON_FAQ("wedding"),
    ],
  },
  {
    slug: "family-reunions",
    name: "Family Reunions",
    h1: "Family Reunion Cruises from Galveston",
    emoji: "👨‍👩‍👧‍👦",
    destSlug: "nassau",
    tagline: "One price, every generation, zero planning headaches.",
    intro:
      "A cruise is the easiest family reunion you'll ever throw: lodging, meals, and entertainment for all ages are bundled into one fare, everyone travels together, and there's something for grandparents, kids, and teens alike — all from the Port of Galveston.",
    highlights: [
      { icon: "🍽️", title: "Meals & fun included", text: "Dining, pools, shows, and kids' clubs are all in the fare." },
      { icon: "🛏️", title: "Cabins close together", text: "We block connecting and nearby cabins so the family stays together." },
      { icon: "🎉", title: "Group dining & events", text: "Reserved dinner tables and a private gathering for the whole crew." },
      { icon: "🚗", title: "No flying required", text: "Drive in and park, or fly into Houston — we handle transfers." },
    ],
    included: [
      "A group cabin block held together with one timeline",
      "Group dining arrangements so everyone eats together",
      "A signup link so each family books and pays for their own cabin",
      "Help matching cabins to budgets (interior to suite)",
      "Pre-cruise hotel + parking for out-of-town relatives",
    ],
    faq: [
      {
        q: "Can different families pay separately?",
        a: "Yes. Everyone's in the same group block, but each family books and pays for their own cabin on their own — no one person fronts the whole bill.",
      },
      ...COMMON_FAQ("family reunion"),
    ],
  },
  {
    slug: "corporate-retreats",
    name: "Corporate Retreats",
    h1: "Corporate & Incentive Cruises from Galveston",
    emoji: "💼",
    destSlug: "grand-cayman",
    tagline: "Team building, incentives, and meetings — with a predictable budget.",
    intro:
      "Cruises make standout corporate retreats and incentive trips: meeting space, meals, activities, and lodging in one per-person price, so your budget is locked in up front. Reward a team, host a conference at sea, or run a leadership offsite — round-trip from Galveston.",
    highlights: [
      { icon: "📊", title: "Meeting space", text: "Conference rooms and AV onboard for sessions and presentations." },
      { icon: "🤝", title: "Team building", text: "Shore excursions and onboard activities that bring teams together." },
      { icon: "🧾", title: "One clear budget", text: "Lodging, meals, and entertainment in a single per-person fare." },
      { icon: "🏆", title: "Incentive trips", text: "Reward top performers with a getaway they'll actually remember." },
    ],
    included: [
      "A dedicated coordinator and a blocked group of cabins",
      "Help arranging meeting space & group functions onboard",
      "Group billing options and a clear payment timeline",
      "Transportation and pre-cruise hotel for traveling staff",
      "An itinerary and ship matched to your team's goals & dates",
    ],
    faq: [
      {
        q: "Can we hold meetings or a private event onboard?",
        a: "Yes — ships offer conference rooms, lounges, and private dining that can be reserved for sessions, dinners, or awards nights. We arrange it with the cruise line as part of your group.",
      },
      ...COMMON_FAQ("corporate"),
    ],
  },
  {
    slug: "bachelorette",
    name: "Bachelorette",
    h1: "Bachelorette Cruises from Galveston",
    emoji: "👰",
    destSlug: "cozumel",
    tagline: "The ultimate girls' trip — beaches by day, party by night.",
    intro:
      "Send her off in style with a bachelorette cruise from Galveston: beach days in Cozumel and Costa Maya, nightlife and shows onboard, and zero planning stress. Everyone books their own cabin in your group block, and the whole crew sails together.",
    highlights: [
      { icon: "🏖️", title: "Beach days", text: "Cozumel, Costa Maya & more — beach clubs and crystal water." },
      { icon: "🍹", title: "Nightlife onboard", text: "Bars, clubs, shows, and a party that doesn't stop at the dock." },
      { icon: "👯", title: "Everyone together", text: "Cabins blocked side by side so the group stays close." },
      { icon: "✨", title: "Easy planning", text: "One coordinator, one link — each guest books her own cabin." },
    ],
    included: [
      "A group cabin block held together at group rates",
      "A shareable signup link for the whole crew",
      "Help arranging celebrations, dining, and add-ons",
      "Drink package & spa add-on guidance",
      "Pre-cruise hotel + parking near the port",
    ],
    faq: [
      {
        q: "Can everyone pay for their own cabin?",
        a: "Yes — each guest books and pays for her own cabin in the group block, so the bride or maid of honor isn't stuck covering everyone.",
      },
      ...COMMON_FAQ("bachelorette"),
    ],
  },
  {
    slug: "milestone-birthdays",
    name: "Milestone Birthdays",
    h1: "Milestone Birthday Cruises from Galveston",
    emoji: "🎂",
    destSlug: "costa-maya",
    tagline: "Turn 30, 40, 50, 60 — or 80 — somewhere worth remembering.",
    intro:
      "Celebrate the big one at sea. A milestone birthday cruise from Galveston brings everyone together for a few days of beaches, dining, and celebration — with group rates, a private dinner, and a cake the ship handles for you.",
    highlights: [
      { icon: "🥳", title: "Celebrate at sea", text: "Private dinners, decorations, and a cake arranged onboard." },
      { icon: "👨‍👩‍👧", title: "Bring everyone", text: "Friends and family of every age, all in one group block." },
      { icon: "🏝️", title: "Beaches & ports", text: "Cozumel, Costa Maya, Roatán & more on the Western Caribbean." },
      { icon: "💰", title: "Group savings", text: "Group rates and a possible free berth for the guest of honor." },
    ],
    included: [
      "A blocked group of cabins at group rates",
      "Help arranging the birthday dinner, cake & décor onboard",
      "A signup link so each guest books their own cabin",
      "Pre-cruise hotel + parking + transfers for travelers",
      "An itinerary and date matched to your celebration",
    ],
    faq: [
      {
        q: "Can the ship do a birthday dinner or cake?",
        a: "Yes — we arrange a group dinner, a cake, and decorations onboard so the guest of honor is celebrated without you lifting a finger.",
      },
      ...COMMON_FAQ("birthday"),
    ],
  },
  {
    slug: "honeymoons",
    name: "Honeymoons",
    h1: "Honeymoon Cruises from Galveston",
    emoji: "🌅",
    destSlug: "roatan",
    tagline: "Start married life with sunsets at sea and a new beach every day.",
    intro:
      "A honeymoon cruise from Galveston is the easy, romantic getaway — multiple beautiful ports, candlelit dinners, and your own private balcony, without booking a dozen separate things. Drive in or fly into Houston, and we handle the rest.",
    highlights: [
      { icon: "🛳️", title: "Private balcony", text: "Wake up to the ocean — we recommend a Balcony or Suite for two." },
      { icon: "🍷", title: "Romantic dining", text: "Specialty restaurants, room service, and dinners just for you two." },
      { icon: "🏝️", title: "A new beach daily", text: "Cozumel, Roatán, Grand Cayman — paradise on repeat." },
      { icon: "💆", title: "Spa & celebration", text: "Couples spa, excursions, and honeymoon touches arranged for you." },
    ],
    included: [
      "An Ocean View, Balcony, or Suite recommendation for two",
      "Help arranging a romantic dinner & onboard honeymoon package",
      "Spa, excursion & drink-package guidance",
      "Pre-cruise hotel + parking + transfers",
      "A specialist who plans every detail",
    ],
    faq: [
      {
        q: "Can you add a honeymoon package onboard?",
        a: "Yes — cruise lines offer honeymoon/romance packages (sparkling wine, breakfast in bed, a spa credit, a special dinner). We arrange it for your sailing.",
      },
      ...COUPLE_FAQ,
    ],
  },
  {
    slug: "anniversaries",
    name: "Anniversaries",
    h1: "Anniversary Cruise Experiences from Galveston",
    emoji: "💞",
    destSlug: "cozumel",
    tagline: "Celebrate your years together in an Ocean View, Balcony, or Suite.",
    intro:
      "Mark the occasion the way it deserves — an anniversary cruise from Galveston with an upgraded stateroom, a private dinner, and a new port each day. We steer anniversary couples to Ocean View, Balcony, and Suite cabins so the celebration has the view and the space to match.",
    highlights: [
      { icon: "🌊", title: "Ocean View", text: "A window on the sea — a step up from interior for your big year." },
      { icon: "🛳️", title: "Balcony", text: "Your own private balcony for sunrises, sunsets & quiet mornings — our top pick." },
      { icon: "👑", title: "Suite", text: "Extra space, priority perks, and the full celebration treatment." },
      { icon: "🥂", title: "Celebration touches", text: "Anniversary dinner, cake, and décor arranged onboard." },
    ],
    included: [
      "Ocean View, Balcony & Suite stateroom options — the anniversary upgrade",
      "A private anniversary dinner, cake & décor arranged for you",
      "Spa, excursion & drink-package guidance",
      "Pre-cruise hotel + parking + transfers",
      "A specialist who handles every detail",
    ],
    faq: [
      {
        q: "Which stateroom is best for an anniversary?",
        a: "We recommend an Ocean View, Balcony, or Suite — a Balcony is the favorite for private sunrises at sea, and a Suite adds space and priority perks. We'll match the right one to your budget.",
      },
      ...COUPLE_FAQ,
    ],
  },
  {
    slug: "retirement",
    name: "Retirement",
    h1: "Retirement Celebration Cruises from Galveston",
    emoji: "🎉",
    destSlug: "grand-cayman",
    tagline: "You earned it — celebrate the next chapter at sea.",
    intro:
      "Cap a career with a retirement cruise from Galveston: relaxed sea days, beautiful ports, and as much (or as little) as you want to do. Make it just the two of you, or bring the family and friends along in a group block — either way, we plan it all.",
    highlights: [
      { icon: "🌴", title: "Relax & unwind", text: "Sea days, spa, and ports at your own pace — no rush." },
      { icon: "🛳️", title: "Upgraded staterooms", text: "Treat yourself to an Ocean View, Balcony, or Suite." },
      { icon: "👨‍👩‍👧‍👦", title: "Bring everyone", text: "Celebrate solo, as a couple, or with a whole group block." },
      { icon: "🥂", title: "A proper sendoff", text: "A celebration dinner and toast arranged onboard." },
    ],
    included: [
      "Stateroom options from Ocean View to Suite",
      "Help arranging a retirement celebration dinner onboard",
      "Group cabin block if you're bringing family & friends",
      "Pre-cruise hotel + parking + transfers",
      "A specialist who plans the whole trip",
    ],
    faq: [
      {
        q: "Can we bring family and friends?",
        a: "Absolutely — we can block a group of cabins together at group rates, or keep it simple for just the two of you. Your call.",
      },
      ...COUPLE_FAQ,
    ],
  },
];

export function getGroupCruise(slug: string): GroupCruise | null {
  return GROUP_CRUISES.find((g) => g.slug === slug) ?? null;
}
