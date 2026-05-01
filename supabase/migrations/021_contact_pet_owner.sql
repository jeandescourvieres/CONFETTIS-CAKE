-- ════════════════════════════════════════════════════════════
--  021_contact_pet_owner.sql
--  Ajoute le champ "animal de qui ?" sur les contacts de type pet
-- ════════════════════════════════════════════════════════════

alter table public.contacts
  add column if not exists pet_owner_name text;
