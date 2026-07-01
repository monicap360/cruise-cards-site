import { NextRequest, NextResponse } from "next/server";

// Emails a customer their portal link + PIN with a warm "Welcome to the Cruise
// Experience Center" message. Uses Resend (same as notify-booking).
const RESEND_ENDPOINT = "https://api.resend.com/emails";

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: false, skipped: "RESEND_API_KEY not set" });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 }); }

  const to = String(body.to || "").trim();
  const name = esc(body.name);
  const link = String(body.link || "").trim();
  const pin = esc(body.pin);
  const kind = esc(body.kind || "cruise"); // "group" | "reservation"
  if (!to || !link) return NextResponse.json({ ok: false, error: "missing to/link" }, { status: 400 });

  const from = process.env.BOOKING_FROM || "Cruises from Galveston <bookings@cruisesfromgalveston.net>";

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto">
      <div style="background:linear-gradient(135deg,#0284c7,#1e3a8a);color:#fff;padding:26px;border-radius:14px 14px 0 0">
        <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#bae6fd">The Cruise Experience Center</div>
        <div style="font-size:23px;font-weight:800;margin-top:4px">Welcome aboard! 🚢</div>
        <div style="font-size:12px;color:#bae6fd;margin-top:6px">powered by Cruises from Galveston</div>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:none;padding:26px;border-radius:0 0 14px 14px;color:#334155;font-size:14px;line-height:1.6">
        <p>Hi ${name || "there"}, welcome to the <strong>Cruise Experience Center</strong>, powered by Cruises from Galveston!</p>
        <p>Here is your personal ${kind === "group" ? "group" : "reservation"} portal — your one place for everything about your trip: your itinerary, cabin, payments, check‑in steps, and every update as we finalize your details.</p>
        <div style="text-align:center;margin:22px 0">
          <a href="${esc(link)}" style="display:inline-block;background:#0284c7;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 30px;border-radius:999px">Open my portal →</a>
        </div>
        ${pin ? `<div style="text-align:center;margin:8px 0 4px">
          <div style="display:inline-block;background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:12px 22px">
            <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#64748b">Your PIN</div>
            <div style="font-size:26px;font-weight:800;letter-spacing:.2em;color:#0f172a">${pin}</div>
          </div>
        </div>
        <p style="text-align:center;color:#64748b;font-size:12px;margin-top:8px">The link above already includes your PIN — this is just in case you need it.</p>` : ""}
        <p style="margin-top:18px">Questions any time? Call or text <strong>(409) 632‑2106</strong> or reply to this email — we're here for you from now until you're safely back home.</p>
        <p style="color:#94a3b8;font-size:12px;margin-top:18px">The Cruise Experience Center · powered by Cruises from Galveston · 3501 Winnie St, Galveston, TX 77550</p>
      </div>
    </div>`;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject: "Welcome to the Cruise Experience Center — your portal link 🚢", html }),
    });
    return NextResponse.json({ ok: res.ok });
  } catch {
    return NextResponse.json({ ok: false, error: "send failed" }, { status: 500 });
  }
}
