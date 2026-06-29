import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import CruiseSheet from "@/components/CruiseSheet";
import { getSailingBlock, groupByType, type CabinCategory } from "@/lib/room-blocks";
import { portsFromItinerary, destinationFor } from "@/lib/destinations";

export const dynamic = "force-dynamic";

const ORDER: CabinCategory[] = [
  "Interior",
  "Ocean View",
  "Balcony",
  "Mini-Suite",
  "Suite",
];

function cabinPhoto(t: string): string {
  const c = t.toLowerCase();
  if (c.includes("interior") || c.includes("inside")) return "interior";
  if (c.includes("ocean") || c.includes("view") || c.includes("window") || c.includes("porthole")) return "ocean-view";
  if (c.includes("suite")) return c.includes("mini") || c.includes("junior") ? "mini-suite" : "suite";
  if (c.includes("balcony") || c.includes("veranda")) return "balcony";
  return "interior";
}

export default async function SailingSheetPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ cabin?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const block = await getSailingBlock(id);

  if (!block) {
    return (
      <div className="bg-[#05070d] text-white min-h-[60vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-extrabold uppercase mb-3">Sailing not found</h1>
          <Link href="/find" className="underline">
            Find a cruise
          </Link>
        </div>
      </div>
    );
  }

  const byType = groupByType(block.cabins);
  const cabins = ORDER.filter((t) => byType[t]?.length)
    .map((t) => ({
      type: t as string,
      price: Math.min(...byType[t].map((c) => c.price).filter((n) => n > 0)),
    }))
    .filter((c) => Number.isFinite(c.price));

  const cabinParam = (sp.cabin ?? "").toLowerCase();
  const selectedCabin = cabinParam
    ? cabins.find((c) => c.type.toLowerCase() === cabinParam)
    : undefined;
  const roomImage = selectedCabin
    ? `/cabins/${cabinPhoto(selectedCabin.type)}.jpg`
    : undefined;

  const dest = destinationFor(portsFromItinerary(block.itinerary)[0] ?? "");

  return (
    <div className="bg-gray-200 min-h-screen py-8 print:bg-white print:py-0">
      <div className="max-w-[8.5in] mx-auto px-4 mb-4 flex items-center justify-between print:hidden">
        <Link
          href={`/sailings/${id}`}
          className="text-sm font-semibold text-gray-700 hover:text-black"
        >
          ← Back to sailing
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/reserve?ship=${encodeURIComponent(block.ship)}&date=${block.sailingDate}`}
            className="border border-gray-400 text-gray-800 hover:bg-white font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full"
          >
            📅 Book appointment
          </Link>
          <PrintButton className="bg-gray-900 text-white hover:bg-gray-800 font-semibold uppercase tracking-wider text-xs px-5 py-2.5 rounded-full" />
        </div>
      </div>
      <CruiseSheet
        ship={block.ship}
        cruiseLine={block.cruiseLine}
        sailingDate={block.sailingDate}
        returnDate={block.returnDate}
        nights={block.nights}
        itinerary={block.itinerary}
        cabins={cabins}
        selectedCabin={selectedCabin}
        destImage={`/destinations/${dest.slug}.jpg`}
        destName={dest.name}
        destGradient={dest.gradient}
        roomImage={roomImage}
        sailingId={block.id}
      />
    </div>
  );
}
