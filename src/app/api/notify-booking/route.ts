import { NextRequest, NextResponse } from "next/server";

// Sends two emails when a booking/request comes in:
//   1. An alert to the owner (so a booking never sits unseen in the inbox)
//   2. A branded confirmation to the customer
// Uses Resend (https://resend.com). Never blocks a booking: if RESEND_API_KEY
// is not set, or a send fails, it returns ok:false and the booking still saved.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: false, skipped: "RESEND_API_KEY not set" });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 }); }

  const kind = esc(body.kind || "Booking request");
  const customerName = esc(body.customerName);
  const customerEmail = String(body.customerEmail || "").trim();
  const confirmNumber = esc(body.confirmNumber);
  const ship = esc(body.ship);
  const sailDate = esc(body.sailDate);
  const cabin = esc(body.cabin);
  const phone = esc(body.phone);
  const summary = esc(body.summary);

  const owner = process.env.OWNER_EMAIL || "cruisesfromgalveston.texas@gmail.com";
  const from = process.env.BOOKING_FROM || "Cruises from Galveston <bookings@cruisesfromgalveston.net>";
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://cruisesfromgalveston.net";

  async function send(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const res = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, subject, html, reply_to: customerEmail || undefined }),
      });
      return res.ok;
    } catch { return false; }
  }

  const row = (label: string, val: string) =>
    val ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:13px">${label}</td><td style="padding:4px 0;color:#0f172a;font-weight:600;font-size:13px">${val}</td></tr>` : "";

  const details = [
    row("Confirmation", confirmNumber),
    row("Guest", customerName),
    row("Email", esc(customerEmail)),
    row("Phone", phone),
    row("Ship", ship),
    row("Sails", sailDate),
    row("Cabin", cabin),
  ].join("");

  // ── Owner alert ──
  const agentHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto">
      <div style="background:#0b1020;color:#fff;padding:20px 24px;border-radius:14px 14px 0 0">
        <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#7dd3fc">New ${kind}</div>
        <div style="font-size:20px;font-weight:800;margin-top:2px">${customerName || "Website booking"}</div>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:none;padding:20px 24px;border-radius:0 0 14px 14px">
        <table style="border-collapse:collapse;width:100%">${details}</table>
        ${summary ? `<div style="margin-top:14px;padding:12px;background:#f8fafc;border-radius:10px;color:#334155;font-size:13px;line-height:1.5">${summary}</div>` : ""}
        <a href="${site}/admin/inbox" style="display:inline-block;margin-top:18px;background:#0284c7;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:10px 20px;border-radius:999px">Open in Inbox →</a>
      </div>
    </div>`;
  const ownerOk = await send(owner, `🚢 New ${kind}: ${customerName || "website"}`, agentHtml);

  // ── Customer confirmation ──
  let custOk = false;
  if (customerEmail) {
    const custHtml = `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto">
        <div style="background:linear-gradient(135deg,#0284c7,#1e3a8a);color:#fff;padding:24px;border-radius:14px 14px 0 0">
          <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#bae6fd">Cruises from Galveston</div>
          <div style="font-size:22px;font-weight:800;margin-top:4px">We got your request! 🚢</div>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 14px 14px;color:#334155;font-size:14px;line-height:1.6">
          <p>Hi ${customerName || "there"}, thanks for choosing Cruises from Galveston.</p>
          <p>Your request is in and a specialist will reach out personally to confirm availability and your total.${confirmNumber ? ` Your reference is <strong>${confirmNumber}</strong>.` : ""}</p>
          <table style="border-collapse:collapse;width:100%;margin:8px 0 4px">${details}</table>
          <div style="margin-top:16px;padding:14px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;font-size:13px">
            <strong>No card was charged.</strong> To reserve, mail a check to <strong>3501 Winnie St, Galveston, TX 77550</strong>, or pay the cruise line directly. We'll confirm everything with you first.
          </div>
          <p style="margin-top:18px">Questions? Call <strong>(409) 632-2106</strong> or just reply to this email.</p>
          <p style="color:#94a3b8;font-size:12px;margin-top:18px">Cruises from Galveston · 3501 Winnie St, Galveston, TX 77550 · ${site.replace("https://", "")}</p>
        </div>
      </div>`;
    custOk = await send(customerEmail, "We got your request — Cruises from Galveston", custHtml);
  }

  // ── Owner SMS alert (Twilio-compatible; works with any number incl. Ooma) ──
  // Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, ALERT_SMS_TO.
  let smsOk = false;
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const smsFrom = process.env.TWILIO_FROM;
  const smsTo = process.env.ALERT_SMS_TO;
  if (sid && token && smsFrom && smsTo) {
    try {
      const text =
        `New ${body.kind || "booking"}: ${body.customerName || "website"}` +
        `${ship ? ` · ${ship}` : ""}${sailDate ? ` ${sailDate}` : ""}` +
        `${cabin ? ` · ${cabin}` : ""}${phone ? ` · ${phone}` : ""}` +
        ` — see /admin/inbox`;
      const form = new URLSearchParams({ From: smsFrom, To: smsTo, Body: text });
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString(),
      });
      smsOk = res.ok;
    } catch { smsOk = false; }
  }

  // ── Owner PHONE RING (Twilio Voice — places a real call that speaks the alert) ──
  // Set TWILIO_VOICE_TO (the number to ring). Reuses the Twilio creds above.
  let callOk = false;
  const voiceTo = process.env.TWILIO_VOICE_TO;
  if (sid && token && smsFrom && voiceTo) {
    try {
      const spoken =
        `New ${body.kind || "booking"} from ${body.customerName || "the website"}` +
        `${ship ? ` for ${ship}` : ""}. Check your inbox.`;
      const twiml = `<Response><Say voice="alice">${esc(spoken)}</Say><Pause length="1"/><Say voice="alice">${esc(spoken)}</Say></Response>`;
      const form = new URLSearchParams({ From: smsFrom, To: voiceTo, Twiml: twiml });
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`, {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString(),
      });
      callOk = res.ok;
    } catch { callOk = false; }
  }

  return NextResponse.json({ ok: ownerOk || custOk || smsOk || callOk, ownerOk, custOk, smsOk, callOk });
}
