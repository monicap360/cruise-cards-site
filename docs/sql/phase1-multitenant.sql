-- ════════════════════════════════════════════════════════════════════════════
-- PLATFORM PHASE 1 — Multi-tenant foundation (run ONCE in Supabase → SQL Editor)
-- Cruises from Galveston = Tenant #1 / Customer #0.
-- Safe & idempotent. ZERO user-visible change: existing queries keep working
-- (allow-all RLS stays for now — tightened in Phase 4), and every row's
-- tenant_id defaults to 'cfg' so existing data auto-backfills and new rows
-- auto-stamp. See docs/PLATFORM-BLUEPRINT.md.
-- ════════════════════════════════════════════════════════════════════════════

-- 1) Tenants (agencies) — seed CFG as the first one
create table if not exists tenants (
  id text primary key,
  name text,
  slug text unique,
  brand jsonb,              -- logo, colors, support phone, etc. (white-label)
  domain text,
  plan text default 'owner',
  status text default 'active',
  created_at timestamptz default now()
);
insert into tenants (id, name, slug, status)
  values ('cfg', 'Cruises from Galveston', 'cfg', 'active')
  on conflict (id) do nothing;

-- 2) Memberships — which users belong to which tenant, and their role
create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,             -- links to auth.users once Auth is live (Phase 3)
  tenant_id text references tenants(id),
  role text default 'agent',-- owner | manager | agent | viewer
  created_at timestamptz default now()
);

-- 3) Add tenant_id (default 'cfg', NOT NULL) to every existing data table.
--    Adding the column backfills existing rows AND defaults new ones to 'cfg'.
--    Loops over a generous list and skips any table that doesn't exist.
do $$
declare t text;
begin
  foreach t in array array[
    'groups','group_members','group_rooms','group_messages','group_orders','group_deposits',
    'inquiries','reservations','tickets','ticket_messages',
    'vault','cabin_care','cabin_beds','hotel_rfps',
    'customers','offers','quotes','signups','group_signups',
    'sailing_blocks','cabins','room_blocks','last_minute_listings',
    'parking_slots','documents','credits','accounting','ledger','partners','celebrations'
  ] loop
    if exists (select 1 from information_schema.tables
               where table_schema = 'public' and table_name = t) then
      execute format(
        'alter table public.%I add column if not exists tenant_id text not null default ''cfg''', t);
      execute format('create index if not exists %I on public.%I (tenant_id)', t || '_tenant_idx', t);
    end if;
  end loop;
end $$;

-- 4) RLS on the new tables (allow-all for now — matches the rest; tightened in Phase 4)
alter table tenants     enable row level security;
alter table memberships enable row level security;
drop policy if exists "allow all tenants" on tenants;
create policy "allow all tenants" on tenants for all using (true) with check (true);
drop policy if exists "allow all memberships" on memberships;
create policy "allow all memberships" on memberships for all using (true) with check (true);

-- Done. Verify:  select id, name, status from tenants;   -- should show 'cfg'
--               select tenant_id, count(*) from groups group by 1;  -- all 'cfg'
