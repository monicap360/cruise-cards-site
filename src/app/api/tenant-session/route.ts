import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Verifies a Supabase access token server-side, looks up the user's tenant +
// role from `memberships`, and sets the same admin session cookie the PIN login
// uses (so middleware keeps working unchanged) plus a `cfg-tenant` cookie.

const SESSION_COOKIE = "cfg-admin-session";
const TENANT_COOKIE = "cfg-tenant";
const MAX_AGE = 60 * 60 * 8;

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jffpsuftoiakpogorylw.supabase.co";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZnBzdWZ0b2lha3BvZ29yeWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTY0NTEsImV4cCI6MjA5Nzg5MjQ1MX0.w4sPfbCQ-yWkmp8IdBQOc-dT5lGR8N4wwqkbZCgRaD0";

export async function POST(req: NextRequest) {
  let accessToken = "";
  try { accessToken = (await req.json()).accessToken || ""; } catch { /* ignore */ }
  if (!accessToken) return NextResponse.json({ error: "missing token" }, { status: 400 });

  const sb = createClient(URL, ANON);
  const { data, error } = await sb.auth.getUser(accessToken);
  if (error || !data.user) return NextResponse.json({ error: "invalid session" }, { status: 401 });

  // Look up tenant + role (default to CFG owner if no membership row yet).
  let tenant = "cfg";
  let role = "owner";
  try {
    const { data: m } = await sb.from("memberships").select("tenant_id, role").eq("user_id", data.user.id).limit(1);
    if (m && m[0]) { tenant = (m[0].tenant_id as string) || "cfg"; role = (m[0].role as string) || "agent"; }
  } catch { /* memberships may not exist yet */ }

  const token = Buffer.from(`cfg-admin:${Date.now()}`).toString("base64");
  const res = NextResponse.json({ ok: true, tenant, role, email: data.user.email });
  const opts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, maxAge: MAX_AGE, path: "/" };
  res.cookies.set(SESSION_COOKIE, token, opts);
  res.cookies.set(TENANT_COOKIE, tenant, { ...opts, httpOnly: false }); // readable client-side
  return res;
}
