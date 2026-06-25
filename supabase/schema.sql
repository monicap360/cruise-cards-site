-- ============================================================
-- Cruises from Galveston™ — Supabase Database Schema
-- Run this entire file in Supabase SQL Editor
-- Project: rgmfjyotdaqtnrqtzhcj
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- BOOKINGS (Sea Pay)
-- ─────────────────────────────────────────────
create table if not exists bookings (
  id text primary key,
  created_at timestamptz default now(),
  booking_number text not null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  ship text not null,
  cruise_line text,
  sailing_date text not null,
  nights integer default 0,
  itinerary text,
  cabin_type text,
  guests integer default 2,
  total_price numeric(10,2) not null default 0,
  deposit_amount numeric(10,2) default 0,
  status text default 'pending' check (status in ('pending','confirmed','paid','cancelled')),
  payment_plan jsonb default '[]',
  payments jsonb default '[]',
  deposit_paid boolean default false,
  guest_names text,
  agent_name text,
  -- contract / chargeback evidence (no card data is ever stored)
  contract_signed boolean default false,
  contract_signed_date text,
  contract_signed_name text,
  contract_signed_at timestamptz,
  contract_signed_ip text,
  terms_version text,
  -- cruise-line card authorization reference only (NEVER full card / CVV / images)
  cc_auth_on_file boolean default false,
  cc_auth_last4 text,
  cc_auth_cruise_line text,
  cc_auth_date text,
  notes text,
  rate_type text default 'flexible'
);

alter table bookings enable row level security;
create policy "Allow all for anon" on bookings for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- HOLDS (Room Holds)
-- ─────────────────────────────────────────────
create table if not exists holds (
  id text primary key,
  created_at timestamptz default now(),
  customer_name text not null,
  customer_email text,
  customer_phone text,
  ship text,
  sailing_date text,
  cabin_type text,
  duration_hours integer check (duration_hours in (24, 48, 72)),
  expires_at timestamptz,
  status text default 'active' check (status in ('active','expired','converted')),
  notes text
);

alter table holds enable row level security;
create policy "Allow all for anon" on holds for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- SEA PAY REQUESTS
-- ─────────────────────────────────────────────
create table if not exists sea_pay_requests (
  id text primary key,
  created_at timestamptz default now(),
  customer_name text,
  customer_email text,
  ship text,
  sailing_date text,
  total_price numeric(10,2),
  deposit_amount numeric(10,2),
  frequency text,
  payment_schedule jsonb default '[]',
  enrollment_fee numeric(10,2) default 49.99,
  status text default 'pending'
);

alter table sea_pay_requests enable row level security;
create policy "Allow all for anon" on sea_pay_requests for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- SAILING BLOCKS (Room Inventory)
-- ─────────────────────────────────────────────
create table if not exists sailing_blocks (
  id text primary key,
  created_at timestamptz default now(),
  ship text not null,
  cruise_line text,
  sailing_date text not null,
  return_date text,
  nights integer default 0,
  itinerary text,
  notes text
);

alter table sailing_blocks enable row level security;
create policy "Allow all for anon" on sailing_blocks for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- CABINS (per Sailing Block)
-- ─────────────────────────────────────────────
create table if not exists cabins (
  id text primary key,
  block_id text references sailing_blocks(id) on delete cascade,
  room_number text not null,
  deck integer,
  location text check (location in ('Forward','Midship','Aft')),
  side text check (side in ('Port','Starboard','Both')),
  type text check (type in ('Interior','Ocean View','Balcony','Mini-Suite','Suite')),
  max_guests integer default 2,
  sqft integer default 0,
  price numeric(10,2) not null,
  is_guarantee boolean default false, -- GTY: guaranteed category, room assigned by cruise line
  status text default 'available' check (status in ('available','held','booked')),
  guest_name text,
  guest_email text,
  booking_id text,
  held_until timestamptz,
  notes text
);

