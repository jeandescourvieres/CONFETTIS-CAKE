-- ═══════════════════════════════════════════════════════════
--  Livre d'or numérique (Phase 9)
-- ═══════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- Table livres d'or
create table if not exists public.guestbooks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  contact_id  uuid references public.contacts(id) on delete set null,
  title       text not null,
  event_date  date,
  token       text not null unique default replace(gen_random_uuid()::text, '-', ''),
  is_open     boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Table contributions
create table if not exists public.guestbook_entries (
  id            uuid primary key default gen_random_uuid(),
  guestbook_id  uuid not null references public.guestbooks(id) on delete cascade,
  contributor_name text not null,
  message       text not null,
  created_at    timestamptz not null default now()
);

-- RLS
alter table public.guestbooks enable row level security;
alter table public.guestbook_entries enable row level security;

-- Propriétaire voit ses livres
create policy "owner_select_guestbooks"
  on public.guestbooks for select
  using (auth.uid() = user_id);

create policy "owner_insert_guestbooks"
  on public.guestbooks for insert
  with check (auth.uid() = user_id);

create policy "owner_update_guestbooks"
  on public.guestbooks for update
  using (auth.uid() = user_id);

create policy "owner_delete_guestbooks"
  on public.guestbooks for delete
  using (auth.uid() = user_id);

-- Propriétaire voit les contributions de ses livres
create policy "owner_select_entries"
  on public.guestbook_entries for select
  using (
    exists (
      select 1 from public.guestbooks g
      where g.id = guestbook_id and g.user_id = auth.uid()
    )
  );

-- Contribution via token (anonymous) — géré côté edge function / service role
-- Les contributions publiques passent par une edge function dédiée
