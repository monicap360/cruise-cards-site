import { NextRequest, NextResponse } from "next/server";
import { lookupCredits } from "@/lib/credits";

export const dynamic = "force-dynamic";

// Server-side credit lookup so the browser never queries Supabase directly.
// Requires an email; an optional booking ref narrows the match.
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") ?? "";
  const ref = req.nextUrl.searchParams.get("ref") ?? "";
  if (!email.trim()) {
    return NextResponse.json({ credits: [] });
  }
  const credits = await lookupCredits(email, ref);
  return NextResponse.json({ credits });
}
