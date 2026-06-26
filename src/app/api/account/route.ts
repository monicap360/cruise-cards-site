import { NextRequest, NextResponse } from "next/server";
import { lookupCredits } from "@/lib/credits";
import { getStatus } from "@/lib/account";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// One call for the customer account page: credits + booking status + the
// customer's requests/services (from inquiries), all matched by email.
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") ?? "";
  if (!email.trim())
    return NextResponse.json({ credits: [], status: null, requests: [] });

  const [credits, status, inq] = await Promise.all([
    lookupCredits(email),
    getStatus(email),
    supabase
      .from("inquiries")
      .select("confirm_number, ship, sail_date, cabin_type, mode, message, created_at")
      .ilike("email", email.trim())
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const requests = (inq.data ?? []).map((r) => ({
    confirm: r.confirm_number as string,
    ship: r.ship as string,
    sailDate: r.sail_date as string,
    cabinType: r.cabin_type as string,
    mode: (r.mode as string) ?? "inquiry",
    message: r.message as string,
    createdAt: r.created_at as string,
  }));

  return NextResponse.json({ credits, status, requests });
}
