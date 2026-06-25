// Seed the Supabase project referenced in .env.local with the Galveston fleet
// (sailing_blocks + cabins) so the local site shows sailings.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// ── load .env.local ──
const env = {};
for (const line of readFileSync(
  new URL("../.env.local", import.meta.url),
  "utf8"
).split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}
console.log("Seeding project:", url.replace("https://", "").split(".")[0]);
const supabase = createClient(url, key);

// ── fleet config (same as the SQL generator) ──
const DAY = 86400000;
const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
const addDays = (d, n) => new Date(d.getTime() + n * DAY);
const CATS = [
  { t: "Interior", sqft: 170, mg: 4, deck: 2, pn: 65 },
  { t: "Ocean View", sqft: 190, mg: 4, deck: 6, pn: 85 },
  { t: "Balcony", sqft: 210, mg: 4, deck: 8, pn: 115 },
  { t: "Suite", sqft: 500, mg: 5, deck: 11, pn: 240 },
];
const FLEET = [
  { slug: "jubilee", ship: "Carnival Jubilee", line: "Carnival Cruise Line", startDay: 6, start: "2026-06-27", end: "2027-12-31", verified: true, rot: [[7, "Cozumel · Mahogany Bay (Roatán) · Costa Maya"]] },
  { slug: "breeze", ship: "Carnival Breeze", line: "Carnival Cruise Line", startDay: 4, start: "2026-06-25", end: "2027-12-31", verified: true, rot: [[4, "Cozumel"], [5, "Cozumel · Progreso"], [5, "Cozumel · Progreso"]] },
  { slug: "dream", ship: "Carnival Dream", line: "Carnival Cruise Line", startDay: 6, start: "2026-06-27", end: "2027-12-31", verified: false, rot: [[6, "Cozumel · Costa Maya · Mahogany Bay (Roatán)"], [8, "Grand Cayman · Cozumel · Costa Maya · Mahogany Bay (Roatán)"]] },
  { slug: "miracle", ship: "Carnival Miracle", line: "Carnival Cruise Line", startDay: 4, start: "2026-09-03", end: "2027-03-31", verified: false, rot: [[4, "Cozumel"], [5, "Cozumel · Progreso"], [5, "Cozumel · Progreso"]] },
  { slug: "mariner-of-the-seas", ship: "Mariner of the Seas", line: "Royal Caribbean", startDay: 0, start: "2026-06-28", end: "2026-10-31", verified: false, rot: [[7, "Roatán · Costa Maya · Cozumel"]] },
  { slug: "symphony-of-the-seas", ship: "Symphony of the Seas", line: "Royal Caribbean", startDay: 0, start: "2026-06-28", end: "2027-12-31", verified: false, rot: [[7, "Roatán · Costa Maya · Cozumel"]] },
  { slug: "liberty-of-the-seas", ship: "Liberty of the Seas", line: "Royal Caribbean", startDay: 1, start: "2026-10-05", end: "2027-12-31", verified: false, rot: [[4, "Cozumel"], [5, "Cozumel · Costa Maya"], [5, "Cozumel · Costa Maya"]] },
  { slug: "msc-seascape", ship: "MSC Seascape", line: "MSC Cruises", startDay: 0, start: "2026-06-28", end: "2027-12-31", verified: false, rot: [[7, "Ocean Cay · Costa Maya · Cozumel"]] },
  { slug: "norwegian-viva", ship: "Norwegian Viva", line: "Norwegian Cruise Line", startDay: 0, start: "2026-10-04", end: "2027-04-30", verified: false, rot: [[7, "Cozumel · Harvest Caye · Roatán · Costa Maya"]] },
  { slug: "disney-magic", ship: "Disney Magic", line: "Disney Cruise Line", startDay: 5, start: "2026-11-06", end: "2027-04-30", verified: false, rot: [[4, "Cozumel · Costa Maya"], [5, "Cozumel · Costa Maya · Grand Cayman"], [5, "Cozumel · Costa Maya · Grand Cayman"]] },
  { slug: "carnival-vista", ship: "Carnival Vista", line: "Carnival Cruise Line", startDay: 6, start: "2026-06-27", end: "2027-12-31", verified: false, rot: [[6, "Cozumel · Costa Maya · Mahogany Bay (Roatán)"], [8, "Grand Cayman · Cozumel · Costa Maya · Mahogany Bay (Roatán)"]] },
  { slug: "carnival-glory", ship: "Carnival Glory", line: "Carnival Cruise Line", startDay: 0, start: "2026-06-28", end: "2027-12-31", verified: false, rot: [[7, "Cozumel · Mahogany Bay (Roatán) · Costa Maya"]] },
  { slug: "carnival-freedom", ship: "Carnival Freedom", line: "Carnival Cruise Line", startDay: 1, start: "2026-06-29", end: "2027-12-31", verified: false, rot: [[4, "Cozumel"], [5, "Cozumel · Progreso"], [5, "Cozumel · Progreso"]] },
  { slug: "carnival-tropicale", ship: "Carnival Tropicale", line: "Carnival Cruise Line", startDay: 6, start: "2028-01-01", end: "2028-12-31", verified: false, rot: [[7, "Cozumel · Mahogany Bay (Roatán) · Costa Maya"]] },
];

const blockRows = [];
const cabinRows = [];
for (const f of FLEET) {
  const note = f.verified
    ? `Published ${f.line} schedule from Galveston.`
    : `Schedule ESTIMATE — verify exact dates with ${f.line} before publishing.`;
  let d = new Date(f.start + "T12:00:00");
  while (d.getDay() !== f.startDay) d = addDays(d, 1);
  const end = new Date(f.end + "T12:00:00");
  let i = 0;
  while (d <= end) {
    const [nights, itin] = f.rot[i % f.rot.length];
    const sail = iso(d);
    const key2 = sail.replace(/-/g, "");
    const bid = `blk-${f.slug}-${key2}`;
    blockRows.push({
      id: bid,
      ship: f.ship,
      cruise_line: f.line,
      sailing_date: sail,
      return_date: iso(addDays(d, nights)),
      nights,
      itinerary: itin,
      notes: note,
    });
    for (const c of CATS) {
      cabinRows.push({
        id: `cab-${f.slug}-${key2}-${c.t.toLowerCase().replace(/[^a-z]/g, "")}`,
        block_id: bid,
        room_number: "GTY",
        deck: c.deck,
        location: "Midship",
        side: "Both",
        type: c.t,
        max_guests: c.mg,
        sqft: c.sqft,
        price: Math.round(c.pn * nights),
        status: "available",
        is_guarantee: true,
      });
    }
    d = addDays(d, nights);
    i++;
  }
}

async function upsertChunked(table, rows) {
  const SIZE = 500;
  for (let i = 0; i < rows.length; i += SIZE) {
    const chunk = rows.slice(i, i + SIZE);
    const { error } = await supabase.from(table).upsert(chunk);
    if (error) throw new Error(`${table} chunk ${i}: ${error.message}`);
    process.stdout.write(`  ${table}: ${Math.min(i + SIZE, rows.length)}/${rows.length}\r`);
  }
  console.log("");
}

console.log(`Generated ${blockRows.length} sailings, ${cabinRows.length} cabins.`);
await upsertChunked("sailing_blocks", blockRows);
await upsertChunked("cabins", cabinRows);
console.log("Done.");
