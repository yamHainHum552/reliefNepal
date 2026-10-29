-- Store project impact content as editable, ordered records instead of opaque JSON.
create table public.project_impact_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  label text not null check (char_length(btrim(label)) between 2 and 180),
  value text not null check (char_length(btrim(value)) between 1 and 80),
  unit text check (unit is null or char_length(unit) <= 60),
  reporting_period text check (reporting_period is null or char_length(reporting_period) <= 80),
  measured_on date,
  source text check (source is null or char_length(source) <= 500),
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'verified')),
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_impact_details (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 2 and 180),
  description text not null check (char_length(btrim(description)) between 2 and 5000),
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index project_impact_metrics_project_order_idx
  on public.project_impact_metrics(project_id, display_order, id);
create index project_impact_metrics_publication_idx
  on public.project_impact_metrics(verification_status, project_id);
create index project_impact_details_project_order_idx
  on public.project_impact_details(project_id, display_order, id);

comment on table public.project_impact_metrics is
  'Source-backed, ordered project results; only verified figures for published projects are public.';
comment on table public.project_impact_details is
  'Narrative results explaining the change made by a project.';

alter table public.project_impact_metrics enable row level security;
alter table public.project_impact_details enable row level security;

revoke all on public.project_impact_metrics, public.project_impact_details from anon, authenticated;
grant select on public.project_impact_metrics, public.project_impact_details to anon, authenticated;
grant insert, update, delete on public.project_impact_metrics, public.project_impact_details to authenticated;

create policy "Anyone can read verified metrics for published projects"
  on public.project_impact_metrics for select to anon, authenticated
  using (
    verification_status = 'verified'
    and exists (
      select 1 from public.projects p
      where p.id = project_impact_metrics.project_id
        and p.publication_status = 'published'
    )
  );
create policy "Editors and admins can manage project impact metrics"
  on public.project_impact_metrics for all to authenticated
  using ((select public.current_user_role()) in ('admin', 'editor'))
  with check ((select public.current_user_role()) in ('admin', 'editor'));

create policy "Anyone can read details for published projects"
  on public.project_impact_details for select to anon, authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_impact_details.project_id
        and p.publication_status = 'published'
    )
  );
create policy "Editors and admins can manage project impact details"
  on public.project_impact_details for all to authenticated
  using ((select public.current_user_role()) in ('admin', 'editor'))
  with check ((select public.current_user_role()) in ('admin', 'editor'));

create function public.set_project_impact_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger project_impact_metrics_set_updated_at
  before update on public.project_impact_metrics
  for each row execute function public.set_project_impact_updated_at();
create trigger project_impact_details_set_updated_at
  before update on public.project_impact_details
  for each row execute function public.set_project_impact_updated_at();
revoke all on function public.set_project_impact_updated_at() from public, anon, authenticated;

-- Preserve existing project JSON content as editable rows. Legacy columns remain
-- in place for rollback and are no longer used by the application after this migration.
with legacy_metrics as (
  select
    p.id as project_id,
    coalesce(
      nullif(btrim(metric.item ->> 'label'), ''),
      nullif(btrim(metric.item ->> 'name'), ''),
      'Impact measure ' || metric.ordinality::text
    ) as label,
    coalesce(
      nullif(btrim(metric.item ->> 'value'), ''),
      nullif(btrim(metric.item ->> 'count'), ''),
      nullif(btrim(metric.item ->> 'number'), '')
    ) as value,
    (metric.ordinality - 1)::integer as display_order
  from public.projects p
  cross join lateral jsonb_array_elements(
    case
      when jsonb_typeof(p.impact_numbers) = 'array' then p.impact_numbers
      else '[]'::jsonb
    end
  ) with ordinality as metric(item, ordinality)
)
insert into public.project_impact_metrics(project_id, label, value, display_order)
select project_id, label, value, display_order
from legacy_metrics
where value is not null;

with legacy_details as (
  select
    p.id as project_id,
    coalesce(
      nullif(btrim(detail.item ->> 'title'), ''),
      nullif(btrim(detail.item ->> 'name'), ''),
      'Impact detail ' || detail.ordinality::text
    ) as title,
    coalesce(
      nullif(btrim(detail.item ->> 'description'), ''),
      nullif(btrim(detail.item ->> 'detail'), '')
    ) as description,
    (detail.ordinality - 1)::integer as display_order
  from public.projects p
  cross join lateral jsonb_array_elements(
    case
      when jsonb_typeof(p.impact_details) = 'array' then p.impact_details
      else '[]'::jsonb
    end
  ) with ordinality as detail(item, ordinality)
)
insert into public.project_impact_details(project_id, title, description, display_order)
select project_id, title, description, display_order
from legacy_details
where description is not null;

comment on column public.projects.impact_numbers is
  'Legacy JSON retained for rollback; use project_impact_metrics for current content.';
comment on column public.projects.impact_details is
  'Legacy JSON retained for rollback; use project_impact_details for current content.';

-- Atomically replace a project's ordered impact entries. RLS still enforces
-- editor/admin permissions because this function runs as the calling user.
create function public.replace_project_impact_content(
  p_project_id uuid,
  p_impact_metrics jsonb,
  p_impact_details jsonb
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if jsonb_typeof(p_impact_metrics) <> 'array'
    or jsonb_array_length(p_impact_metrics) > 50 then
    raise exception 'Impact figures must be a list of at most 50 entries.'
      using errcode = '22023';
  end if;

  if jsonb_typeof(p_impact_details) <> 'array'
    or jsonb_array_length(p_impact_details) > 50 then
    raise exception 'Impact details must be a list of at most 50 entries.'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_impact_metrics) as entries(item)
    where jsonb_typeof(entries.item) <> 'object'
      or nullif(btrim(entries.item ->> 'label'), '') is null
      or nullif(btrim(entries.item ->> 'value'), '') is null
  ) then
    raise exception 'Every impact figure needs a label and a value.'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_impact_details) as entries(item)
    where jsonb_typeof(entries.item) <> 'object'
      or nullif(btrim(entries.item ->> 'title'), '') is null
      or nullif(btrim(entries.item ->> 'description'), '') is null
  ) then
    raise exception 'Every impact detail needs a title and a description.'
      using errcode = '22023';
  end if;

  delete from public.project_impact_metrics where project_id = p_project_id;
  insert into public.project_impact_metrics (
    project_id, label, value, unit, reporting_period, measured_on, source,
    verification_status, display_order
  )
  select
    p_project_id,
    btrim(entries.item ->> 'label'),
    btrim(entries.item ->> 'value'),
    nullif(btrim(entries.item ->> 'unit'), ''),
    nullif(btrim(entries.item ->> 'reporting_period'), ''),
    nullif(btrim(entries.item ->> 'measured_on'), '')::date,
    nullif(btrim(entries.item ->> 'source'), ''),
    coalesce(nullif(btrim(entries.item ->> 'verification_status'), ''), 'unverified'),
    (entries.ordinality - 1)::integer
  from jsonb_array_elements(p_impact_metrics) with ordinality as entries(item, ordinality);

  delete from public.project_impact_details where project_id = p_project_id;
  insert into public.project_impact_details(project_id, title, description, display_order)
  select
    p_project_id,
    btrim(entries.item ->> 'title'),
    btrim(entries.item ->> 'description'),
    (entries.ordinality - 1)::integer
  from jsonb_array_elements(p_impact_details) with ordinality as entries(item, ordinality);
end;
$$;

revoke all on function public.replace_project_impact_content(uuid, jsonb, jsonb) from public, anon;
grant execute on function public.replace_project_impact_content(uuid, jsonb, jsonb) to authenticated;
