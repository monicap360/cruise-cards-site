import { NextRequest, NextResponse } from "next/server";
import { lookupCredits } from "@/lib/credits";
import { getStatus } from "@/lib/account";

export const dynamic = "force-dynamic";

// One call for the customer account page: credits + booking status by email.
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") ?? "";
  if (!email.trim()) return NextResponse.json({ credits: [], status: null });
  const [credits, status] = await Promise.all([
    lookupCredits(email),
    getStatus(email),
  ]);
  return NextResponse.json({ credits, status });
}
