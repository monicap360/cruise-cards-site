// Run pending table migrations against Supabase Postgres.
// Reads DB creds from .env.local (gitignored). Idempotent — safe to re-run.
import { readFileSync } from "node:fs";
import pg from "pg";

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const client = new pg.Client({
  host: env.SUPABASE_DB_HOST,
  port: Number(env.SUPABASE_DB_PORT || 5432),
  database: env.SUPABASE_DB_NAME || "postgres",
  user: env.SUPABASE_DB_USER,
  password: env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

const STATEMENTS = [
  // ── offers ──
  `create table if not exists offers (
     id text primary key, title text not null, description text, badge text,
     icon text default '🎁', active boolean default true, sort_order int default 0,
     cruise_line text, nights int, date_start text, date_end text,
     created_at timestamptz default now())`,
  `alter table offers enable row level security`,
  `drop policy if exists "offers anon read" on offers`,
  `create policy "offers anon read" on offers for select using (true)`,
  `drop policy if exists "offers anon write" on offers`,
  `create policy "offers anon write" on offers for all using (true) with check (true)`,

  // ── cabin_rates ──
  `create table if not exists cabin_rates (
     ship text not null, cabin_type text not null, rate numeric not null default 0,
     updated_at timestamptz default now(), primary key (ship, cabin_type))`,
  `alter table cabin_rates enable row level security`,
  `drop policy if exists "cabin_rates anon read" on cabin_rates`,
  `create policy "cabin_rates anon read" on cabin_rates for select using (true)`,
  `drop policy if exists "cabin_rates anon write" on cabin_rates`,
  `create policy "cabin_rates anon write" on cabin_rates for all using (true) with check (true)`,

  // ── customer_credits ──
  `create table if not exists customer_credits (
     id text primary key, customer_name text, email text not null, booking_ref text,
     amount numeric not null default 0, reason text, status text default 'active',
     expires_on text, notes text, created_at timestamptz default now())`,
  `alter table customer_credits enable row level security`,
  `drop policy if exists "credits anon read" on customer_credits`,
  `create policy "credits anon read" on customer_credits for select using (true)`,
  `drop policy if exists "credits anon write" on customer_credits`,
  `create policy "credits anon write" on customer_credits for all using (true) with check (true)`,

  // ── customer_contacts ──
  `create table if not exists customer_contacts (
     id text primary key, customer_name text, email text not null, phone text,
     channel text default 'call', direction text default 'outbound', summary text,
     staff text, contacted_on text, created_at timestamptz default now())`,
  `alter table customer_contacts enable row level security`,
  `drop policy if exists "contacts anon read" on customer_contacts`,
  `create policy "contacts anon read" on customer_contacts for select using (true)`,
  `drop policy if exists "contacts anon write" on customer_contacts`,
  `create policy "contacts anon write" on customer_contacts for all using (true) with check (true)`,

  // ── groups ──
  `create table if not exists groups (
     id text primary key, code text, name text, leader_name text, leader_email text,
     leader_phone text, ship text, cruise_line text, sailing_date text, return_date text,
     nights int, deposit_due_date text, final_payment_date text,
     block_size int default 0, release_date text, group_rate numeric default 0,
     contract text, notes text, created_at timestamptz default now())`,
  `alter table groups enable row level security`,
  `drop policy if exists "groups anon all" on groups`,
  `create policy "groups anon all" on groups for all using (true) with check (true)`,

  // ── group_members ──
  `create table if not exists group_members (
     id text primary key, group_id text, name text, email text, phone text,
     cabin_type text, cabin_number text, guests int default 2, fare numeric default 0,
     deposit_paid numeric default 0, paid_in_full boolean default false,
     confirmation_number text, notes text, created_at timestamptz default now())`,
  `alter table group_members enable row level security`,
  `drop policy if exists "group_members anon all" on group_members`,
  `create policy "group_members anon all" on group_members for all using (true) with check (true)`,
];

await client.connect();
console.log("Connected. Running", STATEMENTS.length, "statements…");
for (const sql of STATEMENTS) {
  await client.query(sql);
}
const { rows } = await client.query(
  `select table_name from information_schema.tables
   where table_schema='public'
   and table_name in ('offers','cabin_rates','customer_credits','customer_contacts')
   order by table_name`
);
console.log("Tables present:", rows.map((r) => r.table_name).join(", "));
await client.end();
console.log("Migration complete.");
