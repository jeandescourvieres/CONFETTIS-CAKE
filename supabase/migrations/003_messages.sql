-- ═══════════════════════════════════════════════
--  003 — Messages générés par l'IA
-- ═══════════════════════════════════════════════

do $$ begin
  create type message_format as enum ('song', 'poem', 'message', 'joke');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type message_tone as enum ('humorous', 'touching', 'poetic', 'playful', 'professional');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type message_status as enum ('draft', 'sent');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type sent_via_type as enum ('sms', 'email', 'whatsapp', 'copy');
exception when duplicate_object then null;
end $$;

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  contact_id  uuid not null references public.contacts(id) on delete cascade,
  content     text not null,
  format      message_format not null,
  tone        message_tone not null,
  relation    relation_type not null,
  memories    text,
  status      message_status not null default 'draft',
  sent_at     timestamptz,
  sent_via    sent_via_type,
  reaction    text,
  created_at  timestamptz not null default now()
);

create index if not exists messages_user_id_idx on public.messages(user_id);
create index if not exists messages_contact_id_idx on public.messages(contact_id);

alter table public.messages enable row level security;

drop policy if exists "messages: toutes opérations propres" on public.messages;
create policy "messages: toutes opérations propres"
  on public.messages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
