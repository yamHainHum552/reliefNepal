create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'editor', 'viewer');
create type public.project_status as enum ('planned', 'ongoing', 'completed');
create type public.publication_status as enum ('draft', 'published', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.user_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  description text,
  publication_status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.programs(id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  summary text,
  status public.project_status not null default 'planned',
  publication_status public.publication_status not null default 'draft',
  starts_on date,
  ends_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create table public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  subject text not null default '' check (char_length(subject) <= 180),
  message text not null check (char_length(message) between 10 and 5000),
  type text not null default 'contact' check (type in ('contact', 'partnership')),
  created_at timestamptz not null default now()
);

create table public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) <= 254),
  consented_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index projects_program_id_idx on public.projects(program_id);
create index projects_publication_status_idx on public.projects(publication_status);
create index projects_status_idx on public.projects(status);
create index programs_publication_status_idx on public.programs(publication_status);
create index contact_inquiries_created_at_idx on public.contact_inquiries(created_at desc);
create index newsletter_subscriptions_created_at_idx on public.newsletter_subscriptions(created_at desc);

create function public.current_user_role()
returns public.user_role
language sql stable security definer set search_path = ''
as $$ select role from public.profiles where id = (select auth.uid()) $$;

alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.projects enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.newsletter_subscriptions enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Admins can manage profiles"
  on public.profiles for all to authenticated
  using ((select public.current_user_role()) = 'admin')
  with check ((select public.current_user_role()) = 'admin');

create policy "Anyone can read published programs"
  on public.programs for select to anon, authenticated using (publication_status = 'published');
create policy "Editors and admins can manage programs"
  on public.programs for all to authenticated
  using ((select public.current_user_role()) in ('admin', 'editor'))
  with check ((select public.current_user_role()) in ('admin', 'editor'));

create policy "Anyone can read published projects"
  on public.projects for select to anon, authenticated using (publication_status = 'published');
create policy "Editors and admins can manage projects"
  on public.projects for all to authenticated
  using ((select public.current_user_role()) in ('admin', 'editor'))
  with check ((select public.current_user_role()) in ('admin', 'editor'));

-- Visitors may submit new records but cannot read, update, or delete submissions.
revoke all on public.contact_inquiries from anon, authenticated;
grant insert on public.contact_inquiries to anon, authenticated;
grant select on public.contact_inquiries to authenticated;
create policy "Visitors can submit contact inquiries"
  on public.contact_inquiries for insert to anon, authenticated with check (true);
create policy "Admins can review contact inquiries"
  on public.contact_inquiries for select to authenticated
  using ((select public.current_user_role()) = 'admin');

revoke all on public.newsletter_subscriptions from anon, authenticated;
grant insert on public.newsletter_subscriptions to anon, authenticated;
grant select on public.newsletter_subscriptions to authenticated;
create policy "Visitors can subscribe to newsletter"
  on public.newsletter_subscriptions for insert to anon, authenticated with check (true);
create policy "Admins can review newsletter subscriptions"
  on public.newsletter_subscriptions for select to authenticated
  using ((select public.current_user_role()) = 'admin');

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;