alter table cabins enable row level security;
create policy "Allow all for anon" on cabins for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- WAIVERS (Vacation Protection Declination)
-- ─────────────────────────────────────────────
create table if not exists waivers (
  id text primary key,
  created_at timestamptz default now(),
  customer_name text not null,
  email text,
  phone text,
  booking_ref text,
  ship text,
  sail_date text,
  signature text not null,
  acknowledgments jsonb default '[]'
);

alter table waivers enable row level security;
create policy "Allow all for anon" on waivers for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- COMMUNITY MEMBERS (Sea You on Deck)
-- ─────────────────────────────────────────────
create table if not exists community_members (
  id text primary key,
  created_at timestamptz default now(),
  display_name text not null,
  hometown text,
  bio text,
  ship text not null,
  sailing_date text not null,
  crews jsonb default '[]',
  privacy text default 'public' check (privacy in ('public','private')),
  emoji text default '⚓'
);

alter table community_members enable row level security;
create policy "Allow all for anon" on community_members for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- INQUIRIES (from /book page)
-- ─────────────────────────────────────────────
create table if not exists inquiries (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  confirm_number text,
  first_name text,
  last_name text,
  email text,
  phone text,
  ship text,
  sail_date text,
  rate_type text,
  guests integer,
  cabin_type text,
  crew text,
  message text,
  appt_date text,
  appt_time text,
  mode text default 'inquiry' check (mode in ('inquiry','appointment')),
  status text default 'new' check (status in ('new','contacted','booked','closed'))
);

alter table inquiries enable row level security;
create policy "Allow all for anon" on inquiries for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- APPOINTMENTS (consultation calendar)
-- ─────────────────────────────────────────────
create table if not exists appointments (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  confirm_number text,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  service_type text,
  appt_date text,
  appt_time text,
  ship text,
  sail_date text,
  booking_ref text,
  notes text,
  status text default 'scheduled' check (status in ('scheduled','completed','cancelled','no-show'))
);

alter table appointments enable row level security;
create policy "Allow all for anon" on appointments for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- SERVICES (negotiated rates)
-- ─────────────────────────────────────────────
create table if not exists services (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  category text not null check (category in ('hotel','transportation','parking','excursion','other')),
  name text not null,
  vendor text,
  description text,
  cost numeric(10,2),        -- our cost / negotiated rate
  retail_price numeric(10,2), -- what we charge customers
  markup_pct numeric(5,2),   -- auto-computed or manual
  unit text default 'per person',
  active boolean default true,
  notes text
);

alter table services enable row level security;
create policy "Allow all for anon" on services for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- SERVICE BOOKINGS (revenue tracking)
-- ─────────────────────────────────────────────
create table if not exists service_bookings (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  booking_ref text,
  customer_name text,
  customer_email text,
  service_id uuid references services(id),
  service_name text,
  service_category text,
  quantity integer default 1,
  unit_cost numeric(10,2),
  unit_price numeric(10,2),
  total_cost numeric(10,2),
  total_revenue numeric(10,2),
  profit numeric(10,2),
  ship text,
  sail_date text,
  status text default 'booked' check (status in ('booked','completed','cancelled','refunded'))
);

alter table service_bookings enable row level security;
create policy "Allow all for anon" on service_bookings for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- FRONT DESK RESERVATIONS (Cruise Experience Center)
-- Walk-in & scheduled reservations for on-site services
-- ─────────────────────────────────────────────
create table if not exists reservations (
  id text primary key,
  created_at timestamptz default now(),
  reservation_number text not null,
  guest_name text not null,
  legal_first_name text,  -- legal name as it appears on travel documents
  legal_last_name text,
  guest_email text,
  guest_phone text,
  loyalty_number text,    -- VIFP, Crown & Anchor, Latitudes, Captain's Circle, etc.
  party_size integer default 1,
  service_type text not null,
  ship text,
  sail_date text,
  booking_ref text,
  reservation_date text not null,
  reservation_time text,
  agent_name text,
  status text default 'reserved' check (status in ('requested','reserved','checked-in','in-service','completed','no-show','cancelled')),
  request_summary text, -- guest's own description of what they need
  ai_brief text,        -- AI-generated prep brief for the front desk agent
  id_verified boolean default false, -- staff confirmed a physical photo ID at the desk (no image stored)
  notes text
);

