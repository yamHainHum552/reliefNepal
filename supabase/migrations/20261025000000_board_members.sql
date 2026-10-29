create extension if not exists pgcrypto;

create table public.board_members (
  id uuid primary key default gen_random_uuid(),
  sn integer not null unique,
  name text not null check (char_length(name) between 2 and 120),
  qualification text not null check (char_length(qualification) <= 80),
  expertise text not null check (char_length(expertise) <= 120),
  designation text not null check (char_length(designation) <= 80),
  contact text not null check (char_length(contact) between 10 and 20),
  email text not null check (char_length(email) <= 254),
  experience integer not null check (experience >= 0),
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index board_members_sn_idx on public.board_members(sn);
create index board_members_display_order_idx on public.board_members(display_order);
create index board_members_is_active_idx on public.board_members(is_active);

alter table public.board_members enable row level security;

-- Anyone can read active board members (for public display)
create policy "Anyone can read active board members"
  on public.board_members for select to anon, authenticated
  using (is_active = true);

-- Admins and editors can manage board members
create policy "Admins and editors can manage board members"
  on public.board_members for all to authenticated
  using ((select public.current_user_role()) in ('admin', 'editor'))
  with check ((select public.current_user_role()) in ('admin', 'editor'));