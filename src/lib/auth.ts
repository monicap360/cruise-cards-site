import { supabase } from "@/lib/supabase";
import { CFG_TENANT_ID } from "@/lib/tenant";

// Real per-agency auth (Platform Phase 3) — additive. Supabase Auth identifies
// the user; the `memberships` table maps them to a tenant + role. The legacy
// admin PIN still works in parallel, so nobody gets locked out during the switch.

export type Membership = { tenantId: string; role: string };

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email: email.trim(), password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function currentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// The signed-in user's tenant + role. Falls back to CFG owner when there's no
// session yet (e.g. PIN-only login during the transition).
export async function currentMembership(): Promise<Membership> {
  const user = await currentUser();
  if (!user) return { tenantId: CFG_TENANT_ID, role: "owner" };
  try {
    const { data } = await supabase.from("memberships").select("tenant_id, role").eq("user_id", user.id).limit(1);
    if (data && data[0]) {
      return { tenantId: (data[0].tenant_id as string) || CFG_TENANT_ID, role: (data[0].role as string) || "agent" };
    }
  } catch { /* memberships table may not exist yet */ }
  return { tenantId: CFG_TENANT_ID, role: "owner" };
}
