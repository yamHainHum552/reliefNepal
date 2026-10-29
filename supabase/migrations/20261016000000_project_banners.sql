alter table public.projects
  add column banner_url text,
  add column banner_public_id text,
  add constraint projects_banner_fields_together
    check ((banner_url is null) = (banner_public_id is null));

comment on column public.projects.banner_url is 'Cloudinary HTTPS delivery URL used as the project banner.';
comment on column public.projects.banner_public_id is 'Cloudinary public ID, retained for asset management.';