alter table reservations enable row level security;
create policy "Allow all for anon" on reservations for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- LAST-MINUTE LISTINGS (agency-mediated cruise resale)
-- Guests list a cabin they can no longer sail; the agency verifies transfer
-- eligibility, takes it into inventory, and offers it to last-minute buyers.
-- NOTE: booking PINs are NEVER stored here — collected by phone at transfer.
-- ─────────────────────────────────────────────
create table if not exists last_minute_listings (
  id text primary key,
  created_at timestamptz default now(),
  status text default 'pending' check (status in ('pending','verifying','listed','claimed','sold','declined','withdrawn')),
  -- seller (private; never shown on the public board)
  seller_name text not null,
  seller_email text,
  seller_phone text,
  -- cruise
  cruise_line text,
  ship text,
  sail_date text,
  nights integer default 0,
  itinerary text,
  cabin_type text,
  guests integer default 2,
  -- reference only (no PIN)
  booking_ref text,
  -- transfer details (exact guest names + DOB for the cruise-line name change)
  cabin_number text,
  paid_in_full boolean default false,
  passengers jsonb default '[]',
  -- money
  price_paid numeric(10,2) default 0,
  penalty_amount numeric(10,2) default 0,
  desired_back numeric(10,2) default 0,
  desired_refund_pct integer default 0,
  buyer_price numeric(10,2) default 0,
  seller_refund numeric(10,2) default 0,
  notes text
);

alter table last_minute_listings enable row level security;
create policy "Allow all for anon" on last_minute_listings for all using (true) with check (true);

-- ─────────────────────────────────────────────
-- Helpful views
-- ─────────────────────────────────────────────

-- Revenue summary by category
create or replace view revenue_by_category as
select
  service_category,
  count(*) as bookings,
  sum(total_revenue) as gross_revenue,
  sum(total_cost) as total_cost,
  sum(profit) as total_profit
from service_bookings
where status not in ('cancelled','refunded')
group by service_category;

-- Cabin availability per sailing
create or replace view cabin_availability as
select
  b.id as block_id,
  b.ship,
  b.sailing_date,
  b.nights,
  count(c.id) as total_cabins,
  count(c.id) filter (where c.status = 'available') as available,
  count(c.id) filter (where c.status = 'held') as held,
  count(c.id) filter (where c.status = 'booked') as booked
from sailing_blocks b
left join cabins c on c.block_id = b.id
group by b.id, b.ship, b.sailing_date, b.nights;

-- ============================================================
-- Promotions / offers (admin-managed, shown on sailing pages)
-- ============================================================
create table if not exists offers (
  id text primary key,
  title text not null,
  description text,
  badge text,
  icon text default '🎁',
  active boolean default true,
  sort_order int default 0,
  -- optional targeting rules (blank/null = applies to all sailings)
  cruise_line text,
  nights int,
  date_start text,
  date_end text,
  created_at timestamptz default now()
);

alter table offers enable row level security;

drop policy if exists "offers anon read" on offers;
create policy "offers anon read" on offers for select using (true);

drop policy if exists "offers anon write" on offers;
create policy "offers anon write" on offers for all using (true) with check (true);

-- ============================================================
-- Cabin rates (admin-set cruise-line fares per ship + cabin type)
-- ============================================================
create table if not exists cabin_rates (
  ship text not null,
  cabin_type text not null,
  rate numeric not null default 0, -- per person, double occupancy
  updated_at timestamptz default now(),
  primary key (ship, cabin_type)
);

alter table cabin_rates enable row level security;

drop policy if exists "cabin_rates anon read" on cabin_rates;
create policy "cabin_rates anon read" on cabin_rates for select using (true);

drop policy if exists "cabin_rates anon write" on cabin_rates;
create policy "cabin_rates anon write" on cabin_rates for all using (true) with check (true);

-- ============================================================
-- Done. All tables created.
-- ============================================================
