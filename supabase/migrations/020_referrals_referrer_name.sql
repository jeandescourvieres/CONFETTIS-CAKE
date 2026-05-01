-- ════════════════════════════════════════════════════════════
--  020_referrals_referrer_name.sql
--  - Ajoute referrer_name pour mémoriser le prénom du parrain
--  - Politique RLS permettant au filleul de lire sa propre ligne
-- ════════════════════════════════════════════════════════════

alter table public.referrals
  add column if not exists referrer_name text;

-- Le filleul peut lire la ligne où il apparaît comme referee
drop policy if exists "referrals_select_referee" on public.referrals;
create policy "referrals_select_referee" on public.referrals
  for select using (auth.uid() = referee_id);
