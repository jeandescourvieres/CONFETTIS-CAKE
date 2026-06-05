-- Bloc-notes personnel
create table if not exists public.notes (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  content    text        not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notes enable row level security;

create policy "users manage own notes" on public.notes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists notes_user_id_idx on public.notes(user_id);

grant select, insert, update, delete on public.notes to authenticated;

notify pgrst, 'reload schema';
