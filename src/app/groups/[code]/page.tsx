import Link from "next/link";
import Photo from "@/components/Photo";
import RoomingListForm from "@/components/RoomingListForm";
import { getGroupByCode, isRoomReleased } from "@/lib/groups";
import { SHOP_ITEMS, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/lib/shop";
import ParkRideScheduler from "@/components/ParkRideScheduler";
import CruisePackingList from "@/components/CruisePackingList";
import CruiseLineLogo from "@/components/CruiseLineLogo";
import { FB_GROUP_URL } from "@/lib/social";
import GroupGate from "@/components/GroupGate";
import { GROUP_ANNOUNCEMENTS } from "@/lib/announcements";
import BedConfig from "@/components/BedConfig";
import SailCountdown from "@/components/SailCountdown";
import EmbarkGuide from "@/components/EmbarkGuide";
import { embarkForGroup } from "@/lib/embark-guides";
import { groupFlightInfo } from "@/lib/group-flights";
import { perksForGroup } from "@/lib/group-perks";
import { cruiseForGroup } from "@/lib/group-cruise";
import { hotelForGroup } from "@/lib/group-hotel";
import { balancesForGroup } from "@/lib/group-balances";
import { passengersForGroup } from "@/lib/group-passengers";
import GroupContactForm from "@/components/GroupContactForm";
import GroupManifest from "@/components/GroupManifest";
import { PAY_ZELLE, PAY_CASHAPP, PAY_VENMO } from "@/lib/payment-methods";
import AgentProfile from "@/components/AgentProfile";
import { agentByName } from "@/lib/agents";
import TrustBadges from "@/components/TrustBadges";
import CabinThread from "@/components/CabinThread";
import { getRfpsForGroup } from "@/lib/hotel-rfp";
import GroupTickets from "@/components/GroupTickets";
import HeroImage from "@/components/HeroImage";
import { fmt$, fmtDate } from "@/lib/sea-pay";

export const dynamic = "force-dynamic";

// The group PIN is the sail date as MMDD. Derive it robustly from whatever the
// sail date looks like in the DB (ISO "2026-08-15", ISO+time, or US "8/15/2026")
// so a stray time component or slash format never breaks the PIN.
function mmddFromDate(dateStr: string): string {
  if (!dateStr) return "";
  const iso = dateStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})/); // YYYY-MM-DD (optionally with time)
  if (iso) return iso[2].padStart(2, "0") + iso[3].padStart(2, "0");
  const us = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/); // MM/DD/YYYY
  if (us) return us[1].padStart(2, "0") + us[2].padStart(2, "0");
  return "";
}

// Cabin categories a group member can pick from. Image lives at
// /public/cabins/<img>.jpg (Photo falls back to a gradient if missing).
const CABIN_OPTIONS = [
  { type: "Interior", img: "interior", blurb: "Cozy and the best value — everything you need to rest between port days." },
  { type: "Ocean View", img: "ocean-view", blurb: "Wake up to the sea through a picture window or porthole." },
  { type: "Balcony", img: "balcony", blurb: "Your own private veranda — coffee with a sea breeze." },
  { type: "Suite", img: "mini-suite", blurb: "More space, premium perks, and priority extras on board." },
];

