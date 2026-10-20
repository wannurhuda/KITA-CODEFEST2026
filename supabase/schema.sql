-- KITA database schema for Supabase (PostgreSQL)
-- Run this whole file once in: Supabase dashboard > SQL Editor > New query > Run.

-- ============ TABLES ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'donor' check (role in ('donor','community','volunteer','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  area text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text not null check (category in ('food','education','hygiene','essentials','others')),
  description text not null default '',
  condition text not null default 'new' check (condition in ('new','good','perishable')),
  quantity int not null check (quantity > 0),
  reserved int not null default 0 check (reserved >= 0),
  delivered int not null default 0 check (delivered >= 0),
  pickup_area text not null,
  lat double precision not null,
  lng double precision not null,
  available_from date,
  available_to date,
  created_at timestamptz not null default now(),
  check (reserved <= quantity and delivered <= reserved)
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  category text not null check (category in ('food','education','hygiene','essentials','others')),
  description text not null default '',
  quantity int not null check (quantity > 0),
  urgency smallint not null default 2 check (urgency between 1 and 3), -- 1 low, 2 medium, 3 high
  needed_by date,
  area text not null,
  lat double precision not null,
  lng double precision not null,
  status text not null default 'open' check (status in ('open','matched','fulfilled','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.volunteers (
  id uuid primary key references public.profiles(id) on delete cascade,
  vehicle text not null default 'car',
  capacity int not null check (capacity > 0),
  area_km int not null default 10 check (area_km > 0),
  area text not null,
  lat double precision not null,
  lng double precision not null,
  available_from date,
  available_to date,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  volunteer_id uuid references public.volunteers(id),
  status text not null default 'approved' check (status in ('proposed','approved','accepted','delivered','received','declined')),
  score numeric,
  explanation jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.match_items (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  quantity int not null check (quantity > 0)
);

create index if not exists idx_requests_status on public.requests(status);
create index if not exists idx_resources_category on public.resources(category);
create index if not exists idx_matches_request on public.matches(request_id);
create index if not exists idx_match_items_match on public.match_items(match_id);

-- ============ HELPER FUNCTIONS (security definer avoids RLS recursion) ============
create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

create or replace function public.can_see_match(mid uuid) returns boolean
language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.matches m
    where m.id = mid and (
      m.volunteer_id = auth.uid()
      or exists (select 1 from public.requests r join public.organizations o on o.id = r.org_id
                 where r.id = m.request_id and o.owner_id = auth.uid())
      or exists (select 1 from public.match_items mi join public.resources rs on rs.id = mi.resource_id
                 where mi.match_id = m.id and rs.donor_id = auth.uid())
    )
  )
$$;

create or replace function public.resource_in_my_match(rid uuid) returns boolean
language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.match_items mi join public.matches m on m.id = mi.match_id
    where mi.resource_id = rid and m.volunteer_id = auth.uid()
  )
$$;

-- Public, aggregate-only numbers for the homepage and Impact page.
-- Only CONFIRMED outcomes (status = 'received') count as completed assistance.
create or replace function public.public_stats() returns jsonb
language sql security definer stable set search_path = public as $$
  select jsonb_build_object(
    'verified_requests', (select count(*) from public.requests r join public.organizations o on o.id = r.org_id where o.verified),
    'fulfilled_requests', (select count(*) from public.requests where status = 'fulfilled'),
    'resources_listed', (select count(*) from public.resources),
    'deliveries_completed', (select count(*) from public.matches where status = 'received'),
    'items_redistributed', (select coalesce(sum(mi.quantity), 0) from public.match_items mi join public.matches m on m.id = mi.match_id where m.status = 'received'),
    'active_volunteers', (select count(*) from public.volunteers where is_available),
    'avg_hours_to_match', (select round((avg(extract(epoch from (m.created_at - r.created_at)) / 3600))::numeric, 1)
                           from public.matches m join public.requests r on r.id = m.request_id
                           where m.status in ('approved','accepted','delivered','received')),
    'by_category', (select coalesce(jsonb_agg(jsonb_build_object('category', c.category, 'items', c.items)), '[]'::jsonb)
                    from (select rs.category, sum(mi.quantity) as items
                          from public.match_items mi
                          join public.matches m on m.id = mi.match_id
                          join public.resources rs on rs.id = mi.resource_id
                          where m.status = 'received' group by rs.category) c)
  )
$$;
grant execute on function public.public_stats() to anon, authenticated;

-- ============ TRIGGERS ============
-- New auth user -> profile. Role comes from signup form but 'admin' can never be self-assigned.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare r text := coalesce(new.raw_user_meta_data->>'role', 'donor');
begin
  if r not in ('donor','community','volunteer') then r := 'donor'; end if;
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), r);
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only admins (or the SQL editor / service role, where auth.uid() is null) can change role or verified.
create or replace function public.guard_profile_role() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or public.is_admin() then return new; end if;
  new.role := old.role;
  return new;
end $$;
drop trigger if exists guard_profile_role on public.profiles;
create trigger guard_profile_role before update on public.profiles
  for each row execute function public.guard_profile_role();

create or replace function public.guard_org_verified() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if not (auth.uid() is null or public.is_admin()) then new.verified := false; end if;
  elsif not (auth.uid() is null or public.is_admin()) then
    new.verified := old.verified;
  end if;
  return new;
