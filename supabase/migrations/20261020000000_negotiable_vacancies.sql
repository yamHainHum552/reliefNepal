alter table public.vacancies
  drop column if exists salary_min,
  drop column if exists salary_max,
  drop column if exists salary_currency,
  drop column if exists salary_note;

comment on table public.vacancies is
  'Job openings managed independently from notices; salary is always negotiable.';
