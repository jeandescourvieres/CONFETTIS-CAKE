-- Ajoute le champ "race" sur les contacts animaux
alter table public.contacts
  add column if not exists breed text;

notify pgrst, 'reload schema';
