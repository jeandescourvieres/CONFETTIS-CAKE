-- ═══════════════════════════════════════════════
--  005 — Push tokens + pot participants tracking
-- ═══════════════════════════════════════════════

-- Ajout du push_token sur les profils (pour les notifications expo)
alter table public.profiles
  add column if not exists push_token text;

-- Table pour tracker les participants app qui suivent une cagnotte
create table if not exists public.pot_watchers (
  id         uuid primary key default gen_random_uuid(),
  pot_id     uuid not null references public.pots(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(pot_id, user_id)
);

create index if not exists pot_watchers_pot_id_idx  on public.pot_watchers(pot_id);
create index if not exists pot_watchers_user_id_idx on public.pot_watchers(user_id);

alter table public.pot_watchers enable row level security;

drop policy if exists "pot_watchers: lecture propre" on public.pot_watchers;
create policy "pot_watchers: lecture propre"
  on public.pot_watchers for select
  using (auth.uid() = user_id);

drop policy if exists "pot_watchers: insert propre" on public.pot_watchers;
create policy "pot_watchers: insert propre"
  on public.pot_watchers for insert
  with check (auth.uid() = user_id);

drop policy if exists "pot_watchers: delete propre" on public.pot_watchers;
create policy "pot_watchers: delete propre"
  on public.pot_watchers for delete
  using (auth.uid() = user_id);
