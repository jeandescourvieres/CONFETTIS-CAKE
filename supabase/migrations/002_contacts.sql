-- ═══════════════════════════════════════════════
--  002 — Contacts
-- ═══════════════════════════════════════════════

do $$ begin
  create type relation_type as enum (
    'best_friend', 'friend', 'family', 'partner', 'colleague', 'other'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.contacts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  name          text not null,
  birthday      date,
  name_day      text,                 -- format "MM-DD"
  relation      relation_type not null default 'friend',
  phone         text,
  email         text,
  notes         text,
  avatar_url    text,
  imported_from text check (imported_from in ('phone', 'manual')),
  created_at    timestamptz not null default now()
);

create index if not exists contacts_user_id_idx on public.contacts(user_id);
create index if not exists contacts_birthday_idx on public.contacts(birthday);

alter table public.contacts enable row level security;

drop policy if exists "contacts: toutes opérations propres" on public.contacts;
create policy "contacts: toutes opérations propres"
  on public.contacts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
