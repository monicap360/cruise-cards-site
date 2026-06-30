import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// SERVER-ONLY Supabase client using the service-role key. It bypasses RLS, so it
// MUST never be imported into a client component or shipped to the browser.
//
// Purpose (Platform Phase 4): once RLS is flipped to enforced tenant isolation,
// guests (who are never authenticated) can no longer read their group/offer/
// ticket data with the anon key. Guest-facing reads move to server routes that
// use this admin client and scope every query by the tenant that owns the token.
//
// Until SUPABASE_SERVICE_ROLE_KEY is set in the environment, adminDb() throws —
// nothing in the app uses it yet, so this is inert and safe to ship.

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jffpsuftoiakpogorylw.supabase.co";

export function adminDb(): SupabaseClient {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set — required for tenant-scoped server reads (Phase 4).");
  return createClient(URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function hasServiceRole(): boolean {
  return !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}
