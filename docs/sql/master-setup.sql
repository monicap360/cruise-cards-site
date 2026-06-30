-- ════════════════════════════════════════════════════════════════════════════
-- MASTER SETUP — run ONCE in Supabase → SQL Editor. Idempotent & safe to re-run.
-- Turns on everything built this session + the multi-tenant foundation
-- (Cruises from Galveston = Tenant #1). Zero user-visible change; allow-all RLS
-- retained for now (tightened later in platform Phase 4).
-- ════════════════════════════════════════════════════════════════════════════

-- ── A) Multi-tenant foundation (Platform Phase 1) ───────────────────────────
create table if not exists tenants (
  id text primary key, name text, slug text unique, brand jsonb,
  domain text, plan text default 'owner', status text default 'active',
  created_at timestamptz default now());
insert into tenants (id, name, slug, status)
  values ('cfg','Cruises from Galveston','cfg','active') on conflict (id) do nothing;

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid, tenant_id text references tenants(id),
  role text default 'agent', created_at timestamptz default now());

-- add tenant_id (default 'cfg') to every existing table
do $$
declare t text;
begin
  foreach t in array array[
    'groups','group_members','group_rooms','group_messages','group_orders','group_deposits',
    'inquiries','reservations','tickets','ticket_messages','orders','individual_bookings',
    'vault','cabin_care','cabin_beds','hotel_rfps',
    'customers','offers','quotes','signups','group_signups',
    'sailing_blocks','cabins','room_blocks','last_minute_listings',
    'parking_slots','documents','credits','accounting','ledger','partners','celebrations'
  ] loop
    if exists (select 1 from information_schema.tables where table_schema='public' and table_name=t) then
      execute format('alter table public.%I add column if not exists tenant_id text not null default ''cfg''', t);
    end if;
  end loop;
end $$;

-- ── B) Feature tables built this session ────────────────────────────────────
create table if not exists tickets (
  id text primary key, token text unique, pin text, customer_name text,
  customer_email text, customer_phone text, group_code text, subject text,
  status text default 'Open', tenant_id text not null default 'cfg', created_at timestamptz default now());
create table if not exists ticket_messages (
  id text primary key, ticket_id text, sender text, body text,
  tenant_id text not null default 'cfg', created_at timestamptz default now());

create table if not exists vault (
  id text primary key, salt text, iv text, ciphertext text,
  tenant_id text not null default 'cfg', updated_at timestamptz default now());

create table if not exists cabin_care (
  member_id text primary key, status text default 'needed',
  tenant_id text not null default 'cfg', updated_at timestamptz default now());

create table if not exists cabin_beds (
  member_id text primary key, config text,
  tenant_id text not null default 'cfg', updated_at timestamptz default now());

create table if not exists orders (
  id text primary key, source text default 'front-desk',
  reservation_id text, group_code text, customer_name text, customer_contact text,
  items jsonb default '[]'::jsonb, total numeric default 0, method text,
  paid boolean default false, status text default 'pending', notes text,
  tenant_id text not null default 'cfg', created_at timestamptz default now());

create table if not exists individual_bookings (
  id text primary key, guest_name text, ship text, sail_date date, itinerary text,
  booking_number text, contact text, checkin_status text, notes text,
  tenant_id text not null default 'cfg', created_at timestamptz default now());

create table if not exists group_messages (
  id text primary key, member_id text, group_code text, sender text, body text,
  tenant_id text not null default 'cfg', created_at timestamptz default now());

create table if not exists hotel_rfps (
  id text primary key, token text, group_code text, group_name text, ship text,
  sail_date text, rooms_needed int, nights_before int, hotel_name text,
  contact_name text, contact_email text, contact_phone text, status text default 'Sent',
  nightly_rate numeric default 0, room_type text, park_stay_cruise boolean default false,
  parking_days int default 0, shuttle boolean default false, terms text,
  tenant_id text not null default 'cfg', created_at timestamptz default now());

-- new columns on existing tables
alter table reservations  add column if not exists arrival_tasks jsonb default '{}'::jsonb;
alter table group_members add column if not exists admin_notes text;

-- ── C) Row-level security (allow-all for now) ───────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'tenants','memberships','tickets','ticket_messages','vault','cabin_care','cabin_beds',
    'orders','individual_bookings','group_messages','hotel_rfps'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "allow all %s" on public.%I', t, t);
    execute format('create policy "allow all %s" on public.%I for all using (true) with check (true)', t, t);
  end loop;
end $$;

-- ── D) Seed the 13 individual Carnival bookings ─────────────────────────────
insert into individual_bookings (id, guest_name, ship, sail_date, itinerary, booking_number, contact, checkin_status) values
('ib-ZN88D6','savannah morton','carnival jubilee','2026-07-04','7-DAY Western Caribbean','ZN88D6','(409) 632-2106','Completed'),
('ib-ZN28Q0','khodr darwich','carnival breeze','2026-07-04','5-DAY Western Caribbean','ZN28Q0','(409) 632-2106','Available'),
('ib-TH77V5','catalina walvekar','carnival dream','2026-07-11','','TH77V5','(409) 632-2106','Available'),
('ib-RT66F8','victoria clark','carnival dream','2026-07-11','','RT66F8','(409) 632-2106','Available'),
('ib-RT66S8','jessica bradford','carnival dream','2026-07-11','','RT66S8','(409) 632-2106','Available'),
('ib-RT66Z1','khodr darwich','carnival dream','2026-07-11','','RT66Z1','(409) 632-2106','Available'),
('ib-XT36N6','hadrian henry','carnival dream','2026-07-11','','XT36N6','(409) 632-2106','Available'),
('ib-ZN07F6','jose anton guerrero','carnival horizon','2026-07-12','6-DAY Western Caribbean','ZN07F6','(409) 632-2106','Available'),
('ib-ZW22M6','jessica lopez','carnival horizon','2026-07-12','6-DAY Western Caribbean','ZW22M6','(409) 632-2106','Available'),
('ib-WN07J9','khodr darwich','carnival breeze','2026-07-13','','WN07J9','(409) 632-2106','Available'),
('ib-ZR85B7','jessica lopez','carnival jubilee','2026-07-18','7-DAY Western Caribbean','ZR85B7','(409) 632-2106','Available'),
('ib-ZP28D1','hadrian henry','carnival breeze','2026-09-12','5-DAY Western Caribbean','ZP28D1','(409) 632-2106','Available'),
('ib-ZH29M9','khodr darwich','carnival jubilee','2027-05-15','8-DAY Bahamas','ZH29M9','(409) 632-2106','Available')
on conflict (id) do nothing;

-- Done. Quick checks:
--   select id, status from tenants;                         -- 'cfg'
--   select count(*) from individual_bookings;               -- 13
--   select tenant_id, count(*) from groups group by 1;      -- all 'cfg'
