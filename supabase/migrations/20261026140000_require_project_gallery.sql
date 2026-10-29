-- Prerequisite: 20261026130000_link_gallery_items_to_projects.sql adds project_id.
-- Every new gallery item belongs to an existing project. Keep historical
-- unassigned rows available to editors so they can be linked before validation.
alter table public.gallery_items
  drop constraint if exists gallery_items_project_id_fkey;

alter table public.gallery_items
  add constraint gallery_items_project_id_fkey
  foreign key (project_id)
  references public.projects(id)
  on delete restrict;

alter table public.gallery_items
  add constraint gallery_items_project_required
  check (project_id is not null) not valid;

comment on constraint gallery_items_project_required on public.gallery_items is
  'New gallery records must belong to a project. Assign legacy null project_id rows before validating this constraint.';

comment on column public.gallery_items.project_id is
  'Required project association for every gallery item; deleting a project with gallery media is restricted.';
