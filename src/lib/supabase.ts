import { createClient } from "@supabase/supabase-js";

// Supabase URL + anon key are PUBLIC by design (safe in the browser bundle,
// protected by row-level security), so we default to the real project values.
// This means live data works without any host env-var setup. An env var, if
// set, still overrides these (e.g. to point at a different project).
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://jffpsuftoiakpogorylw.supabase.co";
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZnBzdWZ0b2lha3BvZ29yeWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTY0NTEsImV4cCI6MjA5Nzg5MjQ1MX0.w4sPfbCQ-yWkmp8IdBQOc-dT5lGR8N4wwqkbZCgRaD0";

export const supabase = createClient(url, key);
