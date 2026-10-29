-- Allow gallery media to belong to a project while retaining support for
-- organization-wide media that is not tied to a single project.
alter table public.gallery_items
  add column project_id uuid references public.projects(id) on delete set null;

create index gallery_items_project_media_idx
  on public.gallery_items(project_id, media_type, publication_status, published_at desc)
  where project_id is not null;

comment on column public.gallery_items.project_id is
  'Optional project association; linked published photos appear in the project gallery.';
