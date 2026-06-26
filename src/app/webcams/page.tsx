import Link from "next/link";

export const metadata = {
  title: "Live Galveston Webcams",
  description:
    "Watch live cams of the Port of Galveston, cruise ships departing, the Seawall, and the beach — before you sail.",
};

type Cam = {
  id: string;
  title: string;
  location: string;
  blurb: string;
  embedUrl?: string;
};

/*
 * SITE OWNER — HOW TO ACTIVATE A CAM:
 * Every cam below ships with a branded "coming online" placeholder by default
 * so nothing ever looks broken. To go live, paste a PUBLIC embeddable stream
 * URL into that cam's `embedUrl` field. Good sources:
 *   - YouTube live stream  -> use the embed URL form:
 *       https://www.youtube.com/embed/VIDEO_ID
 *   - A provider's own "embed" / "iframe" share URL
 * Only use URLs the source allows to be embedded. Leave `embedUrl` undefined
 * (or remove it) to fall back to the placeholder again.
 */
const cams: Cam[] = [
  {
    id: "port-cruise-cam",
    title: "Port of Galveston Cruise Cam",
    location: "Cruise Terminals · Galveston Ship Channel",
    blurb:
      "The money shot — mega-ships easing in and out of the channel on turnaround day.",
  },
  {
    id: "pleasure-pier-cam",
    title: "Pleasure Pier Cam",
    location: "Historic Pleasure Pier · Seawall Blvd",
    blurb:
      "The iconic pier and Gulf horizon, lit up over the water day and night.",
  },
  {
    id: "seawall-beach-cam",
    title: "Seawall / Beach Cam",
    location: "Seawall Boulevard · Gulf of Mexico",
    blurb:
      "Live conditions along the Seawall — check the crowd and the surf before you go.",
  },
  {
    id: "stewart-beach-cam",
    title: "Stewart Beach Cam",
    location: "Stewart Beach · East End",
    blurb:
      "Galveston's flagship family beach, straight from the sand to your screen.",
  },
  {
    id: "harborside-terminal-cam",
    title: "Harborside / Cruise Terminal Cam",
    location: "Harborside Drive · Terminal Frontage",
    blurb:
      "Watch the terminal approach and embarkation flow as sailing day kicks off.",
  },
  {
    id: "galveston-surf-cam",
    title: "Galveston Surf Cam",
    location: "Gulf Coast · Surf Break",
    blurb:
      "Real-time swell and wave watch for surfers, paddlers, and beach days.",
  },
];

function LiveDot() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-300">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-400" />
      </span>
      Live
    </span>
  );
}

function CamPlaceholder({ cam }: { cam: Cam }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0b1020] via-[#0a1426] to-[#05070d] text-center px-6">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="aurora bg-sky-500 w-[18rem] h-[18rem] -top-20 left-1/2 -translate-x-1/2 opacity-[0.10]" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-4xl mb-3" aria-hidden="true">
          📡
        </div>
        <div className="text-sm font-bold uppercase tracking-tight text-white/90">
          {cam.title}
        </div>
        <div className="label-mono mt-1 text-[10px] uppercase text-sky-400/70">
          {cam.location}
        </div>
        <div className="mt-4 hud rounded-full px-3 py-1 text-[11px] text-sky-200/80">
          Stream coming online
        </div>
      </div>
    </div>
  );
}

function CamCard({ cam }: { cam: Cam }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-[#0b1020] overflow-hidden transition-colors hover:border-sky-400/40">
      <div className="relative aspect-video w-full overflow-hidden bg-[#05070d]">
        {cam.embedUrl ? (
          <iframe
            src={cam.embedUrl}
            title={cam.title}
            className="w-full h-full"
            allowFullScreen
          />
        ) : (
          <CamPlaceholder cam={cam} />
        )}
        <div className="absolute left-3 top-3 z-10 rounded-full bg-black/55 px-2.5 py-1 backdrop-blur-sm">
          <LiveDot />
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-base font-extrabold uppercase tracking-tight">
          {cam.title}
        </h3>
        <div className="label-mono mt-1 text-[10px] uppercase text-sky-400/70">
          {cam.location}
        </div>
        <p className="mt-3 text-sm text-white/55">{cam.blurb}</p>
      </div>
    </div>
  );
}

export default function WebcamsPage() {
  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#05070d] text-white py-20">
        <div className="absolute inset-0 grid-bg" />
        <div className="aurora bg-sky-500 w-[46rem] h-[46rem] -top-60 left-1/2 -translate-x-1/2 opacity-[0.14]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Live from the island"}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.01em]">
            See Galveston <span className="text-holo">before you sail.</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-white/55">
            Live views of the Port of Galveston, cruise ships in the channel, the
            Seawall, and the beach — watch the island in real time and time your
            sailing day perfectly.
          </p>
        </div>
      </section>

      {/* Cam grid */}
      <section className="relative bg-[#05070d] py-16">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cams.map((cam) => (
              <CamCard key={cam.id} cam={cam} />
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-white/35">
            Streams are sourced from public Galveston cameras and refreshed as new
            feeds come online. Views and availability may vary with weather and
            provider uptime.
          </p>
        </div>
      </section>

      {/* Closing CTA band */}
      <section className="relative overflow-hidden border-t border-white/10 bg-[#05070d] py-20">
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -bottom-72 left-1/2 -translate-x-1/2 opacity-[0.12]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
            {"// Ready when you are"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
            That view could be your departure.
          </h2>
          <p className="mt-4 text-white/55">
            Lock in a sailing from Galveston and watch your ship pull out of this
            very channel.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/find"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
            >
              Find your sailing
            </Link>
            <Link
              href="/contact"
              className="border border-white/20 text-white hover:border-sky-400/40 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-colors"
            >
              Talk to a specialist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
