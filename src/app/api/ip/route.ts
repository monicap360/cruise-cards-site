import { NextRequest, NextResponse } from "next/server";

// Returns the caller's IP address, read from proxy headers (Render/Vercel set
// these). Used to stamp chargeback-evidence records (e.g. contract signing) with
// the IP the customer accepted terms from. No PII beyond the IP is collected.

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for");
  const ip =
    (fwd ? fwd.split(",")[0].trim() : "") ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return NextResponse.json({ ip });
}
