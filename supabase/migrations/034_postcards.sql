-- ═══════════════════════════════════════════════
--  034 — Commandes de cartes postales physiques
-- ═══════════════════════════════════════════════

create table if not exists postcards (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references auth.users(id) on delete cascade,
  contact_id       uuid        references contacts(id) on delete set null,

  -- Contenu
  message          text        not null,
  sender_name      text        not null default '',

  -- Destinataire
  recipient_name   text        not null,
  recipient_line1  text        not null,
  recipient_line2  text,
  recipient_city   text        not null,
  recipient_zip    text        not null,
  recipient_country text       not null default 'FR',

  -- Statut commande
  status           text        not null default 'pending'
                   check (status in ('pending','processing','shipped','delivered','failed')),
  gelato_order_id  text,
  price_cents      int         not null default 349,   -- 3,49 € TTC

  created_at       timestamptz not null default now()
);

alter table postcards enable row level security;

create policy "users manage own postcards" on postcards
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
