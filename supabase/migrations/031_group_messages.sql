-- ═══════════════════════════════════════════════
--  031 — Co-signature de messages (partage de groupe)
-- ═══════════════════════════════════════════════

-- Table principale — un "groupe de co-signature" par message
create table if not exists group_messages (
  id           uuid        primary key default gen_random_uuid(),
  message_id   uuid        not null references messages(id) on delete cascade,
  user_id      uuid        not null references auth.users(id) on delete cascade,
  share_token  uuid        not null default gen_random_uuid() unique,
  label        text        not null default 'De la part de nous tous',
  contact_name text        not null default '',
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now()
);

alter table group_messages enable row level security;

-- Propriétaire : lecture/écriture complète
create policy "owner manages group_messages" on group_messages
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Public : lecture par token (sans auth, pour la page de co-signature)
create policy "public read group_messages by token" on group_messages
  for select using (is_active = true);

-- Signatures collectées
create table if not exists group_signatures (
  id               uuid        primary key default gen_random_uuid(),
  group_message_id uuid        not null references group_messages(id) on delete cascade,
  signer_name      text        not null,
  signer_note      text,
  created_at       timestamptz not null default now()
);

alter table group_signatures enable row level security;

-- Propriétaire du groupe peut lire toutes les signatures
create policy "owner reads group_signatures" on group_signatures
  for select using (
    exists (
      select 1 from group_messages gm
      where gm.id = group_message_id and gm.user_id = auth.uid()
    )
  );

-- N'importe qui peut signer (avec anon key)
create policy "anyone can sign" on group_signatures
  for insert with check (true);