end $$;
drop trigger if exists guard_org_verified on public.organizations;
create trigger guard_org_verified before insert or update on public.organizations
  for each row execute function public.guard_org_verified();

-- Allowed status changes for matches:
--   admin: anything | volunteer: approved->accepted, accepted->delivered | community owner: delivered->received
create or replace function public.guard_match_update() returns trigger
language plpgsql security definer set search_path = public as $$
declare is_owner boolean;
begin
  if auth.uid() is null or public.is_admin() then return new; end if;
  if new.request_id is distinct from old.request_id
     or new.volunteer_id is distinct from old.volunteer_id
     or new.score is distinct from old.score
     or new.explanation is distinct from old.explanation then
    raise exception 'Only an administrator can change match details';
  end if;
  if old.status = 'approved' and new.status = 'accepted' and old.volunteer_id = auth.uid() then return new; end if;
  if old.status = 'accepted' and new.status = 'delivered' and old.volunteer_id = auth.uid() then return new; end if;
  select exists (select 1 from public.requests r join public.organizations o on o.id = r.org_id
                 where r.id = old.request_id and o.owner_id = auth.uid()) into is_owner;
  if old.status = 'delivered' and new.status = 'received' and is_owner then return new; end if;
  raise exception 'This status change is not allowed';
end $$;
drop trigger if exists guard_match_update on public.matches;
create trigger guard_match_update before update on public.matches
  for each row execute function public.guard_match_update();

-- When a delivery is confirmed received: request is fulfilled and donor stock is counted as delivered.
create or replace function public.on_match_received() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'received' and old.status is distinct from 'received' then
    update public.requests set status = 'fulfilled' where id = new.request_id;
    update public.resources rs set delivered = rs.delivered + mi.quantity
      from public.match_items mi where mi.match_id = new.id and mi.resource_id = rs.id;
  end if;
  return new;
end $$;
drop trigger if exists on_match_received on public.matches;
create trigger on_match_received after update on public.matches
  for each row execute function public.on_match_received();

-- ============ ROW LEVEL SECURITY ============
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.resources enable row level security;
alter table public.requests enable row level security;
alter table public.volunteers enable row level security;
alter table public.matches enable row level security;
alter table public.match_items enable row level security;

-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update using (id = auth.uid() or public.is_admin());

-- organizations: verified ones are public; owners see their own; admins see all
drop policy if exists orgs_select on public.organizations;
create policy orgs_select on public.organizations for select using (verified or owner_id = auth.uid() or public.is_admin());
drop policy if exists orgs_insert on public.organizations;
create policy orgs_insert on public.organizations for insert with check (owner_id = auth.uid());
drop policy if exists orgs_update on public.organizations;
create policy orgs_update on public.organizations for update using (owner_id = auth.uid() or public.is_admin());

-- requests: visible when their organization is visible; only verified org owners can create
drop policy if exists requests_select on public.requests;
create policy requests_select on public.requests for select
  using (exists (select 1 from public.organizations o where o.id = org_id));
drop policy if exists requests_insert on public.requests;
create policy requests_insert on public.requests for insert
  with check (exists (select 1 from public.organizations o where o.id = org_id and o.owner_id = auth.uid() and o.verified));
drop policy if exists requests_update on public.requests;
create policy requests_update on public.requests for update
  using (public.is_admin() or exists (select 1 from public.organizations o where o.id = org_id and o.owner_id = auth.uid()));

-- resources: private to the donor, admins, and the volunteer on a match that uses them
drop policy if exists resources_select on public.resources;
create policy resources_select on public.resources for select
  using (donor_id = auth.uid() or public.is_admin() or public.resource_in_my_match(id));
drop policy if exists resources_insert on public.resources;
create policy resources_insert on public.resources for insert with check (donor_id = auth.uid());
drop policy if exists resources_update on public.resources;
create policy resources_update on public.resources for update using (donor_id = auth.uid() or public.is_admin());
drop policy if exists resources_delete on public.resources;
create policy resources_delete on public.resources for delete using ((donor_id = auth.uid() and reserved = 0) or public.is_admin());

-- volunteers
drop policy if exists volunteers_select on public.volunteers;
create policy volunteers_select on public.volunteers for select using (id = auth.uid() or public.is_admin());
drop policy if exists volunteers_insert on public.volunteers;
create policy volunteers_insert on public.volunteers for insert with check (id = auth.uid());
drop policy if exists volunteers_update on public.volunteers;
create policy volunteers_update on public.volunteers for update using (id = auth.uid() or public.is_admin());

-- matches and match_items
drop policy if exists matches_select on public.matches;
create policy matches_select on public.matches for select using (public.is_admin() or public.can_see_match(id));
drop policy if exists matches_insert on public.matches;
create policy matches_insert on public.matches for insert with check (public.is_admin());
drop policy if exists matches_update on public.matches;
create policy matches_update on public.matches for update using (public.is_admin() or public.can_see_match(id));
drop policy if exists match_items_select on public.match_items;
create policy match_items_select on public.match_items for select using (public.is_admin() or public.can_see_match(match_id));
drop policy if exists match_items_insert on public.match_items;
create policy match_items_insert on public.match_items for insert with check (public.is_admin());

-- ============ MAKE YOURSELF AN ADMIN (run after you sign up; replace the email) ============
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
