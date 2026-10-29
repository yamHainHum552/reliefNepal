-- Add detailed fields to projects table
alter table public.projects
add column if not exists location text,
add column if not exists donor text,
add column if not exists period text,
add column if not exists total_budget text,
add column if not exists theme text,
add column if not exists background text,
add column if not exists impact_numbers jsonb,
add column if not exists impact_details jsonb,
add column if not exists banner_url text,
add column if not exists banner_public_id text;

-- Add comment for documentation
comment on column public.projects.location is 'Project location (e.g., Sindhuli)';
comment on column public.projects.donor is 'Funding donor/organization';
comment on column public.projects.period is 'Project period as text (e.g., April 2023 – December 2024)';
comment on column public.projects.total_budget is 'Total budget as text (e.g., USD 50,000)';
comment on column public.projects.theme is 'Project theme (e.g., Psychosocial Health and Protection)';
comment on column public.projects.background is 'Detailed project background/description';
comment on column public.projects.impact_numbers is 'Key impact metrics as JSON array';
comment on column public.projects.impact_details is 'Detailed impact descriptions as JSON array';
comment on column public.projects.banner_url is 'Project banner image URL';
comment on column public.projects.banner_public_id is 'Cloudinary public ID for banner image';