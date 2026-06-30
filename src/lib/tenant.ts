// ── Multi-tenant seam (Platform Phase 1) ────────────────────────────────────
// Today Cruises from Galveston is the only tenant (Customer #0 / Tenant #1), so
// this returns CFG everywhere. The database also defaults every row's tenant_id
// to "cfg", so nothing in the app has to change yet.
//
// When per-agency auth lands (Phase 3-4): getCurrentTenantId() will read the
// tenant from the signed-in user's session, inserts will set tenant_id
// explicitly (drop the DB default), and RLS will enforce isolation by tenant_id.
// See docs/PLATFORM-BLUEPRINT.md.

export const CFG_TENANT_ID = "cfg";

export function getCurrentTenantId(): string {
  return CFG_TENANT_ID;
}
