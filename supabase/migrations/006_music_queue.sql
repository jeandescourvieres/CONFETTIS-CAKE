-- ═══════════════════════════════════════════════
--  006 — Génération musicale + file d'attente
-- ═══════════════════════════════════════════════

-- Statut de génération audio sur les messages
do $$ begin
  create type music_status as enum ('none', 'pending', 'generating', 'ready', 'failed', 'queued');
exception when duplicate_object then null;
end $$;

alter table public.messages
  add column if not exists audio_url         text,
  add column if not exists music_status      music_status not null default 'none',
  add column if not exists music_service     text,          -- 'suno' | 'udio' | 'elevenlabs'
  add column if not exists music_duration_s  integer;       -- durée en secondes

-- File d'attente musicale (jobs en attente quand tous les services sont down)
create table if not exists public.music_queue (
  id              uuid primary key default gen_random_uuid(),
  message_id      uuid not null references public.messages(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  lyrics          text not null,
  style           text not null default 'pop',
  tone            text not null default 'joyful',
  retries         integer not null default 0,
  max_retries     integer not null default 10,
  last_error      text,
  status          text not null default 'pending'
                    check (status in ('pending', 'processing', 'done', 'abandoned')),
  next_retry_at   timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists music_queue_status_retry_idx
  on public.music_queue(status, next_retry_at)
  where status = 'pending';

create index if not exists music_queue_message_id_idx on public.music_queue(message_id);

alter table public.music_queue enable row level security;

-- L'utilisateur voit seulement ses propres jobs
drop policy if exists "music_queue: lecture propre" on public.music_queue;
create policy "music_queue: lecture propre"
  on public.music_queue for select
  using (auth.uid() = user_id);

-- Les Edge Functions (service_role) peuvent tout faire
-- (pas de policy restrictive pour insert/update — géré côté service_role)

-- Trigger updated_at
create or replace function public.set_music_queue_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists music_queue_updated_at on public.music_queue;
create trigger music_queue_updated_at
  before update on public.music_queue
  for each row execute procedure public.set_music_queue_updated_at();
