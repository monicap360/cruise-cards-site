import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const IMGH = { "User-Agent": UA, "Referer": "https://commons.wikimedia.org/", "Accept": "image/avif,image/webp,image/*,*/*;q=0.8" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(term) {
  const api = "https://commons.wikimedia.org/w/api.php?action=query&generator=search"
    + "&gsrsearch=" + encodeURIComponent(term)
    + "&gsrnamespace=6&gsrlimit=40&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=1600&format=json";
  for (let i = 0; i < 3; i++) {
    const r = await fetch(api, { headers: { "User-Agent": UA } });
    if (r.ok) { const d = await r.json(); return Object.values(d.query?.pages ?? {}); }
    await sleep(800 * (i + 1));
  }
  return [];
}
function licScore(p) {
  const m = p.imageinfo?.[0]?.extmetadata || {};
  const s = ((m.License?.value || "") + " " + (m.LicenseShortName?.value || "")).toLowerCase();
  if (/cc0|public domain|(^|\s)pd(\s|$)/.test(s)) return 100;
  if (/cc.?by.?sa/.test(s)) return 40;
  if (/cc.?by/.test(s)) return 60;
  if (/gfdl/.test(s)) return 30;
  return 0;
}
async function dl(url) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(url, { headers: IMGH });
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    if (r.status === 429 || r.status === 503) { await sleep(1200 * (i + 1)); continue; }
    return null;
  }
  return null;
}
async function fetchOne(t) {
  const pages = (await Promise.all(t.query.map(search))).flat();
  const cand = pages.filter((p) => {
    const ii = p.imageinfo?.[0];
    if (!ii || !/jpe?g/i.test(ii.mime)) return false;
    if (t.bad && t.bad.test(p.title)) return false;
    if (licScore(p) === 0) return false;
    const w = ii.thumbwidth || ii.width, h = ii.thumbheight || ii.height;
    return w && h && w >= h * 1.1;
  });
  const score = (p) => licScore(p) + (t.good && t.good.test(p.title) ? 25 : 0) + Math.min(15, (p.imageinfo[0].thumbwidth || 0) / 200);
  cand.sort((a, b) => score(b) - score(a));
  for (const pick of cand.slice(0, 5)) {
    const ii = pick.imageinfo[0];
    const buf = await dl(ii.thumburl || ii.url);
    await sleep(400);
    if (!buf || buf.length < 18000) continue;
    mkdirSync(t.path.split("/").slice(0, -1).join("/"), { recursive: true });
    writeFileSync(t.path, buf);
    const m = ii.extmetadata || {};
    return { path: t.path, title: pick.title.replace("File:", ""), bytes: buf.length,
      license: m.LicenseShortName?.value || "?",
      author: (m.Artist?.value || "?").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 70),
      source: ii.descriptionurl || "" };
  }
  return { path: t.path, failed: true };
}
const TARGETS = [
  { query: ["Progreso Yucatán pier", "Progreso Yucatan malecon beach"], path: "public/destinations/progreso.jpg", good: /progreso|yucat|malecon|pier|beach/i, bad: /map|sign|flag/i },
  { query: ["Seven Mile Beach Grand Cayman", "Grand Cayman beach water"], path: "public/destinations/grand-cayman.jpg", good: /cayman|seven mile|beach/i, bad: /map|flag|crest|coat of arms/i },
  { query: ["Roatán West Bay beach", "Roatan Honduras Caribbean beach"], path: "public/destinations/roatan.jpg", good: /roat|west bay|honduras|beach/i, bad: /map|flag/i },
  { query: ["Carnival Freedom"], path: "public/ships/carnival-freedom.jpg", good: /carnival freedom/i, bad: /interior|cabin|menu|map|deck|logo|funnel|webcam|atrium/i },
  { query: ["Carnival Glory"], path: "public/ships/carnival-glory.jpg", good: /carnival glory/i, bad: /interior|cabin|menu|map|deck|logo|funnel|webcam|atrium/i },
  { query: ["Carnival Miracle"], path: "public/ships/carnival-miracle.jpg", good: /carnival miracle/i, bad: /interior|cabin|menu|map|deck|logo|funnel|webcam|atrium/i },
  { query: ["Carnival Vista ship"], path: "public/ships/carnival-vista.jpg", good: /carnival vista/i, bad: /interior|cabin|menu|map|deck|logo|funnel|webcam|atrium/i },
  { query: ["Disney Magic ship"], path: "public/ships/disney-magic.jpg", good: /disney magic/i, bad: /interior|cabin|menu|map|deck|logo|funnel|castle|land|atrium/i },
  { query: ["Liberty of the Seas"], path: "public/ships/liberty-of-the-seas.jpg", good: /liberty of the seas/i, bad: /interior|cabin|menu|map|deck|logo|funnel|webcam|atrium/i },
  { query: ["Norwegian Viva ship"], path: "public/ships/norwegian-viva.jpg", good: /norwegian viva/i, bad: /interior|cabin|menu|map|deck|logo|funnel|atrium/i },
  { query: ["Seven Seas Splendor"], path: "public/ships/seven-seas-splendor.jpg", good: /seven seas splendor/i, bad: /interior|cabin|menu|map|deck|logo|funnel|atrium/i },
  { query: ["Carnival Tropicale ship", "TS Tropicale"], path: "public/ships/carnival-tropicale.jpg", good: /tropicale/i, bad: /interior|cabin|menu|map|deck|logo/i },
];
const out = [];
for (const t of TARGETS) {
  const r = await fetchOne(t);
  console.log(r.failed ? "FAIL  " : "OK    ", r.path, r.failed ? "" : `${Math.round(r.bytes/1024)}KB | ${r.license}`);
  if (!r.failed) out.push(r);
  await sleep(600);
}
// append to credits
let md = "";
try { md = readFileSync("public/PHOTO-CREDITS.md", "utf8"); } catch {}
md += out.map(c => `- **${c.path.split("/").pop()}** — ${c.title} · ${c.license} · ${c.author} · ${c.source}`).join("\n") + "\n";
writeFileSync("public/PHOTO-CREDITS.md", md);
console.log("\nAdded", out.length, "more");
