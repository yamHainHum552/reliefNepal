-- Canonical program categories used by the project editor and public directory.
insert into public.programs (slug, name, description, publication_status)
values
  ('protection', 'Protection', 'Child, youth, and community protection programs.', 'published'),
  ('health-education', 'Health & Education', 'Health, nutrition, and inclusive education programs.', 'published'),
  ('disaster-climate', 'Disaster & Climate Change', 'Preparedness, humanitarian response, and community resilience programs.', 'published'),
  ('livelihoods', 'Livelihoods', 'Livelihood and economic opportunity programs.', 'published'),
  ('wash', 'WASH', 'Water, sanitation, and hygiene programs.', 'published')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  publication_status = 'published',
  updated_at = now();

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 180),
  caption text,
  media_type text not null check (media_type in ('photo', 'video', 'audio')),
  media_url text not null,
  media_public_id text,
  thumbnail_url text,
  alt_text text,
  publication_status public.publication_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((media_public_id is null) or (media_type = 'photo'))
);

create table public.network_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 180),
  relationship_type text not null check (relationship_type in ('local-district', 'resource-partner', 'affiliation')),
  description text,
  website_url text,
  logo_url text,
  publication_status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notices (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 2 and 180),
  summary text,
  body text,
  attachment_url text,
  publication_status public.publication_status not null default 'draft',
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at is null or published_at is null or expires_at >= published_at)
);

create index gallery_items_publication_idx on public.gallery_items(publication_status, created_at desc);
create index network_partners_type_idx on public.network_partners(relationship_type, publication_status);
create index notices_publication_idx on public.notices(publication_status, published_at desc);

alter table public.gallery_items enable row level security;
alter table public.network_partners enable row level security;
alter table public.notices enable row level security;

grant select on public.gallery_items, public.network_partners, public.notices to anon, authenticated;
grant insert, update, delete on public.gallery_items, public.network_partners, public.notices to authenticated;

create policy "Anyone can read published gallery items"
  on public.gallery_items for select to anon, authenticated using (publication_status = 'published');
create policy "Editors and admins can manage gallery items"
  on public.gallery_items for all to authenticated
  using ((select public.current_user_role()) in ('admin', 'editor'))
  with check ((select public.current_user_role()) in ('admin', 'editor'));

create policy "Anyone can read published network partners"
  on public.network_partners for select to anon, authenticated using (publication_status = 'published');
create policy "Editors and admins can manage network partners"
  on public.network_partners for all to authenticated
  using ((select public.current_user_role()) in ('admin', 'editor'))
  with check ((select public.current_user_role()) in ('admin', 'editor'));

create policy "Anyone can read published notices"
  on public.notices for select to anon, authenticated
  using (publication_status = 'published' and (expires_at is null or expires_at >= now()));
create policy "Editors and admins can manage notices"
  on public.notices for all to authenticated
  using ((select public.current_user_role()) in ('admin', 'editor'))
  with check ((select public.current_user_role()) in ('admin', 'editor'));
