import Link from "next/link";

/**
 * Hours — two sets: the physical Experience Center (open on cruise days only,
 * 8:30 AM–5:00 PM) and Online & Phone support (daily, 7:30 AM–9:00 PM).
 */
export default function StoreHours() {
  return (
    <section className="relative border-y border-white/10 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-10">
          <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-2">
            {"// We're Open When the Ships Are"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.01em]">
            Hours
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* In-center / walk-in */}
          <div className="bg-[#0b1020] border border-white/10 rounded-3xl p-8 text-center">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              In the Center · Walk-In
            </div>
            <div className="text-sm font-bold uppercase tracking-wide text-white/70">
              Cruise Days
            </div>
            <div className="text-3xl font-extrabold text-white mt-1 mb-3">
              8:30 AM – 5:00 PM
            </div>
            <div className="text-white/45 text-sm">Closed on non-cruise days</div>
          </div>

          {/* Online & phone */}
          <div className="bg-[#0b1020] border border-white/10 rounded-3xl p-8 text-center">
            <div className="label-mono text-[11px] uppercase text-sky-400/80 mb-4">
              Online & Phone
            </div>
            <div className="text-sm font-bold uppercase tracking-wide text-white/70">
              Every Day
            </div>
            <div className="text-3xl font-extrabold text-white mt-1 mb-3">
              7:30 AM – 9:00 PM
            </div>
            <div className="text-white/45 text-sm">
              Call, chat, or book from anywhere
            </div>
          </div>
        </div>

        <p className="text-center text-white/50 text-sm mt-6">
          In-center hours follow the Port of Galveston cruise calendar.{" "}
          <Link
            href="https://www.portofgalveston.com/cruise-parking/cruise-schedule/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400/80 hover:text-white underline"
          >
            See the cruise calendar →
          </Link>
        </p>
      </div>
    </section>
  );
}
