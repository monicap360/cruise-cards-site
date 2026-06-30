-- ════════════════════════════════════════════════════════════════════════════
-- PLATFORM PHASE 4 — Enforced tenant isolation (RLS).  ⚠️⚠️ DO NOT RUN YET ⚠️⚠️
-- ════════════════════════════════════════════════════════════════════════════
-- This flips every table from "allow all" to "only your tenant's rows."
--
-- Running this BEFORE the app is converted WILL BREAK THE LIVE SITE, because today
-- both admin and guest pages read with the public ANON key (no auth.uid()), and
-- these policies block anon access.
--
-- PREREQUISITES before running (the conversion):
--   1) SUPABASE_SERVICE_ROLE_KEY set in the environment (Render).
--   2) Admin pages authenticate via Supabase Auth (email login) — not just the PIN —
--      so their requests carry auth.uid().
--   3) Guest-facing reads (group portals, offers, tickets, hotel-rfp) move to SERVER
--      routes using adminDb() (service role) scoped by the token's tenant.
--   4) Tested with TWO tenants: confirm tenant A cannot see tenant B's rows, and that
--      every guest portal still loads.
-- Only then run this. Do it right before onboarding a second agency.

-- Which tenants the currently-authenticated user belongs to.
create or replace function auth_tenant_ids() returns setof text language sql stable as $$
  select tenant_id from memberships where user_id = auth.uid()
$$;

-- Flip each data table from allow-all to tenant isolation.
do $$
declare t text;
begin
  foreach t in array array[
    'groups','group_members','group_rooms','group_messages','group_orders','group_deposits',
    'inquiries','reservations','tickets','ticket_messages','orders','individual_bookings',
    'vault','cabin_care','cabin_beds','hotel_rfps',
    'customers','offers','quotes','signups','sailing_blocks','cabins','documents'
  ] loop
    if exists (select 1 from information_schema.tables where table_schema='public' and table_name=t) then
      execute format('drop policy if exists "allow all %s" on public.%I', t, t);
      execute format($f$create policy "tenant isolation %s" on public.%I for all
        using (tenant_id in (select auth_tenant_ids()))
        with check (tenant_id in (select auth_tenant_ids()))$f$, t, t);
    end if;
  end loop;
end $$;

-- NOTE: the service role bypasses RLS entirely, so server routes using adminDb()
-- keep working for guest pages regardless of these policies.
