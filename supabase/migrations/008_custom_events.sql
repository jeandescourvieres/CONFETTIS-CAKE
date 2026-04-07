-- Table des événements personnalisés (non liés aux contacts)
create table if not exists public.custom_events (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  event_date    date not null,
  description   text,
  remind_before int not null default 1, -- jours avant rappel
  created_at    timestamptz not null default now()
);

alter table public.custom_events enable row level security;

drop policy if exists "Users manage own custom events" on public.custom_events;
create policy "Users manage own custom events"
  on public.custom_events
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists custom_events_user_date on public.custom_events(user_id, event_date);
