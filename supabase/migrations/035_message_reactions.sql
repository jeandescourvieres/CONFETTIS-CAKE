-- ═══════════════════════════════════════════════
--  035 — Réactions aux messages
-- ═══════════════════════════════════════════════

create table if not exists message_reactions (
  id          uuid        primary key default gen_random_uuid(),
  message_id  uuid        not null references messages(id) on delete cascade,
  emoji       text        not null check (emoji in ('❤️','😂','😍','🙏','😭','🎉')),
  note        text,                    -- message court optionnel (max 200 chars)
  created_at  timestamptz not null default now()
);

-- index pour récupérer les réactions d'un message rapidement
create index if not exists message_reactions_message_id_idx on message_reactions(message_id);

-- RLS : lecture libre (page publique) + insert libre (sans compte requis)
alter table message_reactions enable row level security;

create policy "reactions: lecture libre" on message_reactions
  for select using (true);

create policy "reactions: insert libre" on message_reactions
  for insert with check (true);
