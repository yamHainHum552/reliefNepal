alter table public.notices
  add column image_url text,
  add column image_public_id text,
  add constraint notices_image_fields_together
    check ((image_url is null) = (image_public_id is null));

comment on column public.notices.image_url is
  'Cloudinary HTTPS image URL displayed with the notice.';
comment on column public.notices.image_public_id is
  'Cloudinary public ID used for notice image asset management.';
