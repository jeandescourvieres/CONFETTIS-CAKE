-- ═══════════════════════════════════════════════
--  032 — Mode couple (partage de contacts entre 2 comptes)
-- ═══════════════════════════════════════════════

create table if not exists couple_links (
  id          uuid        primary key default gen_random_uuid(),
  user_a      uuid        not null references auth.users(id) on delete cascade,
  user_b      uuid        references auth.users(id) on delete set null,
  status      text        not null default 'pending'
                check (status in ('pending', 'active', 'ended')),
  -- Code court (6 lettres majuscules) partagé hors-bande
  invite_code text        not null unique
                default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  created_at  timestamptz not null default now(),
  linked_at   timestamptz
);

alter table couple_links enable row level security;

-- Lecture : liens dont on est user_a ou user_b, plus les invitations en attente
-- (le code étant non-devinable, c'est suffisant)
create policy "view couple links" on couple_links
  for select using (
    auth.uid() = user_a
    or auth.uid() = user_b
    or status = 'pending'
  );

-- Création : uniquement user_a
create policy "create couple link" on couple_links
  for insert with check (auth.uid() = user_a and user_b is null);

-- Mise à jour : user_a peut tout modifier ; n'importe qui peut accepter une invitation en attente
create policy "update couple link" on couple_links
  for update using (
    auth.uid() = user_a
    or (status = 'pending' and user_b is null)
  );

-- Suppression : uniquement user_a
create policy "delete couple link" on couple_links
  for delete using (auth.uid() = user_a);

-- ── Contacts du/de la partenaire — lecture seule ─────────────────────────────

-- Ajoute une politique SELECT sur contacts pour accéder aux contacts du partenaire.
-- La politique existante "contacts: toutes opérations propres" (for all) couvre déjà
-- les propres contacts ; cette nouvelle politique (for select) s'y ajoute via OR.
create policy "read partner contacts" on public.contacts
  for select using (
    user_id in (
      select
        case
          when cl.user_a = auth.uid() then cl.user_b
          when cl.user_b = auth.uid() then cl.user_a
        end
      from couple_links cl
      where (cl.user_a = auth.uid() or cl.user_b = auth.uid())
        and cl.status = 'active'
        and cl.user_b is not null
    )
  );
