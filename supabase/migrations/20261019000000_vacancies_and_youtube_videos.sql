create table public.vacancies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 2 and 180),
  job_type text not null check (job_type in ('full-time', 'part-time', 'contract', 'internship', 'consultancy', 'temporary')),
  job_level text not null check (job_level in ('entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'other')),
  salary_min numeric(12, 2) check (salary_min is null or salary_min >= 0),
  salary_max numeric(12, 2) check (salary_max is null or salary_max >= 0),
  salary_currency text not null default 'NPR' check (salary_currency ~ '^[A-Z]{3}$'),
  salary_note text,
  location text not null check (char_length(location) between 2 and 180),
  number_of_vacancies integer not null default 1 check (number_of_vacancies > 0),
  work_schedule text,
  hours_per_week numeric(5, 2) check (hours_per_week is null or hours_per_week between 0 and 168),
  duration text,
  description text not null check (char_length(description) >= 10),
  responsibilities text,
  qualifications text not null,
  benefits text,
  application_instructions text,
  application_email text check (application_email is null or char_length(application_email) <= 254),
  application_url text check (application_url is null or application_url ~ '^https://'),
  application_deadline date,
  status text not null default 'draft' check (status in ('draft', 'open', 'closed', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (salary_min is null or salary_max is null or salary_max >= salary_min),
  check (status <> 'open' or application_email is not null or application_url is not null)
);

create index vacancies_public_status_idx
  on public.vacancies(status, published_at desc);
create index vacancies_deadline_idx
  on public.vacancies(application_deadline)
  where status = 'open';

create function public.set_vacancy_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger vacancies_set_updated_at
  before update on public.vacancies
  for each row execute function public.set_vacancy_updated_at();

alter table public.vacancies enable row level security;
grant select on public.vacancies to anon, authenticated;
grant insert, update, delete on public.vacancies to authenticated;

create policy "Anyone can read open vacancies"
  on public.vacancies for select to anon, authenticated
  using (status = 'open' and (application_deadline is null or application_deadline >= current_date));
create policy "Editors and admins can manage vacancies"
  on public.vacancies for all to authenticated
  using ((select public.current_user_role()) in ('admin', 'editor'))
  with check ((select public.current_user_role()) in ('admin', 'editor'));

-- Preserve existing gallery records while enforcing YouTube links for new or changed video rows.
alter table public.gallery_items
  add constraint gallery_video_youtube_url_check
  check (
    media_type <> 'video'
    or media_url ~* '^https://(www\.)?(youtube\.com/(watch\?v=|embed/)|youtube-nocookie\.com/embed/|youtu\.be/)[A-Za-z0-9_-]{11}([?&].*)?$'
  ) not valid;
