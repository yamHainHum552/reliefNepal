-- Fix board_members admin policy to allow both admin and editor roles
drop policy if exists "Admins can manage board members" on public.board_members;
drop policy if exists "Admins and editors can manage board members" on public.board_members;

create policy "Admins and editors can manage board members"
  on public.board_members for all to authenticated
  using ((select public.current_user_role()) in ('admin', 'editor'))
  with check ((select public.current_user_role()) in ('admin', 'editor'));