export default async function GroupPortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ pin?: string }>;
}) {
  const { code } = await params;
  const { pin } = await searchParams;
  const result = await getGroupByCode(code);

  if (!result) {
    return (
      <div className="bg-[#05070d] text-white min-h-[60vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em] mb-3">
            Group not found
          </h1>
          <p className="text-white/55 mb-7">
            Double-check your group link or code, or contact your specialist.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-sm px-8 py-4 rounded-full transition-all"
          >
            Contact us
          </Link>
        </div>
      </div>
    );
  }

  const { group, members, rooms } = result;

  // PIN gate — protect roster / DOB / payment info. PIN = sail date MMDD.
  const groupPin = mmddFromDate(group.sailingDate || "");
  if (!groupPin || (pin || "").trim() !== groupPin) {
    return <GroupGate groupName={group.name} />;
  }

  const now = Date.now();
  const totalGuests = members.reduce((s, m) => s + (m.guests || 0), 0);
  const hotelRates = (await getRfpsForGroup(group.code)).filter((r) => r.status === "Submitted" || r.status === "Selected");
  const depositCount = members.filter(
    (m) => m.paidInFull || m.depositPaid > 0
  ).length;
  const flightInfo = groupFlightInfo(group.code);
  const groupPerks = perksForGroup(group.code);
  const groupCruise = cruiseForGroup(group.code);
  const groupHotel = hotelForGroup(group.code);
  const groupBalances = balancesForGroup(group.code);
  const groupPassengers = passengersForGroup(group.code);
  const money = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Destination hero photo — chosen from the itinerary (Alaska → glacier,
  // Bahamas → Nassau, otherwise Western Caribbean → Cozumel).
  const destHay = `${group.name} ${group.notes || ""} ${groupCruise?.itinerary || ""} ${groupCruise?.embarkPort || ""}`.toLowerCase();
  const isAlaska = /alaska|glacier|inside passage|seattle/.test(destHay);
  const destSlug = isAlaska ? "alaska" : /bahama|nassau|eastern/.test(destHay) ? "nassau" : "cozumel";
  const shipPhotoSlug = group.ship.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  // For Alaska sailings the Galveston terminal photo is wrong — lead with the glacier.
  const heroCandidates = isAlaska
    ? [`/destinations/alaska.jpg`, `/ships/${shipPhotoSlug}.jpg`]
    : [`/ships/${shipPhotoSlug}.jpg`, "/galveston-cruise-terminal.jpg", `/destinations/${destSlug}.jpg`];

  const stat = (v: string | number, l: string) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
      <div className="text-holo font-extrabold text-3xl leading-none">{v}</div>
      <div className="label-mono text-[10px] uppercase tracking-wider text-white/45 mt-2">
        {l}
      </div>
    </div>
  );

  return (
    <div className="bg-[#05070d] text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 min-h-[340px] flex items-end">
        <HeroImage
          candidates={heroCandidates}
          alt={isAlaska ? `${group.ship} — Alaska Inside Passage` : `${group.ship} at the Galveston cruise terminal`}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/70 to-[#05070d]/30" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80">
              {group.blockSize <= 1 ? "// Cruise Portal" : "// Group Portal"}
            </div>
            <div className="hud label-mono text-[10px] uppercase tracking-wider text-white px-3 py-1.5 rounded-full">
              {group.blockSize <= 1 ? "Your trip" : `Group ${group.code}`}
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-[-0.02em] leading-[0.95] mt-4">
            {group.name || "Group Cruise"}
          </h1>
          <div className="flex items-center gap-3 text-white/70 text-lg mt-2">
            {group.cruiseLine && (
              <span className="bg-white rounded-lg px-2 py-1 inline-flex items-center">
                <CruiseLineLogo line={group.cruiseLine} className="h-7" />
              </span>
            )}
            <span>
              {group.ship}
              {group.cruiseLine ? ` · ${group.cruiseLine}` : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-white/55">
            {group.sailingDate && (
              <span>
                <span className="text-white/40">Sails</span>{" "}
                {fmtDate(group.sailingDate)}
              </span>
            )}
            {group.depositDueDate && (
              <span>
                <span className="text-white/40">Deposit due</span>{" "}
                {fmtDate(group.depositDueDate)}
              </span>
            )}
            {group.finalPaymentDate && (
              <span>
                <span className="text-white/40">Final payment</span>{" "}
                {fmtDate(group.finalPaymentDate)}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Group setup status */}
        <div className={`rounded-2xl border p-5 ${group.setupStatus === "finalized" ? "border-green-400/30 bg-green-400/10" : "border-amber-400/30 bg-amber-400/10"}`}>
          <div className="font-bold text-white">{group.setupStatus === "finalized" ? "✅ Your group is finalized!" : "🛠️ Your Cruise Director of Sales is finalizing your group"}</div>
          <p className="text-white/70 text-sm mt-1">
            {group.setupStatus === "finalized"
              ? "Your Cruise Director of Sales has everything loaded. Please review your cabin, guest names, and details — and if anything needs changing, leave a note on your room in the rooming list below and we’ll take care of it."
              : "Thanks for your patience! Your Cruise Director of Sales is still adding your group’s details, so cabins, guest names, and pricing may still change as everyone gets loaded. We’ll let you know the moment it’s finalized — feel free to leave any notes on your room below in the meantime."}
          </p>
        </div>

        {/* Your Cruise Director of Sales */}
        {group.directorName && (() => {
          const agent = agentByName(group.directorName);
          return agent ? <AgentProfile agent={agent} /> : (
            <div className="rounded-2xl border border-sky-400/25 bg-[#0b1020] p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-sky-500/20 border border-sky-400/30 flex items-center justify-center font-extrabold text-sky-200 text-lg shrink-0">
                {group.directorName.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div>
                <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/70">Your Cruise Director of Sales</div>
                <div className="font-extrabold text-white text-lg">{group.directorName}</div>
                <div className="text-white/55 text-sm">Your dedicated specialist for this group — questions or changes? Leave a note on your room below and it comes straight to me.</div>
              </div>
            </div>
          );
        })()}

        {/* You're in good hands — trust & reassurance */}
        <div className="rounded-2xl border border-sky-400/20 bg-sky-500/[0.04] p-5 sm:p-6">
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1">{"// You're in good hands"}</div>
          <p className="text-white/70 text-sm mb-4 max-w-2xl">
            Your cruise is booked <strong className="text-white">directly with the cruise line</strong> and your reservation is confirmed — your booking and your money are protected no matter what you read online. Here&rsquo;s why you can sail with confidence:
          </p>
          <TrustBadges />
        </div>

        {/* Group notices */}
        {GROUP_ANNOUNCEMENTS.length > 0 && (
          <div className="space-y-3">
            {GROUP_ANNOUNCEMENTS.map((a) => (
              <div key={a.id} className={`rounded-2xl border p-5 ${a.tone === "warn" ? "border-amber-400/30 bg-amber-400/10" : a.tone === "success" ? "border-green-400/30 bg-green-400/10" : "border-sky-400/25 bg-sky-500/5"}`}>
                <div className="font-bold text-white">{a.title}</div>
                <p className="text-white/70 text-sm mt-1">{a.body}</p>
              </div>
            ))}
          </div>
        )}
        {/* Sail-day countdown */}
        {group.sailingDate && <SailCountdown sailingDate={group.sailingDate} ship={group.ship} />}

        {/* Welcome */}
        <div className="rounded-2xl border border-sky-400/25 bg-sky-500/5 p-6">
          <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-2">{"// Welcome Aboard"}</div>
          <h2 className="text-2xl font-extrabold text-white">Welcome, {group.name || "friends"}! 🚢</h2>
          <p className="text-white/70 mt-2 max-w-2xl">
            We&rsquo;re so excited you&rsquo;re sailing with us on {group.ship}
            {group.sailingDate ? ` — ${fmtDate(group.sailingDate)}` : ""}. This is your group hub:
            check your room, book any open cabins, schedule Park &amp; Ride, grab your packing list,
            and order group extras — all in one place. Need anything? <span className="text-white">Text us first</span> — it&rsquo;s the fastest way to reach us.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <a href={`sms:${CONTACT_PHONE}`} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">
              💬 Text us first (fastest)
            </a>
            <Link
              href="/book-a-call"
              className="border border-white/25 hover:border-white/60 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full"
            >
              📅 Book a call
            </Link>
            <a href={`tel:${CONTACT_PHONE}`} className="border border-white/25 hover:border-white/60 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full">
              📞 Call {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stat(members.length, "Cabins booked")}
          {stat(totalGuests, "Total guests")}
          {stat(`${depositCount}/${members.length}`, "Paid")}
          {stat(members.length - depositCount, "Pending")}
        </div>

        {/* Collect contact info from every passenger */}
        <GroupContactForm groupCode={group.code} />

        {/* Flight schedule */}
        {flightInfo && flightInfo.legs.length > 0 && (
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <div className="label-mono text-base uppercase text-sky-400/80 font-bold">
                {"// Flight Schedule"}
              </div>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="bg-sky-400/10 border border-sky-400/25 text-sky-200 rounded-full px-3 py-1 font-semibold">
                  {flightInfo.airline}{flightInfo.confirmation ? <> · Conf <span className="font-mono">#{flightInfo.confirmation}</span></> : null}
                </span>
                {flightInfo.passengers ? (
                  <span className="text-white/45">{flightInfo.passengers} passengers</span>
                ) : null}
                {flightInfo.paidInFull && (
                  <span className="bg-green-500/15 border border-green-400/30 text-green-300 rounded-full px-3 py-1 font-bold uppercase tracking-wider text-[10px]">
                    ✓ Flights paid in full
                  </span>
                )}
              </div>
            </div>
            {flightInfo.statusNote && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-500/[0.08] px-4 py-3">
                <span className="text-lg leading-none">✈️</span>
                <p className="text-white/75 text-sm leading-relaxed"><strong className="text-amber-200">Flights update:</strong> {flightInfo.statusNote.replace(/^Flights update:\s*/, "")}</p>
              </div>
            )}
            {flightInfo.travelerConfirmations && flightInfo.travelerConfirmations.length > 0 && (
              <div className="mb-4 rounded-xl border border-white/10 bg-[#0b1020] overflow-hidden">
                <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10">
                  <span className="label-mono text-[10px] uppercase tracking-wider text-sky-300/70">Confirmation Numbers</span>
                  <a href="https://www.southwest.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 text-xs font-bold">View on southwest.com ↗</a>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/40 label-mono text-[9px] uppercase tracking-wider">
                      <th className="text-left font-bold px-4 py-2">Traveler</th>
                      <th className="text-center font-bold px-3 py-2">Status</th>
                      <th className="text-right font-bold px-4 py-2">Confirmation #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flightInfo.travelerConfirmations.map((t, i) => (
                      <tr key={i} className="border-t border-white/10">
                        <td className="px-4 py-2.5 text-white/85">{t.name}</td>
                        <td className="px-3 py-2.5 text-center">
                          <span className="label-mono text-[9px] uppercase tracking-wider text-green-300 bg-green-500/10 border border-green-400/25 rounded-full px-2 py-0.5">✓ Ticketed &amp; paid</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {t.confirmation ? (
                            <span className="font-mono font-bold text-green-300">{t.confirmation}</span>
                          ) : (
                            <span className="label-mono text-[10px] uppercase tracking-wider text-amber-300/80">Individual&nbsp;# reissuing</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {flightInfo.legs.map((leg) => (
                <div key={leg.label} className="rounded-2xl border border-white/10 bg-[#0b1020] p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="label-mono text-[10px] uppercase tracking-wider text-sky-300/80">
                      {leg.label === "Outbound" ? "🛫 Outbound" : "🛬 Return"}
                    </span>
                    <span className="text-white/60 text-xs font-bold">{leg.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center w-16 shrink-0">
                      <div className="font-extrabold text-white text-lg leading-none">{leg.from}</div>
                      <div className="text-white/50 text-xs mt-1">{leg.departTime}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <span className="label-mono text-[9px] uppercase tracking-wider text-white/40">{leg.duration}</span>
                      <div className="w-full flex items-center gap-1 my-0.5">
                        <div className="h-px flex-1 bg-white/15" />
                        <span className="text-sky-400/70 text-xs">✈</span>
                        <div className="h-px flex-1 bg-white/15" />
                      </div>
                      <span className="label-mono text-[9px] uppercase tracking-wider text-white/40">{leg.stop}</span>
                    </div>
                    <div className="text-center w-16 shrink-0">
                      <div className="font-extrabold text-white text-lg leading-none">{leg.to}</div>
                      <div className="text-white/50 text-xs mt-1">{leg.arriveTime}</div>
                    </div>
                  </div>
                  {leg.arriveNote && (
                    <div className="text-amber-300/80 text-xs mt-2 text-center">⚠ {leg.arriveNote}</div>
                  )}
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                    {leg.flights.map((f) => (
                      <div key={f} className="label-mono text-[10px] uppercase tracking-wider text-white/55">✈ {f}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {flightInfo.priceDisclaimer && (
              <p className="text-white/35 text-[11px] mt-3 leading-relaxed">{flightInfo.priceDisclaimer}</p>
            )}
            <p className="text-white/35 text-xs mt-2">
              Always confirm times on your {flightInfo.airline} confirmation — airlines can adjust schedules.
            </p>
          </div>
        )}

        {/* Hotel (after flights) */}
        {groupHotel && (
          <div>
            <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-4">
              {"// Hotel — Night Before Your Cruise"}
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0b1020] p-6">
              {groupHotel.photos && groupHotel.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {groupHotel.photos.map((src, i) => (
                    <Photo key={i} src={src} alt={`${groupHotel.name} photo ${i + 1}`} overlay={false} className="h-28 rounded-xl" />
                  ))}
                </div>
              )}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl font-extrabold text-white">🏨 {groupHotel.name}</span>
                    {groupHotel.paid === false && (
                      <span className="label-mono text-[9px] uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-full px-2.5 py-1">⚠ Not yet paid</span>
                    )}
                  </div>
                  {groupHotel.rating && (
                    <div className="text-white/55 text-sm mt-1">
                      <span className="text-green-300 font-bold">{groupHotel.rating}</span>
                      {groupHotel.reviews ? ` · ${groupHotel.reviews}` : ""}
                    </div>
                  )}
                  {groupHotel.address && (
                    <div className="text-white/60 text-sm mt-2">
                      📍 {groupHotel.address}{" "}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(groupHotel.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 font-semibold whitespace-nowrap"
                      >
                        Get directions →
                      </a>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="label-mono text-[9px] uppercase tracking-wider text-white/40">Stay</div>
                  <div className="text-white font-bold text-sm mt-1">{groupHotel.checkIn}</div>
                  <div className="text-white/60 text-sm">→ {groupHotel.checkOut}</div>
                  <div className="text-white/40 text-xs mt-0.5">
                    {groupHotel.nights}-night · {groupHotel.roomCount} rooms{groupHotel.guests ? ` · ${groupHotel.guests} guests` : ""}
                  </div>
                </div>
              </div>

              {/* Call to confirm */}
              {groupHotel.phone && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-sky-400/25 bg-sky-500/[0.07] px-4 py-3">
                  <span className="text-xl">📞</span>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">Call the hotel to confirm your booking</div>
                    <a href={`tel:${groupHotel.phone.replace(/[^0-9+]/g, "")}`} className="text-sky-300 hover:text-sky-200 font-bold">
                      {groupHotel.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Room + check-in details */}
              <div className="mt-4 text-white/70 text-sm">{groupHotel.roomDescription}</div>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div><span className="label-mono text-[9px] uppercase text-white/40 block">Check-in</span>{groupHotel.checkIn}{groupHotel.checkInTime ? ` · after ${groupHotel.checkInTime}` : ""}</div>
                <div><span className="label-mono text-[9px] uppercase text-white/40 block">Check-out</span>{groupHotel.checkOut}{groupHotel.checkOutTime ? ` · by ${groupHotel.checkOutTime}` : ""}</div>
                {groupHotel.minAge && <div><span className="label-mono text-[9px] uppercase text-white/40 block">Min. check-in age</span>{groupHotel.minAge}</div>}
              </div>

              {/* Amenities */}
              {groupHotel.amenities && groupHotel.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {groupHotel.amenities.map((a) => (
                    <span key={a} className={`text-[11px] rounded-full px-2.5 py-1 border ${/airport/i.test(a) ? "bg-green-500/10 border-green-400/25 text-green-300" : "bg-white/5 border-white/10 text-white/70"}`}>
                      {/airport/i.test(a) ? "🚐 " : ""}{a}
                    </span>
                  ))}
                </div>
              )}

              {/* Rooms breakdown */}
              {groupHotel.rooms && groupHotel.rooms.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {groupHotel.rooms.map((r) => (
                    <div key={r.room} className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                      <div className="label-mono text-[9px] uppercase text-white/40">Room {r.room}</div>
                      <div className="text-white font-semibold text-sm mt-0.5 capitalize">{r.name}</div>
                      <div className="text-white/50 text-xs">{r.occupancy}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pricing (no pay-at-property) */}
              <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="label-mono text-[9px] uppercase text-white/40">Rooms ({groupHotel.roomCount})</div>
                  <div className="text-white/85 mt-0.5">{money(groupHotel.roomsSubtotal)}</div>
                </div>
                <div>
                  <div className="label-mono text-[9px] uppercase text-white/40">Taxes</div>
                  <div className="text-white/85 mt-0.5">{money(groupHotel.taxes)}</div>
                </div>
                <div>
                  <div className="label-mono text-[9px] uppercase text-white/40">Total</div>
                  <div className="text-white font-bold mt-0.5">{money(groupHotel.total)}</div>
                </div>
              </div>

              {groupHotel.paid === false && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-amber-400/30 bg-amber-500/[0.08] px-4 py-3">
                  <span className="text-amber-200 font-semibold text-sm">Balance due — payment not yet received</span>
                  <span className="text-amber-300 font-extrabold">{money(groupHotel.total)}</span>
                </div>
              )}

              {/* Cancellation policy */}
              {groupHotel.freeCancelUntil && (
                <div className="mt-4 text-xs">
                  <span className="text-green-300 font-semibold">✓ Free cancellation until {groupHotel.freeCancelUntil}.</span>
                  {groupHotel.cancelNote && <span className="text-white/45"> {groupHotel.cancelNote}</span>}
                </div>
              )}
              <p className="text-white/40 text-[11px] mt-2">
                Night before your cruise, near Sea-Tac — the hotel offers <strong className="text-white/70">free airport transportation</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Cruise details */}
        {groupCruise && (
          <div>
            <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-4">
              {"// Cruise Details"}
            </div>
            <div className="rounded-2xl border border-sky-400/25 bg-[#0b1020] p-6">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-2xl font-extrabold uppercase tracking-tight text-white leading-tight">
                    {groupCruise.nights}-Day {groupCruise.itinerary}
                  </div>
                  <div className="text-sky-300 text-sm font-semibold mt-1">{groupCruise.ship} · {groupCruise.line}</div>
                  <div className="text-white/60 text-sm mt-0.5">{groupCruise.sailDate} → {groupCruise.returnDate} · from {groupCruise.embarkPort}</div>
                </div>
                {groupCruise.paidInFull && (
                  <span className="bg-green-500/15 text-green-300 border border-green-400/30 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    ✓ All rooms paid in full
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                  <div className="label-mono text-[9px] uppercase tracking-wider text-white/40">Booking #</div>
                  <div className="font-mono font-bold text-white mt-1">{groupCruise.bookingNumber}</div>
                </div>
                {groupCruise.stateroom && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                    <div className="label-mono text-[9px] uppercase tracking-wider text-white/40">Stateroom</div>
                    <div className="font-bold text-white mt-1">#{groupCruise.stateroom}</div>
                  </div>
                )}
                {groupCruise.cabinDetail && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 col-span-2">
                    <div className="label-mono text-[9px] uppercase tracking-wider text-white/40">Cabin</div>
                    <div className="text-white/85 text-sm mt-1">{groupCruise.cabinDetail}</div>
                  </div>
                )}
              </div>

              {/* Day-by-day ship itinerary */}
              {groupCruise.itineraryDays && groupCruise.itineraryDays.length > 0 && (
                <div className="mt-5 pt-5 border-t border-white/10">
                  <div className="label-mono text-[10px] uppercase tracking-wider text-sky-300/70 mb-3">Ship Itinerary</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {groupCruise.itineraryDays.map((d) => (
                      <div key={d.day} className="rounded-2xl overflow-hidden border border-white/10 bg-[#05070d]">
                        <div className="relative h-40">
                          {d.photo ? (
                            <Photo src={d.photo} alt={d.port} overlay={false} className="absolute inset-0" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-700/40 to-[#0a1f44]" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/25 to-transparent" />
                          <span className="absolute top-2.5 left-2.5 hud label-mono text-[10px] uppercase tracking-wider text-white px-2.5 py-1 rounded-full">
                            Day {d.day}
                          </span>
                          <div className="absolute bottom-2.5 left-3 right-3">
                            <div className="text-white font-extrabold text-base uppercase tracking-tight leading-tight drop-shadow-[0_1px_5px_rgba(0,0,0,0.9)]">
                              {d.port}
                            </div>
                          </div>
                        </div>
                        <div className="px-3 py-2.5">
                          <div className="text-white/55 text-xs font-semibold">{d.date}</div>
                          {d.note && <div className="text-sky-300/70 text-[11px] mt-0.5">{d.note}</div>}
                          {d.things && d.things.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/10">
                              <div className="label-mono text-[8px] uppercase tracking-wider text-white/35 mb-1">Things to do in port</div>
                              <ul className="space-y-0.5">
                                {d.things.map((t) => (
                                  <li key={t} className="text-white/65 text-[11px] flex gap-1.5 leading-snug">
                                    <span className="text-sky-400/60 shrink-0">•</span>
                                    <span>{t}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/35 text-[11px] mt-2">Ports &amp; times follow the current sailing plan — confirm on your cruise documents.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guest manifest */}
        {groupPassengers.length > 0 && (
          <div>
            <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-4">
              {"// Guest Manifest"}
            </div>
            <GroupManifest passengers={groupPassengers} groupCode={group.code} />
            <p className="text-white/40 text-[11px] mt-2">
              Each guest: add your <strong className="text-white/70">VIFP #, email &amp; phone</strong> in your row and tap <strong className="text-white/70">Save</strong>. You can edit anytime — it updates our file instantly.
            </p>
          </div>
        )}

        {/* Included for your group */}
        {groupPerks.length > 0 && (
          <div>
            <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-4">
              {"// Included For Your Group"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupPerks.map((p) => (
                <div key={p.title} className="flex items-start gap-4 rounded-2xl border border-green-400/25 bg-green-500/[0.06] p-5">
                  <span className="text-3xl shrink-0">{p.icon}</span>
                  <div>
                    <div className="text-white font-bold">✓ {p.title}</div>
                    <p className="text-white/60 text-sm mt-1 leading-relaxed">{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amounts due */}
        {groupBalances.length > 0 && (
          <div>
            <div className="label-mono text-base uppercase text-amber-300/80 font-bold mb-4">
              {"// Amounts Due"}
            </div>
            <div className="rounded-2xl border border-amber-400/30 bg-amber-500/[0.06] p-5">
              <div className="divide-y divide-white/10">
                {groupBalances.map((b, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <span className="text-white/85 text-sm"><strong className="text-white">{b.who}</strong> — {b.item}</span>
                      {b.payTo && (
                        <div className="text-sky-300/90 text-xs mt-0.5">→ Pay <strong className="text-sky-200">{b.payTo}</strong> directly{b.note ? ` · ${b.note}` : ""}</div>
                      )}
                    </div>
                    <span className="text-amber-300 font-extrabold shrink-0">{money(b.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3 pt-3 mt-2 border-t border-white/15">
                <span className="text-white/60 text-sm font-bold uppercase tracking-wider">Total outstanding</span>
                <span className="text-amber-200 font-extrabold text-lg">{money(groupBalances.reduce((s, b) => s + b.amount, 0))}</span>
              </div>
              {groupBalances.some((b) => !b.payTo) && (
                <p className="text-white/55 text-xs mt-3">
                  To pay us: <strong className="text-white/80">Zelle</strong> {PAY_ZELLE} · <strong className="text-white/80">Cash App</strong> {PAY_CASHAPP} · <strong className="text-white/80">Venmo</strong> {PAY_VENMO} — or call (409) 632-2106.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Block status */}
        {group.blockSize > 0 &&
          (() => {
            const booked = members.length;
            const notBooked = Math.max(0, group.blockSize - booked);
            const pct = Math.min(100, Math.round((booked / group.blockSize) * 100));
            const rel = group.releaseDate
              ? new Date(group.releaseDate).toLocaleString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "";
            return (
              <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6">
                <div className="flex items-end justify-between flex-wrap gap-2 mb-3">
                  <div className="label-mono text-base uppercase text-sky-400/80 font-bold">
                    {"// Group Block Status"}
                  </div>
                  <div className="text-white/70 text-sm">
                    <span className="text-holo font-extrabold text-lg">{booked}</span>{" "}
                    booked ·{" "}
                    <span className="text-white font-bold">{notBooked}</span> not
                    booked · {group.blockSize} held
                  </div>
                </div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-sky-600"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {rel && (
                  <div className="mt-4 bg-amber-400/10 border border-amber-400/25 rounded-xl p-3 text-amber-200/90 text-sm">
                    <strong>{notBooked} unbooked room{notBooked === 1 ? "" : "s"}</strong>{" "}
                    will be released back into general inventory on{" "}
                    <strong>{rel}</strong>. Book before then to keep your group
                    rate and cabin.
                  </div>
                )}
                {notBooked > 0 && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-sky-500/10 border border-sky-400/30 rounded-xl p-4">
                    <div>
                      <div className="text-white font-bold">
                        {notBooked} room{notBooked === 1 ? "" : "s"} left at the
                        group rate
                      </div>
                      {group.groupRate > 0 && (
                        <div className="text-white/60 text-sm">
                          from{" "}
                          <span className="text-holo font-bold">
                            {fmt$(group.groupRate)}
                          </span>{" "}
                          / person · double occupancy
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/book-cabin?ship=${encodeURIComponent(group.ship)}&date=${group.sailingDate}&line=${encodeURIComponent(group.cruiseLine)}${group.groupRate > 0 ? `&price=${group.groupRate}` : ""}`}
                      className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all whitespace-nowrap"
                    >
                      Book a room now →
                    </Link>
                  </div>
                )}
              </div>
            );
          })()}

        {/* Choose your cabin — room inventory (with category fallback) */}
        {(rooms.length > 0 || group.groupRate > 0) && (
          <div>
            <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-2">
              {"// Choose Your Cabin"}
            </div>
            <p className="text-white/55 text-sm mb-5 max-w-2xl">
              {rooms.length > 0
                ? "Reserve a room held for your group. Each room is held until the date shown — once that lapses unbooked, it's released back into general inventory."
                : "Pick your room category to book at the group rate. Select a cabin to see the full price, what's included, and reserve it."}
            </p>

            {rooms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rooms.map((rm) => {
                  const released = isRoomReleased(rm, now);
                  const booked = rm.status === "booked";
                  const rate = rm.ratePP || group.groupRate;
                  const heldUntil = rm.holdUntil
                    ? new Date(rm.holdUntil).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "";
                  const cabinImg =
                    CABIN_OPTIONS.find(
                      (c) => c.type.toLowerCase() === rm.cabinType.toLowerCase()
                    )?.img ?? "interior";
                  return (
                    <div
                      key={rm.id}
                      className={`bg-[#0b1020] border rounded-2xl overflow-hidden flex flex-col ${
                        released || booked
                          ? "border-white/10 opacity-75"
                          : "border-white/10 hover:border-sky-400/40 transition-colors"
                      }`}
                    >
                      <div className="relative">
                        <Photo
                          src={`/cabins/${cabinImg}.jpg`}
                          alt={rm.cabinType}
                          overlay={false}
                          className={`h-36 w-full ${released || booked ? "grayscale" : ""}`}
                        />
                        <span
                          className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            booked
                              ? "bg-green-500/20 text-green-200"
                              : released
                                ? "bg-white/10 text-white/60"
                                : "bg-sky-500/20 text-sky-200"
                          }`}
                        >
                          {booked ? "Booked" : released ? "Released" : "Available"}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="font-extrabold uppercase tracking-tight text-white">
                          {rm.cabinType || "Cabin"}
                          {rm.label ? (
                            <span className="text-white/45"> · {rm.label}</span>
                          ) : null}
                        </div>
                        {booked ? (
                          <p className="text-white/55 text-sm mt-2 flex-1">
                            Reserved{rm.bookedBy ? ` by ${rm.bookedBy}` : ""}.
                          </p>
                        ) : released ? (
                          <p className="text-white/55 text-sm mt-2 flex-1">
                            This room&rsquo;s hold has ended — it has been{" "}
                            <strong className="text-white/80">
                              released into general inventory
                            </strong>
                            . Ask your specialist about current availability.
                          </p>
                        ) : (
                          <>
                            <div className="mt-3">
                              <div className="text-white/50 text-xs">
                                Group rate from
                              </div>
                              <div className="text-holo font-extrabold text-2xl leading-none">
                                {fmt$(rate)}
                                <span className="text-white/45 text-sm font-semibold">
                                  {" "}
                                  /person
                                </span>
                              </div>
                              <div className="text-white/40 text-[11px] mt-0.5">
                                double occupancy
                              </div>
                            </div>
                            {heldUntil && (
                              <div className="mt-3 text-amber-200/90 text-xs bg-amber-400/10 border border-amber-400/25 rounded-lg px-3 py-2">
                                ⏳ Held for your group until{" "}
                                <strong>{heldUntil}</strong>
                              </div>
                            )}
                            <Link
                              href={`/book-cabin?ship=${encodeURIComponent(group.ship)}&date=${encodeURIComponent(group.sailingDate)}&line=${encodeURIComponent(group.cruiseLine)}&type=${encodeURIComponent(rm.cabinType)}&price=${rate}&guests=2&group=${encodeURIComponent(group.code)}`}
                              className="mt-4 block text-center bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-full transition-all"
                            >
                              Select &amp; book →
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {CABIN_OPTIONS.map((opt) => (
                  <div
                    key={opt.type}
                    className="bg-[#0b1020] border border-white/10 rounded-2xl overflow-hidden hover:border-sky-400/40 transition-colors flex flex-col"
                  >
                    <Photo
                      src={`/cabins/${opt.img}.jpg`}
                      alt={opt.type}
                      overlay={false}
                      className="h-36 w-full"
                    />
                    <div className="p-5 flex flex-col flex-1">
                      <div className="font-extrabold uppercase tracking-tight text-white">
                        {opt.type}
                      </div>
                      <p className="text-white/55 text-sm leading-relaxed flex-1 mt-1">
                        {opt.blurb}
                      </p>
                      <div className="mt-3">
                        <div className="text-white/50 text-xs">Group rate from</div>
                        <div className="text-holo font-extrabold text-2xl leading-none">
                          {fmt$(group.groupRate)}
                          <span className="text-white/45 text-sm font-semibold">
                            {" "}
                            /person
                          </span>
                        </div>
                        <div className="text-white/40 text-[11px] mt-0.5">
                          double occupancy
                        </div>
                      </div>
                      <Link
                        href={`/book-cabin?ship=${encodeURIComponent(group.ship)}&date=${encodeURIComponent(group.sailingDate)}&line=${encodeURIComponent(group.cruiseLine)}&type=${encodeURIComponent(opt.type)}&price=${group.groupRate}&guests=2&group=${encodeURIComponent(group.code)}`}
                        className="mt-4 block text-center bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-full transition-all"
                      >
                        Select &amp; book →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rooming list — by room */}
        {rooms.length > 0 && (
          <div>
            <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-4">
              {"// Rooming List — by room"}
            </div>
            <div className="space-y-2">
              {[...rooms]
                .sort((a, b) => a.id.localeCompare(b.id))
                .map((rm, i) => {
                  const occ = members.find((m) => m.name === rm.bookedBy);
                  const isGty = !rm.label || rm.label.toUpperCase().startsWith("GTY");
                  const names = occ?.notes && !/^deposit/i.test(occ.notes) ? occ.notes : "";
                  const open = rm.status === "available" && !rm.bookedBy;
                  const cabinLabel = isGty ? "Guarantee cabin" : `Cabin ${rm.label}`;
                  const cabinImg = (rm.cabinType || "interior").toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  const orderHref = (item: string) =>
                    `/groups/${group.code}/order?item=${item}&room=${i + 1}&cabin=${encodeURIComponent(cabinLabel)}&guests=${occ?.guests || 2}&nights=${group.nights || 0}`;
                  return (
                    <div
                      key={rm.id}
                      className={`bg-[#0b1020] rounded-xl border p-4 flex items-start gap-4 ${open ? "border-white/10" : "border-sky-400/25"}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/cabins/${cabinImg}.jpg`}
                        alt={rm.cabinType || "Cabin"}
                        className="w-24 h-20 sm:w-28 sm:h-24 rounded-lg object-cover shrink-0 border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xl sm:text-2xl font-extrabold text-white">Room {i + 1}</span>
                          <span className="text-white/50 font-semibold text-sm">
                            {isGty ? "Guarantee — cabin # assigned later" : `Cabin ${rm.label}`}
                          </span>
                          {occ?.confirmationNumber && (
                            <span className="text-sky-300/80 font-mono text-xs bg-sky-500/10 border border-sky-400/20 rounded-md px-2 py-0.5">Res #{occ.confirmationNumber}</span>
                          )}
                        </div>
                        <div className="text-white/55 text-sm mt-0.5">
                          {rm.cabinType}
                          {open ? " · Open — available to book" : rm.bookedBy ? ` · ${rm.bookedBy}` : ""}
                        </div>
                        {occ?.cabinType && occ.cabinType !== rm.cabinType && (
                          <div className="text-amber-300/80 text-xs mt-0.5">
                            ✦ Requested: {occ.cabinType} <span className="text-white/35">(booked {rm.cabinType} — pending balcony block)</span>
                          </div>
                        )}
                        {names && (
                          <div className="text-white/70 text-sm mt-1.5 space-y-0.5">
                            {names.split(/,\s*/).filter(Boolean).map((nm, k) => {
                              const mm = nm.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
                              const pname = mm ? mm[1] : nm;
                              const dob = mm ? mm[2] : "";
                              return (
                                <div key={k} className="flex items-center gap-2">
                                  <span>👤 {pname}</span>
                                  <span className="text-white/35 text-[11px]">DOB {dob || "—"}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {!open && occ && (
                          <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
                            {occ.confirmationNumber && <span className="text-white/45">Conf #{occ.confirmationNumber}</span>}
                            <span className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              occ.paidInFull || occ.depositPaid > 0
                                ? "bg-green-500/15 text-green-300 border-green-400/25"
                                : "bg-amber-500/15 text-amber-300 border-amber-400/25"}`}>
                              {occ.paidInFull || occ.depositPaid > 0 ? "✓ Paid" : "Pending"}
                            </span>
                            {(occ.paidInFull || occ.depositPaid > 0) && <Link href={`/group-receipt/${occ.id}`} target="_blank" className="text-sky-400 hover:text-sky-300 font-semibold">🧾 Receipt</Link>}
                          </div>
                        )}
                        {!open && occ && <CabinThread memberId={occ.id} groupCode={group.code} sender="guest" />}
                        {!open && (
                          <div className="mt-4">
                            <div className="text-[10px] uppercase tracking-wider text-white/45 font-bold mb-2">✨ Add to this room — tap an item to add &amp; check out</div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                { item: "soda", emoji: "🥤", label: "Soda 12-pack" },
                                { item: "drink", emoji: "🍹", label: "Drink package" },
                                { item: "tips", emoji: "💵", label: `Prepay tips` },
                                { item: "protection", emoji: "🛡️", label: "Vacation protection" },
                                { item: "hotel", emoji: "🏨", label: "Pre-cruise hotel" },
                                { item: "parking", emoji: "🅿️", label: "Cruise parking" },
                                { item: "travel", emoji: "🧭", label: "Flying / driving" },
                              ].map((a) => (
                                <Link
                                  key={a.item}
                                  href={orderHref(a.item)}
                                  className="group/add flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] hover:border-sky-400/50 hover:bg-sky-500/10 px-3 py-2.5 text-xs font-semibold text-white transition-all"
                                >
                                  <span className="text-base leading-none">{a.emoji}</span>
                                  <span className="truncate">{a.label}</span>
                                  <span className="ml-auto text-sky-400 opacity-60 group-hover/add:opacity-100">＋</span>
                                </Link>
                              ))}
                            </div>
                            <div className="mt-3">
                              <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2">Need a change?</div>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { item: "upgrade", emoji: "⬆️", label: "Request upgrade", c: "amber" },
                                  { item: "move", emoji: "🔀", label: "Move room", c: "amber" },
                                  { item: "correction", emoji: "🪪", label: "Correct name / DOB", c: "sky" },
                                  { item: "namechange", emoji: "✏️", label: "Name change ($150)", c: "amber" },
                                  { item: "cancel", emoji: "⚠️", label: "Cancel passenger", c: "red" },
                                  { item: "cancelroom", emoji: "❌", label: "Cancel room", c: "red" },
                                  { item: "rebook", emoji: "🔄", label: "Rebook room", c: "amber" },
                                  { item: "decline", emoji: "🛡️", label: "Decline protection", c: "muted" },
                                ].map((rq) => {
                                  const cls =
                                    rq.c === "amber" ? "border-amber-400/30 text-amber-200 hover:bg-amber-500/10"
                                    : rq.c === "sky" ? "border-sky-400/30 text-sky-200 hover:bg-sky-500/10"
                                    : rq.c === "red" ? "border-red-400/30 text-red-200 hover:bg-red-500/10"
                                    : "border-white/15 text-white/55 hover:bg-white/5";
                                  return (
                                    <Link key={rq.item} href={orderHref(rq.item)} className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all ${cls}`}>
                                      <span>{rq.emoji}</span>{rq.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        {open ? (
                          <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-green-500/15 text-green-300 border border-green-400/25">Available</span>
                        ) : (
                          <span className="text-white/60 text-sm">{occ?.guests ? `${occ.guests} guest${occ.guests === 1 ? "" : "s"}` : "Booked"}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Roster */}
        <div>
          <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-4">
            {"// Roster & Payment Status"}
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="bg-white/5 text-white/50 label-mono text-[10px] uppercase tracking-wider">
                  <th className="text-left font-bold px-4 py-3">Guest</th>
                  <th className="text-left font-bold px-3 py-3">Cabin</th>
                  <th className="text-center font-bold px-3 py-3">Guests</th>
                  <th className="text-left font-bold px-3 py-3">Confirmation</th>
                  <th className="text-center font-bold px-4 py-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-white/45">
                      Cabins will appear here as members book. Check back soon.
                    </td>
                  </tr>
                ) : (
                  members.map((m) => {
                    const paid = m.paidInFull || m.depositPaid > 0;
                    return (
                      <tr key={m.id} className="border-t border-white/10">
                        <td className="px-4 py-3">
                          <div className="font-bold text-white">{m.name}</div>
                          {m.email && (
                            <div className="text-white/40 text-xs">{m.email}</div>
                          )}
                        </td>
                        <td className="px-3 py-3 text-white/75">
                          {m.cabinType || "—"}
                          {m.cabinNumber ? (
                            <span className="text-white/40"> #{m.cabinNumber}</span>
                          ) : null}
                          <div className="mt-1.5"><BedConfig memberId={m.id} /></div>
                        </td>
                        <td className="px-3 py-3 text-center text-white/70">
                          {m.guests || "—"}
                        </td>
                        <td className="px-3 py-3 text-white/60 font-mono text-xs">
                          {m.confirmationNumber || "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block text-[10px] font-bold uppercase rounded-full px-2.5 py-0.5 ${paid ? "bg-green-500/15 text-green-300" : "bg-amber-500/15 text-amber-300"}`}>
                            {paid ? "✓ Paid" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rooming list submission */}
        <div>
          <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-4">
            {"// Rooming List"}
          </div>
          <RoomingListForm
            groupCode={group.code}
            groupName={group.name}
            ship={group.ship}
          />
        </div>

        {/* Contract */}
        {(group.contract || group.contractUrl) && (
          <div>
            <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-4">
              {"// Group Contract & Terms"}
            </div>
            {group.contractUrl && (
              <a
                href={group.contractUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-full mb-4"
              >
                📄 Download group contract{group.contractName ? ` (${group.contractName})` : ""}
              </a>
            )}
            {group.contract && (
              <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                {group.contract}
              </div>
            )}
          </div>
        )}

        {/* Sea You on Deck community */}
        <a
          href={FB_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-sky-400/25 bg-gradient-to-r from-sky-500/10 to-transparent p-6 hover:border-sky-400/50 transition-all"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-1">{"// Community"}</div>
              <div className="text-xl font-extrabold text-white">⚓ Join “Sea You on Deck”</div>
              <p className="text-white/65 text-sm mt-1 max-w-xl">
                Our cruiser community — meet your group, swap port tips, plan cabin crawls and matching‑shirt days, and count down to sail‑away together.
              </p>
            </div>
            <span className="bg-white text-black font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full shrink-0">Join the community →</span>
          </div>
        </a>

        {/* Park & Ride scheduler */}
        <div className="bg-[#0b1020]/40 border border-white/10 rounded-2xl p-6">
          <ParkRideScheduler groupCode={group.code} sailDate={group.sailingDate} />
        </div>

        {/* Pre-cruise hotel */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1020]/40 p-6">
          <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-3">{"// Pre-Cruise Hotel"}</div>
          <div className="grid sm:grid-cols-[1fr_auto] gap-4 sm:items-center">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-xl font-extrabold text-white">🏨 Harbor House Hotel &amp; Marina — Pier 21</div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/25">⏳ Rates pending</span>
              </div>
              <p className="text-white/65 text-sm mt-1 max-w-xl">
                Stay the night before right on the harbor, <span className="text-white/85">steps from the cruise terminal</span>. Beat sail-day traffic, sleep in, and walk to your ship. <span className="text-white/85">We&rsquo;re finalizing group rates now</span> — ask to be added and we&rsquo;ll send your price as soon as it&rsquo;s confirmed.
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Pre-cruise hotel (Harbor House) — ${group.name}`)}&body=${encodeURIComponent(`We'd like to add a pre-cruise night at the Harbor House Hotel & Marina (Pier 21) before the ${group.name}${group.sailingDate ? ` sailing ${group.sailingDate}` : ""}.\n\nNumber of rooms: ____\nNight(s): ____\nNames per room: ____`)}`}
                className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full text-center"
              >
                Add a pre-cruise night
              </a>
              <Link href="/galveston-cruise-hotels" className="border border-white/25 hover:border-white/60 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full text-center">
                See all hotels
              </Link>
            </div>
          </div>

          {hotelRates.length > 0 && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="text-[11px] uppercase tracking-wider text-sky-300/80 font-bold mb-2">Submitted group hotel rates</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {hotelRates.map((h) => (
                  <div key={h.id} className={`rounded-xl border p-4 ${h.status === "Selected" ? "border-green-400/40 bg-green-500/[0.06]" : "border-white/10 bg-white/[0.03]"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-white">{h.hotelName}</div>
                      {h.status === "Selected" && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/15 text-green-300">✓ Our pick</span>}
                    </div>
                    <div className="text-holo font-extrabold text-2xl leading-none mt-1">{fmt$(h.nightlyRate)}<span className="text-white/45 text-sm font-semibold">/night</span></div>
                    {h.roomType && <div className="text-white/55 text-xs mt-0.5">{h.roomType}</div>}
                    {h.parkStayCruise && <div className="text-green-300 text-xs mt-1">🅿️ Park‑stay‑cruise{h.parkingDays ? ` · ${h.parkingDays} nights parking` : ""}{h.shuttle ? " · shuttle" : ""}</div>}
                    {h.terms && <div className="text-white/45 text-xs mt-1.5">{h.terms}</div>}
                    <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Book ${h.hotelName} — ${group.name}`)}&body=${encodeURIComponent(`We'd like to book ${h.hotelName} (${fmt$(h.nightlyRate)}/night) for the ${group.name}.\n\nNumber of rooms: ____\nNight(s): ____`)}`} className="inline-block mt-3 text-sky-400 hover:text-sky-300 text-xs font-bold">Book this hotel →</a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Packing list */}
        <div className="bg-[#0b1020]/40 border border-white/10 rounded-2xl p-6">
          <CruisePackingList />
        </div>

        {/* Before You Sail — embark city things to do */}
        {(() => { const eg = embarkForGroup(group.code); return eg ? <EmbarkGuide guide={eg} /> : null; })()}

        {/* Questions & Concerns (tickets) */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1020]/40 p-6">
          <GroupTickets groupCode={group.code} groupName={group.name} />
        </div>

        {/* Group store & extras */}
        <div>
          <div className="label-mono text-base uppercase text-sky-400/80 font-bold mb-4">
            {"// Group Store & Extras"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SHOP_ITEMS.map((it) => (
              <a
                key={it.title}
                href={it.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#0b1020] border border-white/10 hover:border-sky-400/40 rounded-2xl p-5 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{it.emoji}</span>
                  {it.tag && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/25">{it.tag}</span>
                  )}
                </div>
                <div className="font-bold text-white mt-3">{it.title}</div>
                <div className="text-white/55 text-sm mt-1 flex-1">{it.desc}</div>
                <div className="text-sky-400 group-hover:text-sky-300 font-semibold text-xs uppercase tracking-wider mt-3">Shop now →</div>
              </a>
            ))}
          </div>
        </div>

        {/* Leader contact */}
        <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="label-mono text-[10px] uppercase tracking-wider text-white/45 mb-1">
              Your group specialist
            </div>
            <div className="text-white/70 text-sm">
              Questions about the roster or payments? We&rsquo;re here to help.
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+14096322106"
              className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
            >
              Call (409) 632-2106
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="border border-white/25 hover:border-white/60 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
            >
              ✉️ Email us
            </a>
            <Link
              href="/contact"
              className="border border-white/25 hover:border-white/60 text-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full transition-all"
            >
              Message us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
