import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "cfg-admin-session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST(req: NextRequest) {
  const { pin } = await req.json();

  // PIN is set via ADMIN_PIN env var on Render; falls back to default
  const validPin = process.env.ADMIN_PIN ?? "cfg2024";

  if (!pin || pin !== validPin) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  // Simple session token — not cryptographic, but keeps casual snooping out
  const token = Buffer.from(`cfg-admin:${Date.now()}`).toString("base64");

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
