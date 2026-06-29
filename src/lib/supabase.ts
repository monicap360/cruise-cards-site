import { createClient } from "@supabase/supabase-js";

// Fall back to harmless placeholders so a missing env var can't crash the
// production *build* (createClient throws on an empty URL). The real values
// MUST be set in the host's environment (NEXT_PUBLIC_* are inlined at build
// time) for live data to work — without them, queries simply fail gracefully.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(url, key);
