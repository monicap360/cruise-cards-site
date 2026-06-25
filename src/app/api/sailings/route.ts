import { NextResponse } from "next/server";
import { getSailingBlocks } from "@/lib/room-blocks";

export const dynamic = "force-dynamic";

// Server-side sailing inventory for client pages (e.g. /find). Runs the
// Supabase query on the server so the browser never depends on client-inlined
// keys or row limits — it just receives JSON.
export async function GET() {
  const blocks = await getSailingBlocks();
  return NextResponse.json(blocks);
}
