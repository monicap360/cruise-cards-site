# Cruise Platform — Multi‑Tenant Architecture Blueprint

> Turning the Cruises from Galveston dashboard into a sellable SaaS product for cruise
> agencies. **CFG is Tenant #1 / Customer #0** — we dogfood, then onboard others.
> Positioning: the operations + **group** + guest‑experience platform that sits *on top*
> of the cruise lines' own booking portals. NOT a GDS.

Status: **DESIGN — not yet executed.** CFG's live site keeps working throughout the migration.

---

## 1. The core change: single‑tenant → multi‑tenant

Today every table is one shared pool with **allow‑all RLS + a public anon key** — fine for
one agency, a **data breach** the moment a second agency is on it. The fix is real tenant
isolation enforced at the database, plus real auth.

### Tenant model
- New table **`tenants`**: `id`, `name`, `slug`, `brand` (logo/colors), `domain`, `plan`, `status`, `created_at`.
- **`tenant_id` column on every data table** (groups, group_members, group_rooms, inquiries,
  tickets, vault, cabin_care, cabin_beds, customers, offers, quotes, reservations, etc.).
- **CFG seeded as the first row** in `tenants`; a one‑time migration stamps every existing
  CFG record with that `tenant_id`. Nothing CFG sees changes.

### Auth (replaces the single ADMIN_PIN)
- **Supabase Auth** (email magic‑link / password). The PIN stays only as a legacy CFG shim
  during migration, then retires.
- New table **`memberships`**: `user_id`, `tenant_id`, `role` (`owner` | `manager` | `agent` | `viewer`).
  A user can belong to one or more tenants; role drives what they can do.
- Admin pages read the **current user's tenant** from their session — no more global PIN.

### Enforced Row‑Level Security (the breach‑killer)
- Drop every `allow all …` policy.
- Replace with: a row is visible/editable **only if its `tenant_id` matches a tenant the
  current user is a member of**. Example shape:
  ```sql
  create policy tenant_isolation on groups for all
    using (tenant_id in (select tenant_id from memberships where user_id = auth.uid()))
    with check (tenant_id in (select tenant_id from memberships where user_id = auth.uid()));
  ```
- **Guest‑facing portals stay token/PIN‑gated** (group portal, tickets, offers) but their
  queries are scoped to the tenant that owns the token — guests never authenticate as users.
- Move secret operations (anything that must bypass RLS) to **server routes using the service
  role key**, never the browser.

---

## 2. White‑label
- Per‑tenant `brand` (logo, colors, agency name, support phone) drives the portal + emails.
- Per‑tenant `domain` (custom domain or `slug.theplatform.com`).
- CFG's current look becomes *CFG's brand config*, not hard‑coded values.

---

## 3. Billing (later phase)
- **Stripe** subscriptions; `tenants.plan` + `status` gate access.
- Tiers (draft): Solo $49–99/mo · Agency $199–499/mo (seats) · optional per‑group fee.
- Self‑serve signup → 14‑day trial → card on file.

---

## 4. What STAYS vs CHANGES

| Stays (your edge — already built) | Changes (productization) |
|---|---|
| Group mgmt, rooming, free‑berth logic | Add `tenant_id` everywhere |
| Requested‑vs‑booked, Cruise Care, bed config | Real auth + roles (kill single PIN) |
| Guest PIN portals, tickets, signups | Enforced RLS (kill allow‑all) |
| Booking‑request flow + alerts (ring/text/email) | Per‑tenant branding/domain |
| CRM, offers, quotes, Elaria, vault | Stripe billing + onboarding |
| AI PDF import | Service‑role server routes for privileged ops |

---

## 5. Migration plan (CFG never goes down)
1. **Add the plumbing** — `tenants`, `memberships`, `tenant_id` columns (nullable at first).
2. **Backfill** — stamp all CFG data with CFG's tenant_id; make columns NOT NULL.
3. **Stand up Supabase Auth** — create CFG owner account; keep PIN working in parallel.
4. **Flip RLS** — replace allow‑all with tenant‑isolation policies; verify CFG still works end‑to‑end.
5. **Move privileged ops to server routes** (service role).
6. **White‑label config** — extract CFG brand into its tenant row.
7. **Stripe + onboarding + signup** — now a 2nd agency can self‑serve.
8. **Pilot 3–5 agencies** → testimonials → iterate.

---

## 6. Top risks / must‑dos
- **RLS correctness is everything** — one wrong policy = cross‑tenant leak. Test with two tenants before any external customer.
- **PII**: you become a **data processor** of other agencies' guest data (DOBs, possibly passports) → Terms of Service + **DPA**, privacy policy, breach plan. *Get a real attorney.*
- **Don't call it a GDS** in marketing — invites a comparison you'll lose. Position as the layer GDS ignores.
- **Naming**: pick a product brand distinct from "Cruises from Galveston" (CFG = proof/customer #0).

---

## 7. First execution step (when greenlit)
Phase 1–2 above: create `tenants` + `memberships`, add nullable `tenant_id` to all tables,
seed CFG as tenant #1, backfill. Zero user‑visible change — pure foundation. Everything else
builds on it.
