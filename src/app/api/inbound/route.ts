import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Inbound webhook for Zapier (Gmail confirmations, Ooma calls/recordings, SMS).
 * Zapier POSTs JSON here; we file it into the customer communication log
 * (customer_contacts), matched by email/phone. Protected by a shared secret.
 *
 * Expected JSON body:
 * {
 *   "secret": "<INBOUND_SECRET>",
 *   "type": "call" | "email" | "sms" | "voicemail",
 *   "direction": "inbound" | "outbound",
 *   "name": "Jane Smith",
 *   "email": "jane@example.com",
 *   "phone": "+1409...",
 *   "summary": "Carnival booking confirmation #ABC123",
 *   "recordingUrl": "https://...",   // call recording or email/doc link
 *   "staff": "MP"
 * }
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const secret = String(body.secret ?? "");
  if (!process.env.INBOUND_SECRET || secret !== process.env.INBOUND_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const type = String(body.type ?? "other").toLowerCase();
  const channel = ["call", "email", "sms", "voicemail"].includes(type) ? type : "other";
  const recordingUrl = String(body.recordingUrl ?? "");
  const summary =
    String(body.summary ?? "").slice(0, 1000) +
    (recordingUrl ? ` [link: ${recordingUrl}]` : "");

  const row = {
    id: "in-" + Math.random().toString(36).slice(2, 10),
    customer_name: String(body.name ?? ""),
    email: String(body.email ?? "").trim().toLowerCase() || null,
    phone: String(body.phone ?? "") || null,
    channel,
    direction: String(body.direction ?? "inbound"),
    summary: summary || null,
    staff: String(body.staff ?? "") || null,
    contacted_on: new Date().toISOString().slice(0, 10),
  };

  const { error } = await supabase.from("customer_contacts").insert(row);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, logged: row.id });
}

// Quick health check (no secret needed) so you can confirm the URL is live.
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "inbound",
    expects: "POST JSON { secret, type, name, email, phone, summary, recordingUrl }",
  });
}
